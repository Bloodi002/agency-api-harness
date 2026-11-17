import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SDK_VERSION } from '@rosteredai/sdk';
import { readConfig } from './lib/config.mjs';
import { loadSpecs } from './lib/specs.mjs';
import { buildCatalogue } from './lib/catalogue.mjs';
import { ClientPool, runOperation } from './lib/runner.mjs';
import { clearedSessionCookie, hasSession, newTester, passwordMatches, sessionCookie, testerCookie, testerOf } from './lib/session.mjs';
import { InboxStore, MAX_DELIVERY_BYTES, REPLY_STATUSES } from './lib/inbox.mjs';
import { runChecks } from './lib/checks.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const config = readConfig(process.env);
const specTexts = loadSpecs(process.env.HARNESS_SPECS_DIR ?? resolve(here, '..', 'openapi'));
const specs = Object.fromEntries(Object.entries(specTexts).map(([api, text]) => [api, JSON.parse(text)]));
const { catalogue, unmatched } = buildCatalogue(specTexts);
const guidePath = process.env.HARNESS_GUIDE ?? resolve(here, '..', 'docs', 'integration-guide.md');
const pool = new ClientPool(config.baseUrl);
const inboxes = new InboxStore();

const MAX_RUN_BYTES = 25 * 1024 * 1024;
const PAGES = { '/': 'index.html', '/login': 'login.html', '/explorer': 'explorer.html', '/checks': 'checks.html', '/inbox': 'inbox.html', '/guide': 'guide.html' };
const ASSETS = { '/harness.css': ['harness.css', 'text/css; charset=utf-8'], '/harness.js': ['harness.js', 'text/javascript; charset=utf-8'] };
const OPEN_PATHS = new Set(['/healthz', '/login', '/harness.css']);

const isSecure = (req) => req.headers['x-forwarded-proto'] === 'https';
const origin = (req) => `${isSecure(req) ? 'https' : 'http'}://${req.headers['x-forwarded-host'] ?? req.headers.host}`;
const failure = (status, message) => Object.assign(new Error(message), { status });

function send(res, status, body, headers = {}) {
  const json = typeof body !== 'string' && !Buffer.isBuffer(body);
  res.writeHead(status, {
    'content-type': json ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8',
    'cache-control': 'no-store',
    ...headers,
  });
  res.end(json ? JSON.stringify(body) : body);
}

function page(res, file) {
  send(res, 200, readFileSync(resolve(here, 'public', file)), { 'content-type': 'text/html; charset=utf-8', 'x-frame-options': 'DENY' });
}

async function readBody(req, limit) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw failure(413, `Request body is over ${limit} bytes`);
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function jsonBody(req, limit = 64 * 1024) {
  const text = (await readBody(req, limit)).toString('utf8');
  try {
    return JSON.parse(text || '{}');
  } catch {
    throw failure(400, 'Body must be JSON');
  }
}

// Only same-site paths, so the login form cannot bounce someone to another site.
function safeNext(next) {
  return next && /^\/(?![/\\])/.test(next) ? next : '/';
}

function operationsOf(api) {
  if (!catalogue[api]) throw failure(400, 'api must be tenant or agency');
  return catalogue[api];
}

// The field schemas stay server-side; the page only needs names, examples and descriptions.
function publicOperation(operation) {
  return { ...operation, fields: operation.fields.map(({ schema, ...field }) => field) };
}

async function login(req, res) {
  const form = new URLSearchParams((await readBody(req, 4096)).toString('utf8'));
  const next = safeNext(form.get('next'));
  if (passwordMatches(form.get('password'), config.password)) {
    return send(res, 303, '', { location: next, 'set-cookie': sessionCookie(config.password, isSecure(req)) });
  }
  return send(res, 303, '', { location: `/login?failed=1&next=${encodeURIComponent(next)}` });
}

async function inboxRoute(req, res, tester, id, action) {
  const method = req.method;
  const missing = () => send(res, 404, { message: 'No such inbox; inboxes are lost when the harness restarts' });
  if (!action && method === 'GET') {
    const found = inboxes.get(tester, id);
    return found ? send(res, 200, { ...found, url: `${origin(req)}/hooks/${id}` }) : missing();
  }
  if (!action && method === 'PATCH') {
    const updated = inboxes.update(tester, id, (await jsonBody(req)).replyStatus);
    return updated ? send(res, 200, updated) : missing();
  }
  if (!action && method === 'DELETE') return inboxes.delete(tester, id) ? send(res, 204, '') : missing();
  if (action === '/clear' && method === 'POST') return inboxes.clear(tester, id) ? send(res, 204, '') : missing();
  if (action === '/verify' && method === 'POST') {
    const { secret } = await jsonBody(req);
    if (!secret) throw failure(400, 'secret is required');
    const results = inboxes.verify(tester, id, secret);
    return results ? send(res, 200, results) : missing();
  }
  return send(res, 405, { message: 'Method not allowed' });
}

async function apiRoute(req, res, tester, path, url) {
  const method = req.method;
  if (path === '/api/config' && method === 'GET') {
    const counts = Object.fromEntries(Object.entries(catalogue).map(([api, ops]) => [api, ops.size]));
    return send(res, 200, { environmentName: config.environmentName, baseUrl: config.baseUrl, sdkVersion: SDK_VERSION, operations: counts, replyStatuses: REPLY_STATUSES, passwordProtected: true });
  }
  if (path === '/api/operations' && method === 'GET') return send(res, 200, [...operationsOf(url.searchParams.get('api')).values()].map(publicOperation));
  if (path === '/api/run' && method === 'POST') {
    const body = await jsonBody(req, MAX_RUN_BYTES);
    const operation = operationsOf(body.api).get(body.id);
    if (!operation) throw failure(404, `No SDK operation ${body.api}.${body.id}`);
    return send(res, 200, await runOperation({ pool, specs, operation, credential: body.credential ?? {}, values: body.values, files: body.files }));
  }
  if (path === '/api/checks' && method === 'POST') {
    const body = await jsonBody(req);
    const scopes = String(body.scopes ?? '').split(/[\s,]+/).filter(Boolean);
    return send(res, 200, await runChecks({ baseUrl: config.baseUrl, api: body.api, clientId: body.clientId, clientSecret: body.clientSecret, scopes }));
  }
  if (path === '/api/inboxes' && method === 'GET') return send(res, 200, inboxes.list(tester).map((i) => ({ ...i, url: `${origin(req)}/hooks/${i.id}` })));
  if (path === '/api/inboxes' && method === 'POST') {
    const body = await jsonBody(req);
    const created = inboxes.create(tester, body.label, body.replyStatus ?? 204);
    return send(res, 201, { ...created, url: `${origin(req)}/hooks/${created.id}` });
  }
  const inbox = path.match(/^\/api\/inboxes\/([\w-]{16})(\/verify|\/clear)?$/);
  if (inbox) return inboxRoute(req, res, tester, inbox[1], inbox[2]);
  return send(res, 404, { message: 'Not found' });
}

async function route(req, res) {
  const url = new URL(req.url ?? '/', 'http://harness');
  const path = url.pathname;
  const method = req.method ?? 'GET';

  if (path === '/healthz') return send(res, 200, 'ok');

  // RosteredAI posts deliveries here, so this path is open; an unknown inbox id is a 404.
  const hook = path.match(/^\/hooks\/([\w-]{16})$/);
  if (hook && method === 'POST') {
    const status = inboxes.receive(hook[1], req.headers, await readBody(req, MAX_DELIVERY_BYTES));
    if (status === undefined) return send(res, 404, { message: 'No such inbox' });
    return send(res, status, status === 204 ? '' : { message: `QA harness inbox answered ${status}` });
  }

  if (path === '/login' && method === 'POST') return login(req, res);
  if (path === '/logout' && method === 'POST') return send(res, 303, '', { location: '/login', 'set-cookie': clearedSessionCookie() });

  if (!OPEN_PATHS.has(path) && !hasSession(req.headers.cookie, config.password)) {
    if (method === 'GET' && PAGES[path]) return send(res, 303, '', { location: `/login?next=${encodeURIComponent(path + url.search)}` });
    return send(res, 401, { message: 'Sign in to the QA harness first' });
  }

  // Each browser is one tester: its inboxes are its own, while its credentials stay in its tabs.
  let tester = testerOf(req.headers.cookie);
  if (!tester) {
    tester = newTester();
    res.setHeader('set-cookie', testerCookie(tester, isSecure(req)));
  }

  if (method === 'GET' && PAGES[path]) return page(res, PAGES[path]);
  if (method === 'GET' && ASSETS[path]) {
    const [file, type] = ASSETS[path];
    return send(res, 200, readFileSync(resolve(here, 'public', file)), { 'content-type': type, 'cache-control': 'no-cache' });
  }
  if (path === '/guide.md' && method === 'GET') return send(res, 200, readFileSync(guidePath), { 'content-type': 'text/markdown; charset=utf-8' });
  if (path.startsWith('/api/')) return apiRoute(req, res, tester, path, url);
  return send(res, 404, { message: 'Not found' });
}

if (unmatched.length) console.warn(`SDK and spec disagree; these are not in the explorer: ${unmatched.join(', ')}`);

createServer((req, res) => {
  route(req, res).catch((error) => {
    if (!error.status) console.error(error);
    if (!res.headersSent) send(res, error.status ?? 500, { message: error.status ? error.message : 'QA harness error; see its log' });
  });
}).listen(config.port, () => {
  console.log(`QA harness on :${config.port} using @rosteredai/sdk ${SDK_VERSION} against ${config.environmentName} ${config.baseUrl}`);
});
