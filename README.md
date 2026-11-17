# RosteredAI SIT QA harness

A QA harness for the RosteredAI tenant and agency integration APIs: Swagger UI through a proxy, SDK checks and a webhook inbox.

- `harness/`: the harness app (see `harness/README.md`).
- `node/`: the Node SDK the harness runs on.
- `openapi/`: the tenant and agency OpenAPI specs.
- `docs/`: SDK docs the harness serves.

Build from the repository root: `docker build -f harness/Dockerfile .`. On Render, set the Blueprint path to `harness/render.yaml`. The harness refuses to start unless `HARNESS_PASSWORD` is set.

The source of truth is `RosteredAI.Identity/sdks`; this repo is a copy for hosting.
