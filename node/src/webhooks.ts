import { createHmac, timingSafeEqual } from 'node:crypto';
import { WebhookSignatureError } from './errors.js';

/** Header names on every webhook delivery (Node lower-cases incoming header names; compare case-insensitively). */
export const WebhookHeaders = {
  signature: 'X-RosteredAI-Signature',
  eventId: 'X-RosteredAI-Event-Id',
  deliveryId: 'X-RosteredAI-Delivery-Id',
  eventType: 'X-RosteredAI-Event-Type',
  apiVersion: 'X-RosteredAI-Api-Version',
} as const;

/** A verified webhook delivery body. */
export interface WebhookEvent<TData = unknown> {
  eventId: string;
  eventType: string;
  occurredAt: string;
  data: TData;
}

export const DEFAULT_TOLERANCE_SECONDS = 300;

/** Verifies and parses webhook deliveries; no client or credentials needed. */
export class Webhooks {
  /** Verifies `X-RosteredAI-Signature` over the raw body and returns the parsed event, or throws WebhookSignatureError. */
  static verify<TData = unknown>(
    rawBody: string | Uint8Array,
    signatureHeader: string | null | undefined,
    secret: string,
    toleranceSeconds: number = DEFAULT_TOLERANCE_SECONDS,
    now: Date = new Date(),
  ): WebhookEvent<TData> {
    if (signatureHeader === null || signatureHeader === undefined || signatureHeader.trim() === '') {
      throw new WebhookSignatureError(`Missing ${WebhookHeaders.signature} header`);
    }
    const { timestamp, signatures } = parseHeader(signatureHeader);

    const expected = Buffer.from(sign(secret, timestamp, toBuffer(rawBody)), 'hex');
    const matched = signatures.some((candidate) => {
      const actual = Buffer.from(candidate, 'hex');
      return actual.length === expected.length && timingSafeEqual(actual, expected);
    });
    if (!matched) throw new WebhookSignatureError('No v1 signature matches the payload');

    const age = Math.floor(now.getTime() / 1000) - Number(timestamp);
    if (Math.abs(age) > toleranceSeconds) {
      throw new WebhookSignatureError(`Signature timestamp is outside the ${toleranceSeconds} s tolerance`);
    }

    return parseEvent<TData>(toBuffer(rawBody).toString('utf8'));
  }

  /** Builds a valid `X-RosteredAI-Signature` value, for testing your own webhook handler. */
  static generateSignatureHeader(secret: string, rawBody: string | Uint8Array, timestamp: number = Math.floor(Date.now() / 1000)): string {
    const t = String(Math.floor(timestamp));
    return `t=${t},v1=${sign(secret, t, toBuffer(rawBody))}`;
  }
}

function sign(secret: string, timestamp: string, body: Buffer): string {
  return createHmac('sha256', Buffer.from(secret, 'utf8')).update(`${timestamp}.`, 'utf8').update(body).digest('hex');
}

function parseHeader(header: string): { timestamp: string; signatures: string[] } {
  let timestamp: string | undefined;
  const signatures: string[] = [];
  for (const part of header.split(',')) {
    const separator = part.indexOf('=');
    if (separator <= 0) throw new WebhookSignatureError(`Malformed ${WebhookHeaders.signature} header`);
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (key === 't') timestamp = value;
    else if (key === 'v1') signatures.push(value.toLowerCase());
  }
  if (timestamp === undefined || !/^\d+$/.test(timestamp)) {
    throw new WebhookSignatureError(`Malformed ${WebhookHeaders.signature} header: missing or invalid t`);
  }
  // Odd-length or non-hex values would be silently truncated by Buffer.from(hex), so reject them as malformed.
  if (signatures.length === 0 || signatures.some((s) => !/^[0-9a-f]+$/.test(s) || s.length % 2 !== 0)) {
    throw new WebhookSignatureError(`Malformed ${WebhookHeaders.signature} header: missing or invalid v1`);
  }
  return { timestamp, signatures };
}

function parseEvent<TData>(json: string): WebhookEvent<TData> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new WebhookSignatureError('Signed payload is not valid JSON');
  }
  const event = parsed as Partial<WebhookEvent<TData>> | null;
  if (event === null || typeof event !== 'object' || typeof event.eventId !== 'string' || typeof event.eventType !== 'string' || typeof event.occurredAt !== 'string') {
    throw new WebhookSignatureError('Signed payload is not a RosteredAI webhook event');
  }
  return { eventId: event.eventId, eventType: event.eventType, occurredAt: event.occurredAt, data: event.data as TData };
}

function toBuffer(body: string | Uint8Array): Buffer {
  return typeof body === 'string' ? Buffer.from(body, 'utf8') : Buffer.from(body.buffer, body.byteOffset, body.byteLength);
}
