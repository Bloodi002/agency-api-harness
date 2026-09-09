# RosteredAI Agency API Harness

A hosted **Swagger/Postman + webhook receiver** for the RosteredAI Agency Partner API. One page an
agency or QA opens in a browser to:

1. **Connect** — paste the `client_id` / `client_secret` from *Settings → API & Credentials* and get a
   scoped token.
2. **Explore the APIs** — every endpoint the token is allowed to call, with request editors and live
   responses (Swagger "Try it out"). Toggle *"Show only my allowed APIs"* to hide anything the token's
   scopes don't cover.
3. **Receive webhooks** — register the harness delivery URL in the portal, set the signing secret, and
   watch deliveries arrive live, each signature-checked.

## Why it is a tiny server, not a static page

The gateway's CORS is a per-environment allow-list, so a browser calling it directly from a hosted
page is blocked unless that origin is added to the gateway and it is redeployed. This harness avoids
that: the browser only talks to the harness, and the harness proxies each call to the gateway
server-to-server, where CORS does not apply. It works from any host, against any environment, with no
gateway change.

## Node or Python — same harness, pick your runtime

Two zero-dependency implementations of the exact same server are included; both serve the same
`public/` UI and read the same environment variables. Deploy whichever your host prefers:

| Runtime | File | Start command | Needs |
|---|---|---|---|
| Node | `server.js` | `node server.js` | Node 18+, nothing to install |
| Python | `server.py` | `python server.py` | Python 3.8+, stdlib only, nothing to install |

## Configuration (environment variables)

| Var | What | Example |
|-----|------|---------|
| `PORT` | Port to listen on — the host sets this | `8080` |
| `GATEWAY_BASE` | Public gateway origin for the environment you demo, no trailing slash | `https://apidev.rostered.ai` |
| `API_PREFIX` | Gateway path prefix that routes to Partners | `/partners` |
| `WEBHOOK_SECRET` | The endpoint signing secret (`whsec_...`) — or set it in the UI at runtime | *(value)* |
| `SIG_TOLERANCE` | Max age (seconds) of a signed webhook before it is stale | `300` |

API paths (`/agency/candidates`, ...) are proxied to `GATEWAY_BASE + API_PREFIX + path`.

## Deploy free on Render (no card for the free tier)

1. Put this folder in a Git repo:
   ```bash
   cd agency-api-harness
   git init && git add . && git commit -m "Agency API harness"
   git remote add origin <your-repo-url> && git push -u origin main
   ```
2. In Render, choose **New + → Blueprint** and pick the repo. It reads `render.yaml` and creates the
   service. (Or **New + → Web Service**, runtime **Node**, start command `node server.js`.)
3. Set `GATEWAY_BASE` for your environment, and optionally `WEBHOOK_SECRET`.
4. Deploy. You get a URL like `https://agency-api-harness.onrender.com` — that is the link to share.

Railway, Fly.io, Glitch and Koyeb work the same way — any host that runs a Node process. A `Dockerfile`
is included for container hosts.

Free-tier note: Render's free web service sleeps after ~15 min idle and wakes on the next request (a
few seconds). Fine for demos and QA.

## Run locally

```bash
# Node
GATEWAY_BASE=http://localhost:7000 node server.js
# or Python
GATEWAY_BASE=http://localhost:7000 python server.py
# open http://localhost:4000
```

## Notes

- Secrets are forwarded to the gateway and kept in memory only — not logged, not written to disk.
- The harness has no login of its own, so treat the URL as shareable-but-sensitive and share it
  deliberately.
