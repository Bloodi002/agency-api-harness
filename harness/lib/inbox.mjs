import { randomBytes } from 'node:crypto';
import { Webhooks, WebhookHeaders, WebhookSignatureError } from '@rosteredai/sdk';

const MAX_INBOXES = 100;
const MAX_DELIVERIES = 50;
export const MAX_DELIVERY_BYTES = 1024 * 1024;
export const REPLY_STATUSES = [204, 200, 400, 410, 500, 503];
const KEPT_HEADERS = Object.values(WebhookHeaders).map((h) => h.toLowerCase()).concat(['content-type', 'user-agent']);

/** In-memory webhook receivers; everything here is lost when the process restarts. */
export class InboxStore {
  #inboxes = new Map();

  create(label, replyStatus = 204) {
    if (this.#inboxes.size >= MAX_INBOXES) this.#inboxes.delete(this.#inboxes.keys().next().value);
    const inbox = { id: randomBytes(12).toString('base64url'), label: (label ?? '').slice(0, 80), replyStatus: checkStatus(replyStatus), createdAt: new Date(), deliveries: [] };
    this.#inboxes.set(inbox.id, inbox);
    return summary(inbox);
  }

  list() {
    return [...this.#inboxes.values()].reverse().map(summary);
  }

  get(id) {
    const inbox = this.#inboxes.get(id);
    return inbox && { ...summary(inbox), deliveries: inbox.deliveries.map(view) };
  }

  update(id, replyStatus) {
    const inbox = this.#inboxes.get(id);
    if (!inbox) return undefined;
    inbox.replyStatus = checkStatus(replyStatus);
    return summary(inbox);
  }

  clear(id) {
    const inbox = this.#inboxes.get(id);
    if (inbox) inbox.deliveries = [];
    return Boolean(inbox);
  }

  delete(id) {
    return this.#inboxes.delete(id);
  }

  /** Stores one delivery and returns the status to answer with, or undefined when the inbox does not exist. */
  receive(id, headers, rawBody, receivedAt = new Date()) {
    const inbox = this.#inboxes.get(id);
    if (!inbox) return undefined;
    const kept = Object.fromEntries(KEPT_HEADERS.filter((h) => headers[h] !== undefined).map((h) => [h, String(headers[h])]));
    inbox.deliveries.unshift({ id: randomBytes(6).toString('base64url'), receivedAt, headers: kept, rawBody, answeredWith: inbox.replyStatus });
    inbox.deliveries.length = Math.min(inbox.deliveries.length, MAX_DELIVERIES);
    return inbox.replyStatus;
  }

  /** Checks every stored delivery with the SDK, as of the moment it arrived; the secret is used here and never kept. */
  verify(id, secret) {
    const inbox = this.#inboxes.get(id);
    if (!inbox) return undefined;
    return inbox.deliveries.map((delivery) => {
      try {
        const event = Webhooks.verify(delivery.rawBody, delivery.headers[WebhookHeaders.signature.toLowerCase()], secret, 300, delivery.receivedAt);
        return { id: delivery.id, valid: true, detail: `${event.eventType} ${event.eventId}` };
      } catch (error) {
        if (error instanceof WebhookSignatureError) return { id: delivery.id, valid: false, detail: error.message };
        return { id: delivery.id, valid: false, detail: `Body is not a webhook event: ${error.message}` };
      }
    });
  }
}

function checkStatus(status) {
  const value = Number(status);
  if (!REPLY_STATUSES.includes(value)) throw Object.assign(new Error(`Reply status must be one of ${REPLY_STATUSES.join(', ')}`), { status: 400 });
  return value;
}

function summary(inbox) {
  return { id: inbox.id, label: inbox.label, replyStatus: inbox.replyStatus, createdAt: inbox.createdAt, deliveryCount: inbox.deliveries.length };
}

function view(delivery) {
  return { id: delivery.id, receivedAt: delivery.receivedAt, headers: delivery.headers, body: delivery.rawBody.toString('utf8'), answeredWith: delivery.answeredWith };
}
