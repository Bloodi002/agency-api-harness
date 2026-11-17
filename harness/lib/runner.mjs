import { AsyncLocalStorage } from 'node:async_hooks';
import { createHash } from 'node:crypto';
import { ApiError, AuthenticationError, RosteredAIClient } from '@rosteredai/sdk';
import { reviveDates } from './catalogue.mjs';

const MAX_CLIENTS = 50;
const IDLE_MS = 30 * 60 * 1000;
const callLog = new AsyncLocalStorage();

// Every SDK request made while a run is in progress lands in that run's log, even on a shared client.
export function recordingFetch(fetchImpl) {
  return async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input.url);
    const entry = { method: init?.method ?? 'GET', path: url.pathname, query: url.search, status: undefined, ms: 0 };
    const started = Date.now();
    callLog.getStore()?.push(entry);
    try {
      const response = await fetchImpl(input, init);
      entry.status = response.status;
      return response;
    } catch (error) {
      entry.status = `network error: ${error.message}`;
      throw error;
    } finally {
      entry.ms = Date.now() - started;
    }
  };
}

export function withCallLog(run) {
  const calls = [];
  return callLog.run(calls, async () => ({ value: await run(), calls }));
}

/** One SDK client per credential, as the SDK intends, so its token cache is exercised; idle clients are dropped. */
export class ClientPool {
  #clients = new Map();

  constructor(baseUrl, fetchImpl = fetch) {
    this.baseUrl = baseUrl;
    this.fetch = recordingFetch(fetchImpl);
  }

  get({ clientId, clientSecret, scopes }) {
    if (!clientId || !clientSecret) throw Object.assign(new Error('Enter the client id and secret first'), { status: 400 });
    const key = createHash('sha256').update(JSON.stringify([clientId, clientSecret, [...(scopes ?? [])].sort()])).digest('hex');
    const now = Date.now();
    for (const [k, v] of this.#clients) if (now - v.usedAt > IDLE_MS) this.#clients.delete(k);
    let entry = this.#clients.get(key);
    if (!entry) {
      if (this.#clients.size >= MAX_CLIENTS) this.#clients.delete(this.#clients.keys().next().value);
      entry = { client: new RosteredAIClient({ baseUrl: this.baseUrl, clientId, clientSecret, scopes: scopes?.length ? scopes : undefined, fetch: this.fetch }) };
      this.#clients.set(key, entry);
    }
    entry.usedAt = now;
    return entry.client;
  }
}

export function describeError(error) {
  if (error instanceof AuthenticationError) return { type: 'AuthenticationError', status: error.status, code: error.code, message: error.description ?? error.message };
  if (error instanceof ApiError) {
    let body = error.body;
    try { body = JSON.parse(error.body); } catch { /* not JSON: keep the text */ }
    return { type: 'ApiError', status: error.status, message: error.message, body };
  }
  return { type: error.name, message: error.message };
}

async function toResult(value) {
  if (value instanceof Blob) return { file: { bytes: value.size, type: value.type } };
  return value;
}

function buildArguments(spec, operation, values, files) {
  const args = {};
  for (const field of operation.fields) {
    if (field.binary) {
      const chosen = (files?.[field.name] ?? []).map((f) => new File([Buffer.from(f.base64, 'base64')], f.name, { type: f.type || 'application/octet-stream' }));
      if (chosen.length) args[field.name] = field.multiple ? chosen : chosen[0];
      continue;
    }
    const value = values?.[field.name];
    if (value === undefined || value === '') continue;
    // Multipart fields are appended as text, so they stay strings; JSON and query values get Dates where the spec says so.
    args[field.name] = field.in === 'form' ? String(value) : reviveDates(spec, field.schema, value);
  }
  return args;
}

/** Calls one generated SDK method with the QA's arguments and returns what the SDK returned or threw. */
export async function runOperation({ pool, specs, operation, credential, values, files }) {
  const client = pool.get(credential);
  const args = buildArguments(specs[operation.api], operation, values, files);
  const started = Date.now();
  const { value, calls } = await withCallLog(async () => {
    try {
      return { ok: true, result: await toResult(await client[operation.api][operation.group][operation.method](args)) };
    } catch (error) {
      return { ok: false, error: describeError(error) };
    }
  });
  return { ...value, ms: Date.now() - started, calls };
}
