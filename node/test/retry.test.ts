import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ApiError } from '../src/index.js';
import { backoffDelayMs, retryAfterMs } from '../src/retry.js';
import { FakeFetch, client, json, ok, TENANT_ID } from './fake-fetch.js';

test('429 honours Retry-After seconds and then succeeds', async () => {
  const fake = new FakeFetch().queue(() => json(429, { message: 'Slow down' }, { 'Retry-After': '1' }), ok);
  const started = Date.now();
  const response = await client(fake).tenant.organisationLocations.tenantGetTenant({ id: TENANT_ID });
  assert.equal(response.message, 'OK');
  assert.ok(Date.now() - started >= 950, 'waited for Retry-After');
  assert.equal(fake.apiRequests.length, 2);
});

test('503 is retried with backoff', async () => {
  const fake = new FakeFetch().queue(() => json(503, { message: 'Busy' }), () => json(503, { message: 'Busy' }), ok);
  const response = await client(fake).tenant.organisationLocations.tenantGetTenant({ id: TENANT_ID });
  assert.equal(response.message, 'OK');
  assert.equal(fake.apiRequests.length, 3);
});

test('network errors on GET are retried', async () => {
  const fake = new FakeFetch().queue(() => {
    throw new TypeError('fetch failed');
  }, ok);
  await client(fake).tenant.organisationLocations.tenantGetTenant({ id: TENANT_ID });
  assert.equal(fake.apiRequests.length, 2);
});

test('retries stop at maxRetries and surface the last ApiError', async () => {
  const fake = new FakeFetch().queue(() => json(502, { message: 'Bad gateway' }), () => json(502, { message: 'Bad gateway' }));
  const call = client(fake, { maxRetries: 1 }).tenant.organisationLocations.tenantGetTenant({ id: TENANT_ID });
  await assert.rejects(call, (error: unknown) => {
    assert.ok(error instanceof ApiError);
    assert.equal(error.status, 502);
    return true;
  });
  assert.equal(fake.apiRequests.length, 2);
});

test('POST is never retried', async () => {
  const fake = new FakeFetch().queue(() => json(503, { message: 'Busy' }));
  await assert.rejects(client(fake).agency.skills.agencySkills({ agencySkillsRequest: {} }), ApiError);
  assert.equal(fake.apiRequests.length, 1);

  const network = new FakeFetch().queue(() => {
    throw new TypeError('fetch failed');
  });
  await assert.rejects(client(network).agency.skills.agencySkills({ agencySkillsRequest: {} }), TypeError);
  assert.equal(network.apiRequests.length, 1);
});

test('ApiError carries status, envelope message and raw body', async () => {
  const body = { data: null, message: 'Location name is required.' };
  const fake = new FakeFetch().queue(() => json(400, body));
  await assert.rejects(client(fake).tenant.organisationLocations.tenantGetTenant({ id: TENANT_ID }), (error: unknown) => {
    assert.ok(error instanceof ApiError);
    assert.equal(error.status, 400);
    assert.equal(error.message, 'Location name is required.');
    assert.equal(error.body, JSON.stringify(body));
    return true;
  });
});

test('ApiError falls back to the status when the body has no envelope', async () => {
  const fake = new FakeFetch().queue(() => new Response('<html>nope</html>', { status: 404 }));
  await assert.rejects(client(fake).tenant.organisationLocations.tenantGetTenant({ id: TENANT_ID }), (error: unknown) => {
    assert.ok(error instanceof ApiError);
    assert.equal(error.message, 'HTTP 404');
    assert.equal(error.body, '<html>nope</html>');
    return true;
  });
});

test('Retry-After parses seconds and HTTP dates', () => {
  const now = Date.parse('2026-11-03T00:00:00Z');
  assert.equal(retryAfterMs('5', now), 5000);
  assert.equal(retryAfterMs('Tue, 03 Nov 2026 00:00:10 GMT', now), 10_000);
  assert.equal(retryAfterMs('Mon, 02 Nov 2026 00:00:00 GMT', now), 0);
  assert.equal(retryAfterMs(null, now), undefined);
  assert.equal(retryAfterMs('soon', now), undefined);
});

test('backoff is 0.5 s * 2^attempt with jitter, capped at 8 s', () => {
  assert.equal(backoffDelayMs(0, () => 1), 500);
  assert.equal(backoffDelayMs(0, () => 0), 250);
  assert.equal(backoffDelayMs(3, () => 1), 4000);
  assert.equal(backoffDelayMs(10, () => 1), 8000);
});
