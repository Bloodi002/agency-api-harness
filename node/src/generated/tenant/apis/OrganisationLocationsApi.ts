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
  SchedulingLocationList200Response,
  SchedulingLocationsAreas200Response,
  StaffGetTenantEvents200Response,
  StaffGetTenantEventsRequest,
  StaffGetTenantHolidayList200Response,
  StaffGetTenantHolidayListRequest,
  TenantGetAllLocation200Response,
  TenantGetAllLocationRequest,
  TenantGetAreasByTenantLocation200Response,
  TenantGetAreasByTenantLocationRequest,
  TenantGetLocation200Response,
  TenantGetLocationOperatingHoursByLocationId200Response,
  TenantGetLocationsForDropdown200Response,
  TenantGetTenant200Response,
  TenantPlansCurrentDetail200Response,
  TenantPlansCurrentUsage200Response,
  TenantSaveLocationOperatingHours200Response,
  TenantSaveLocationOperatingHoursRequest,
  TenantTags200Response,
  TenantV2GetArea200Response,
  TenantV2GetLocationId200Response,
  TenantV2SaveArea200Response,
  TenantV2SaveAreaRequest,
  TenantV2SaveLocation200Response,
  TenantV2SaveLocationRequest,
  ValidationProblem,
} from '../models/index.js';
import {
    EnvelopeFromJSON,
    EnvelopeToJSON,
    SchedulingLocationList200ResponseFromJSON,
    SchedulingLocationList200ResponseToJSON,
    SchedulingLocationsAreas200ResponseFromJSON,
    SchedulingLocationsAreas200ResponseToJSON,
    StaffGetTenantEvents200ResponseFromJSON,
    StaffGetTenantEvents200ResponseToJSON,
    StaffGetTenantEventsRequestFromJSON,
    StaffGetTenantEventsRequestToJSON,
    StaffGetTenantHolidayList200ResponseFromJSON,
    StaffGetTenantHolidayList200ResponseToJSON,
    StaffGetTenantHolidayListRequestFromJSON,
    StaffGetTenantHolidayListRequestToJSON,
    TenantGetAllLocation200ResponseFromJSON,
    TenantGetAllLocation200ResponseToJSON,
    TenantGetAllLocationRequestFromJSON,
    TenantGetAllLocationRequestToJSON,
    TenantGetAreasByTenantLocation200ResponseFromJSON,
    TenantGetAreasByTenantLocation200ResponseToJSON,
    TenantGetAreasByTenantLocationRequestFromJSON,
    TenantGetAreasByTenantLocationRequestToJSON,
    TenantGetLocation200ResponseFromJSON,
    TenantGetLocation200ResponseToJSON,
    TenantGetLocationOperatingHoursByLocationId200ResponseFromJSON,
    TenantGetLocationOperatingHoursByLocationId200ResponseToJSON,
    TenantGetLocationsForDropdown200ResponseFromJSON,
    TenantGetLocationsForDropdown200ResponseToJSON,
    TenantGetTenant200ResponseFromJSON,
    TenantGetTenant200ResponseToJSON,
    TenantPlansCurrentDetail200ResponseFromJSON,
    TenantPlansCurrentDetail200ResponseToJSON,
    TenantPlansCurrentUsage200ResponseFromJSON,
    TenantPlansCurrentUsage200ResponseToJSON,
    TenantSaveLocationOperatingHours200ResponseFromJSON,
    TenantSaveLocationOperatingHours200ResponseToJSON,
    TenantSaveLocationOperatingHoursRequestFromJSON,
    TenantSaveLocationOperatingHoursRequestToJSON,
    TenantTags200ResponseFromJSON,
    TenantTags200ResponseToJSON,
    TenantV2GetArea200ResponseFromJSON,
    TenantV2GetArea200ResponseToJSON,
    TenantV2GetLocationId200ResponseFromJSON,
    TenantV2GetLocationId200ResponseToJSON,
    TenantV2SaveArea200ResponseFromJSON,
    TenantV2SaveArea200ResponseToJSON,
    TenantV2SaveAreaRequestFromJSON,
    TenantV2SaveAreaRequestToJSON,
    TenantV2SaveLocation200ResponseFromJSON,
    TenantV2SaveLocation200ResponseToJSON,
    TenantV2SaveLocationRequestFromJSON,
    TenantV2SaveLocationRequestToJSON,
    ValidationProblemFromJSON,
    ValidationProblemToJSON,
} from '../models/index.js';

export interface SchedulingLocationListRequest {
    tenantId: string;
}

export interface SchedulingLocationsAreasRequest {
    tenantId: string;
}

export interface StaffGetTenantEventsOperationRequest {
    staffGetTenantEventsRequest: StaffGetTenantEventsRequest;
}

export interface StaffGetTenantHolidayListOperationRequest {
    staffGetTenantHolidayListRequest: StaffGetTenantHolidayListRequest;
}

export interface TenantGetAllLocationOperationRequest {
    tenantGetAllLocationRequest: TenantGetAllLocationRequest;
}

export interface TenantGetAreasByTenantLocationOperationRequest {
    tenantGetAreasByTenantLocationRequest: TenantGetAreasByTenantLocationRequest;
}

export interface TenantGetLocationRequest {
    tenantId: string;
}

export interface TenantGetLocationOperatingHoursByLocationIdRequest {
    locationId: string;
}

export interface TenantGetLocationsForDropdownRequest {
    tenantId: string;
}

export interface TenantGetTenantRequest {
    id: string;
}

export interface TenantPlansCurrentDetailRequest {
    tenantId: string;
}

export interface TenantPlansCurrentUsageRequest {
    tenantId: string;
}

export interface TenantSaveLocationOperatingHoursOperationRequest {
    tenantSaveLocationOperatingHoursRequest: TenantSaveLocationOperatingHoursRequest;
}

export interface TenantTagsRequest {
    tenantId: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface TenantV2GetAreaRequest {
    tenantId: string;
}

export interface TenantV2GetLocationIdRequest {
    tenantLocationId: string;
}

export interface TenantV2SaveAreaOperationRequest {
    tenantV2SaveAreaRequest: TenantV2SaveAreaRequest;
}

export interface TenantV2SaveLocationOperationRequest {
    tenantV2SaveLocationRequest: TenantV2SaveLocationRequest;
}

/**
 * OrganisationLocationsApi - interface
 * 
 * @export
 * @interface OrganisationLocationsApiInterface
 */
export interface OrganisationLocationsApiInterface {
    /**
     * Returns the id and name of each of your organisation\'s locations, for choosing which locations to roster. An empty list comes back as 200 with the message \"No location found.\"  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * @summary List locations
     * @param {string} tenantId Your organisation\&#39;s id. It must be the organisation your token was issued for; any other id is refused with 403.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    schedulingLocationListRaw(requestParameters: SchedulingLocationListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingLocationList200Response>>;

    /**
     * Returns the id and name of each of your organisation\'s locations, for choosing which locations to roster. An empty list comes back as 200 with the message \"No location found.\"  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List locations
     */
    schedulingLocationList(requestParameters: SchedulingLocationListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingLocationList200Response>;

    /**
     * Returns each of your organisation\'s locations with its address, capacity and staff ratio, and the areas (rooms, wings or units) inside it. Use the area ids when creating shifts.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * @summary List locations with their areas
     * @param {string} tenantId Your organisation\&#39;s id. It must be the organisation your token was issued for; any other id is refused with 403.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    schedulingLocationsAreasRaw(requestParameters: SchedulingLocationsAreasRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingLocationsAreas200Response>>;

    /**
     * Returns each of your organisation\'s locations with its address, capacity and staff ratio, and the areas (rooms, wings or units) inside it. Use the area ids when creating shifts.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List locations with their areas
     */
    schedulingLocationsAreas(requestParameters: SchedulingLocationsAreasRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingLocationsAreas200Response>;

    /**
     * Returns a page of the events your organisation has set up (for example a blackout period or an open day), grouped by name and dates, with the locations and areas each one applies to.  **Required scope:** `holidays.read`  See **Responses** below for the status codes this operation can return.
     * @summary List your organisation\'s events
     * @param {StaffGetTenantEventsRequest} staffGetTenantEventsRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    staffGetTenantEventsRaw(requestParameters: StaffGetTenantEventsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetTenantEvents200Response>>;

    /**
     * Returns a page of the events your organisation has set up (for example a blackout period or an open day), grouped by name and dates, with the locations and areas each one applies to.  **Required scope:** `holidays.read`  See **Responses** below for the status codes this operation can return.
     * List your organisation\'s events
     */
    staffGetTenantEvents(requestParameters: StaffGetTenantEventsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetTenantEvents200Response>;

    /**
     * Returns a page of the public holidays your organisation has set up. A holiday kept at several locations is returned once, with the locations listed under it. Holidays whose location has since been removed are dropped from the list (and cleared from your holiday list at the same time).  Holiday and event changes cannot be made through the API.  **Required scope:** `holidays.read`  See **Responses** below for the status codes this operation can return.
     * @summary List public holidays set for your locations
     * @param {StaffGetTenantHolidayListRequest} staffGetTenantHolidayListRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    staffGetTenantHolidayListRaw(requestParameters: StaffGetTenantHolidayListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetTenantHolidayList200Response>>;

    /**
     * Returns a page of the public holidays your organisation has set up. A holiday kept at several locations is returned once, with the locations listed under it. Holidays whose location has since been removed are dropped from the list (and cleared from your holiday list at the same time).  Holiday and event changes cannot be made through the API.  **Required scope:** `holidays.read`  See **Responses** below for the status codes this operation can return.
     * List public holidays set for your locations
     */
    staffGetTenantHolidayList(requestParameters: StaffGetTenantHolidayListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetTenantHolidayList200Response>;

    /**
     * Returns one page of your organisation\'s locations, each with its live areas, staffing counts and tags. Filter by text, state, suburb, location group, area, qualification, staff or manager counts, and tags; archived locations are listed only when `isArchived` is true.  `tenantId` must be your own organisation id, or the call is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * @summary Search locations with their areas
     * @param {TenantGetAllLocationRequest} tenantGetAllLocationRequest Filters and paging.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantGetAllLocationRaw(requestParameters: TenantGetAllLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantGetAllLocation200Response>>;

    /**
     * Returns one page of your organisation\'s locations, each with its live areas, staffing counts and tags. Filter by text, state, suburb, location group, area, qualification, staff or manager counts, and tags; archived locations are listed only when `isArchived` is true.  `tenantId` must be your own organisation id, or the call is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * Search locations with their areas
     */
    tenantGetAllLocation(requestParameters: TenantGetAllLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantGetAllLocation200Response>;

    /**
     * Returns one page of the live areas of one location, with their staff, managers, ratios, qualifications and tags.  `tenantId` must be your own organisation id and the location must be yours, or the call is refused with 403. An archived or deleted location answers 404.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * @summary Search the areas of one location
     * @param {TenantGetAreasByTenantLocationRequest} tenantGetAreasByTenantLocationRequest The location and paging.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantGetAreasByTenantLocationRaw(requestParameters: TenantGetAreasByTenantLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantGetAreasByTenantLocation200Response>>;

    /**
     * Returns one page of the live areas of one location, with their staff, managers, ratios, qualifications and tags.  `tenantId` must be your own organisation id and the location must be yours, or the call is refused with 403. An archived or deleted location answers 404.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * Search the areas of one location
     */
    tenantGetAreasByTenantLocation(requestParameters: TenantGetAreasByTenantLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantGetAreasByTenantLocation200Response>;

    /**
     * Returns every live location of your organisation (not archived or deleted), with contact details, tags and the number of staff assigned to its areas. An organisation with no locations answers 200 with an empty list.  `tenantId` must be your own organisation id, or the call is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * @summary List every location
     * @param {string} tenantId Your organisation id. Sent as &#x60;TenantID&#x60; by the web app; the name is not case-sensitive.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantGetLocationRaw(requestParameters: TenantGetLocationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantGetLocation200Response>>;

    /**
     * Returns every live location of your organisation (not archived or deleted), with contact details, tags and the number of staff assigned to its areas. An organisation with no locations answers 200 with an empty list.  `tenantId` must be your own organisation id, or the call is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List every location
     */
    tenantGetLocation(requestParameters: TenantGetLocationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantGetLocation200Response>;

    /**
     * Returns the opening hours of one of your locations, day by day, with split hours where a day has more than one range. Only days with hours are listed.  A location with no hours set answers 404. A location of another organisation, or an unknown id, is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get a location\'s opening hours
     * @param {string} locationId The location id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantGetLocationOperatingHoursByLocationIdRaw(requestParameters: TenantGetLocationOperatingHoursByLocationIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantGetLocationOperatingHoursByLocationId200Response>>;

    /**
     * Returns the opening hours of one of your locations, day by day, with split hours where a day has more than one range. Only days with hours are listed.  A location with no hours set answers 404. A location of another organisation, or an unknown id, is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * Get a location\'s opening hours
     */
    tenantGetLocationOperatingHoursByLocationId(requestParameters: TenantGetLocationOperatingHoursByLocationIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantGetLocationOperatingHoursByLocationId200Response>;

    /**
     * Returns the id, name and address of each live location of your organisation: a light list for pickers and lookups.  `tenantId` must be your own organisation id, or the call is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * @summary List location names and addresses
     * @param {string} tenantId Your organisation id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantGetLocationsForDropdownRaw(requestParameters: TenantGetLocationsForDropdownRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantGetLocationsForDropdown200Response>>;

    /**
     * Returns the id, name and address of each live location of your organisation: a light list for pickers and lookups.  `tenantId` must be your own organisation id, or the call is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List location names and addresses
     */
    tenantGetLocationsForDropdown(requestParameters: TenantGetLocationsForDropdownRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantGetLocationsForDropdown200Response>;

    /**
     * Returns your organisation\'s profile: name, contact details, address, ABN, industry, logo and status.  Requires the `organisation.read` scope. Send your own organisation id; another organisation\'s id is refused with 403. An unknown id answers 200 with `data` null.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get your organisation profile
     * @param {string} id Your organisation id. Sent as &#x60;ID&#x60; by the web app; the name is not case-sensitive.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantGetTenantRaw(requestParameters: TenantGetTenantRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantGetTenant200Response>>;

    /**
     * Returns your organisation\'s profile: name, contact details, address, ABN, industry, logo and status.  Requires the `organisation.read` scope. Send your own organisation id; another organisation\'s id is refused with 403. An unknown id answers 200 with `data` null.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * Get your organisation profile
     */
    tenantGetTenant(requestParameters: TenantGetTenantRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantGetTenant200Response>;

    /**
     * Returns your organisation\'s current plan: name, tier, display prices, limits, and each module it includes with add-ons resolved for you. The field names are fixed and will not change.  `tenantId` must be your own organisation id. Another organisation\'s id, or an organisation with no active plan, answers 404.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get your organisation\'s plan
     * @param {string} tenantId Your organisation id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantPlansCurrentDetailRaw(requestParameters: TenantPlansCurrentDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantPlansCurrentDetail200Response>>;

    /**
     * Returns your organisation\'s current plan: name, tier, display prices, limits, and each module it includes with add-ons resolved for you. The field names are fixed and will not change.  `tenantId` must be your own organisation id. Another organisation\'s id, or an organisation with no active plan, answers 404.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * Get your organisation\'s plan
     */
    tenantPlansCurrentDetail(requestParameters: TenantPlansCurrentDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantPlansCurrentDetail200Response>;

    /**
     * Returns each plan limit (locations, staff, custom roles, API credentials) with the cap that applies to your organisation and how much of it is in use.  The staff and custom-role counts are not yet readable by an integration, so those rows come back with `inUse` and `isWithinLimit` null. `tenantId` must be your own organisation id, or the call answers 404.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get your plan\'s limits and current usage
     * @param {string} tenantId Your organisation id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantPlansCurrentUsageRaw(requestParameters: TenantPlansCurrentUsageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantPlansCurrentUsage200Response>>;

    /**
     * Returns each plan limit (locations, staff, custom roles, API credentials) with the cap that applies to your organisation and how much of it is in use.  The staff and custom-role counts are not yet readable by an integration, so those rows come back with `inUse` and `isWithinLimit` null. `tenantId` must be your own organisation id, or the call answers 404.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * Get your plan\'s limits and current usage
     */
    tenantPlansCurrentUsage(requestParameters: TenantPlansCurrentUsageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantPlansCurrentUsage200Response>;

    /**
     * Sets the opening hours and time zone of one of your locations, replacing whatever it had. This is how a location gets a time zone through the API. `data` is the location id.  Send the zone as `timeZoneName`, an IANA name such as `Australia/Sydney`, or as the lookup id in `timeZone`; one of the two is required, and they must agree when both are sent. The zone is stored with the hours, so at least one opening time is needed. A missing or unsupported zone, or a schedule with no opening time, a wrong day or a range not running forward within the day, answers 400. A location of another organisation answers 403, and one that does not exist answers 404. `isUpdate`, `createdBy` and `modifiedBy` are ignored.  **Required scope:** `locations.write`  See **Responses** below for the status codes this operation can return.
     * @summary Set a location\'s opening hours and time zone
     * @param {TenantSaveLocationOperatingHoursRequest} tenantSaveLocationOperatingHoursRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantSaveLocationOperatingHoursRaw(requestParameters: TenantSaveLocationOperatingHoursOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantSaveLocationOperatingHours200Response>>;

    /**
     * Sets the opening hours and time zone of one of your locations, replacing whatever it had. This is how a location gets a time zone through the API. `data` is the location id.  Send the zone as `timeZoneName`, an IANA name such as `Australia/Sydney`, or as the lookup id in `timeZone`; one of the two is required, and they must agree when both are sent. The zone is stored with the hours, so at least one opening time is needed. A missing or unsupported zone, or a schedule with no opening time, a wrong day or a range not running forward within the day, answers 400. A location of another organisation answers 403, and one that does not exist answers 404. `isUpdate`, `createdBy` and `modifiedBy` are ignored.  **Required scope:** `locations.write`  See **Responses** below for the status codes this operation can return.
     * Set a location\'s opening hours and time zone
     */
    tenantSaveLocationOperatingHours(requestParameters: TenantSaveLocationOperatingHoursOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantSaveLocationOperatingHours200Response>;

    /**
     * Returns one page of your organisation\'s tags, with how often each is used on locations, areas, staff and contracts.  This response is not wrapped in `message`: it is `{ data, totalRecords, page, pageSize }`. `tenantId` must be your own organisation id; any other id answers 404 with only a `message`.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * @summary List your organisation\'s tags
     * @param {string} tenantId Your organisation id.
     * @param {string} [search] Matches tag names.
     * @param {string} [sortBy] tagName or lastUpdated. Anything else sorts by date created.
     * @param {string} [sortOrder] asc, or anything else for descending.
     * @param {number} [pageNumber] Page number, from 1.
     * @param {number} [pageSize] Rows per page. Above 200 is lowered to 200 without an error.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantTagsRaw(requestParameters: TenantTagsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantTags200Response>>;

    /**
     * Returns one page of your organisation\'s tags, with how often each is used on locations, areas, staff and contracts.  This response is not wrapped in `message`: it is `{ data, totalRecords, page, pageSize }`. `tenantId` must be your own organisation id; any other id answers 404 with only a `message`.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * List your organisation\'s tags
     */
    tenantTags(requestParameters: TenantTagsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantTags200Response>;

    /**
     * Returns every live area of your organisation, across all live locations, with staff and manager counts and the names of assigned staff.  Send your own organisation id. Any other id answers 200 with an empty list.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * @summary List every area
     * @param {string} tenantId Your organisation id. Sent as &#x60;TenantID&#x60; by the web app; the name is not case-sensitive.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantV2GetAreaRaw(requestParameters: TenantV2GetAreaRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantV2GetArea200Response>>;

    /**
     * Returns every live area of your organisation, across all live locations, with staff and manager counts and the names of assigned staff.  Send your own organisation id. Any other id answers 200 with an empty list.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List every area
     */
    tenantV2GetArea(requestParameters: TenantV2GetAreaRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantV2GetArea200Response>;

    /**
     * Returns one location of your organisation, including an archived one, with its address, coordinates, contact details, tags and required qualifications.  A location that does not exist, has been deleted or belongs to another organisation answers 400, the same way in each case.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one location
     * @param {string} tenantLocationId The location id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantV2GetLocationIdRaw(requestParameters: TenantV2GetLocationIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantV2GetLocationId200Response>>;

    /**
     * Returns one location of your organisation, including an archived one, with its address, coordinates, contact details, tags and required qualifications.  A location that does not exist, has been deleted or belongs to another organisation answers 400, the same way in each case.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * Get one location
     */
    tenantV2GetLocationId(requestParameters: TenantV2GetLocationIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantV2GetLocationId200Response>;

    /**
     * Creates an area when `tenantAreaId` is empty or left out, or updates one of yours when it is set. `data` is the area id.  Your integration never changes who works in the area: the area\'s staff and managers are kept as stored. The location, and an edited area, must belong to your organisation, or the call answers 404. Area names must be unique within the location; a duplicate answers 409. An edit saves the fields as sent, so send the whole area: a text field left out is cleared, and `status` left out is 0 (Inactive).  **Required scope:** `locations.write`  See **Responses** below for the status codes this operation can return.
     * @summary Create or update an area
     * @param {TenantV2SaveAreaRequest} tenantV2SaveAreaRequest The area. &#x60;createdBy&#x60;, &#x60;modifiedBy&#x60;, &#x60;permission&#x60;, &#x60;qualification&#x60; and &#x60;tblStaffIds&#x60; are ignored for your integration.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantV2SaveAreaRaw(requestParameters: TenantV2SaveAreaOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantV2SaveArea200Response>>;

    /**
     * Creates an area when `tenantAreaId` is empty or left out, or updates one of yours when it is set. `data` is the area id.  Your integration never changes who works in the area: the area\'s staff and managers are kept as stored. The location, and an edited area, must belong to your organisation, or the call answers 404. Area names must be unique within the location; a duplicate answers 409. An edit saves the fields as sent, so send the whole area: a text field left out is cleared, and `status` left out is 0 (Inactive).  **Required scope:** `locations.write`  See **Responses** below for the status codes this operation can return.
     * Create or update an area
     */
    tenantV2SaveArea(requestParameters: TenantV2SaveAreaOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantV2SaveArea200Response>;

    /**
     * Creates a location when `tenantLocationId` is empty or left out, or updates one of yours when it is set. `data` is the location id. The contact person is stored on the location as plain details: your integration never creates or links a login account for them. A refused save answers with `data` null: 409 when a new location would pass your plan\'s location limit, when the name is already used in your organisation, or when the contact person\'s details are already in use; 400 when nothing could be stored. `tenantId` must be your own organisation id, and an edited location must be yours, or the call answers 404. An edit saves every other field as sent, so send the whole location: a field left out is cleared. `status` and `tagsWithColor` apply on create only and are kept as stored on an edit.  A location has no time zone until you set one with \"Set a location\'s opening hours and time zone\".  **Required scope:** `locations.write`  See **Responses** below for the status codes this operation can return.
     * @summary Create or update a location
     * @param {TenantV2SaveLocationRequest} tenantV2SaveLocationRequest The location. &#x60;createdBy&#x60;, &#x60;modifiedBy&#x60; and &#x60;tblUserId&#x60; are ignored for your integration.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganisationLocationsApiInterface
     */
    tenantV2SaveLocationRaw(requestParameters: TenantV2SaveLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantV2SaveLocation200Response>>;

    /**
     * Creates a location when `tenantLocationId` is empty or left out, or updates one of yours when it is set. `data` is the location id. The contact person is stored on the location as plain details: your integration never creates or links a login account for them. A refused save answers with `data` null: 409 when a new location would pass your plan\'s location limit, when the name is already used in your organisation, or when the contact person\'s details are already in use; 400 when nothing could be stored. `tenantId` must be your own organisation id, and an edited location must be yours, or the call answers 404. An edit saves every other field as sent, so send the whole location: a field left out is cleared. `status` and `tagsWithColor` apply on create only and are kept as stored on an edit.  A location has no time zone until you set one with \"Set a location\'s opening hours and time zone\".  **Required scope:** `locations.write`  See **Responses** below for the status codes this operation can return.
     * Create or update a location
     */
    tenantV2SaveLocation(requestParameters: TenantV2SaveLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantV2SaveLocation200Response>;

}

/**
 * 
 */
export class OrganisationLocationsApi extends runtime.BaseAPI implements OrganisationLocationsApiInterface {

    /**
     * Returns the id and name of each of your organisation\'s locations, for choosing which locations to roster. An empty list comes back as 200 with the message \"No location found.\"  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List locations
     */
    async schedulingLocationListRaw(requestParameters: SchedulingLocationListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingLocationList200Response>> {
        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling schedulingLocationList().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/CalenderView/location-list`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingLocationList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the id and name of each of your organisation\'s locations, for choosing which locations to roster. An empty list comes back as 200 with the message \"No location found.\"  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List locations
     */
    async schedulingLocationList(requestParameters: SchedulingLocationListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingLocationList200Response> {
        const response = await this.schedulingLocationListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns each of your organisation\'s locations with its address, capacity and staff ratio, and the areas (rooms, wings or units) inside it. Use the area ids when creating shifts.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List locations with their areas
     */
    async schedulingLocationsAreasRaw(requestParameters: SchedulingLocationsAreasRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingLocationsAreas200Response>> {
        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling schedulingLocationsAreas().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/CalenderView/locations-areas`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingLocationsAreas200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns each of your organisation\'s locations with its address, capacity and staff ratio, and the areas (rooms, wings or units) inside it. Use the area ids when creating shifts.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List locations with their areas
     */
    async schedulingLocationsAreas(requestParameters: SchedulingLocationsAreasRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingLocationsAreas200Response> {
        const response = await this.schedulingLocationsAreasRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a page of the events your organisation has set up (for example a blackout period or an open day), grouped by name and dates, with the locations and areas each one applies to.  **Required scope:** `holidays.read`  See **Responses** below for the status codes this operation can return.
     * List your organisation\'s events
     */
    async staffGetTenantEventsRaw(requestParameters: StaffGetTenantEventsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetTenantEvents200Response>> {
        if (requestParameters['staffGetTenantEventsRequest'] == null) {
            throw new runtime.RequiredError(
                'staffGetTenantEventsRequest',
                'Required parameter "staffGetTenantEventsRequest" was null or undefined when calling staffGetTenantEvents().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["holidays.read"]);
        }


        let urlPath = `/staff/get-tenant-events`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffGetTenantEventsRequestToJSON(requestParameters['staffGetTenantEventsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetTenantEvents200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a page of the events your organisation has set up (for example a blackout period or an open day), grouped by name and dates, with the locations and areas each one applies to.  **Required scope:** `holidays.read`  See **Responses** below for the status codes this operation can return.
     * List your organisation\'s events
     */
    async staffGetTenantEvents(requestParameters: StaffGetTenantEventsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetTenantEvents200Response> {
        const response = await this.staffGetTenantEventsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a page of the public holidays your organisation has set up. A holiday kept at several locations is returned once, with the locations listed under it. Holidays whose location has since been removed are dropped from the list (and cleared from your holiday list at the same time).  Holiday and event changes cannot be made through the API.  **Required scope:** `holidays.read`  See **Responses** below for the status codes this operation can return.
     * List public holidays set for your locations
     */
    async staffGetTenantHolidayListRaw(requestParameters: StaffGetTenantHolidayListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetTenantHolidayList200Response>> {
        if (requestParameters['staffGetTenantHolidayListRequest'] == null) {
            throw new runtime.RequiredError(
                'staffGetTenantHolidayListRequest',
                'Required parameter "staffGetTenantHolidayListRequest" was null or undefined when calling staffGetTenantHolidayList().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["holidays.read"]);
        }


        let urlPath = `/staff/get-tenant-holiday-list`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffGetTenantHolidayListRequestToJSON(requestParameters['staffGetTenantHolidayListRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetTenantHolidayList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a page of the public holidays your organisation has set up. A holiday kept at several locations is returned once, with the locations listed under it. Holidays whose location has since been removed are dropped from the list (and cleared from your holiday list at the same time).  Holiday and event changes cannot be made through the API.  **Required scope:** `holidays.read`  See **Responses** below for the status codes this operation can return.
     * List public holidays set for your locations
     */
    async staffGetTenantHolidayList(requestParameters: StaffGetTenantHolidayListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetTenantHolidayList200Response> {
        const response = await this.staffGetTenantHolidayListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one page of your organisation\'s locations, each with its live areas, staffing counts and tags. Filter by text, state, suburb, location group, area, qualification, staff or manager counts, and tags; archived locations are listed only when `isArchived` is true.  `tenantId` must be your own organisation id, or the call is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * Search locations with their areas
     */
    async tenantGetAllLocationRaw(requestParameters: TenantGetAllLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantGetAllLocation200Response>> {
        if (requestParameters['tenantGetAllLocationRequest'] == null) {
            throw new runtime.RequiredError(
                'tenantGetAllLocationRequest',
                'Required parameter "tenantGetAllLocationRequest" was null or undefined when calling tenantGetAllLocation().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/tenant/get-all-location`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TenantGetAllLocationRequestToJSON(requestParameters['tenantGetAllLocationRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantGetAllLocation200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one page of your organisation\'s locations, each with its live areas, staffing counts and tags. Filter by text, state, suburb, location group, area, qualification, staff or manager counts, and tags; archived locations are listed only when `isArchived` is true.  `tenantId` must be your own organisation id, or the call is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * Search locations with their areas
     */
    async tenantGetAllLocation(requestParameters: TenantGetAllLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantGetAllLocation200Response> {
        const response = await this.tenantGetAllLocationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one page of the live areas of one location, with their staff, managers, ratios, qualifications and tags.  `tenantId` must be your own organisation id and the location must be yours, or the call is refused with 403. An archived or deleted location answers 404.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * Search the areas of one location
     */
    async tenantGetAreasByTenantLocationRaw(requestParameters: TenantGetAreasByTenantLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantGetAreasByTenantLocation200Response>> {
        if (requestParameters['tenantGetAreasByTenantLocationRequest'] == null) {
            throw new runtime.RequiredError(
                'tenantGetAreasByTenantLocationRequest',
                'Required parameter "tenantGetAreasByTenantLocationRequest" was null or undefined when calling tenantGetAreasByTenantLocation().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/tenant/get-areas-by-tenant-location`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TenantGetAreasByTenantLocationRequestToJSON(requestParameters['tenantGetAreasByTenantLocationRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantGetAreasByTenantLocation200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one page of the live areas of one location, with their staff, managers, ratios, qualifications and tags.  `tenantId` must be your own organisation id and the location must be yours, or the call is refused with 403. An archived or deleted location answers 404.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * Search the areas of one location
     */
    async tenantGetAreasByTenantLocation(requestParameters: TenantGetAreasByTenantLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantGetAreasByTenantLocation200Response> {
        const response = await this.tenantGetAreasByTenantLocationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns every live location of your organisation (not archived or deleted), with contact details, tags and the number of staff assigned to its areas. An organisation with no locations answers 200 with an empty list.  `tenantId` must be your own organisation id, or the call is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List every location
     */
    async tenantGetLocationRaw(requestParameters: TenantGetLocationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantGetLocation200Response>> {
        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling tenantGetLocation().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/tenant/api/Tenant/get-location`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantGetLocation200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns every live location of your organisation (not archived or deleted), with contact details, tags and the number of staff assigned to its areas. An organisation with no locations answers 200 with an empty list.  `tenantId` must be your own organisation id, or the call is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List every location
     */
    async tenantGetLocation(requestParameters: TenantGetLocationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantGetLocation200Response> {
        const response = await this.tenantGetLocationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the opening hours of one of your locations, day by day, with split hours where a day has more than one range. Only days with hours are listed.  A location with no hours set answers 404. A location of another organisation, or an unknown id, is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * Get a location\'s opening hours
     */
    async tenantGetLocationOperatingHoursByLocationIdRaw(requestParameters: TenantGetLocationOperatingHoursByLocationIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantGetLocationOperatingHoursByLocationId200Response>> {
        if (requestParameters['locationId'] == null) {
            throw new runtime.RequiredError(
                'locationId',
                'Required parameter "locationId" was null or undefined when calling tenantGetLocationOperatingHoursByLocationId().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/tenant/api/Tenant/get-location-operating-hours-by-location-id/{locationId}`;
        urlPath = urlPath.replace(`{${"locationId"}}`, encodeURIComponent(String(requestParameters['locationId'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantGetLocationOperatingHoursByLocationId200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the opening hours of one of your locations, day by day, with split hours where a day has more than one range. Only days with hours are listed.  A location with no hours set answers 404. A location of another organisation, or an unknown id, is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * Get a location\'s opening hours
     */
    async tenantGetLocationOperatingHoursByLocationId(requestParameters: TenantGetLocationOperatingHoursByLocationIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantGetLocationOperatingHoursByLocationId200Response> {
        const response = await this.tenantGetLocationOperatingHoursByLocationIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the id, name and address of each live location of your organisation: a light list for pickers and lookups.  `tenantId` must be your own organisation id, or the call is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List location names and addresses
     */
    async tenantGetLocationsForDropdownRaw(requestParameters: TenantGetLocationsForDropdownRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantGetLocationsForDropdown200Response>> {
        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling tenantGetLocationsForDropdown().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/tenant/get-locations-for-dropdown`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantGetLocationsForDropdown200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the id, name and address of each live location of your organisation: a light list for pickers and lookups.  `tenantId` must be your own organisation id, or the call is refused with 403.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List location names and addresses
     */
    async tenantGetLocationsForDropdown(requestParameters: TenantGetLocationsForDropdownRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantGetLocationsForDropdown200Response> {
        const response = await this.tenantGetLocationsForDropdownRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns your organisation\'s profile: name, contact details, address, ABN, industry, logo and status.  Requires the `organisation.read` scope. Send your own organisation id; another organisation\'s id is refused with 403. An unknown id answers 200 with `data` null.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * Get your organisation profile
     */
    async tenantGetTenantRaw(requestParameters: TenantGetTenantRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantGetTenant200Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling tenantGetTenant().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['id'] != null) {
            queryParameters['id'] = requestParameters['id'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["organisation.read"]);
        }


        let urlPath = `/tenant/api/Tenant/get-tenant`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantGetTenant200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns your organisation\'s profile: name, contact details, address, ABN, industry, logo and status.  Requires the `organisation.read` scope. Send your own organisation id; another organisation\'s id is refused with 403. An unknown id answers 200 with `data` null.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * Get your organisation profile
     */
    async tenantGetTenant(requestParameters: TenantGetTenantRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantGetTenant200Response> {
        const response = await this.tenantGetTenantRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns your organisation\'s current plan: name, tier, display prices, limits, and each module it includes with add-ons resolved for you. The field names are fixed and will not change.  `tenantId` must be your own organisation id. Another organisation\'s id, or an organisation with no active plan, answers 404.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * Get your organisation\'s plan
     */
    async tenantPlansCurrentDetailRaw(requestParameters: TenantPlansCurrentDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantPlansCurrentDetail200Response>> {
        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling tenantPlansCurrentDetail().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["organisation.read"]);
        }


        let urlPath = `/tenant/api/plans/current/{tenantId}/detail`;
        urlPath = urlPath.replace(`{${"tenantId"}}`, encodeURIComponent(String(requestParameters['tenantId'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantPlansCurrentDetail200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns your organisation\'s current plan: name, tier, display prices, limits, and each module it includes with add-ons resolved for you. The field names are fixed and will not change.  `tenantId` must be your own organisation id. Another organisation\'s id, or an organisation with no active plan, answers 404.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * Get your organisation\'s plan
     */
    async tenantPlansCurrentDetail(requestParameters: TenantPlansCurrentDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantPlansCurrentDetail200Response> {
        const response = await this.tenantPlansCurrentDetailRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns each plan limit (locations, staff, custom roles, API credentials) with the cap that applies to your organisation and how much of it is in use.  The staff and custom-role counts are not yet readable by an integration, so those rows come back with `inUse` and `isWithinLimit` null. `tenantId` must be your own organisation id, or the call answers 404.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * Get your plan\'s limits and current usage
     */
    async tenantPlansCurrentUsageRaw(requestParameters: TenantPlansCurrentUsageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantPlansCurrentUsage200Response>> {
        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling tenantPlansCurrentUsage().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["organisation.read"]);
        }


        let urlPath = `/tenant/api/plans/current/{tenantId}/usage`;
        urlPath = urlPath.replace(`{${"tenantId"}}`, encodeURIComponent(String(requestParameters['tenantId'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantPlansCurrentUsage200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns each plan limit (locations, staff, custom roles, API credentials) with the cap that applies to your organisation and how much of it is in use.  The staff and custom-role counts are not yet readable by an integration, so those rows come back with `inUse` and `isWithinLimit` null. `tenantId` must be your own organisation id, or the call answers 404.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * Get your plan\'s limits and current usage
     */
    async tenantPlansCurrentUsage(requestParameters: TenantPlansCurrentUsageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantPlansCurrentUsage200Response> {
        const response = await this.tenantPlansCurrentUsageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Sets the opening hours and time zone of one of your locations, replacing whatever it had. This is how a location gets a time zone through the API. `data` is the location id.  Send the zone as `timeZoneName`, an IANA name such as `Australia/Sydney`, or as the lookup id in `timeZone`; one of the two is required, and they must agree when both are sent. The zone is stored with the hours, so at least one opening time is needed. A missing or unsupported zone, or a schedule with no opening time, a wrong day or a range not running forward within the day, answers 400. A location of another organisation answers 403, and one that does not exist answers 404. `isUpdate`, `createdBy` and `modifiedBy` are ignored.  **Required scope:** `locations.write`  See **Responses** below for the status codes this operation can return.
     * Set a location\'s opening hours and time zone
     */
    async tenantSaveLocationOperatingHoursRaw(requestParameters: TenantSaveLocationOperatingHoursOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantSaveLocationOperatingHours200Response>> {
        if (requestParameters['tenantSaveLocationOperatingHoursRequest'] == null) {
            throw new runtime.RequiredError(
                'tenantSaveLocationOperatingHoursRequest',
                'Required parameter "tenantSaveLocationOperatingHoursRequest" was null or undefined when calling tenantSaveLocationOperatingHours().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["locations.write"]);
        }


        let urlPath = `/tenant/api/Tenant/save-location-operating-hours`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TenantSaveLocationOperatingHoursRequestToJSON(requestParameters['tenantSaveLocationOperatingHoursRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantSaveLocationOperatingHours200ResponseFromJSON(jsonValue));
    }

    /**
     * Sets the opening hours and time zone of one of your locations, replacing whatever it had. This is how a location gets a time zone through the API. `data` is the location id.  Send the zone as `timeZoneName`, an IANA name such as `Australia/Sydney`, or as the lookup id in `timeZone`; one of the two is required, and they must agree when both are sent. The zone is stored with the hours, so at least one opening time is needed. A missing or unsupported zone, or a schedule with no opening time, a wrong day or a range not running forward within the day, answers 400. A location of another organisation answers 403, and one that does not exist answers 404. `isUpdate`, `createdBy` and `modifiedBy` are ignored.  **Required scope:** `locations.write`  See **Responses** below for the status codes this operation can return.
     * Set a location\'s opening hours and time zone
     */
    async tenantSaveLocationOperatingHours(requestParameters: TenantSaveLocationOperatingHoursOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantSaveLocationOperatingHours200Response> {
        const response = await this.tenantSaveLocationOperatingHoursRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one page of your organisation\'s tags, with how often each is used on locations, areas, staff and contracts.  This response is not wrapped in `message`: it is `{ data, totalRecords, page, pageSize }`. `tenantId` must be your own organisation id; any other id answers 404 with only a `message`.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * List your organisation\'s tags
     */
    async tenantTagsRaw(requestParameters: TenantTagsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantTags200Response>> {
        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling tenantTags().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['sortBy'] != null) {
            queryParameters['sortBy'] = requestParameters['sortBy'];
        }

        if (requestParameters['sortOrder'] != null) {
            queryParameters['sortOrder'] = requestParameters['sortOrder'];
        }

        if (requestParameters['pageNumber'] != null) {
            queryParameters['pageNumber'] = requestParameters['pageNumber'];
        }

        if (requestParameters['pageSize'] != null) {
            queryParameters['pageSize'] = requestParameters['pageSize'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["organisation.read"]);
        }


        let urlPath = `/tenant/api/tenant/tags`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantTags200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one page of your organisation\'s tags, with how often each is used on locations, areas, staff and contracts.  This response is not wrapped in `message`: it is `{ data, totalRecords, page, pageSize }`. `tenantId` must be your own organisation id; any other id answers 404 with only a `message`.  **Required scope:** `organisation.read`  See **Responses** below for the status codes this operation can return.
     * List your organisation\'s tags
     */
    async tenantTags(requestParameters: TenantTagsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantTags200Response> {
        const response = await this.tenantTagsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns every live area of your organisation, across all live locations, with staff and manager counts and the names of assigned staff.  Send your own organisation id. Any other id answers 200 with an empty list.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List every area
     */
    async tenantV2GetAreaRaw(requestParameters: TenantV2GetAreaRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantV2GetArea200Response>> {
        if (requestParameters['tenantId'] == null) {
            throw new runtime.RequiredError(
                'tenantId',
                'Required parameter "tenantId" was null or undefined when calling tenantV2GetArea().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tenantId'] != null) {
            queryParameters['tenantId'] = requestParameters['tenantId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/tenant/api/tenant/V2/get-area`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantV2GetArea200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns every live area of your organisation, across all live locations, with staff and manager counts and the names of assigned staff.  Send your own organisation id. Any other id answers 200 with an empty list.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * List every area
     */
    async tenantV2GetArea(requestParameters: TenantV2GetAreaRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantV2GetArea200Response> {
        const response = await this.tenantV2GetAreaRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one location of your organisation, including an archived one, with its address, coordinates, contact details, tags and required qualifications.  A location that does not exist, has been deleted or belongs to another organisation answers 400, the same way in each case.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * Get one location
     */
    async tenantV2GetLocationIdRaw(requestParameters: TenantV2GetLocationIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantV2GetLocationId200Response>> {
        if (requestParameters['tenantLocationId'] == null) {
            throw new runtime.RequiredError(
                'tenantLocationId',
                'Required parameter "tenantLocationId" was null or undefined when calling tenantV2GetLocationId().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['tenantLocationId'] != null) {
            queryParameters['tenantLocationId'] = requestParameters['tenantLocationId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/tenant/api/tenant/V2/get-location-id`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantV2GetLocationId200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one location of your organisation, including an archived one, with its address, coordinates, contact details, tags and required qualifications.  A location that does not exist, has been deleted or belongs to another organisation answers 400, the same way in each case.  **Required scope:** `locations.read` or `locations.write`  See **Responses** below for the status codes this operation can return.
     * Get one location
     */
    async tenantV2GetLocationId(requestParameters: TenantV2GetLocationIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantV2GetLocationId200Response> {
        const response = await this.tenantV2GetLocationIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates an area when `tenantAreaId` is empty or left out, or updates one of yours when it is set. `data` is the area id.  Your integration never changes who works in the area: the area\'s staff and managers are kept as stored. The location, and an edited area, must belong to your organisation, or the call answers 404. Area names must be unique within the location; a duplicate answers 409. An edit saves the fields as sent, so send the whole area: a text field left out is cleared, and `status` left out is 0 (Inactive).  **Required scope:** `locations.write`  See **Responses** below for the status codes this operation can return.
     * Create or update an area
     */
    async tenantV2SaveAreaRaw(requestParameters: TenantV2SaveAreaOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantV2SaveArea200Response>> {
        if (requestParameters['tenantV2SaveAreaRequest'] == null) {
            throw new runtime.RequiredError(
                'tenantV2SaveAreaRequest',
                'Required parameter "tenantV2SaveAreaRequest" was null or undefined when calling tenantV2SaveArea().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["locations.write"]);
        }


        let urlPath = `/tenant/api/tenant/V2/save-area`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TenantV2SaveAreaRequestToJSON(requestParameters['tenantV2SaveAreaRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantV2SaveArea200ResponseFromJSON(jsonValue));
    }

    /**
     * Creates an area when `tenantAreaId` is empty or left out, or updates one of yours when it is set. `data` is the area id.  Your integration never changes who works in the area: the area\'s staff and managers are kept as stored. The location, and an edited area, must belong to your organisation, or the call answers 404. Area names must be unique within the location; a duplicate answers 409. An edit saves the fields as sent, so send the whole area: a text field left out is cleared, and `status` left out is 0 (Inactive).  **Required scope:** `locations.write`  See **Responses** below for the status codes this operation can return.
     * Create or update an area
     */
    async tenantV2SaveArea(requestParameters: TenantV2SaveAreaOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantV2SaveArea200Response> {
        const response = await this.tenantV2SaveAreaRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates a location when `tenantLocationId` is empty or left out, or updates one of yours when it is set. `data` is the location id. The contact person is stored on the location as plain details: your integration never creates or links a login account for them. A refused save answers with `data` null: 409 when a new location would pass your plan\'s location limit, when the name is already used in your organisation, or when the contact person\'s details are already in use; 400 when nothing could be stored. `tenantId` must be your own organisation id, and an edited location must be yours, or the call answers 404. An edit saves every other field as sent, so send the whole location: a field left out is cleared. `status` and `tagsWithColor` apply on create only and are kept as stored on an edit.  A location has no time zone until you set one with \"Set a location\'s opening hours and time zone\".  **Required scope:** `locations.write`  See **Responses** below for the status codes this operation can return.
     * Create or update a location
     */
    async tenantV2SaveLocationRaw(requestParameters: TenantV2SaveLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TenantV2SaveLocation200Response>> {
        if (requestParameters['tenantV2SaveLocationRequest'] == null) {
            throw new runtime.RequiredError(
                'tenantV2SaveLocationRequest',
                'Required parameter "tenantV2SaveLocationRequest" was null or undefined when calling tenantV2SaveLocation().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["locations.write"]);
        }


        let urlPath = `/tenant/api/tenant/V2/save-location`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TenantV2SaveLocationRequestToJSON(requestParameters['tenantV2SaveLocationRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TenantV2SaveLocation200ResponseFromJSON(jsonValue));
    }

    /**
     * Creates a location when `tenantLocationId` is empty or left out, or updates one of yours when it is set. `data` is the location id. The contact person is stored on the location as plain details: your integration never creates or links a login account for them. A refused save answers with `data` null: 409 when a new location would pass your plan\'s location limit, when the name is already used in your organisation, or when the contact person\'s details are already in use; 400 when nothing could be stored. `tenantId` must be your own organisation id, and an edited location must be yours, or the call answers 404. An edit saves every other field as sent, so send the whole location: a field left out is cleared. `status` and `tagsWithColor` apply on create only and are kept as stored on an edit.  A location has no time zone until you set one with \"Set a location\'s opening hours and time zone\".  **Required scope:** `locations.write`  See **Responses** below for the status codes this operation can return.
     * Create or update a location
     */
    async tenantV2SaveLocation(requestParameters: TenantV2SaveLocationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TenantV2SaveLocation200Response> {
        const response = await this.tenantV2SaveLocationRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
