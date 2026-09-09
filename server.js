'use strict';

// Agency API Harness — a hosted Swagger/Postman for the RosteredAI Agency Partner API.
//
// The browser only ever talks to this server (same origin), so there is no CORS to configure on
// the gateway. Every API call is proxied server-to-server to the gateway, and webhooks are received,
// signature-checked and streamed to the page live.
//
// Configuration is entirely by environment variable so nothing is baked in:
//   PORT            the port to listen on (the host sets this)
//   GATEWAY_BASE    the public gateway origin, e.g. https://apidev.rostered.ai
//   API_PREFIX      the gateway path prefix that routes to Partners (default: /partners)
//   WEBHOOK_SECRET  the endpoint's signing secret (whsec_...), so deliveries can be verified
//   SIG_TOLERANCE   max age in seconds of a signed webhook before it is treated as stale (default 300)

const http = require('http');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 4000);
const GATEWAY_BASE = (process.env.GATEWAY_BASE || 'http://localhost:7000').replace(/\/+$/, '');
const API_PREFIX = process.env.API_PREFIX ?? '/partners';
const TOLERANCE = Number(process.env.SIG_TOLERANCE || 300);
let WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';

const PUBLIC_DIR = path.join(__dirname, 'public');

// ── received webhook feed ────────────────────────────────────────────────────
const received = [];
const seenEventIds = new Set();
const sseClients = new Set();

const pushEvent = (entry) => {
  received.unshift(entry);
  received.splice(200);
  const frame = `data: ${JSON.stringify(entry)}\n\n`;
  for (const res of sseClients) {
    try { res.write(frame); } catch { sseClients.delete(res); }
  }
};

// t=<unix>,v1=<hex>. Anything else is not a signature this version can check.
const parseSignature = (header) => {
  const parts = Object.fromEntries(
    String(header || '')
      .split(',')
      .map((p) => p.split('='))
      .filter((pair) => pair.length === 2)
      .map(([k, v]) => [k.trim(), v.trim()]),
  );
  return parts.t && parts.v1 ? { timestamp: parts.t, signature: parts.v1 } : null;
};

// Sign the exact bytes received; the timestamp is bound inside the signed string.
const verify = (rawBody, header) => {
  if (!WEBHOOK_SECRET) return { ok: false, reason: 'no secret configured on the harness' };
  const parsed = parseSignature(header);
  if (!parsed) return { ok: false, reason: 'missing or malformed signature header' };

  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(parsed.timestamp));
  if (Number.isNaN(age) || age > TOLERANCE) return { ok: false, reason: `timestamp outside ${TOLERANCE}s tolerance` };

  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(`${parsed.timestamp}.${rawBody}`)
    .digest('hex');

  const a = Buffer.from(expected);
  const b = Buffer.from(parsed.signature);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  return { ok, reason: ok ? null : 'signature mismatch' };
};

// ── small helpers ────────────────────────────────────────────────────────────
const readBody = (req) =>
  new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', () => resolve(Buffer.alloc(0)));
  });

const json = (res, code, obj) => {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'content-type': 'application/json', 'access-control-allow-origin': '*' });
  res.end(body);
};

// Forward a request to the gateway (server-to-server; no browser CORS involved).
const forward = ({ method, gatewayPath, headers, body }) =>
  new Promise((resolve) => {
    const target = new URL(GATEWAY_BASE + gatewayPath);
    const agent = target.protocol === 'https:' ? https : http;
    const req = agent.request(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || (target.protocol === 'https:' ? 443 : 80),
        path: target.pathname + target.search,
        method,
        headers,
      },
      (r) => {
        const parts = [];
        r.on('data', (c) => parts.push(c));
        r.on('end', () => resolve({ status: r.statusCode || 502, headers: r.headers, body: Buffer.concat(parts) }));
      },
    );
    req.on('error', (e) => resolve({ status: 502, headers: { 'content-type': 'application/json' }, body: Buffer.from(JSON.stringify({ error: 'gateway_unreachable', detail: e.message })) }));
    if (body && body.length) req.write(body);
    req.end();
  });

// ── static file serving ──────────────────────────────────────────────────────
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

const serveStatic = (res, urlPath) => {
  const rel = urlPath === '/' ? '/index.html' : urlPath;
  const file = path.join(PUBLIC_DIR, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(PUBLIC_DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end('Not found');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
};

// ── request router ───────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = (req.url || '/').split('?')[0];

  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type,authorization', 'access-control-allow-methods': 'GET,POST,PUT,DELETE,PATCH' }).end();
    return;
  }

  // Runtime config the page reads, so the UI knows the gateway and whether a secret is set.
  if (req.method === 'GET' && url === '/config') {
    return json(res, 200, { gatewayBase: GATEWAY_BASE, apiPrefix: API_PREFIX, webhookSecretConfigured: Boolean(WEBHOOK_SECRET), tolerance: TOLERANCE });
  }

  if (req.method === 'GET' && url === '/health') return json(res, 200, { ok: true, received: received.length });

  // Exchange client credentials for a scoped token. The secret is forwarded, never logged or stored.
  if (req.method === 'POST' && url === '/token') {
    const raw = (await readBody(req)).toString('utf8');
    let creds = {};
    try { creds = JSON.parse(raw); } catch { creds = {}; }
    const form = new URLSearchParams({ grant_type: 'client_credentials', client_id: creds.clientId || '', client_secret: creds.clientSecret || '' }).toString();
    const out = await forward({
      method: 'POST',
      gatewayPath: `${API_PREFIX}/agency/apis/token`,
      headers: { 'content-type': 'application/x-www-form-urlencoded', 'content-length': Buffer.byteLength(form) },
      body: Buffer.from(form),
    });
    res.writeHead(out.status, { 'content-type': out.headers['content-type'] || 'application/json', 'access-control-allow-origin': '*' });
    res.end(out.body);
    return;
  }

  // Set the webhook signing secret at runtime, so it never has to sit in a URL or the page source.
  if (req.method === 'POST' && url === '/set-secret') {
    const raw = (await readBody(req)).toString('utf8');
    try { WEBHOOK_SECRET = JSON.parse(raw).secret || WEBHOOK_SECRET; } catch { /* keep current */ }
    return json(res, 200, { webhookSecretConfigured: Boolean(WEBHOOK_SECRET) });
  }

  // The live feed of received deliveries.
  if (req.method === 'GET' && url === '/received') return json(res, 200, received);
  if (req.method === 'POST' && url === '/reset') { received.length = 0; seenEventIds.clear(); return json(res, 200, { cleared: true }); }
  if (req.method === 'GET' && url === '/events') {
    res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive', 'access-control-allow-origin': '*' });
    res.write(': connected\n\n');
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // Proxy every API call to the gateway with the caller's bearer token.
  if (url.startsWith('/api/')) {
    const body = await readBody(req);
    const gatewayPath = API_PREFIX + url.slice('/api'.length) + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
    const headers = { 'content-type': req.headers['content-type'] || 'application/json' };
    if (req.headers.authorization) headers.authorization = req.headers.authorization;
    if (body.length) headers['content-length'] = body.length;
    const out = await forward({ method: req.method, gatewayPath, headers, body });
    const passHeaders = { 'access-control-allow-origin': '*' };
    if (out.headers['content-type']) passHeaders['content-type'] = out.headers['content-type'];
    res.writeHead(out.status, passHeaders);
    res.end(out.body);
    return;
  }

  // Any POST that is not one of ours is treated as an inbound webhook delivery.
  if (req.method === 'POST') {
    const raw = (await readBody(req)).toString('utf8');
    const verdict = verify(raw, req.headers['x-rosteredai-signature']);
    let parsed = null;
    try { parsed = JSON.parse(raw); } catch { /* shown raw */ }
    const eventId = req.headers['x-rosteredai-event-id'];
    const entry = {
      at: new Date().toISOString(),
      path: url,
      eventType: req.headers['x-rosteredai-event-type'] || parsed?.eventType || 'unknown',
      eventId,
      deliveryId: req.headers['x-rosteredai-delivery-id'],
      apiVersion: req.headers['x-rosteredai-api-version'],
      valid: verdict.ok,
      reason: verdict.reason || null,
      duplicate: verdict.ok && Boolean(eventId) && seenEventIds.has(eventId),
      data: parsed?.data ?? parsed ?? null,
      raw,
    };
    pushEvent(entry);
    if (!verdict.ok) { res.writeHead(401).end('signature rejected'); return; } // 401 is retried
    if (eventId) seenEventIds.add(eventId);
    res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ received: true }));
    return;
  }

  // Everything else is the static UI.
  serveStatic(res, url);
});

server.listen(PORT, () => {
  console.log(`Agency API Harness listening on :${PORT}`);
  console.log(`  gateway   ${GATEWAY_BASE}${API_PREFIX}`);
  console.log(`  webhooks  ${WEBHOOK_SECRET ? 'secret set' : 'no secret yet — set it in the UI'}`);
});
