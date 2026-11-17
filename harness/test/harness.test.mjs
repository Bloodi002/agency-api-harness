import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Webhooks } from '@rosteredai/sdk';
import { readConfig } from '../lib/config.mjs';
import { loadSpecs } from '../lib/specs.mjs';
import { buildCatalogue, reviveDates } from '../lib/catalogue.mjs';
import { ClientPool, runOperation } from '../lib/runner.mjs';
import { hasSession, sessionCookie, passwordMatches } from '../lib/session.mjs';
import { InboxStore } from '../lib/inbox.mjs';
import { runChecks } from '../lib/checks.mjs';

test('config needs one base URL and trims it', () => {
  assert.equal(readConfig({ ROSTEREDAI_BASE_URL: 'http://10.0.0.1:8081/', HARNESS_PASSWORD: 'pw' }).baseUrl, 'http://10.0.0.1:8081');
  assert.equal(readConfig({ ROSTEREDAI_BASE_URL: 'http://10.0.0.1:8081', HARNESS_PASSWORD: 'pw' }).environmentName, 'SIT');
  assert.throws(() => readConfig({}), /ROSTEREDAI_BASE_URL/);
});

test('config refuses to start without a harness password', () => {
  assert.throws(() => readConfig({ ROSTEREDAI_BASE_URL: 'http://10.0.0.1:8081' }), /HARNESS_PASSWORD/);
  assert.throws(() => readConfig({ ROSTEREDAI_BASE_URL: 'http://10.0.0.1:8081', HARNESS_PASSWORD: '' }), /HARNESS_PASSWORD/);
});

const specTexts = loadSpecs(fileURLToPath(new URL('../../openapi', import.meta.url)));
const specs = Object.fromEntries(Object.entries(specTexts).map(([api, text]) => [api, JSON.parse(text)]));
const { catalogue, unmatched } = buildCatalogue(specTexts);

test('every spec operation has an SDK method in the explorer, except the token exchange', () => {
  assert.deepEqual(unmatched, []);
  const count = (api) => Object.values(specs[api].paths).flatMap((item) => Object.values(item)).filter((op) => op.operationId).length - 1;
  assert.equal(catalogue.tenant.size, count('tenant'));
  assert.equal(catalogue.agency.size, count('agency'));
  assert.ok([...catalogue.tenant.values(), ...catalogue.agency.values()].every((o) => !o.path.endsWith('/integrations/token')));
});

test('dates become Date objects only where the spec says so', () => {
  const spec = { components: { schemas: { S: { type: 'object', properties: { at: { type: 'string', format: 'date-time' }, note: { type: 'string' }, days: { type: 'array', items: { type: 'string', format: 'date' } } } } } } };
  const revived = reviveDates(spec, { $ref: '#/components/schemas/S' }, { at: '2026-11-04T01:02:03', note: '2026-11-04', days: ['2026-11-05'] });
  assert.equal(revived.at.toISOString(), '2026-11-04T01:02:03.000Z');
  assert.equal(revived.note, '2026-11-04');
  assert.ok(revived.days[0] instanceof Date);
  assert.throws(() => reviveDates(spec, spec.components.schemas.S.properties.at, 'yesterday'), /not a valid/);
});

test('the session cookie is accepted only for the configured password', () => {
  const cookie = sessionCookie('pw-1', true).split(';')[0];
  assert.ok(hasSession(`other=1; ${cookie}`, 'pw-1'));
  assert.ok(!hasSession(cookie, 'pw-2'));
  assert.ok(!hasSession('', 'pw-1'));
  assert.ok(!hasSession('', ''));
  assert.ok(passwordMatches('pw-1', 'pw-1'));
  assert.ok(!passwordMatches(null, 'pw-1'));
});

test('an inbox stores deliveries and verifies them as of arrival', () => {
  const store = new InboxStore();
  const inbox = store.create('tester-a', 'qa', 410);
  const body = '{"eventId":"e1","eventType":"webhook.test","occurredAt":"2026-11-04T00:00:00Z","data":{}}';
  const arrived = new Date('2026-11-04T00:00:10Z');
  const header = Webhooks.generateSignatureHeader('whsec_abc', body, Math.floor(arrived.getTime() / 1000));
  assert.equal(store.receive(inbox.id, { 'x-rosteredai-signature': header, cookie: 'dropped' }, Buffer.from(body), arrived), 410);
  assert.equal(store.receive('missing-inbox-id', {}, Buffer.from(body)), undefined);
  assert.deepEqual(Object.keys(store.get('tester-a', inbox.id).deliveries[0].headers), ['x-rosteredai-signature']);
  assert.equal(store.verify('tester-a', inbox.id, 'whsec_abc')[0].valid, true);
  assert.equal(store.verify('tester-a', inbox.id, 'whsec_wrong')[0].valid, false);
  assert.throws(() => store.update('tester-a', inbox.id, 302), /Reply status/);
});

test('each tester sees and changes only their own inboxes', () => {
  const store = new InboxStore();
  const mine = store.create('tester-a', 'company A');
  const theirs = store.create('tester-b', 'company B');
  assert.deepEqual(store.list('tester-a').map((i) => i.id), [mine.id]);
  assert.deepEqual(store.list('tester-b').map((i) => i.id), [theirs.id]);
  assert.equal(store.get('tester-a', theirs.id), undefined);
  assert.equal(store.update('tester-a', theirs.id, 500), undefined);
  assert.equal(store.clear('tester-a', theirs.id), false);
  assert.equal(store.delete('tester-a', theirs.id), false);
  assert.equal(store.verify('tester-a', theirs.id, 'whsec_abc'), undefined);
  assert.equal(store.receive(theirs.id, {}, Buffer.from('{}')), 204);
  assert.equal(store.get('tester-b', theirs.id).deliveryCount, 1);
});

const jwt = (claims) => ['{"alg":"none"}', JSON.stringify(claims), 'sig'].map((p) => Buffer.from(p).toString('base64url')).join('.');

// A gateway stand-in: one tenant credential holding organisation.read, locations.read and webhooks.read.
function fakeGateway() {
  return async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input.url);
    const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
    if (url.pathname === '/user/api/integrations/token') {
      const form = new URLSearchParams(String(init.body));
      if (form.get('client_secret') !== 'cs_right') return json(401, { error: 'invalid_client', error_description: 'Unknown client or wrong secret.' });
      const scope = form.get('scope') ?? 'organisation.read locations.read webhooks.read';
      const token = jwt({ companyType: 1, TenantId: 't-1', scope: scope.split(' '), exp: Math.floor(Date.now() / 1000) + 3600 });
      return json(200, { access_token: token, token_type: 'Bearer', expires_in: 3600, scope });
    }
    const bearer = new Headers(init.headers).get('authorization')?.slice(7) ?? '';
    const scopes = JSON.parse(Buffer.from(bearer.split('.')[1], 'base64url').toString()).scope;
    if (url.pathname === '/tenant/api/Tenant/get-tenant') {
      return scopes.includes('organisation.read') ? json(200, { data: { tenantId: 't-1', tenantName: 'Kiwi' }, message: 'OK' }) : json(403, { data: null, message: 'Missing scope' });
    }
    if (url.pathname === '/tenant/api/Tenant/get-location') {
      return scopes.includes('locations.read') ? json(200, { data: [], message: 'OK' }) : json(403, { data: null, message: 'Missing scope' });
    }
    if (url.pathname === '/user/api/integrations/webhooks/settings') return json(200, { data: { endpoints: [] }, message: 'OK' });
    return json(404, { data: null, message: 'nope' });
  };
}

test('an explorer run calls the SDK method and logs its HTTP calls', async () => {
  const pool = new ClientPool('https://gw.example', fakeGateway());
  const operation = catalogue.tenant.get('organisationLocations.tenantGetTenant');
  const credential = { clientId: 'rai_1', clientSecret: 'cs_right' };
  const first = await runOperation({ pool, specs, operation, credential, values: { id: 't-1' } });
  assert.equal(first.ok, true);
  assert.equal(first.result.data.tenantName, 'Kiwi');
  assert.deepEqual(first.calls.map((c) => c.path), ['/user/api/integrations/token', '/tenant/api/Tenant/get-tenant']);
  const second = await runOperation({ pool, specs, operation, credential, values: { id: 't-1' } });
  assert.deepEqual(second.calls.map((c) => c.path), ['/tenant/api/Tenant/get-tenant'], 'the pooled client reuses its token');
  const refused = await runOperation({ pool, specs, operation, credential: { ...credential, scopes: ['webhooks.read'] }, values: { id: 't-1' } });
  assert.deepEqual([refused.ok, refused.error.type, refused.error.status], [false, 'ApiError', 403]);
  const missing = await runOperation({ pool, specs, operation, credential, values: {} });
  assert.equal(missing.error.type, 'RequiredError');
});

test('SDK checks pass against a well-behaved gateway', async () => {
  const { results, calls } = await runChecks({ baseUrl: 'https://gw.example', api: 'tenant', clientId: 'rai_1', clientSecret: 'cs_right' }, fakeGateway());
  assert.deepEqual(results.map((r) => [r.outcome, r.detail.slice(0, 40)]).filter(([o]) => o !== 'pass'), []);
  assert.equal(results.length, 8);
  assert.ok(calls.every((c) => !JSON.stringify(c).includes('cs_right')), 'the secret must not appear in the call log');
});

test('SDK checks stop after a refused credential and flag the wrong API', async () => {
  const refused = await runChecks({ baseUrl: 'https://gw.example', api: 'tenant', clientId: 'rai_1', clientSecret: 'cs_bad' }, fakeGateway());
  assert.deepEqual(refused.results.map((r) => r.outcome), ['fail', 'skip']);
  assert.match(refused.results[0].detail, /invalid_client/);
  const wrongApi = await runChecks({ baseUrl: 'https://gw.example', api: 'agency', clientId: 'rai_1', clientSecret: 'cs_right' }, fakeGateway());
  assert.match(wrongApi.results[0].detail, /tenant credential/);
});
