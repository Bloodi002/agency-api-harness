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
  SchedulingAssignStaffToGeneratedShift200Response,
  SchedulingAssignStaffToGeneratedShiftRequest,
  SchedulingBulkAssignStaffShifts200Response,
  SchedulingBulkAssignStaffShiftsRequest,
  SchedulingCreateStaffRegularShift200Response,
  SchedulingCreateStaffRegularShiftRequest,
  SchedulingDeleteGeneratedShift200Response,
  SchedulingGetCalenderViewData200Response,
  SchedulingGetCalenderViewDataRequest,
  SchedulingGetGeneratedShiftDetailById200Response,
  SchedulingGetGeneratedShiftDetailByIdRequest,
  SchedulingGetHolidayEventsCalendar200Response,
  SchedulingGetHolidayEventsCalendarRequest,
  SchedulingGetRecurringSeries200Response,
  SchedulingGetRecurringSeriesRequest,
  SchedulingGetRecurringShiftPatternById200Response,
  SchedulingGetRecurringShiftPatterns200Response,
  SchedulingGetRecurringShiftPatternsRequest,
  SchedulingGetRegularShiftDetailsRequest,
  SchedulingGetRosterHistory200Response,
  SchedulingGetRosterHistoryRequest,
  SchedulingGetRosterTemplates200Response,
  SchedulingGetShiftConflicts200Response,
  SchedulingGetShiftConflictsRequest,
  SchedulingGetShiftDetailsById200Response,
  SchedulingGetShiftDetailsByIdRequest,
  SchedulingGetShiftTemplateListWithDetails200Response,
  SchedulingGetShiftTemplateListWithDetailsRequest,
  SchedulingGetStaffAvailabilityWeekView200Response,
  SchedulingGetStaffAvailabilityWeekViewRequest,
  SchedulingPublishRegularShifts200Response,
  SchedulingPublishRegularShiftsRequest,
  SchedulingSaveGeneratedShifts200Response,
  SchedulingSaveGeneratedShiftsRequest,
  SchedulingSaveRecurringShiftPatterns200Response,
  SchedulingSaveRecurringShiftPatternsRequest,
  SchedulingUpdateStaffRegularShiftRequest,
  ValidationProblem,
} from '../models/index.js';
import {
    EnvelopeFromJSON,
    EnvelopeToJSON,
    SchedulingAssignStaffToGeneratedShift200ResponseFromJSON,
    SchedulingAssignStaffToGeneratedShift200ResponseToJSON,
    SchedulingAssignStaffToGeneratedShiftRequestFromJSON,
    SchedulingAssignStaffToGeneratedShiftRequestToJSON,
    SchedulingBulkAssignStaffShifts200ResponseFromJSON,
    SchedulingBulkAssignStaffShifts200ResponseToJSON,
    SchedulingBulkAssignStaffShiftsRequestFromJSON,
    SchedulingBulkAssignStaffShiftsRequestToJSON,
    SchedulingCreateStaffRegularShift200ResponseFromJSON,
    SchedulingCreateStaffRegularShift200ResponseToJSON,
    SchedulingCreateStaffRegularShiftRequestFromJSON,
    SchedulingCreateStaffRegularShiftRequestToJSON,
    SchedulingDeleteGeneratedShift200ResponseFromJSON,
    SchedulingDeleteGeneratedShift200ResponseToJSON,
    SchedulingGetCalenderViewData200ResponseFromJSON,
    SchedulingGetCalenderViewData200ResponseToJSON,
    SchedulingGetCalenderViewDataRequestFromJSON,
    SchedulingGetCalenderViewDataRequestToJSON,
    SchedulingGetGeneratedShiftDetailById200ResponseFromJSON,
    SchedulingGetGeneratedShiftDetailById200ResponseToJSON,
    SchedulingGetGeneratedShiftDetailByIdRequestFromJSON,
    SchedulingGetGeneratedShiftDetailByIdRequestToJSON,
    SchedulingGetHolidayEventsCalendar200ResponseFromJSON,
    SchedulingGetHolidayEventsCalendar200ResponseToJSON,
    SchedulingGetHolidayEventsCalendarRequestFromJSON,
    SchedulingGetHolidayEventsCalendarRequestToJSON,
    SchedulingGetRecurringSeries200ResponseFromJSON,
    SchedulingGetRecurringSeries200ResponseToJSON,
    SchedulingGetRecurringSeriesRequestFromJSON,
    SchedulingGetRecurringSeriesRequestToJSON,
    SchedulingGetRecurringShiftPatternById200ResponseFromJSON,
    SchedulingGetRecurringShiftPatternById200ResponseToJSON,
    SchedulingGetRecurringShiftPatterns200ResponseFromJSON,
    SchedulingGetRecurringShiftPatterns200ResponseToJSON,
    SchedulingGetRecurringShiftPatternsRequestFromJSON,
    SchedulingGetRecurringShiftPatternsRequestToJSON,
    SchedulingGetRegularShiftDetailsRequestFromJSON,
    SchedulingGetRegularShiftDetailsRequestToJSON,
    SchedulingGetRosterHistory200ResponseFromJSON,
    SchedulingGetRosterHistory200ResponseToJSON,
    SchedulingGetRosterHistoryRequestFromJSON,
    SchedulingGetRosterHistoryRequestToJSON,
    SchedulingGetRosterTemplates200ResponseFromJSON,
    SchedulingGetRosterTemplates200ResponseToJSON,
    SchedulingGetShiftConflicts200ResponseFromJSON,
    SchedulingGetShiftConflicts200ResponseToJSON,
    SchedulingGetShiftConflictsRequestFromJSON,
    SchedulingGetShiftConflictsRequestToJSON,
    SchedulingGetShiftDetailsById200ResponseFromJSON,
    SchedulingGetShiftDetailsById200ResponseToJSON,
    SchedulingGetShiftDetailsByIdRequestFromJSON,
    SchedulingGetShiftDetailsByIdRequestToJSON,
    SchedulingGetShiftTemplateListWithDetails200ResponseFromJSON,
    SchedulingGetShiftTemplateListWithDetails200ResponseToJSON,
    SchedulingGetShiftTemplateListWithDetailsRequestFromJSON,
    SchedulingGetShiftTemplateListWithDetailsRequestToJSON,
    SchedulingGetStaffAvailabilityWeekView200ResponseFromJSON,
    SchedulingGetStaffAvailabilityWeekView200ResponseToJSON,
    SchedulingGetStaffAvailabilityWeekViewRequestFromJSON,
    SchedulingGetStaffAvailabilityWeekViewRequestToJSON,
    SchedulingPublishRegularShifts200ResponseFromJSON,
    SchedulingPublishRegularShifts200ResponseToJSON,
    SchedulingPublishRegularShiftsRequestFromJSON,
    SchedulingPublishRegularShiftsRequestToJSON,
    SchedulingSaveGeneratedShifts200ResponseFromJSON,
    SchedulingSaveGeneratedShifts200ResponseToJSON,
    SchedulingSaveGeneratedShiftsRequestFromJSON,
    SchedulingSaveGeneratedShiftsRequestToJSON,
    SchedulingSaveRecurringShiftPatterns200ResponseFromJSON,
    SchedulingSaveRecurringShiftPatterns200ResponseToJSON,
    SchedulingSaveRecurringShiftPatternsRequestFromJSON,
    SchedulingSaveRecurringShiftPatternsRequestToJSON,
    SchedulingUpdateStaffRegularShiftRequestFromJSON,
    SchedulingUpdateStaffRegularShiftRequestToJSON,
    ValidationProblemFromJSON,
    ValidationProblemToJSON,
} from '../models/index.js';

export interface SchedulingAssignStaffToGeneratedShiftOperationRequest {
    schedulingAssignStaffToGeneratedShiftRequest: SchedulingAssignStaffToGeneratedShiftRequest;
}

export interface SchedulingBulkAssignStaffShiftsOperationRequest {
    schedulingBulkAssignStaffShiftsRequest: SchedulingBulkAssignStaffShiftsRequest;
}

export interface SchedulingCreateStaffRegularShiftOperationRequest {
    schedulingCreateStaffRegularShiftRequest: SchedulingCreateStaffRegularShiftRequest;
}

export interface SchedulingDeleteGeneratedShiftRequest {
    shiftId: string;
    tenantId: string;
}

export interface SchedulingDeleteRegularShiftRequest {
    rosterShiftId: string;
    tenantId: string;
}

export interface SchedulingGetCalenderViewDataOperationRequest {
    schedulingGetCalenderViewDataRequest: SchedulingGetCalenderViewDataRequest;
}

export interface SchedulingGetGeneratedShiftDetailByIdOperationRequest {
    schedulingGetGeneratedShiftDetailByIdRequest: SchedulingGetGeneratedShiftDetailByIdRequest;
}

export interface SchedulingGetHolidayEventsCalendarOperationRequest {
    schedulingGetHolidayEventsCalendarRequest: SchedulingGetHolidayEventsCalendarRequest;
}

export interface SchedulingGetRecurringSeriesOperationRequest {
    schedulingGetRecurringSeriesRequest: SchedulingGetRecurringSeriesRequest;
}

export interface SchedulingGetRecurringShiftPatternByIdRequest {
    patternId: string;
    tenantId: string;
}

export interface SchedulingGetRecurringShiftPatternsOperationRequest {
    schedulingGetRecurringShiftPatternsRequest: SchedulingGetRecurringShiftPatternsRequest;
}

export interface SchedulingGetRegularShiftDetailsOperationRequest {
    schedulingGetRegularShiftDetailsRequest: SchedulingGetRegularShiftDetailsRequest;
}

export interface SchedulingGetRosterHistoryOperationRequest {
    schedulingGetRosterHistoryRequest: SchedulingGetRosterHistoryRequest;
}

export interface SchedulingGetRosterTemplatesRequest {
    tenantId: string;
    locationId: string;
}

export interface SchedulingGetShiftConflictsOperationRequest {
    schedulingGetShiftConflictsRequest: SchedulingGetShiftConflictsRequest;
}

export interface SchedulingGetShiftDetailsByIdOperationRequest {
    schedulingGetShiftDetailsByIdRequest: SchedulingGetShiftDetailsByIdRequest;
}

export interface SchedulingGetShiftTemplateListWithDetailsOperationRequest {
    schedulingGetShiftTemplateListWithDetailsRequest: SchedulingGetShiftTemplateListWithDetailsRequest;
}

export interface SchedulingGetStaffAvailabilityWeekViewOperationRequest {
    schedulingGetStaffAvailabilityWeekViewRequest: SchedulingGetStaffAvailabilityWeekViewRequest;
}

export interface SchedulingPublishRegularShiftsOperationRequest {
    schedulingPublishRegularShiftsRequest: SchedulingPublishRegularShiftsRequest;
}

export interface SchedulingSaveGeneratedShiftsOperationRequest {
    schedulingSaveGeneratedShiftsRequest: SchedulingSaveGeneratedShiftsRequest;
}

export interface SchedulingSaveRecurringShiftPatternsOperationRequest {
    schedulingSaveRecurringShiftPatternsRequest: SchedulingSaveRecurringShiftPatternsRequest;
}

export interface SchedulingUpdateStaffRegularShiftOperationRequest {
    schedulingUpdateStaffRegularShiftRequest: SchedulingUpdateStaffRegularShiftRequest;
}

/**
 * RostersApi - interface
 * 
 * @export
 * @interface RostersApiInterface
 */
export interface RostersApiInterface {
    /**
     * Fills an open or empty shift with your staff: each person gets their own staff shift linked to it, and the places still needed go down. `shiftMode` must match the shift (Open or Empty). Staff already on the shift, more staff than places left, or anyone on approved leave that day make the call fail with 409 and the reason in `data.message`. When someone is not assigned to the shift\'s area the call answers 409 with `data.isConflict` true; send it again with `isAssignAreaToStaff` true to add the area to their profile and assign them.  If the shift is an open shift, the agencies it was sent to are told how many places are still open, and the request is closed as filled when none are left; bookings they already made stand. The assignment stands even if that notice fails. Staff ids must belong to your organisation, or the call is refused with 403. `assignedBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Assign staff to an open or empty shift
     * @param {SchedulingAssignStaffToGeneratedShiftRequest} schedulingAssignStaffToGeneratedShiftRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingAssignStaffToGeneratedShiftRaw(requestParameters: SchedulingAssignStaffToGeneratedShiftOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingAssignStaffToGeneratedShift200Response>>;

    /**
     * Fills an open or empty shift with your staff: each person gets their own staff shift linked to it, and the places still needed go down. `shiftMode` must match the shift (Open or Empty). Staff already on the shift, more staff than places left, or anyone on approved leave that day make the call fail with 409 and the reason in `data.message`. When someone is not assigned to the shift\'s area the call answers 409 with `data.isConflict` true; send it again with `isAssignAreaToStaff` true to add the area to their profile and assign them.  If the shift is an open shift, the agencies it was sent to are told how many places are still open, and the request is closed as filled when none are left; bookings they already made stand. The assignment stands even if that notice fails. Staff ids must belong to your organisation, or the call is refused with 403. `assignedBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Assign staff to an open or empty shift
     */
    schedulingAssignStaffToGeneratedShift(requestParameters: SchedulingAssignStaffToGeneratedShiftOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingAssignStaffToGeneratedShift200Response>;

    /**
     * Creates Draft shifts in one area for several staff across several dates, with the times, break and shift type taken from a shift template. `assignmentMode` AllToAll gives every person a shift on every date; RoundRobin spreads the dates across the staff, one person per date. Staff not yet assigned to the area are assigned to it.  Shifts that conflict are still created and counted in `message`; check them with \"Check rostered shifts for conflicts\". A call that creates nothing answers 409. Ids must belong to your organisation, or the call is refused with 403. `createdBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Create shifts for several staff from a template
     * @param {SchedulingBulkAssignStaffShiftsRequest} schedulingBulkAssignStaffShiftsRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingBulkAssignStaffShiftsRaw(requestParameters: SchedulingBulkAssignStaffShiftsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingBulkAssignStaffShifts200Response>>;

    /**
     * Creates Draft shifts in one area for several staff across several dates, with the times, break and shift type taken from a shift template. `assignmentMode` AllToAll gives every person a shift on every date; RoundRobin spreads the dates across the staff, one person per date. Staff not yet assigned to the area are assigned to it.  Shifts that conflict are still created and counted in `message`; check them with \"Check rostered shifts for conflicts\". A call that creates nothing answers 409. Ids must belong to your organisation, or the call is refused with 403. `createdBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Create shifts for several staff from a template
     */
    schedulingBulkAssignStaffShifts(requestParameters: SchedulingBulkAssignStaffShiftsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingBulkAssignStaffShifts200Response>;

    /**
     * Creates a Draft shift for one person in one area on one date. With `shiftTemplateID` the times, break and shift type come from the template; without one, `startTime` and `endTime` are required. The person must already be assigned to the area. For an agency worker send `companyType` 2, the agency worker\'s id in `staffID` and the agency\'s id in `companyId`.  A date in the past, a person not assigned to the area or missing times answer 409 with the reason in `data.message`. Ids must belong to your organisation, or the call is refused with 403. `createdBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Create a shift for a staff member
     * @param {SchedulingCreateStaffRegularShiftRequest} schedulingCreateStaffRegularShiftRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingCreateStaffRegularShiftRaw(requestParameters: SchedulingCreateStaffRegularShiftOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingCreateStaffRegularShift200Response>>;

    /**
     * Creates a Draft shift for one person in one area on one date. With `shiftTemplateID` the times, break and shift type come from the template; without one, `startTime` and `endTime` are required. The person must already be assigned to the area. For an agency worker send `companyType` 2, the agency worker\'s id in `staffID` and the agency\'s id in `companyId`.  A date in the past, a person not assigned to the area or missing times answer 409 with the reason in `data.message`. Ids must belong to your organisation, or the call is refused with 403. `createdBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Create a shift for a staff member
     */
    schedulingCreateStaffRegularShift(requestParameters: SchedulingCreateStaffRegularShiftOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingCreateStaffRegularShift200Response>;

    /**
     * Deletes an open or empty shift, and the staff shifts that were filled from it. If it was an open shift that may have been sent to agencies, they are told it is cancelled and anyone they booked on it is released; the delete stands even if that notice fails.  `data` is true when the shift was deleted and false (still 200) when it was not found.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Delete an open or empty shift
     * @param {string} shiftId The open or empty shift id.
     * @param {string} tenantId Your organisation\&#39;s id. It must be the organisation your token was issued for; any other id is refused with 403.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingDeleteGeneratedShiftRaw(requestParameters: SchedulingDeleteGeneratedShiftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingDeleteGeneratedShift200Response>>;

    /**
     * Deletes an open or empty shift, and the staff shifts that were filled from it. If it was an open shift that may have been sent to agencies, they are told it is cancelled and anyone they booked on it is released; the delete stands even if that notice fails.  `data` is true when the shift was deleted and false (still 200) when it was not found.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Delete an open or empty shift
     */
    schedulingDeleteGeneratedShift(requestParameters: SchedulingDeleteGeneratedShiftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingDeleteGeneratedShift200Response>;

    /**
     * Deletes a staff shift. If the shift was an agency worker\'s placement on one of your open shifts, the agency is told the placement is removed and its booking is cancelled; the delete stands even if that notice fails.  `data` is true when the shift was deleted and false (still 200) when it was not found.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Delete a staff shift
     * @param {string} rosterShiftId The staff shift id.
     * @param {string} tenantId Your organisation\&#39;s id. It must be the organisation your token was issued for; any other id is refused with 403.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingDeleteRegularShiftRaw(requestParameters: SchedulingDeleteRegularShiftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingDeleteGeneratedShift200Response>>;

    /**
     * Deletes a staff shift. If the shift was an agency worker\'s placement on one of your open shifts, the agency is told the placement is removed and its booking is cancelled; the delete stands even if that notice fails.  `data` is true when the shift was deleted and false (still 200) when it was not found.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Delete a staff shift
     */
    schedulingDeleteRegularShift(requestParameters: SchedulingDeleteRegularShiftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingDeleteGeneratedShift200Response>;

    /**
     * Returns the roster grid for the locations and dates you ask for: each location, its areas, the open and empty shifts in each area, and everyone assigned to each area with a day-by-day view of their availability, leave and shifts. Agency workers placed in an area appear next to your own staff (companyType 2).  Only the locations listed in `locationIds` are returned, so an empty list returns nothing. The `roles` filter is accepted but not applied: every role is returned.  Staff email, mobile, gender and address need `staff.personal.read`, and shift `hourlyRate` needs `pay_conditions.read`; without them those fields are null. Times are each location\'s wall clock, named by `timeZone`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get the roster calendar for locations and dates
     * @param {SchedulingGetCalenderViewDataRequest} schedulingGetCalenderViewDataRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingGetCalenderViewDataRaw(requestParameters: SchedulingGetCalenderViewDataOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetCalenderViewData200Response>>;

    /**
     * Returns the roster grid for the locations and dates you ask for: each location, its areas, the open and empty shifts in each area, and everyone assigned to each area with a day-by-day view of their availability, leave and shifts. Agency workers placed in an area appear next to your own staff (companyType 2).  Only the locations listed in `locationIds` are returned, so an empty list returns nothing. The `roles` filter is accepted but not applied: every role is returned.  Staff email, mobile, gender and address need `staff.personal.read`, and shift `hourlyRate` needs `pay_conditions.read`; without them those fields are null. Times are each location\'s wall clock, named by `timeZone`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get the roster calendar for locations and dates
     */
    schedulingGetCalenderViewData(requestParameters: SchedulingGetCalenderViewDataOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetCalenderViewData200Response>;

    /**
     * Returns one open shift (offered to staff and agencies) or empty shift (a placeholder) with its requirements, how many qualified staff could fill it and whether it can be sent to agencies. `shiftMode` must match the shift: Open or Empty. A shift that does not exist, or belongs to another organisation, answers 404 with `data` null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one open or empty shift
     * @param {SchedulingGetGeneratedShiftDetailByIdRequest} schedulingGetGeneratedShiftDetailByIdRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingGetGeneratedShiftDetailByIdRaw(requestParameters: SchedulingGetGeneratedShiftDetailByIdOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetGeneratedShiftDetailById200Response>>;

    /**
     * Returns one open shift (offered to staff and agencies) or empty shift (a placeholder) with its requirements, how many qualified staff could fill it and whether it can be sent to agencies. `shiftMode` must match the shift: Open or Empty. A shift that does not exist, or belongs to another organisation, answers 404 with `data` null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get one open or empty shift
     */
    schedulingGetGeneratedShiftDetailById(requestParameters: SchedulingGetGeneratedShiftDetailByIdOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetGeneratedShiftDetailById200Response>;

    /**
     * Returns your organisation\'s holidays and events in one month, as the roster calendar shows them: events (with any leave restrictions they carry) and holidays (with whether the business operates and whether public holiday rates apply). Narrow it to one location with `tblTenantLocationId`.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary List holidays and events for a month
     * @param {SchedulingGetHolidayEventsCalendarRequest} schedulingGetHolidayEventsCalendarRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingGetHolidayEventsCalendarRaw(requestParameters: SchedulingGetHolidayEventsCalendarOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetHolidayEventsCalendar200Response>>;

    /**
     * Returns your organisation\'s holidays and events in one month, as the roster calendar shows them: events (with any leave restrictions they carry) and holidays (with whether the business operates and whether public holiday rates apply). Narrow it to one location with `tblTenantLocationId`.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List holidays and events for a month
     */
    schedulingGetHolidayEventsCalendar(requestParameters: SchedulingGetHolidayEventsCalendarOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetHolidayEventsCalendar200Response>;

    /**
     * Returns the recurring series at one location: each is a pattern applied to one staff member (or to agencies), with its next shift date, the dates it runs between, how many shifts it has produced and whether it has expired or expires soon. Narrow it to some areas with `tblTenantAreaIds`; unknown area ids are ignored.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary List recurring shift series for a location
     * @param {SchedulingGetRecurringSeriesRequest} schedulingGetRecurringSeriesRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingGetRecurringSeriesRaw(requestParameters: SchedulingGetRecurringSeriesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetRecurringSeries200Response>>;

    /**
     * Returns the recurring series at one location: each is a pattern applied to one staff member (or to agencies), with its next shift date, the dates it runs between, how many shifts it has produced and whether it has expired or expires soon. Narrow it to some areas with `tblTenantAreaIds`; unknown area ids are ignored.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List recurring shift series for a location
     */
    schedulingGetRecurringSeries(requestParameters: SchedulingGetRecurringSeriesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetRecurringSeries200Response>;

    /**
     * Returns one recurring shift pattern in the shape it is saved with, including its agency terms when the pattern is filled by agencies. A pattern that is not found answers 409 (not 404) with `data` null.  `maxPayRate` and `maxChargeRate` need `pay_conditions.read`; without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one recurring shift pattern
     * @param {string} patternId The pattern id.
     * @param {string} tenantId Your organisation\&#39;s id. It must be the organisation your token was issued for; any other id is refused with 403.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingGetRecurringShiftPatternByIdRaw(requestParameters: SchedulingGetRecurringShiftPatternByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetRecurringShiftPatternById200Response>>;

    /**
     * Returns one recurring shift pattern in the shape it is saved with, including its agency terms when the pattern is filled by agencies. A pattern that is not found answers 409 (not 404) with `data` null.  `maxPayRate` and `maxChargeRate` need `pay_conditions.read`; without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get one recurring shift pattern
     */
    schedulingGetRecurringShiftPatternById(requestParameters: SchedulingGetRecurringShiftPatternByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetRecurringShiftPatternById200Response>;

    /**
     * Returns the recurring shift patterns at one location (for example \"Weekday mornings, Memory Support Wing\") with a summary of how many are active and roughly how many shifts they produce a month. Narrow it to some areas with `tblTenantAreaIds`; unknown area ids are ignored.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary List recurring shift patterns for a location
     * @param {SchedulingGetRecurringShiftPatternsRequest} schedulingGetRecurringShiftPatternsRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingGetRecurringShiftPatternsRaw(requestParameters: SchedulingGetRecurringShiftPatternsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetRecurringShiftPatterns200Response>>;

    /**
     * Returns the recurring shift patterns at one location (for example \"Weekday mornings, Memory Support Wing\") with a summary of how many are active and roughly how many shifts they produce a month. Narrow it to some areas with `tblTenantAreaIds`; unknown area ids are ignored.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List recurring shift patterns for a location
     */
    schedulingGetRecurringShiftPatterns(requestParameters: SchedulingGetRecurringShiftPatternsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetRecurringShiftPatterns200Response>;

    /**
     * The same lookup and answer as \"Get one staff shift\", addressed by `rosterShiftId` and `tblTenantId`. A shift id that does not exist in your organisation is a 404.  `hourlyRate` and `totalCost` need `pay_conditions.read`; without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get a staff shift\'s details
     * @param {SchedulingGetRegularShiftDetailsRequest} schedulingGetRegularShiftDetailsRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingGetRegularShiftDetailsRaw(requestParameters: SchedulingGetRegularShiftDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetShiftDetailsById200Response>>;

    /**
     * The same lookup and answer as \"Get one staff shift\", addressed by `rosterShiftId` and `tblTenantId`. A shift id that does not exist in your organisation is a 404.  `hourlyRate` and `totalCost` need `pay_conditions.read`; without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff shift\'s details
     */
    schedulingGetRegularShiftDetails(requestParameters: SchedulingGetRegularShiftDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetShiftDetailsById200Response>;

    /**
     * Returns the change history for a date range across all your locations, oldest first: each entry says what changed (Add, Delete, Update, Move, Resize, Bulk or Copy), when and by whom, and which entry the roster is currently at. The first call for a date range starts the history with an \"Initial state\" entry.  `tblTenantId` must be your organisation, or the call is refused with 403. This response also carries `status`, the HTTP status code.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get the roster change history
     * @param {SchedulingGetRosterHistoryRequest} schedulingGetRosterHistoryRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingGetRosterHistoryRaw(requestParameters: SchedulingGetRosterHistoryOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetRosterHistory200Response>>;

    /**
     * Returns the change history for a date range across all your locations, oldest first: each entry says what changed (Add, Delete, Update, Move, Resize, Bulk or Copy), when and by whom, and which entry the roster is currently at. The first call for a date range starts the history with an \"Initial state\" entry.  `tblTenantId` must be your organisation, or the call is refused with 403. This response also carries `status`, the HTTP status code.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get the roster change history
     */
    schedulingGetRosterHistory(requestParameters: SchedulingGetRosterHistoryOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetRosterHistory200Response>;

    /**
     * Returns the saved roster templates at one location: each template\'s id, name, length (Day, WorkWeek, Week, Fortnight or Month) and how many shifts it holds. It does not return the shifts themselves.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary List roster templates for a location
     * @param {string} tenantId Your organisation\&#39;s id. It must be the organisation your token was issued for; any other id is refused with 403.
     * @param {string} locationId The location.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingGetRosterTemplatesRaw(requestParameters: SchedulingGetRosterTemplatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetRosterTemplates200Response>>;

    /**
     * Returns the saved roster templates at one location: each template\'s id, name, length (Day, WorkWeek, Week, Fortnight or Month) and how many shifts it holds. It does not return the shifts themselves.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List roster templates for a location
     */
    schedulingGetRosterTemplates(requestParameters: SchedulingGetRosterTemplatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetRosterTemplates200Response>;

    /**
     * Checks every staff shift at the chosen locations and dates for conflicts: no availability, approved leave or unavailability, overlapping shifts, hours outside availability, too many weekly hours, too little rest, too many days in a row, a missing qualification and a staff ratio breach. Must-fix conflicts come back in `errors` and stop the roster being published; warnings come back in `warnings`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Check rostered shifts for conflicts
     * @param {SchedulingGetShiftConflictsRequest} schedulingGetShiftConflictsRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingGetShiftConflictsRaw(requestParameters: SchedulingGetShiftConflictsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetShiftConflicts200Response>>;

    /**
     * Checks every staff shift at the chosen locations and dates for conflicts: no availability, approved leave or unavailability, overlapping shifts, hours outside availability, too many weekly hours, too little rest, too many days in a row, a missing qualification and a staff ratio breach. Must-fix conflicts come back in `errors` and stop the roster being published; warnings come back in `warnings`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Check rostered shifts for conflicts
     */
    schedulingGetShiftConflicts(requestParameters: SchedulingGetShiftConflictsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetShiftConflicts200Response>;

    /**
     * Returns one staff shift (a shift worked by one person, your own staff member or an agency worker) with its area, times, status, cost and who works it. For an open or empty shift use \"Get one open or empty shift\" instead. A shift id that does not exist in your organisation is a 404.  `hourlyRate` and `totalCost` need `pay_conditions.read`; without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one staff shift
     * @param {SchedulingGetShiftDetailsByIdRequest} schedulingGetShiftDetailsByIdRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingGetShiftDetailsByIdRaw(requestParameters: SchedulingGetShiftDetailsByIdOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetShiftDetailsById200Response>>;

    /**
     * Returns one staff shift (a shift worked by one person, your own staff member or an agency worker) with its area, times, status, cost and who works it. For an open or empty shift use \"Get one open or empty shift\" instead. A shift id that does not exist in your organisation is a 404.  `hourlyRate` and `totalCost` need `pay_conditions.read`; without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get one staff shift
     */
    schedulingGetShiftDetailsById(requestParameters: SchedulingGetShiftDetailsByIdOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetShiftDetailsById200Response>;

    /**
     * Returns the active shift templates at one location, each with its times, break, shift type and pay detail (on-call, sleepover and broken-shift settings). Without `locationId` the list is empty.  Rates, multipliers and `standbyRateType` in `shiftTypeDetail` need `pay_conditions.read` (`pay_conditions.write` alone does not unlock them); without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary List shift templates
     * @param {SchedulingGetShiftTemplateListWithDetailsRequest} schedulingGetShiftTemplateListWithDetailsRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingGetShiftTemplateListWithDetailsRaw(requestParameters: SchedulingGetShiftTemplateListWithDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetShiftTemplateListWithDetails200Response>>;

    /**
     * Returns the active shift templates at one location, each with its times, break, shift type and pay detail (on-call, sleepover and broken-shift settings). Without `locationId` the list is empty.  Rates, multipliers and `standbyRateType` in `shiftTypeDetail` need `pay_conditions.read` (`pay_conditions.write` alone does not unlock them); without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List shift templates
     */
    schedulingGetShiftTemplateListWithDetails(requestParameters: SchedulingGetShiftTemplateListWithDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetShiftTemplateListWithDetails200Response>;

    /**
     * Returns one row per staff member with a cell for each date in the range: whether they are available, their available hours and breaks, and any leave or unavailability. Narrow it to one location with `locationId` or one role with `roleId`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get staff availability for a date range
     * @param {SchedulingGetStaffAvailabilityWeekViewRequest} schedulingGetStaffAvailabilityWeekViewRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingGetStaffAvailabilityWeekViewRaw(requestParameters: SchedulingGetStaffAvailabilityWeekViewOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetStaffAvailabilityWeekView200Response>>;

    /**
     * Returns one row per staff member with a cell for each date in the range: whether they are available, their available hours and breaks, and any leave or unavailability. Narrow it to one location with `locationId` or one role with `roleId`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get staff availability for a date range
     */
    schedulingGetStaffAvailabilityWeekView(requestParameters: SchedulingGetStaffAvailabilityWeekViewOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetStaffAvailabilityWeekView200Response>;

    /**
     * Publishes the staff shifts at the chosen locations and dates, optionally only for staff holding one of `roles`. Shifts already Confirmed, Completed or Cancelled keep their status. Nothing is published if any of the locations has a must-fix conflict: the call still answers 200, with `data.success` false and the conflicts in `message`. With no matching shifts it answers 200 with `data.shiftsFound` false.  **Required scope:** `rosters.publish`  See **Responses** below for the status codes this operation can return.
     * @summary Publish the roster
     * @param {SchedulingPublishRegularShiftsRequest} schedulingPublishRegularShiftsRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingPublishRegularShiftsRaw(requestParameters: SchedulingPublishRegularShiftsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingPublishRegularShifts200Response>>;

    /**
     * Publishes the staff shifts at the chosen locations and dates, optionally only for staff holding one of `roles`. Shifts already Confirmed, Completed or Cancelled keep their status. Nothing is published if any of the locations has a must-fix conflict: the call still answers 200, with `data.success` false and the conflicts in `message`. With no matching shifts it answers 200 with `data.shiftsFound` false.  **Required scope:** `rosters.publish`  See **Responses** below for the status codes this operation can return.
     * Publish the roster
     */
    schedulingPublishRegularShifts(requestParameters: SchedulingPublishRegularShiftsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingPublishRegularShifts200Response>;

    /**
     * Creates open shifts (offered to staff and to the agencies that supply the location) or empty shifts (placeholders that are never offered), or edits one. Leave `shiftID` out to create: one shift is made for every area in `areaIDs` on every date in `shiftDates`. Send `shiftID` to edit that shift; `areaIDs` and `shiftDates` are then ignored. Changing a shift from Open to Empty withdraws it from agencies.  The location, areas and any staff ids must belong to your organisation, or the call is refused with 403. A shift that cannot be saved answers 409. `createdBy` and `updatedBy` are ignored.  Editing a shift that does not exist, was deleted or belongs to another organisation answers 404 with `data` null.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Create or edit open and empty shifts
     * @param {SchedulingSaveGeneratedShiftsRequest} schedulingSaveGeneratedShiftsRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingSaveGeneratedShiftsRaw(requestParameters: SchedulingSaveGeneratedShiftsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingSaveGeneratedShifts200Response>>;

    /**
     * Creates open shifts (offered to staff and to the agencies that supply the location) or empty shifts (placeholders that are never offered), or edits one. Leave `shiftID` out to create: one shift is made for every area in `areaIDs` on every date in `shiftDates`. Send `shiftID` to edit that shift; `areaIDs` and `shiftDates` are then ignored. Changing a shift from Open to Empty withdraws it from agencies.  The location, areas and any staff ids must belong to your organisation, or the call is refused with 403. A shift that cannot be saved answers 409. `createdBy` and `updatedBy` are ignored.  Editing a shift that does not exist, was deleted or belongs to another organisation answers 404 with `data` null.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Create or edit open and empty shifts
     */
    schedulingSaveGeneratedShifts(requestParameters: SchedulingSaveGeneratedShiftsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingSaveGeneratedShifts200Response>;

    /**
     * Creates a recurring shift pattern, or edits one when `patternId` is sent. A pattern is filled either by your staff (`assignedStaffIds`) or by agencies (`agencyAssignment`), never both. Saving a pattern does not create shifts by itself.  The end time must be after the start time, the role must be one of your active roles, the area must be in the location, and assigned staff must be active and assigned to that location and area. A pattern that fails these checks answers 409 with the reason in `message`. `requestedBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Create or edit a recurring shift pattern
     * @param {SchedulingSaveRecurringShiftPatternsRequest} schedulingSaveRecurringShiftPatternsRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingSaveRecurringShiftPatternsRaw(requestParameters: SchedulingSaveRecurringShiftPatternsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingSaveRecurringShiftPatterns200Response>>;

    /**
     * Creates a recurring shift pattern, or edits one when `patternId` is sent. A pattern is filled either by your staff (`assignedStaffIds`) or by agencies (`agencyAssignment`), never both. Saving a pattern does not create shifts by itself.  The end time must be after the start time, the role must be one of your active roles, the area must be in the location, and assigned staff must be active and assigned to that location and area. A pattern that fails these checks answers 409 with the reason in `message`. `requestedBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Create or edit a recurring shift pattern
     */
    schedulingSaveRecurringShiftPatterns(requestParameters: SchedulingSaveRecurringShiftPatternsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingSaveRecurringShiftPatterns200Response>;

    /**
     * Replaces a staff shift\'s person, area, date, times, break and notes with the values sent; use it to move, resize or reassign a shift. Send the person\'s `companyType` (and `companyId` for an agency worker) every time. `shiftTypeID` is kept when left out. Editing a shift usually turns `shiftStatus` into Draft, because the edit invalidates its publication, so publish it again afterwards. Left out, the status becomes Draft. Sent as the current status, it is kept only if nothing else changes, and otherwise becomes Draft. Draft and Cancelled are always applied. Published, Confirmed or Completed apply only when the shift is already one of those and nothing else changes; otherwise the status becomes Draft. Read `shiftStatus` back rather than assuming what you sent was stored.  A shift that is not found, an invalid status or a duplicate of another shift answers 409 with the reason in `data.message`. Ids must belong to your organisation, or the call is refused with 403. `updatedBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * @summary Update a staff shift
     * @param {SchedulingUpdateStaffRegularShiftRequest} schedulingUpdateStaffRegularShiftRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RostersApiInterface
     */
    schedulingUpdateStaffRegularShiftRaw(requestParameters: SchedulingUpdateStaffRegularShiftOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingCreateStaffRegularShift200Response>>;

    /**
     * Replaces a staff shift\'s person, area, date, times, break and notes with the values sent; use it to move, resize or reassign a shift. Send the person\'s `companyType` (and `companyId` for an agency worker) every time. `shiftTypeID` is kept when left out. Editing a shift usually turns `shiftStatus` into Draft, because the edit invalidates its publication, so publish it again afterwards. Left out, the status becomes Draft. Sent as the current status, it is kept only if nothing else changes, and otherwise becomes Draft. Draft and Cancelled are always applied. Published, Confirmed or Completed apply only when the shift is already one of those and nothing else changes; otherwise the status becomes Draft. Read `shiftStatus` back rather than assuming what you sent was stored.  A shift that is not found, an invalid status or a duplicate of another shift answers 409 with the reason in `data.message`. Ids must belong to your organisation, or the call is refused with 403. `updatedBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Update a staff shift
     */
    schedulingUpdateStaffRegularShift(requestParameters: SchedulingUpdateStaffRegularShiftOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingCreateStaffRegularShift200Response>;

}

/**
 * 
 */
export class RostersApi extends runtime.BaseAPI implements RostersApiInterface {

    /**
     * Fills an open or empty shift with your staff: each person gets their own staff shift linked to it, and the places still needed go down. `shiftMode` must match the shift (Open or Empty). Staff already on the shift, more staff than places left, or anyone on approved leave that day make the call fail with 409 and the reason in `data.message`. When someone is not assigned to the shift\'s area the call answers 409 with `data.isConflict` true; send it again with `isAssignAreaToStaff` true to add the area to their profile and assign them.  If the shift is an open shift, the agencies it was sent to are told how many places are still open, and the request is closed as filled when none are left; bookings they already made stand. The assignment stands even if that notice fails. Staff ids must belong to your organisation, or the call is refused with 403. `assignedBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Assign staff to an open or empty shift
     */
    async schedulingAssignStaffToGeneratedShiftRaw(requestParameters: SchedulingAssignStaffToGeneratedShiftOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingAssignStaffToGeneratedShift200Response>> {
        if (requestParameters['schedulingAssignStaffToGeneratedShiftRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingAssignStaffToGeneratedShiftRequest',
                'Required parameter "schedulingAssignStaffToGeneratedShiftRequest" was null or undefined when calling schedulingAssignStaffToGeneratedShift().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["rosters.write"]);
        }


        let urlPath = `/scheduling/api/StaffAssignment/assign-staff-to-generated-shift`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingAssignStaffToGeneratedShiftRequestToJSON(requestParameters['schedulingAssignStaffToGeneratedShiftRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingAssignStaffToGeneratedShift200ResponseFromJSON(jsonValue));
    }

    /**
     * Fills an open or empty shift with your staff: each person gets their own staff shift linked to it, and the places still needed go down. `shiftMode` must match the shift (Open or Empty). Staff already on the shift, more staff than places left, or anyone on approved leave that day make the call fail with 409 and the reason in `data.message`. When someone is not assigned to the shift\'s area the call answers 409 with `data.isConflict` true; send it again with `isAssignAreaToStaff` true to add the area to their profile and assign them.  If the shift is an open shift, the agencies it was sent to are told how many places are still open, and the request is closed as filled when none are left; bookings they already made stand. The assignment stands even if that notice fails. Staff ids must belong to your organisation, or the call is refused with 403. `assignedBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Assign staff to an open or empty shift
     */
    async schedulingAssignStaffToGeneratedShift(requestParameters: SchedulingAssignStaffToGeneratedShiftOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingAssignStaffToGeneratedShift200Response> {
        const response = await this.schedulingAssignStaffToGeneratedShiftRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates Draft shifts in one area for several staff across several dates, with the times, break and shift type taken from a shift template. `assignmentMode` AllToAll gives every person a shift on every date; RoundRobin spreads the dates across the staff, one person per date. Staff not yet assigned to the area are assigned to it.  Shifts that conflict are still created and counted in `message`; check them with \"Check rostered shifts for conflicts\". A call that creates nothing answers 409. Ids must belong to your organisation, or the call is refused with 403. `createdBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Create shifts for several staff from a template
     */
    async schedulingBulkAssignStaffShiftsRaw(requestParameters: SchedulingBulkAssignStaffShiftsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingBulkAssignStaffShifts200Response>> {
        if (requestParameters['schedulingBulkAssignStaffShiftsRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingBulkAssignStaffShiftsRequest',
                'Required parameter "schedulingBulkAssignStaffShiftsRequest" was null or undefined when calling schedulingBulkAssignStaffShifts().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["rosters.write"]);
        }


        let urlPath = `/scheduling/api/StaffAssignment/bulk-assign-staff-shifts`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingBulkAssignStaffShiftsRequestToJSON(requestParameters['schedulingBulkAssignStaffShiftsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingBulkAssignStaffShifts200ResponseFromJSON(jsonValue));
    }

    /**
     * Creates Draft shifts in one area for several staff across several dates, with the times, break and shift type taken from a shift template. `assignmentMode` AllToAll gives every person a shift on every date; RoundRobin spreads the dates across the staff, one person per date. Staff not yet assigned to the area are assigned to it.  Shifts that conflict are still created and counted in `message`; check them with \"Check rostered shifts for conflicts\". A call that creates nothing answers 409. Ids must belong to your organisation, or the call is refused with 403. `createdBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Create shifts for several staff from a template
     */
    async schedulingBulkAssignStaffShifts(requestParameters: SchedulingBulkAssignStaffShiftsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingBulkAssignStaffShifts200Response> {
        const response = await this.schedulingBulkAssignStaffShiftsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates a Draft shift for one person in one area on one date. With `shiftTemplateID` the times, break and shift type come from the template; without one, `startTime` and `endTime` are required. The person must already be assigned to the area. For an agency worker send `companyType` 2, the agency worker\'s id in `staffID` and the agency\'s id in `companyId`.  A date in the past, a person not assigned to the area or missing times answer 409 with the reason in `data.message`. Ids must belong to your organisation, or the call is refused with 403. `createdBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Create a shift for a staff member
     */
    async schedulingCreateStaffRegularShiftRaw(requestParameters: SchedulingCreateStaffRegularShiftOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingCreateStaffRegularShift200Response>> {
        if (requestParameters['schedulingCreateStaffRegularShiftRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingCreateStaffRegularShiftRequest',
                'Required parameter "schedulingCreateStaffRegularShiftRequest" was null or undefined when calling schedulingCreateStaffRegularShift().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["rosters.write"]);
        }


        let urlPath = `/scheduling/api/StaffAssignment/create-staff-regular-shift`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingCreateStaffRegularShiftRequestToJSON(requestParameters['schedulingCreateStaffRegularShiftRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingCreateStaffRegularShift200ResponseFromJSON(jsonValue));
    }

    /**
     * Creates a Draft shift for one person in one area on one date. With `shiftTemplateID` the times, break and shift type come from the template; without one, `startTime` and `endTime` are required. The person must already be assigned to the area. For an agency worker send `companyType` 2, the agency worker\'s id in `staffID` and the agency\'s id in `companyId`.  A date in the past, a person not assigned to the area or missing times answer 409 with the reason in `data.message`. Ids must belong to your organisation, or the call is refused with 403. `createdBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Create a shift for a staff member
     */
    async schedulingCreateStaffRegularShift(requestParameters: SchedulingCreateStaffRegularShiftOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingCreateStaffRegularShift200Response> {
        const response = await this.schedulingCreateStaffRegularShiftRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Deletes an open or empty shift, and the staff shifts that were filled from it. If it was an open shift that may have been sent to agencies, they are told it is cancelled and anyone they booked on it is released; the delete stands even if that notice fails.  `data` is true when the shift was deleted and false (still 200) when it was not found.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Delete an open or empty shift
     */
    async schedulingDeleteGeneratedShiftRaw(requestParameters: SchedulingDeleteGeneratedShiftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingDeleteGeneratedShift200Response>> {
        if (requestParameters['shiftId'] == null) {
            throw new runtime.RequiredError(
                'shiftId',
                'Required parameter "shiftId" was null or undefined when calling schedulingDeleteGeneratedShift().'
            );
        }

        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling schedulingDeleteGeneratedShift().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['shiftId'] != null) {
            queryParameters['shiftId'] = requestParameters['shiftId'];
        }

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["rosters.write"]);
        }


        let urlPath = `/scheduling/api/ShiftManagement/delete-generated-shift`;

        const response = await this.request({
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingDeleteGeneratedShift200ResponseFromJSON(jsonValue));
    }

    /**
     * Deletes an open or empty shift, and the staff shifts that were filled from it. If it was an open shift that may have been sent to agencies, they are told it is cancelled and anyone they booked on it is released; the delete stands even if that notice fails.  `data` is true when the shift was deleted and false (still 200) when it was not found.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Delete an open or empty shift
     */
    async schedulingDeleteGeneratedShift(requestParameters: SchedulingDeleteGeneratedShiftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingDeleteGeneratedShift200Response> {
        const response = await this.schedulingDeleteGeneratedShiftRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Deletes a staff shift. If the shift was an agency worker\'s placement on one of your open shifts, the agency is told the placement is removed and its booking is cancelled; the delete stands even if that notice fails.  `data` is true when the shift was deleted and false (still 200) when it was not found.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Delete a staff shift
     */
    async schedulingDeleteRegularShiftRaw(requestParameters: SchedulingDeleteRegularShiftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingDeleteGeneratedShift200Response>> {
        if (requestParameters['rosterShiftId'] == null) {
            throw new runtime.RequiredError(
                'rosterShiftId',
                'Required parameter "rosterShiftId" was null or undefined when calling schedulingDeleteRegularShift().'
            );
        }

        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling schedulingDeleteRegularShift().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['rosterShiftId'] != null) {
            queryParameters['rosterShiftId'] = requestParameters['rosterShiftId'];
        }

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["rosters.write"]);
        }


        let urlPath = `/scheduling/api/StaffAssignment/delete-regular-shift`;

        const response = await this.request({
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingDeleteGeneratedShift200ResponseFromJSON(jsonValue));
    }

    /**
     * Deletes a staff shift. If the shift was an agency worker\'s placement on one of your open shifts, the agency is told the placement is removed and its booking is cancelled; the delete stands even if that notice fails.  `data` is true when the shift was deleted and false (still 200) when it was not found.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Delete a staff shift
     */
    async schedulingDeleteRegularShift(requestParameters: SchedulingDeleteRegularShiftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingDeleteGeneratedShift200Response> {
        const response = await this.schedulingDeleteRegularShiftRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the roster grid for the locations and dates you ask for: each location, its areas, the open and empty shifts in each area, and everyone assigned to each area with a day-by-day view of their availability, leave and shifts. Agency workers placed in an area appear next to your own staff (companyType 2).  Only the locations listed in `locationIds` are returned, so an empty list returns nothing. The `roles` filter is accepted but not applied: every role is returned.  Staff email, mobile, gender and address need `staff.personal.read`, and shift `hourlyRate` needs `pay_conditions.read`; without them those fields are null. Times are each location\'s wall clock, named by `timeZone`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get the roster calendar for locations and dates
     */
    async schedulingGetCalenderViewDataRaw(requestParameters: SchedulingGetCalenderViewDataOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetCalenderViewData200Response>> {
        if (requestParameters['schedulingGetCalenderViewDataRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingGetCalenderViewDataRequest',
                'Required parameter "schedulingGetCalenderViewDataRequest" was null or undefined when calling schedulingGetCalenderViewData().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/CalenderView/get-calender-view-data`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingGetCalenderViewDataRequestToJSON(requestParameters['schedulingGetCalenderViewDataRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetCalenderViewData200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the roster grid for the locations and dates you ask for: each location, its areas, the open and empty shifts in each area, and everyone assigned to each area with a day-by-day view of their availability, leave and shifts. Agency workers placed in an area appear next to your own staff (companyType 2).  Only the locations listed in `locationIds` are returned, so an empty list returns nothing. The `roles` filter is accepted but not applied: every role is returned.  Staff email, mobile, gender and address need `staff.personal.read`, and shift `hourlyRate` needs `pay_conditions.read`; without them those fields are null. Times are each location\'s wall clock, named by `timeZone`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get the roster calendar for locations and dates
     */
    async schedulingGetCalenderViewData(requestParameters: SchedulingGetCalenderViewDataOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetCalenderViewData200Response> {
        const response = await this.schedulingGetCalenderViewDataRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one open shift (offered to staff and agencies) or empty shift (a placeholder) with its requirements, how many qualified staff could fill it and whether it can be sent to agencies. `shiftMode` must match the shift: Open or Empty. A shift that does not exist, or belongs to another organisation, answers 404 with `data` null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get one open or empty shift
     */
    async schedulingGetGeneratedShiftDetailByIdRaw(requestParameters: SchedulingGetGeneratedShiftDetailByIdOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetGeneratedShiftDetailById200Response>> {
        if (requestParameters['schedulingGetGeneratedShiftDetailByIdRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingGetGeneratedShiftDetailByIdRequest',
                'Required parameter "schedulingGetGeneratedShiftDetailByIdRequest" was null or undefined when calling schedulingGetGeneratedShiftDetailById().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/ShiftManagement/get-generated-shift-detail-by-id`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingGetGeneratedShiftDetailByIdRequestToJSON(requestParameters['schedulingGetGeneratedShiftDetailByIdRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetGeneratedShiftDetailById200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one open shift (offered to staff and agencies) or empty shift (a placeholder) with its requirements, how many qualified staff could fill it and whether it can be sent to agencies. `shiftMode` must match the shift: Open or Empty. A shift that does not exist, or belongs to another organisation, answers 404 with `data` null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get one open or empty shift
     */
    async schedulingGetGeneratedShiftDetailById(requestParameters: SchedulingGetGeneratedShiftDetailByIdOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetGeneratedShiftDetailById200Response> {
        const response = await this.schedulingGetGeneratedShiftDetailByIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns your organisation\'s holidays and events in one month, as the roster calendar shows them: events (with any leave restrictions they carry) and holidays (with whether the business operates and whether public holiday rates apply). Narrow it to one location with `tblTenantLocationId`.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List holidays and events for a month
     */
    async schedulingGetHolidayEventsCalendarRaw(requestParameters: SchedulingGetHolidayEventsCalendarOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetHolidayEventsCalendar200Response>> {
        if (requestParameters['schedulingGetHolidayEventsCalendarRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingGetHolidayEventsCalendarRequest',
                'Required parameter "schedulingGetHolidayEventsCalendarRequest" was null or undefined when calling schedulingGetHolidayEventsCalendar().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/CalenderView/get-holiday-events-calendar`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingGetHolidayEventsCalendarRequestToJSON(requestParameters['schedulingGetHolidayEventsCalendarRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetHolidayEventsCalendar200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns your organisation\'s holidays and events in one month, as the roster calendar shows them: events (with any leave restrictions they carry) and holidays (with whether the business operates and whether public holiday rates apply). Narrow it to one location with `tblTenantLocationId`.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List holidays and events for a month
     */
    async schedulingGetHolidayEventsCalendar(requestParameters: SchedulingGetHolidayEventsCalendarOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetHolidayEventsCalendar200Response> {
        const response = await this.schedulingGetHolidayEventsCalendarRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the recurring series at one location: each is a pattern applied to one staff member (or to agencies), with its next shift date, the dates it runs between, how many shifts it has produced and whether it has expired or expires soon. Narrow it to some areas with `tblTenantAreaIds`; unknown area ids are ignored.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List recurring shift series for a location
     */
    async schedulingGetRecurringSeriesRaw(requestParameters: SchedulingGetRecurringSeriesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetRecurringSeries200Response>> {
        if (requestParameters['schedulingGetRecurringSeriesRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingGetRecurringSeriesRequest',
                'Required parameter "schedulingGetRecurringSeriesRequest" was null or undefined when calling schedulingGetRecurringSeries().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/ShiftManagement/get-recurring-series`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingGetRecurringSeriesRequestToJSON(requestParameters['schedulingGetRecurringSeriesRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetRecurringSeries200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the recurring series at one location: each is a pattern applied to one staff member (or to agencies), with its next shift date, the dates it runs between, how many shifts it has produced and whether it has expired or expires soon. Narrow it to some areas with `tblTenantAreaIds`; unknown area ids are ignored.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List recurring shift series for a location
     */
    async schedulingGetRecurringSeries(requestParameters: SchedulingGetRecurringSeriesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetRecurringSeries200Response> {
        const response = await this.schedulingGetRecurringSeriesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one recurring shift pattern in the shape it is saved with, including its agency terms when the pattern is filled by agencies. A pattern that is not found answers 409 (not 404) with `data` null.  `maxPayRate` and `maxChargeRate` need `pay_conditions.read`; without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get one recurring shift pattern
     */
    async schedulingGetRecurringShiftPatternByIdRaw(requestParameters: SchedulingGetRecurringShiftPatternByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetRecurringShiftPatternById200Response>> {
        if (requestParameters['patternId'] == null) {
            throw new runtime.RequiredError(
                'patternId',
                'Required parameter "patternId" was null or undefined when calling schedulingGetRecurringShiftPatternById().'
            );
        }

        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling schedulingGetRecurringShiftPatternById().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['patternId'] != null) {
            queryParameters['patternId'] = requestParameters['patternId'];
        }

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/ShiftManagement/get-recurring-shift-pattern-by-id`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetRecurringShiftPatternById200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one recurring shift pattern in the shape it is saved with, including its agency terms when the pattern is filled by agencies. A pattern that is not found answers 409 (not 404) with `data` null.  `maxPayRate` and `maxChargeRate` need `pay_conditions.read`; without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get one recurring shift pattern
     */
    async schedulingGetRecurringShiftPatternById(requestParameters: SchedulingGetRecurringShiftPatternByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetRecurringShiftPatternById200Response> {
        const response = await this.schedulingGetRecurringShiftPatternByIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the recurring shift patterns at one location (for example \"Weekday mornings, Memory Support Wing\") with a summary of how many are active and roughly how many shifts they produce a month. Narrow it to some areas with `tblTenantAreaIds`; unknown area ids are ignored.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List recurring shift patterns for a location
     */
    async schedulingGetRecurringShiftPatternsRaw(requestParameters: SchedulingGetRecurringShiftPatternsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetRecurringShiftPatterns200Response>> {
        if (requestParameters['schedulingGetRecurringShiftPatternsRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingGetRecurringShiftPatternsRequest',
                'Required parameter "schedulingGetRecurringShiftPatternsRequest" was null or undefined when calling schedulingGetRecurringShiftPatterns().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/ShiftManagement/get-recurring-shift-patterns`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingGetRecurringShiftPatternsRequestToJSON(requestParameters['schedulingGetRecurringShiftPatternsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetRecurringShiftPatterns200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the recurring shift patterns at one location (for example \"Weekday mornings, Memory Support Wing\") with a summary of how many are active and roughly how many shifts they produce a month. Narrow it to some areas with `tblTenantAreaIds`; unknown area ids are ignored.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List recurring shift patterns for a location
     */
    async schedulingGetRecurringShiftPatterns(requestParameters: SchedulingGetRecurringShiftPatternsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetRecurringShiftPatterns200Response> {
        const response = await this.schedulingGetRecurringShiftPatternsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * The same lookup and answer as \"Get one staff shift\", addressed by `rosterShiftId` and `tblTenantId`. A shift id that does not exist in your organisation is a 404.  `hourlyRate` and `totalCost` need `pay_conditions.read`; without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff shift\'s details
     */
    async schedulingGetRegularShiftDetailsRaw(requestParameters: SchedulingGetRegularShiftDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetShiftDetailsById200Response>> {
        if (requestParameters['schedulingGetRegularShiftDetailsRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingGetRegularShiftDetailsRequest',
                'Required parameter "schedulingGetRegularShiftDetailsRequest" was null or undefined when calling schedulingGetRegularShiftDetails().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/ShiftManagement/get-regular-shift-details`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingGetRegularShiftDetailsRequestToJSON(requestParameters['schedulingGetRegularShiftDetailsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetShiftDetailsById200ResponseFromJSON(jsonValue));
    }

    /**
     * The same lookup and answer as \"Get one staff shift\", addressed by `rosterShiftId` and `tblTenantId`. A shift id that does not exist in your organisation is a 404.  `hourlyRate` and `totalCost` need `pay_conditions.read`; without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff shift\'s details
     */
    async schedulingGetRegularShiftDetails(requestParameters: SchedulingGetRegularShiftDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetShiftDetailsById200Response> {
        const response = await this.schedulingGetRegularShiftDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the change history for a date range across all your locations, oldest first: each entry says what changed (Add, Delete, Update, Move, Resize, Bulk or Copy), when and by whom, and which entry the roster is currently at. The first call for a date range starts the history with an \"Initial state\" entry.  `tblTenantId` must be your organisation, or the call is refused with 403. This response also carries `status`, the HTTP status code.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get the roster change history
     */
    async schedulingGetRosterHistoryRaw(requestParameters: SchedulingGetRosterHistoryOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetRosterHistory200Response>> {
        if (requestParameters['schedulingGetRosterHistoryRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingGetRosterHistoryRequest',
                'Required parameter "schedulingGetRosterHistoryRequest" was null or undefined when calling schedulingGetRosterHistory().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/RosterHistory/get-roster-history`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingGetRosterHistoryRequestToJSON(requestParameters['schedulingGetRosterHistoryRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetRosterHistory200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the change history for a date range across all your locations, oldest first: each entry says what changed (Add, Delete, Update, Move, Resize, Bulk or Copy), when and by whom, and which entry the roster is currently at. The first call for a date range starts the history with an \"Initial state\" entry.  `tblTenantId` must be your organisation, or the call is refused with 403. This response also carries `status`, the HTTP status code.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get the roster change history
     */
    async schedulingGetRosterHistory(requestParameters: SchedulingGetRosterHistoryOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetRosterHistory200Response> {
        const response = await this.schedulingGetRosterHistoryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the saved roster templates at one location: each template\'s id, name, length (Day, WorkWeek, Week, Fortnight or Month) and how many shifts it holds. It does not return the shifts themselves.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List roster templates for a location
     */
    async schedulingGetRosterTemplatesRaw(requestParameters: SchedulingGetRosterTemplatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetRosterTemplates200Response>> {
        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling schedulingGetRosterTemplates().'
            );
        }

        if (requestParameters['locationId'] == null) {
            throw new runtime.RequiredError(
                'locationId',
                'Required parameter "locationId" was null or undefined when calling schedulingGetRosterTemplates().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        if (requestParameters['locationId'] != null) {
            queryParameters['locationId'] = requestParameters['locationId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/RosterTemplate/get-roster-templates`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetRosterTemplates200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the saved roster templates at one location: each template\'s id, name, length (Day, WorkWeek, Week, Fortnight or Month) and how many shifts it holds. It does not return the shifts themselves.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List roster templates for a location
     */
    async schedulingGetRosterTemplates(requestParameters: SchedulingGetRosterTemplatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetRosterTemplates200Response> {
        const response = await this.schedulingGetRosterTemplatesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Checks every staff shift at the chosen locations and dates for conflicts: no availability, approved leave or unavailability, overlapping shifts, hours outside availability, too many weekly hours, too little rest, too many days in a row, a missing qualification and a staff ratio breach. Must-fix conflicts come back in `errors` and stop the roster being published; warnings come back in `warnings`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Check rostered shifts for conflicts
     */
    async schedulingGetShiftConflictsRaw(requestParameters: SchedulingGetShiftConflictsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetShiftConflicts200Response>> {
        if (requestParameters['schedulingGetShiftConflictsRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingGetShiftConflictsRequest',
                'Required parameter "schedulingGetShiftConflictsRequest" was null or undefined when calling schedulingGetShiftConflicts().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/StaffAssignment/get-shift-conflicts`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingGetShiftConflictsRequestToJSON(requestParameters['schedulingGetShiftConflictsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetShiftConflicts200ResponseFromJSON(jsonValue));
    }

    /**
     * Checks every staff shift at the chosen locations and dates for conflicts: no availability, approved leave or unavailability, overlapping shifts, hours outside availability, too many weekly hours, too little rest, too many days in a row, a missing qualification and a staff ratio breach. Must-fix conflicts come back in `errors` and stop the roster being published; warnings come back in `warnings`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Check rostered shifts for conflicts
     */
    async schedulingGetShiftConflicts(requestParameters: SchedulingGetShiftConflictsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetShiftConflicts200Response> {
        const response = await this.schedulingGetShiftConflictsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one staff shift (a shift worked by one person, your own staff member or an agency worker) with its area, times, status, cost and who works it. For an open or empty shift use \"Get one open or empty shift\" instead. A shift id that does not exist in your organisation is a 404.  `hourlyRate` and `totalCost` need `pay_conditions.read`; without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get one staff shift
     */
    async schedulingGetShiftDetailsByIdRaw(requestParameters: SchedulingGetShiftDetailsByIdOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetShiftDetailsById200Response>> {
        if (requestParameters['schedulingGetShiftDetailsByIdRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingGetShiftDetailsByIdRequest',
                'Required parameter "schedulingGetShiftDetailsByIdRequest" was null or undefined when calling schedulingGetShiftDetailsById().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/ShiftManagement/get-shift-details-by-id`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingGetShiftDetailsByIdRequestToJSON(requestParameters['schedulingGetShiftDetailsByIdRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetShiftDetailsById200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one staff shift (a shift worked by one person, your own staff member or an agency worker) with its area, times, status, cost and who works it. For an open or empty shift use \"Get one open or empty shift\" instead. A shift id that does not exist in your organisation is a 404.  `hourlyRate` and `totalCost` need `pay_conditions.read`; without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get one staff shift
     */
    async schedulingGetShiftDetailsById(requestParameters: SchedulingGetShiftDetailsByIdOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetShiftDetailsById200Response> {
        const response = await this.schedulingGetShiftDetailsByIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the active shift templates at one location, each with its times, break, shift type and pay detail (on-call, sleepover and broken-shift settings). Without `locationId` the list is empty.  Rates, multipliers and `standbyRateType` in `shiftTypeDetail` need `pay_conditions.read` (`pay_conditions.write` alone does not unlock them); without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List shift templates
     */
    async schedulingGetShiftTemplateListWithDetailsRaw(requestParameters: SchedulingGetShiftTemplateListWithDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetShiftTemplateListWithDetails200Response>> {
        if (requestParameters['schedulingGetShiftTemplateListWithDetailsRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingGetShiftTemplateListWithDetailsRequest',
                'Required parameter "schedulingGetShiftTemplateListWithDetailsRequest" was null or undefined when calling schedulingGetShiftTemplateListWithDetails().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/ShiftTemplate/get-shift-template-list-with-details`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingGetShiftTemplateListWithDetailsRequestToJSON(requestParameters['schedulingGetShiftTemplateListWithDetailsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetShiftTemplateListWithDetails200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the active shift templates at one location, each with its times, break, shift type and pay detail (on-call, sleepover and broken-shift settings). Without `locationId` the list is empty.  Rates, multipliers and `standbyRateType` in `shiftTypeDetail` need `pay_conditions.read` (`pay_conditions.write` alone does not unlock them); without it they are null.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * List shift templates
     */
    async schedulingGetShiftTemplateListWithDetails(requestParameters: SchedulingGetShiftTemplateListWithDetailsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetShiftTemplateListWithDetails200Response> {
        const response = await this.schedulingGetShiftTemplateListWithDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one row per staff member with a cell for each date in the range: whether they are available, their available hours and breaks, and any leave or unavailability. Narrow it to one location with `locationId` or one role with `roleId`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get staff availability for a date range
     */
    async schedulingGetStaffAvailabilityWeekViewRaw(requestParameters: SchedulingGetStaffAvailabilityWeekViewOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingGetStaffAvailabilityWeekView200Response>> {
        if (requestParameters['schedulingGetStaffAvailabilityWeekViewRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingGetStaffAvailabilityWeekViewRequest',
                'Required parameter "schedulingGetStaffAvailabilityWeekViewRequest" was null or undefined when calling schedulingGetStaffAvailabilityWeekView().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/StaffManagement/get-staff-availability-week-view`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingGetStaffAvailabilityWeekViewRequestToJSON(requestParameters['schedulingGetStaffAvailabilityWeekViewRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingGetStaffAvailabilityWeekView200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one row per staff member with a cell for each date in the range: whether they are available, their available hours and breaks, and any leave or unavailability. Narrow it to one location with `locationId` or one role with `roleId`.  A date range longer than 62 days, counting both ends, is refused with 400.  **Required scope:** `rosters.read` or `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Get staff availability for a date range
     */
    async schedulingGetStaffAvailabilityWeekView(requestParameters: SchedulingGetStaffAvailabilityWeekViewOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingGetStaffAvailabilityWeekView200Response> {
        const response = await this.schedulingGetStaffAvailabilityWeekViewRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Publishes the staff shifts at the chosen locations and dates, optionally only for staff holding one of `roles`. Shifts already Confirmed, Completed or Cancelled keep their status. Nothing is published if any of the locations has a must-fix conflict: the call still answers 200, with `data.success` false and the conflicts in `message`. With no matching shifts it answers 200 with `data.shiftsFound` false.  **Required scope:** `rosters.publish`  See **Responses** below for the status codes this operation can return.
     * Publish the roster
     */
    async schedulingPublishRegularShiftsRaw(requestParameters: SchedulingPublishRegularShiftsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingPublishRegularShifts200Response>> {
        if (requestParameters['schedulingPublishRegularShiftsRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingPublishRegularShiftsRequest',
                'Required parameter "schedulingPublishRegularShiftsRequest" was null or undefined when calling schedulingPublishRegularShifts().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["rosters.publish"]);
        }


        let urlPath = `/scheduling/api/StaffAssignment/publish-regular-shifts`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingPublishRegularShiftsRequestToJSON(requestParameters['schedulingPublishRegularShiftsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingPublishRegularShifts200ResponseFromJSON(jsonValue));
    }

    /**
     * Publishes the staff shifts at the chosen locations and dates, optionally only for staff holding one of `roles`. Shifts already Confirmed, Completed or Cancelled keep their status. Nothing is published if any of the locations has a must-fix conflict: the call still answers 200, with `data.success` false and the conflicts in `message`. With no matching shifts it answers 200 with `data.shiftsFound` false.  **Required scope:** `rosters.publish`  See **Responses** below for the status codes this operation can return.
     * Publish the roster
     */
    async schedulingPublishRegularShifts(requestParameters: SchedulingPublishRegularShiftsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingPublishRegularShifts200Response> {
        const response = await this.schedulingPublishRegularShiftsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates open shifts (offered to staff and to the agencies that supply the location) or empty shifts (placeholders that are never offered), or edits one. Leave `shiftID` out to create: one shift is made for every area in `areaIDs` on every date in `shiftDates`. Send `shiftID` to edit that shift; `areaIDs` and `shiftDates` are then ignored. Changing a shift from Open to Empty withdraws it from agencies.  The location, areas and any staff ids must belong to your organisation, or the call is refused with 403. A shift that cannot be saved answers 409. `createdBy` and `updatedBy` are ignored.  Editing a shift that does not exist, was deleted or belongs to another organisation answers 404 with `data` null.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Create or edit open and empty shifts
     */
    async schedulingSaveGeneratedShiftsRaw(requestParameters: SchedulingSaveGeneratedShiftsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingSaveGeneratedShifts200Response>> {
        if (requestParameters['schedulingSaveGeneratedShiftsRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingSaveGeneratedShiftsRequest',
                'Required parameter "schedulingSaveGeneratedShiftsRequest" was null or undefined when calling schedulingSaveGeneratedShifts().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["rosters.write"]);
        }


        let urlPath = `/scheduling/api/ShiftManagement/save-generated-shifts`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingSaveGeneratedShiftsRequestToJSON(requestParameters['schedulingSaveGeneratedShiftsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingSaveGeneratedShifts200ResponseFromJSON(jsonValue));
    }

    /**
     * Creates open shifts (offered to staff and to the agencies that supply the location) or empty shifts (placeholders that are never offered), or edits one. Leave `shiftID` out to create: one shift is made for every area in `areaIDs` on every date in `shiftDates`. Send `shiftID` to edit that shift; `areaIDs` and `shiftDates` are then ignored. Changing a shift from Open to Empty withdraws it from agencies.  The location, areas and any staff ids must belong to your organisation, or the call is refused with 403. A shift that cannot be saved answers 409. `createdBy` and `updatedBy` are ignored.  Editing a shift that does not exist, was deleted or belongs to another organisation answers 404 with `data` null.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Create or edit open and empty shifts
     */
    async schedulingSaveGeneratedShifts(requestParameters: SchedulingSaveGeneratedShiftsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingSaveGeneratedShifts200Response> {
        const response = await this.schedulingSaveGeneratedShiftsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates a recurring shift pattern, or edits one when `patternId` is sent. A pattern is filled either by your staff (`assignedStaffIds`) or by agencies (`agencyAssignment`), never both. Saving a pattern does not create shifts by itself.  The end time must be after the start time, the role must be one of your active roles, the area must be in the location, and assigned staff must be active and assigned to that location and area. A pattern that fails these checks answers 409 with the reason in `message`. `requestedBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Create or edit a recurring shift pattern
     */
    async schedulingSaveRecurringShiftPatternsRaw(requestParameters: SchedulingSaveRecurringShiftPatternsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingSaveRecurringShiftPatterns200Response>> {
        if (requestParameters['schedulingSaveRecurringShiftPatternsRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingSaveRecurringShiftPatternsRequest',
                'Required parameter "schedulingSaveRecurringShiftPatternsRequest" was null or undefined when calling schedulingSaveRecurringShiftPatterns().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["rosters.write"]);
        }


        let urlPath = `/scheduling/api/ShiftManagement/save-recurring-shift-patterns`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingSaveRecurringShiftPatternsRequestToJSON(requestParameters['schedulingSaveRecurringShiftPatternsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingSaveRecurringShiftPatterns200ResponseFromJSON(jsonValue));
    }

    /**
     * Creates a recurring shift pattern, or edits one when `patternId` is sent. A pattern is filled either by your staff (`assignedStaffIds`) or by agencies (`agencyAssignment`), never both. Saving a pattern does not create shifts by itself.  The end time must be after the start time, the role must be one of your active roles, the area must be in the location, and assigned staff must be active and assigned to that location and area. A pattern that fails these checks answers 409 with the reason in `message`. `requestedBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Create or edit a recurring shift pattern
     */
    async schedulingSaveRecurringShiftPatterns(requestParameters: SchedulingSaveRecurringShiftPatternsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingSaveRecurringShiftPatterns200Response> {
        const response = await this.schedulingSaveRecurringShiftPatternsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Replaces a staff shift\'s person, area, date, times, break and notes with the values sent; use it to move, resize or reassign a shift. Send the person\'s `companyType` (and `companyId` for an agency worker) every time. `shiftTypeID` is kept when left out. Editing a shift usually turns `shiftStatus` into Draft, because the edit invalidates its publication, so publish it again afterwards. Left out, the status becomes Draft. Sent as the current status, it is kept only if nothing else changes, and otherwise becomes Draft. Draft and Cancelled are always applied. Published, Confirmed or Completed apply only when the shift is already one of those and nothing else changes; otherwise the status becomes Draft. Read `shiftStatus` back rather than assuming what you sent was stored.  A shift that is not found, an invalid status or a duplicate of another shift answers 409 with the reason in `data.message`. Ids must belong to your organisation, or the call is refused with 403. `updatedBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Update a staff shift
     */
    async schedulingUpdateStaffRegularShiftRaw(requestParameters: SchedulingUpdateStaffRegularShiftOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingCreateStaffRegularShift200Response>> {
        if (requestParameters['schedulingUpdateStaffRegularShiftRequest'] == null) {
            throw new runtime.RequiredError(
                'schedulingUpdateStaffRegularShiftRequest',
                'Required parameter "schedulingUpdateStaffRegularShiftRequest" was null or undefined when calling schedulingUpdateStaffRegularShift().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["rosters.write"]);
        }


        let urlPath = `/scheduling/api/StaffAssignment/update-staff-regular-shift`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SchedulingUpdateStaffRegularShiftRequestToJSON(requestParameters['schedulingUpdateStaffRegularShiftRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingCreateStaffRegularShift200ResponseFromJSON(jsonValue));
    }

    /**
     * Replaces a staff shift\'s person, area, date, times, break and notes with the values sent; use it to move, resize or reassign a shift. Send the person\'s `companyType` (and `companyId` for an agency worker) every time. `shiftTypeID` is kept when left out. Editing a shift usually turns `shiftStatus` into Draft, because the edit invalidates its publication, so publish it again afterwards. Left out, the status becomes Draft. Sent as the current status, it is kept only if nothing else changes, and otherwise becomes Draft. Draft and Cancelled are always applied. Published, Confirmed or Completed apply only when the shift is already one of those and nothing else changes; otherwise the status becomes Draft. Read `shiftStatus` back rather than assuming what you sent was stored.  A shift that is not found, an invalid status or a duplicate of another shift answers 409 with the reason in `data.message`. Ids must belong to your organisation, or the call is refused with 403. `updatedBy` is ignored.  **Required scope:** `rosters.write`  See **Responses** below for the status codes this operation can return.
     * Update a staff shift
     */
    async schedulingUpdateStaffRegularShift(requestParameters: SchedulingUpdateStaffRegularShiftOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingCreateStaffRegularShift200Response> {
        const response = await this.schedulingUpdateStaffRegularShiftRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
