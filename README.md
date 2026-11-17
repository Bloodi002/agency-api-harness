# RosteredAI SIT QA harness

A QA harness for the RosteredAI tenant and agency integration APIs: Swagger UI through a proxy, SDK checks and a webhook inbox.

- `harness/`: the harness app (see `harness/README.md`).
- `node/`: the Node SDK the harness runs on.
- `openapi/`: the tenant and agency OpenAPI specs.
- `docs/`: SDK docs the harness serves.

Build from the repository root: `docker build -f harness/Dockerfile .`. On Render, set the Blueprint path to `harness/render.yaml`. The harness refuses to start unless `HARNESS_PASSWORD` is set.


## Several testers at once

Each tester can use a different company at the same time:

- Credentials (client id, secret, company) live in the browser tab and are sent with each call, so two tabs can run as two companies.
- Webhook inboxes belong to the browser that created them: a tester sees, changes and deletes only their own. A company's webhook still delivers to its inbox URL.
- Each tester enters their own company's webhook secret on the Inbox page to verify signatures; it is never stored.

Server settings are only `ROSTEREDAI_BASE_URL` and `HARNESS_PASSWORD` (plus optional `PORT` and `HARNESS_ENVIRONMENT_NAME`).
