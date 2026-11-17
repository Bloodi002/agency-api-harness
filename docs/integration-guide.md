# RosteredAI Integration Guide

This guide is for companies connecting their own systems to RosteredAI. It covers creating API credentials, getting a token, calling the API, receiving signed webhooks, and setting up the official SDKs for C#, Node.js, Java and Python.

RosteredAI offers two integration APIs. Which one you use depends on the kind of account you have:

| You are | API | What you can do | Reference |
|---|---|---|---|
| A business that rosters its own staff (an **organisation**) | **Tenant API**, 182 operations | Organisation and locations, staff, qualifications, leave and unavailability, pay conditions, rosters and shifts, agency dispatch, timesheets, forms and tasks, awards, webhooks | `https://<your-host>/swagger/tenant` |
| A **staffing agency** supplying workers to RosteredAI businesses | **Agency Partner API**, 56 operations | Business profile, rate cards and coverage, skills, candidates and qualifications, compliance, shift requests, placements, clients, webhooks | `https://<your-host>/swagger/agency` |

Both APIs use the same sign-in, the same webhook signing and the same SDKs. A credential belongs to exactly one organisation or agency, and it acts for that company only.

> **Your host.** Your RosteredAI contact gives you a **sandbox** host to build against and a **production** host to go live on. Every path in this guide goes after that host, for example `https://<your-host>/user/api/integrations/token`. The interactive references above also have a downloadable OpenAPI 3.0 file (JSON and YAML), which you can import into Postman or your own code generator.

---

## 1. Create an API credential

An admin of your RosteredAI account creates credentials in the web app:

| Account | Page | Address |
|---|---|---|
| Organisation | **Settings › API Credentials** | `/app/settings/api-credentials` |
| Agency | **Settings › API Credentials** | `/agency/settings/credentials` |

1. Select **Create credential** and give it a name that says which of your systems uses it, for example "Roster sync (production)".
2. Choose its **scopes**: what it is allowed to do. Each scope on that page lists the exact calls it unlocks. Grant only what the integration needs.
3. Copy the **client id** (`rai_…`) and the **client secret** (`cs_…`). **The secret is shown once.** RosteredAI stores only a one-way hash of it, so nobody can show it to you again; if it is lost, rotate the credential to get a new secret.

Good practice:

- Use one credential per system and per environment (sandbox and production are separate accounts with separate credentials).
- Keep the secret in a secrets manager or environment variable, never in source control, a URL, a log or a support ticket.
- **Rotating** a credential issues a new secret and **immediately** stops the old secret, and every token issued with it stops working within about a minute. Update your system straight after you rotate. **Revoking** a credential stops it for good, on the same timing.
- **Organisations:** your plan decides whether API access is available, how many credentials you can hold, and which scopes can be granted. After a plan change, any scope the new plan does not include stops working within about a minute, and the next token you request leaves it out. Agencies are not limited by a plan.

## 2. Get an access token

RosteredAI uses the OAuth 2.0 **client credentials** grant. Exchange the client id and secret for a bearer token:

```http
POST https://<your-host>/user/api/integrations/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=rai_...&client_secret=cs_...&scope=staff.read%20rosters.read
```

```bash
curl -s https://<your-host>/user/api/integrations/token \
  -d grant_type=client_credentials \
  -d client_id="$ROSTEREDAI_CLIENT_ID" \
  -d client_secret="$ROSTEREDAI_CLIENT_SECRET"
```

- You can send the client id and secret as an HTTP Basic `Authorization` header instead of in the body, but not both ways at once.
- `scope` is optional and space-separated. Leave it out to get every scope the credential holds. Asking for a scope the credential does not hold is refused with `invalid_scope`. A withdrawn scope is dropped when you ask for it alongside others, and refused with `invalid_scope` when you ask for it alone.

A successful answer is the standard OAuth 2.0 body:

```json
{ "access_token": "eyJhbGciOi...", "token_type": "Bearer", "expires_in": 3600, "scope": "staff.read rosters.read" }
```

Send the token on every other call as `Authorization: Bearer <access_token>`. Reuse it until shortly before `expires_in` runs out (usually one hour), then request a new one. Do not request a token per call. The SDKs do all of this for you.

When the exchange fails, the answer is `{ "error": "...", "error_description": "..." }`:

| Status | `error` | Meaning |
|---|---|---|
| `401` | `invalid_client` | The client id or secret is wrong, or the credential was rotated or revoked. |
| `400` | `invalid_scope` | You asked for a scope this credential does not hold, or (organisations) none of the requested scopes is in your plan. |
| `400` | `invalid_grant` | Your organisation's plan does not include API access. |
| `400` | `invalid_request` | A required field is missing or sent twice. |
| `400` | `unsupported_grant_type` | Only `client_credentials` is supported. |

## 3. Call the API

```bash
# Tenant API: your organisation's profile
curl -s "https://<your-host>/tenant/api/Tenant/get-tenant?id=<your organisation id>" \
  -H "Authorization: Bearer $TOKEN"

# Agency Partner API: the businesses you work for (every agency call is a POST with a JSON body; ids in a body must be GUIDs, so send the empty GUID where your own agency id is asked for)
curl -s https://<your-host>/partners/get-agency-tenants \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"tblAgencyId": "00000000-0000-0000-0000-000000000000"}'
```

### Conventions

- **One host, several areas.** Each path starts with the part of RosteredAI that answers it, such as `/tenant/...`, `/staff/...`, `/scheduling/...`, `/timesheets/...`, `/user/...` or `/partners/...`. Call them exactly as the reference shows.
- **Envelope.** Most responses are `{ "data": …, "message": "…" }`. The token endpoint uses the OAuth 2.0 shape, and file downloads return the file.
- **JSON.** Bodies are camelCase JSON unless an operation says `multipart/form-data` (file uploads). Ids are GUIDs.
- **Shift and attendance times are the location's wall clock, not UTC.** They arrive as text with no offset (`2026-11-16T07:00:00`), and the SDKs hand them to you unchanged. Do not add an offset or convert them. `timeZone`, where a record has it, names the zone they belong to. A null `timeZone` means that location has no zone set yet: an organisation sets one with `POST /tenant/api/Tenant/save-location-operating-hours`.
- **Shift webhook events carry the same local times, without a `timeZone`.** `date`, `startTime` and `endTime` in a `shift.*` event are the location's wall clock. To get the zone, read the shift through the API using its id, or the location using `locationId`.
- **Calendar dates are plain text too.** Fields like `leaveStartDate`, `payPeriodStartDate` and `employeeStartDate` are days, not moments, so the SDKs return them as sent. Timesheet events send pay period dates as `2026-10-06`.
- **Record timestamps.** Fields such as `createdDate` also arrive without an offset (`2026-07-09T04:35:53.583`), and the SDKs read them as UTC. Fields ending in `Utc` are UTC. Agency times of day are `HH:mm`.
- **Your company comes from your token.** You never need to send your own organisation or agency id to prove who you are. Where a request carries a tenant id, it must be your own. Send only your own staff, location, area, shift and timesheet ids.
- **Agency API:** every operation is a `POST`, and reads carry their filters in the JSON body. List reads page with `page`, `pageSize`, `search`, `sortBy` and `order`, and answer `{ items, totalRecords, totalPages, page, pageSize }`.
- **Page sizes and date ranges.** A `pageSize` above 200 is lowered to 200 without an error, so read the totals rather than assuming you got what you asked for. Very large sizes are still refused with `400`. Roster reads refuse a range longer than 62 days, and the unavailability list refuses one whose end is more than 62 days after its start.
- **Staff updates are partial.** On `staff-registration` and `staff-manual-registration`, fields you leave out keep their stored values.
- **Who made a change.** Fields naming who made a change are ignored. Changes to main records are recorded against your credential. Not every write is covered, and the API doesn't return this, so keep your own log if you need one.

### Not in this version

This version has no external ids, no idempotency keys or other safe retries, no changed-since reads and no record versions. Retrying a create that may have succeeded can create a duplicate, so read before you retry. To stay in sync, use webhooks and re-read periodically.

### Status codes

| Code | Meaning | What to do |
|---|---|---|
| `200` / `201` | Success. | |
| `400` | Missing or invalid input; `message` says what. | Fix the request. Do not retry it unchanged. |
| `401` | The token is missing, malformed or expired, or the credential was rotated or revoked. | Get a new token once and retry. If that fails too, check the credential. |
| `403` | The token lacks the scope for this call, or the request names another company. | Add the scope to the credential (and plan), or fix the id. |
| `404` | It does not exist, or it is not yours. | |
| `409` | Blocked by a dependency, a duplicate or a plan limit. | Read `message`, fix the cause, then retry. |
| `429` | Too many token requests. Only the token endpoint is rate limited today. | Wait for `Retry-After`, then retry. |
| `500` | Unexpected error. `message` carries a reference. | Quote the reference to RosteredAI support. |
| `502` / `503` / `504` | Briefly unavailable. | Retry with backoff. Retry a `POST` or `PATCH` only once you know the first attempt did not take effect. |

**Another company's data** is never returned, but the answer depends on the call: `404`, `403`, `400`, or `200` with empty or null `data`. Treat all of them as "not yours".

## 4. Scopes

Each operation in the reference lists the scopes that allow it; any one of them is enough. Most reads accept the area's `.read` or `.write` scope. Writes need `.write`. Approvals and publishing have their own scopes. Bank, super and tax reads and the staff export need `staff.finance.read`; `staff.finance.write` alone is refused.

### Tenant API scopes

| Scope | Allows |
|---|---|
| `organisation.read` | Read the organisation profile, tags and plan usage |
| `locations.read` / `locations.write` | Read / create and update locations, areas and opening hours |
| `staff.read` / `staff.write` | Read / create and update staff profiles |
| `staff.personal.read` | Adds staff date of birth, contact details, address, profile picture and documents to the staff and roster reads you already hold (**sensitive**) |
| `staff.finance.read` / `staff.finance.write` | Read bank, super and tax details and the staff export, and see tax file number, payroll id and passcode on staff records / update bank, super and tax details (**sensitive**) |
| `qualifications.read` / `qualifications.write` | Read / add and update qualifications |
| `availability.read` / `availability.write` | Read / request staff unavailability |
| `leave.read` / `leave.write` | Read leave requests and balances / create and withdraw leave requests |
| `leave.approve` | Approve or decline leave and unavailability |
| `pay_conditions.read` / `pay_conditions.write` | Read / update staff pay conditions, classifications and allowances. `pay_conditions.read` also adds pay rates, costs and amounts to staff, roster and timesheet reads |
| `rosters.read` / `rosters.write` | Read / create, update and assign shifts |
| `rosters.publish` | Publish rosters |
| `agency_dispatch.read` / `agency_dispatch.write` | Read / send shifts to agencies and accept or reject candidates |
| `timesheets.read` / `timesheets.write` | Read / create and update timesheets, and read agency workers' shifts (costs need `pay_conditions.read`) |
| `timesheets.approve` | Approve or reject timesheets and agency workers' shifts |
| `payroll.read` | Read pay run settings |
| `forms.read` / `forms.write` | Read forms, submissions and tasks / assign forms, submit responses and manage tasks |
| `forms.responses.read` | Adds answers and review comments to the form submission reads you already hold (**sensitive**) |
| `awards.read` | Read awards, classifications and pay rates |
| `contracts.read` | Read staff contracts |
| `holidays.read` | Read the organisation's holidays and events |
| `webhooks.read` / `webhooks.write` | Read webhook settings and the delivery log / manage endpoints, send tests and replay deliveries |

### Fields that need their own scope

Some sensitive fields need a scope on top of the one that opens the call. Without it the call still succeeds, and those fields come back null (a few text fields come back blank, and a few ids as the all-zero id). Your code must accept that.

| Fields | Scope |
|---|---|
| Staff date of birth, contact details, address, profile picture and documents | `staff.personal.read` |
| Tax file number, payroll id and time-clock passcode | `staff.finance.read` |
| Pay rates, costs and amounts on staff, roster and timesheet reads | `pay_conditions.read` |
| Answers and review comments on form submissions | `forms.responses.read` |

The matching `.write` scope does not unlock these. `staff.personal.read` and `forms.responses.read` open no call by themselves. Searching or sorting by a field you cannot read is ignored. When you save a staff member, blank personal or finance fields from a token that cannot read them count as left out, so a read followed by a save does not wipe them. The reference says which fields each call affects.

### Agency Partner API scopes

| Scope | Allows |
|---|---|
| `profile.read` / `profile.write` | Read / update your business details, rate cards, coverage zones and skills |
| `clients.read` | Read the businesses you work for and the rates in force with each |
| `candidates.read` / `candidates.write` | Read / add, update and delete your workers, their skills and qualifications, and catalogue entries |
| `qualifications.read` / `qualifications.write` | Read / manage the qualification catalogue and your staff qualification records |
| `compliance.read` / `compliance.write` | Read your compliance requirements and documents / upload compliance documents |
| `shifts.read` / `shifts.write` | Read shift requests sent to you / respond, submit candidates, accept, decline, withdraw |
| `placements.read` | Read the workers a client accepted, and the hours they clocked at each client (agency timesheets) |
| `webhooks.read` / `webhooks.write` | Read webhook settings and the delivery log / register and update endpoints, rotate their secrets, send tests, replay deliveries |

## 5. Webhooks

Webhooks tell your system about many changes as they happen, so you can poll less. Not every change raises an event, so re-read periodically as well.

### Set up an endpoint

1. Build an HTTPS endpoint on your side that accepts `POST` with a JSON body. It must be on the public internet: private, loopback and internal addresses are refused, and redirects are not followed.
2. In the web app, open **Settings › API Access & Webhooks** (organisations: `/app/settings/integrations`, agencies: `/agency/settings/integrations`). You can also do this through the API under `/user/api/integrations/webhooks/...` with the `webhooks.write` scope.
3. Add the endpoint URL and choose the events you want.
4. Copy the endpoint's **signing secret** (`whsec_…`). It is shown once, when the endpoint is created or its secret is rotated. Each endpoint has its own secret.
5. Select **Send test**. A `webhook.test` event arrives at your endpoint. The endpoint starts as *Pending verification* and becomes *Active* when it answers a test with `2xx`. Until then it receives only test events: real events are not sent, or queued for later, while it is pending. Changing its URL, or turning it back on after it was disabled or suspended, puts it back to *Pending verification*, so send a test again.

**Settings › Delivery Log** shows every delivery and attempt, and lets you replay one from the last 30 days.

### What a delivery looks like

```http
POST /your/webhook/path
Content-Type: application/json
X-RosteredAI-Signature: t=1762214400,v1=5f2b...e9
X-RosteredAI-Event-Id: 6f1c...
X-RosteredAI-Delivery-Id: 0a7d...
X-RosteredAI-Event-Type: staff.created
X-RosteredAI-Api-Version: 1

{ "eventId": "6f1c...", "eventType": "staff.created", "occurredAt": "2026-11-04T01:02:03Z", "data": { "staffId": "..." } }
```

`data` carries ids, statuses, dates and names: enough to act on, or to fetch the full record with the API. It never contains secrets or bank, super or tax details. Each event's `data` is documented in the API reference, as a **callback** on *Register or update a webhook endpoint*.

### Verify every delivery

Never act on a delivery you have not verified. The SDKs do this in one call (see section 6). Without an SDK:

1. Read the **raw** request body as bytes, before any JSON parsing. Re-serialising the JSON changes the bytes and breaks the signature.
2. Split `X-RosteredAI-Signature` on `,` into `t` (unix seconds) and one or more `v1` values.
3. Compute HMAC-SHA256 over `t + "." + rawBody`, keyed with your endpoint secret exactly as shown (including `whsec_`), as lowercase hex.
4. Compare it with each `v1` in constant time. Reject the delivery if none match.
5. Reject it if `t` is more than 5 minutes from your clock, in either direction, so a captured delivery cannot be replayed. Keep your server clock in sync (NTP).
6. **Deduplicate on `eventId`.** A retry or a replay carries the same `eventId`, but a new `X-RosteredAI-Delivery-Id`.
7. Answer `2xx` within a few seconds, then do the work in the background. Events can arrive out of order: use `occurredAt` and re-read the record when the order matters.

To check your own code, this vector must verify: secret `whsec_test_secret`, header `t=1700000000,v1=87638a300708c328292ab1e84f295e07e359253db60ea214b3542ef7001c9094`, body `{"eventId":"evt_1","eventType":"webhook.test","occurredAt":"2026-11-03T00:00:00Z","data":{}}` (as of that time).

### Retries and endpoint health

- A delivery that does not get a `2xx` is tried up to **8 times**: straight away, then 30 seconds, 2 minutes, 10 minutes, 1 hour, 6 hours, 12 hours and 24 hours after the previous attempt (about 43 hours in all).
- `410 Gone` stops retries for that delivery at once, and three `410`s in a row **suspend** the endpoint.
- An endpoint whose deliveries have all failed for 24 hours is **disabled** at its next failure, and your integration admins are emailed. Events raised while an endpoint is disabled or suspended are not sent to it later. Fix the endpoint, re-enable it, then replay what you missed from the delivery log.

### Events

| Organisation (tenant) events | |
|---|---|
| Organisation | `organisation.updated`, `organisation.plan.changed` |
| Locations | `location.created`, `location.updated`, `location.archived`, `location.deleted`, `area.created`, `area.updated`, `area.deleted` |
| Staff | `staff.created`, `staff.updated`, `staff.deleted`, `staff.status.changed`, `staff.onboarding.completed`, `staff.availability.updated`, `staff.pay_condition.changed`, `contract.status.changed` |
| Qualifications | `staff.qualification.updated`, `staff.qualification.expiring`, `staff.qualification.expired` |
| Leave and unavailability | `leave.requested`, `leave.approved`, `leave.rejected`, `leave.withdrawn`, `availability.requested`, `availability.approved`, `availability.rejected` |
| Rosters and shifts | `roster.published`, `roster.auto_schedule.completed`, `shift.created`, `shift.updated`, `shift.deleted`, `shift.assigned`, `shift.unassigned` |
| Agency dispatch | `shift.request.responded`, `shift.request.declined`, `shift.candidates.submitted`, `shift.candidate.withdrawn`, `shift.placement.no_show_acknowledged`, `agency.tenant_mapping.changed`, `agency.compliance.document.submitted` |
| Attendance (your staff and agency workers) | `attendance.clocked_in`, `attendance.clocked_out`, `break.started`, `break.ended` |
| Timesheets | `timesheet.created`, `timesheet.updated`, `timesheet.submitted`, `timesheet.approved`, `timesheet.rejected` |
| Forms, tasks, awards | `form.assigned`, `form.submission.submitted`, `form.submission.edited`, `form.submission.reviewed`, `task.created`, `task.stage_changed`, `award.update.available`, `award.update.adopted` |
| Other | `notification.created`, `api_credential.created`, `api_credential.rotated`, `api_credential.scopes_changed`, `api_credential.revoked`, `webhook.test` |

| Agency events | |
|---|---|
| Shift requests | `shift.request.received`, `shift.request.escalated`, `shift.request.filled`, `shift.request.expired`, `shift.request.cancelled` |
| Candidates | `shift.candidate.accepted`, `shift.candidate.rejected` |
| Placements | `shift.placement.clock_in_overdue`, `shift.placement.cancelled`, `shift.placement.completed`, `shift.placement.completion_reversed`, `shift.placement.no_show`, `shift.placement.no_show_reversed`, `shift.placement.rated` |
| Your workers' attendance | `attendance.clocked_in`, `attendance.clocked_out`, `break.started`, `break.ended` |
| Qualifications | `staff.qualification.updated`, `staff.qualification.expiring`, `staff.qualification.expired` |
| Your account | `agency.status.changed`, `agency.tenant_mapping.changed`, `agency.compliance.document.changed` |
| Other | `api_credential.created`, `api_credential.rotated`, `api_credential.scopes_changed`, `api_credential.revoked`, `webhook.test` |

### Agency workers clocking in and out

Agency workers clock in and out at the client's kiosk with their own code, the same way the client's staff do. Both sides hear about it.

**If you are an agency:**

- `attendance.clocked_in`, `attendance.clocked_out`, `break.started` and `break.ended` arrive for your own workers at every client you work for. `data` names the client (`tenantId`), your worker (`agencyStaffId`, the candidate id the Agency API uses) and the booking (`agencyPlacementId`, which is `null` when the client let the worker clock in with nothing booked). Times come as the location's wall clock and in UTC (`clockInTime`, `clockInTimeUtc`).
- `shift.placement.clock_in_overdue` arrives once per booking when the worker has not clocked in by the shift's start plus the client's on-time tolerance. Use it to remind the worker, or to send someone else. It still arrives when the worker has no kiosk login yet: check `hasLogin` and set one up, because a worker without one cannot clock in at all. If the shift is moved, the new start time can raise it again.
- What was clocked, and what each shift came to, is in the agency timesheets (next section).

**If you are an organisation:**

- The same four attendance events cover agency workers too. For an agency worker, `agencyId`, `agencyStaffId` and `agencyPlacementId` are set, and `userId` is the worker's own login, not one of your staff. For your own staff these fields are `null`.

### Agency workers' timesheets

Clocking in and out is the same for agency workers as for your own staff, but their timesheets are not. An agency worker never gets an organisation timesheet: they never appear in `get-timesheet-list`, and the `timesheet.*` events never include them. Instead, each booking is its own **agency timesheet**, built from the booking and the kiosk punches when you read it, and priced at the agency's rate.

| Call | Who | Scope | What it does |
|---|---|---|---|
| `POST /timesheet/get-agency-timesheets` | Organisation and agency | Organisation: `timesheets.read`. Agency: `placements.read` | One page of agency shifts between `fromDate` and `toDate` (shift dates, inclusive), with `totals` for the whole range. An organisation sees its own agencies; an agency sees every client it works for, and can narrow to one with `tblTenantId`. |
| `GET /timesheet/get-agency-timesheet-detail` | Organisation and agency | As above | One shift in full, by `tblAgencyPlacementId`: the per-day segments its amount is made of, the breaks punched, and the rate card and rate used. |
| `POST /timesheet/set-agency-timesheet-approval` | Organisation only | `timesheets.approve` | The client's decision on up to 500 shifts at once. |

Each row's `tblAgencyPlacementId` is the booking. When the client let the worker clock in with nothing booked (`flags` includes `Unscheduled`), it is the clock-in's id instead, and the row has no scheduled times.

**Where a shift has got to (`status`):** `1` awaiting clock-in, `2` clocked in, `3` completed, `4` no-show (nothing payable), `5` cancelled after the worker started (the hours worked still count).

**What it comes to:**

- Both the rostered hours (`scheduledHours`, `scheduledAmount`) and the clocked hours (`actualHours`, `actualAmount`) are always shown. `payBasis` says which one the client pays this agency on: `0` clocked hours, `1` rostered hours. `payableHours` and `amount` are the charged ones.
- Breaks: the punched break is deducted, or the rostered break when none was punched.
- Every rate and amount includes GST; `gstAmount` is the GST inside `amount`.
- `rateSource` says where the rate came from: `1` the rate the shift was offered at, `2` the agency's rate card on that day, `3` the client's default rate for the agency, `0` none (the shift is unpriced). An overnight or holiday shift can use more than one rate, so `rateFrom` and `rateTo` give the range.
- `flags` is a bit set of things worth a look: `1` nothing clocked, `2` no clock-out (the shift cannot be priced until it is corrected), `4` late, `8` left early, `16` overtime, `32` break too long, `64` no break punched, `128` more than one clock-in matched (the earliest was used), `256` unpriced, `512` the location has no time zone, `1024` clocked in with nothing booked.

**The client's decision (`approvalStatus`):** `0` pending, `1` approved, `2` declined, with `approvalNote` and `approvalDecidedAt`.

- Only the organisation decides; an agency reads the decision but can never make it. Sending `0` withdraws an earlier decision.
- Declining needs a `note` saying why. The agency is shown it, because that is what it has to act on. Declined shifts stay listed and counted, but their money is left out of the totals.
- Approving a booked shift completes the booking for the agency, which makes it billable, and the agency receives `shift.placement.completed`. Approving a shift that had nothing booked completes nothing.
- A booked shift can only be approved once it has ended at its location (its `scheduledEnd` has passed in the location's time zone) and the worker has clocked out. If any shift in the call has not, nothing is saved: the answer is `400`, and `data.tblAgencyTimesheetKeys` lists the shifts to come back to. Declining and withdrawing are not held back.
- Declining an approved shift, or putting it back to pending, takes the completion back: the booking returns to the status it held before, its actual times are cleared, and the agency receives `shift.placement.completion_reversed`. A platform fee not yet invoiced is withdrawn; one already invoiced stays on the invoice it was billed on, and a matching credit comes off the agency's next fee invoice (`feeAlreadyInvoiced` is true). Approving again sends `shift.placement.completed` again.
- No webhook announces an approval of a shift with nothing booked, or a decline of a shift that was never approved. An agency finds those by reading `get-agency-timesheets` (for example once a day for the last fortnight) and comparing `approvalStatus`.

## 6. The SDKs

Official SDKs are available for **C# (.NET 8)**, **Node.js 18+ (TypeScript)**, **Java 11+** and **Python 3.9+**. Each one is a single package covering both APIs. Each one:

- gets and caches the token, refreshes it 60 seconds before it expires, and shares one token request between concurrent calls;
- on a `401`, fetches a fresh token and retries the call once (this covers a rotated credential);
- retries `429` (honouring `Retry-After`; only the token request can answer it today), `502`, `503`, `504` and network errors with jittered exponential backoff (0.5 s doubling, capped at 8 s, 3 retries by default), for `GET`, `HEAD`, `PUT`, `DELETE` and `OPTIONS` only. `POST` and `PATCH` are never retried automatically, and every agency call is a `POST`;
- raises typed errors: an authentication error (with `code`, for example `invalid_client`) when the token is refused, and an API error (with `status`, `message` and the raw `body`) for any other failure;
- reads record timestamps without an offset as UTC, and leaves wall-clock shift and attendance times as the plain strings the API sent;
- verifies webhook signatures, with no client or network needed.

Your RosteredAI contact supplies the package file for your language, along with the host. Store the credential in your system's configuration as three values:

| Setting | Example | Notes |
|---|---|---|
| `ROSTEREDAI_BASE_URL` | `https://<your-host>` | The host only, no path. Sandbox and production differ. |
| `ROSTEREDAI_CLIENT_ID` | `rai_...` | |
| `ROSTEREDAI_CLIENT_SECRET` | `cs_...` | A secret: keep it in a vault or a protected environment variable. |
| `ROSTEREDAI_WEBHOOK_SECRET` | `whsec_...` | One per webhook endpoint, only if you receive webhooks. |

Create **one client per credential** when your application starts and reuse it. It is safe to share across threads and concurrent requests, and creating a client per call throws away the token cache. Use a tenant credential for `tenant` calls and an agency credential for `agency` calls.

### C# (.NET 8)

```bash
dotnet add package RosteredAI.Sdk --version 0.1.0 --source ./packages   # folder holding RosteredAI.Sdk.0.1.0.nupkg
```

```csharp
using RosteredAI.Sdk;

// Program.cs: register once, inject everywhere.
builder.Services.AddSingleton(_ => new RosteredAIClient(new RosteredAIClientOptions
{
    BaseUrl = builder.Configuration["RosteredAI:BaseUrl"]!,
    ClientId = builder.Configuration["RosteredAI:ClientId"]!,
    ClientSecret = builder.Configuration["RosteredAI:ClientSecret"]!,
    // Scopes = new[] { "staff.read", "rosters.read" },   // optional: narrower than the credential
}));

// Tenant API
var tenant = await client.Tenant.OrganisationLocations.TenantGetTenantAsync(organisationId);
var organisation = tenant.Ok()?.Data;

// Agency API
var clients = await client.Agency.Clients.GetAgencyTenantsAsync(new GetAgencyTenantsRequest(tblAgencyId: Guid.Empty.ToString()));

try { await client.Tenant.Staff.StaffGetStaffAsync(staffId); }
catch (RosteredAIApiException ex) when (ex.StatusCode == 404) { /* not found, or not yours */ }
catch (RosteredAIAuthenticationException ex) { /* ex.Code, e.g. invalid_client: check the credential */ }
```

Options: `Timeout` (30 s per attempt), `MaxRetries` (3), `HttpMessageHandler` (your own transport, for example a proxy).

Webhooks (ASP.NET Core minimal API):

```csharp
using RosteredAI.Sdk.Webhooks;

app.MapPost("/webhooks/rosteredai", async (HttpRequest request, IConfiguration config) =>
{
    using var reader = new StreamReader(request.Body);
    var rawBody = await reader.ReadToEndAsync();
    try
    {
        var evt = Webhook.Verify(rawBody, request.Headers[Webhook.SignatureHeader], config["RosteredAI:WebhookSecret"]!);
        // Deduplicate on evt.EventId, queue the work, answer quickly.
        return Results.Ok();
    }
    catch (WebhookSignatureException) { return Results.BadRequest(); }
});
```

### Node.js / TypeScript

```bash
npm install ./rosteredai-sdk-0.1.0.tgz
```

```ts
import { RosteredAIClient, ApiError, AuthenticationError } from '@rosteredai/sdk';

export const rostered = new RosteredAIClient({
  baseUrl: process.env.ROSTEREDAI_BASE_URL!,
  clientId: process.env.ROSTEREDAI_CLIENT_ID!,
  clientSecret: process.env.ROSTEREDAI_CLIENT_SECRET!,
  // scopes: ['staff.read', 'rosters.read'],
});

const tenant = await rostered.tenant.organisationLocations.tenantGetTenant({ id: organisationId });
const skills = await rostered.agency.skills.agencySkills({ agencySkillsRequest: { isActive: true } });

try {
  await rostered.tenant.staff.staffGetStaff({ id: staffId });
} catch (error) {
  if (error instanceof AuthenticationError) console.error('Check the credential:', error.code);
  else if (error instanceof ApiError) console.error(error.status, error.message);
  else throw error;
}
```

Options: `timeoutMs` (30 000), `maxRetries` (3), `fetch` (a replacement `fetch`, for example for a proxy). TypeScript projects need `"lib": ["ES2022", "DOM"]` or `"skipLibCheck": true`.

Webhooks (Express); note `express.raw`, so the body stays as bytes:

```ts
import express from 'express';
import { Webhooks, WebhookHeaders, WebhookSignatureError } from '@rosteredai/sdk';

app.post('/webhooks/rosteredai', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    const event = Webhooks.verify(req.body, req.get(WebhookHeaders.signature), process.env.ROSTEREDAI_WEBHOOK_SECRET!);
    // Deduplicate on event.eventId, queue the work, answer quickly.
    res.sendStatus(204);
  } catch (error) {
    if (error instanceof WebhookSignatureError) return res.status(400).send(error.message);
    throw error;
  }
});
```

### Java 11+

```bash
mvn install:install-file -Dfile=rosteredai-sdk-0.1.0.jar -DpomFile=pom.xml
```

```xml
<dependency>
  <groupId>ai.rostered</groupId>
  <artifactId>rosteredai-sdk</artifactId>
  <version>0.1.0</version>
</dependency>
```

```java
RosteredAIClient client = RosteredAIClient.builder()
    .baseUrl(System.getenv("ROSTEREDAI_BASE_URL"))
    .clientId(System.getenv("ROSTEREDAI_CLIENT_ID"))
    .clientSecret(System.getenv("ROSTEREDAI_CLIENT_SECRET"))
    .scopes(List.of("staff.read"))            // optional
    .build();

var staff = client.tenant().staff().schedulingGetStaffList(new SchedulingGetStaffListRequest());
var skills = client.agency().skills().agencySkills(new AgencySkillsRequest());
```

Options: `timeout` (30 s), `maxRetries` (3), `httpClient` (your own `java.net.http.HttpClient`). Errors are the unchecked `AuthenticationError` (`getCode()`) and `ApiError` (`getStatus()`, `getMessage()`, `getBody()`).

Webhooks (servlet style):

```java
String raw = new String(request.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
try {
    WebhookEvent event = Webhooks.verify(raw, request.getHeader(WebhookHeaders.SIGNATURE), secret);
    // Deduplicate on event.getEventId(), queue the work, answer quickly.
    response.setStatus(200);
} catch (WebhookSignatureError e) {
    response.setStatus(400);
}
```

### Python 3.9+

```bash
pip install ./rosteredai-0.1.0-py3-none-any.whl
```

```python
import os
from rosteredai import RosteredAIClient, ApiError, AuthenticationError
from rosteredai.agency import AgencySkillsRequest

client = RosteredAIClient(
    base_url=os.environ["ROSTEREDAI_BASE_URL"],
    client_id=os.environ["ROSTEREDAI_CLIENT_ID"],
    client_secret=os.environ["ROSTEREDAI_CLIENT_SECRET"],
    # scopes=["organisation.read"],
)

org = client.tenant.organisation_locations.tenant_get_tenant(id=organisation_id)
skills = client.agency.skills.agency_skills(AgencySkillsRequest())
```

Options: `timeout` (30 s), `max_retries` (3), `transport` (your own HTTP transport). Every `datetime` the SDK returns is timezone-aware; wall-clock shift and attendance times are plain strings.

Webhooks (Flask); `request.get_data()` is the raw body:

```python
from flask import Flask, request
from rosteredai import verify, WebhookSignatureError

@app.post("/webhooks/rosteredai")
def rosteredai_webhook():
    try:
        event = verify(request.get_data(), request.headers.get("X-RosteredAI-Signature"), os.environ["ROSTEREDAI_WEBHOOK_SECRET"])
    except WebhookSignatureError:
        return "", 400
    # Deduplicate on event.event_id, queue the work, answer quickly.
    return "", 204
```

Every SDK can also sign a body for your own unit tests: `Webhook.GenerateSignatureHeader` (C#), `Webhooks.generateSignatureHeader` (Node, Java) and `generate_signature_header` (Python).

## 7. Going live checklist

- [ ] Built and tested against the **sandbox** host with a sandbox credential.
- [ ] The production credential holds only the scopes you need, and its secret is in your secrets store.
- [ ] One long-lived client (or one cached token) per credential, not one per request.
- [ ] `401` handled by one token refresh. `403` and `404` are not retried.
- [ ] `POST` and `PATCH` calls are not blindly re-sent after a timeout; you check the outcome first.
- [ ] Shift and attendance times are treated as the location's wall clock, with no offset added, and a null `timeZone` is handled.
- [ ] Fields that can come back null without a field scope are handled.
- [ ] A retried create cannot duplicate a record, because you read before you retry.
- [ ] Webhooks are verified over the raw body, rejected when stale, deduplicated on `eventId`, and answered `2xx` before the work is done.
- [ ] Your endpoint is public HTTPS, and a test event shows as delivered in the Delivery Log.
- [ ] You know how to rotate the credential and the webhook secret, and who updates your configuration when you do.

## 8. Troubleshooting

| Symptom | Likely cause |
|---|---|
| `invalid_client` | Wrong id or secret, a sandbox credential used on production (or the reverse), or the credential was rotated or revoked. |
| `invalid_grant` | The organisation's plan has no API access. |
| `403` on a call that used to work | The credential's scopes were changed, or a plan change removed the scope. Request a new token after fixing it. |
| `401` straight after a rotation | Expected: rotation stops old tokens within about a minute. Deploy the new secret. |
| `404` for an id you know exists | It belongs to another organisation or agency, or it was deleted. |
| A field is null, or a search finds nothing, on a call that succeeds | The credential lacks the field's scope (section 4). |
| `409` | Something depends on the record, the value is already in use, or a plan limit was reached. `message` says which. |
| Webhook signature never matches | The body was parsed and re-serialised before verifying, the wrong endpoint's secret was used, or your clock is off by more than 5 minutes. |
| No webhooks arrive | The endpoint is disabled or suspended, it is not subscribed to that event, or its URL is not reachable from the internet. Check the Delivery Log. |
| Shift times are 10 or 11 hours off | A wall-clock time was given an offset or converted. Show shift and attendance times as sent; they are already the location's local time. |

When you contact support, include the operation, the time (UTC), the HTTP status, the `message` and any reference it contains. Never include your client secret or a token.
