import { RosteredAIClient, type RosteredAIClientOptions } from '../src/index.js';

export const BASE_URL = 'https://api.example.test';
export const TOKEN_URL = `${BASE_URL}/user/api/integrations/token`;
export const TENANT_ID = '11111111-1111-1111-1111-111111111111';

export interface RecordedRequest {
  url: string;
  method: string;
  headers: Headers;
  body: string;
  form?: FormData;
}

type Handler = (request: RecordedRequest) => Response | Promise<Response>;

/** A scripted fetch: token calls go to `token`, every other call is answered by the next queued API handler. */
export class FakeFetch {
  readonly requests: RecordedRequest[] = [];
  private readonly apiHandlers: Handler[] = [];
  tokenCount = 0;
  token: Handler = () => {
    this.tokenCount++;
    return json(200, { access_token: `tok-${this.tokenCount}`, token_type: 'Bearer', expires_in: 3600, scope: '' });
  };

  queue(...handlers: Handler[]): this {
    this.apiHandlers.push(...handlers);
    return this;
  }

  get apiRequests(): RecordedRequest[] {
    return this.requests.filter((r) => r.url !== TOKEN_URL);
  }

  readonly fetch = (async (input: string | URL | Request, init: RequestInit = {}): Promise<Response> => {
    const request: RecordedRequest = {
      url: input.toString(),
      method: (init.method ?? 'GET').toUpperCase(),
      headers: new Headers(init.headers),
      body: typeof init.body === 'string' ? init.body : '',
      form: init.body instanceof FormData ? init.body : undefined,
    };
    this.requests.push(request);
    if (request.url === TOKEN_URL) return this.token(request);
    const handler = this.apiHandlers.shift();
    if (handler === undefined) throw new Error(`Unexpected request ${request.method} ${request.url}`);
    return handler(request);
  }) as typeof fetch;
}

export function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}

export const ok = (): Response => json(200, { data: { tenantId: TENANT_ID }, message: 'OK' });

export function client(fake: FakeFetch, options: Partial<RosteredAIClientOptions> = {}): RosteredAIClient {
  return new RosteredAIClient({ baseUrl: `${BASE_URL}/`, clientId: 'client-1', clientSecret: 'secret-1', fetch: fake.fetch, ...options });
}
