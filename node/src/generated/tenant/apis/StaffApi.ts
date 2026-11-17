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
  SchedulingGetStaffList200Response,
  SchedulingGetStaffListRequest,
  SchedulingGetStaffListWithDetails200Response,
  SchedulingGetStaffListWithDetailsRequest,
  StaffAddRegularHours200Response,
  StaffAddRegularHoursRequestInner,
  StaffApiStaff200Response,
  StaffApiStaffRequest,
  StaffConfirmStaffImport200Response,
  StaffConfirmStaffImportRequest,
  StaffDeleteStaff200Response,
  StaffGetActiveStaffCount200Response,
  StaffGetContractCommunicationList200Response,
  StaffGetContractCommunicationListRequest,
  StaffGetContractListEmployee200Response,
  StaffGetContractListEmployeeRequest,
  StaffGetRegularHours200Response,
  StaffGetStaff200Response,
  StaffGetStaffList200Response,
  StaffGetStaffListRequest,
  StaffGetStaffLocationArea200Response,
  StaffGetStaffLocationAreaRequest,
  StaffGetTenantStaffList200Response,
  StaffGetTenantStaffListRequest,
  StaffSetStaffPrimaryLocationRequest,
  StaffStaffBulkAddTags200Response,
  StaffStaffBulkAddTagsRequest,
  StaffStaffBulkArchive200Response,
  StaffStaffBulkArchiveRequest,
  StaffStaffBulkSetEmploymentDetails200Response,
  StaffStaffBulkSetEmploymentDetailsRequest,
  StaffStaffRegistration200Response,
  StaffStaffRegistrationRequest,
  TenantV2GetStaffByArea200Response,
  TenantV2GetStaffByAreaRequest,
  ValidationProblem,
} from '../models/index.js';
import {
    EnvelopeFromJSON,
    EnvelopeToJSON,
    SchedulingGetStaffList200ResponseFromJSON,
    SchedulingGetStaffList200ResponseToJSON,
    SchedulingGetStaffListRequestFromJSON,
    SchedulingGetStaffListRequestToJSON,
    SchedulingGetStaffListWithDetails200ResponseFromJSON,
    SchedulingGetStaffListWithDetails200ResponseToJSON,
    SchedulingGetStaffListWithDetailsRequestFromJSON,
    SchedulingGetStaffListWithDetailsRequestToJSON,
    StaffAddRegularHours200ResponseFromJSON,
    StaffAddRegularHours200ResponseToJSON,
    StaffAddRegularHoursRequestInnerFromJSON,
    StaffAddRegularHoursRequestInnerToJSON,
    StaffApiStaff200ResponseFromJSON,
    StaffApiStaff200ResponseToJSON,
    StaffApiStaffRequestFromJSON,
    StaffApiStaffRequestToJSON,
    StaffConfirmStaffImport200ResponseFromJSON,
    StaffConfirmStaffImport200ResponseToJSON,
    StaffConfirmStaffImportRequestFromJSON,
    StaffConfirmStaffImportRequestToJSON,
    StaffDeleteStaff200ResponseFromJSON,
    StaffDeleteStaff200ResponseToJSON,
    StaffGetActiveStaffCount200ResponseFromJSON,
    StaffGetActiveStaffCount200ResponseToJSON,
    StaffGetContractCommunicationList200ResponseFromJSON,
    StaffGetContractCommunicationList200ResponseToJSON,
    StaffGetContractCommunicationListRequestFromJSON,
    StaffGetContractCommunicationListRequestToJSON,
    StaffGetContractListEmployee200ResponseFromJSON,
    StaffGetContractListEmployee200ResponseToJSON,
    StaffGetContractListEmployeeRequestFromJSON,
    StaffGetContractListEmployeeRequestToJSON,
    StaffGetRegularHours200ResponseFromJSON,
    StaffGetRegularHours200ResponseToJSON,
    StaffGetStaff200ResponseFromJSON,
    StaffGetStaff200ResponseToJSON,
    StaffGetStaffList200ResponseFromJSON,
    StaffGetStaffList200ResponseToJSON,
    StaffGetStaffListRequestFromJSON,
    StaffGetStaffListRequestToJSON,
    StaffGetStaffLocationArea200ResponseFromJSON,
    StaffGetStaffLocationArea200ResponseToJSON,
    StaffGetStaffLocationAreaRequestFromJSON,
    StaffGetStaffLocationAreaRequestToJSON,
    StaffGetTenantStaffList200ResponseFromJSON,
    StaffGetTenantStaffList200ResponseToJSON,
    StaffGetTenantStaffListRequestFromJSON,
    StaffGetTenantStaffListRequestToJSON,
    StaffSetStaffPrimaryLocationRequestFromJSON,
    StaffSetStaffPrimaryLocationRequestToJSON,
    StaffStaffBulkAddTags200ResponseFromJSON,
    StaffStaffBulkAddTags200ResponseToJSON,
    StaffStaffBulkAddTagsRequestFromJSON,
    StaffStaffBulkAddTagsRequestToJSON,
    StaffStaffBulkArchive200ResponseFromJSON,
    StaffStaffBulkArchive200ResponseToJSON,
    StaffStaffBulkArchiveRequestFromJSON,
    StaffStaffBulkArchiveRequestToJSON,
    StaffStaffBulkSetEmploymentDetails200ResponseFromJSON,
    StaffStaffBulkSetEmploymentDetails200ResponseToJSON,
    StaffStaffBulkSetEmploymentDetailsRequestFromJSON,
    StaffStaffBulkSetEmploymentDetailsRequestToJSON,
    StaffStaffRegistration200ResponseFromJSON,
    StaffStaffRegistration200ResponseToJSON,
    StaffStaffRegistrationRequestFromJSON,
    StaffStaffRegistrationRequestToJSON,
    TenantV2GetStaffByArea200ResponseFromJSON,
    TenantV2GetStaffByArea200ResponseToJSON,
    TenantV2GetStaffByAreaRequestFromJSON,
    TenantV2GetStaffByAreaRequestToJSON,
    ValidationProblemFromJSON,
    ValidationProblemToJSON,
} from '../models/index.js';

export interface SchedulingGetStaffListOperationRequest {
    schedulingGetStaffListRequest: SchedulingGetStaffListRequest;
}

export interface SchedulingGetStaffListWithDetailsOperationRequest {
    schedulingGetStaffListWithDetailsRequest: SchedulingGetStaffListWithDetailsRequest;
}

export interface StaffAddRegularHoursRequest {
    staffAddRegularHoursRequestInner: Array<StaffAddRegularHoursRequestInner>;
}

export interface StaffAddUpdateStaffRegularHoursRequest {
    staffAddRegularHoursRequestInner: Array<StaffAddRegularHoursRequestInner>;
}

export interface StaffApiStaffOperationRequest {
    staffApiStaffRequest: StaffApiStaffRequest;
}

export interface StaffConfirmStaffImportOperationRequest {
    staffConfirmStaffImportRequest: StaffConfirmStaffImportRequest;
}

export interface StaffDeleteStaffRequest {
    tblStaffId: string;
}

export interface StaffGetActiveStaffCountRequest {
    tenantId: string;
}

export interface StaffGetContractCommunicationListOperationRequest {
    staffGetContractCommunicationListRequest: StaffGetContractCommunicationListRequest;
}

export interface StaffGetContractListEmployeeOperationRequest {
    staffGetContractListEmployeeRequest: StaffGetContractListEmployeeRequest;
}

export interface StaffGetRegularHoursRequest {
    staffContractId: string;
}

export interface StaffGetStaffRequest {
    iD: string;
}

export interface StaffGetStaffListOperationRequest {
    staffGetStaffListRequest: StaffGetStaffListRequest;
}

export interface StaffGetStaffLocationAreaOperationRequest {
    staffGetStaffLocationAreaRequest: StaffGetStaffLocationAreaRequest;
}

export interface StaffGetTenantStaffListOperationRequest {
    staffGetTenantStaffListRequest: StaffGetTenantStaffListRequest;
}

export interface StaffSetStaffPrimaryLocationOperationRequest {
    staffSetStaffPrimaryLocationRequest: StaffSetStaffPrimaryLocationRequest;
}

export interface StaffStaffBulkAddTagsOperationRequest {
    staffStaffBulkAddTagsRequest: StaffStaffBulkAddTagsRequest;
}

export interface StaffStaffBulkArchiveOperationRequest {
    staffStaffBulkArchiveRequest: StaffStaffBulkArchiveRequest;
}

export interface StaffStaffBulkSetEmploymentDetailsOperationRequest {
    staffStaffBulkSetEmploymentDetailsRequest: StaffStaffBulkSetEmploymentDetailsRequest;
}

export interface StaffStaffManualRegistrationRequest {
    firstName: string;
    lastName: string;
    emailAddress: string;
    mobileNumber: string | null;
    addressLine1: string;
    city: string | null;
    state: string | null;
    country: string | null;
    postCode: string | null;
    regType: string;
    tblStaffId?: string;
    tblUserId?: string;
    tblTenantId?: string;
    middleName?: string | null;
    prefferedName?: string | null;
    phoneNumber?: string | null;
    dateOfBirth?: Date | null;
    gender?: string | null;
    addressLine2?: string | null;
    status?: number | null;
    isArchived?: boolean;
    tblTenantAreaId?: string | null;
    primaryLocationId?: string | null;
    primaryAreaId?: string | null;
    tblLocationGroupId?: string | null;
    isManagerCanRostered?: boolean | null;
    employementType?: string | null;
    employeeStartDate?: string | null;
    employeeEndDate?: string | null;
    timeClockPasscode?: number | null;
    payrollId?: string | null;
    payrollCesCode?: string | null;
    tblCountryId?: string | null;
    tblStateId?: string | null;
    profilePic?: string | null;
    profilePicFile?: Blob | null;
    removedAttachment?: string | null;
    tagIds?: string | null;
}

export interface StaffStaffRegistrationOperationRequest {
    staffStaffRegistrationRequest: StaffStaffRegistrationRequest;
}

export interface TenantV2GetStaffByAreaOperationRequest {
    tenantV2GetStaffByAreaRequest: TenantV2GetStaffByAreaRequest;
}

/**
 * StaffApi - interface
 * 
 * @export
 * @interface StaffApiInterface
 */
export interface StaffApiInterface {
    /**
     * Returns your staff with their roles, for picking who to roster. Narrow it to staff assigned to one location (`locationId`) or to some areas (`areaIds`). Agency workers are not included. An empty list comes back as 200 with its own message.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary List staff for rostering
     * @param {SchedulingGetStaffListRequest} schedulingGetStaffListRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    schedulingGetStaffListRaw(requestParameters: SchedulingGetStaffListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetStaffList200Response>>;

    /**
     * Returns your staff with their roles, for picking who to roster. Narrow it to staff assigned to one location (`locationId`) or to some areas (`areaIds`). Agency workers are not included. An empty list comes back as 200 with its own message.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff for rostering
     */
    schedulingGetStaffList(requestParameters: SchedulingGetStaffListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetStaffList200Response>;

    /**
     * Returns your active staff with their roles, qualifications, locations and areas, employment type, contact details and their availability on each date in the range. Filter by name (`staffName`, matching first, last or full name), qualifications, roles, locations or one area. Email, mobile, gender and home address need `staff.personal.read`; without it they are null. The response also carries `staffCount`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary List staff with roles, qualifications and availability
     * @param {SchedulingGetStaffListWithDetailsRequest} schedulingGetStaffListWithDetailsRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    schedulingGetStaffListWithDetailsRaw(requestParameters: SchedulingGetStaffListWithDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetStaffListWithDetails200Response>>;

    /**
     * Returns your active staff with their roles, qualifications, locations and areas, employment type, contact details and their availability on each date in the range. Filter by name (`staffName`, matching first, last or full name), qualifications, roles, locations or one area. Email, mobile, gender and home address need `staff.personal.read`; without it they are null. The response also carries `staffCount`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff with roles, qualifications and availability
     */
    schedulingGetStaffListWithDetails(requestParameters: SchedulingGetStaffListWithDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetStaffListWithDetails200Response>;

    /**
     * Adds or changes regular working days on a staff contract in your organisation, with their shifts and breaks. Every contract and regular-hour id must belong to your organisation, or the call is refused with 403. `data` is the number of rows written; 404 means nothing was written.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Save regular hours on a staff contract
     * @param {Array<StaffAddRegularHoursRequestInner>} staffAddRegularHoursRequestInner The regular working days
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffAddRegularHoursRaw(requestParameters: StaffAddRegularHoursRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddRegularHours200Response>>;

    /**
     * Adds or changes regular working days on a staff contract in your organisation, with their shifts and breaks. Every contract and regular-hour id must belong to your organisation, or the call is refused with 403. `data` is the number of rows written; 404 means nothing was written.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Save regular hours on a staff contract
     */
    staffAddRegularHours(requestParameters: StaffAddRegularHoursRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddRegularHours200Response>;

    /**
     * Adds or changes regular working days on a staff contract in your organisation, with their shifts and breaks. Every contract and regular-hour id must belong to your organisation, or the call is refused with 403. `data` is the number of rows written; 404 means nothing was written.  This is a second route to the same save. It differs only in refusing an empty list with 400 and in its messages.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Save regular hours on a staff contract (alternative route)
     * @param {Array<StaffAddRegularHoursRequestInner>} staffAddRegularHoursRequestInner The regular working days; at least one
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffAddUpdateStaffRegularHoursRaw(requestParameters: StaffAddUpdateStaffRegularHoursRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddRegularHours200Response>>;

    /**
     * Adds or changes regular working days on a staff contract in your organisation, with their shifts and breaks. Every contract and regular-hour id must belong to your organisation, or the call is refused with 403. `data` is the number of rows written; 404 means nothing was written.  This is a second route to the same save. It differs only in refusing an empty list with 400 and in its messages.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Save regular hours on a staff contract (alternative route)
     */
    staffAddUpdateStaffRegularHours(requestParameters: StaffAddUpdateStaffRegularHoursRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddRegularHours200Response>;

    /**
     * Returns a page of your organisation\'s current, unarchived staff with their contact details, address, roles, tags, areas, employment dates and invitation status. `tenantID` is required and must be your organisation\'s id.  Each row also carries the staff member\'s payroll id and time-clock passcode, so treat the response as sensitive.  Staff who have not set a password yet are included. Date of birth, contact details, address and documents need `staff.personal.read`; payroll id and time-clock passcode need `staff.finance.read`; pay rate fields need `pay_conditions.read`. Without the scope the field is null or blank. Without `staff.personal.read`, searching by email or mobile and sorting by mobile are ignored. Without `staff.finance.read`, searching by payroll id and sorting by it are ignored.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary List staff
     * @param {StaffApiStaffRequest} staffApiStaffRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffApiStaffRaw(requestParameters: StaffApiStaffOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffApiStaff200Response>>;

    /**
     * Returns a page of your organisation\'s current, unarchived staff with their contact details, address, roles, tags, areas, employment dates and invitation status. `tenantID` is required and must be your organisation\'s id.  Each row also carries the staff member\'s payroll id and time-clock passcode, so treat the response as sensitive.  Staff who have not set a password yet are included. Date of birth, contact details, address and documents need `staff.personal.read`; payroll id and time-clock passcode need `staff.finance.read`; pay rate fields need `pay_conditions.read`. Without the scope the field is null or blank. Without `staff.personal.read`, searching by email or mobile and sorting by mobile are ignored. Without `staff.finance.read`, searching by payroll id and sorting by it are ignored.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff
     */
    staffApiStaff(requestParameters: StaffApiStaffOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffApiStaff200Response>;

    /**
     * Adds or updates many staff members in your organisation at once. Each row is matched to an existing staff member by email address and updated, or added as new; locations and areas are matched by name. Rows marked Invalid are skipped. Roles in the rows are ignored.  Answers 409 when the import would take you over your plan\'s staff limit, and 400 when it fails, with the per-row results in `data` either way.  Payroll ids and passcodes in the rows are ignored without `staff.finance.write`.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Import staff in bulk
     * @param {StaffConfirmStaffImportRequest} staffConfirmStaffImportRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffConfirmStaffImportRaw(requestParameters: StaffConfirmStaffImportOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffConfirmStaffImport200Response>>;

    /**
     * Adds or updates many staff members in your organisation at once. Each row is matched to an existing staff member by email address and updated, or added as new; locations and areas are matched by name. Rows marked Invalid are skipped. Roles in the rows are ignored.  Answers 409 when the import would take you over your plan\'s staff limit, and 400 when it fails, with the per-row results in `data` either way.  Payroll ids and passcodes in the rows are ignored without `staff.finance.write`.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Import staff in bulk
     */
    staffConfirmStaffImport(requestParameters: StaffConfirmStaffImportOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffConfirmStaffImport200Response>;

    /**
     * Removes a staff member from your organisation. Send the id in the query string; there is no body.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Delete a staff member
     * @param {string} tblStaffId The staff member\&#39;s id; must be a current staff member of your organisation, or the call is refused with 403
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffDeleteStaffRaw(requestParameters: StaffDeleteStaffRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffDeleteStaff200Response>>;

    /**
     * Removes a staff member from your organisation. Send the id in the query string; there is no body.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Delete a staff member
     */
    staffDeleteStaff(requestParameters: StaffDeleteStaffRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffDeleteStaff200Response>;

    /**
     * Returns how many active staff your organisation has, as a number in `data`. `tenantId` must be your own organisation.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * @summary Count active staff
     * @param {string} tenantId Your organisation\&#39;s id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffGetActiveStaffCountRaw(requestParameters: StaffGetActiveStaffCountRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetActiveStaffCount200Response>>;

    /**
     * Returns how many active staff your organisation has, as a number in `data`. `tenantId` must be your own organisation.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * Count active staff
     */
    staffGetActiveStaffCount(requestParameters: StaffGetActiveStaffCountRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetActiveStaffCount200Response>;

    /**
     * Returns a page of your organisation\'s contract templates (or documents, with `isDocument: true`), each with the list of times it was sent to a staff member and the current status of each send (for example Sent, Signed or Countersigned).  Set `userId` to see only the templates sent to one staff member. The template content and document links are included, so treat the response as staff records.  **Required scope:** `contracts.read`  See **Responses** below for the status codes this operation can return.
     * @summary List contract templates and who they were sent to
     * @param {StaffGetContractCommunicationListRequest} staffGetContractCommunicationListRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffGetContractCommunicationListRaw(requestParameters: StaffGetContractCommunicationListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetContractCommunicationList200Response>>;

    /**
     * Returns a page of your organisation\'s contract templates (or documents, with `isDocument: true`), each with the list of times it was sent to a staff member and the current status of each send (for example Sent, Signed or Countersigned).  Set `userId` to see only the templates sent to one staff member. The template content and document links are included, so treat the response as staff records.  **Required scope:** `contracts.read`  See **Responses** below for the status codes this operation can return.
     * List contract templates and who they were sent to
     */
    staffGetContractCommunicationList(requestParameters: StaffGetContractCommunicationListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetContractCommunicationList200Response>;

    /**
     * Returns a page of the contracts and documents sent to one staff member in your organisation, with each one\'s current status, the date it was sent and the date it was signed.  This call answers with the result object itself rather than the usual `data` and `message` wrapper: `success`, `message` and paging sit beside the `data` list. When nothing matches, it answers 400 with `success: false` and a message saying no contracts were found.  **Required scope:** `contracts.read`  See **Responses** below for the status codes this operation can return.
     * @summary List the contracts sent to one staff member
     * @param {StaffGetContractListEmployeeRequest} staffGetContractListEmployeeRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffGetContractListEmployeeRaw(requestParameters: StaffGetContractListEmployeeOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetContractListEmployee200Response>>;

    /**
     * Returns a page of the contracts and documents sent to one staff member in your organisation, with each one\'s current status, the date it was sent and the date it was signed.  This call answers with the result object itself rather than the usual `data` and `message` wrapper: `success`, `message` and paging sit beside the `data` list. When nothing matches, it answers 400 with `success: false` and a message saying no contracts were found.  **Required scope:** `contracts.read`  See **Responses** below for the status codes this operation can return.
     * List the contracts sent to one staff member
     */
    staffGetContractListEmployee(requestParameters: StaffGetContractListEmployeeOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetContractListEmployee200Response>;

    /**
     * Returns the regular working days on one staff contract, each with its shifts, areas and breaks. The contract must belong to a staff member of your organisation, or the call is refused with 403.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get the regular hours on a staff contract
     * @param {string} staffContractId The staff contract id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffGetRegularHoursRaw(requestParameters: StaffGetRegularHoursRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetRegularHours200Response>>;

    /**
     * Returns the regular working days on one staff contract, each with its shifts, areas and breaks. The contract must belong to a staff member of your organisation, or the call is refused with 403.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * Get the regular hours on a staff contract
     */
    staffGetRegularHours(requestParameters: StaffGetRegularHoursRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetRegularHours200Response>;

    /**
     * Returns one staff member\'s full profile: name, contact details, date of birth, address, areas, primary location and area, employment dates, roles, tags, documents and invitation status. The staff member must be a current staff member of your organisation, or the call is refused with 403.  Date of birth, contact details, address, profile picture and documents need `staff.personal.read`; time-clock passcode, payroll id and tax file number need `staff.finance.read`. Without the scope those fields are null. Holding `staff.finance.write` alone does not unlock them.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one staff member
     * @param {string} iD The staff member\&#39;s id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffGetStaffRaw(requestParameters: StaffGetStaffRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaff200Response>>;

    /**
     * Returns one staff member\'s full profile: name, contact details, date of birth, address, areas, primary location and area, employment dates, roles, tags, documents and invitation status. The staff member must be a current staff member of your organisation, or the call is refused with 403.  Date of birth, contact details, address, profile picture and documents need `staff.personal.read`; time-clock passcode, payroll id and tax file number need `staff.finance.read`. Without the scope those fields are null. Holding `staff.finance.write` alone does not unlock them.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * Get one staff member
     */
    staffGetStaff(requestParameters: StaffGetStaffRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaff200Response>;

    /**
     * Returns a short page of your organisation\'s staff: id, name, employment type and mobile number. Use it for pickers and matching. `tenantID` is required and must be your organisation\'s id.  Staff who have not set a password yet are included. `mobileNumber` needs `staff.personal.read`; without it it is null, searching by email or mobile is ignored and sorting by mobile is ignored.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary List staff names and mobile numbers
     * @param {StaffGetStaffListRequest} staffGetStaffListRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffGetStaffListRaw(requestParameters: StaffGetStaffListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffList200Response>>;

    /**
     * Returns a short page of your organisation\'s staff: id, name, employment type and mobile number. Use it for pickers and matching. `tenantID` is required and must be your organisation\'s id.  Staff who have not set a password yet are included. `mobileNumber` needs `staff.personal.read`; without it it is null, searching by email or mobile is ignored and sorting by mobile is ignored.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff names and mobile numbers
     */
    staffGetStaffList(requestParameters: StaffGetStaffListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffList200Response>;

    /**
     * Returns the locations and areas a staff member in your organisation works in, and their primary location and area. Answers 404 when none are assigned.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get a staff member\'s locations and areas
     * @param {StaffGetStaffLocationAreaRequest} staffGetStaffLocationAreaRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffGetStaffLocationAreaRaw(requestParameters: StaffGetStaffLocationAreaOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffLocationArea200Response>>;

    /**
     * Returns the locations and areas a staff member in your organisation works in, and their primary location and area. Answers 404 when none are assigned.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s locations and areas
     */
    staffGetStaffLocationArea(requestParameters: StaffGetStaffLocationAreaOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffLocationArea200Response>;

    /**
     * Returns a page of your organisation\'s staff with each one\'s staff id, user id, name and profile picture link. Useful for matching staff to user ids used elsewhere (for example in contracts).  `profilePic` needs `staff.personal.read`; without it it is null.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary List staff with their user ids
     * @param {StaffGetTenantStaffListRequest} staffGetTenantStaffListRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffGetTenantStaffListRaw(requestParameters: StaffGetTenantStaffListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetTenantStaffList200Response>>;

    /**
     * Returns a page of your organisation\'s staff with each one\'s staff id, user id, name and profile picture link. Useful for matching staff to user ids used elsewhere (for example in contracts).  `profilePic` needs `staff.personal.read`; without it it is null.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff with their user ids
     */
    staffGetTenantStaffList(requestParameters: StaffGetTenantStaffListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetTenantStaffList200Response>;

    /**
     * Sets the primary location of a staff member in your organisation. `data` is the staff id; the success message currently reads as if a role was set.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Set a staff member\'s primary location
     * @param {StaffSetStaffPrimaryLocationRequest} staffSetStaffPrimaryLocationRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffSetStaffPrimaryLocationRaw(requestParameters: StaffSetStaffPrimaryLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffStaffRegistration200Response>>;

    /**
     * Sets the primary location of a staff member in your organisation. `data` is the staff id; the success message currently reads as if a role was set.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Set a staff member\'s primary location
     */
    staffSetStaffPrimaryLocation(requestParameters: StaffSetStaffPrimaryLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffStaffRegistration200Response>;

    /**
     * Adds one or more of your organisation\'s tags to several staff members. Existing tags are kept. Answers 404 when none of the staff could be updated.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Add tags to several staff members
     * @param {StaffStaffBulkAddTagsRequest} staffStaffBulkAddTagsRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffStaffBulkAddTagsRaw(requestParameters: StaffStaffBulkAddTagsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffStaffBulkAddTags200Response>>;

    /**
     * Adds one or more of your organisation\'s tags to several staff members. Existing tags are kept. Answers 404 when none of the staff could be updated.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Add tags to several staff members
     */
    staffStaffBulkAddTags(requestParameters: StaffStaffBulkAddTagsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffStaffBulkAddTags200Response>;

    /**
     * Archives several staff members in your organisation, so they no longer appear in staff lists or rosters. `data` is the number of staff archived; the success message currently reads as if a location was added.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Archive several staff members
     * @param {StaffStaffBulkArchiveRequest} staffStaffBulkArchiveRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffStaffBulkArchiveRaw(requestParameters: StaffStaffBulkArchiveOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffStaffBulkArchive200Response>>;

    /**
     * Archives several staff members in your organisation, so they no longer appear in staff lists or rosters. `data` is the number of staff archived; the success message currently reads as if a location was added.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Archive several staff members
     */
    staffStaffBulkArchive(requestParameters: StaffStaffBulkArchiveOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffStaffBulkArchive200Response>;

    /**
     * Sets the employment status, and optionally the start date, end date and a note, for several staff members in your organisation. Terminating needs an end date. Answers 409 when making staff active would take you over your plan\'s staff limit, and 404 when none of the staff could be changed.  Known issue: this call currently answers 400 (\"Invalid staff details provided.\") for every integration request, because it still expects a person as the one making the change. Use it once that is fixed.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Set employment status and dates for several staff
     * @param {StaffStaffBulkSetEmploymentDetailsRequest} staffStaffBulkSetEmploymentDetailsRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffStaffBulkSetEmploymentDetailsRaw(requestParameters: StaffStaffBulkSetEmploymentDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffStaffBulkSetEmploymentDetails200Response>>;

    /**
     * Sets the employment status, and optionally the start date, end date and a note, for several staff members in your organisation. Terminating needs an end date. Answers 409 when making staff active would take you over your plan\'s staff limit, and 404 when none of the staff could be changed.  Known issue: this call currently answers 400 (\"Invalid staff details provided.\") for every integration request, because it still expects a person as the one making the change. Use it once that is fixed.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Set employment status and dates for several staff
     */
    staffStaffBulkSetEmploymentDetails(requestParameters: StaffStaffBulkSetEmploymentDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffStaffBulkSetEmploymentDetails200Response>;

    /**
     * Adds or updates a staff member in your organisation with the full profile: address, employment dates, employment type, payroll id, time-clock passcode and profile picture. Send it as multipart/form-data. Roles cannot be set through the API: any role sent is ignored. `data` is the staff id.  Answers 409 when the email address, mobile number or time-clock passcode is already used, or when your plan\'s staff limit is reached.  An update (`tblStaffId` set) is partial: fields you leave out keep their stored values, and `tblUserId` is ignored. Blank personal fields from a token without `staff.personal.read` count as left out. Naming another organisation in `tblTenantId` answers 403, and a staff member outside your organisation, or one that does not exist, answers 404. Blank payroll id and passcode from a token without `staff.finance.read` also count as left out, and both are ignored without `staff.finance.write`. Changing a passcode also needs `staff.finance.read`, or the call answers 403.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Add or update a staff member with full details
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} emailAddress 
     * @param {string} mobileNumber 
     * @param {string} addressLine1 
     * @param {string} city 
     * @param {string} state 
     * @param {string} country 
     * @param {string} postCode 
     * @param {string} regType How the staff member was added, for example \\\&quot;Manual\\\&quot; (up to 10 characters)
     * @param {string} [tblStaffId] Omit (or send an empty id) to add a staff member; send an existing id from your organisation to update one
     * @param {string} [tblUserId] The staff member\\\&#39;s user id when updating; must belong to a staff member of your organisation
     * @param {string} [tblTenantId] Your organisation id. Required by validation; any other organisation is refused with 403
     * @param {string} [middleName] 
     * @param {string} [prefferedName] 
     * @param {string} [phoneNumber] 
     * @param {Date} [dateOfBirth] Date of birth, yyyy-MM-dd
     * @param {string} [gender] Gender name, for example \\\&quot;Female\\\&quot;
     * @param {string} [addressLine2] 
     * @param {number} [status] Staff status: 0 InActive, 1 Active, 2 Onboarding, 3 Archived, 4 Terminated
     * @param {boolean} [isArchived] 
     * @param {string} [tblTenantAreaId] Area ids, comma-separated
     * @param {string} [primaryLocationId] 
     * @param {string} [primaryAreaId] 
     * @param {string} [tblLocationGroupId] 
     * @param {boolean} [isManagerCanRostered] 
     * @param {string} [employementType] Employment type id (spelt this way)
     * @param {string} [employeeStartDate] A calendar date with no time zone; not an instant.
     * @param {string} [employeeEndDate] A calendar date with no time zone; not an instant.
     * @param {number} [timeClockPasscode] Six-digit time-clock passcode; must be unique in your organisation
     * @param {string} [payrollId] Payroll id, up to 20 characters
     * @param {string} [payrollCesCode] Payroll cessation code
     * @param {string} [tblCountryId] Country id
     * @param {string} [tblStateId] State id
     * @param {string} [profilePic] The existing profile picture file id, to keep it
     * @param {Blob} [profilePicFile] A new profile picture
     * @param {string} [removedAttachment] File ids to remove, comma-separated
     * @param {string} [tagIds] Tag ids, comma-separated
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffStaffManualRegistrationRaw(requestParameters: StaffStaffManualRegistrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffStaffRegistration200Response>>;

    /**
     * Adds or updates a staff member in your organisation with the full profile: address, employment dates, employment type, payroll id, time-clock passcode and profile picture. Send it as multipart/form-data. Roles cannot be set through the API: any role sent is ignored. `data` is the staff id.  Answers 409 when the email address, mobile number or time-clock passcode is already used, or when your plan\'s staff limit is reached.  An update (`tblStaffId` set) is partial: fields you leave out keep their stored values, and `tblUserId` is ignored. Blank personal fields from a token without `staff.personal.read` count as left out. Naming another organisation in `tblTenantId` answers 403, and a staff member outside your organisation, or one that does not exist, answers 404. Blank payroll id and passcode from a token without `staff.finance.read` also count as left out, and both are ignored without `staff.finance.write`. Changing a passcode also needs `staff.finance.read`, or the call answers 403.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Add or update a staff member with full details
     */
    staffStaffManualRegistration(requestParameters: StaffStaffManualRegistrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffStaffRegistration200Response>;

    /**
     * Adds a staff member to your organisation (creating their user account) or updates one when `tblStaffId` is set. Roles cannot be set through the API: any role sent is ignored. `data` is the staff id.  Answers 409 when the email address or mobile number is already used by another staff member, or when your plan\'s staff limit is reached; `data` then holds a fixed id rather than a staff id.  An update (`tblStaffId` set) is partial: fields you leave out keep their stored values, and `tblUserId` is ignored. Blank personal fields from a token without `staff.personal.read` count as left out. Naming another organisation in `tblTenantId` answers 403, and a staff member outside your organisation, or one that does not exist, answers 404.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary Add or update a staff member
     * @param {StaffStaffRegistrationRequest} staffStaffRegistrationRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    staffStaffRegistrationRaw(requestParameters: StaffStaffRegistrationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffStaffRegistration200Response>>;

    /**
     * Adds a staff member to your organisation (creating their user account) or updates one when `tblStaffId` is set. Roles cannot be set through the API: any role sent is ignored. `data` is the staff id.  Answers 409 when the email address or mobile number is already used by another staff member, or when your plan\'s staff limit is reached; `data` then holds a fixed id rather than a staff id.  An update (`tblStaffId` set) is partial: fields you leave out keep their stored values, and `tblUserId` is ignored. Blank personal fields from a token without `staff.personal.read` count as left out. Naming another organisation in `tblTenantId` answers 403, and a staff member outside your organisation, or one that does not exist, answers 404.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Add or update a staff member
     */
    staffStaffRegistration(requestParameters: StaffStaffRegistrationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffStaffRegistration200Response>;

    /**
     * Returns the staff assigned to one area, with each person\'s roles and phone number. Set `isManagerOnly` for the area\'s managers only. Leave `pageSize` out to get every match.  The area must belong to your organisation, or the call answers 400. An area that is not at the location you name comes back as an empty list.  With no `pageSize` this returns one page of 200.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * @summary List the staff assigned to an area
     * @param {TenantV2GetStaffByAreaRequest} tenantV2GetStaffByAreaRequest The area and paging.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StaffApiInterface
     */
    tenantV2GetStaffByAreaRaw(requestParameters: TenantV2GetStaffByAreaOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantV2GetStaffByArea200Response>>;

    /**
     * Returns the staff assigned to one area, with each person\'s roles and phone number. Set `isManagerOnly` for the area\'s managers only. Leave `pageSize` out to get every match.  The area must belong to your organisation, or the call answers 400. An area that is not at the location you name comes back as an empty list.  With no `pageSize` this returns one page of 200.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List the staff assigned to an area
     */
    tenantV2GetStaffByArea(requestParameters: TenantV2GetStaffByAreaOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantV2GetStaffByArea200Response>;

}

/**
 * 
 */
export class StaffApi extends runtime.BaseAPI implements StaffApiInterface {

    /**
     * Returns your staff with their roles, for picking who to roster. Narrow it to staff assigned to one location (`locationId`) or to some areas (`areaIds`). Agency workers are not included. An empty list comes back as 200 with its own message.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff for rostering
     */
    async schedulingGetStaffListRaw(requestParameters: SchedulingGetStaffListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetStaffList200Response>> {
        if (requestParameters['schedulingGetStaffListRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingGetStaffListRequest',
                'Required parameter "schedulingGetStaffListRequest" was null or undefined when calling schedulingGetStaffList().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/StaffManagement/get-staff-list`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingGetStaffListRequestToJSON(requestParameters['schedulingGetStaffListRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetStaffList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns your staff with their roles, for picking who to roster. Narrow it to staff assigned to one location (`locationId`) or to some areas (`areaIds`). Agency workers are not included. An empty list comes back as 200 with its own message.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff for rostering
     */
    async schedulingGetStaffList(requestParameters: SchedulingGetStaffListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetStaffList200Response> {
        const response = await this.schedulingGetStaffListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns your active staff with their roles, qualifications, locations and areas, employment type, contact details and their availability on each date in the range. Filter by name (`staffName`, matching first, last or full name), qualifications, roles, locations or one area. Email, mobile, gender and home address need `staff.personal.read`; without it they are null. The response also carries `staffCount`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff with roles, qualifications and availability
     */
    async schedulingGetStaffListWithDetailsRaw(requestParameters: SchedulingGetStaffListWithDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetStaffListWithDetails200Response>> {
        if (requestParameters['schedulingGetStaffListWithDetailsRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingGetStaffListWithDetailsRequest',
                'Required parameter "schedulingGetStaffListWithDetailsRequest" was null or undefined when calling schedulingGetStaffListWithDetails().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/StaffManagement/get-staff-list-with-details`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingGetStaffListWithDetailsRequestToJSON(requestParameters['schedulingGetStaffListWithDetailsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetStaffListWithDetails200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns your active staff with their roles, qualifications, locations and areas, employment type, contact details and their availability on each date in the range. Filter by name (`staffName`, matching first, last or full name), qualifications, roles, locations or one area. Email, mobile, gender and home address need `staff.personal.read`; without it they are null. The response also carries `staffCount`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff with roles, qualifications and availability
     */
    async schedulingGetStaffListWithDetails(requestParameters: SchedulingGetStaffListWithDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetStaffListWithDetails200Response> {
        const response = await this.schedulingGetStaffListWithDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Adds or changes regular working days on a staff contract in your organisation, with their shifts and breaks. Every contract and regular-hour id must belong to your organisation, or the call is refused with 403. `data` is the number of rows written; 404 means nothing was written.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Save regular hours on a staff contract
     */
    async staffAddRegularHoursRaw(requestParameters: StaffAddRegularHoursRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddRegularHours200Response>> {
        if (requestParameters['staffAddRegularHoursRequestInner'] == null) {
            throw new runtime.RequiredError(
                'staffAddRegularHoursRequestInner',
                'Required parameter "staffAddRegularHoursRequestInner" was null or undefined when calling staffAddRegularHours().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.write"]);
        }


        let urlPath = `/staff/add-regular-hours`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['staffAddRegularHoursRequestInner']!.map(StaffAddRegularHoursRequestInnerToJSON),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffAddRegularHours200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds or changes regular working days on a staff contract in your organisation, with their shifts and breaks. Every contract and regular-hour id must belong to your organisation, or the call is refused with 403. `data` is the number of rows written; 404 means nothing was written.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Save regular hours on a staff contract
     */
    async staffAddRegularHours(requestParameters: StaffAddRegularHoursRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddRegularHours200Response> {
        const response = await this.staffAddRegularHoursRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Adds or changes regular working days on a staff contract in your organisation, with their shifts and breaks. Every contract and regular-hour id must belong to your organisation, or the call is refused with 403. `data` is the number of rows written; 404 means nothing was written.  This is a second route to the same save. It differs only in refusing an empty list with 400 and in its messages.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Save regular hours on a staff contract (alternative route)
     */
    async staffAddUpdateStaffRegularHoursRaw(requestParameters: StaffAddUpdateStaffRegularHoursRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffAddRegularHours200Response>> {
        if (requestParameters['staffAddRegularHoursRequestInner'] == null) {
            throw new runtime.RequiredError(
                'staffAddRegularHoursRequestInner',
                'Required parameter "staffAddRegularHoursRequestInner" was null or undefined when calling staffAddUpdateStaffRegularHours().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.write"]);
        }


        let urlPath = `/staff/add-update-staff-regular-hours`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['staffAddRegularHoursRequestInner']!.map(StaffAddRegularHoursRequestInnerToJSON),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffAddRegularHours200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds or changes regular working days on a staff contract in your organisation, with their shifts and breaks. Every contract and regular-hour id must belong to your organisation, or the call is refused with 403. `data` is the number of rows written; 404 means nothing was written.  This is a second route to the same save. It differs only in refusing an empty list with 400 and in its messages.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Save regular hours on a staff contract (alternative route)
     */
    async staffAddUpdateStaffRegularHours(requestParameters: StaffAddUpdateStaffRegularHoursRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffAddRegularHours200Response> {
        const response = await this.staffAddUpdateStaffRegularHoursRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a page of your organisation\'s current, unarchived staff with their contact details, address, roles, tags, areas, employment dates and invitation status. `tenantID` is required and must be your organisation\'s id.  Each row also carries the staff member\'s payroll id and time-clock passcode, so treat the response as sensitive.  Staff who have not set a password yet are included. Date of birth, contact details, address and documents need `staff.personal.read`; payroll id and time-clock passcode need `staff.finance.read`; pay rate fields need `pay_conditions.read`. Without the scope the field is null or blank. Without `staff.personal.read`, searching by email or mobile and sorting by mobile are ignored. Without `staff.finance.read`, searching by payroll id and sorting by it are ignored.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff
     */
    async staffApiStaffRaw(requestParameters: StaffApiStaffOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffApiStaff200Response>> {
        if (requestParameters['staffApiStaffRequest'] == null) {
            throw new runtime.RequiredError(
                'staffApiStaffRequest',
                'Required parameter "staffApiStaffRequest" was null or undefined when calling staffApiStaff().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/api/Staff`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffApiStaffRequestToJSON(requestParameters['staffApiStaffRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffApiStaff200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a page of your organisation\'s current, unarchived staff with their contact details, address, roles, tags, areas, employment dates and invitation status. `tenantID` is required and must be your organisation\'s id.  Each row also carries the staff member\'s payroll id and time-clock passcode, so treat the response as sensitive.  Staff who have not set a password yet are included. Date of birth, contact details, address and documents need `staff.personal.read`; payroll id and time-clock passcode need `staff.finance.read`; pay rate fields need `pay_conditions.read`. Without the scope the field is null or blank. Without `staff.personal.read`, searching by email or mobile and sorting by mobile are ignored. Without `staff.finance.read`, searching by payroll id and sorting by it are ignored.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff
     */
    async staffApiStaff(requestParameters: StaffApiStaffOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffApiStaff200Response> {
        const response = await this.staffApiStaffRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Adds or updates many staff members in your organisation at once. Each row is matched to an existing staff member by email address and updated, or added as new; locations and areas are matched by name. Rows marked Invalid are skipped. Roles in the rows are ignored.  Answers 409 when the import would take you over your plan\'s staff limit, and 400 when it fails, with the per-row results in `data` either way.  Payroll ids and passcodes in the rows are ignored without `staff.finance.write`.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Import staff in bulk
     */
    async staffConfirmStaffImportRaw(requestParameters: StaffConfirmStaffImportOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffConfirmStaffImport200Response>> {
        if (requestParameters['staffConfirmStaffImportRequest'] == null) {
            throw new runtime.RequiredError(
                'staffConfirmStaffImportRequest',
                'Required parameter "staffConfirmStaffImportRequest" was null or undefined when calling staffConfirmStaffImport().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.write"]);
        }


        let urlPath = `/staff/confirm-staff-import`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffConfirmStaffImportRequestToJSON(requestParameters['staffConfirmStaffImportRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffConfirmStaffImport200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds or updates many staff members in your organisation at once. Each row is matched to an existing staff member by email address and updated, or added as new; locations and areas are matched by name. Rows marked Invalid are skipped. Roles in the rows are ignored.  Answers 409 when the import would take you over your plan\'s staff limit, and 400 when it fails, with the per-row results in `data` either way.  Payroll ids and passcodes in the rows are ignored without `staff.finance.write`.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Import staff in bulk
     */
    async staffConfirmStaffImport(requestParameters: StaffConfirmStaffImportOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffConfirmStaffImport200Response> {
        const response = await this.staffConfirmStaffImportRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Removes a staff member from your organisation. Send the id in the query string; there is no body.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Delete a staff member
     */
    async staffDeleteStaffRaw(requestParameters: StaffDeleteStaffRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffDeleteStaff200Response>> {
        if (requestParameters['tblStaffId'] == null) {
            throw new runtime.RequiredError(
                'tblStaffId',
                'Required parameter "tblStaffId" was null or undefined when calling staffDeleteStaff().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tblStaffId'] != null) {
            queryParameters['tblStaffId'] = requestParameters['tblStaffId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.write"]);
        }


        let urlPath = `/staff/delete-staff`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffDeleteStaff200ResponseFromJSON(jsonValue));
    }

    /**
     * Removes a staff member from your organisation. Send the id in the query string; there is no body.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Delete a staff member
     */
    async staffDeleteStaff(requestParameters: StaffDeleteStaffRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffDeleteStaff200Response> {
        const response = await this.staffDeleteStaffRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns how many active staff your organisation has, as a number in `data`. `tenantId` must be your own organisation.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * Count active staff
     */
    async staffGetActiveStaffCountRaw(requestParameters: StaffGetActiveStaffCountRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetActiveStaffCount200Response>> {
        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling staffGetActiveStaffCount().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["organisation.read"]);
        }


        let urlPath = `/staff/get-active-staff-count`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetActiveStaffCount200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns how many active staff your organisation has, as a number in `data`. `tenantId` must be your own organisation.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * Count active staff
     */
    async staffGetActiveStaffCount(requestParameters: StaffGetActiveStaffCountRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetActiveStaffCount200Response> {
        const response = await this.staffGetActiveStaffCountRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a page of your organisation\'s contract templates (or documents, with `isDocument: true`), each with the list of times it was sent to a staff member and the current status of each send (for example Sent, Signed or Countersigned).  Set `userId` to see only the templates sent to one staff member. The template content and document links are included, so treat the response as staff records.  **Required scope:** `contracts.read`  See **Responses** below for the status codes this operation can return.
     * List contract templates and who they were sent to
     */
    async staffGetContractCommunicationListRaw(requestParameters: StaffGetContractCommunicationListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetContractCommunicationList200Response>> {
        if (requestParameters['staffGetContractCommunicationListRequest'] == null) {
            throw new runtime.RequiredError(
                'staffGetContractCommunicationListRequest',
                'Required parameter "staffGetContractCommunicationListRequest" was null or undefined when calling staffGetContractCommunicationList().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["contracts.read"]);
        }


        let urlPath = `/staff/get-contract-communication-list`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffGetContractCommunicationListRequestToJSON(requestParameters['staffGetContractCommunicationListRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetContractCommunicationList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a page of your organisation\'s contract templates (or documents, with `isDocument: true`), each with the list of times it was sent to a staff member and the current status of each send (for example Sent, Signed or Countersigned).  Set `userId` to see only the templates sent to one staff member. The template content and document links are included, so treat the response as staff records.  **Required scope:** `contracts.read`  See **Responses** below for the status codes this operation can return.
     * List contract templates and who they were sent to
     */
    async staffGetContractCommunicationList(requestParameters: StaffGetContractCommunicationListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetContractCommunicationList200Response> {
        const response = await this.staffGetContractCommunicationListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a page of the contracts and documents sent to one staff member in your organisation, with each one\'s current status, the date it was sent and the date it was signed.  This call answers with the result object itself rather than the usual `data` and `message` wrapper: `success`, `message` and paging sit beside the `data` list. When nothing matches, it answers 400 with `success: false` and a message saying no contracts were found.  **Required scope:** `contracts.read`  See **Responses** below for the status codes this operation can return.
     * List the contracts sent to one staff member
     */
    async staffGetContractListEmployeeRaw(requestParameters: StaffGetContractListEmployeeOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetContractListEmployee200Response>> {
        if (requestParameters['staffGetContractListEmployeeRequest'] == null) {
            throw new runtime.RequiredError(
                'staffGetContractListEmployeeRequest',
                'Required parameter "staffGetContractListEmployeeRequest" was null or undefined when calling staffGetContractListEmployee().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["contracts.read"]);
        }


        let urlPath = `/staff/get-contract-list-employee`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffGetContractListEmployeeRequestToJSON(requestParameters['staffGetContractListEmployeeRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetContractListEmployee200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a page of the contracts and documents sent to one staff member in your organisation, with each one\'s current status, the date it was sent and the date it was signed.  This call answers with the result object itself rather than the usual `data` and `message` wrapper: `success`, `message` and paging sit beside the `data` list. When nothing matches, it answers 400 with `success: false` and a message saying no contracts were found.  **Required scope:** `contracts.read`  See **Responses** below for the status codes this operation can return.
     * List the contracts sent to one staff member
     */
    async staffGetContractListEmployee(requestParameters: StaffGetContractListEmployeeOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetContractListEmployee200Response> {
        const response = await this.staffGetContractListEmployeeRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the regular working days on one staff contract, each with its shifts, areas and breaks. The contract must belong to a staff member of your organisation, or the call is refused with 403.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * Get the regular hours on a staff contract
     */
    async staffGetRegularHoursRaw(requestParameters: StaffGetRegularHoursRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetRegularHours200Response>> {
        if (requestParameters['staffContractId'] == null) {
            throw new runtime.RequiredError(
                'staffContractId',
                'Required parameter "staffContractId" was null or undefined when calling staffGetRegularHours().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['staffContractId'] != null) {
            queryParameters['StaffContractId'] = requestParameters['staffContractId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/get-regular-hours`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetRegularHours200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the regular working days on one staff contract, each with its shifts, areas and breaks. The contract must belong to a staff member of your organisation, or the call is refused with 403.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * Get the regular hours on a staff contract
     */
    async staffGetRegularHours(requestParameters: StaffGetRegularHoursRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetRegularHours200Response> {
        const response = await this.staffGetRegularHoursRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one staff member\'s full profile: name, contact details, date of birth, address, areas, primary location and area, employment dates, roles, tags, documents and invitation status. The staff member must be a current staff member of your organisation, or the call is refused with 403.  Date of birth, contact details, address, profile picture and documents need `staff.personal.read`; time-clock passcode, payroll id and tax file number need `staff.finance.read`. Without the scope those fields are null. Holding `staff.finance.write` alone does not unlock them.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * Get one staff member
     */
    async staffGetStaffRaw(requestParameters: StaffGetStaffRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaff200Response>> {
        if (requestParameters['iD'] == null) {
            throw new runtime.RequiredError(
                'iD',
                'Required parameter "iD" was null or undefined when calling staffGetStaff().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['iD'] != null) {
            queryParameters['ID'] = requestParameters['iD'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/api/Staff/get-staff`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetStaff200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one staff member\'s full profile: name, contact details, date of birth, address, areas, primary location and area, employment dates, roles, tags, documents and invitation status. The staff member must be a current staff member of your organisation, or the call is refused with 403.  Date of birth, contact details, address, profile picture and documents need `staff.personal.read`; time-clock passcode, payroll id and tax file number need `staff.finance.read`. Without the scope those fields are null. Holding `staff.finance.write` alone does not unlock them.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * Get one staff member
     */
    async staffGetStaff(requestParameters: StaffGetStaffRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaff200Response> {
        const response = await this.staffGetStaffRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a short page of your organisation\'s staff: id, name, employment type and mobile number. Use it for pickers and matching. `tenantID` is required and must be your organisation\'s id.  Staff who have not set a password yet are included. `mobileNumber` needs `staff.personal.read`; without it it is null, searching by email or mobile is ignored and sorting by mobile is ignored.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff names and mobile numbers
     */
    async staffGetStaffListRaw(requestParameters: StaffGetStaffListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffList200Response>> {
        if (requestParameters['staffGetStaffListRequest'] == null) {
            throw new runtime.RequiredError(
                'staffGetStaffListRequest',
                'Required parameter "staffGetStaffListRequest" was null or undefined when calling staffGetStaffList().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/api/Staff/get-staff-list`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffGetStaffListRequestToJSON(requestParameters['staffGetStaffListRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetStaffList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a short page of your organisation\'s staff: id, name, employment type and mobile number. Use it for pickers and matching. `tenantID` is required and must be your organisation\'s id.  Staff who have not set a password yet are included. `mobileNumber` needs `staff.personal.read`; without it it is null, searching by email or mobile is ignored and sorting by mobile is ignored.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff names and mobile numbers
     */
    async staffGetStaffList(requestParameters: StaffGetStaffListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffList200Response> {
        const response = await this.staffGetStaffListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the locations and areas a staff member in your organisation works in, and their primary location and area. Answers 404 when none are assigned.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s locations and areas
     */
    async staffGetStaffLocationAreaRaw(requestParameters: StaffGetStaffLocationAreaOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffLocationArea200Response>> {
        if (requestParameters['staffGetStaffLocationAreaRequest'] == null) {
            throw new runtime.RequiredError(
                'staffGetStaffLocationAreaRequest',
                'Required parameter "staffGetStaffLocationAreaRequest" was null or undefined when calling staffGetStaffLocationArea().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/api/Staff/get-staff-location-area`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffGetStaffLocationAreaRequestToJSON(requestParameters['staffGetStaffLocationAreaRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetStaffLocationArea200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the locations and areas a staff member in your organisation works in, and their primary location and area. Answers 404 when none are assigned.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s locations and areas
     */
    async staffGetStaffLocationArea(requestParameters: StaffGetStaffLocationAreaOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffLocationArea200Response> {
        const response = await this.staffGetStaffLocationAreaRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a page of your organisation\'s staff with each one\'s staff id, user id, name and profile picture link. Useful for matching staff to user ids used elsewhere (for example in contracts).  `profilePic` needs `staff.personal.read`; without it it is null.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff with their user ids
     */
    async staffGetTenantStaffListRaw(requestParameters: StaffGetTenantStaffListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetTenantStaffList200Response>> {
        if (requestParameters['staffGetTenantStaffListRequest'] == null) {
            throw new runtime.RequiredError(
                'staffGetTenantStaffListRequest',
                'Required parameter "staffGetTenantStaffListRequest" was null or undefined when calling staffGetTenantStaffList().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/api/Staff/get-tenant-staff-list`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffGetTenantStaffListRequestToJSON(requestParameters['staffGetTenantStaffListRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetTenantStaffList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a page of your organisation\'s staff with each one\'s staff id, user id, name and profile picture link. Useful for matching staff to user ids used elsewhere (for example in contracts).  `profilePic` needs `staff.personal.read`; without it it is null.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List staff with their user ids
     */
    async staffGetTenantStaffList(requestParameters: StaffGetTenantStaffListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetTenantStaffList200Response> {
        const response = await this.staffGetTenantStaffListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Sets the primary location of a staff member in your organisation. `data` is the staff id; the success message currently reads as if a role was set.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Set a staff member\'s primary location
     */
    async staffSetStaffPrimaryLocationRaw(requestParameters: StaffSetStaffPrimaryLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffStaffRegistration200Response>> {
        if (requestParameters['staffSetStaffPrimaryLocationRequest'] == null) {
            throw new runtime.RequiredError(
                'staffSetStaffPrimaryLocationRequest',
                'Required parameter "staffSetStaffPrimaryLocationRequest" was null or undefined when calling staffSetStaffPrimaryLocation().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.write"]);
        }


        let urlPath = `/staff/set-staff-primary-location`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffSetStaffPrimaryLocationRequestToJSON(requestParameters['staffSetStaffPrimaryLocationRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffStaffRegistration200ResponseFromJSON(jsonValue));
    }

    /**
     * Sets the primary location of a staff member in your organisation. `data` is the staff id; the success message currently reads as if a role was set.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Set a staff member\'s primary location
     */
    async staffSetStaffPrimaryLocation(requestParameters: StaffSetStaffPrimaryLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffStaffRegistration200Response> {
        const response = await this.staffSetStaffPrimaryLocationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Adds one or more of your organisation\'s tags to several staff members. Existing tags are kept. Answers 404 when none of the staff could be updated.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Add tags to several staff members
     */
    async staffStaffBulkAddTagsRaw(requestParameters: StaffStaffBulkAddTagsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffStaffBulkAddTags200Response>> {
        if (requestParameters['staffStaffBulkAddTagsRequest'] == null) {
            throw new runtime.RequiredError(
                'staffStaffBulkAddTagsRequest',
                'Required parameter "staffStaffBulkAddTagsRequest" was null or undefined when calling staffStaffBulkAddTags().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.write"]);
        }


        let urlPath = `/staff/staff-bulk-add-tags`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffStaffBulkAddTagsRequestToJSON(requestParameters['staffStaffBulkAddTagsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffStaffBulkAddTags200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds one or more of your organisation\'s tags to several staff members. Existing tags are kept. Answers 404 when none of the staff could be updated.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Add tags to several staff members
     */
    async staffStaffBulkAddTags(requestParameters: StaffStaffBulkAddTagsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffStaffBulkAddTags200Response> {
        const response = await this.staffStaffBulkAddTagsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Archives several staff members in your organisation, so they no longer appear in staff lists or rosters. `data` is the number of staff archived; the success message currently reads as if a location was added.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Archive several staff members
     */
    async staffStaffBulkArchiveRaw(requestParameters: StaffStaffBulkArchiveOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffStaffBulkArchive200Response>> {
        if (requestParameters['staffStaffBulkArchiveRequest'] == null) {
            throw new runtime.RequiredError(
                'staffStaffBulkArchiveRequest',
                'Required parameter "staffStaffBulkArchiveRequest" was null or undefined when calling staffStaffBulkArchive().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.write"]);
        }


        let urlPath = `/staff/staff-bulk-archive`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffStaffBulkArchiveRequestToJSON(requestParameters['staffStaffBulkArchiveRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffStaffBulkArchive200ResponseFromJSON(jsonValue));
    }

    /**
     * Archives several staff members in your organisation, so they no longer appear in staff lists or rosters. `data` is the number of staff archived; the success message currently reads as if a location was added.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Archive several staff members
     */
    async staffStaffBulkArchive(requestParameters: StaffStaffBulkArchiveOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffStaffBulkArchive200Response> {
        const response = await this.staffStaffBulkArchiveRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Sets the employment status, and optionally the start date, end date and a note, for several staff members in your organisation. Terminating needs an end date. Answers 409 when making staff active would take you over your plan\'s staff limit, and 404 when none of the staff could be changed.  Known issue: this call currently answers 400 (\"Invalid staff details provided.\") for every integration request, because it still expects a person as the one making the change. Use it once that is fixed.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Set employment status and dates for several staff
     */
    async staffStaffBulkSetEmploymentDetailsRaw(requestParameters: StaffStaffBulkSetEmploymentDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffStaffBulkSetEmploymentDetails200Response>> {
        if (requestParameters['staffStaffBulkSetEmploymentDetailsRequest'] == null) {
            throw new runtime.RequiredError(
                'staffStaffBulkSetEmploymentDetailsRequest',
                'Required parameter "staffStaffBulkSetEmploymentDetailsRequest" was null or undefined when calling staffStaffBulkSetEmploymentDetails().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.write"]);
        }


        let urlPath = `/staff/staff-bulk-set-employment-details`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffStaffBulkSetEmploymentDetailsRequestToJSON(requestParameters['staffStaffBulkSetEmploymentDetailsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffStaffBulkSetEmploymentDetails200ResponseFromJSON(jsonValue));
    }

    /**
     * Sets the employment status, and optionally the start date, end date and a note, for several staff members in your organisation. Terminating needs an end date. Answers 409 when making staff active would take you over your plan\'s staff limit, and 404 when none of the staff could be changed.  Known issue: this call currently answers 400 (\"Invalid staff details provided.\") for every integration request, because it still expects a person as the one making the change. Use it once that is fixed.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Set employment status and dates for several staff
     */
    async staffStaffBulkSetEmploymentDetails(requestParameters: StaffStaffBulkSetEmploymentDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffStaffBulkSetEmploymentDetails200Response> {
        const response = await this.staffStaffBulkSetEmploymentDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Adds or updates a staff member in your organisation with the full profile: address, employment dates, employment type, payroll id, time-clock passcode and profile picture. Send it as multipart/form-data. Roles cannot be set through the API: any role sent is ignored. `data` is the staff id.  Answers 409 when the email address, mobile number or time-clock passcode is already used, or when your plan\'s staff limit is reached.  An update (`tblStaffId` set) is partial: fields you leave out keep their stored values, and `tblUserId` is ignored. Blank personal fields from a token without `staff.personal.read` count as left out. Naming another organisation in `tblTenantId` answers 403, and a staff member outside your organisation, or one that does not exist, answers 404. Blank payroll id and passcode from a token without `staff.finance.read` also count as left out, and both are ignored without `staff.finance.write`. Changing a passcode also needs `staff.finance.read`, or the call answers 403.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Add or update a staff member with full details
     */
    async staffStaffManualRegistrationRaw(requestParameters: StaffStaffManualRegistrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffStaffRegistration200Response>> {
        if (requestParameters['firstName'] == null) {
            throw new runtime.RequiredError(
                'firstName',
                'Required parameter "firstName" was null or undefined when calling staffStaffManualRegistration().'
            );
        }

        if (requestParameters['lastName'] == null) {
            throw new runtime.RequiredError(
                'lastName',
                'Required parameter "lastName" was null or undefined when calling staffStaffManualRegistration().'
            );
        }

        if (requestParameters['emailAddress'] == null) {
            throw new runtime.RequiredError(
                'emailAddress',
                'Required parameter "emailAddress" was null or undefined when calling staffStaffManualRegistration().'
            );
        }

        if (requestParameters['mobileNumber'] == null) {
            throw new runtime.RequiredError(
                'mobileNumber',
                'Required parameter "mobileNumber" was null or undefined when calling staffStaffManualRegistration().'
            );
        }

        if (requestParameters['addressLine1'] == null) {
            throw new runtime.RequiredError(
                'addressLine1',
                'Required parameter "addressLine1" was null or undefined when calling staffStaffManualRegistration().'
            );
        }

        if (requestParameters['city'] == null) {
            throw new runtime.RequiredError(
                'city',
                'Required parameter "city" was null or undefined when calling staffStaffManualRegistration().'
            );
        }

        if (requestParameters['state'] == null) {
            throw new runtime.RequiredError(
                'state',
                'Required parameter "state" was null or undefined when calling staffStaffManualRegistration().'
            );
        }

        if (requestParameters['country'] == null) {
            throw new runtime.RequiredError(
                'country',
                'Required parameter "country" was null or undefined when calling staffStaffManualRegistration().'
            );
        }

        if (requestParameters['postCode'] == null) {
            throw new runtime.RequiredError(
                'postCode',
                'Required parameter "postCode" was null or undefined when calling staffStaffManualRegistration().'
            );
        }

        if (requestParameters['regType'] == null) {
            throw new runtime.RequiredError(
                'regType',
                'Required parameter "regType" was null or undefined when calling staffStaffManualRegistration().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.write"]);
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

        if (requestParameters['tblStaffId'] != null) {
            formParams.append('tblStaffId', requestParameters['tblStaffId'] as any);
        }

        if (requestParameters['tblUserId'] != null) {
            formParams.append('tblUserId', requestParameters['tblUserId'] as any);
        }

        if (requestParameters['tblTenantId'] != null) {
            formParams.append('tblTenantId', requestParameters['tblTenantId'] as any);
        }

        if (requestParameters['firstName'] != null) {
            formParams.append('firstName', requestParameters['firstName'] as any);
        }

        if (requestParameters['middleName'] != null) {
            formParams.append('middleName', requestParameters['middleName'] as any);
        }

        if (requestParameters['lastName'] != null) {
            formParams.append('lastName', requestParameters['lastName'] as any);
        }

        if (requestParameters['prefferedName'] != null) {
            formParams.append('prefferedName', requestParameters['prefferedName'] as any);
        }

        if (requestParameters['emailAddress'] != null) {
            formParams.append('emailAddress', requestParameters['emailAddress'] as any);
        }

        if (requestParameters['mobileNumber'] != null) {
            formParams.append('mobileNumber', requestParameters['mobileNumber'] as any);
        }

        if (requestParameters['phoneNumber'] != null) {
            formParams.append('phoneNumber', requestParameters['phoneNumber'] as any);
        }

        if (requestParameters['dateOfBirth'] != null) {
            formParams.append('dateOfBirth', requestParameters['dateOfBirth'] as any);
        }

        if (requestParameters['gender'] != null) {
            formParams.append('gender', requestParameters['gender'] as any);
        }

        if (requestParameters['addressLine1'] != null) {
            formParams.append('addressLine1', requestParameters['addressLine1'] as any);
        }

        if (requestParameters['addressLine2'] != null) {
            formParams.append('addressLine2', requestParameters['addressLine2'] as any);
        }

        if (requestParameters['city'] != null) {
            formParams.append('city', requestParameters['city'] as any);
        }

        if (requestParameters['state'] != null) {
            formParams.append('state', requestParameters['state'] as any);
        }

        if (requestParameters['country'] != null) {
            formParams.append('country', requestParameters['country'] as any);
        }

        if (requestParameters['postCode'] != null) {
            formParams.append('postCode', requestParameters['postCode'] as any);
        }

        if (requestParameters['status'] != null) {
            formParams.append('status', requestParameters['status'] as any);
        }

        if (requestParameters['isArchived'] != null) {
            formParams.append('isArchived', requestParameters['isArchived'] as any);
        }

        if (requestParameters['regType'] != null) {
            formParams.append('regType', requestParameters['regType'] as any);
        }

        if (requestParameters['tblTenantAreaId'] != null) {
            formParams.append('tblTenantAreaId', requestParameters['tblTenantAreaId'] as any);
        }

        if (requestParameters['primaryLocationId'] != null) {
            formParams.append('primaryLocationId', requestParameters['primaryLocationId'] as any);
        }

        if (requestParameters['primaryAreaId'] != null) {
            formParams.append('primaryAreaId', requestParameters['primaryAreaId'] as any);
        }

        if (requestParameters['tblLocationGroupId'] != null) {
            formParams.append('tblLocationGroupId', requestParameters['tblLocationGroupId'] as any);
        }

        if (requestParameters['isManagerCanRostered'] != null) {
            formParams.append('isManagerCanRostered', requestParameters['isManagerCanRostered'] as any);
        }

        if (requestParameters['employementType'] != null) {
            formParams.append('employementType', requestParameters['employementType'] as any);
        }

        if (requestParameters['employeeStartDate'] != null) {
            formParams.append('employeeStartDate', requestParameters['employeeStartDate'] as any);
        }

        if (requestParameters['employeeEndDate'] != null) {
            formParams.append('employeeEndDate', requestParameters['employeeEndDate'] as any);
        }

        if (requestParameters['timeClockPasscode'] != null) {
            formParams.append('timeClockPasscode', requestParameters['timeClockPasscode'] as any);
        }

        if (requestParameters['payrollId'] != null) {
            formParams.append('payrollId', requestParameters['payrollId'] as any);
        }

        if (requestParameters['payrollCesCode'] != null) {
            formParams.append('payrollCesCode', requestParameters['payrollCesCode'] as any);
        }

        if (requestParameters['tblCountryId'] != null) {
            formParams.append('tblCountryId', requestParameters['tblCountryId'] as any);
        }

        if (requestParameters['tblStateId'] != null) {
            formParams.append('tblStateId', requestParameters['tblStateId'] as any);
        }

        if (requestParameters['profilePic'] != null) {
            formParams.append('profilePic', requestParameters['profilePic'] as any);
        }

        if (requestParameters['profilePicFile'] != null) {
            formParams.append('profilePicFile', requestParameters['profilePicFile'] as any);
        }

        if (requestParameters['removedAttachment'] != null) {
            formParams.append('removedAttachment', requestParameters['removedAttachment'] as any);
        }

        if (requestParameters['tagIds'] != null) {
            formParams.append('tagIds', requestParameters['tagIds'] as any);
        }


        let urlPath = `/staff/staff-manual-registration`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffStaffRegistration200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds or updates a staff member in your organisation with the full profile: address, employment dates, employment type, payroll id, time-clock passcode and profile picture. Send it as multipart/form-data. Roles cannot be set through the API: any role sent is ignored. `data` is the staff id.  Answers 409 when the email address, mobile number or time-clock passcode is already used, or when your plan\'s staff limit is reached.  An update (`tblStaffId` set) is partial: fields you leave out keep their stored values, and `tblUserId` is ignored. Blank personal fields from a token without `staff.personal.read` count as left out. Naming another organisation in `tblTenantId` answers 403, and a staff member outside your organisation, or one that does not exist, answers 404. Blank payroll id and passcode from a token without `staff.finance.read` also count as left out, and both are ignored without `staff.finance.write`. Changing a passcode also needs `staff.finance.read`, or the call answers 403.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Add or update a staff member with full details
     */
    async staffStaffManualRegistration(requestParameters: StaffStaffManualRegistrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffStaffRegistration200Response> {
        const response = await this.staffStaffManualRegistrationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Adds a staff member to your organisation (creating their user account) or updates one when `tblStaffId` is set. Roles cannot be set through the API: any role sent is ignored. `data` is the staff id.  Answers 409 when the email address or mobile number is already used by another staff member, or when your plan\'s staff limit is reached; `data` then holds a fixed id rather than a staff id.  An update (`tblStaffId` set) is partial: fields you leave out keep their stored values, and `tblUserId` is ignored. Blank personal fields from a token without `staff.personal.read` count as left out. Naming another organisation in `tblTenantId` answers 403, and a staff member outside your organisation, or one that does not exist, answers 404.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Add or update a staff member
     */
    async staffStaffRegistrationRaw(requestParameters: StaffStaffRegistrationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffStaffRegistration200Response>> {
        if (requestParameters['staffStaffRegistrationRequest'] == null) {
            throw new runtime.RequiredError(
                'staffStaffRegistrationRequest',
                'Required parameter "staffStaffRegistrationRequest" was null or undefined when calling staffStaffRegistration().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["staff.write"]);
        }


        let urlPath = `/staff/api/Staff/staff-registration`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffStaffRegistrationRequestToJSON(requestParameters['staffStaffRegistrationRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffStaffRegistration200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds a staff member to your organisation (creating their user account) or updates one when `tblStaffId` is set. Roles cannot be set through the API: any role sent is ignored. `data` is the staff id.  Answers 409 when the email address or mobile number is already used by another staff member, or when your plan\'s staff limit is reached; `data` then holds a fixed id rather than a staff id.  An update (`tblStaffId` set) is partial: fields you leave out keep their stored values, and `tblUserId` is ignored. Blank personal fields from a token without `staff.personal.read` count as left out. Naming another organisation in `tblTenantId` answers 403, and a staff member outside your organisation, or one that does not exist, answers 404.  **Required scope:** `staff.write`  See **Responses** below for the status codes this operation can return.
     * Add or update a staff member
     */
    async staffStaffRegistration(requestParameters: StaffStaffRegistrationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffStaffRegistration200Response> {
        const response = await this.staffStaffRegistrationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the staff assigned to one area, with each person\'s roles and phone number. Set `isManagerOnly` for the area\'s managers only. Leave `pageSize` out to get every match.  The area must belong to your organisation, or the call answers 400. An area that is not at the location you name comes back as an empty list.  With no `pageSize` this returns one page of 200.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List the staff assigned to an area
     */
    async tenantV2GetStaffByAreaRaw(requestParameters: TenantV2GetStaffByAreaOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantV2GetStaffByArea200Response>> {
        if (requestParameters['tenantV2GetStaffByAreaRequest'] == null) {
            throw new runtime.RequiredError(
                'tenantV2GetStaffByAreaRequest',
                'Required parameter "tenantV2GetStaffByAreaRequest" was null or undefined when calling tenantV2GetStaffByArea().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/tenant/api/tenant/V2/get-staff-by-area`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TenantV2GetStaffByAreaRequestToJSON(requestParameters['tenantV2GetStaffByAreaRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantV2GetStaffByArea200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the staff assigned to one area, with each person\'s roles and phone number. Set `isManagerOnly` for the area\'s managers only. Leave `pageSize` out to get every match.  The area must belong to your organisation, or the call answers 400. An area that is not at the location you name comes back as an empty list.  With no `pageSize` this returns one page of 200.  **Required scope:** `staff.read` or `staff.write`  See **Responses** below for the status codes this operation can return.
     * List the staff assigned to an area
     */
    async tenantV2GetStaffByArea(requestParameters: TenantV2GetStaffByAreaOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantV2GetStaffByArea200Response> {
        const response = await this.tenantV2GetStaffByAreaRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
