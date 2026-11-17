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
  StaffAddUpdateQualification200Response,
  StaffAddUpdateQualificationRequest,
  StaffAddUpdateStaffQualificationDetails200Response,
  StaffDeleteQualification200Response,
  StaffDeleteStaff200Response,
  StaffGetQualificationDetails200Response,
  StaffGetQualificationList200Response,
  StaffGetStaffQualificationDetails200Response,
  StaffGetStaffQualificationList200Response,
  StaffGetStaffQualificationListRequest,
  StaffGetTenantQualificationListRequest,
  StaffUpdateQualificationStatusFlag200Response,
  ValidationProblem,
} from '../models/index.js';
import {
    EnvelopeFromJSON,
    EnvelopeToJSON,
    StaffAddUpdateQualification200ResponseFromJSON,
    StaffAddUpdateQualification200ResponseToJSON,
    StaffAddUpdateQualificationRequestFromJSON,
    StaffAddUpdateQualificationRequestToJSON,
    StaffAddUpdateStaffQualificationDetails200ResponseFromJSON,
    StaffAddUpdateStaffQualificationDetails200ResponseToJSON,
    StaffDeleteQualification200ResponseFromJSON,
    StaffDeleteQualification200ResponseToJSON,
    StaffDeleteStaff200ResponseFromJSON,
    StaffDeleteStaff200ResponseToJSON,
    StaffGetQualificationDetails200ResponseFromJSON,
    StaffGetQualificationDetails200ResponseToJSON,
    StaffGetQualificationList200ResponseFromJSON,
    StaffGetQualificationList200ResponseToJSON,
    StaffGetStaffQualificationDetails200ResponseFromJSON,
    StaffGetStaffQualificationDetails200ResponseToJSON,
    StaffGetStaffQualificationList200ResponseFromJSON,
    StaffGetStaffQualificationList200ResponseToJSON,
    StaffGetStaffQualificationListRequestFromJSON,
    StaffGetStaffQualificationListRequestToJSON,
    StaffGetTenantQualificationListRequestFromJSON,
    StaffGetTenantQualificationListRequestToJSON,
    StaffUpdateQualificationStatusFlag200ResponseFromJSON,
    StaffUpdateQualificationStatusFlag200ResponseToJSON,
    ValidationProblemFromJSON,
    ValidationProblemToJSON,
} from '../models/index.js';

export interface StaffAddUpdateQualificationOperationRequest {
    staffAddUpdateQualificationRequest: StaffAddUpdateQualificationRequest;
}

export interface StaffAddUpdateStaffQualificationDetailsRequest {
    companyType: number;
    companyId?: string;
    companyStaffId?: string;
    tblStaffQualificationDetailsId?: string;
    tblQualificationId?: string | null;
    tblStaffId?: string | null;
    qualificationName?: string | null;
    email?: string | null;
    staffName?: string | null;
    contactSupportEmail?: string | null;
    uploadLink?: string | null;
    registrationNumber?: string | null;
    issueDate?: string | null;
    expiryDate?: string | null;
    note?: string | null;
    requesterNote?: string | null;
    status?: string | null;
    comment?: string | null;
    dueDate?: string | null;
    newAttachments?: Array<Blob> | null;
    deletedAttachments?: Array<string> | null;
    additionalDetailsJson?: string | null;
}

export interface StaffDeleteQualificationRequest {
    qualificationId: string;
}

export interface StaffDeleteStaffQualificationDetailsRequest {
    staffQualificationDetailsId: string;
}

export interface StaffGetQualificationDetailsRequest {
    qualificationId: string;
}

export interface StaffGetQualificationListRequest {
    search?: string | null;
    sortBy?: string | null;
    order?: string | null;
    status?: number | null;
    page?: number;
    pageSize?: number;
    tblTenantId?: string | null;
    companyType?: number;
    companyId?: string | null;
}

export interface StaffGetStaffQualificationDetailsRequest {
    staffQualificationId: string;
}

export interface StaffGetStaffQualificationListOperationRequest {
    staffGetStaffQualificationListRequest: StaffGetStaffQualificationListRequest;
}

export interface StaffGetTenantQualificationListOperationRequest {
    staffGetTenantQualificationListRequest: StaffGetTenantQualificationListRequest;
}

export interface StaffUpdateQualificationActiveStatusRequest {
    qualificationId: string;
    status: boolean;
}

export interface StaffUpdateQualificationStatusFlagRequest {
    qualificationId: string;
    status: boolean;
}

/**
 * QualificationsApi - interface
 * 
 * @export
 * @interface QualificationsApiInterface
 */
export interface QualificationsApiInterface {
    /**
     * Adds a qualification to your organisation\'s own catalogue, or changes one when `tblQualificationId` is set. Send `companyType: 1` and your organisation id as `companyId`: without the id the qualification would be a platform one, which is refused (404).  `data` is the number of rows saved. Answers 409 when the catalogue already has a qualification with the same name for one of the same industries.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * @summary Add or update a qualification in your catalogue
     * @param {StaffAddUpdateQualificationRequest} staffAddUpdateQualificationRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QualificationsApiInterface
     */
    staffAddUpdateQualificationRaw(requestParameters: StaffAddUpdateQualificationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddUpdateQualification200Response>>;

    /**
     * Adds a qualification to your organisation\'s own catalogue, or changes one when `tblQualificationId` is set. Send `companyType: 1` and your organisation id as `companyId`: without the id the qualification would be a platform one, which is refused (404).  `data` is the number of rows saved. Answers 409 when the catalogue already has a qualification with the same name for one of the same industries.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Add or update a qualification in your catalogue
     */
    staffAddUpdateQualification(requestParameters: StaffAddUpdateQualificationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddUpdateQualification200Response>;

    /**
     * Adds a qualification record for a staff member in your organisation, or changes one when `tblStaffQualificationDetailsId` is set. Send it as multipart/form-data with `companyType: 1` and the staff id as `companyStaffId` (or the older `tblStaffId`). Setting the status to Approved or Rejected is refused with 403: verification stays a person\'s decision. Saving a record that already has that status is allowed.  `data` is the record id. If the person already has a record for that qualification, nothing is saved and the call answers 200 with an empty id and the message \"Staff qualification details already exist.\". Dates are checked: the issue date cannot be in the future or after the expiry date, and an expired document is refused with 400. No email is sent to anyone: `notify` and `requesterById` are ignored for an integration.  A staff member or catalogue row of another organisation answers 404.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * @summary Add or update a staff qualification record
     * @param {number} companyType 1 tenant or 2 agency: who owns the record (1 Tenant · 2 Agency · 3 Platform)
     * @param {string} [companyId] The owner. Omit it to use the company on your token; another company is refused
     * @param {string} [companyStaffId] The person: a tenant staff id (companyType 1) or an agency candidate id (companyType 2)
     * @param {string} [tblStaffQualificationDetailsId] Omit (or send an empty id) to add a record; send an existing id to change it
     * @param {string} [tblQualificationId] The qualification
     * @param {string} [tblStaffId] Older way to name a tenant staff member; when companyStaffId is empty it sets a tenant record for this staff id
     * @param {string} [qualificationName] The qualification name, used in the notification email
     * @param {string} [email] Where to send the notification email when notify is true
     * @param {string} [staffName] The person\\\&#39;s name, used in the notification email
     * @param {string} [contactSupportEmail] A support address shown in a rejection email
     * @param {string} [uploadLink] A link shown in the notification email
     * @param {string} [registrationNumber] Registration or certificate number
     * @param {string} [issueDate] Issue date; cannot be in the future or after the expiry date A calendar date with no time zone; not an instant.
     * @param {string} [expiryDate] Expiry date; cannot be in the past A calendar date with no time zone; not an instant.
     * @param {string} [note] A note
     * @param {string} [requesterNote] A note to the person, or the reason for rejection
     * @param {string} [status] Status name: \\\&quot;Needs Approval\\\&quot;, \\\&quot;Pending Verification\\\&quot;, \\\&quot;Expiring Soon\\\&quot;, \\\&quot;Requested\\\&quot;, \\\&quot;Approved\\\&quot; or \\\&quot;Rejected\\\&quot;
     * @param {string} [comment] A comment
     * @param {string} [dueDate] When the qualification is due A calendar date with no time zone; not an instant.
     * @param {Array<Blob>} [newAttachments] Documents to attach; repeat the field for several
     * @param {Array<string>} [deletedAttachments] Attachment file ids to remove
     * @param {string} [additionalDetailsJson] Answers to the qualification\\\&#39;s extra fields, as a JSON array of { tblStaffQualificationAdditionalFieldDetailsId, tblStaffQualificationDetailsId, tblQualificationAdditionalFieldId, value }
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QualificationsApiInterface
     */
    staffAddUpdateStaffQualificationDetailsRaw(requestParameters: StaffAddUpdateStaffQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddUpdateStaffQualificationDetails200Response>>;

    /**
     * Adds a qualification record for a staff member in your organisation, or changes one when `tblStaffQualificationDetailsId` is set. Send it as multipart/form-data with `companyType: 1` and the staff id as `companyStaffId` (or the older `tblStaffId`). Setting the status to Approved or Rejected is refused with 403: verification stays a person\'s decision. Saving a record that already has that status is allowed.  `data` is the record id. If the person already has a record for that qualification, nothing is saved and the call answers 200 with an empty id and the message \"Staff qualification details already exist.\". Dates are checked: the issue date cannot be in the future or after the expiry date, and an expired document is refused with 400. No email is sent to anyone: `notify` and `requesterById` are ignored for an integration.  A staff member or catalogue row of another organisation answers 404.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Add or update a staff qualification record
     */
    staffAddUpdateStaffQualificationDetails(requestParameters: StaffAddUpdateStaffQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddUpdateStaffQualificationDetails200Response>;

    /**
     * Removes a qualification from your organisation\'s catalogue. Answers 409 when any staff qualification record refers to it (including removed ones), and 404 for a qualification owned by another company or a platform qualification. This is a GET request that changes data: send it once and do not let anything replay it.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * @summary Delete a qualification from your catalogue
     * @param {string} qualificationId The qualification id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QualificationsApiInterface
     */
    staffDeleteQualificationRaw(requestParameters: StaffDeleteQualificationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffDeleteQualification200Response>>;

    /**
     * Removes a qualification from your organisation\'s catalogue. Answers 409 when any staff qualification record refers to it (including removed ones), and 404 for a qualification owned by another company or a platform qualification. This is a GET request that changes data: send it once and do not let anything replay it.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Delete a qualification from your catalogue
     */
    staffDeleteQualification(requestParameters: StaffDeleteQualificationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffDeleteQualification200Response>;

    /**
     * Removes one qualification record owned by your organisation. Records owned by another company answer 404. This is a GET request that changes data: send it once and do not let anything replay it.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * @summary Delete a staff qualification record
     * @param {string} staffQualificationDetailsId The staff qualification id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QualificationsApiInterface
     */
    staffDeleteStaffQualificationDetailsRaw(requestParameters: StaffDeleteStaffQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffDeleteStaff200Response>>;

    /**
     * Removes one qualification record owned by your organisation. Records owned by another company answer 404. This is a GET request that changes data: send it once and do not let anything replay it.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Delete a staff qualification record
     */
    staffDeleteStaffQualificationDetails(requestParameters: StaffDeleteStaffQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffDeleteStaff200Response>;

    /**
     * Returns one qualification from your organisation\'s catalogue or the shared platform catalogue: its labels, required dates, validity, reminder days, hours limit, rostering rules, extra fields, states and industries. A qualification owned by another company is not returned: `data` is null with a \"not found\" message.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one qualification
     * @param {string} qualificationId The qualification id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QualificationsApiInterface
     */
    staffGetQualificationDetailsRaw(requestParameters: StaffGetQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetQualificationDetails200Response>>;

    /**
     * Returns one qualification from your organisation\'s catalogue or the shared platform catalogue: its labels, required dates, validity, reminder days, hours limit, rostering rules, extra fields, states and industries. A qualification owned by another company is not returned: `data` is null with a \"not found\" message.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Get one qualification
     */
    staffGetQualificationDetails(requestParameters: StaffGetQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetQualificationDetails200Response>;

    /**
     * Returns a page of qualifications from a catalogue: your organisation\'s own (send `companyType: 1` and your organisation id as `companyId`), or the shared platform catalogue when `companyId` is left out.  Each entry shows the qualification\'s type, validity, hours limit, industries, states, the areas that require it and the staff who hold it.  Each holder\'s `staffEmail` needs `staff.personal.read`; without it it is null.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * @summary List qualifications
     * @param {string} [search] Matches part of the qualification name
     * @param {string} [sortBy] The field to sort by, for example \&quot;QualificationName\&quot;
     * @param {string} [order] \&quot;asc\&quot; or \&quot;desc\&quot;
     * @param {number} [status] 1 lists active qualifications; any other number lists inactive ones; omit for both
     * @param {number} [page] Page number, from 1
     * @param {number} [pageSize] Rows per page, 1 to 10000 Above 200 is lowered to 200 without an error.
     * @param {string} [tblTenantId] Older way to name your catalogue; same as companyType 1 with companyId
     * @param {number} [companyType] Whose catalogue to list: 1 your organisation\&#39;s (needs companyId), or omit companyId for the shared platform catalogue (1 Tenant · 2 Agency · 3 Platform)
     * @param {string} [companyId] Your organisation id. Without it, companyType 1 lists the shared platform catalogue. Another organisation\&#39;s id answers 404
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QualificationsApiInterface
     */
    staffGetQualificationListRaw(requestParameters: StaffGetQualificationListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetQualificationList200Response>>;

    /**
     * Returns a page of qualifications from a catalogue: your organisation\'s own (send `companyType: 1` and your organisation id as `companyId`), or the shared platform catalogue when `companyId` is left out.  Each entry shows the qualification\'s type, validity, hours limit, industries, states, the areas that require it and the staff who hold it.  Each holder\'s `staffEmail` needs `staff.personal.read`; without it it is null.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * List qualifications
     */
    staffGetQualificationList(requestParameters: StaffGetQualificationListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetQualificationList200Response>;

    /**
     * Returns one qualification record owned by your organisation, with its extra-field answers and attachments. A record owned by another company is not returned: `data` is null with a \"not found\" message.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one staff qualification record
     * @param {string} staffQualificationId The staff qualification id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QualificationsApiInterface
     */
    staffGetStaffQualificationDetailsRaw(requestParameters: StaffGetStaffQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffQualificationDetails200Response>>;

    /**
     * Returns one qualification record owned by your organisation, with its extra-field answers and attachments. A record owned by another company is not returned: `data` is null with a \"not found\" message.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Get one staff qualification record
     */
    staffGetStaffQualificationDetails(requestParameters: StaffGetStaffQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffQualificationDetails200Response>;

    /**
     * Returns every qualification your organisation holds on record for one staff member: number, issue and expiry dates, status, verification, attachments and whether action is needed because it expires soon. Only records owned by your organisation are returned.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * @summary List a staff member\'s qualifications
     * @param {StaffGetStaffQualificationListRequest} staffGetStaffQualificationListRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QualificationsApiInterface
     */
    staffGetStaffQualificationListRaw(requestParameters: StaffGetStaffQualificationListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffQualificationList200Response>>;

    /**
     * Returns every qualification your organisation holds on record for one staff member: number, issue and expiry dates, status, verification, attachments and whether action is needed because it expires soon. Only records owned by your organisation are returned.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * List a staff member\'s qualifications
     */
    staffGetStaffQualificationList(requestParameters: StaffGetStaffQualificationListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffQualificationList200Response>;

    /**
     * Returns a short page of your organisation\'s own qualifications (id, name, industries, states and whether active). With `staffId` it lists instead the qualifications required by the locations and areas that staff member works in. The staff member must belong to your organisation, or the call is refused with 403.  Tenant tokens only: an agency token is refused with 403.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * @summary List your organisation\'s qualifications for a picker
     * @param {StaffGetTenantQualificationListRequest} staffGetTenantQualificationListRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QualificationsApiInterface
     */
    staffGetTenantQualificationListRaw(requestParameters: StaffGetTenantQualificationListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetQualificationList200Response>>;

    /**
     * Returns a short page of your organisation\'s own qualifications (id, name, industries, states and whether active). With `staffId` it lists instead the qualifications required by the locations and areas that staff member works in. The staff member must belong to your organisation, or the call is refused with 403.  Tenant tokens only: an agency token is refused with 403.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * List your organisation\'s qualifications for a picker
     */
    staffGetTenantQualificationList(requestParameters: StaffGetTenantQualificationListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetQualificationList200Response>;

    /**
     * Sets whether a qualification in your organisation\'s catalogue is active, the same change as the status-flag route. Answers 404 for a qualification owned by another company or a platform qualification. This is a GET request that changes data.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * @summary Set a qualification active or inactive
     * @param {string} qualificationId The qualification id
     * @param {boolean} status true for active, false for inactive
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QualificationsApiInterface
     */
    staffUpdateQualificationActiveStatusRaw(requestParameters: StaffUpdateQualificationActiveStatusRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffUpdateQualificationStatusFlag200Response>>;

    /**
     * Sets whether a qualification in your organisation\'s catalogue is active, the same change as the status-flag route. Answers 404 for a qualification owned by another company or a platform qualification. This is a GET request that changes data.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Set a qualification active or inactive
     */
    staffUpdateQualificationActiveStatus(requestParameters: StaffUpdateQualificationActiveStatusRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffUpdateQualificationStatusFlag200Response>;

    /**
     * Sets whether a qualification in your organisation\'s catalogue is active. Answers 404 for a qualification owned by another company or a platform qualification. This is a GET request that changes data.  This route and the next one make the same change; use either.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * @summary Turn a qualification on or off
     * @param {string} qualificationId The qualification id
     * @param {boolean} status true for active, false for inactive
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QualificationsApiInterface
     */
    staffUpdateQualificationStatusFlagRaw(requestParameters: StaffUpdateQualificationStatusFlagRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffUpdateQualificationStatusFlag200Response>>;

    /**
     * Sets whether a qualification in your organisation\'s catalogue is active. Answers 404 for a qualification owned by another company or a platform qualification. This is a GET request that changes data.  This route and the next one make the same change; use either.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Turn a qualification on or off
     */
    staffUpdateQualificationStatusFlag(requestParameters: StaffUpdateQualificationStatusFlagRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffUpdateQualificationStatusFlag200Response>;

}

/**
 * 
 */
export class QualificationsApi extends runtime.BaseAPI implements QualificationsApiInterface {

    /**
     * Adds a qualification to your organisation\'s own catalogue, or changes one when `tblQualificationId` is set. Send `companyType: 1` and your organisation id as `companyId`: without the id the qualification would be a platform one, which is refused (404).  `data` is the number of rows saved. Answers 409 when the catalogue already has a qualification with the same name for one of the same industries.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Add or update a qualification in your catalogue
     */
    async staffAddUpdateQualificationRaw(requestParameters: StaffAddUpdateQualificationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddUpdateQualification200Response>> {
        if (requestParameters['staffAddUpdateQualificationRequest'] == null) {
            throw new runtime.RequiredError(
                'staffAddUpdateQualificationRequest',
                'Required parameter "staffAddUpdateQualificationRequest" was null or undefined when calling staffAddUpdateQualification().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["qualifications.write"]);
        }


        let urlPath = `/staff/add-update-qualification`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffAddUpdateQualificationRequestToJSON(requestParameters['staffAddUpdateQualificationRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffAddUpdateQualification200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds a qualification to your organisation\'s own catalogue, or changes one when `tblQualificationId` is set. Send `companyType: 1` and your organisation id as `companyId`: without the id the qualification would be a platform one, which is refused (404).  `data` is the number of rows saved. Answers 409 when the catalogue already has a qualification with the same name for one of the same industries.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Add or update a qualification in your catalogue
     */
    async staffAddUpdateQualification(requestParameters: StaffAddUpdateQualificationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddUpdateQualification200Response> {
        const response = await this.staffAddUpdateQualificationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Adds a qualification record for a staff member in your organisation, or changes one when `tblStaffQualificationDetailsId` is set. Send it as multipart/form-data with `companyType: 1` and the staff id as `companyStaffId` (or the older `tblStaffId`). Setting the status to Approved or Rejected is refused with 403: verification stays a person\'s decision. Saving a record that already has that status is allowed.  `data` is the record id. If the person already has a record for that qualification, nothing is saved and the call answers 200 with an empty id and the message \"Staff qualification details already exist.\". Dates are checked: the issue date cannot be in the future or after the expiry date, and an expired document is refused with 400. No email is sent to anyone: `notify` and `requesterById` are ignored for an integration.  A staff member or catalogue row of another organisation answers 404.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Add or update a staff qualification record
     */
    async staffAddUpdateStaffQualificationDetailsRaw(requestParameters: StaffAddUpdateStaffQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddUpdateStaffQualificationDetails200Response>> {
        if (requestParameters['companyType'] == null) {
            throw new runtime.RequiredError(
                'companyType',
                'Required parameter "companyType" was null or undefined when calling staffAddUpdateStaffQualificationDetails().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["qualifications.write"]);
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

        if (requestParameters['companyType'] != null) {
            formParams.append('companyType', requestParameters['companyType'] as any);
        }

        if (requestParameters['companyId'] != null) {
            formParams.append('companyId', requestParameters['companyId'] as any);
        }

        if (requestParameters['companyStaffId'] != null) {
            formParams.append('companyStaffId', requestParameters['companyStaffId'] as any);
        }

        if (requestParameters['tblStaffQualificationDetailsId'] != null) {
            formParams.append('tblStaffQualificationDetailsId', requestParameters['tblStaffQualificationDetailsId'] as any);
        }

        if (requestParameters['tblQualificationId'] != null) {
            formParams.append('tblQualificationId', requestParameters['tblQualificationId'] as any);
        }

        if (requestParameters['tblStaffId'] != null) {
            formParams.append('tblStaffId', requestParameters['tblStaffId'] as any);
        }

        if (requestParameters['qualificationName'] != null) {
            formParams.append('qualificationName', requestParameters['qualificationName'] as any);
        }

        if (requestParameters['email'] != null) {
            formParams.append('email', requestParameters['email'] as any);
        }

        if (requestParameters['staffName'] != null) {
            formParams.append('staffName', requestParameters['staffName'] as any);
        }

        if (requestParameters['contactSupportEmail'] != null) {
            formParams.append('contactSupportEmail', requestParameters['contactSupportEmail'] as any);
        }

        if (requestParameters['uploadLink'] != null) {
            formParams.append('uploadLink', requestParameters['uploadLink'] as any);
        }

        if (requestParameters['registrationNumber'] != null) {
            formParams.append('registrationNumber', requestParameters['registrationNumber'] as any);
        }

        if (requestParameters['issueDate'] != null) {
            formParams.append('issueDate', requestParameters['issueDate'] as any);
        }

        if (requestParameters['expiryDate'] != null) {
            formParams.append('expiryDate', requestParameters['expiryDate'] as any);
        }

        if (requestParameters['note'] != null) {
            formParams.append('note', requestParameters['note'] as any);
        }

        if (requestParameters['requesterNote'] != null) {
            formParams.append('requesterNote', requestParameters['requesterNote'] as any);
        }

        if (requestParameters['status'] != null) {
            formParams.append('status', requestParameters['status'] as any);
        }

        if (requestParameters['comment'] != null) {
            formParams.append('comment', requestParameters['comment'] as any);
        }

        if (requestParameters['dueDate'] != null) {
            formParams.append('dueDate', requestParameters['dueDate'] as any);
        }

        if (requestParameters['newAttachments'] != null) {
            requestParameters['newAttachments'].forEach((element) => {
                formParams.append('newAttachments', element as any);
            })
        }

        if (requestParameters['deletedAttachments'] != null) {
            requestParameters['deletedAttachments'].forEach((element) => {
                formParams.append('deletedAttachments', element as any);
            })
        }

        if (requestParameters['additionalDetailsJson'] != null) {
            formParams.append('additionalDetailsJson', requestParameters['additionalDetailsJson'] as any);
        }


        let urlPath = `/staff/add-update-staff-qualification-details`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffAddUpdateStaffQualificationDetails200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds a qualification record for a staff member in your organisation, or changes one when `tblStaffQualificationDetailsId` is set. Send it as multipart/form-data with `companyType: 1` and the staff id as `companyStaffId` (or the older `tblStaffId`). Setting the status to Approved or Rejected is refused with 403: verification stays a person\'s decision. Saving a record that already has that status is allowed.  `data` is the record id. If the person already has a record for that qualification, nothing is saved and the call answers 200 with an empty id and the message \"Staff qualification details already exist.\". Dates are checked: the issue date cannot be in the future or after the expiry date, and an expired document is refused with 400. No email is sent to anyone: `notify` and `requesterById` are ignored for an integration.  A staff member or catalogue row of another organisation answers 404.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Add or update a staff qualification record
     */
    async staffAddUpdateStaffQualificationDetails(requestParameters: StaffAddUpdateStaffQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddUpdateStaffQualificationDetails200Response> {
        const response = await this.staffAddUpdateStaffQualificationDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Removes a qualification from your organisation\'s catalogue. Answers 409 when any staff qualification record refers to it (including removed ones), and 404 for a qualification owned by another company or a platform qualification. This is a GET request that changes data: send it once and do not let anything replay it.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Delete a qualification from your catalogue
     */
    async staffDeleteQualificationRaw(requestParameters: StaffDeleteQualificationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffDeleteQualification200Response>> {
        if (requestParameters['qualificationId'] == null) {
            throw new runtime.RequiredError(
                'qualificationId',
                'Required parameter "qualificationId" was null or undefined when calling staffDeleteQualification().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['qualificationId'] != null) {
            queryParameters['qualificationId'] = requestParameters['qualificationId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["qualifications.write"]);
        }


        let urlPath = `/staff/delete-qualification`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffDeleteQualification200ResponseFromJSON(jsonValue));
    }

    /**
     * Removes a qualification from your organisation\'s catalogue. Answers 409 when any staff qualification record refers to it (including removed ones), and 404 for a qualification owned by another company or a platform qualification. This is a GET request that changes data: send it once and do not let anything replay it.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Delete a qualification from your catalogue
     */
    async staffDeleteQualification(requestParameters: StaffDeleteQualificationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffDeleteQualification200Response> {
        const response = await this.staffDeleteQualificationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Removes one qualification record owned by your organisation. Records owned by another company answer 404. This is a GET request that changes data: send it once and do not let anything replay it.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Delete a staff qualification record
     */
    async staffDeleteStaffQualificationDetailsRaw(requestParameters: StaffDeleteStaffQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffDeleteStaff200Response>> {
        if (requestParameters['staffQualificationDetailsId'] == null) {
            throw new runtime.RequiredError(
                'staffQualificationDetailsId',
                'Required parameter "staffQualificationDetailsId" was null or undefined when calling staffDeleteStaffQualificationDetails().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['staffQualificationDetailsId'] != null) {
            queryParameters['staffQualificationDetailsId'] = requestParameters['staffQualificationDetailsId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["qualifications.write"]);
        }


        let urlPath = `/staff/delete-staff-qualification-details`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffDeleteStaff200ResponseFromJSON(jsonValue));
    }

    /**
     * Removes one qualification record owned by your organisation. Records owned by another company answer 404. This is a GET request that changes data: send it once and do not let anything replay it.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Delete a staff qualification record
     */
    async staffDeleteStaffQualificationDetails(requestParameters: StaffDeleteStaffQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffDeleteStaff200Response> {
        const response = await this.staffDeleteStaffQualificationDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one qualification from your organisation\'s catalogue or the shared platform catalogue: its labels, required dates, validity, reminder days, hours limit, rostering rules, extra fields, states and industries. A qualification owned by another company is not returned: `data` is null with a \"not found\" message.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Get one qualification
     */
    async staffGetQualificationDetailsRaw(requestParameters: StaffGetQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetQualificationDetails200Response>> {
        if (requestParameters['qualificationId'] == null) {
            throw new runtime.RequiredError(
                'qualificationId',
                'Required parameter "qualificationId" was null or undefined when calling staffGetQualificationDetails().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['qualificationId'] != null) {
            queryParameters['qualificationId'] = requestParameters['qualificationId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/get-qualification-details`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetQualificationDetails200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one qualification from your organisation\'s catalogue or the shared platform catalogue: its labels, required dates, validity, reminder days, hours limit, rostering rules, extra fields, states and industries. A qualification owned by another company is not returned: `data` is null with a \"not found\" message.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Get one qualification
     */
    async staffGetQualificationDetails(requestParameters: StaffGetQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetQualificationDetails200Response> {
        const response = await this.staffGetQualificationDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a page of qualifications from a catalogue: your organisation\'s own (send `companyType: 1` and your organisation id as `companyId`), or the shared platform catalogue when `companyId` is left out.  Each entry shows the qualification\'s type, validity, hours limit, industries, states, the areas that require it and the staff who hold it.  Each holder\'s `staffEmail` needs `staff.personal.read`; without it it is null.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * List qualifications
     */
    async staffGetQualificationListRaw(requestParameters: StaffGetQualificationListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetQualificationList200Response>> {
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

        if (requestParameters['status'] != null) {
            queryParameters['status'] = requestParameters['status'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['pageSize'] != null) {
            queryParameters['pageSize'] = requestParameters['pageSize'];
        }

        if (requestParameters['tblTenantId'] != null) {
            queryParameters['tblTenantId'] = requestParameters['tblTenantId'];
        }

        if (requestParameters['companyType'] != null) {
            queryParameters['companyType'] = requestParameters['companyType'];
        }

        if (requestParameters['companyId'] != null) {
            queryParameters['companyId'] = requestParameters['companyId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/get-qualification-list`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetQualificationList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a page of qualifications from a catalogue: your organisation\'s own (send `companyType: 1` and your organisation id as `companyId`), or the shared platform catalogue when `companyId` is left out.  Each entry shows the qualification\'s type, validity, hours limit, industries, states, the areas that require it and the staff who hold it.  Each holder\'s `staffEmail` needs `staff.personal.read`; without it it is null.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * List qualifications
     */
    async staffGetQualificationList(requestParameters: StaffGetQualificationListRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetQualificationList200Response> {
        const response = await this.staffGetQualificationListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one qualification record owned by your organisation, with its extra-field answers and attachments. A record owned by another company is not returned: `data` is null with a \"not found\" message.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Get one staff qualification record
     */
    async staffGetStaffQualificationDetailsRaw(requestParameters: StaffGetStaffQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffQualificationDetails200Response>> {
        if (requestParameters['staffQualificationId'] == null) {
            throw new runtime.RequiredError(
                'staffQualificationId',
                'Required parameter "staffQualificationId" was null or undefined when calling staffGetStaffQualificationDetails().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['staffQualificationId'] != null) {
            queryParameters['staffQualificationId'] = requestParameters['staffQualificationId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/get-staff-qualification-details`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetStaffQualificationDetails200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one qualification record owned by your organisation, with its extra-field answers and attachments. A record owned by another company is not returned: `data` is null with a \"not found\" message.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Get one staff qualification record
     */
    async staffGetStaffQualificationDetails(requestParameters: StaffGetStaffQualificationDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffQualificationDetails200Response> {
        const response = await this.staffGetStaffQualificationDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns every qualification your organisation holds on record for one staff member: number, issue and expiry dates, status, verification, attachments and whether action is needed because it expires soon. Only records owned by your organisation are returned.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * List a staff member\'s qualifications
     */
    async staffGetStaffQualificationListRaw(requestParameters: StaffGetStaffQualificationListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffQualificationList200Response>> {
        if (requestParameters['staffGetStaffQualificationListRequest'] == null) {
            throw new runtime.RequiredError(
                'staffGetStaffQualificationListRequest',
                'Required parameter "staffGetStaffQualificationListRequest" was null or undefined when calling staffGetStaffQualificationList().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/get-staff-qualification-list`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffGetStaffQualificationListRequestToJSON(requestParameters['staffGetStaffQualificationListRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetStaffQualificationList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns every qualification your organisation holds on record for one staff member: number, issue and expiry dates, status, verification, attachments and whether action is needed because it expires soon. Only records owned by your organisation are returned.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * List a staff member\'s qualifications
     */
    async staffGetStaffQualificationList(requestParameters: StaffGetStaffQualificationListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffQualificationList200Response> {
        const response = await this.staffGetStaffQualificationListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a short page of your organisation\'s own qualifications (id, name, industries, states and whether active). With `staffId` it lists instead the qualifications required by the locations and areas that staff member works in. The staff member must belong to your organisation, or the call is refused with 403.  Tenant tokens only: an agency token is refused with 403.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * List your organisation\'s qualifications for a picker
     */
    async staffGetTenantQualificationListRaw(requestParameters: StaffGetTenantQualificationListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetQualificationList200Response>> {
        if (requestParameters['staffGetTenantQualificationListRequest'] == null) {
            throw new runtime.RequiredError(
                'staffGetTenantQualificationListRequest',
                'Required parameter "staffGetTenantQualificationListRequest" was null or undefined when calling staffGetTenantQualificationList().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/get-tenant-qualification-list`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffGetTenantQualificationListRequestToJSON(requestParameters['staffGetTenantQualificationListRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetQualificationList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a short page of your organisation\'s own qualifications (id, name, industries, states and whether active). With `staffId` it lists instead the qualifications required by the locations and areas that staff member works in. The staff member must belong to your organisation, or the call is refused with 403.  Tenant tokens only: an agency token is refused with 403.  **Required scope:** `qualifications.read` or `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * List your organisation\'s qualifications for a picker
     */
    async staffGetTenantQualificationList(requestParameters: StaffGetTenantQualificationListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetQualificationList200Response> {
        const response = await this.staffGetTenantQualificationListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Sets whether a qualification in your organisation\'s catalogue is active, the same change as the status-flag route. Answers 404 for a qualification owned by another company or a platform qualification. This is a GET request that changes data.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Set a qualification active or inactive
     */
    async staffUpdateQualificationActiveStatusRaw(requestParameters: StaffUpdateQualificationActiveStatusRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffUpdateQualificationStatusFlag200Response>> {
        if (requestParameters['qualificationId'] == null) {
            throw new runtime.RequiredError(
                'qualificationId',
                'Required parameter "qualificationId" was null or undefined when calling staffUpdateQualificationActiveStatus().'
            );
        }

        if (requestParameters['status'] == null) {
            throw new runtime.RequiredError(
                'status',
                'Required parameter "status" was null or undefined when calling staffUpdateQualificationActiveStatus().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['qualificationId'] != null) {
            queryParameters['qualificationId'] = requestParameters['qualificationId'];
        }

        if (requestParameters['status'] != null) {
            queryParameters['status'] = requestParameters['status'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["qualifications.write"]);
        }


        let urlPath = `/staff/update-qualification-active-status`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffUpdateQualificationStatusFlag200ResponseFromJSON(jsonValue));
    }

    /**
     * Sets whether a qualification in your organisation\'s catalogue is active, the same change as the status-flag route. Answers 404 for a qualification owned by another company or a platform qualification. This is a GET request that changes data.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Set a qualification active or inactive
     */
    async staffUpdateQualificationActiveStatus(requestParameters: StaffUpdateQualificationActiveStatusRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffUpdateQualificationStatusFlag200Response> {
        const response = await this.staffUpdateQualificationActiveStatusRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Sets whether a qualification in your organisation\'s catalogue is active. Answers 404 for a qualification owned by another company or a platform qualification. This is a GET request that changes data.  This route and the next one make the same change; use either.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Turn a qualification on or off
     */
    async staffUpdateQualificationStatusFlagRaw(requestParameters: StaffUpdateQualificationStatusFlagRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffUpdateQualificationStatusFlag200Response>> {
        if (requestParameters['qualificationId'] == null) {
            throw new runtime.RequiredError(
                'qualificationId',
                'Required parameter "qualificationId" was null or undefined when calling staffUpdateQualificationStatusFlag().'
            );
        }

        if (requestParameters['status'] == null) {
            throw new runtime.RequiredError(
                'status',
                'Required parameter "status" was null or undefined when calling staffUpdateQualificationStatusFlag().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['qualificationId'] != null) {
            queryParameters['qualificationId'] = requestParameters['qualificationId'];
        }

        if (requestParameters['status'] != null) {
            queryParameters['status'] = requestParameters['status'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["qualifications.write"]);
        }


        let urlPath = `/staff/update-qualification-status-flag`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffUpdateQualificationStatusFlag200ResponseFromJSON(jsonValue));
    }

    /**
     * Sets whether a qualification in your organisation\'s catalogue is active. Answers 404 for a qualification owned by another company or a platform qualification. This is a GET request that changes data.  This route and the next one make the same change; use either.  **Required scope:** `qualifications.write`  See **Responses** below for the status codes this operation can return.
     * Turn a qualification on or off
     */
    async staffUpdateQualificationStatusFlag(requestParameters: StaffUpdateQualificationStatusFlagRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffUpdateQualificationStatusFlag200Response> {
        const response = await this.staffUpdateQualificationStatusFlagRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
