import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ApiError, AuthenticationError } from '../src/index.js';
import { FakeFetch, client, json, ok, TENANT_ID, TOKEN_URL } from './fake-fetch.js';

test('token request is form-encoded client credentials with space-joined scopes', async () => {
  const fake = new FakeFetch();
  await client(fake, { scopes: ['staff.read', 'rosters.read'] }).getAccessToken();
  const [request] = fake.requests;
  assert.equal(request?.url, TOKEN_URL);
  assert.equal(request?.method, 'POST');
  assert.equal(request?.headers.get('content-type'), 'application/x-www-form-urlencoded');
  const form = new URLSearchParams(request?.body);
  assert.equal(form.get('grant_type'), 'client_credentials');
  assert.equal(form.get('client_id'), 'client-1');
  assert.equal(form.get('client_secret'), 'secret-1');
  assert.equal(form.get('scope'), 'staff.read rosters.read');
});

test('scope is omitted when no scopes are given', async () => {
  const fake = new FakeFetch();
  await client(fake).getAccessToken();
  assert.equal(new URLSearchParams(fake.requests[0]?.body).has('scope'), false);
});

test('token is cached and reused across calls', async () => {
  const fake = new FakeFetch().queue(ok, ok, ok);
  const sdk = client(fake);
  for (let i = 0; i < 3; i++) await sdk.tenant.organisationLocations.tenantGetTenant({ id: TENANT_ID });
  assert.equal(fake.tokenCount, 1);
  assert.deepEqual(
    fake.apiRequests.map((r) => r.headers.get('authorization')),
    ['Bearer tok-1', 'Bearer tok-1', 'Bearer tok-1'],
  );
});

test('token is refreshed once it is within 60 s of expiry', async (t) => {
  const fake = new FakeFetch();
  const sdk = client(fake);
  const realNow = Date.now;
  t.after(() => {
    Date.now = realNow;
  });
  assert.equal(await sdk.getAccessToken(), 'tok-1');
  // expires_in 3600 leaves the cache good for 3540 s.
  Date.now = () => realNow() + 3_539_000;
  assert.equal(await sdk.getAccessToken(), 'tok-1');
  Date.now = () => realNow() + 3_541_000;
  assert.equal(await sdk.getAccessToken(), 'tok-2');
  assert.equal(fake.tokenCount, 2);
});

test('concurrent callers share one token fetch', async () => {
  const fake = new FakeFetch();
  const inner = fake.token;
  let release: () => void = () => undefined;
  const gate = new Promise<void>((resolve) => (release = resolve));
  fake.token = async (request) => {
    await gate;
    return inner(request);
  };
  const sdk = client(fake).tenant.organisationLocations;
  fake.queue(ok, ok, ok, ok, ok);
  const pending = Promise.all(Array.from({ length: 5 }, () => sdk.tenantGetTenant({ id: TENANT_ID })));
  // Hold the token response until every caller is waiting on it.
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(fake.requests.length, 1);
  release();
  await pending;
  assert.equal(fake.tokenCount, 1);
  assert.equal(fake.apiRequests.length, 5);
});

test('a token refusal maps to AuthenticationError with code and description', async () => {
  for (const status of [400, 401]) {
    const fake = new FakeFetch();
    fake.token = () => json(status, { error: 'invalid_client', error_description: 'Unknown client.' });
    const sdk = client(fake);
    await assert.rejects(sdk.getAccessToken(), (error: unknown) => {
      assert.ok(error instanceof AuthenticationError);
      assert.equal(error.code, 'invalid_client');
      assert.equal(error.description, 'Unknown client.');
      assert.equal(error.status, status);
      return true;
    });
    // Surfaces unwrapped through a generated call too.
    await assert.rejects(sdk.tenant.organisationLocations.tenantGetTenant({ id: TENANT_ID }), AuthenticationError);
  }
});

test('a failed token fetch is not cached', async () => {
  const fake = new FakeFetch();
  const inner = fake.token;
  let first = true;
  fake.token = (request) => {
    if (first) {
      first = false;
      return json(500, { message: 'boom' });
    }
    return inner(request);
  };
  const sdk = client(fake);
  await assert.rejects(sdk.getAccessToken(), ApiError);
  assert.equal(await sdk.getAccessToken(), 'tok-1');
});

test('an API 401 drops the token, fetches a new one and retries once', async () => {
  const fake = new FakeFetch().queue(() => json(401, { message: 'Token revoked' }), ok);
  const response = await client(fake).tenant.organisationLocations.tenantGetTenant({ id: TENANT_ID });
  assert.equal(response.data?.tenantId, TENANT_ID);
  assert.equal(fake.tokenCount, 2);
  assert.deepEqual(
    fake.apiRequests.map((r) => r.headers.get('authorization')),
    ['Bearer tok-1', 'Bearer tok-2'],
  );
});

test('a second 401 surfaces as ApiError without another retry', async () => {
  const fake = new FakeFetch().queue(
    () => json(401, { message: 'Token revoked' }),
    () => json(401, { message: 'Token revoked' }),
  );
  await assert.rejects(client(fake).agency.skills.agencySkills({ agencySkillsRequest: {} }), (error: unknown) => {
    assert.ok(error instanceof ApiError);
    assert.equal(error.status, 401);
    assert.equal(error.message, 'Token revoked');
    return true;
  });
  assert.equal(fake.apiRequests.length, 2);
  assert.equal(fake.tokenCount, 2);
});
