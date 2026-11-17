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
  StaffAddUpdateStaffBankDetails200Response,
  StaffAddUpdateStaffBankDetailsRequest,
  StaffAddUpdateStaffSuperDetails200Response,
  StaffGetStaffBankDetails200Response,
  StaffGetStaffFinanceDetails200Response,
  StaffGetStaffSuperDetails200Response,
  StaffStaffDetailsExportRequest,
  StaffTaxDeclarationCreateUpdate200Response,
  StaffTaxDeclarationCreateUpdateRequest,
  StaffTaxDeclarationGet200Response,
  StaffTaxDeclarationGetRequest,
  StaffTaxDetailCreateUpdate200Response,
  StaffTaxDetailCreateUpdateRequest,
  StaffTaxDetailGet200Response,
  StaffTaxDetailHistoryCurrentUpcoming200Response,
  StaffTaxDetailHistoryPast200Response,
  ValidationProblem,
} from '../models/index.js';
import {
    EnvelopeFromJSON,
    EnvelopeToJSON,
    StaffAddUpdateStaffBankDetails200ResponseFromJSON,
    StaffAddUpdateStaffBankDetails200ResponseToJSON,
    StaffAddUpdateStaffBankDetailsRequestFromJSON,
    StaffAddUpdateStaffBankDetailsRequestToJSON,
    StaffAddUpdateStaffSuperDetails200ResponseFromJSON,
    StaffAddUpdateStaffSuperDetails200ResponseToJSON,
    StaffGetStaffBankDetails200ResponseFromJSON,
    StaffGetStaffBankDetails200ResponseToJSON,
    StaffGetStaffFinanceDetails200ResponseFromJSON,
    StaffGetStaffFinanceDetails200ResponseToJSON,
    StaffGetStaffSuperDetails200ResponseFromJSON,
    StaffGetStaffSuperDetails200ResponseToJSON,
    StaffStaffDetailsExportRequestFromJSON,
    StaffStaffDetailsExportRequestToJSON,
    StaffTaxDeclarationCreateUpdate200ResponseFromJSON,
    StaffTaxDeclarationCreateUpdate200ResponseToJSON,
    StaffTaxDeclarationCreateUpdateRequestFromJSON,
    StaffTaxDeclarationCreateUpdateRequestToJSON,
    StaffTaxDeclarationGet200ResponseFromJSON,
    StaffTaxDeclarationGet200ResponseToJSON,
    StaffTaxDeclarationGetRequestFromJSON,
    StaffTaxDeclarationGetRequestToJSON,
    StaffTaxDetailCreateUpdate200ResponseFromJSON,
    StaffTaxDetailCreateUpdate200ResponseToJSON,
    StaffTaxDetailCreateUpdateRequestFromJSON,
    StaffTaxDetailCreateUpdateRequestToJSON,
    StaffTaxDetailGet200ResponseFromJSON,
    StaffTaxDetailGet200ResponseToJSON,
    StaffTaxDetailHistoryCurrentUpcoming200ResponseFromJSON,
    StaffTaxDetailHistoryCurrentUpcoming200ResponseToJSON,
    StaffTaxDetailHistoryPast200ResponseFromJSON,
    StaffTaxDetailHistoryPast200ResponseToJSON,
    ValidationProblemFromJSON,
    ValidationProblemToJSON,
} from '../models/index.js';

export interface StaffAddUpdateStaffBankDetailsOperationRequest {
    staffAddUpdateStaffBankDetailsRequest: StaffAddUpdateStaffBankDetailsRequest;
}

export interface StaffAddUpdateStaffSuperDetailsRequest {
    tblStaffId: string;
    tblStaffSuperDetailId?: string | null;
    isExistingSuper?: boolean;
    isAPRAFund?: boolean;
    smsfSuperName?: string | null;
    superNameId?: string | null;
    memberNum?: string | null;
    fundABN?: string | null;
    accountName?: string | null;
    bsbNum?: string | null;
    accountNum?: string | null;
    attachment?: Blob | null;
    removeAttachment?: string | null;
}

export interface StaffGetStaffBankDetailsRequest {
    staffId: string;
}

export interface StaffGetStaffFinanceDetailsRequest {
    staffId: string;
}

export interface StaffGetStaffSuperDetailsRequest {
    staffId: string;
}

export interface StaffStaffDetailsExportOperationRequest {
    staffStaffDetailsExportRequest: StaffStaffDetailsExportRequest;
}

export interface StaffTaxDeclarationCreateUpdateOperationRequest {
    staffTaxDeclarationCreateUpdateRequest: StaffTaxDeclarationCreateUpdateRequest;
}

export interface StaffTaxDeclarationGetOperationRequest {
    staffTaxDeclarationGetRequest: StaffTaxDeclarationGetRequest;
}

export interface StaffTaxDetailCreateUpdateOperationRequest {
    staffTaxDetailCreateUpdateRequest: StaffTaxDetailCreateUpdateRequest;
}

export interface StaffTaxDetailGetRequest {
    staffTaxDeclarationGetRequest: StaffTaxDeclarationGetRequest;
}

export interface StaffTaxDetailHistoryCurrentUpcomingRequest {
    staffTaxDeclarationGetRequest: StaffTaxDeclarationGetRequest;
}

export interface StaffTaxDetailHistoryPastRequest {
    staffTaxDeclarationGetRequest: StaffTaxDeclarationGetRequest;
}

/**
 * StaffFinanceSensitiveApi - interface
 * 
 * @export
 * @interface StaffFinanceSensitiveApiInterface
 */
export interface StaffFinanceSensitiveApiInterface {
    /**
     * Adds or changes the bank account a staff member in your organisation is paid into. `data` is the bank detail id.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * @summary Save a staff member\'s bank details
     * @param {StaffAddUpdateStaffBankDetailsRequest} staffAddUpdateStaffBankDetailsRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffFinanceSensitiveApiInterface
     */
    staffAddUpdateStaffBankDetailsRaw(requestParameters: StaffAddUpdateStaffBankDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddUpdateStaffBankDetails200Response>>;

    /**
     * Adds or changes the bank account a staff member in your organisation is paid into. `data` is the bank detail id.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s bank details
     */
    staffAddUpdateStaffBankDetails(requestParameters: StaffAddUpdateStaffBankDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddUpdateStaffBankDetails200Response>;

    /**
     * Adds or changes a staff member\'s superannuation fund details, optionally with a supporting document. Send it as multipart/form-data. `data` is the super detail id.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * @summary Save a staff member\'s super details
     * @param {string} tblStaffId The staff member\\\&#39;s id; must be a current staff member of your organisation, or the call is refused with 403
     * @param {string} [tblStaffSuperDetailId] Omit to add super details; send the existing id (from your organisation) to change them
     * @param {boolean} [isExistingSuper] true when the staff member uses their own existing fund
     * @param {boolean} [isAPRAFund] true for an APRA-regulated fund, false for a self-managed fund
     * @param {string} [smsfSuperName] SMSF name
     * @param {string} [superNameId] APRA fund id
     * @param {string} [memberNum] Member number
     * @param {string} [fundABN] SMSF ABN
     * @param {string} [accountName] SMSF bank account name
     * @param {string} [bsbNum] SMSF bank BSB
     * @param {string} [accountNum] SMSF bank account number
     * @param {Blob} [attachment] A supporting document, for example a compliance letter
     * @param {string} [removeAttachment] File ids to remove, comma-separated
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffFinanceSensitiveApiInterface
     */
    staffAddUpdateStaffSuperDetailsRaw(requestParameters: StaffAddUpdateStaffSuperDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddUpdateStaffSuperDetails200Response>>;

    /**
     * Adds or changes a staff member\'s superannuation fund details, optionally with a supporting document. Send it as multipart/form-data. `data` is the super detail id.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s super details
     */
    staffAddUpdateStaffSuperDetails(requestParameters: StaffAddUpdateStaffSuperDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddUpdateStaffSuperDetails200Response>;

    /**
     * Returns the bank account a staff member in your organisation is paid into. Answers 404 when none is saved.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get a staff member\'s bank details
     * @param {string} staffId The staff member\&#39;s id; must be a current staff member of your organisation, or the call is refused with 403
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffFinanceSensitiveApiInterface
     */
    staffGetStaffBankDetailsRaw(requestParameters: StaffGetStaffBankDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffBankDetails200Response>>;

    /**
     * Returns the bank account a staff member in your organisation is paid into. Answers 404 when none is saved.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s bank details
     */
    staffGetStaffBankDetails(requestParameters: StaffGetStaffBankDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffBankDetails200Response>;

    /**
     * Returns a staff member\'s bank and super details in one call. When neither is saved the call still answers 200, with only a `message` and no `data`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get a staff member\'s bank and super details together
     * @param {string} staffId The staff member\&#39;s id; must be a current staff member of your organisation, or the call is refused with 403
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffFinanceSensitiveApiInterface
     */
    staffGetStaffFinanceDetailsRaw(requestParameters: StaffGetStaffFinanceDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffFinanceDetails200Response>>;

    /**
     * Returns a staff member\'s bank and super details in one call. When neither is saved the call still answers 200, with only a `message` and no `data`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s bank and super details together
     */
    staffGetStaffFinanceDetails(requestParameters: StaffGetStaffFinanceDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffFinanceDetails200Response>;

    /**
     * Returns a staff member\'s superannuation fund details: an APRA fund with member number, or a self-managed fund with its ABN and bank account. Answers 404 when none are saved.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get a staff member\'s super details
     * @param {string} staffId The staff member\&#39;s id; must be a current staff member of your organisation, or the call is refused with 403
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffFinanceSensitiveApiInterface
     */
    staffGetStaffSuperDetailsRaw(requestParameters: StaffGetStaffSuperDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffSuperDetails200Response>>;

    /**
     * Returns a staff member\'s superannuation fund details: an APRA fund with member number, or a self-managed fund with its ABN and bank account. Answers 404 when none are saved.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s super details
     */
    staffGetStaffSuperDetails(requestParameters: StaffGetStaffSuperDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffSuperDetails200Response>;

    /**
     * Returns a CSV file (`staff-export-<timestamp>.csv`) of current, unarchived staff in your organisation: either the staff you list in `staffIds`, or everyone matching the filters when `staffIds` is empty.  The header has eight columns (Full Name, Passcode, Payroll ID, Location(Areas), Position, Tags, Pay Rate, Last Login), but only the first five are filled on each row: name, time-clock passcode, payroll id, locations with their areas, and role. Answers 404 when no staff match.  Needs `staff.finance.read`; `staff.finance.write` alone is refused. Without `staff.personal.read`, searching by email or mobile and sorting by mobile are ignored.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * @summary Download staff details as a CSV file
     * @param {StaffStaffDetailsExportRequest} staffStaffDetailsExportRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffFinanceSensitiveApiInterface
     */
    staffStaffDetailsExportRaw(requestParameters: StaffStaffDetailsExportOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Blob>>;

    /**
     * Returns a CSV file (`staff-export-<timestamp>.csv`) of current, unarchived staff in your organisation: either the staff you list in `staffIds`, or everyone matching the filters when `staffIds` is empty.  The header has eight columns (Full Name, Passcode, Payroll ID, Location(Areas), Position, Tags, Pay Rate, Last Login), but only the first five are filled on each row: name, time-clock passcode, payroll id, locations with their areas, and role. Answers 404 when no staff match.  Needs `staff.finance.read`; `staff.finance.write` alone is refused. Without `staff.personal.read`, searching by email or mobile and sorting by mobile are ignored.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Download staff details as a CSV file
     */
    staffStaffDetailsExport(requestParameters: StaffStaffDetailsExportOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Blob>;

    /**
     * Adds or changes a staff member\'s TFN declaration. Answers 400 when it cannot be saved.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * @summary Save a staff member\'s tax declaration
     * @param {StaffTaxDeclarationCreateUpdateRequest} staffTaxDeclarationCreateUpdateRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffFinanceSensitiveApiInterface
     */
    staffTaxDeclarationCreateUpdateRaw(requestParameters: StaffTaxDeclarationCreateUpdateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffTaxDeclarationCreateUpdate200Response>>;

    /**
     * Adds or changes a staff member\'s TFN declaration. Answers 400 when it cannot be saved.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s tax declaration
     */
    staffTaxDeclarationCreateUpdate(requestParameters: StaffTaxDeclarationCreateUpdateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffTaxDeclarationCreateUpdate200Response>;

    /**
     * Returns a staff member\'s TFN declaration, including the tax file number. When none is saved the call still answers 200, with only a `message` and no `data`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get a staff member\'s tax declaration
     * @param {StaffTaxDeclarationGetRequest} staffTaxDeclarationGetRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffFinanceSensitiveApiInterface
     */
    staffTaxDeclarationGetRaw(requestParameters: StaffTaxDeclarationGetOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffTaxDeclarationGet200Response>>;

    /**
     * Returns a staff member\'s TFN declaration, including the tax file number. When none is saved the call still answers 200, with only a `message` and no `data`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s tax declaration
     */
    staffTaxDeclarationGet(requestParameters: StaffTaxDeclarationGetOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffTaxDeclarationGet200Response>;

    /**
     * Adds or edits a version of a staff member\'s tax details. Each version has an effective date: send `tblStaffTaxDetailId` to edit that version (and move it with `effectiveDate`), send only `effectiveDate` to edit or add the version on that date, or send neither to edit the current version.  Answers 400 when a required answer is missing for the choices made (for example a TFN when tfnOption is WillProvideTfn) or the save fails.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * @summary Save a staff member\'s tax details
     * @param {StaffTaxDetailCreateUpdateRequest} staffTaxDetailCreateUpdateRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffFinanceSensitiveApiInterface
     */
    staffTaxDetailCreateUpdateRaw(requestParameters: StaffTaxDetailCreateUpdateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffTaxDetailCreateUpdate200Response>>;

    /**
     * Adds or edits a version of a staff member\'s tax details. Each version has an effective date: send `tblStaffTaxDetailId` to edit that version (and move it with `effectiveDate`), send only `effectiveDate` to edit or add the version on that date, or send neither to edit the current version.  Answers 400 when a required answer is missing for the choices made (for example a TFN when tfnOption is WillProvideTfn) or the save fails.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s tax details
     */
    staffTaxDetailCreateUpdate(requestParameters: StaffTaxDetailCreateUpdateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffTaxDetailCreateUpdate200Response>;

    /**
     * Returns the version of a staff member\'s tax details in effect today, including the tax file number. When none is saved the call still answers 200, with only a `message` and no `data`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get a staff member\'s current tax details
     * @param {StaffTaxDeclarationGetRequest} staffTaxDeclarationGetRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffFinanceSensitiveApiInterface
     */
    staffTaxDetailGetRaw(requestParameters: StaffTaxDetailGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffTaxDetailGet200Response>>;

    /**
     * Returns the version of a staff member\'s tax details in effect today, including the tax file number. When none is saved the call still answers 200, with only a `message` and no `data`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s current tax details
     */
    staffTaxDetailGet(requestParameters: StaffTaxDetailGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffTaxDetailGet200Response>;

    /**
     * Returns a short summary (dates, pay basis and residency) of the staff member\'s tax details in effect today and any versions dated later. When nothing is saved the call answers 200 with only a `message`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * @summary List current and upcoming tax detail versions
     * @param {StaffTaxDeclarationGetRequest} staffTaxDeclarationGetRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffFinanceSensitiveApiInterface
     */
    staffTaxDetailHistoryCurrentUpcomingRaw(requestParameters: StaffTaxDetailHistoryCurrentUpcomingRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffTaxDetailHistoryCurrentUpcoming200Response>>;

    /**
     * Returns a short summary (dates, pay basis and residency) of the staff member\'s tax details in effect today and any versions dated later. When nothing is saved the call answers 200 with only a `message`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * List current and upcoming tax detail versions
     */
    staffTaxDetailHistoryCurrentUpcoming(requestParameters: StaffTaxDetailHistoryCurrentUpcomingRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffTaxDetailHistoryCurrentUpcoming200Response>;

    /**
     * Returns a short summary of the staff member\'s tax detail versions that are no longer in effect. When nothing is saved the call answers 200 with only a `message`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * @summary List past tax detail versions
     * @param {StaffTaxDeclarationGetRequest} staffTaxDeclarationGetRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffFinanceSensitiveApiInterface
     */
    staffTaxDetailHistoryPastRaw(requestParameters: StaffTaxDetailHistoryPastRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffTaxDetailHistoryPast200Response>>;

    /**
     * Returns a short summary of the staff member\'s tax detail versions that are no longer in effect. When nothing is saved the call answers 200 with only a `message`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * List past tax detail versions
     */
    staffTaxDetailHistoryPast(requestParameters: StaffTaxDetailHistoryPastRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffTaxDetailHistoryPast200Response>;

}

/**
 * 
 */
export class StaffFinanceSensitiveApi extends runtime.BaseAPI implements StaffFinanceSensitiveApiInterface {

    /**
     * Adds or changes the bank account a staff member in your organisation is paid into. `data` is the bank detail id.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s bank details
     */
    async staffAddUpdateStaffBankDetailsRaw(requestParameters: StaffAddUpdateStaffBankDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddUpdateStaffBankDetails200Response>> {
        if (requestParameters['staffAddUpdateStaffBankDetailsRequest'] == null) {
            throw new runtime.RequiredError(
                'staffAddUpdateStaffBankDetailsRequest',
                'Required parameter "staffAddUpdateStaffBankDetailsRequest" was null or undefined when calling staffAddUpdateStaffBankDetails().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.finance.write"]);
        }


        let urlPath = `/staff/add-update-staff-bank-details`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffAddUpdateStaffBankDetailsRequestToJSON(requestParameters['staffAddUpdateStaffBankDetailsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffAddUpdateStaffBankDetails200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds or changes the bank account a staff member in your organisation is paid into. `data` is the bank detail id.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s bank details
     */
    async staffAddUpdateStaffBankDetails(requestParameters: StaffAddUpdateStaffBankDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddUpdateStaffBankDetails200Response> {
        const response = await this.staffAddUpdateStaffBankDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Adds or changes a staff member\'s superannuation fund details, optionally with a supporting document. Send it as multipart/form-data. `data` is the super detail id.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s super details
     */
    async staffAddUpdateStaffSuperDetailsRaw(requestParameters: StaffAddUpdateStaffSuperDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddUpdateStaffSuperDetails200Response>> {
        if (requestParameters['tblStaffId'] == null) {
            throw new runtime.RequiredError(
                'tblStaffId',
                'Required parameter "tblStaffId" was null or undefined when calling staffAddUpdateStaffSuperDetails().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.finance.write"]);
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

        if (requestParameters['tblStaffSuperDetailId'] != null) {
            formParams.append('tblStaffSuperDetailId', requestParameters['tblStaffSuperDetailId'] as any);
        }

        if (requestParameters['tblStaffId'] != null) {
            formParams.append('tblStaffId', requestParameters['tblStaffId'] as any);
        }

        if (requestParameters['isExistingSuper'] != null) {
            formParams.append('isExistingSuper', requestParameters['isExistingSuper'] as any);
        }

        if (requestParameters['isAPRAFund'] != null) {
            formParams.append('isAPRAFund', requestParameters['isAPRAFund'] as any);
        }

        if (requestParameters['smsfSuperName'] != null) {
            formParams.append('smsfSuperName', requestParameters['smsfSuperName'] as any);
        }

        if (requestParameters['superNameId'] != null) {
            formParams.append('superNameId', requestParameters['superNameId'] as any);
        }

        if (requestParameters['memberNum'] != null) {
            formParams.append('memberNum', requestParameters['memberNum'] as any);
        }

        if (requestParameters['fundABN'] != null) {
            formParams.append('fundABN', requestParameters['fundABN'] as any);
        }

        if (requestParameters['accountName'] != null) {
            formParams.append('accountName', requestParameters['accountName'] as any);
        }

        if (requestParameters['bsbNum'] != null) {
            formParams.append('bsbNum', requestParameters['bsbNum'] as any);
        }

        if (requestParameters['accountNum'] != null) {
            formParams.append('accountNum', requestParameters['accountNum'] as any);
        }

        if (requestParameters['attachment'] != null) {
            formParams.append('attachment', requestParameters['attachment'] as any);
        }

        if (requestParameters['removeAttachment'] != null) {
            formParams.append('removeAttachment', requestParameters['removeAttachment'] as any);
        }


        let urlPath = `/staff/add-update-staff-super-details`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffAddUpdateStaffSuperDetails200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds or changes a staff member\'s superannuation fund details, optionally with a supporting document. Send it as multipart/form-data. `data` is the super detail id.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s super details
     */
    async staffAddUpdateStaffSuperDetails(requestParameters: StaffAddUpdateStaffSuperDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddUpdateStaffSuperDetails200Response> {
        const response = await this.staffAddUpdateStaffSuperDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the bank account a staff member in your organisation is paid into. Answers 404 when none is saved.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s bank details
     */
    async staffGetStaffBankDetailsRaw(requestParameters: StaffGetStaffBankDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffBankDetails200Response>> {
        if (requestParameters['staffId'] == null) {
            throw new runtime.RequiredError(
                'staffId',
                'Required parameter "staffId" was null or undefined when calling staffGetStaffBankDetails().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['staffId'] != null) {
            queryParameters['staffId'] = requestParameters['staffId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.finance.read"]);
        }


        let urlPath = `/staff/get-staff-bank-details`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetStaffBankDetails200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the bank account a staff member in your organisation is paid into. Answers 404 when none is saved.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s bank details
     */
    async staffGetStaffBankDetails(requestParameters: StaffGetStaffBankDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffBankDetails200Response> {
        const response = await this.staffGetStaffBankDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a staff member\'s bank and super details in one call. When neither is saved the call still answers 200, with only a `message` and no `data`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s bank and super details together
     */
    async staffGetStaffFinanceDetailsRaw(requestParameters: StaffGetStaffFinanceDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffFinanceDetails200Response>> {
        if (requestParameters['staffId'] == null) {
            throw new runtime.RequiredError(
                'staffId',
                'Required parameter "staffId" was null or undefined when calling staffGetStaffFinanceDetails().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['staffId'] != null) {
            queryParameters['staffId'] = requestParameters['staffId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.finance.read"]);
        }


        let urlPath = `/staff/get-staff-finance-details`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetStaffFinanceDetails200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a staff member\'s bank and super details in one call. When neither is saved the call still answers 200, with only a `message` and no `data`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s bank and super details together
     */
    async staffGetStaffFinanceDetails(requestParameters: StaffGetStaffFinanceDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffFinanceDetails200Response> {
        const response = await this.staffGetStaffFinanceDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a staff member\'s superannuation fund details: an APRA fund with member number, or a self-managed fund with its ABN and bank account. Answers 404 when none are saved.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s super details
     */
    async staffGetStaffSuperDetailsRaw(requestParameters: StaffGetStaffSuperDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffSuperDetails200Response>> {
        if (requestParameters['staffId'] == null) {
            throw new runtime.RequiredError(
                'staffId',
                'Required parameter "staffId" was null or undefined when calling staffGetStaffSuperDetails().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['staffId'] != null) {
            queryParameters['staffId'] = requestParameters['staffId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.finance.read"]);
        }


        let urlPath = `/staff/get-staff-super-details`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetStaffSuperDetails200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a staff member\'s superannuation fund details: an APRA fund with member number, or a self-managed fund with its ABN and bank account. Answers 404 when none are saved.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s super details
     */
    async staffGetStaffSuperDetails(requestParameters: StaffGetStaffSuperDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffSuperDetails200Response> {
        const response = await this.staffGetStaffSuperDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a CSV file (`staff-export-<timestamp>.csv`) of current, unarchived staff in your organisation: either the staff you list in `staffIds`, or everyone matching the filters when `staffIds` is empty.  The header has eight columns (Full Name, Passcode, Payroll ID, Location(Areas), Position, Tags, Pay Rate, Last Login), but only the first five are filled on each row: name, time-clock passcode, payroll id, locations with their areas, and role. Answers 404 when no staff match.  Needs `staff.finance.read`; `staff.finance.write` alone is refused. Without `staff.personal.read`, searching by email or mobile and sorting by mobile are ignored.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Download staff details as a CSV file
     */
    async staffStaffDetailsExportRaw(requestParameters: StaffStaffDetailsExportOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Blob>> {
        if (requestParameters['staffStaffDetailsExportRequest'] == null) {
            throw new runtime.RequiredError(
                'staffStaffDetailsExportRequest',
                'Required parameter "staffStaffDetailsExportRequest" was null or undefined when calling staffStaffDetailsExport().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.finance.read"]);
        }


        let urlPath = `/staff/staff-details-export`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffStaffDetailsExportRequestToJSON(requestParameters['staffStaffDetailsExportRequest']),
        }, initOverrides);

        return new runtime.BlobApiResponse(response);
    }

    /**
     * Returns a CSV file (`staff-export-<timestamp>.csv`) of current, unarchived staff in your organisation: either the staff you list in `staffIds`, or everyone matching the filters when `staffIds` is empty.  The header has eight columns (Full Name, Passcode, Payroll ID, Location(Areas), Position, Tags, Pay Rate, Last Login), but only the first five are filled on each row: name, time-clock passcode, payroll id, locations with their areas, and role. Answers 404 when no staff match.  Needs `staff.finance.read`; `staff.finance.write` alone is refused. Without `staff.personal.read`, searching by email or mobile and sorting by mobile are ignored.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Download staff details as a CSV file
     */
    async staffStaffDetailsExport(requestParameters: StaffStaffDetailsExportOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Blob> {
        const response = await this.staffStaffDetailsExportRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Adds or changes a staff member\'s TFN declaration. Answers 400 when it cannot be saved.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s tax declaration
     */
    async staffTaxDeclarationCreateUpdateRaw(requestParameters: StaffTaxDeclarationCreateUpdateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffTaxDeclarationCreateUpdate200Response>> {
        if (requestParameters['staffTaxDeclarationCreateUpdateRequest'] == null) {
            throw new runtime.RequiredError(
                'staffTaxDeclarationCreateUpdateRequest',
                'Required parameter "staffTaxDeclarationCreateUpdateRequest" was null or undefined when calling staffTaxDeclarationCreateUpdate().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.finance.write"]);
        }


        let urlPath = `/staff/tax-declaration/create-update`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffTaxDeclarationCreateUpdateRequestToJSON(requestParameters['staffTaxDeclarationCreateUpdateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffTaxDeclarationCreateUpdate200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds or changes a staff member\'s TFN declaration. Answers 400 when it cannot be saved.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s tax declaration
     */
    async staffTaxDeclarationCreateUpdate(requestParameters: StaffTaxDeclarationCreateUpdateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffTaxDeclarationCreateUpdate200Response> {
        const response = await this.staffTaxDeclarationCreateUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a staff member\'s TFN declaration, including the tax file number. When none is saved the call still answers 200, with only a `message` and no `data`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s tax declaration
     */
    async staffTaxDeclarationGetRaw(requestParameters: StaffTaxDeclarationGetOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffTaxDeclarationGet200Response>> {
        if (requestParameters['staffTaxDeclarationGetRequest'] == null) {
            throw new runtime.RequiredError(
                'staffTaxDeclarationGetRequest',
                'Required parameter "staffTaxDeclarationGetRequest" was null or undefined when calling staffTaxDeclarationGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.finance.read"]);
        }


        let urlPath = `/staff/tax-declaration/get`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffTaxDeclarationGetRequestToJSON(requestParameters['staffTaxDeclarationGetRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffTaxDeclarationGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a staff member\'s TFN declaration, including the tax file number. When none is saved the call still answers 200, with only a `message` and no `data`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s tax declaration
     */
    async staffTaxDeclarationGet(requestParameters: StaffTaxDeclarationGetOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffTaxDeclarationGet200Response> {
        const response = await this.staffTaxDeclarationGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Adds or edits a version of a staff member\'s tax details. Each version has an effective date: send `tblStaffTaxDetailId` to edit that version (and move it with `effectiveDate`), send only `effectiveDate` to edit or add the version on that date, or send neither to edit the current version.  Answers 400 when a required answer is missing for the choices made (for example a TFN when tfnOption is WillProvideTfn) or the save fails.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s tax details
     */
    async staffTaxDetailCreateUpdateRaw(requestParameters: StaffTaxDetailCreateUpdateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffTaxDetailCreateUpdate200Response>> {
        if (requestParameters['staffTaxDetailCreateUpdateRequest'] == null) {
            throw new runtime.RequiredError(
                'staffTaxDetailCreateUpdateRequest',
                'Required parameter "staffTaxDetailCreateUpdateRequest" was null or undefined when calling staffTaxDetailCreateUpdate().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.finance.write"]);
        }


        let urlPath = `/staff/tax-detail/create-update`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffTaxDetailCreateUpdateRequestToJSON(requestParameters['staffTaxDetailCreateUpdateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffTaxDetailCreateUpdate200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds or edits a version of a staff member\'s tax details. Each version has an effective date: send `tblStaffTaxDetailId` to edit that version (and move it with `effectiveDate`), send only `effectiveDate` to edit or add the version on that date, or send neither to edit the current version.  Answers 400 when a required answer is missing for the choices made (for example a TFN when tfnOption is WillProvideTfn) or the save fails.  **Required scope:** `staff.finance.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s tax details
     */
    async staffTaxDetailCreateUpdate(requestParameters: StaffTaxDetailCreateUpdateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffTaxDetailCreateUpdate200Response> {
        const response = await this.staffTaxDetailCreateUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the version of a staff member\'s tax details in effect today, including the tax file number. When none is saved the call still answers 200, with only a `message` and no `data`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s current tax details
     */
    async staffTaxDetailGetRaw(requestParameters: StaffTaxDetailGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffTaxDetailGet200Response>> {
        if (requestParameters['staffTaxDeclarationGetRequest'] == null) {
            throw new runtime.RequiredError(
                'staffTaxDeclarationGetRequest',
                'Required parameter "staffTaxDeclarationGetRequest" was null or undefined when calling staffTaxDetailGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.finance.read"]);
        }


        let urlPath = `/staff/tax-detail/get`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffTaxDeclarationGetRequestToJSON(requestParameters['staffTaxDeclarationGetRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffTaxDetailGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the version of a staff member\'s tax details in effect today, including the tax file number. When none is saved the call still answers 200, with only a `message` and no `data`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s current tax details
     */
    async staffTaxDetailGet(requestParameters: StaffTaxDetailGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffTaxDetailGet200Response> {
        const response = await this.staffTaxDetailGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a short summary (dates, pay basis and residency) of the staff member\'s tax details in effect today and any versions dated later. When nothing is saved the call answers 200 with only a `message`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * List current and upcoming tax detail versions
     */
    async staffTaxDetailHistoryCurrentUpcomingRaw(requestParameters: StaffTaxDetailHistoryCurrentUpcomingRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffTaxDetailHistoryCurrentUpcoming200Response>> {
        if (requestParameters['staffTaxDeclarationGetRequest'] == null) {
            throw new runtime.RequiredError(
                'staffTaxDeclarationGetRequest',
                'Required parameter "staffTaxDeclarationGetRequest" was null or undefined when calling staffTaxDetailHistoryCurrentUpcoming().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.finance.read"]);
        }


        let urlPath = `/staff/tax-detail/history/current-upcoming`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffTaxDeclarationGetRequestToJSON(requestParameters['staffTaxDeclarationGetRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffTaxDetailHistoryCurrentUpcoming200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a short summary (dates, pay basis and residency) of the staff member\'s tax details in effect today and any versions dated later. When nothing is saved the call answers 200 with only a `message`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * List current and upcoming tax detail versions
     */
    async staffTaxDetailHistoryCurrentUpcoming(requestParameters: StaffTaxDetailHistoryCurrentUpcomingRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffTaxDetailHistoryCurrentUpcoming200Response> {
        const response = await this.staffTaxDetailHistoryCurrentUpcomingRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a short summary of the staff member\'s tax detail versions that are no longer in effect. When nothing is saved the call answers 200 with only a `message`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * List past tax detail versions
     */
    async staffTaxDetailHistoryPastRaw(requestParameters: StaffTaxDetailHistoryPastRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffTaxDetailHistoryPast200Response>> {
        if (requestParameters['staffTaxDeclarationGetRequest'] == null) {
            throw new runtime.RequiredError(
                'staffTaxDeclarationGetRequest',
                'Required parameter "staffTaxDeclarationGetRequest" was null or undefined when calling staffTaxDetailHistoryPast().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.finance.read"]);
        }


        let urlPath = `/staff/tax-detail/history/past`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffTaxDeclarationGetRequestToJSON(requestParameters['staffTaxDeclarationGetRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffTaxDetailHistoryPast200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a short summary of the staff member\'s tax detail versions that are no longer in effect. When nothing is saved the call answers 200 with only a `message`.  **Required scope:** `staff.finance.read`  See **Responses** below for the status codes this operation can return.
     * List past tax detail versions
     */
    async staffTaxDetailHistoryPast(requestParameters: StaffTaxDetailHistoryPastRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffTaxDetailHistoryPast200Response> {
        const response = await this.staffTaxDetailHistoryPastRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
