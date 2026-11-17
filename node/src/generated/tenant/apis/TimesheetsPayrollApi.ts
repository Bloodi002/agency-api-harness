/* tslint:disable */
/* eslint-disable */
/**
 * RosteredAI Tenant Integrations API
 * The integration API for organisations on RosteredAI. Read and update your organisation, locations, staff, qualifications, leave, pay conditions, rosters, agency shifts, timesheets, forms and tasks, and stay in sync through signed webhooks.  ## Authentication OAuth 2.0 **client credentials**. Create a credential in **Settings › Integrations** (the client secret is shown once) and choose what it may do: each scope there lists the exact calls it unlocks. Then call `POST /user/api/integrations/token` (form-encoded, or with the id and secret as HTTP Basic) to exchange your `client_id` and `client_secret` for a bearer token, and send `Authorization: Bearer <token>` on every other call. Rotating or revoking a credential, or your organisation being deactivated, stops every token it issued within about a minute. A token carries only the scopes your plan includes: after a plan change, any scope the new plan leaves out stops working within about a minute, and the next token no longer carries it. Use the **Authorize** button above to try calls on this page.  ## Scopes Every operation lists the scopes that let a token call it, any one of which is enough. Most reads accept the area\'s `.read` or `.write` scope; writes need `.write`; approvals need `leave.approve` or `timesheets.approve`; publishing needs `rosters.publish`. Bank, super and tax reads and the staff export need `staff.finance.read`, and `staff.finance.write` alone is refused. A call without a matching scope is refused with `403`.  ### Fields with their own scope Some sensitive fields need a scope of their own, on top of the one that opens the call. Without it the call still succeeds, and those fields come back null (a few text fields come back blank, and a few ids as the all-zero id): - `staff.personal.read`: staff date of birth, contact details, address, profile picture and documents. - `staff.finance.read`: tax file number, payroll id and time-clock passcode on staff records. - `pay_conditions.read`: pay rates, costs and amounts on staff, roster and timesheet reads. - `forms.responses.read`: the answers and review comments on form submissions. It opens no call by itself.  The matching `.write` scope does not unlock these. Searching or sorting by a field you cannot read is ignored. Operations say which fields this affects.  ## Conventions - Paths are shown as you call them on this host; each starts with the area of RosteredAI that answers it. - Most responses use the envelope `{ \"data\": …, \"message\": \"…\" }`. The token endpoint answers in the OAuth 2.0 shape, and   file downloads return the file. - Bodies are **camelCase JSON** unless an operation says multipart/form-data. Ids are GUIDs; dates are ISO-8601. - **Shift and attendance times are the location\'s wall clock**, sent with no offset; they are not UTC. Do not add an offset   or convert them. `timeZone`, where a record has it, names the zone they belong to. A null `timeZone` means that   location has no zone set; set one with *Set a location\'s opening hours and time zone*. Fields ending in `Utc` are UTC. - Your organisation comes from your token. Where a request carries a tenant id, it must be your own (or is replaced by   it, where the operation says so). Send only your own staff, location, area, shift and timesheet ids. - Fields naming who made a change are ignored. Changes to main records are recorded against your credential. Not every   write is covered, and the API doesn\'t return this. - A `pageSize` above 200 is lowered to 200 without an error. Very large sizes (above 10000, or above 500 for areas) are   still refused with `400`, except on tags. - This version has no external ids, no idempotency keys, no changed-since reads and no record versions. Retrying a create   that may have succeeded can create a duplicate, so read before you retry. Not every change raises a webhook, so re-read   periodically rather than relying on events alone.  ## Status codes | Code | Meaning | | --- | --- | | `200` / `201` | Success. | | `400` | The request was missing something or failed validation; `message` says what. | | `401` | The bearer token is missing, malformed, expired, or was revoked or rotated. | | `403` | Your token lacks the required scope, or the request names another organisation. | | `404` | The item does not exist, or is not yours. | | `409` | Blocked by a dependency, a duplicate or a plan limit. | | `500` | Unexpected server error; `message` carries a reference to quote to support. | | `503` | A dependency is briefly unavailable; try again shortly. |  Another organisation\'s data is never returned, but the answer depends on the call: `404`, `403`, `400`, or `200` with empty or null `data`. Treat all of them as \"not yours\".  The token endpoint follows OAuth 2.0 instead and returns `{ error, error_description }` with `400` or `401`. It is the only call that is rate limited today, so it is the only one that can answer `429`.  ## Webhooks Register endpoints, choose events, send tests and read the delivery log under `/user/api/integrations/webhooks/...`. Every event we can send is documented as a **callback** on *Register or update a webhook endpoint*, with its `data`. Each delivery is a POST of `{ eventId, eventType, occurredAt, data }`.  ### Verifying a delivery Each endpoint has its own signing secret (`whsec_…`), shown once when the endpoint is created or its secret rotated. Every delivery carries `X-RosteredAI-Signature: t=<unix seconds>,v1=<hex>`, plus `X-RosteredAI-Event-Id`, `X-RosteredAI-Delivery-Id` (unique per attempt), `X-RosteredAI-Event-Type` and `X-RosteredAI-Api-Version`. 1. Read the **raw** request body before parsing it. 2. Split the header on `,` into `t` and `v1`. 3. Compute HMAC-SHA256 with your endpoint\'s secret over `t + \".\" + rawBody`, as lowercase hex. 4. Compare it with `v1` in constant time; reject the delivery if they differ. 5. Reject a `t` more than a few minutes old, so a captured delivery cannot be replayed to you. 6. Deduplicate on `eventId`: a retry or a replay carries the same id. 7. Answer `2xx` quickly and do the work afterwards.  ### Retries A delivery is tried up to **8 times**: straight away, then 30 seconds, 2 minutes, 10 minutes, 1 hour, 6 hours, 12 hours and 24 hours after the previous attempt (about 43 hours in all), then it stops. `410 Gone` stops retries at once, and three in a row suspend the endpoint. An endpoint whose deliveries have all failed for 24 hours is disabled at its next failure, and your integration admins are emailed; events raised while it is off are not sent to it later. A stopped delivery from the last 30 days can be replayed from the delivery log.  > Replace the server `host` variable with the production (or sandbox) address your RosteredAI contact provides.
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime.js';
import type {
  Envelope,
  TimesheetsAddTimesheetNote200Response,
  TimesheetsAddTimesheetNoteRequest,
  TimesheetsAddUpdateTimesheet200Response,
  TimesheetsAddUpdateTimesheetRequest,
  TimesheetsBulkActionTimesheetStatusUpdate200Response,
  TimesheetsBulkActionTimesheetStatusUpdateRequest,
  TimesheetsGenerateTimesheetsForPayPeriod200Response,
  TimesheetsGenerateTimesheetsForPayPeriodRequest,
  TimesheetsGetAgencyTimesheetDetail200Response,
  TimesheetsGetAgencyTimesheets200Response,
  TimesheetsGetAgencyTimesheetsRequest,
  TimesheetsGetPayRunCutoff200Response,
  TimesheetsGetPayRunSchedule200Response,
  TimesheetsGetPayrollCycleSettings200Response,
  TimesheetsGetTimesheetAttendance200Response,
  TimesheetsGetTimesheetAuditHistory200Response,
  TimesheetsGetTimesheetClockInOut200Response,
  TimesheetsGetTimesheetClockInOutRequest,
  TimesheetsGetTimesheetDetails200Response,
  TimesheetsGetTimesheetList200Response,
  TimesheetsGetTimesheetListRequest,
  TimesheetsSetAgencyTimesheetApproval200Response,
  TimesheetsSetAgencyTimesheetApprovalRequest,
  TimesheetsTimesheetConfirmImport200Response,
  TimesheetsTimesheetConfirmImportRequest,
  ValidationProblem,
} from '../models/index.js';
import {
    EnvelopeFromJSON,
    EnvelopeToJSON,
    TimesheetsAddTimesheetNote200ResponseFromJSON,
    TimesheetsAddTimesheetNote200ResponseToJSON,
    TimesheetsAddTimesheetNoteRequestFromJSON,
    TimesheetsAddTimesheetNoteRequestToJSON,
    TimesheetsAddUpdateTimesheet200ResponseFromJSON,
    TimesheetsAddUpdateTimesheet200ResponseToJSON,
    TimesheetsAddUpdateTimesheetRequestFromJSON,
    TimesheetsAddUpdateTimesheetRequestToJSON,
    TimesheetsBulkActionTimesheetStatusUpdate200ResponseFromJSON,
    TimesheetsBulkActionTimesheetStatusUpdate200ResponseToJSON,
    TimesheetsBulkActionTimesheetStatusUpdateRequestFromJSON,
    TimesheetsBulkActionTimesheetStatusUpdateRequestToJSON,
    TimesheetsGenerateTimesheetsForPayPeriod200ResponseFromJSON,
    TimesheetsGenerateTimesheetsForPayPeriod200ResponseToJSON,
    TimesheetsGenerateTimesheetsForPayPeriodRequestFromJSON,
    TimesheetsGenerateTimesheetsForPayPeriodRequestToJSON,
    TimesheetsGetAgencyTimesheetDetail200ResponseFromJSON,
    TimesheetsGetAgencyTimesheetDetail200ResponseToJSON,
    TimesheetsGetAgencyTimesheets200ResponseFromJSON,
    TimesheetsGetAgencyTimesheets200ResponseToJSON,
    TimesheetsGetAgencyTimesheetsRequestFromJSON,
    TimesheetsGetAgencyTimesheetsRequestToJSON,
    TimesheetsGetPayRunCutoff200ResponseFromJSON,
    TimesheetsGetPayRunCutoff200ResponseToJSON,
    TimesheetsGetPayRunSchedule200ResponseFromJSON,
    TimesheetsGetPayRunSchedule200ResponseToJSON,
    TimesheetsGetPayrollCycleSettings200ResponseFromJSON,
    TimesheetsGetPayrollCycleSettings200ResponseToJSON,
    TimesheetsGetTimesheetAttendance200ResponseFromJSON,
    TimesheetsGetTimesheetAttendance200ResponseToJSON,
    TimesheetsGetTimesheetAuditHistory200ResponseFromJSON,
    TimesheetsGetTimesheetAuditHistory200ResponseToJSON,
    TimesheetsGetTimesheetClockInOut200ResponseFromJSON,
    TimesheetsGetTimesheetClockInOut200ResponseToJSON,
    TimesheetsGetTimesheetClockInOutRequestFromJSON,
    TimesheetsGetTimesheetClockInOutRequestToJSON,
    TimesheetsGetTimesheetDetails200ResponseFromJSON,
    TimesheetsGetTimesheetDetails200ResponseToJSON,
    TimesheetsGetTimesheetList200ResponseFromJSON,
    TimesheetsGetTimesheetList200ResponseToJSON,
    TimesheetsGetTimesheetListRequestFromJSON,
    TimesheetsGetTimesheetListRequestToJSON,
    TimesheetsSetAgencyTimesheetApproval200ResponseFromJSON,
    TimesheetsSetAgencyTimesheetApproval200ResponseToJSON,
    TimesheetsSetAgencyTimesheetApprovalRequestFromJSON,
    TimesheetsSetAgencyTimesheetApprovalRequestToJSON,
    TimesheetsTimesheetConfirmImport200ResponseFromJSON,
    TimesheetsTimesheetConfirmImport200ResponseToJSON,
    TimesheetsTimesheetConfirmImportRequestFromJSON,
    TimesheetsTimesheetConfirmImportRequestToJSON,
    ValidationProblemFromJSON,
    ValidationProblemToJSON,
} from '../models/index.js';

export interface TimesheetsAddTimesheetNoteOperationRequest {
    timesheetsAddTimesheetNoteRequest: TimesheetsAddTimesheetNoteRequest;
}

export interface TimesheetsAddUpdateTimesheetOperationRequest {
    timesheetsAddUpdateTimesheetRequest: TimesheetsAddUpdateTimesheetRequest;
}

export interface TimesheetsBulkActionTimesheetStatusUpdateOperationRequest {
    timesheetsBulkActionTimesheetStatusUpdateRequest: TimesheetsBulkActionTimesheetStatusUpdateRequest;
}

export interface TimesheetsGenerateTimesheetsForPayPeriodOperationRequest {
    timesheetsGenerateTimesheetsForPayPeriodRequest: TimesheetsGenerateTimesheetsForPayPeriodRequest;
}

export interface TimesheetsGetAgencyTimesheetDetailRequest {
    tblAgencyPlacementId: string;
    tblTenantId?: string;
}

export interface TimesheetsGetAgencyTimesheetsOperationRequest {
    timesheetsGetAgencyTimesheetsRequest: TimesheetsGetAgencyTimesheetsRequest;
}

export interface TimesheetsGetPayRunCutoffRequest {
    payPeriodEndDate: string;
    tenantId?: string;
}

export interface TimesheetsGetPayRunScheduleRequest {
    tenantId?: string;
}

export interface TimesheetsGetPayrollCycleSettingsRequest {
    tenantId: string;
}

export interface TimesheetsGetTimesheetAttendanceRequest {
    timesheetId: string;
}

export interface TimesheetsGetTimesheetAuditHistoryRequest {
    timesheetId: string;
}

export interface TimesheetsGetTimesheetClockInOutOperationRequest {
    timesheetsGetTimesheetClockInOutRequest: TimesheetsGetTimesheetClockInOutRequest;
}

export interface TimesheetsGetTimesheetDetailsRequest {
    timesheetId: string;
}

export interface TimesheetsGetTimesheetListOperationRequest {
    timesheetsGetTimesheetListRequest: TimesheetsGetTimesheetListRequest;
}

export interface TimesheetsSetAgencyTimesheetApprovalOperationRequest {
    timesheetsSetAgencyTimesheetApprovalRequest: TimesheetsSetAgencyTimesheetApprovalRequest;
}

export interface TimesheetsTimesheetConfirmImportOperationRequest {
    timesheetsTimesheetConfirmImportRequest: TimesheetsTimesheetConfirmImportRequest;
}

/**
 * TimesheetsPayrollApi - interface
 * 
 * @export
 * @interface TimesheetsPayrollApiInterface
 */
export interface TimesheetsPayrollApiInterface {
    /**
     * Adds a note to a timesheet. The note names no author. The staff member stored on the timesheet is told about it, by notification when they have a login and otherwise by email to their stored address; you cannot choose the recipient, and when there is nobody to tell the note is saved and the message says so. A failed notification does not undo the note.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * @summary Add a note to a timesheet
     * @param {TimesheetsAddTimesheetNoteRequest} timesheetsAddTimesheetNoteRequest The note.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsAddTimesheetNoteRaw(requestParameters: TimesheetsAddTimesheetNoteOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsAddTimesheetNote200Response>>;

    /**
     * Adds a note to a timesheet. The note names no author. The staff member stored on the timesheet is told about it, by notification when they have a login and otherwise by email to their stored address; you cannot choose the recipient, and when there is nobody to tell the note is saved and the message says so. A failed notification does not undo the note.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Add a note to a timesheet
     */
    timesheetsAddTimesheetNote(requestParameters: TimesheetsAddTimesheetNoteOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsAddTimesheetNote200Response>;

    /**
     * Creates a timesheet when `tblTimesheetId` is the all-zero id, otherwise updates that timesheet, and returns its id in `data`. On create the staff member must belong to your organisation; on update the stored timesheet decides the organisation, and `tblTenantId` may be empty or your own (any other is refused with 403).  Approval rules: saving with `status` Approved or Rejected also needs `timesheets.approve`, and so does saving an Approved timesheet back to Pending (reopening it). With `timesheets.write` alone those saves are refused with 403. `isDraft` true saves without submitting; false or omitted submits. An approved timesheet cannot be saved as a draft (409). A save is also refused with 409 when a timesheet already exists for that staff member and pay period, or when the pay run for the period has closed; and with 400 when a location, leave request, roster shift, attendance session or device break does not belong to this staff member in your organisation.  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * @summary Create or update a timesheet
     * @param {TimesheetsAddUpdateTimesheetRequest} timesheetsAddUpdateTimesheetRequest The timesheet to save.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsAddUpdateTimesheetRaw(requestParameters: TimesheetsAddUpdateTimesheetOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsAddUpdateTimesheet200Response>>;

    /**
     * Creates a timesheet when `tblTimesheetId` is the all-zero id, otherwise updates that timesheet, and returns its id in `data`. On create the staff member must belong to your organisation; on update the stored timesheet decides the organisation, and `tblTenantId` may be empty or your own (any other is refused with 403).  Approval rules: saving with `status` Approved or Rejected also needs `timesheets.approve`, and so does saving an Approved timesheet back to Pending (reopening it). With `timesheets.write` alone those saves are refused with 403. `isDraft` true saves without submitting; false or omitted submits. An approved timesheet cannot be saved as a draft (409). A save is also refused with 409 when a timesheet already exists for that staff member and pay period, or when the pay run for the period has closed; and with 400 when a location, leave request, roster shift, attendance session or device break does not belong to this staff member in your organisation.  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Create or update a timesheet
     */
    timesheetsAddUpdateTimesheet(requestParameters: TimesheetsAddUpdateTimesheetOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsAddUpdateTimesheet200Response>;

    /**
     * Sets the status of one or more timesheets in one call: Approved, Rejected, or Pending (reopening an approved or rejected timesheet). `timesheets.approve` covers all three and does not include `timesheets.write`. An optional note is added to each timesheet, and with `isEmail` true each staff member is emailed the decision.  Every id must be a timesheet in your organisation, or the whole call is refused with 403 before anything changes. Drafts are skipped because they have not been submitted; if every timesheet named is a draft the call answers 404 and nothing changes.  **Required scope:** `timesheets.approve`  See **Responses** below for the status codes this operation can return.
     * @summary Approve, reject or reopen timesheets
     * @param {TimesheetsBulkActionTimesheetStatusUpdateRequest} timesheetsBulkActionTimesheetStatusUpdateRequest The timesheets and the new status.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsBulkActionTimesheetStatusUpdateRaw(requestParameters: TimesheetsBulkActionTimesheetStatusUpdateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsBulkActionTimesheetStatusUpdate200Response>>;

    /**
     * Sets the status of one or more timesheets in one call: Approved, Rejected, or Pending (reopening an approved or rejected timesheet). `timesheets.approve` covers all three and does not include `timesheets.write`. An optional note is added to each timesheet, and with `isEmail` true each staff member is emailed the decision.  Every id must be a timesheet in your organisation, or the whole call is refused with 403 before anything changes. Drafts are skipped because they have not been submitted; if every timesheet named is a draft the call answers 404 and nothing changes.  **Required scope:** `timesheets.approve`  See **Responses** below for the status codes this operation can return.
     * Approve, reject or reopen timesheets
     */
    timesheetsBulkActionTimesheetStatusUpdate(requestParameters: TimesheetsBulkActionTimesheetStatusUpdateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsBulkActionTimesheetStatusUpdate200Response>;

    /**
     * Creates a blank, submitted timesheet for every active staff member of your organisation (not archived, and employed at some point in the period) who does not already have one for the pay period containing `asOfDate`. The period comes from your payroll cycle, not from the request, and is returned with the counts. Staff who already have a timesheet are skipped, so running it again is safe. Each new timesheet sends `timesheet.created`. A generated blank does not send `timesheet.submitted`, because nobody has handed it in; that event comes later, when a save puts shifts on it and submits it.  `asOfDate` must be today (one day either side is allowed for time zones). Refused with 400 when no payroll cycle is set up or the date is out of range, and with 409 when the pay run for the period has closed or another run for your organisation is in progress. `tblTenantId` may be empty or your own organisation.  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * @summary Create blank timesheets for the current pay period
     * @param {TimesheetsGenerateTimesheetsForPayPeriodRequest} timesheetsGenerateTimesheetsForPayPeriodRequest The date to generate for.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsGenerateTimesheetsForPayPeriodRaw(requestParameters: TimesheetsGenerateTimesheetsForPayPeriodOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGenerateTimesheetsForPayPeriod200Response>>;

    /**
     * Creates a blank, submitted timesheet for every active staff member of your organisation (not archived, and employed at some point in the period) who does not already have one for the pay period containing `asOfDate`. The period comes from your payroll cycle, not from the request, and is returned with the counts. Staff who already have a timesheet are skipped, so running it again is safe. Each new timesheet sends `timesheet.created`. A generated blank does not send `timesheet.submitted`, because nobody has handed it in; that event comes later, when a save puts shifts on it and submits it.  `asOfDate` must be today (one day either side is allowed for time zones). Refused with 400 when no payroll cycle is set up or the date is out of range, and with 409 when the pay run for the period has closed or another run for your organisation is in progress. `tblTenantId` may be empty or your own organisation.  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Create blank timesheets for the current pay period
     */
    timesheetsGenerateTimesheetsForPayPeriod(requestParameters: TimesheetsGenerateTimesheetsForPayPeriodOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGenerateTimesheetsForPayPeriod200Response>;

    /**
     * Returns one agency shift in full: the row as listed, the per-day segments its amount is made of (an overnight shift has one per day, each priced on its own date at the base, weekend or public holiday rate), the breaks punched, and which rate card row or agreed rate the price came from.  `tblAgencyPlacementId` is the `tblAgencyPlacementId` of a row from *List agency timesheets for a date range*. A shift at another organisation and an unknown id both answer 404. Leave `tblTenantId` out or send your own organisation id; any other organisation is refused with 403.  Rates and amounts need `pay_conditions.read`; without it they are null.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one agency timesheet with its daily breakdown
     * @param {string} tblAgencyPlacementId The agency timesheet, as &#x60;tblAgencyPlacementId&#x60; on a listed row.
     * @param {string} [tblTenantId] Your organisation id, or leave it out. Any other organisation is refused with 403.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsGetAgencyTimesheetDetailRaw(requestParameters: TimesheetsGetAgencyTimesheetDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetAgencyTimesheetDetail200Response>>;

    /**
     * Returns one agency shift in full: the row as listed, the per-day segments its amount is made of (an overnight shift has one per day, each priced on its own date at the base, weekend or public holiday rate), the breaks punched, and which rate card row or agreed rate the price came from.  `tblAgencyPlacementId` is the `tblAgencyPlacementId` of a row from *List agency timesheets for a date range*. A shift at another organisation and an unknown id both answer 404. Leave `tblTenantId` out or send your own organisation id; any other organisation is refused with 403.  Rates and amounts need `pay_conditions.read`; without it they are null.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Get one agency timesheet with its daily breakdown
     */
    timesheetsGetAgencyTimesheetDetail(requestParameters: TimesheetsGetAgencyTimesheetDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetAgencyTimesheetDetail200Response>;

    /**
     * Returns one page of the shifts agency-supplied workers were booked for at your organisation over a date range, each with its rostered and clocked hours and what it comes to at the agency\'s rate, plus totals for the whole range (hours, amount, GST, counts by status and decision, and a split by agency). An agency worker has no timesheet of their own, so the hours they clock at your locations appear here and never in *List timesheets for a pay period*.  `fromDate` and `toDate` are required whole days, both inclusive; a shift overlapping the range is included, newest first, and a cancelled shift nobody started is left out. Leave `tblTenantId` empty or send your own organisation id; any other organisation is refused with 403. Rates and amounts are in AUD, GST inclusive. The agency that supplied the worker reads the same shifts and your decision on each through its own integration, but only you can approve or decline them.  Rates and amounts need `pay_conditions.read`; without it they are null.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * @summary List agency timesheets for a date range
     * @param {TimesheetsGetAgencyTimesheetsRequest} timesheetsGetAgencyTimesheetsRequest The date range, filters and paging.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsGetAgencyTimesheetsRaw(requestParameters: TimesheetsGetAgencyTimesheetsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetAgencyTimesheets200Response>>;

    /**
     * Returns one page of the shifts agency-supplied workers were booked for at your organisation over a date range, each with its rostered and clocked hours and what it comes to at the agency\'s rate, plus totals for the whole range (hours, amount, GST, counts by status and decision, and a split by agency). An agency worker has no timesheet of their own, so the hours they clock at your locations appear here and never in *List timesheets for a pay period*.  `fromDate` and `toDate` are required whole days, both inclusive; a shift overlapping the range is included, newest first, and a cancelled shift nobody started is left out. Leave `tblTenantId` empty or send your own organisation id; any other organisation is refused with 403. Rates and amounts are in AUD, GST inclusive. The agency that supplied the worker reads the same shifts and your decision on each through its own integration, but only you can approve or decline them.  Rates and amounts need `pay_conditions.read`; without it they are null.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * List agency timesheets for a date range
     */
    timesheetsGetAgencyTimesheets(requestParameters: TimesheetsGetAgencyTimesheetsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetAgencyTimesheets200Response>;

    /**
     * Returns when the pay run closes for the pay period ending on `payPeriodEndDate`. After that moment, timesheets for the period can no longer be saved.  When `isConfigured` is false your organisation has no pay run schedule, `closesAtUtc` is null and no cutoff applies. `tenantId` may be empty or your own organisation.  **Required scope:** `payroll.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get when a pay run closes
     * @param {string} payPeriodEndDate The last day of the pay period.
     * @param {string} [tenantId] Your organisation id. Optional; any other organisation is refused with 403.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsGetPayRunCutoffRaw(requestParameters: TimesheetsGetPayRunCutoffRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetPayRunCutoff200Response>>;

    /**
     * Returns when the pay run closes for the pay period ending on `payPeriodEndDate`. After that moment, timesheets for the period can no longer be saved.  When `isConfigured` is false your organisation has no pay run schedule, `closesAtUtc` is null and no cutoff applies. `tenantId` may be empty or your own organisation.  **Required scope:** `payroll.read`  See **Responses** below for the status codes this operation can return.
     * Get when a pay run closes
     */
    timesheetsGetPayRunCutoff(requestParameters: TimesheetsGetPayRunCutoffRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetPayRunCutoff200Response>;

    /**
     * Returns your organisation\'s pay run schedule: how many days after a pay period ends the pay run closes, at what time, and when staff are paid.  When `isConfigured` is false there is no schedule, so no pay run ever closes and every other field except `tblTenantId` is null. A `cutoffOffsetDays` of 0 is a real setting (the run closes on the period end date). `tenantId` may be empty or your own organisation.  **Required scope:** `payroll.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get the pay run schedule
     * @param {string} [tenantId] Your organisation id. Optional; any other organisation is refused with 403.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsGetPayRunScheduleRaw(requestParameters: TimesheetsGetPayRunScheduleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetPayRunSchedule200Response>>;

    /**
     * Returns your organisation\'s pay run schedule: how many days after a pay period ends the pay run closes, at what time, and when staff are paid.  When `isConfigured` is false there is no schedule, so no pay run ever closes and every other field except `tblTenantId` is null. A `cutoffOffsetDays` of 0 is a real setting (the run closes on the period end date). `tenantId` may be empty or your own organisation.  **Required scope:** `payroll.read`  See **Responses** below for the status codes this operation can return.
     * Get the pay run schedule
     */
    timesheetsGetPayRunSchedule(requestParameters: TimesheetsGetPayRunScheduleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetPayRunSchedule200Response>;

    /**
     * Returns your organisation\'s payroll cycle: the date the cycle is anchored on and how often it repeats. Pay periods for timesheets and imports are worked out from it.  `tenantId` is required and must be your organisation (any other is refused with 403). When no cycle is set up, `data` is null.  **Required scope:** `payroll.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get the payroll cycle
     * @param {string} tenantId Your organisation id. Required; any other organisation is refused with 403.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsGetPayrollCycleSettingsRaw(requestParameters: TimesheetsGetPayrollCycleSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetPayrollCycleSettings200Response>>;

    /**
     * Returns your organisation\'s payroll cycle: the date the cycle is anchored on and how often it repeats. Pay periods for timesheets and imports are worked out from it.  `tenantId` is required and must be your organisation (any other is refused with 403). When no cycle is set up, `data` is null.  **Required scope:** `payroll.read`  See **Responses** below for the status codes this operation can return.
     * Get the payroll cycle
     */
    timesheetsGetPayrollCycleSettings(requestParameters: TimesheetsGetPayrollCycleSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetPayrollCycleSettings200Response>;

    /**
     * Returns the attendance sessions (device clock-ins, converted to each location\'s local time) and the published roster shifts that this timesheet\'s shifts can be linked to. Use the ids with `attendanceSessionId` and `rosterShiftId` when saving the timesheet.  When a location has no time zone set, `timeZoneResolved` is false and the local times are null rather than guessed. The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get attendance and roster shifts for a timesheet
     * @param {string} timesheetId The timesheet id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsGetTimesheetAttendanceRaw(requestParameters: TimesheetsGetTimesheetAttendanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetTimesheetAttendance200Response>>;

    /**
     * Returns the attendance sessions (device clock-ins, converted to each location\'s local time) and the published roster shifts that this timesheet\'s shifts can be linked to. Use the ids with `attendanceSessionId` and `rosterShiftId` when saving the timesheet.  When a location has no time zone set, `timeZoneResolved` is false and the local times are null rather than guessed. The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Get attendance and roster shifts for a timesheet
     */
    timesheetsGetTimesheetAttendance(requestParameters: TimesheetsGetTimesheetAttendanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetTimesheetAttendance200Response>;

    /**
     * Returns who changed the timesheet, in what role, when, and a plain description of what changed, newest first.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get a timesheet\'s change history
     * @param {string} timesheetId The timesheet id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsGetTimesheetAuditHistoryRaw(requestParameters: TimesheetsGetTimesheetAuditHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetTimesheetAuditHistory200Response>>;

    /**
     * Returns who changed the timesheet, in what role, when, and a plain description of what changed, newest first.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Get a timesheet\'s change history
     */
    timesheetsGetTimesheetAuditHistory(requestParameters: TimesheetsGetTimesheetAuditHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetTimesheetAuditHistory200Response>;

    /**
     * Returns the clock-in and clock-out of every shift on the timesheet as separate events, with the location of each, one page at a time.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * @summary List clock-in and clock-out events for a timesheet
     * @param {TimesheetsGetTimesheetClockInOutRequest} timesheetsGetTimesheetClockInOutRequest The timesheet and paging.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsGetTimesheetClockInOutRaw(requestParameters: TimesheetsGetTimesheetClockInOutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetTimesheetClockInOut200Response>>;

    /**
     * Returns the clock-in and clock-out of every shift on the timesheet as separate events, with the location of each, one page at a time.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * List clock-in and clock-out events for a timesheet
     */
    timesheetsGetTimesheetClockInOut(requestParameters: TimesheetsGetTimesheetClockInOutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetTimesheetClockInOut200Response>;

    /**
     * Returns a timesheet with every shift, break, allowance claim and note on it.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  Each shift\'s `dailyAmount` needs `pay_conditions.read`; without it the amount is null.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one timesheet with its shifts
     * @param {string} timesheetId The timesheet id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsGetTimesheetDetailsRaw(requestParameters: TimesheetsGetTimesheetDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetTimesheetDetails200Response>>;

    /**
     * Returns a timesheet with every shift, break, allowance claim and note on it.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  Each shift\'s `dailyAmount` needs `pay_conditions.read`; without it the amount is null.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Get one timesheet with its shifts
     */
    timesheetsGetTimesheetDetails(requestParameters: TimesheetsGetTimesheetDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetTimesheetDetails200Response>;

    /**
     * Returns one page of your organisation\'s timesheets whose pay period overlaps the dates you send, with totals for the period (pending, approved, rejected, hours and cost) and the change against the previous period.  Leave `tenantId` empty or send your own organisation id; any other organisation is refused with 403. `timesheetStatus` must be Pending, Approved or Rejected when sent. Drafts are listed as Pending with `isDraft` true.  Cost figures need `pay_conditions.read`: without it they are null, and `sortBy=cost` is ignored.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * @summary List timesheets for a pay period
     * @param {TimesheetsGetTimesheetListRequest} timesheetsGetTimesheetListRequest Filters and paging.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsGetTimesheetListRaw(requestParameters: TimesheetsGetTimesheetListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetTimesheetList200Response>>;

    /**
     * Returns one page of your organisation\'s timesheets whose pay period overlaps the dates you send, with totals for the period (pending, approved, rejected, hours and cost) and the change against the previous period.  Leave `tenantId` empty or send your own organisation id; any other organisation is refused with 403. `timesheetStatus` must be Pending, Approved or Rejected when sent. Drafts are listed as Pending with `isDraft` true.  Cost figures need `pay_conditions.read`: without it they are null, and `sortBy=cost` is ignored.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * List timesheets for a pay period
     */
    timesheetsGetTimesheetList(requestParameters: TimesheetsGetTimesheetListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetTimesheetList200Response>;

    /**
     * Records your decision on one or more agency shifts in one call: 1 Approved, 2 Declined, or 0 Pending to withdraw an earlier decision. Declining needs a `note` saying why, which the agency is shown; approving or withdrawing clears any earlier note. Approving the hours completes the booking for the agency, which makes it billable. A booked shift can only be approved once it has ended at its location and the worker has clocked out; if any shift in the set has not, nothing is saved and the call answers 400 with those shifts in `data.tblAgencyTimesheetKeys`. Declining and withdrawing are not held back. The whole set is saved together, and a shift that is not yours or does not exist answers 404 with nothing saved.  Send the `tblAgencyPlacementId` of each row from *List agency timesheets for a date range* in `tblAgencyTimesheetKeys`, at most 500 per call. Leave `tblTenantId` empty or send your own organisation id; any other organisation is refused with 403. Only the client decides: an agency may read these timesheets but never approve or decline them.  **Required scope:** `timesheets.approve`  See **Responses** below for the status codes this operation can return.
     * @summary Approve or decline agency timesheets
     * @param {TimesheetsSetAgencyTimesheetApprovalRequest} timesheetsSetAgencyTimesheetApprovalRequest The agency timesheets and your decision.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsSetAgencyTimesheetApprovalRaw(requestParameters: TimesheetsSetAgencyTimesheetApprovalOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsSetAgencyTimesheetApproval200Response>>;

    /**
     * Records your decision on one or more agency shifts in one call: 1 Approved, 2 Declined, or 0 Pending to withdraw an earlier decision. Declining needs a `note` saying why, which the agency is shown; approving or withdrawing clears any earlier note. Approving the hours completes the booking for the agency, which makes it billable. A booked shift can only be approved once it has ended at its location and the worker has clocked out; if any shift in the set has not, nothing is saved and the call answers 400 with those shifts in `data.tblAgencyTimesheetKeys`. Declining and withdrawing are not held back. The whole set is saved together, and a shift that is not yours or does not exist answers 404 with nothing saved.  Send the `tblAgencyPlacementId` of each row from *List agency timesheets for a date range* in `tblAgencyTimesheetKeys`, at most 500 per call. Leave `tblTenantId` empty or send your own organisation id; any other organisation is refused with 403. Only the client decides: an agency may read these timesheets but never approve or decline them.  **Required scope:** `timesheets.approve`  See **Responses** below for the status codes this operation can return.
     * Approve or decline agency timesheets
     */
    timesheetsSetAgencyTimesheetApproval(requestParameters: TimesheetsSetAgencyTimesheetApprovalOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsSetAgencyTimesheetApproval200Response>;

    /**
     * Imports worked shifts in bulk. Each row is matched to a current staff member of your organisation by email and placed in the pay period that contains its date, using your payroll cycle. Rows for the same staff member and pay period go on one timesheet: a new one is created, or the existing one is updated. A row with the same day, clock-in and clock-out as a stored shift updates it; otherwise it is added as a new shift.  Send `isImport` false to preview: nothing is saved, and the counts show what would happen. Send `isImport` true to save. Imported and updated timesheets are saved as submitted (Pending, not a draft). Updating an existing timesheet sets it back to Pending even when it was Approved, so check its status first. The call answers 200 even when nothing could be imported; check `success` and `fatalErrors` (for example, no payroll cycle set up).  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * @summary Import timesheet rows
     * @param {TimesheetsTimesheetConfirmImportRequest} timesheetsTimesheetConfirmImportRequest The rows to import.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TimesheetsPayrollApiInterface
     */
    timesheetsTimesheetConfirmImportRaw(requestParameters: TimesheetsTimesheetConfirmImportOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsTimesheetConfirmImport200Response>>;

    /**
     * Imports worked shifts in bulk. Each row is matched to a current staff member of your organisation by email and placed in the pay period that contains its date, using your payroll cycle. Rows for the same staff member and pay period go on one timesheet: a new one is created, or the existing one is updated. A row with the same day, clock-in and clock-out as a stored shift updates it; otherwise it is added as a new shift.  Send `isImport` false to preview: nothing is saved, and the counts show what would happen. Send `isImport` true to save. Imported and updated timesheets are saved as submitted (Pending, not a draft). Updating an existing timesheet sets it back to Pending even when it was Approved, so check its status first. The call answers 200 even when nothing could be imported; check `success` and `fatalErrors` (for example, no payroll cycle set up).  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Import timesheet rows
     */
    timesheetsTimesheetConfirmImport(requestParameters: TimesheetsTimesheetConfirmImportOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsTimesheetConfirmImport200Response>;

}

/**
 * 
 */
export class TimesheetsPayrollApi extends runtime.BaseAPI implements TimesheetsPayrollApiInterface {

    /**
     * Adds a note to a timesheet. The note names no author. The staff member stored on the timesheet is told about it, by notification when they have a login and otherwise by email to their stored address; you cannot choose the recipient, and when there is nobody to tell the note is saved and the message says so. A failed notification does not undo the note.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Add a note to a timesheet
     */
    async timesheetsAddTimesheetNoteRaw(requestParameters: TimesheetsAddTimesheetNoteOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsAddTimesheetNote200Response>> {
        if (requestParameters['timesheetsAddTimesheetNoteRequest'] == null) {
            throw new runtime.RequiredError(
                'timesheetsAddTimesheetNoteRequest',
                'Required parameter "timesheetsAddTimesheetNoteRequest" was null or undefined when calling timesheetsAddTimesheetNote().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["timesheets.write"]);
        }


        let urlPath = `/timesheet/add-timesheet-note`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TimesheetsAddTimesheetNoteRequestToJSON(requestParameters['timesheetsAddTimesheetNoteRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsAddTimesheetNote200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds a note to a timesheet. The note names no author. The staff member stored on the timesheet is told about it, by notification when they have a login and otherwise by email to their stored address; you cannot choose the recipient, and when there is nobody to tell the note is saved and the message says so. A failed notification does not undo the note.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Add a note to a timesheet
     */
    async timesheetsAddTimesheetNote(requestParameters: TimesheetsAddTimesheetNoteOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsAddTimesheetNote200Response> {
        const response = await this.timesheetsAddTimesheetNoteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates a timesheet when `tblTimesheetId` is the all-zero id, otherwise updates that timesheet, and returns its id in `data`. On create the staff member must belong to your organisation; on update the stored timesheet decides the organisation, and `tblTenantId` may be empty or your own (any other is refused with 403).  Approval rules: saving with `status` Approved or Rejected also needs `timesheets.approve`, and so does saving an Approved timesheet back to Pending (reopening it). With `timesheets.write` alone those saves are refused with 403. `isDraft` true saves without submitting; false or omitted submits. An approved timesheet cannot be saved as a draft (409). A save is also refused with 409 when a timesheet already exists for that staff member and pay period, or when the pay run for the period has closed; and with 400 when a location, leave request, roster shift, attendance session or device break does not belong to this staff member in your organisation.  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Create or update a timesheet
     */
    async timesheetsAddUpdateTimesheetRaw(requestParameters: TimesheetsAddUpdateTimesheetOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsAddUpdateTimesheet200Response>> {
        if (requestParameters['timesheetsAddUpdateTimesheetRequest'] == null) {
            throw new runtime.RequiredError(
                'timesheetsAddUpdateTimesheetRequest',
                'Required parameter "timesheetsAddUpdateTimesheetRequest" was null or undefined when calling timesheetsAddUpdateTimesheet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["timesheets.write"]);
        }


        let urlPath = `/timesheet/add-update-timesheet`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TimesheetsAddUpdateTimesheetRequestToJSON(requestParameters['timesheetsAddUpdateTimesheetRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsAddUpdateTimesheet200ResponseFromJSON(jsonValue));
    }

    /**
     * Creates a timesheet when `tblTimesheetId` is the all-zero id, otherwise updates that timesheet, and returns its id in `data`. On create the staff member must belong to your organisation; on update the stored timesheet decides the organisation, and `tblTenantId` may be empty or your own (any other is refused with 403).  Approval rules: saving with `status` Approved or Rejected also needs `timesheets.approve`, and so does saving an Approved timesheet back to Pending (reopening it). With `timesheets.write` alone those saves are refused with 403. `isDraft` true saves without submitting; false or omitted submits. An approved timesheet cannot be saved as a draft (409). A save is also refused with 409 when a timesheet already exists for that staff member and pay period, or when the pay run for the period has closed; and with 400 when a location, leave request, roster shift, attendance session or device break does not belong to this staff member in your organisation.  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Create or update a timesheet
     */
    async timesheetsAddUpdateTimesheet(requestParameters: TimesheetsAddUpdateTimesheetOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsAddUpdateTimesheet200Response> {
        const response = await this.timesheetsAddUpdateTimesheetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Sets the status of one or more timesheets in one call: Approved, Rejected, or Pending (reopening an approved or rejected timesheet). `timesheets.approve` covers all three and does not include `timesheets.write`. An optional note is added to each timesheet, and with `isEmail` true each staff member is emailed the decision.  Every id must be a timesheet in your organisation, or the whole call is refused with 403 before anything changes. Drafts are skipped because they have not been submitted; if every timesheet named is a draft the call answers 404 and nothing changes.  **Required scope:** `timesheets.approve`  See **Responses** below for the status codes this operation can return.
     * Approve, reject or reopen timesheets
     */
    async timesheetsBulkActionTimesheetStatusUpdateRaw(requestParameters: TimesheetsBulkActionTimesheetStatusUpdateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsBulkActionTimesheetStatusUpdate200Response>> {
        if (requestParameters['timesheetsBulkActionTimesheetStatusUpdateRequest'] == null) {
            throw new runtime.RequiredError(
                'timesheetsBulkActionTimesheetStatusUpdateRequest',
                'Required parameter "timesheetsBulkActionTimesheetStatusUpdateRequest" was null or undefined when calling timesheetsBulkActionTimesheetStatusUpdate().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["timesheets.approve"]);
        }


        let urlPath = `/timesheet/bulk-action-timesheet-status-update`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TimesheetsBulkActionTimesheetStatusUpdateRequestToJSON(requestParameters['timesheetsBulkActionTimesheetStatusUpdateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsBulkActionTimesheetStatusUpdate200ResponseFromJSON(jsonValue));
    }

    /**
     * Sets the status of one or more timesheets in one call: Approved, Rejected, or Pending (reopening an approved or rejected timesheet). `timesheets.approve` covers all three and does not include `timesheets.write`. An optional note is added to each timesheet, and with `isEmail` true each staff member is emailed the decision.  Every id must be a timesheet in your organisation, or the whole call is refused with 403 before anything changes. Drafts are skipped because they have not been submitted; if every timesheet named is a draft the call answers 404 and nothing changes.  **Required scope:** `timesheets.approve`  See **Responses** below for the status codes this operation can return.
     * Approve, reject or reopen timesheets
     */
    async timesheetsBulkActionTimesheetStatusUpdate(requestParameters: TimesheetsBulkActionTimesheetStatusUpdateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsBulkActionTimesheetStatusUpdate200Response> {
        const response = await this.timesheetsBulkActionTimesheetStatusUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates a blank, submitted timesheet for every active staff member of your organisation (not archived, and employed at some point in the period) who does not already have one for the pay period containing `asOfDate`. The period comes from your payroll cycle, not from the request, and is returned with the counts. Staff who already have a timesheet are skipped, so running it again is safe. Each new timesheet sends `timesheet.created`. A generated blank does not send `timesheet.submitted`, because nobody has handed it in; that event comes later, when a save puts shifts on it and submits it.  `asOfDate` must be today (one day either side is allowed for time zones). Refused with 400 when no payroll cycle is set up or the date is out of range, and with 409 when the pay run for the period has closed or another run for your organisation is in progress. `tblTenantId` may be empty or your own organisation.  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Create blank timesheets for the current pay period
     */
    async timesheetsGenerateTimesheetsForPayPeriodRaw(requestParameters: TimesheetsGenerateTimesheetsForPayPeriodOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGenerateTimesheetsForPayPeriod200Response>> {
        if (requestParameters['timesheetsGenerateTimesheetsForPayPeriodRequest'] == null) {
            throw new runtime.RequiredError(
                'timesheetsGenerateTimesheetsForPayPeriodRequest',
                'Required parameter "timesheetsGenerateTimesheetsForPayPeriodRequest" was null or undefined when calling timesheetsGenerateTimesheetsForPayPeriod().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["timesheets.write"]);
        }


        let urlPath = `/timesheet/generate-timesheets-for-pay-period`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TimesheetsGenerateTimesheetsForPayPeriodRequestToJSON(requestParameters['timesheetsGenerateTimesheetsForPayPeriodRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsGenerateTimesheetsForPayPeriod200ResponseFromJSON(jsonValue));
    }

    /**
     * Creates a blank, submitted timesheet for every active staff member of your organisation (not archived, and employed at some point in the period) who does not already have one for the pay period containing `asOfDate`. The period comes from your payroll cycle, not from the request, and is returned with the counts. Staff who already have a timesheet are skipped, so running it again is safe. Each new timesheet sends `timesheet.created`. A generated blank does not send `timesheet.submitted`, because nobody has handed it in; that event comes later, when a save puts shifts on it and submits it.  `asOfDate` must be today (one day either side is allowed for time zones). Refused with 400 when no payroll cycle is set up or the date is out of range, and with 409 when the pay run for the period has closed or another run for your organisation is in progress. `tblTenantId` may be empty or your own organisation.  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Create blank timesheets for the current pay period
     */
    async timesheetsGenerateTimesheetsForPayPeriod(requestParameters: TimesheetsGenerateTimesheetsForPayPeriodOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGenerateTimesheetsForPayPeriod200Response> {
        const response = await this.timesheetsGenerateTimesheetsForPayPeriodRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one agency shift in full: the row as listed, the per-day segments its amount is made of (an overnight shift has one per day, each priced on its own date at the base, weekend or public holiday rate), the breaks punched, and which rate card row or agreed rate the price came from.  `tblAgencyPlacementId` is the `tblAgencyPlacementId` of a row from *List agency timesheets for a date range*. A shift at another organisation and an unknown id both answer 404. Leave `tblTenantId` out or send your own organisation id; any other organisation is refused with 403.  Rates and amounts need `pay_conditions.read`; without it they are null.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Get one agency timesheet with its daily breakdown
     */
    async timesheetsGetAgencyTimesheetDetailRaw(requestParameters: TimesheetsGetAgencyTimesheetDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetAgencyTimesheetDetail200Response>> {
        if (requestParameters['tblAgencyPlacementId'] == null) {
            throw new runtime.RequiredError(
                'tblAgencyPlacementId',
                'Required parameter "tblAgencyPlacementId" was null or undefined when calling timesheetsGetAgencyTimesheetDetail().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tblAgencyPlacementId'] != null) {
            queryParameters['tblAgencyPlacementId'] = requestParameters['tblAgencyPlacementId'];
        }

        if (requestParameters['tblTenantId'] != null) {
            queryParameters['tblTenantId'] = requestParameters['tblTenantId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/timesheet/get-agency-timesheet-detail`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsGetAgencyTimesheetDetail200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one agency shift in full: the row as listed, the per-day segments its amount is made of (an overnight shift has one per day, each priced on its own date at the base, weekend or public holiday rate), the breaks punched, and which rate card row or agreed rate the price came from.  `tblAgencyPlacementId` is the `tblAgencyPlacementId` of a row from *List agency timesheets for a date range*. A shift at another organisation and an unknown id both answer 404. Leave `tblTenantId` out or send your own organisation id; any other organisation is refused with 403.  Rates and amounts need `pay_conditions.read`; without it they are null.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Get one agency timesheet with its daily breakdown
     */
    async timesheetsGetAgencyTimesheetDetail(requestParameters: TimesheetsGetAgencyTimesheetDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetAgencyTimesheetDetail200Response> {
        const response = await this.timesheetsGetAgencyTimesheetDetailRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one page of the shifts agency-supplied workers were booked for at your organisation over a date range, each with its rostered and clocked hours and what it comes to at the agency\'s rate, plus totals for the whole range (hours, amount, GST, counts by status and decision, and a split by agency). An agency worker has no timesheet of their own, so the hours they clock at your locations appear here and never in *List timesheets for a pay period*.  `fromDate` and `toDate` are required whole days, both inclusive; a shift overlapping the range is included, newest first, and a cancelled shift nobody started is left out. Leave `tblTenantId` empty or send your own organisation id; any other organisation is refused with 403. Rates and amounts are in AUD, GST inclusive. The agency that supplied the worker reads the same shifts and your decision on each through its own integration, but only you can approve or decline them.  Rates and amounts need `pay_conditions.read`; without it they are null.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * List agency timesheets for a date range
     */
    async timesheetsGetAgencyTimesheetsRaw(requestParameters: TimesheetsGetAgencyTimesheetsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetAgencyTimesheets200Response>> {
        if (requestParameters['timesheetsGetAgencyTimesheetsRequest'] == null) {
            throw new runtime.RequiredError(
                'timesheetsGetAgencyTimesheetsRequest',
                'Required parameter "timesheetsGetAgencyTimesheetsRequest" was null or undefined when calling timesheetsGetAgencyTimesheets().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/timesheet/get-agency-timesheets`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TimesheetsGetAgencyTimesheetsRequestToJSON(requestParameters['timesheetsGetAgencyTimesheetsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsGetAgencyTimesheets200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one page of the shifts agency-supplied workers were booked for at your organisation over a date range, each with its rostered and clocked hours and what it comes to at the agency\'s rate, plus totals for the whole range (hours, amount, GST, counts by status and decision, and a split by agency). An agency worker has no timesheet of their own, so the hours they clock at your locations appear here and never in *List timesheets for a pay period*.  `fromDate` and `toDate` are required whole days, both inclusive; a shift overlapping the range is included, newest first, and a cancelled shift nobody started is left out. Leave `tblTenantId` empty or send your own organisation id; any other organisation is refused with 403. Rates and amounts are in AUD, GST inclusive. The agency that supplied the worker reads the same shifts and your decision on each through its own integration, but only you can approve or decline them.  Rates and amounts need `pay_conditions.read`; without it they are null.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * List agency timesheets for a date range
     */
    async timesheetsGetAgencyTimesheets(requestParameters: TimesheetsGetAgencyTimesheetsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetAgencyTimesheets200Response> {
        const response = await this.timesheetsGetAgencyTimesheetsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns when the pay run closes for the pay period ending on `payPeriodEndDate`. After that moment, timesheets for the period can no longer be saved.  When `isConfigured` is false your organisation has no pay run schedule, `closesAtUtc` is null and no cutoff applies. `tenantId` may be empty or your own organisation.  **Required scope:** `payroll.read`  See **Responses** below for the status codes this operation can return.
     * Get when a pay run closes
     */
    async timesheetsGetPayRunCutoffRaw(requestParameters: TimesheetsGetPayRunCutoffRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetPayRunCutoff200Response>> {
        if (requestParameters['payPeriodEndDate'] == null) {
            throw new runtime.RequiredError(
                'payPeriodEndDate',
                'Required parameter "payPeriodEndDate" was null or undefined when calling timesheetsGetPayRunCutoff().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        if (requestParameters['payPeriodEndDate'] != null) {
            queryParameters['payPeriodEndDate'] = requestParameters['payPeriodEndDate'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["payroll.read"]);
        }


        let urlPath = `/timesheet/get-pay-run-cutoff`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsGetPayRunCutoff200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns when the pay run closes for the pay period ending on `payPeriodEndDate`. After that moment, timesheets for the period can no longer be saved.  When `isConfigured` is false your organisation has no pay run schedule, `closesAtUtc` is null and no cutoff applies. `tenantId` may be empty or your own organisation.  **Required scope:** `payroll.read`  See **Responses** below for the status codes this operation can return.
     * Get when a pay run closes
     */
    async timesheetsGetPayRunCutoff(requestParameters: TimesheetsGetPayRunCutoffRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetPayRunCutoff200Response> {
        const response = await this.timesheetsGetPayRunCutoffRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns your organisation\'s pay run schedule: how many days after a pay period ends the pay run closes, at what time, and when staff are paid.  When `isConfigured` is false there is no schedule, so no pay run ever closes and every other field except `tblTenantId` is null. A `cutoffOffsetDays` of 0 is a real setting (the run closes on the period end date). `tenantId` may be empty or your own organisation.  **Required scope:** `payroll.read`  See **Responses** below for the status codes this operation can return.
     * Get the pay run schedule
     */
    async timesheetsGetPayRunScheduleRaw(requestParameters: TimesheetsGetPayRunScheduleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetPayRunSchedule200Response>> {
        const queryParameters: any = {};

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["payroll.read"]);
        }


        let urlPath = `/timesheet/get-pay-run-schedule`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsGetPayRunSchedule200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns your organisation\'s pay run schedule: how many days after a pay period ends the pay run closes, at what time, and when staff are paid.  When `isConfigured` is false there is no schedule, so no pay run ever closes and every other field except `tblTenantId` is null. A `cutoffOffsetDays` of 0 is a real setting (the run closes on the period end date). `tenantId` may be empty or your own organisation.  **Required scope:** `payroll.read`  See **Responses** below for the status codes this operation can return.
     * Get the pay run schedule
     */
    async timesheetsGetPayRunSchedule(requestParameters: TimesheetsGetPayRunScheduleRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetPayRunSchedule200Response> {
        const response = await this.timesheetsGetPayRunScheduleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns your organisation\'s payroll cycle: the date the cycle is anchored on and how often it repeats. Pay periods for timesheets and imports are worked out from it.  `tenantId` is required and must be your organisation (any other is refused with 403). When no cycle is set up, `data` is null.  **Required scope:** `payroll.read`  See **Responses** below for the status codes this operation can return.
     * Get the payroll cycle
     */
    async timesheetsGetPayrollCycleSettingsRaw(requestParameters: TimesheetsGetPayrollCycleSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetPayrollCycleSettings200Response>> {
        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling timesheetsGetPayrollCycleSettings().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["payroll.read"]);
        }


        let urlPath = `/timesheet/get-payroll-cycle-settings`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsGetPayrollCycleSettings200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns your organisation\'s payroll cycle: the date the cycle is anchored on and how often it repeats. Pay periods for timesheets and imports are worked out from it.  `tenantId` is required and must be your organisation (any other is refused with 403). When no cycle is set up, `data` is null.  **Required scope:** `payroll.read`  See **Responses** below for the status codes this operation can return.
     * Get the payroll cycle
     */
    async timesheetsGetPayrollCycleSettings(requestParameters: TimesheetsGetPayrollCycleSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetPayrollCycleSettings200Response> {
        const response = await this.timesheetsGetPayrollCycleSettingsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the attendance sessions (device clock-ins, converted to each location\'s local time) and the published roster shifts that this timesheet\'s shifts can be linked to. Use the ids with `attendanceSessionId` and `rosterShiftId` when saving the timesheet.  When a location has no time zone set, `timeZoneResolved` is false and the local times are null rather than guessed. The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Get attendance and roster shifts for a timesheet
     */
    async timesheetsGetTimesheetAttendanceRaw(requestParameters: TimesheetsGetTimesheetAttendanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetTimesheetAttendance200Response>> {
        if (requestParameters['timesheetId'] == null) {
            throw new runtime.RequiredError(
                'timesheetId',
                'Required parameter "timesheetId" was null or undefined when calling timesheetsGetTimesheetAttendance().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['timesheetId'] != null) {
            queryParameters['timesheetId'] = requestParameters['timesheetId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/timesheet/get-timesheet-attendance`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsGetTimesheetAttendance200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the attendance sessions (device clock-ins, converted to each location\'s local time) and the published roster shifts that this timesheet\'s shifts can be linked to. Use the ids with `attendanceSessionId` and `rosterShiftId` when saving the timesheet.  When a location has no time zone set, `timeZoneResolved` is false and the local times are null rather than guessed. The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Get attendance and roster shifts for a timesheet
     */
    async timesheetsGetTimesheetAttendance(requestParameters: TimesheetsGetTimesheetAttendanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetTimesheetAttendance200Response> {
        const response = await this.timesheetsGetTimesheetAttendanceRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns who changed the timesheet, in what role, when, and a plain description of what changed, newest first.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Get a timesheet\'s change history
     */
    async timesheetsGetTimesheetAuditHistoryRaw(requestParameters: TimesheetsGetTimesheetAuditHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetTimesheetAuditHistory200Response>> {
        if (requestParameters['timesheetId'] == null) {
            throw new runtime.RequiredError(
                'timesheetId',
                'Required parameter "timesheetId" was null or undefined when calling timesheetsGetTimesheetAuditHistory().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['timesheetId'] != null) {
            queryParameters['timesheetId'] = requestParameters['timesheetId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/timesheet/get-timesheet-audit-history`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsGetTimesheetAuditHistory200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns who changed the timesheet, in what role, when, and a plain description of what changed, newest first.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Get a timesheet\'s change history
     */
    async timesheetsGetTimesheetAuditHistory(requestParameters: TimesheetsGetTimesheetAuditHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetTimesheetAuditHistory200Response> {
        const response = await this.timesheetsGetTimesheetAuditHistoryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the clock-in and clock-out of every shift on the timesheet as separate events, with the location of each, one page at a time.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * List clock-in and clock-out events for a timesheet
     */
    async timesheetsGetTimesheetClockInOutRaw(requestParameters: TimesheetsGetTimesheetClockInOutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetTimesheetClockInOut200Response>> {
        if (requestParameters['timesheetsGetTimesheetClockInOutRequest'] == null) {
            throw new runtime.RequiredError(
                'timesheetsGetTimesheetClockInOutRequest',
                'Required parameter "timesheetsGetTimesheetClockInOutRequest" was null or undefined when calling timesheetsGetTimesheetClockInOut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/timesheet/get-timesheet-clock-in-out`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TimesheetsGetTimesheetClockInOutRequestToJSON(requestParameters['timesheetsGetTimesheetClockInOutRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsGetTimesheetClockInOut200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the clock-in and clock-out of every shift on the timesheet as separate events, with the location of each, one page at a time.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * List clock-in and clock-out events for a timesheet
     */
    async timesheetsGetTimesheetClockInOut(requestParameters: TimesheetsGetTimesheetClockInOutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetTimesheetClockInOut200Response> {
        const response = await this.timesheetsGetTimesheetClockInOutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a timesheet with every shift, break, allowance claim and note on it.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  Each shift\'s `dailyAmount` needs `pay_conditions.read`; without it the amount is null.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Get one timesheet with its shifts
     */
    async timesheetsGetTimesheetDetailsRaw(requestParameters: TimesheetsGetTimesheetDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetTimesheetDetails200Response>> {
        if (requestParameters['timesheetId'] == null) {
            throw new runtime.RequiredError(
                'timesheetId',
                'Required parameter "timesheetId" was null or undefined when calling timesheetsGetTimesheetDetails().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['timesheetId'] != null) {
            queryParameters['timesheetId'] = requestParameters['timesheetId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/timesheet/get-timesheet-details`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsGetTimesheetDetails200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a timesheet with every shift, break, allowance claim and note on it.  The timesheet must belong to your organisation; an id from another organisation, or one that does not exist, is refused with 403.  Each shift\'s `dailyAmount` needs `pay_conditions.read`; without it the amount is null.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Get one timesheet with its shifts
     */
    async timesheetsGetTimesheetDetails(requestParameters: TimesheetsGetTimesheetDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetTimesheetDetails200Response> {
        const response = await this.timesheetsGetTimesheetDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one page of your organisation\'s timesheets whose pay period overlaps the dates you send, with totals for the period (pending, approved, rejected, hours and cost) and the change against the previous period.  Leave `tenantId` empty or send your own organisation id; any other organisation is refused with 403. `timesheetStatus` must be Pending, Approved or Rejected when sent. Drafts are listed as Pending with `isDraft` true.  Cost figures need `pay_conditions.read`: without it they are null, and `sortBy=cost` is ignored.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * List timesheets for a pay period
     */
    async timesheetsGetTimesheetListRaw(requestParameters: TimesheetsGetTimesheetListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsGetTimesheetList200Response>> {
        if (requestParameters['timesheetsGetTimesheetListRequest'] == null) {
            throw new runtime.RequiredError(
                'timesheetsGetTimesheetListRequest',
                'Required parameter "timesheetsGetTimesheetListRequest" was null or undefined when calling timesheetsGetTimesheetList().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/timesheet/get-timesheet-list`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TimesheetsGetTimesheetListRequestToJSON(requestParameters['timesheetsGetTimesheetListRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsGetTimesheetList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one page of your organisation\'s timesheets whose pay period overlaps the dates you send, with totals for the period (pending, approved, rejected, hours and cost) and the change against the previous period.  Leave `tenantId` empty or send your own organisation id; any other organisation is refused with 403. `timesheetStatus` must be Pending, Approved or Rejected when sent. Drafts are listed as Pending with `isDraft` true.  Cost figures need `pay_conditions.read`: without it they are null, and `sortBy=cost` is ignored.  **Required scope:** `timesheets.read` or `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * List timesheets for a pay period
     */
    async timesheetsGetTimesheetList(requestParameters: TimesheetsGetTimesheetListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsGetTimesheetList200Response> {
        const response = await this.timesheetsGetTimesheetListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Records your decision on one or more agency shifts in one call: 1 Approved, 2 Declined, or 0 Pending to withdraw an earlier decision. Declining needs a `note` saying why, which the agency is shown; approving or withdrawing clears any earlier note. Approving the hours completes the booking for the agency, which makes it billable. A booked shift can only be approved once it has ended at its location and the worker has clocked out; if any shift in the set has not, nothing is saved and the call answers 400 with those shifts in `data.tblAgencyTimesheetKeys`. Declining and withdrawing are not held back. The whole set is saved together, and a shift that is not yours or does not exist answers 404 with nothing saved.  Send the `tblAgencyPlacementId` of each row from *List agency timesheets for a date range* in `tblAgencyTimesheetKeys`, at most 500 per call. Leave `tblTenantId` empty or send your own organisation id; any other organisation is refused with 403. Only the client decides: an agency may read these timesheets but never approve or decline them.  **Required scope:** `timesheets.approve`  See **Responses** below for the status codes this operation can return.
     * Approve or decline agency timesheets
     */
    async timesheetsSetAgencyTimesheetApprovalRaw(requestParameters: TimesheetsSetAgencyTimesheetApprovalOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsSetAgencyTimesheetApproval200Response>> {
        if (requestParameters['timesheetsSetAgencyTimesheetApprovalRequest'] == null) {
            throw new runtime.RequiredError(
                'timesheetsSetAgencyTimesheetApprovalRequest',
                'Required parameter "timesheetsSetAgencyTimesheetApprovalRequest" was null or undefined when calling timesheetsSetAgencyTimesheetApproval().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["timesheets.approve"]);
        }


        let urlPath = `/timesheet/set-agency-timesheet-approval`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TimesheetsSetAgencyTimesheetApprovalRequestToJSON(requestParameters['timesheetsSetAgencyTimesheetApprovalRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsSetAgencyTimesheetApproval200ResponseFromJSON(jsonValue));
    }

    /**
     * Records your decision on one or more agency shifts in one call: 1 Approved, 2 Declined, or 0 Pending to withdraw an earlier decision. Declining needs a `note` saying why, which the agency is shown; approving or withdrawing clears any earlier note. Approving the hours completes the booking for the agency, which makes it billable. A booked shift can only be approved once it has ended at its location and the worker has clocked out; if any shift in the set has not, nothing is saved and the call answers 400 with those shifts in `data.tblAgencyTimesheetKeys`. Declining and withdrawing are not held back. The whole set is saved together, and a shift that is not yours or does not exist answers 404 with nothing saved.  Send the `tblAgencyPlacementId` of each row from *List agency timesheets for a date range* in `tblAgencyTimesheetKeys`, at most 500 per call. Leave `tblTenantId` empty or send your own organisation id; any other organisation is refused with 403. Only the client decides: an agency may read these timesheets but never approve or decline them.  **Required scope:** `timesheets.approve`  See **Responses** below for the status codes this operation can return.
     * Approve or decline agency timesheets
     */
    async timesheetsSetAgencyTimesheetApproval(requestParameters: TimesheetsSetAgencyTimesheetApprovalOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsSetAgencyTimesheetApproval200Response> {
        const response = await this.timesheetsSetAgencyTimesheetApprovalRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Imports worked shifts in bulk. Each row is matched to a current staff member of your organisation by email and placed in the pay period that contains its date, using your payroll cycle. Rows for the same staff member and pay period go on one timesheet: a new one is created, or the existing one is updated. A row with the same day, clock-in and clock-out as a stored shift updates it; otherwise it is added as a new shift.  Send `isImport` false to preview: nothing is saved, and the counts show what would happen. Send `isImport` true to save. Imported and updated timesheets are saved as submitted (Pending, not a draft). Updating an existing timesheet sets it back to Pending even when it was Approved, so check its status first. The call answers 200 even when nothing could be imported; check `success` and `fatalErrors` (for example, no payroll cycle set up).  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Import timesheet rows
     */
    async timesheetsTimesheetConfirmImportRaw(requestParameters: TimesheetsTimesheetConfirmImportOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TimesheetsTimesheetConfirmImport200Response>> {
        if (requestParameters['timesheetsTimesheetConfirmImportRequest'] == null) {
            throw new runtime.RequiredError(
                'timesheetsTimesheetConfirmImportRequest',
                'Required parameter "timesheetsTimesheetConfirmImportRequest" was null or undefined when calling timesheetsTimesheetConfirmImport().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["timesheets.write"]);
        }


        let urlPath = `/timesheet/timesheet-confirm-import`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TimesheetsTimesheetConfirmImportRequestToJSON(requestParameters['timesheetsTimesheetConfirmImportRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TimesheetsTimesheetConfirmImport200ResponseFromJSON(jsonValue));
    }

    /**
     * Imports worked shifts in bulk. Each row is matched to a current staff member of your organisation by email and placed in the pay period that contains its date, using your payroll cycle. Rows for the same staff member and pay period go on one timesheet: a new one is created, or the existing one is updated. A row with the same day, clock-in and clock-out as a stored shift updates it; otherwise it is added as a new shift.  Send `isImport` false to preview: nothing is saved, and the counts show what would happen. Send `isImport` true to save. Imported and updated timesheets are saved as submitted (Pending, not a draft). Updating an existing timesheet sets it back to Pending even when it was Approved, so check its status first. The call answers 200 even when nothing could be imported; check `success` and `fatalErrors` (for example, no payroll cycle set up).  **Required scope:** `timesheets.write`  See **Responses** below for the status codes this operation can return.
     * Import timesheet rows
     */
    async timesheetsTimesheetConfirmImport(requestParameters: TimesheetsTimesheetConfirmImportOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TimesheetsTimesheetConfirmImport200Response> {
        const response = await this.timesheetsTimesheetConfirmImportRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
