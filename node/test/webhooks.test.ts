import assert from 'node:assert/strict';
import { test } from 'node:test';
import { WebhookHeaders, WebhookSignatureError, Webhooks } from '../src/index.js';

const SECRET = 'whsec_test_secret';
const T = 1700000000;
const BODY = '{"eventId":"evt_1","eventType":"webhook.test","occurredAt":"2026-11-03T00:00:00Z","data":{}}';
const V1 = '87638a300708c328292ab1e84f295e07e359253db60ea214b3542ef7001c9094';
const HEADER = `t=${T},v1=${V1}`;
const AT_T = new Date(T * 1000);

const rejects = (fn: () => unknown): void => assert.throws(fn, WebhookSignatureError);

test('shared test vector verifies and parses the event', () => {
  const event = Webhooks.verify(BODY, HEADER, SECRET, 300, AT_T);
  assert.deepEqual(event, { eventId: 'evt_1', eventType: 'webhook.test', occurredAt: '2026-11-03T00:00:00Z', data: {} });
  assert.ok(Webhooks.verify(Buffer.from(BODY, 'utf8'), HEADER, SECRET, 300, AT_T));
});

test('generateSignatureHeader reproduces the shared vector', () => {
  assert.equal(Webhooks.generateSignatureHeader(SECRET, BODY, T), HEADER);
});

test('a tampered body is rejected', () => rejects(() => Webhooks.verify(BODY.replace('evt_1', 'evt_2'), HEADER, SECRET, 300, AT_T)));

test('a wrong secret is rejected', () => rejects(() => Webhooks.verify(BODY, HEADER, 'whsec_other', 300, AT_T)));

test('the whsec_ prefix is part of the key', () => rejects(() => Webhooks.verify(BODY, HEADER, 'test_secret', 300, AT_T)));

test('a stale timestamp is rejected', () => {
  assert.ok(Webhooks.verify(BODY, HEADER, SECRET, 300, new Date((T + 300) * 1000)));
  rejects(() => Webhooks.verify(BODY, HEADER, SECRET, 300, new Date((T + 301) * 1000)));
});

test('a future timestamp is rejected', () => {
  assert.ok(Webhooks.verify(BODY, HEADER, SECRET, 300, new Date((T - 300) * 1000)));
  rejects(() => Webhooks.verify(BODY, HEADER, SECRET, 300, new Date((T - 301) * 1000)));
});

test('any one of several v1 values is enough', () => {
  const other = 'ab'.repeat(32);
  assert.ok(Webhooks.verify(BODY, `t=${T},v1=${other},v1=${V1}`, SECRET, 300, AT_T));
  assert.ok(Webhooks.verify(BODY, `t=${T}, v1=${V1}, v1=${other}`, SECRET, 300, AT_T));
  rejects(() => Webhooks.verify(BODY, `t=${T},v1=${other},v1=${'cd'.repeat(32)}`, SECRET, 300, AT_T));
});

test('missing or malformed headers are rejected', () => {
  const headers = [undefined, null, '', 'garbage', `v1=${V1}`, `t=${T}`, `t=abc,v1=${V1}`, `t=${T},v1=xyz`, `t=${T},v1=${V1.slice(1)}`, `t=${T},,v1=${V1}`];
  for (const header of headers) rejects(() => Webhooks.verify(BODY, header, SECRET, 300, AT_T));
});

test('header name constants match the documented names', () => {
  assert.deepEqual(Object.values(WebhookHeaders), [
    'X-RosteredAI-Signature',
    'X-RosteredAI-Event-Id',
    'X-RosteredAI-Delivery-Id',
    'X-RosteredAI-Event-Type',
    'X-RosteredAI-Api-Version',
  ]);
});
