# @rosteredai/sdk (Node.js)

TypeScript SDK for the RosteredAI integration APIs: the business (tenant) API and the agency partner API in one package.
ESM with type declarations, Node 18+, uses the global `fetch`, no runtime dependencies.

## Install (local build)

```bash
cd sdks/node
npm install
npm run build
npm pack                      # -> rosteredai-sdk-0.1.0.tgz
# in your project:
npm install /path/to/sdks/node/rosteredai-sdk-0.1.0.tgz
```

The generated declarations use the DOM `fetch` types (`RequestInit`, `Response`), so a TypeScript consumer needs
`"lib": ["ES2022", "DOM"]` or `"skipLibCheck": true`.

## Quick start

```ts
import { RosteredAIClient } from '@rosteredai/sdk';

const client = new RosteredAIClient({
  baseUrl: 'https://api.rostered.ai',          // host only; your RosteredAI contact gives you the production or sandbox host
  clientId: process.env.ROSTERED_CLIENT_ID!,
  clientSecret: process.env.ROSTERED_CLIENT_SECRET!,
});

// Business (tenant) API
const tenant = await client.tenant.organisationLocations.tenantGetTenant({ id: tenantId });
console.log(tenant.data?.tenantId, tenant.message);

// Agency partner API
const skills = await client.agency.skills.agencySkills({ agencySkillsRequest: { isActive: true } });
```

`client.tenant` and `client.agency` hold one configured instance of every generated API class (`staff`, `rosters`,
`timesheetsPayroll`, `shiftRequests`, `placements`, ...). Every operation takes a single request object and has a
`...Raw` twin that returns the `Response` as well. Request and response types are exported under the `Tenant` and
`Agency` namespaces:

```ts
import type { Tenant, Agency } from '@rosteredai/sdk';
const organisation: Tenant.TenantOrganisation | undefined = tenant.data;
```

Options: `scopes`, `timeoutMs` (per attempt, default 30 000), `maxRetries` (default 3) and `fetch` (a replacement
`fetch`, e.g. for a proxy or tests). One client per credential; it is safe to share across concurrent requests.

## Scopes

Without `scopes` the token carries every scope the credential was granted (limited to what your plan includes). Pass
`scopes` to ask for less:

```ts
new RosteredAIClient({ baseUrl, clientId, clientSecret, scopes: ['staff.read', 'rosters.read'] });
```

Each operation's doc comment lists the scopes that let a token call it; a call without one is refused with `403`.

## Authentication, errors and retries

- The client exchanges the credential at `POST /user/api/integrations/token` (OAuth 2.0 client credentials), caches the
  token until 60 s before it expires, and shares one in-flight fetch between concurrent callers.
- An API `401` (rotated or revoked credential) drops the cached token, fetches a new one and replays the request once.
- `429` (honouring `Retry-After`), `502`, `503`, `504` and network errors are retried up to `maxRetries` times with
  exponential backoff (0.5 s doubling, jittered, capped at 8 s), only for GET, HEAD, PUT, DELETE and OPTIONS.
  POST and PATCH are never retried, so check the outcome before re-sending one. Most agency calls are POST.

| Error | When | Fields |
| --- | --- | --- |
| `AuthenticationError` | the token endpoint refused the credential (`400`/`401`) | `code` (e.g. `invalid_client`), `description`, `status` |
| `ApiError` | any other non-2xx response | `status`, `message` (from the `{ data, message }` envelope), `body` (raw text) |
| `WebhookSignatureError` | `Webhooks.verify` rejected a delivery | `message` |

All three extend `RosteredAIError`. Network failures that exhaust their retries are rethrown as the underlying `fetch`
error.

```ts
import { ApiError, AuthenticationError } from '@rosteredai/sdk';

try {
  await client.tenant.organisationLocations.tenantGetTenant({ id: tenantId });
} catch (error) {
  if (error instanceof AuthenticationError) console.error('Check the credential:', error.code);
  else if (error instanceof ApiError) console.error(error.status, error.message);
  else throw error;
}
```

## Webhook verification

Verify against the **raw** body, before any JSON parsing. `Webhooks.verify` checks the HMAC-SHA256 signature in constant
time, rejects timestamps more than `toleranceSeconds` (default 300) away from now, and returns the parsed event.

```ts
import express from 'express';
import { Webhooks, WebhookHeaders, WebhookSignatureError } from '@rosteredai/sdk';

const app = express();
app.post('/webhooks/rosteredai', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    const event = Webhooks.verify(req.body, req.get(WebhookHeaders.signature), process.env.ROSTERED_WEBHOOK_SECRET!);
    // Deduplicate on event.eventId, then queue the work and answer quickly.
    res.sendStatus(204);
  } catch (error) {
    if (error instanceof WebhookSignatureError) return res.status(400).send(error.message);
    throw error;
  }
});
```

To unit-test your handler, sign a body yourself:

```ts
const header = Webhooks.generateSignatureHeader('whsec_...', rawBody, Math.floor(Date.now() / 1000));
```

Header names are in `WebhookHeaders`: `signature`, `eventId`, `deliveryId` (unique per attempt), `eventType`,
`apiVersion`.

## Regenerating

The code under `src/generated/{tenant,agency}` comes from `sdks/openapi/*.json` and is never edited by hand. Needs Java and
`sdks/tools/openapi-generator-cli.jar` (7.14.0):

```bash
cd sdks/node
npm run generate              # = node ../scripts/generate-node.mjs; deletes and rewrites src/generated
npm run build && npm test
```

If a regeneration adds, removes or renames an API class (one per OpenAPI tag), update `TenantApis` / `AgencyApis` in
`src/client.ts`; the build fails until you do.
