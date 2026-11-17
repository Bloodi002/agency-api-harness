import { TOKEN_PATH, type TokenProvider } from './auth.js';

const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);
// POST and PATCH are never retried: the server may already have acted on them.
const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS']);
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 8_000;

export interface TransportOptions {
  fetch: typeof fetch;
  tokens: TokenProvider;
  maxRetries: number;
  timeoutMs: number;
  userAgent: string;
}

/** Backoff for a zero-based retry attempt: 0.5 s * 2^attempt, capped at 8 s, with jitter in the upper half. */
export function backoffDelayMs(attempt: number, random: () => number = Math.random): number {
  const ceiling = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** attempt);
  return ceiling / 2 + random() * (ceiling / 2);
}

/** Parses Retry-After as delta seconds or an HTTP date; undefined when absent or unreadable. */
export function retryAfterMs(header: string | null, now: number = Date.now()): number | undefined {
  if (header === null || header.trim() === '') return undefined;
  const value = header.trim();
  if (/^\d+$/.test(value)) return Number(value) * 1000;
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, date - now);
}

/** The fetch the generated Configuration uses: bearer auth, one re-auth on 401, retries, timeout and User-Agent. */
export function createTransport(options: TransportOptions): typeof fetch {
  const transport = async (input: string | URL | Request, init: RequestInit = {}): Promise<Response> => {
    const url = input instanceof Request ? input.url : input.toString();
    const method = (init.method ?? 'GET').toUpperCase();
    const retryable = IDEMPOTENT_METHODS.has(method);
    const authenticated = !new URL(url).pathname.endsWith(TOKEN_PATH);
    let reauthenticated = false;

    for (let attempt = 0; ; ) {
      const headers = new Headers(init.headers);
      headers.set('User-Agent', options.userAgent);
      if (authenticated) headers.set('Authorization', `Bearer ${await options.tokens.getToken()}`);

      const timeout = withTimeout(init.signal ?? undefined, options.timeoutMs);
      let response: Response;
      try {
        response = await options.fetch(url, { ...init, headers, signal: timeout.signal });
      } catch (error) {
        if (init.signal?.aborted || !retryable || attempt >= options.maxRetries) throw error;
        await sleep(backoffDelayMs(attempt));
        attempt++;
        continue;
      } finally {
        timeout.dispose();
      }

      if (response.status === 401 && authenticated && !reauthenticated) {
        // A rotated or revoked credential: fetch a fresh token and replay once, whatever the method.
        reauthenticated = true;
        options.tokens.invalidate();
        await discard(response);
        continue;
      }

      if (retryable && attempt < options.maxRetries && RETRYABLE_STATUSES.has(response.status)) {
        const delay = (response.status === 429 ? retryAfterMs(response.headers.get('Retry-After')) : undefined) ?? backoffDelayMs(attempt);
        await discard(response);
        await sleep(delay);
        attempt++;
        continue;
      }

      return response;
    }
  };
  return transport as typeof fetch;
}

function withTimeout(outer: AbortSignal | undefined, timeoutMs: number): { signal: AbortSignal; dispose: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException(`Request timed out after ${timeoutMs} ms`, 'TimeoutError')), timeoutMs);
  const onAbort = (): void => controller.abort(outer?.reason);
  if (outer?.aborted) controller.abort(outer.reason);
  else outer?.addEventListener('abort', onAbort, { once: true });
  return {
    signal: controller.signal,
    dispose: () => {
      clearTimeout(timer);
      outer?.removeEventListener('abort', onAbort);
    },
  };
}

async function discard(response: Response): Promise<void> {
  await response.body?.cancel().catch(() => undefined);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
