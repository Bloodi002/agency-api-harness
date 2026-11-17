import { ApiError, AuthenticationError } from './errors.js';

/** Path of the OAuth 2.0 client-credentials token endpoint, relative to the base URL. */
export const TOKEN_PATH = '/user/api/integrations/token';

/** RFC 6749 token response. */
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface TokenProviderOptions {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  scopes?: readonly string[];
  fetch: typeof fetch;
  userAgent: string;
  timeoutMs: number;
}

// Refresh this long before the server-side expiry so a token never lapses mid-request.
const EXPIRY_MARGIN_MS = 60_000;

/** Fetches and caches client-credentials tokens; concurrent callers share one in-flight request. */
export class TokenProvider {
  private token: string | undefined;
  private expiresAt = 0;
  private inFlight: Promise<string> | undefined;

  constructor(private readonly options: TokenProviderOptions) {}

  async getToken(): Promise<string> {
    if (this.token !== undefined && Date.now() < this.expiresAt) return this.token;
    this.inFlight ??= this.fetchToken().finally(() => {
      this.inFlight = undefined;
    });
    return this.inFlight;
  }

  /** Drops the cached token so the next call fetches a fresh one. */
  invalidate(): void {
    this.token = undefined;
    this.expiresAt = 0;
  }

  private async fetchToken(): Promise<string> {
    const { baseUrl, clientId, clientSecret, scopes } = this.options;
    const form = new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret });
    if (scopes !== undefined && scopes.length > 0) form.set('scope', scopes.join(' '));

    const response = await this.options.fetch(baseUrl + TOKEN_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'User-Agent': this.options.userAgent,
      },
      body: form.toString(),
      signal: AbortSignal.timeout(this.options.timeoutMs),
    });

    if (!response.ok) {
      if (response.status === 400 || response.status === 401) {
        const body = await response.text().catch(() => '');
        const refusal = parseRefusal(body);
        if (refusal !== undefined) throw new AuthenticationError(refusal.error, refusal.description, response.status);
        throw new ApiError(response.status, `Token request failed with HTTP ${response.status}`, body);
      }
      throw await ApiError.fromResponse(response);
    }

    const payload = (await response.json()) as Partial<TokenResponse>;
    if (typeof payload.access_token !== 'string' || typeof payload.expires_in !== 'number') {
      throw new ApiError(response.status, 'Token response is missing access_token or expires_in', JSON.stringify(payload));
    }
    this.token = payload.access_token;
    this.expiresAt = Date.now() + payload.expires_in * 1000 - EXPIRY_MARGIN_MS;
    return payload.access_token;
  }
}

function parseRefusal(body: string): { error: string; description: string } | undefined {
  try {
    const parsed = JSON.parse(body) as { error?: unknown; error_description?: unknown };
    if (typeof parsed.error !== 'string') return undefined;
    return { error: parsed.error, description: typeof parsed.error_description === 'string' ? parsed.error_description : '' };
  } catch {
    return undefined;
  }
}
