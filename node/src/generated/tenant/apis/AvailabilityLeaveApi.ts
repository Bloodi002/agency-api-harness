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
  StaffAddUpdateStaffAvailability200Response,
  StaffAddUpdateStaffAvailabilityRequest,
  StaffBulkActionStatusLeaveRequest200Response,
  StaffBulkActionStatusLeaveRequestRequest,
  StaffDeleteLeaveRequest200Response,
  StaffDeleteLeaveRequestRequest,
  StaffGetLeaveBalance200Response,
  StaffGetLeaveDetailById200Response,
  StaffGetLeaveRequest200Response,
  StaffGetStaffAvailability200Response,
  StaffGetStaffUnavailabilityList200Response,
  StaffGetStaffUnavailabilityListRequest,
  StaffLeaveRequestDetailsList200Response,
  StaffSaveStaffLeaveRequests200Response,
  StaffSaveStaffUnavailability200Response,
  StaffStaffUnavailabilityBulkActionRequest,
  ValidationProblem,
} from '../models/index.js';
import {
    EnvelopeFromJSON,
    EnvelopeToJSON,
    StaffAddUpdateStaffAvailability200ResponseFromJSON,
    StaffAddUpdateStaffAvailability200ResponseToJSON,
    StaffAddUpdateStaffAvailabilityRequestFromJSON,
    StaffAddUpdateStaffAvailabilityRequestToJSON,
    StaffBulkActionStatusLeaveRequest200ResponseFromJSON,
    StaffBulkActionStatusLeaveRequest200ResponseToJSON,
    StaffBulkActionStatusLeaveRequestRequestFromJSON,
    StaffBulkActionStatusLeaveRequestRequestToJSON,
    StaffDeleteLeaveRequest200ResponseFromJSON,
    StaffDeleteLeaveRequest200ResponseToJSON,
    StaffDeleteLeaveRequestRequestFromJSON,
    StaffDeleteLeaveRequestRequestToJSON,
    StaffGetLeaveBalance200ResponseFromJSON,
    StaffGetLeaveBalance200ResponseToJSON,
    StaffGetLeaveDetailById200ResponseFromJSON,
    StaffGetLeaveDetailById200ResponseToJSON,
    StaffGetLeaveRequest200ResponseFromJSON,
    StaffGetLeaveRequest200ResponseToJSON,
    StaffGetStaffAvailability200ResponseFromJSON,
    StaffGetStaffAvailability200ResponseToJSON,
    StaffGetStaffUnavailabilityList200ResponseFromJSON,
    StaffGetStaffUnavailabilityList200ResponseToJSON,
    StaffGetStaffUnavailabilityListRequestFromJSON,
    StaffGetStaffUnavailabilityListRequestToJSON,
    StaffLeaveRequestDetailsList200ResponseFromJSON,
    StaffLeaveRequestDetailsList200ResponseToJSON,
    StaffSaveStaffLeaveRequests200ResponseFromJSON,
    StaffSaveStaffLeaveRequests200ResponseToJSON,
    StaffSaveStaffUnavailability200ResponseFromJSON,
    StaffSaveStaffUnavailability200ResponseToJSON,
    StaffStaffUnavailabilityBulkActionRequestFromJSON,
    StaffStaffUnavailabilityBulkActionRequestToJSON,
    ValidationProblemFromJSON,
    ValidationProblemToJSON,
} from '../models/index.js';

export interface StaffAddUpdateStaffAvailabilityOperationRequest {
    staffAddUpdateStaffAvailabilityRequest: StaffAddUpdateStaffAvailabilityRequest;
}

export interface StaffBulkActionStatusLeaveRequestOperationRequest {
    staffBulkActionStatusLeaveRequestRequest: StaffBulkActionStatusLeaveRequestRequest;
}

export interface StaffDeleteLeaveRequestOperationRequest {
    staffDeleteLeaveRequestRequest: StaffDeleteLeaveRequestRequest;
}

export interface StaffExportToCsvRequest {
    tenantId?: string;
    search?: string;
    leaveStatus?: string;
    startDate?: string | null;
    endDate?: string | null;
    leaveType?: string | null;
}

export interface StaffGetLeaveBalanceRequest {
    staffId: string;
    balanceAtDate?: string;
}

export interface StaffGetLeaveDetailByIdRequest {
    leaveId: string;
    tenantId: string;
}

export interface StaffGetLeaveRequestRequest {
    search?: string | null;
    sortBy?: string | null;
    order?: string | null;
    page?: number;
    pageSize?: number;
    tenantId?: string;
    leaveStatus?: string;
    startDate?: string | null;
    endDate?: string | null;
    leaveType?: string | null;
    areaLocation?: string | null;
}

export interface StaffGetStaffAvailabilityRequest {
    staffId: string;
    asAt?: Date;
}

export interface StaffGetStaffUnavailabilityListOperationRequest {
    staffGetStaffUnavailabilityListRequest: StaffGetStaffUnavailabilityListRequest;
}

export interface StaffGetStaffUnavailabilityListByIdRequest {
    tblStaffId: string;
}

export interface StaffLeaveRequestDetailsListRequest {
    id: string;
}

export interface StaffSaveStaffLeaveRequestsRequest {
    leaveRequestTblStaffId: string;
    leaveRequestLeaveStartDate: string;
    leaveRequestLeaveType: string;
    leaveRequestLeaveStatus: string;
    leaveRequestTenantId: string;
    leaveRequestTblLeaveRequestId?: string;
    leaveRequestLeaveDuration?: string | null;
    leaveRequestLeaveEndDate?: string | null;
    leaveRequestLeaveTotalHours?: number | null;
    leaveRequestTotalPayableHours?: number | null;
    leaveRequestOriginalLeaveEntitlement?: number | null;
    leaveRequestLeaveReason?: string | null;
    leaveRequestIsDeleted?: boolean;
    leaveRequestAttachments?: Array<Blob>;
    leaveRequestRemovedAttachment?: string | null;
    leaveRequestLeaveRequestBreakdown0TblLeaveRequestBreakdownId?: string;
    leaveRequestLeaveRequestBreakdown0LeaveDate?: string;
    leaveRequestLeaveRequestBreakdown0LeaveTime?: string;
    leaveRequestLeaveRequestBreakdown0LeaveHoursFrom?: string;
    leaveRequestLeaveRequestBreakdown0LeaveHoursTo?: string;
    leaveRequestLeaveRequestBreakdown0PayableHours?: number;
    leaveRequestLeaveRequestBreakdown0IsDeleted?: boolean;
    leaveRequestLeaveRequestBreakdown0TblTenantAreaId0?: string;
}

export interface StaffSaveStaffUnavailabilityRequest {
    tblStaffId: string;
    startDate: string;
    status: StaffSaveStaffUnavailabilityStatusEnum;
    tblStaffUnavailabilityId?: string;
    tblTenantId?: string;
    endDate?: string | null;
    isFullDay?: boolean;
    startTime?: string | null;
    endTime?: string | null;
    isRepeatsWeekly?: boolean;
    repeatDays?: string | null;
    reason?: string | null;
    attachmentPath?: string | null;
    isDeleted?: boolean;
    removedAttachment?: string | null;
    attachments?: Array<Blob>;
}

export interface StaffStaffUnavailabilityBulkActionOperationRequest {
    staffStaffUnavailabilityBulkActionRequest: StaffStaffUnavailabilityBulkActionRequest;
}

/**
 * AvailabilityLeaveApi - interface
 * 
 * @export
 * @interface AvailabilityLeaveApiInterface
 */
export interface AvailabilityLeaveApiInterface {
    /**
     * Saves a weekly availability pattern for a staff member in your organisation from `effectiveDate`. A version already starting on that date is corrected in place; otherwise a new version is added and earlier ones stay as history. Shifts on the same day must not overlap or repeat, start and finish must differ, a day cannot exceed 24 hours, and breaks must be longer than 0 minutes; otherwise the call answers 400 naming the day.  The response carries `effectiveDate`, `outcome` (\"Created\" or \"Corrected\") and `warnings` (for example when the date is in the past, so pay and leave for those dates will use the new pattern) beside `data`, the schedule id. Answers 409 when another save created a version on the same date at the same time.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Save a staff member\'s availability pattern
     * @param {StaffAddUpdateStaffAvailabilityRequest} staffAddUpdateStaffAvailabilityRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffAddUpdateStaffAvailabilityRaw(requestParameters: StaffAddUpdateStaffAvailabilityOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddUpdateStaffAvailability200Response>>;

    /**
     * Saves a weekly availability pattern for a staff member in your organisation from `effectiveDate`. A version already starting on that date is corrected in place; otherwise a new version is added and earlier ones stay as history. Shifts on the same day must not overlap or repeat, start and finish must differ, a day cannot exceed 24 hours, and breaks must be longer than 0 minutes; otherwise the call answers 400 naming the day.  The response carries `effectiveDate`, `outcome` (\"Created\" or \"Corrected\") and `warnings` (for example when the date is in the past, so pay and leave for those dates will use the new pattern) beside `data`, the schedule id. Answers 409 when another save created a version on the same date at the same time.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s availability pattern
     */
    staffAddUpdateStaffAvailability(requestParameters: StaffAddUpdateStaffAvailabilityOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddUpdateStaffAvailability200Response>;

    /**
     * Sets the status of one or more leave requests in your organisation. Approving checks each request first (overlapping approved leave, events that prevent leave, and RDO, ADO or TOIL balances); a request that fails a check is listed in `failedRequests` and left unchanged, while the rest are saved.  Answers 200 when at least one request changed, 409 (with the same `data`) when every request was refused, and 404 when none of the ids matched a request.  Staff are told about the decision only when `isNotifyByEmail` is true.  **Required scope:** `leave.approve`  See **Responses** below for the status codes this operation can return.
     * @summary Approve or decline leave requests
     * @param {StaffBulkActionStatusLeaveRequestRequest} staffBulkActionStatusLeaveRequestRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffBulkActionStatusLeaveRequestRaw(requestParameters: StaffBulkActionStatusLeaveRequestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffBulkActionStatusLeaveRequest200Response>>;

    /**
     * Sets the status of one or more leave requests in your organisation. Approving checks each request first (overlapping approved leave, events that prevent leave, and RDO, ADO or TOIL balances); a request that fails a check is listed in `failedRequests` and left unchanged, while the rest are saved.  Answers 200 when at least one request changed, 409 (with the same `data`) when every request was refused, and 404 when none of the ids matched a request.  Staff are told about the decision only when `isNotifyByEmail` is true.  **Required scope:** `leave.approve`  See **Responses** below for the status codes this operation can return.
     * Approve or decline leave requests
     */
    staffBulkActionStatusLeaveRequest(requestParameters: StaffBulkActionStatusLeaveRequestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffBulkActionStatusLeaveRequest200Response>;

    /**
     * Withdraws (removes) one or more leave requests in your organisation. Withdrawing approved RDO, ADO or TOIL leave returns the hours to the staff member\'s balance; if that is refused the call answers 400 and nothing is saved.   `data` is the number of ids you sent.  Nobody is notified when your integration withdraws leave.  **Required scope:** `leave.write`  See **Responses** below for the status codes this operation can return.
     * @summary Withdraw leave requests
     * @param {StaffDeleteLeaveRequestRequest} staffDeleteLeaveRequestRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffDeleteLeaveRequestRaw(requestParameters: StaffDeleteLeaveRequestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffDeleteLeaveRequest200Response>>;

    /**
     * Withdraws (removes) one or more leave requests in your organisation. Withdrawing approved RDO, ADO or TOIL leave returns the hours to the staff member\'s balance; if that is refused the call answers 400 and nothing is saved.   `data` is the number of ids you sent.  Nobody is notified when your integration withdraws leave.  **Required scope:** `leave.write`  See **Responses** below for the status codes this operation can return.
     * Withdraw leave requests
     */
    staffDeleteLeaveRequest(requestParameters: StaffDeleteLeaveRequestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffDeleteLeaveRequest200Response>;

    /**
     * Returns a CSV file (`leave_requests.csv`) of your organisation\'s leave requests, with no paging. Columns: Name, Leave_Start, Leave_End, Paid_Length, Leave_type, Status, Created_on, Approved_on, Approved_by and Reason. Date columns are written as =\"dd-MM-yyyy\" so spreadsheet programs keep them as text.  By default only pending requests are exported; set `leaveStatus` as for the list. The date filter here compares the leave start date only.  Without `staff.personal.read`, searching by email is ignored.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * @summary Download leave requests as a CSV file
     * @param {string} [tenantId] Your organisation id. Omit it (or send an empty id) to use your own; any other organisation is refused with 403
     * @param {string} [search] Matches the staff member\&#39;s first name, last name or email address
     * @param {string} [leaveStatus] \&quot;pending\&quot; (the default), \&quot;approved\&quot; or \&quot;declined\&quot;; any other value exports every status
     * @param {string} [startDate] Only leave starting on or after this date
     * @param {string} [endDate] Only leave starting on or before this date
     * @param {string} [leaveType] Comma-separated leave type ids
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffExportToCsvRaw(requestParameters: StaffExportToCsvRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Blob>>;

    /**
     * Returns a CSV file (`leave_requests.csv`) of your organisation\'s leave requests, with no paging. Columns: Name, Leave_Start, Leave_End, Paid_Length, Leave_type, Status, Created_on, Approved_on, Approved_by and Reason. Date columns are written as =\"dd-MM-yyyy\" so spreadsheet programs keep them as text.  By default only pending requests are exported; set `leaveStatus` as for the list. The date filter here compares the leave start date only.  Without `staff.personal.read`, searching by email is ignored.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * Download leave requests as a CSV file
     */
    staffExportToCsv(requestParameters: StaffExportToCsvRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Blob>;

    /**
     * Not yet live: this call currently answers with fixed placeholder figures (184.8 hours of Unpaid Leave) for any staff member in your organisation, not a real balance. Do not use it for decisions. For RDO, ADO and TOIL balances, use the leave scheme balances call.  The staff member must belong to your organisation, or the call is refused with 403.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get a staff member\'s leave balance (placeholder)
     * @param {string} staffId The staff member\&#39;s id
     * @param {string} [balanceAtDate] The date to estimate the balance at
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffGetLeaveBalanceRaw(requestParameters: StaffGetLeaveBalanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetLeaveBalance200Response>>;

    /**
     * Not yet live: this call currently answers with fixed placeholder figures (184.8 hours of Unpaid Leave) for any staff member in your organisation, not a real balance. Do not use it for decisions. For RDO, ADO and TOIL balances, use the leave scheme balances call.  The staff member must belong to your organisation, or the call is refused with 403.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s leave balance (placeholder)
     */
    staffGetLeaveBalance(requestParameters: StaffGetLeaveBalanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetLeaveBalance200Response>;

    /**
     * Returns one leave request as an approver sees it: the dates, payable hours, attachments, staff member, daily breakdown and six approval checks (payable hours, sufficient balance, conflicting events, blackout period, shift overlap and discouraged leave), each marked clear or warning. The sufficient-balance check currently compares against a set default balance, not the staff member\'s real balance.  Both ids are required. `tenantId` must be your organisation\'s id and the request must belong to it, or the call is refused with 403.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get a leave request with its approval checks
     * @param {string} leaveId The leave request id
     * @param {string} tenantId Your organisation id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffGetLeaveDetailByIdRaw(requestParameters: StaffGetLeaveDetailByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetLeaveDetailById200Response>>;

    /**
     * Returns one leave request as an approver sees it: the dates, payable hours, attachments, staff member, daily breakdown and six approval checks (payable hours, sufficient balance, conflicting events, blackout period, shift overlap and discouraged leave), each marked clear or warning. The sufficient-balance check currently compares against a set default balance, not the staff member\'s real balance.  Both ids are required. `tenantId` must be your organisation\'s id and the request must belong to it, or the call is refused with 403.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * Get a leave request with its approval checks
     */
    staffGetLeaveDetailById(requestParameters: StaffGetLeaveDetailByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetLeaveDetailById200Response>;

    /**
     * Returns a page of your organisation\'s leave requests, newest first unless you choose a sort. By default only pending requests are listed; set `leaveStatus` to `approved` or `declined`, or to any other word (for example `all`) to list every status.  The date filter applies only when both `startDate` and `endDate` are sent, and keeps requests that start and end inside that range.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * @summary List leave requests
     * @param {string} [search] Matches the staff member\&#39;s first or last name, or the leave reason
     * @param {string} [sortBy] The field to sort by, for example \&quot;FirstName\&quot; or \&quot;CreatedDate\&quot;
     * @param {string} [order] \&quot;asc\&quot; or \&quot;desc\&quot;
     * @param {number} [page] Page number, from 1
     * @param {number} [pageSize] Rows per page, 1 to 10000 Above 200 is lowered to 200 without an error.
     * @param {string} [tenantId] Your organisation id. Omit it (or send an empty id) to use your own; any other organisation is refused with 403
     * @param {string} [leaveStatus] \&quot;pending\&quot; (the default), \&quot;approved\&quot; or \&quot;declined\&quot;; any other value lists every status
     * @param {string} [startDate] Start of the date range (needs endDate too)
     * @param {string} [endDate] End of the date range (needs startDate too)
     * @param {string} [leaveType] Comma-separated leave type ids
     * @param {string} [areaLocation] Area filter, as \&quot;locationId&gt;areaId\&quot; pairs separated by commas
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffGetLeaveRequestRaw(requestParameters: StaffGetLeaveRequestRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetLeaveRequest200Response>>;

    /**
     * Returns a page of your organisation\'s leave requests, newest first unless you choose a sort. By default only pending requests are listed; set `leaveStatus` to `approved` or `declined`, or to any other word (for example `all`) to list every status.  The date filter applies only when both `startDate` and `endDate` are sent, and keeps requests that start and end inside that range.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * List leave requests
     */
    staffGetLeaveRequest(requestParameters: StaffGetLeaveRequestRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetLeaveRequest200Response>;

    /**
     * Returns the weekly availability pattern in effect for a staff member on a date (today by default): the days and times they can work, by week of the cycle, with breaks and totals. A staff member has a series of versions; this returns the latest one that started on or before the date. `data` is null when there is none, or when the staff member is not in your organisation.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get a staff member\'s availability pattern
     * @param {string} staffId The staff member\&#39;s id
     * @param {Date} [asAt] The date to read the pattern for; today when omitted
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffGetStaffAvailabilityRaw(requestParameters: StaffGetStaffAvailabilityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffAvailability200Response>>;

    /**
     * Returns the weekly availability pattern in effect for a staff member on a date (today by default): the days and times they can work, by week of the cycle, with breaks and totals. A staff member has a series of versions; this returns the latest one that started on or before the date. `data` is null when there is none, or when the staff member is not in your organisation.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s availability pattern
     */
    staffGetStaffAvailability(requestParameters: StaffGetStaffAvailabilityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffAvailability200Response>;

    /**
     * Returns a page of the times staff in your organisation have said they cannot work (one-off or repeating weekly), with each record\'s status. Staff who have not set a password yet are included.  A range whose end is more than 62 days after its start is refused with 400. Without `staff.personal.read`, searching by email or mobile is ignored.  **Required scope:** `availability.read` or `availability.write`  See **Responses** below for the status codes this operation can return.
     * @summary List staff unavailability
     * @param {StaffGetStaffUnavailabilityListRequest} staffGetStaffUnavailabilityListRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffGetStaffUnavailabilityListRaw(requestParameters: StaffGetStaffUnavailabilityListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffUnavailabilityList200Response>>;

    /**
     * Returns a page of the times staff in your organisation have said they cannot work (one-off or repeating weekly), with each record\'s status. Staff who have not set a password yet are included.  A range whose end is more than 62 days after its start is refused with 400. Without `staff.personal.read`, searching by email or mobile is ignored.  **Required scope:** `availability.read` or `availability.write`  See **Responses** below for the status codes this operation can return.
     * List staff unavailability
     */
    staffGetStaffUnavailabilityList(requestParameters: StaffGetStaffUnavailabilityListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffUnavailabilityList200Response>;

    /**
     * Returns every unavailability record for one staff member, in one list with no paging. The staff member must belong to your organisation, or the call is refused with 403.  **Required scope:** `availability.read` or `availability.write`  See **Responses** below for the status codes this operation can return.
     * @summary List one staff member\'s unavailability
     * @param {string} tblStaffId The staff member\&#39;s id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffGetStaffUnavailabilityListByIdRaw(requestParameters: StaffGetStaffUnavailabilityListByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffUnavailabilityList200Response>>;

    /**
     * Returns every unavailability record for one staff member, in one list with no paging. The staff member must belong to your organisation, or the call is refused with 403.  **Required scope:** `availability.read` or `availability.write`  See **Responses** below for the status codes this operation can return.
     * List one staff member\'s unavailability
     */
    staffGetStaffUnavailabilityListById(requestParameters: StaffGetStaffUnavailabilityListByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffUnavailabilityList200Response>;

    /**
     * Returns one leave request with its staff member, the day-by-day breakdown (date, hours and area), attached files and who last changed it. The request must belong to your organisation, or the call is refused with 403.  File links in `files` are direct storage links; treat them as private.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get a leave request with its daily breakdown
     * @param {string} id The leave request id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffLeaveRequestDetailsListRaw(requestParameters: StaffLeaveRequestDetailsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffLeaveRequestDetailsList200Response>>;

    /**
     * Returns one leave request with its staff member, the day-by-day breakdown (date, hours and area), attached files and who last changed it. The request must belong to your organisation, or the call is refused with 403.  File links in `files` are direct storage links; treat them as private.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * Get a leave request with its daily breakdown
     */
    staffLeaveRequestDetailsList(requestParameters: StaffLeaveRequestDetailsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffLeaveRequestDetailsList200Response>;

    /**
     * Creates a leave request for a staff member in your organisation, or updates one when `leaveRequest.tblLeaveRequestId` is set. Send it as multipart/form-data; every field sits under `leaveRequest.`, and the daily breakdown is sent as indexed fields (`leaveRequest.leaveRequestBreakdown[0].leaveDate`, `[1]`, and so on).  Saving with status approved or declined also needs `leave.approve`, or the call is refused with 403. The call answers 409 when an event prevents leave on those dates or the staff member already has leave in that period, and 400 when an RDO, ADO or TOIL balance refuses it. `data` is the leave request id.  Creating a request as pending notifies nobody, and neither does an edit. Creating one already approved tells the staff member it was approved on their behalf. A leave request or breakdown row of another organisation answers 404. `createdBy` and `modifiedBy` on breakdown rows are ignored.  **Required scope:** `leave.write`  See **Responses** below for the status codes this operation can return.
     * @summary Create or update a leave request
     * @param {string} leaveRequestTblStaffId The staff member\\\&#39;s id. Required; must belong to your organisation
     * @param {string} leaveRequestLeaveStartDate First day of leave A calendar date with no time zone; not an instant.
     * @param {string} leaveRequestLeaveType The leave type id
     * @param {string} leaveRequestLeaveStatus \\\&quot;pending\\\&quot;, \\\&quot;approved\\\&quot; or \\\&quot;declined\\\&quot;. Saving as approved or declined also needs leave.approve
     * @param {string} leaveRequestTenantId Your organisation id. Required
     * @param {string} [leaveRequestTblLeaveRequestId] Omit (or send an empty id) to create a request; send an existing id from your organisation to update it
     * @param {string} [leaveRequestLeaveDuration] \\\&quot;full\\\&quot; for whole days or \\\&quot;part\\\&quot; for part of a day
     * @param {string} [leaveRequestLeaveEndDate] Last day of leave A calendar date with no time zone; not an instant.
     * @param {number} [leaveRequestLeaveTotalHours] Total hours (the server also works this out from the breakdown)
     * @param {number} [leaveRequestTotalPayableHours] Total payable hours
     * @param {number} [leaveRequestOriginalLeaveEntitlement] The staff member\\\&#39;s entitlement when the request was made
     * @param {string} [leaveRequestLeaveReason] Why the leave is needed
     * @param {boolean} [leaveRequestIsDeleted] Leave false
     * @param {Array<Blob>} [leaveRequestAttachments] Files to attach; repeat the field for several
     * @param {string} [leaveRequestRemovedAttachment] File ids to remove from the request, comma-separated
     * @param {string} [leaveRequestLeaveRequestBreakdown0TblLeaveRequestBreakdownId] Empty for a new day; the existing id to change one
     * @param {string} [leaveRequestLeaveRequestBreakdown0LeaveDate] The day A calendar date with no time zone; not an instant.
     * @param {string} [leaveRequestLeaveRequestBreakdown0LeaveTime] Hours for the day as a number, used when no from and to times are sent
     * @param {string} [leaveRequestLeaveRequestBreakdown0LeaveHoursFrom] Start time, HH:mm:ss
     * @param {string} [leaveRequestLeaveRequestBreakdown0LeaveHoursTo] End time, HH:mm:ss
     * @param {number} [leaveRequestLeaveRequestBreakdown0PayableHours] Payable hours for the day
     * @param {boolean} [leaveRequestLeaveRequestBreakdown0IsDeleted] true removes this day
     * @param {string} [leaveRequestLeaveRequestBreakdown0TblTenantAreaId0] An area the leave covers; repeat with [1], [2] for more
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffSaveStaffLeaveRequestsRaw(requestParameters: StaffSaveStaffLeaveRequestsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffSaveStaffLeaveRequests200Response>>;

    /**
     * Creates a leave request for a staff member in your organisation, or updates one when `leaveRequest.tblLeaveRequestId` is set. Send it as multipart/form-data; every field sits under `leaveRequest.`, and the daily breakdown is sent as indexed fields (`leaveRequest.leaveRequestBreakdown[0].leaveDate`, `[1]`, and so on).  Saving with status approved or declined also needs `leave.approve`, or the call is refused with 403. The call answers 409 when an event prevents leave on those dates or the staff member already has leave in that period, and 400 when an RDO, ADO or TOIL balance refuses it. `data` is the leave request id.  Creating a request as pending notifies nobody, and neither does an edit. Creating one already approved tells the staff member it was approved on their behalf. A leave request or breakdown row of another organisation answers 404. `createdBy` and `modifiedBy` on breakdown rows are ignored.  **Required scope:** `leave.write`  See **Responses** below for the status codes this operation can return.
     * Create or update a leave request
     */
    staffSaveStaffLeaveRequests(requestParameters: StaffSaveStaffLeaveRequestsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffSaveStaffLeaveRequests200Response>;

    /**
     * Creates or updates a time a staff member in your organisation cannot work. Send it as multipart/form-data. Saving with status approved or declined also needs `leave.approve`, or the call is refused with 403.  `data` is the record id. If the staff member already has unavailability that overlaps, nothing is saved and the call still answers 200, with one of these fixed values in `data` and a message saying which kind of record exists: `ffffffff-ffff-ffff-ffff-ffffffffffff` (full day), `ffffffff-ffff-ffff-ffff-fffffffeffff` (part day) or `ffffffff-ffff-ffff-ffff-fffffffdffff` (several days). Check for these before treating the call as saved.  **Required scope:** `availability.write`  See **Responses** below for the status codes this operation can return.
     * @summary Create or update a staff unavailability record
     * @param {string} tblStaffId The staff member\\\&#39;s id; must belong to your organisation
     * @param {string} startDate First day A calendar date with no time zone; not an instant.
     * @param {string} status \\\&quot;pending\\\&quot;, \\\&quot;approved\\\&quot; or \\\&quot;declined\\\&quot;. Saving as approved or declined also needs leave.approve
     * @param {string} [tblStaffUnavailabilityId] Omit (or send an empty id) to create a record; send an existing id from your organisation to update it
     * @param {string} [tblTenantId] Your organisation id. Omit it (or send an empty id) to use your own; any other organisation is refused with 403
     * @param {string} [endDate] Last day; omit for an open-ended record A calendar date with no time zone; not an instant.
     * @param {boolean} [isFullDay] true for whole days
     * @param {string} [startTime] Start time, HH:mm:ss, for a part-day record
     * @param {string} [endTime] End time, HH:mm:ss, for a part-day record
     * @param {boolean} [isRepeatsWeekly] true when it repeats every week
     * @param {string} [repeatDays] Day names, comma-separated, for a weekly record (for example \\\&quot;Monday,Wednesday\\\&quot;)
     * @param {string} [reason] Why the staff member is unavailable
     * @param {string} [attachmentPath] Not used for new files; send files as attachments
     * @param {boolean} [isDeleted] Leave false
     * @param {string} [removedAttachment] File ids to remove, comma-separated
     * @param {Array<Blob>} [attachments] Files to attach; repeat the field for several
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffSaveStaffUnavailabilityRaw(requestParameters: StaffSaveStaffUnavailabilityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffSaveStaffUnavailability200Response>>;

    /**
     * Creates or updates a time a staff member in your organisation cannot work. Send it as multipart/form-data. Saving with status approved or declined also needs `leave.approve`, or the call is refused with 403.  `data` is the record id. If the staff member already has unavailability that overlaps, nothing is saved and the call still answers 200, with one of these fixed values in `data` and a message saying which kind of record exists: `ffffffff-ffff-ffff-ffff-ffffffffffff` (full day), `ffffffff-ffff-ffff-ffff-fffffffeffff` (part day) or `ffffffff-ffff-ffff-ffff-fffffffdffff` (several days). Check for these before treating the call as saved.  **Required scope:** `availability.write`  See **Responses** below for the status codes this operation can return.
     * Create or update a staff unavailability record
     */
    staffSaveStaffUnavailability(requestParameters: StaffSaveStaffUnavailabilityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffSaveStaffUnavailability200Response>;

    /**
     * Sets the status of one or more unavailability records in your organisation. The status is saved exactly as sent, so send only `approved`, `declined` or `pending`.  `data` is the number of ids you sent.  **Required scope:** `leave.approve`  See **Responses** below for the status codes this operation can return.
     * @summary Approve or decline staff unavailability
     * @param {StaffStaffUnavailabilityBulkActionRequest} staffStaffUnavailabilityBulkActionRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AvailabilityLeaveApiInterface
     */
    staffStaffUnavailabilityBulkActionRaw(requestParameters: StaffStaffUnavailabilityBulkActionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffDeleteLeaveRequest200Response>>;

    /**
     * Sets the status of one or more unavailability records in your organisation. The status is saved exactly as sent, so send only `approved`, `declined` or `pending`.  `data` is the number of ids you sent.  **Required scope:** `leave.approve`  See **Responses** below for the status codes this operation can return.
     * Approve or decline staff unavailability
     */
    staffStaffUnavailabilityBulkAction(requestParameters: StaffStaffUnavailabilityBulkActionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffDeleteLeaveRequest200Response>;

}

/**
 * 
 */
export class AvailabilityLeaveApi extends runtime.BaseAPI implements AvailabilityLeaveApiInterface {

    /**
     * Saves a weekly availability pattern for a staff member in your organisation from `effectiveDate`. A version already starting on that date is corrected in place; otherwise a new version is added and earlier ones stay as history. Shifts on the same day must not overlap or repeat, start and finish must differ, a day cannot exceed 24 hours, and breaks must be longer than 0 minutes; otherwise the call answers 400 naming the day.  The response carries `effectiveDate`, `outcome` (\"Created\" or \"Corrected\") and `warnings` (for example when the date is in the past, so pay and leave for those dates will use the new pattern) beside `data`, the schedule id. Answers 409 when another save created a version on the same date at the same time.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s availability pattern
     */
    async staffAddUpdateStaffAvailabilityRaw(requestParameters: StaffAddUpdateStaffAvailabilityOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddUpdateStaffAvailability200Response>> {
        if (requestParameters['staffAddUpdateStaffAvailabilityRequest'] == null) {
            throw new runtime.RequiredError(
                'staffAddUpdateStaffAvailabilityRequest',
                'Required parameter "staffAddUpdateStaffAvailabilityRequest" was null or undefined when calling staffAddUpdateStaffAvailability().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.write"]);
        }


        let urlPath = `/staff/add-update-staff-availability`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffAddUpdateStaffAvailabilityRequestToJSON(requestParameters['staffAddUpdateStaffAvailabilityRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffAddUpdateStaffAvailability200ResponseFromJSON(jsonValue));
    }

    /**
     * Saves a weekly availability pattern for a staff member in your organisation from `effectiveDate`. A version already starting on that date is corrected in place; otherwise a new version is added and earlier ones stay as history. Shifts on the same day must not overlap or repeat, start and finish must differ, a day cannot exceed 24 hours, and breaks must be longer than 0 minutes; otherwise the call answers 400 naming the day.  The response carries `effectiveDate`, `outcome` (\"Created\" or \"Corrected\") and `warnings` (for example when the date is in the past, so pay and leave for those dates will use the new pattern) beside `data`, the schedule id. Answers 409 when another save created a version on the same date at the same time.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s availability pattern
     */
    async staffAddUpdateStaffAvailability(requestParameters: StaffAddUpdateStaffAvailabilityOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddUpdateStaffAvailability200Response> {
        const response = await this.staffAddUpdateStaffAvailabilityRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Sets the status of one or more leave requests in your organisation. Approving checks each request first (overlapping approved leave, events that prevent leave, and RDO, ADO or TOIL balances); a request that fails a check is listed in `failedRequests` and left unchanged, while the rest are saved.  Answers 200 when at least one request changed, 409 (with the same `data`) when every request was refused, and 404 when none of the ids matched a request.  Staff are told about the decision only when `isNotifyByEmail` is true.  **Required scope:** `leave.approve`  See **Responses** below for the status codes this operation can return.
     * Approve or decline leave requests
     */
    async staffBulkActionStatusLeaveRequestRaw(requestParameters: StaffBulkActionStatusLeaveRequestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffBulkActionStatusLeaveRequest200Response>> {
        if (requestParameters['staffBulkActionStatusLeaveRequestRequest'] == null) {
            throw new runtime.RequiredError(
                'staffBulkActionStatusLeaveRequestRequest',
                'Required parameter "staffBulkActionStatusLeaveRequestRequest" was null or undefined when calling staffBulkActionStatusLeaveRequest().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["leave.approve"]);
        }


        let urlPath = `/staff/api/LeaveRequest/bulk-action-status-leave-request`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffBulkActionStatusLeaveRequestRequestToJSON(requestParameters['staffBulkActionStatusLeaveRequestRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffBulkActionStatusLeaveRequest200ResponseFromJSON(jsonValue));
    }

    /**
     * Sets the status of one or more leave requests in your organisation. Approving checks each request first (overlapping approved leave, events that prevent leave, and RDO, ADO or TOIL balances); a request that fails a check is listed in `failedRequests` and left unchanged, while the rest are saved.  Answers 200 when at least one request changed, 409 (with the same `data`) when every request was refused, and 404 when none of the ids matched a request.  Staff are told about the decision only when `isNotifyByEmail` is true.  **Required scope:** `leave.approve`  See **Responses** below for the status codes this operation can return.
     * Approve or decline leave requests
     */
    async staffBulkActionStatusLeaveRequest(requestParameters: StaffBulkActionStatusLeaveRequestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffBulkActionStatusLeaveRequest200Response> {
        const response = await this.staffBulkActionStatusLeaveRequestRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Withdraws (removes) one or more leave requests in your organisation. Withdrawing approved RDO, ADO or TOIL leave returns the hours to the staff member\'s balance; if that is refused the call answers 400 and nothing is saved.   `data` is the number of ids you sent.  Nobody is notified when your integration withdraws leave.  **Required scope:** `leave.write`  See **Responses** below for the status codes this operation can return.
     * Withdraw leave requests
     */
    async staffDeleteLeaveRequestRaw(requestParameters: StaffDeleteLeaveRequestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffDeleteLeaveRequest200Response>> {
        if (requestParameters['staffDeleteLeaveRequestRequest'] == null) {
            throw new runtime.RequiredError(
                'staffDeleteLeaveRequestRequest',
                'Required parameter "staffDeleteLeaveRequestRequest" was null or undefined when calling staffDeleteLeaveRequest().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["leave.write"]);
        }


        let urlPath = `/staff/api/LeaveRequest/delete-leave-request`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffDeleteLeaveRequestRequestToJSON(requestParameters['staffDeleteLeaveRequestRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffDeleteLeaveRequest200ResponseFromJSON(jsonValue));
    }

    /**
     * Withdraws (removes) one or more leave requests in your organisation. Withdrawing approved RDO, ADO or TOIL leave returns the hours to the staff member\'s balance; if that is refused the call answers 400 and nothing is saved.   `data` is the number of ids you sent.  Nobody is notified when your integration withdraws leave.  **Required scope:** `leave.write`  See **Responses** below for the status codes this operation can return.
     * Withdraw leave requests
     */
    async staffDeleteLeaveRequest(requestParameters: StaffDeleteLeaveRequestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffDeleteLeaveRequest200Response> {
        const response = await this.staffDeleteLeaveRequestRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a CSV file (`leave_requests.csv`) of your organisation\'s leave requests, with no paging. Columns: Name, Leave_Start, Leave_End, Paid_Length, Leave_type, Status, Created_on, Approved_on, Approved_by and Reason. Date columns are written as =\"dd-MM-yyyy\" so spreadsheet programs keep them as text.  By default only pending requests are exported; set `leaveStatus` as for the list. The date filter here compares the leave start date only.  Without `staff.personal.read`, searching by email is ignored.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * Download leave requests as a CSV file
     */
    async staffExportToCsvRaw(requestParameters: StaffExportToCsvRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Blob>> {
        const queryParameters: any = {};

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['leaveStatus'] != null) {
            queryParameters['leaveStatus'] = requestParameters['leaveStatus'];
        }

        if (requestParameters['startDate'] != null) {
            queryParameters['startDate'] = requestParameters['startDate'];
        }

        if (requestParameters['endDate'] != null) {
            queryParameters['endDate'] = requestParameters['endDate'];
        }

        if (requestParameters['leaveType'] != null) {
            queryParameters['leaveType'] = requestParameters['leaveType'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/api/LeaveRequest/export-to-csv`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.BlobApiResponse(response);
    }

    /**
     * Returns a CSV file (`leave_requests.csv`) of your organisation\'s leave requests, with no paging. Columns: Name, Leave_Start, Leave_End, Paid_Length, Leave_type, Status, Created_on, Approved_on, Approved_by and Reason. Date columns are written as =\"dd-MM-yyyy\" so spreadsheet programs keep them as text.  By default only pending requests are exported; set `leaveStatus` as for the list. The date filter here compares the leave start date only.  Without `staff.personal.read`, searching by email is ignored.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * Download leave requests as a CSV file
     */
    async staffExportToCsv(requestParameters: StaffExportToCsvRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Blob> {
        const response = await this.staffExportToCsvRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Not yet live: this call currently answers with fixed placeholder figures (184.8 hours of Unpaid Leave) for any staff member in your organisation, not a real balance. Do not use it for decisions. For RDO, ADO and TOIL balances, use the leave scheme balances call.  The staff member must belong to your organisation, or the call is refused with 403.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s leave balance (placeholder)
     */
    async staffGetLeaveBalanceRaw(requestParameters: StaffGetLeaveBalanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetLeaveBalance200Response>> {
        if (requestParameters['staffId'] == null) {
            throw new runtime.RequiredError(
                'staffId',
                'Required parameter "staffId" was null or undefined when calling staffGetLeaveBalance().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['staffId'] != null) {
            queryParameters['staffId'] = requestParameters['staffId'];
        }

        if (requestParameters['balanceAtDate'] != null) {
            queryParameters['balanceAtDate'] = requestParameters['balanceAtDate'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/api/LeaveRequest/get-leave-balance`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetLeaveBalance200ResponseFromJSON(jsonValue));
    }

    /**
     * Not yet live: this call currently answers with fixed placeholder figures (184.8 hours of Unpaid Leave) for any staff member in your organisation, not a real balance. Do not use it for decisions. For RDO, ADO and TOIL balances, use the leave scheme balances call.  The staff member must belong to your organisation, or the call is refused with 403.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s leave balance (placeholder)
     */
    async staffGetLeaveBalance(requestParameters: StaffGetLeaveBalanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetLeaveBalance200Response> {
        const response = await this.staffGetLeaveBalanceRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one leave request as an approver sees it: the dates, payable hours, attachments, staff member, daily breakdown and six approval checks (payable hours, sufficient balance, conflicting events, blackout period, shift overlap and discouraged leave), each marked clear or warning. The sufficient-balance check currently compares against a set default balance, not the staff member\'s real balance.  Both ids are required. `tenantId` must be your organisation\'s id and the request must belong to it, or the call is refused with 403.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * Get a leave request with its approval checks
     */
    async staffGetLeaveDetailByIdRaw(requestParameters: StaffGetLeaveDetailByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetLeaveDetailById200Response>> {
        if (requestParameters['leaveId'] == null) {
            throw new runtime.RequiredError(
                'leaveId',
                'Required parameter "leaveId" was null or undefined when calling staffGetLeaveDetailById().'
            );
        }

        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling staffGetLeaveDetailById().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['leaveId'] != null) {
            queryParameters['leaveId'] = requestParameters['leaveId'];
        }

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/api/LeaveRequest/get-leave-detail-by-id`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetLeaveDetailById200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one leave request as an approver sees it: the dates, payable hours, attachments, staff member, daily breakdown and six approval checks (payable hours, sufficient balance, conflicting events, blackout period, shift overlap and discouraged leave), each marked clear or warning. The sufficient-balance check currently compares against a set default balance, not the staff member\'s real balance.  Both ids are required. `tenantId` must be your organisation\'s id and the request must belong to it, or the call is refused with 403.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * Get a leave request with its approval checks
     */
    async staffGetLeaveDetailById(requestParameters: StaffGetLeaveDetailByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetLeaveDetailById200Response> {
        const response = await this.staffGetLeaveDetailByIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a page of your organisation\'s leave requests, newest first unless you choose a sort. By default only pending requests are listed; set `leaveStatus` to `approved` or `declined`, or to any other word (for example `all`) to list every status.  The date filter applies only when both `startDate` and `endDate` are sent, and keeps requests that start and end inside that range.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * List leave requests
     */
    async staffGetLeaveRequestRaw(requestParameters: StaffGetLeaveRequestRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetLeaveRequest200Response>> {
        const queryParameters: any = {};

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['sortBy'] != null) {
            queryParameters['sortBy'] = requestParameters['sortBy'];
        }

        if (requestParameters['order'] != null) {
            queryParameters['order'] = requestParameters['order'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['pageSize'] != null) {
            queryParameters['pageSize'] = requestParameters['pageSize'];
        }

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        if (requestParameters['leaveStatus'] != null) {
            queryParameters['leaveStatus'] = requestParameters['leaveStatus'];
        }

        if (requestParameters['startDate'] != null) {
            queryParameters['startDate'] = requestParameters['startDate'];
        }

        if (requestParameters['endDate'] != null) {
            queryParameters['endDate'] = requestParameters['endDate'];
        }

        if (requestParameters['leaveType'] != null) {
            queryParameters['leaveType'] = requestParameters['leaveType'];
        }

        if (requestParameters['areaLocation'] != null) {
            queryParameters['areaLocation'] = requestParameters['areaLocation'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/api/LeaveRequest/get-leave-request`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetLeaveRequest200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a page of your organisation\'s leave requests, newest first unless you choose a sort. By default only pending requests are listed; set `leaveStatus` to `approved` or `declined`, or to any other word (for example `all`) to list every status.  The date filter applies only when both `startDate` and `endDate` are sent, and keeps requests that start and end inside that range.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * List leave requests
     */
    async staffGetLeaveRequest(requestParameters: StaffGetLeaveRequestRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetLeaveRequest200Response> {
        const response = await this.staffGetLeaveRequestRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the weekly availability pattern in effect for a staff member on a date (today by default): the days and times they can work, by week of the cycle, with breaks and totals. A staff member has a series of versions; this returns the latest one that started on or before the date. `data` is null when there is none, or when the staff member is not in your organisation.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s availability pattern
     */
    async staffGetStaffAvailabilityRaw(requestParameters: StaffGetStaffAvailabilityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffAvailability200Response>> {
        if (requestParameters['staffId'] == null) {
            throw new runtime.RequiredError(
                'staffId',
                'Required parameter "staffId" was null or undefined when calling staffGetStaffAvailability().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['staffId'] != null) {
            queryParameters['staffId'] = requestParameters['staffId'];
        }

        if (requestParameters['asAt'] != null) {
            queryParameters['asAt'] = (requestParameters['asAt'] as any).toISOString();
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/get-staff-availability`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetStaffAvailability200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the weekly availability pattern in effect for a staff member on a date (today by default): the days and times they can work, by week of the cycle, with breaks and totals. A staff member has a series of versions; this returns the latest one that started on or before the date. `data` is null when there is none, or when the staff member is not in your organisation.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s availability pattern
     */
    async staffGetStaffAvailability(requestParameters: StaffGetStaffAvailabilityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffAvailability200Response> {
        const response = await this.staffGetStaffAvailabilityRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a page of the times staff in your organisation have said they cannot work (one-off or repeating weekly), with each record\'s status. Staff who have not set a password yet are included.  A range whose end is more than 62 days after its start is refused with 400. Without `staff.personal.read`, searching by email or mobile is ignored.  **Required scope:** `availability.read` or `availability.write`  See **Responses** below for the status codes this operation can return.
     * List staff unavailability
     */
    async staffGetStaffUnavailabilityListRaw(requestParameters: StaffGetStaffUnavailabilityListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffUnavailabilityList200Response>> {
        if (requestParameters['staffGetStaffUnavailabilityListRequest'] == null) {
            throw new runtime.RequiredError(
                'staffGetStaffUnavailabilityListRequest',
                'Required parameter "staffGetStaffUnavailabilityListRequest" was null or undefined when calling staffGetStaffUnavailabilityList().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/get-staff-unavailability-list`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffGetStaffUnavailabilityListRequestToJSON(requestParameters['staffGetStaffUnavailabilityListRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetStaffUnavailabilityList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a page of the times staff in your organisation have said they cannot work (one-off or repeating weekly), with each record\'s status. Staff who have not set a password yet are included.  A range whose end is more than 62 days after its start is refused with 400. Without `staff.personal.read`, searching by email or mobile is ignored.  **Required scope:** `availability.read` or `availability.write`  See **Responses** below for the status codes this operation can return.
     * List staff unavailability
     */
    async staffGetStaffUnavailabilityList(requestParameters: StaffGetStaffUnavailabilityListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffUnavailabilityList200Response> {
        const response = await this.staffGetStaffUnavailabilityListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns every unavailability record for one staff member, in one list with no paging. The staff member must belong to your organisation, or the call is refused with 403.  **Required scope:** `availability.read` or `availability.write`  See **Responses** below for the status codes this operation can return.
     * List one staff member\'s unavailability
     */
    async staffGetStaffUnavailabilityListByIdRaw(requestParameters: StaffGetStaffUnavailabilityListByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffUnavailabilityList200Response>> {
        if (requestParameters['tblStaffId'] == null) {
            throw new runtime.RequiredError(
                'tblStaffId',
                'Required parameter "tblStaffId" was null or undefined when calling staffGetStaffUnavailabilityListById().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tblStaffId'] != null) {
            queryParameters['TblStaffId'] = requestParameters['tblStaffId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/get-staff-unavailability-list-by-id`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetStaffUnavailabilityList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns every unavailability record for one staff member, in one list with no paging. The staff member must belong to your organisation, or the call is refused with 403.  **Required scope:** `availability.read` or `availability.write`  See **Responses** below for the status codes this operation can return.
     * List one staff member\'s unavailability
     */
    async staffGetStaffUnavailabilityListById(requestParameters: StaffGetStaffUnavailabilityListByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffUnavailabilityList200Response> {
        const response = await this.staffGetStaffUnavailabilityListByIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one leave request with its staff member, the day-by-day breakdown (date, hours and area), attached files and who last changed it. The request must belong to your organisation, or the call is refused with 403.  File links in `files` are direct storage links; treat them as private.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * Get a leave request with its daily breakdown
     */
    async staffLeaveRequestDetailsListRaw(requestParameters: StaffLeaveRequestDetailsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffLeaveRequestDetailsList200Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling staffLeaveRequestDetailsList().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['id'] != null) {
            queryParameters['Id'] = requestParameters['id'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/api/LeaveRequest/leave-request-details-list`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffLeaveRequestDetailsList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one leave request with its staff member, the day-by-day breakdown (date, hours and area), attached files and who last changed it. The request must belong to your organisation, or the call is refused with 403.  File links in `files` are direct storage links; treat them as private.  **Required scope:** `leave.read` or `leave.write`  See **Responses** below for the status codes this operation can return.
     * Get a leave request with its daily breakdown
     */
    async staffLeaveRequestDetailsList(requestParameters: StaffLeaveRequestDetailsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffLeaveRequestDetailsList200Response> {
        const response = await this.staffLeaveRequestDetailsListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates a leave request for a staff member in your organisation, or updates one when `leaveRequest.tblLeaveRequestId` is set. Send it as multipart/form-data; every field sits under `leaveRequest.`, and the daily breakdown is sent as indexed fields (`leaveRequest.leaveRequestBreakdown[0].leaveDate`, `[1]`, and so on).  Saving with status approved or declined also needs `leave.approve`, or the call is refused with 403. The call answers 409 when an event prevents leave on those dates or the staff member already has leave in that period, and 400 when an RDO, ADO or TOIL balance refuses it. `data` is the leave request id.  Creating a request as pending notifies nobody, and neither does an edit. Creating one already approved tells the staff member it was approved on their behalf. A leave request or breakdown row of another organisation answers 404. `createdBy` and `modifiedBy` on breakdown rows are ignored.  **Required scope:** `leave.write`  See **Responses** below for the status codes this operation can return.
     * Create or update a leave request
     */
    async staffSaveStaffLeaveRequestsRaw(requestParameters: StaffSaveStaffLeaveRequestsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffSaveStaffLeaveRequests200Response>> {
        if (requestParameters['leaveRequestTblStaffId'] == null) {
            throw new runtime.RequiredError(
                'leaveRequestTblStaffId',
                'Required parameter "leaveRequestTblStaffId" was null or undefined when calling staffSaveStaffLeaveRequests().'
            );
        }

        if (requestParameters['leaveRequestLeaveStartDate'] == null) {
            throw new runtime.RequiredError(
                'leaveRequestLeaveStartDate',
                'Required parameter "leaveRequestLeaveStartDate" was null or undefined when calling staffSaveStaffLeaveRequests().'
            );
        }

        if (requestParameters['leaveRequestLeaveType'] == null) {
            throw new runtime.RequiredError(
                'leaveRequestLeaveType',
                'Required parameter "leaveRequestLeaveType" was null or undefined when calling staffSaveStaffLeaveRequests().'
            );
        }

        if (requestParameters['leaveRequestLeaveStatus'] == null) {
            throw new runtime.RequiredError(
                'leaveRequestLeaveStatus',
                'Required parameter "leaveRequestLeaveStatus" was null or undefined when calling staffSaveStaffLeaveRequests().'
            );
        }

        if (requestParameters['leaveRequestTenantId'] == null) {
            throw new runtime.RequiredError(
                'leaveRequestTenantId',
                'Required parameter "leaveRequestTenantId" was null or undefined when calling staffSaveStaffLeaveRequests().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["leave.write"]);
        }

        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters['leaveRequestTblLeaveRequestId'] != null) {
            formParams.append('leaveRequest.tblLeaveRequestId', requestParameters['leaveRequestTblLeaveRequestId'] as any);
        }

        if (requestParameters['leaveRequestTblStaffId'] != null) {
            formParams.append('leaveRequest.tblStaffId', requestParameters['leaveRequestTblStaffId'] as any);
        }

        if (requestParameters['leaveRequestLeaveDuration'] != null) {
            formParams.append('leaveRequest.leaveDuration', requestParameters['leaveRequestLeaveDuration'] as any);
        }

        if (requestParameters['leaveRequestLeaveStartDate'] != null) {
            formParams.append('leaveRequest.leaveStartDate', requestParameters['leaveRequestLeaveStartDate'] as any);
        }

        if (requestParameters['leaveRequestLeaveEndDate'] != null) {
            formParams.append('leaveRequest.leaveEndDate', requestParameters['leaveRequestLeaveEndDate'] as any);
        }

        if (requestParameters['leaveRequestLeaveTotalHours'] != null) {
            formParams.append('leaveRequest.leaveTotalHours', requestParameters['leaveRequestLeaveTotalHours'] as any);
        }

        if (requestParameters['leaveRequestTotalPayableHours'] != null) {
            formParams.append('leaveRequest.totalPayableHours', requestParameters['leaveRequestTotalPayableHours'] as any);
        }

        if (requestParameters['leaveRequestOriginalLeaveEntitlement'] != null) {
            formParams.append('leaveRequest.originalLeaveEntitlement', requestParameters['leaveRequestOriginalLeaveEntitlement'] as any);
        }

        if (requestParameters['leaveRequestLeaveType'] != null) {
            formParams.append('leaveRequest.leaveType', requestParameters['leaveRequestLeaveType'] as any);
        }

        if (requestParameters['leaveRequestLeaveReason'] != null) {
            formParams.append('leaveRequest.leaveReason', requestParameters['leaveRequestLeaveReason'] as any);
        }

        if (requestParameters['leaveRequestLeaveStatus'] != null) {
            formParams.append('leaveRequest.leaveStatus', requestParameters['leaveRequestLeaveStatus'] as any);
        }

        if (requestParameters['leaveRequestIsDeleted'] != null) {
            formParams.append('leaveRequest.isDeleted', requestParameters['leaveRequestIsDeleted'] as any);
        }

        if (requestParameters['leaveRequestTenantId'] != null) {
            formParams.append('leaveRequest.tenantId', requestParameters['leaveRequestTenantId'] as any);
        }

        if (requestParameters['leaveRequestAttachments'] != null) {
            requestParameters['leaveRequestAttachments'].forEach((element) => {
                formParams.append('leaveRequest.attachments', element as any);
            })
        }

        if (requestParameters['leaveRequestRemovedAttachment'] != null) {
            formParams.append('leaveRequest.removedAttachment', requestParameters['leaveRequestRemovedAttachment'] as any);
        }

        if (requestParameters['leaveRequestLeaveRequestBreakdown0TblLeaveRequestBreakdownId'] != null) {
            formParams.append('leaveRequest.leaveRequestBreakdown[0].tblLeaveRequestBreakdownId', requestParameters['leaveRequestLeaveRequestBreakdown0TblLeaveRequestBreakdownId'] as any);
        }

        if (requestParameters['leaveRequestLeaveRequestBreakdown0LeaveDate'] != null) {
            formParams.append('leaveRequest.leaveRequestBreakdown[0].leaveDate', requestParameters['leaveRequestLeaveRequestBreakdown0LeaveDate'] as any);
        }

        if (requestParameters['leaveRequestLeaveRequestBreakdown0LeaveTime'] != null) {
            formParams.append('leaveRequest.leaveRequestBreakdown[0].leaveTime', requestParameters['leaveRequestLeaveRequestBreakdown0LeaveTime'] as any);
        }

        if (requestParameters['leaveRequestLeaveRequestBreakdown0LeaveHoursFrom'] != null) {
            formParams.append('leaveRequest.leaveRequestBreakdown[0].leaveHoursFrom', requestParameters['leaveRequestLeaveRequestBreakdown0LeaveHoursFrom'] as any);
        }

        if (requestParameters['leaveRequestLeaveRequestBreakdown0LeaveHoursTo'] != null) {
            formParams.append('leaveRequest.leaveRequestBreakdown[0].leaveHoursTo', requestParameters['leaveRequestLeaveRequestBreakdown0LeaveHoursTo'] as any);
        }

        if (requestParameters['leaveRequestLeaveRequestBreakdown0PayableHours'] != null) {
            formParams.append('leaveRequest.leaveRequestBreakdown[0].payableHours', requestParameters['leaveRequestLeaveRequestBreakdown0PayableHours'] as any);
        }

        if (requestParameters['leaveRequestLeaveRequestBreakdown0IsDeleted'] != null) {
            formParams.append('leaveRequest.leaveRequestBreakdown[0].isDeleted', requestParameters['leaveRequestLeaveRequestBreakdown0IsDeleted'] as any);
        }

        if (requestParameters['leaveRequestLeaveRequestBreakdown0TblTenantAreaId0'] != null) {
            formParams.append('leaveRequest.leaveRequestBreakdown[0].tblTenantAreaId[0]', requestParameters['leaveRequestLeaveRequestBreakdown0TblTenantAreaId0'] as any);
        }


        let urlPath = `/staff/api/LeaveRequest/save-staff-leave-requests`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffSaveStaffLeaveRequests200ResponseFromJSON(jsonValue));
    }

    /**
     * Creates a leave request for a staff member in your organisation, or updates one when `leaveRequest.tblLeaveRequestId` is set. Send it as multipart/form-data; every field sits under `leaveRequest.`, and the daily breakdown is sent as indexed fields (`leaveRequest.leaveRequestBreakdown[0].leaveDate`, `[1]`, and so on).  Saving with status approved or declined also needs `leave.approve`, or the call is refused with 403. The call answers 409 when an event prevents leave on those dates or the staff member already has leave in that period, and 400 when an RDO, ADO or TOIL balance refuses it. `data` is the leave request id.  Creating a request as pending notifies nobody, and neither does an edit. Creating one already approved tells the staff member it was approved on their behalf. A leave request or breakdown row of another organisation answers 404. `createdBy` and `modifiedBy` on breakdown rows are ignored.  **Required scope:** `leave.write`  See **Responses** below for the status codes this operation can return.
     * Create or update a leave request
     */
    async staffSaveStaffLeaveRequests(requestParameters: StaffSaveStaffLeaveRequestsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffSaveStaffLeaveRequests200Response> {
        const response = await this.staffSaveStaffLeaveRequestsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates or updates a time a staff member in your organisation cannot work. Send it as multipart/form-data. Saving with status approved or declined also needs `leave.approve`, or the call is refused with 403.  `data` is the record id. If the staff member already has unavailability that overlaps, nothing is saved and the call still answers 200, with one of these fixed values in `data` and a message saying which kind of record exists: `ffffffff-ffff-ffff-ffff-ffffffffffff` (full day), `ffffffff-ffff-ffff-ffff-fffffffeffff` (part day) or `ffffffff-ffff-ffff-ffff-fffffffdffff` (several days). Check for these before treating the call as saved.  **Required scope:** `availability.write`  See **Responses** below for the status codes this operation can return.
     * Create or update a staff unavailability record
     */
    async staffSaveStaffUnavailabilityRaw(requestParameters: StaffSaveStaffUnavailabilityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffSaveStaffUnavailability200Response>> {
        if (requestParameters['tblStaffId'] == null) {
            throw new runtime.RequiredError(
                'tblStaffId',
                'Required parameter "tblStaffId" was null or undefined when calling staffSaveStaffUnavailability().'
            );
        }

        if (requestParameters['startDate'] == null) {
            throw new runtime.RequiredError(
                'startDate',
                'Required parameter "startDate" was null or undefined when calling staffSaveStaffUnavailability().'
            );
        }

        if (requestParameters['status'] == null) {
            throw new runtime.RequiredError(
                'status',
                'Required parameter "status" was null or undefined when calling staffSaveStaffUnavailability().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["availability.write"]);
        }

        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters['tblStaffUnavailabilityId'] != null) {
            formParams.append('tblStaffUnavailabilityId', requestParameters['tblStaffUnavailabilityId'] as any);
        }

        if (requestParameters['tblTenantId'] != null) {
            formParams.append('tblTenantId', requestParameters['tblTenantId'] as any);
        }

        if (requestParameters['tblStaffId'] != null) {
            formParams.append('tblStaffId', requestParameters['tblStaffId'] as any);
        }

        if (requestParameters['startDate'] != null) {
            formParams.append('startDate', requestParameters['startDate'] as any);
        }

        if (requestParameters['endDate'] != null) {
            formParams.append('endDate', requestParameters['endDate'] as any);
        }

        if (requestParameters['isFullDay'] != null) {
            formParams.append('isFullDay', requestParameters['isFullDay'] as any);
        }

        if (requestParameters['startTime'] != null) {
            formParams.append('startTime', requestParameters['startTime'] as any);
        }

        if (requestParameters['endTime'] != null) {
            formParams.append('endTime', requestParameters['endTime'] as any);
        }

        if (requestParameters['isRepeatsWeekly'] != null) {
            formParams.append('isRepeatsWeekly', requestParameters['isRepeatsWeekly'] as any);
        }

        if (requestParameters['repeatDays'] != null) {
            formParams.append('repeatDays', requestParameters['repeatDays'] as any);
        }

        if (requestParameters['reason'] != null) {
            formParams.append('reason', requestParameters['reason'] as any);
        }

        if (requestParameters['attachmentPath'] != null) {
            formParams.append('attachmentPath', requestParameters['attachmentPath'] as any);
        }

        if (requestParameters['status'] != null) {
            formParams.append('status', requestParameters['status'] as any);
        }

        if (requestParameters['isDeleted'] != null) {
            formParams.append('isDeleted', requestParameters['isDeleted'] as any);
        }

        if (requestParameters['removedAttachment'] != null) {
            formParams.append('removedAttachment', requestParameters['removedAttachment'] as any);
        }

        if (requestParameters['attachments'] != null) {
            requestParameters['attachments'].forEach((element) => {
                formParams.append('attachments', element as any);
            })
        }


        let urlPath = `/staff/save-staff-unavailability`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffSaveStaffUnavailability200ResponseFromJSON(jsonValue));
    }

    /**
     * Creates or updates a time a staff member in your organisation cannot work. Send it as multipart/form-data. Saving with status approved or declined also needs `leave.approve`, or the call is refused with 403.  `data` is the record id. If the staff member already has unavailability that overlaps, nothing is saved and the call still answers 200, with one of these fixed values in `data` and a message saying which kind of record exists: `ffffffff-ffff-ffff-ffff-ffffffffffff` (full day), `ffffffff-ffff-ffff-ffff-fffffffeffff` (part day) or `ffffffff-ffff-ffff-ffff-fffffffdffff` (several days). Check for these before treating the call as saved.  **Required scope:** `availability.write`  See **Responses** below for the status codes this operation can return.
     * Create or update a staff unavailability record
     */
    async staffSaveStaffUnavailability(requestParameters: StaffSaveStaffUnavailabilityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffSaveStaffUnavailability200Response> {
        const response = await this.staffSaveStaffUnavailabilityRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Sets the status of one or more unavailability records in your organisation. The status is saved exactly as sent, so send only `approved`, `declined` or `pending`.  `data` is the number of ids you sent.  **Required scope:** `leave.approve`  See **Responses** below for the status codes this operation can return.
     * Approve or decline staff unavailability
     */
    async staffStaffUnavailabilityBulkActionRaw(requestParameters: StaffStaffUnavailabilityBulkActionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffDeleteLeaveRequest200Response>> {
        if (requestParameters['staffStaffUnavailabilityBulkActionRequest'] == null) {
            throw new runtime.RequiredError(
                'staffStaffUnavailabilityBulkActionRequest',
                'Required parameter "staffStaffUnavailabilityBulkActionRequest" was null or undefined when calling staffStaffUnavailabilityBulkAction().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["leave.approve"]);
        }


        let urlPath = `/staff/staff-unavailability-bulk-action`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffStaffUnavailabilityBulkActionRequestToJSON(requestParameters['staffStaffUnavailabilityBulkActionRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffDeleteLeaveRequest200ResponseFromJSON(jsonValue));
    }

    /**
     * Sets the status of one or more unavailability records in your organisation. The status is saved exactly as sent, so send only `approved`, `declined` or `pending`.  `data` is the number of ids you sent.  **Required scope:** `leave.approve`  See **Responses** below for the status codes this operation can return.
     * Approve or decline staff unavailability
     */
    async staffStaffUnavailabilityBulkAction(requestParameters: StaffStaffUnavailabilityBulkActionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffDeleteLeaveRequest200Response> {
        const response = await this.staffStaffUnavailabilityBulkActionRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const StaffSaveStaffUnavailabilityStatusEnum = {
    Pending: 'pending',
    Approved: 'approved',
    Declined: 'declined'
} as const;
export type StaffSaveStaffUnavailabilityStatusEnum = typeof StaffSaveStaffUnavailabilityStatusEnum[keyof typeof StaffSaveStaffUnavailabilityStatusEnum];
