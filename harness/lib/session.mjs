import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'rai_harness';
const SESSION_SECONDS = 12 * 60 * 60;

// A cookie, not HTTP Basic: Swagger UI sends its own Authorization header on proxied calls, which would replace Basic.
export function sessionValue(password) {
  return createHmac('sha256', password).update('rosteredai-qa-harness-session').digest('base64url');
}

export function parseCookies(header) {
  const cookies = {};
  for (const part of (header ?? '').split(';')) {
    const separator = part.indexOf('=');
    if (separator > 0) cookies[part.slice(0, separator).trim()] = part.slice(separator + 1).trim();
  }
  return cookies;
}

export function hasSession(cookieHeader, password) {
  if (!password) return false;
  const presented = Buffer.from(parseCookies(cookieHeader)[SESSION_COOKIE] ?? '');
  const expected = Buffer.from(sessionValue(password));
  return presented.length === expected.length && timingSafeEqual(presented, expected);
}

export function passwordMatches(candidate, password) {
  const a = createHmac('sha256', 'compare').update(candidate ?? '').digest();
  const b = createHmac('sha256', 'compare').update(password).digest();
  return timingSafeEqual(a, b);
}

export function sessionCookie(password, secure) {
  return `${SESSION_COOKIE}=${sessionValue(password)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_SECONDS}${secure ? '; Secure' : ''}`;
}

export function clearedSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
