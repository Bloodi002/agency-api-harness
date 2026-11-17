# SIT integration QA harness

A small web app for QA to test the tenant and agency integration APIs **through the SDK**, against SIT. Every call is made by
`@rosteredai/sdk` (built from `node/`), so QA exercises exactly what an integrator's code does: token exchange and
caching, typed errors, retries and date handling. Nothing calls the API directly.

| Page | What it does |
|---|---|
| `/explorer` | Every SDK operation (180 tenant, 53 agency; the token exchange is left out because the client does it). Pick one, fill its fields (JSON body pre-filled from the spec example, file pickers for uploads), run it, and see what the SDK returned or threw, each HTTP call it made, and the same call as Node code. |
| `/checks` | A fixed suite with one credential: token, token reuse, wrong secret, reads, scope refusal, webhook signature vector. |
| `/inbox` | Public HTTPS webhook receivers. Register one as an endpoint, choose the status it answers (204, 200, 400, 410, 500, 503) to test retries and suspension, and verify deliveries with the SDK. |
| `/guide` | The integrator guide (`docs/integration-guide.md`), rendered. |

The explorer is built at start-up from the SDK itself: each generated method's request fields come from its own code, and
the summary, scopes, examples and descriptions from `openapi/*.json`. A test fails if the two ever disagree, so
regenerating the SDK keeps the harness complete with no edits here.

## Configuration

| Variable | Required | Meaning |
|---|---|---|
| `ROSTEREDAI_BASE_URL` | yes | The SIT gateway root, `https://dev.rostered.ai/api.rosteredaidev`. The SDK's `baseUrl`. |
| `HARNESS_PASSWORD` | yes | Shared QA password. The sign-in sets an HttpOnly cookie for 12 hours. The harness refuses to start without it. |
| `HARNESS_ENVIRONMENT_NAME` | no | Label shown in the header; default `SIT`. |
| `PORT` | no | Default 8080; Render sets it. |

Credentials are typed by QA, kept in that browser tab's `sessionStorage`, and sent with each run. The server keeps one SDK
client per credential in memory (up to 50, dropped after 30 idle minutes) so the token cache behaves as it does for an
integrator. Nothing is written to disk or logged. Webhook inboxes live in memory too and are lost on restart or redeploy.
Use SIT test credentials only and revoke them afterwards.

## Run locally

```bash
cd node && npm ci && npm run build
cd ../harness && npm install
HARNESS_PASSWORD=change-me ROSTEREDAI_BASE_URL=https://dev.rostered.ai/api.rosteredaidev npm start      # http://localhost:8080
npm test
```

Or the same image Render builds (context is the repository root, because the harness needs `node`, `openapi` and `docs`):

```bash
cd sdks
docker build -f harness/Dockerfile -t rosteredai-qa-harness .
docker run --rm -p 8080:8080 -e ROSTEREDAI_BASE_URL=https://dev.rostered.ai/api.rosteredaidev -e HARNESS_PASSWORD=change-me rosteredai-qa-harness
```

## Deploy to Render

Pick one:

1. **Blueprint.** In Render choose *New › Blueprint*, connect this repository, and set the Blueprint path to
   `harness/render.yaml`. It creates a Docker web
   service with a generated `HARNESS_PASSWORD` (read it from the service's Environment tab) and `/healthz` as its health check.
2. **Prebuilt image.** Build the image above, push it to a registry Render can pull (Docker Hub, GHCR, or Azure Container
   Registry with credentials), then *New › Web Service › Existing image*, and set `ROSTEREDAI_BASE_URL` and `HARNESS_PASSWORD`.

The blueprint uses the `starter` plan on purpose: a free instance sleeps after 15 idle minutes, which empties the webhook
inboxes and makes the first webhook delivery after a sleep time out and retry. `autoDeploy` is off; deploy from the
dashboard after merging.

SIT is reached over plain HTTP on a public IP. If SIT ever restricts inbound addresses, allow Render's outbound IPs for
the region (shown on the service's Connect tab). Webhook deliveries need the inbox URL to be HTTPS, which Render provides.
