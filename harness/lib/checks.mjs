import { ApiError, AuthenticationError, RosteredAIClient, TOKEN_PATH, Webhooks, WebhookSignatureError } from '@rosteredai/sdk';
import { recordingFetch, withCallLog } from './runner.mjs';

const COMPANY_TYPES = { 1: 'tenant', 2: 'agency' };

// One read per area, chosen by scope. The first must enforce its scope (get-tenant does not yet), as it also proves a narrower token is refused.
const READS = {
  tenant: [
    { scope: 'locations', name: 'Read your locations (GET /tenant/api/Tenant/get-location)', call: (c, claims) => c.tenant.organisationLocations.tenantGetLocation({ tenantId: claims.TenantId }) },
    { scope: 'organisation', name: 'Read your organisation (GET /tenant/api/Tenant/get-tenant)', call: (c, claims) => c.tenant.organisationLocations.tenantGetTenant({ id: claims.TenantId }) },
    { scope: 'webhooks', name: 'Read webhook settings (GET /user/api/integrations/webhooks/settings)', call: (c) => c.tenant.webhooksCredentials.userIntegrationsWebhooksSettings() },
  ],
  agency: [
    // The agency comes from the token; the body's id must still be a GUID, so the empty one is sent.
    { scope: 'clients', name: 'Read the businesses you work for (POST /partners/get-agency-tenants)', call: (c) => c.agency.clients.getAgencyTenants({ getAgencyTenantsRequest: { tblAgencyId: '00000000-0000-0000-0000-000000000000' } }) },
    { scope: 'placements', name: 'Read your agency timesheets for the last week (POST /timesheet/get-agency-timesheets)', call: (c) => c.agency.agencyTimesheets.timesheetsAgencyGetAgencyTimesheets({ timesheetsGetAgencyTimesheetsRequest: lastWeek() }) },
    { scope: 'webhooks', name: 'Read webhook settings (GET /user/api/integrations/webhooks/settings)', call: (c) => c.agency.webhookManagement.integrationsWebhooksSettings() },
  ],
};

function lastWeek() {
  const toDate = new Date();
  return { fromDate: new Date(toDate.getTime() - 7 * 86_400_000), toDate };
}

// The shared vector every SDK asserts, so a pass here means this build signs exactly like the platform.
const VECTOR = {
  secret: 'whsec_test_secret',
  timestamp: 1700000000,
  body: '{"eventId":"evt_1","eventType":"webhook.test","occurredAt":"2026-11-03T00:00:00Z","data":{}}',
  v1: '87638a300708c328292ab1e84f295e07e359253db60ea214b3542ef7001c9094',
};

export function decodeClaims(token) {
  const payload = token.split('.')[1];
  if (!payload) throw new Error('The token is not a JWT');
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
}

function scopesOf(claims) {
  const scope = claims.scope ?? [];
  return Array.isArray(scope) ? scope : String(scope).split(' ').filter(Boolean);
}

function describe(error) {
  if (error instanceof AuthenticationError) return `AuthenticationError ${error.status} ${error.code}: ${error.description ?? ''}`.trim();
  if (error instanceof ApiError) return `ApiError ${error.status}: ${error.message}`;
  return `${error.name}: ${error.message}`;
}

function summarise(response) {
  const data = response?.data;
  const shape = Array.isArray(data) ? `${data.length} rows` : data && typeof data === 'object' ? `fields ${Object.keys(data).slice(0, 6).join(', ')}` : String(data);
  return `${response?.message ?? 'no message'}; data: ${shape}`;
}

/** Runs the SDK against the environment with the QA's credential; nothing is stored. */
export async function runChecks(request, fetchImpl = fetch) {
  if (!READS[request.api]) throw Object.assign(new Error('api must be tenant or agency'), { status: 400 });
  if (!request.clientId || !request.clientSecret) throw Object.assign(new Error('clientId and clientSecret are required'), { status: 400 });
  const { value, calls } = await withCallLog(() => checks(request, recordingFetch(fetchImpl)));
  return { results: value, calls };
}

async function checks({ baseUrl, api, clientId, clientSecret, scopes }, fetchImpl) {
  let tokenRequests = 0;
  const countingFetch = (input, init) => {
    if (new URL(typeof input === 'string' ? input : input.url).pathname.endsWith(TOKEN_PATH)) tokenRequests++;
    return fetchImpl(input, init);
  };
  const results = [];
  const options = { baseUrl, clientId, clientSecret, scopes: scopes?.length ? scopes : undefined, fetch: countingFetch, maxRetries: 1, timeoutMs: 20_000 };
  const tokenCalls = () => tokenRequests;

  const step = async (name, run) => {
    const started = Date.now();
    try {
      const outcome = (await run()) ?? {};
      results.push({ name, outcome: outcome.skip ? 'skip' : 'pass', detail: outcome.skip ?? outcome.detail ?? '', ms: Date.now() - started });
      return outcome;
    } catch (error) {
      results.push({ name, outcome: 'fail', detail: describe(error), ms: Date.now() - started });
      return undefined;
    }
  };

  const client = new RosteredAIClient(options);
  let claims;
  await step('Exchange the credential for a token', async () => {
    claims = decodeClaims(await client.getAccessToken());
    const kind = COMPANY_TYPES[claims.companyType];
    if (kind !== api) throw new Error(`This is a ${kind ?? 'unknown'} credential (companyType ${claims.companyType}); choose ${kind ?? 'the matching API'}`);
    const granted = scopesOf(claims);
    return { detail: `${kind} ${claims.TenantId ?? claims.AgencyId}; ${granted.length} scopes: ${granted.join(' ')}; expires in ${claims.exp - Math.floor(Date.now() / 1000)} s` };
  });

  if (!claims) {
    results.push({ name: 'Remaining checks', outcome: 'skip', detail: 'No token, so nothing else can run', ms: 0 });
    return results;
  }
  const granted = new Set(scopesOf(claims));
  const canRead = (area) => granted.has(`${area}.read`) || granted.has(`${area}.write`);

  await step('Reuse the cached token', async () => {
    const before = tokenCalls();
    await client.getAccessToken();
    if (tokenCalls() !== before) throw new Error('A second token was fetched instead of reusing the cached one');
    return { detail: 'No second token request' };
  });

  await step('Refuse a wrong secret', async () => {
    try {
      await new RosteredAIClient({ ...options, clientSecret: `${clientSecret}-wrong` }).getAccessToken();
    } catch (error) {
      if (error instanceof AuthenticationError) return { detail: describe(error) };
      throw error;
    }
    throw new Error('A token was issued for a wrong secret');
  });

  for (const read of READS[api]) {
    await step(read.name, async () => {
      if (!canRead(read.scope)) return { skip: `Credential has neither ${read.scope}.read nor ${read.scope}.write` };
      return { detail: summarise(await read.call(client, claims)) };
    });
  }

  const [first] = READS[api];
  await step(`Refuse a call outside the token's scopes (${first.scope} with a webhooks.read-only token)`, async () => {
    if (!canRead(first.scope) || !granted.has('webhooks.read')) return { skip: `Needs a credential holding webhooks.read and ${first.scope}.read` };
    const narrow = new RosteredAIClient({ ...options, scopes: ['webhooks.read'] });
    try {
      await first.call(narrow, claims);
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) return { detail: describe(error) };
      throw error;
    }
    throw new Error('The call succeeded without its scope');
  });

  await step('Verify a webhook signature (offline, shared test vector)', async () => {
    const header = `t=${VECTOR.timestamp},v1=${VECTOR.v1}`;
    Webhooks.verify(VECTOR.body, header, VECTOR.secret, 300, new Date(VECTOR.timestamp * 1000));
    try {
      Webhooks.verify(VECTOR.body.replace('evt_1', 'evt_2'), header, VECTOR.secret, 300, new Date(VECTOR.timestamp * 1000));
    } catch (error) {
      if (error instanceof WebhookSignatureError) return { detail: 'Vector accepted; tampered body rejected' };
      throw error;
    }
    throw new Error('A tampered body was accepted');
  });

  return results;
}
