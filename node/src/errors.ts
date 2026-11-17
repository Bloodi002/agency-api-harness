/** Base class for every error the SDK raises itself. */
export class RosteredAIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** The token endpoint refused the client credentials (OAuth 2.0 `{ error, error_description }`). */
export class AuthenticationError extends RosteredAIError {
  constructor(
    readonly code: string,
    readonly description: string,
    readonly status: number,
  ) {
    super(description ? `${code}: ${description}` : code);
  }
}

/** A non-2xx API response; `message` comes from the `{ data, message }` envelope when present. */
export class ApiError extends RosteredAIError {
  constructor(
    readonly status: number,
    message: string,
    readonly body: string,
  ) {
    super(message);
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    const body = await response.text().catch(() => '');
    return new ApiError(response.status, envelopeMessage(body) ?? `HTTP ${response.status}`, body);
  }
}

/** A webhook delivery whose signature header is missing, malformed, stale or does not match. */
export class WebhookSignatureError extends RosteredAIError {}

function envelopeMessage(body: string): string | undefined {
  try {
    const parsed: unknown = JSON.parse(body);
    if (parsed !== null && typeof parsed === 'object' && 'message' in parsed) {
      const message = (parsed as { message: unknown }).message;
      if (typeof message === 'string' && message.length > 0) return message;
    }
  } catch {
    // Not JSON; the caller falls back to the status code.
  }
  return undefined;
}
