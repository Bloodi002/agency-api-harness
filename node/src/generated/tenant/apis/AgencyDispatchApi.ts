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
  PartnersTenantsAcceptAgencyCandidates200Response,
  PartnersTenantsAcceptAgencyCandidatesForSeries200Response,
  PartnersTenantsAcceptAgencyCandidatesForSeriesRequest,
  PartnersTenantsAcceptAgencyCandidatesRequest,
  PartnersTenantsCancelShiftBroadcast200Response,
  PartnersTenantsCancelShiftBroadcastRequest,
  PartnersTenantsEscalateShiftBroadcast200Response,
  PartnersTenantsEscalateShiftBroadcastRequest,
  PartnersTenantsGetAgencyPerformance200Response,
  PartnersTenantsGetAgencyPerformanceRequest,
  PartnersTenantsGetAgencyRatings200Response,
  PartnersTenantsGetAgencyRatingsRequest,
  PartnersTenantsGetPastWorkers200Response,
  PartnersTenantsGetPastWorkersRequest,
  PartnersTenantsGetShiftBroadcasts200Response,
  PartnersTenantsGetShiftBroadcastsRequest,
  PartnersTenantsOfferShiftToAgencies200Response,
  PartnersTenantsOfferShiftToAgenciesRequest,
  PartnersTenantsRateAgencyPlacement200Response,
  PartnersTenantsRateAgencyPlacementRequest,
  PartnersTenantsRejectAgencyCandidates200Response,
  PartnersTenantsRejectAgencyCandidatesRequest,
  PartnersTenantsRemoveAgencyPlacement200Response,
  PartnersTenantsRemoveAgencyPlacementRequest,
  PartnersTenantsSendShiftToAgencies200Response,
  PartnersTenantsSendShiftToAgenciesRequest,
  PartnersTenantsSendShiftsToAgencies200Response,
  PartnersTenantsSendShiftsToAgenciesRequest,
  PartnersTenantsShiftStaffingChanged200Response,
  PartnersTenantsShiftStaffingChangedRequest,
  ValidationProblem,
} from '../models/index.js';
import {
    EnvelopeFromJSON,
    EnvelopeToJSON,
    PartnersTenantsAcceptAgencyCandidates200ResponseFromJSON,
    PartnersTenantsAcceptAgencyCandidates200ResponseToJSON,
    PartnersTenantsAcceptAgencyCandidatesForSeries200ResponseFromJSON,
    PartnersTenantsAcceptAgencyCandidatesForSeries200ResponseToJSON,
    PartnersTenantsAcceptAgencyCandidatesForSeriesRequestFromJSON,
    PartnersTenantsAcceptAgencyCandidatesForSeriesRequestToJSON,
    PartnersTenantsAcceptAgencyCandidatesRequestFromJSON,
    PartnersTenantsAcceptAgencyCandidatesRequestToJSON,
    PartnersTenantsCancelShiftBroadcast200ResponseFromJSON,
    PartnersTenantsCancelShiftBroadcast200ResponseToJSON,
    PartnersTenantsCancelShiftBroadcastRequestFromJSON,
    PartnersTenantsCancelShiftBroadcastRequestToJSON,
    PartnersTenantsEscalateShiftBroadcast200ResponseFromJSON,
    PartnersTenantsEscalateShiftBroadcast200ResponseToJSON,
    PartnersTenantsEscalateShiftBroadcastRequestFromJSON,
    PartnersTenantsEscalateShiftBroadcastRequestToJSON,
    PartnersTenantsGetAgencyPerformance200ResponseFromJSON,
    PartnersTenantsGetAgencyPerformance200ResponseToJSON,
    PartnersTenantsGetAgencyPerformanceRequestFromJSON,
    PartnersTenantsGetAgencyPerformanceRequestToJSON,
    PartnersTenantsGetAgencyRatings200ResponseFromJSON,
    PartnersTenantsGetAgencyRatings200ResponseToJSON,
    PartnersTenantsGetAgencyRatingsRequestFromJSON,
    PartnersTenantsGetAgencyRatingsRequestToJSON,
    PartnersTenantsGetPastWorkers200ResponseFromJSON,
    PartnersTenantsGetPastWorkers200ResponseToJSON,
    PartnersTenantsGetPastWorkersRequestFromJSON,
    PartnersTenantsGetPastWorkersRequestToJSON,
    PartnersTenantsGetShiftBroadcasts200ResponseFromJSON,
    PartnersTenantsGetShiftBroadcasts200ResponseToJSON,
    PartnersTenantsGetShiftBroadcastsRequestFromJSON,
    PartnersTenantsGetShiftBroadcastsRequestToJSON,
    PartnersTenantsOfferShiftToAgencies200ResponseFromJSON,
    PartnersTenantsOfferShiftToAgencies200ResponseToJSON,
    PartnersTenantsOfferShiftToAgenciesRequestFromJSON,
    PartnersTenantsOfferShiftToAgenciesRequestToJSON,
    PartnersTenantsRateAgencyPlacement200ResponseFromJSON,
    PartnersTenantsRateAgencyPlacement200ResponseToJSON,
    PartnersTenantsRateAgencyPlacementRequestFromJSON,
    PartnersTenantsRateAgencyPlacementRequestToJSON,
    PartnersTenantsRejectAgencyCandidates200ResponseFromJSON,
    PartnersTenantsRejectAgencyCandidates200ResponseToJSON,
    PartnersTenantsRejectAgencyCandidatesRequestFromJSON,
    PartnersTenantsRejectAgencyCandidatesRequestToJSON,
    PartnersTenantsRemoveAgencyPlacement200ResponseFromJSON,
    PartnersTenantsRemoveAgencyPlacement200ResponseToJSON,
    PartnersTenantsRemoveAgencyPlacementRequestFromJSON,
    PartnersTenantsRemoveAgencyPlacementRequestToJSON,
    PartnersTenantsSendShiftToAgencies200ResponseFromJSON,
    PartnersTenantsSendShiftToAgencies200ResponseToJSON,
    PartnersTenantsSendShiftToAgenciesRequestFromJSON,
    PartnersTenantsSendShiftToAgenciesRequestToJSON,
    PartnersTenantsSendShiftsToAgencies200ResponseFromJSON,
    PartnersTenantsSendShiftsToAgencies200ResponseToJSON,
    PartnersTenantsSendShiftsToAgenciesRequestFromJSON,
    PartnersTenantsSendShiftsToAgenciesRequestToJSON,
    PartnersTenantsShiftStaffingChanged200ResponseFromJSON,
    PartnersTenantsShiftStaffingChanged200ResponseToJSON,
    PartnersTenantsShiftStaffingChangedRequestFromJSON,
    PartnersTenantsShiftStaffingChangedRequestToJSON,
    ValidationProblemFromJSON,
    ValidationProblemToJSON,
} from '../models/index.js';

export interface PartnersTenantsAcceptAgencyCandidatesOperationRequest {
    partnersTenantsAcceptAgencyCandidatesRequest: PartnersTenantsAcceptAgencyCandidatesRequest;
}

export interface PartnersTenantsAcceptAgencyCandidatesForSeriesOperationRequest {
    partnersTenantsAcceptAgencyCandidatesForSeriesRequest: PartnersTenantsAcceptAgencyCandidatesForSeriesRequest;
}

export interface PartnersTenantsCancelShiftBroadcastOperationRequest {
    partnersTenantsCancelShiftBroadcastRequest: PartnersTenantsCancelShiftBroadcastRequest;
}

export interface PartnersTenantsEscalateShiftBroadcastOperationRequest {
    partnersTenantsEscalateShiftBroadcastRequest: PartnersTenantsEscalateShiftBroadcastRequest;
}

export interface PartnersTenantsGetAgencyPerformanceOperationRequest {
    partnersTenantsGetAgencyPerformanceRequest: PartnersTenantsGetAgencyPerformanceRequest;
}

export interface PartnersTenantsGetAgencyRatingsOperationRequest {
    partnersTenantsGetAgencyRatingsRequest: PartnersTenantsGetAgencyRatingsRequest;
}

export interface PartnersTenantsGetPastWorkersOperationRequest {
    partnersTenantsGetPastWorkersRequest: PartnersTenantsGetPastWorkersRequest;
}

export interface PartnersTenantsGetShiftBroadcastsOperationRequest {
    partnersTenantsGetShiftBroadcastsRequest: PartnersTenantsGetShiftBroadcastsRequest;
}

export interface PartnersTenantsOfferShiftToAgenciesOperationRequest {
    partnersTenantsOfferShiftToAgenciesRequest: PartnersTenantsOfferShiftToAgenciesRequest;
}

export interface PartnersTenantsRateAgencyPlacementOperationRequest {
    partnersTenantsRateAgencyPlacementRequest: PartnersTenantsRateAgencyPlacementRequest;
}

export interface PartnersTenantsRejectAgencyCandidatesOperationRequest {
    partnersTenantsRejectAgencyCandidatesRequest: PartnersTenantsRejectAgencyCandidatesRequest;
}

export interface PartnersTenantsRemoveAgencyPlacementOperationRequest {
    partnersTenantsRemoveAgencyPlacementRequest: PartnersTenantsRemoveAgencyPlacementRequest;
}

export interface PartnersTenantsSendShiftToAgenciesOperationRequest {
    partnersTenantsSendShiftToAgenciesRequest: PartnersTenantsSendShiftToAgenciesRequest;
}

export interface PartnersTenantsSendShiftsToAgenciesOperationRequest {
    partnersTenantsSendShiftsToAgenciesRequest: PartnersTenantsSendShiftsToAgenciesRequest;
}

export interface PartnersTenantsShiftStaffingChangedOperationRequest {
    partnersTenantsShiftStaffingChangedRequest: PartnersTenantsShiftStaffingChangedRequest;
}

/**
 * AgencyDispatchApi - interface
 * 
 * @export
 * @interface AgencyDispatchApiInterface
 */
export interface AgencyDispatchApiInterface {
    /**
     * Places candidates on the shift and counts them against its open places. Take the ids from get-shift-broadcasts (`tblAgencyPlacementId`). Your organisation comes from your token; any tenant id you send is replaced. The agencies receive a shift.candidate.accepted event.  The request must belong to your organisation (otherwise 404). Candidates already accepted, declined or withdrawn are skipped and returned in `skippedIds`; if none can be placed the call is refused with 400. It is refused with 409 when the request is cancelled or filled, the shift has finished, accepting would place more people than the shift still needs (your own rostered staff included), or a candidate is booked on an overlapping shift.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary Accept candidates an agency put forward
     * @param {PartnersTenantsAcceptAgencyCandidatesRequest} partnersTenantsAcceptAgencyCandidatesRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsAcceptAgencyCandidatesRaw(requestParameters: PartnersTenantsAcceptAgencyCandidatesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsAcceptAgencyCandidates200Response>>;

    /**
     * Places candidates on the shift and counts them against its open places. Take the ids from get-shift-broadcasts (`tblAgencyPlacementId`). Your organisation comes from your token; any tenant id you send is replaced. The agencies receive a shift.candidate.accepted event.  The request must belong to your organisation (otherwise 404). Candidates already accepted, declined or withdrawn are skipped and returned in `skippedIds`; if none can be placed the call is refused with 400. It is refused with 409 when the request is cancelled or filled, the shift has finished, accepting would place more people than the shift still needs (your own rostered staff included), or a candidate is booked on an overlapping shift.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Accept candidates an agency put forward
     */
    partnersTenantsAcceptAgencyCandidates(requestParameters: PartnersTenantsAcceptAgencyCandidatesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsAcceptAgencyCandidates200Response>;

    /**
     * Places the same agency workers on every live occurrence of one recurring series, up to 200 occurrences, in date order. Each date is checked the way \"Accept agency candidates\" checks one shift, and a date that cannot take them is reported in `occurrences` rather than failing the call. Your organisation comes from your token.  Answers 200 when at least one date took a worker. Answers 400 when none did, and when `recurrenceGroupId` or `tblAgencyStaffIds` is empty. A series with no live occurrences, or one belonging to another organisation, answers 404. A date whose rate differs from `confirmedRates` is reported, not agreed unseen.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary Accept agency candidates across a recurring series
     * @param {PartnersTenantsAcceptAgencyCandidatesForSeriesRequest} partnersTenantsAcceptAgencyCandidatesForSeriesRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsAcceptAgencyCandidatesForSeriesRaw(requestParameters: PartnersTenantsAcceptAgencyCandidatesForSeriesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsAcceptAgencyCandidatesForSeries200Response>>;

    /**
     * Places the same agency workers on every live occurrence of one recurring series, up to 200 occurrences, in date order. Each date is checked the way \"Accept agency candidates\" checks one shift, and a date that cannot take them is reported in `occurrences` rather than failing the call. Your organisation comes from your token.  Answers 200 when at least one date took a worker. Answers 400 when none did, and when `recurrenceGroupId` or `tblAgencyStaffIds` is empty. A series with no live occurrences, or one belonging to another organisation, answers 404. A date whose rate differs from `confirmedRates` is reported, not agreed unseen.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Accept agency candidates across a recurring series
     */
    partnersTenantsAcceptAgencyCandidatesForSeries(requestParameters: PartnersTenantsAcceptAgencyCandidatesForSeriesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsAcceptAgencyCandidatesForSeries200Response>;

    /**
     * Closes every agency request for a shift: each agency\'s request is withdrawn, candidates still waiting are closed as expired, and anyone booked on it is released. Nothing is deleted; the agencies keep the request, marked cancelled, and are told by email and by a shift.request.cancelled event. Your organisation comes from your token; any tenant id you send is replaced. Returns 404 when the shift has no open agency request.  When your integration deletes an open shift through the roster API, that call makes this one for you with your token, which is why `rosters.write` is enough. Call it yourself only if that follow-up did not go through (the shift is gone but the request still shows as live), or with `agency_dispatch.write` to withdraw a shift from agencies. It does not check that the shift has been deleted, so a shift still on your roster stays there with nobody from an agency on it.  **Required scope:** `rosters.write` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary Close agency requests for a deleted shift
     * @param {PartnersTenantsCancelShiftBroadcastRequest} partnersTenantsCancelShiftBroadcastRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsCancelShiftBroadcastRaw(requestParameters: PartnersTenantsCancelShiftBroadcastOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsCancelShiftBroadcast200Response>>;

    /**
     * Closes every agency request for a shift: each agency\'s request is withdrawn, candidates still waiting are closed as expired, and anyone booked on it is released. Nothing is deleted; the agencies keep the request, marked cancelled, and are told by email and by a shift.request.cancelled event. Your organisation comes from your token; any tenant id you send is replaced. Returns 404 when the shift has no open agency request.  When your integration deletes an open shift through the roster API, that call makes this one for you with your token, which is why `rosters.write` is enough. Call it yourself only if that follow-up did not go through (the shift is gone but the request still shows as live), or with `agency_dispatch.write` to withdraw a shift from agencies. It does not check that the shift has been deleted, so a shift still on your roster stays there with nobody from an agency on it.  **Required scope:** `rosters.write` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Close agency requests for a deleted shift
     */
    partnersTenantsCancelShiftBroadcast(requestParameters: PartnersTenantsCancelShiftBroadcastOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsCancelShiftBroadcast200Response>;

    /**
     * Moves the request up one escalation tier and notifies again every agency that has not yet answered. `renotifiedAgencyCount` of 0 means every agency has already answered. Your organisation comes from your token; any tenant id you send is replaced. The agencies receive a shift.request.escalated event.  The request must belong to your organisation (otherwise 404). It is refused with 409 when the request is cancelled, expired or filled, or has closed.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary Chase agencies that have not answered a request
     * @param {PartnersTenantsEscalateShiftBroadcastRequest} partnersTenantsEscalateShiftBroadcastRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsEscalateShiftBroadcastRaw(requestParameters: PartnersTenantsEscalateShiftBroadcastOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsEscalateShiftBroadcast200Response>>;

    /**
     * Moves the request up one escalation tier and notifies again every agency that has not yet answered. `renotifiedAgencyCount` of 0 means every agency has already answered. Your organisation comes from your token; any tenant id you send is replaced. The agencies receive a shift.request.escalated event.  The request must belong to your organisation (otherwise 404). It is refused with 409 when the request is cancelled, expired or filled, or has closed.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Chase agencies that have not answered a request
     */
    partnersTenantsEscalateShiftBroadcast(requestParameters: PartnersTenantsEscalateShiftBroadcastOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsEscalateShiftBroadcast200Response>;

    /**
     * Returns measured performance for each of your partner agencies over a window: requests sent, responses, declines, placements, fill, on-time and no-show rates, compliance, reliability, ratings, a monthly trend and their most-used workers, plus averages across them. Your organisation comes from your token; any tenant id you send is replaced.  `fromDate` and `toDate` set the window by whole days. When `fromDate` is left out the window starts your organisation\'s agency metric window before today (90 days unless you have changed it), and a missing `toDate` means today. Rates are percentages from 0 to 100; a null figure means there was nothing to measure yet, and the averages leave those agencies out.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get performance figures for your agencies
     * @param {PartnersTenantsGetAgencyPerformanceRequest} partnersTenantsGetAgencyPerformanceRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsGetAgencyPerformanceRaw(requestParameters: PartnersTenantsGetAgencyPerformanceOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsGetAgencyPerformance200Response>>;

    /**
     * Returns measured performance for each of your partner agencies over a window: requests sent, responses, declines, placements, fill, on-time and no-show rates, compliance, reliability, ratings, a monthly trend and their most-used workers, plus averages across them. Your organisation comes from your token; any tenant id you send is replaced.  `fromDate` and `toDate` set the window by whole days. When `fromDate` is left out the window starts your organisation\'s agency metric window before today (90 days unless you have changed it), and a missing `toDate` means today. Rates are percentages from 0 to 100; a null figure means there was nothing to measure yet, and the averages leave those agencies out.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Get performance figures for your agencies
     */
    partnersTenantsGetAgencyPerformance(requestParameters: PartnersTenantsGetAgencyPerformanceOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsGetAgencyPerformance200Response>;

    /**
     * Returns worked, ended agency shifts at your organisation, newest first, with your rating where you have given one, plus how many fall in each tab. Your organisation comes from your token; any tenant id you send is replaced.  `tab` chooses which to list: 0 All · 1 To rate (default) · 2 Rated. Filter by agency, location, and shift start date (`fromDate` and `toDate`, whole days, both inclusive), and search on the worker\'s or agency\'s name. Paged with `page` and `pageSize` (default 10); `totalRecords` is the count for the chosen tab. A shift you have not rated counts as 5 stars in the agency\'s rating.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary List agency shifts to rate and ratings given
     * @param {PartnersTenantsGetAgencyRatingsRequest} partnersTenantsGetAgencyRatingsRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsGetAgencyRatingsRaw(requestParameters: PartnersTenantsGetAgencyRatingsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsGetAgencyRatings200Response>>;

    /**
     * Returns worked, ended agency shifts at your organisation, newest first, with your rating where you have given one, plus how many fall in each tab. Your organisation comes from your token; any tenant id you send is replaced.  `tab` chooses which to list: 0 All · 1 To rate (default) · 2 Rated. Filter by agency, location, and shift start date (`fromDate` and `toDate`, whole days, both inclusive), and search on the worker\'s or agency\'s name. Paged with `page` and `pageSize` (default 10); `totalRecords` is the count for the chosen tab. A shift you have not rated counts as 5 stars in the agency\'s rating.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * List agency shifts to rate and ratings given
     */
    partnersTenantsGetAgencyRatings(requestParameters: PartnersTenantsGetAgencyRatingsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsGetAgencyRatings200Response>;

    /**
     * Returns agency workers who have worked at least one shift for your organisation that stood (cancelled, refused, replaced and no-show bookings do not count), most recent first, with how many shifts, when they last worked, their rating across every client and whether you have liked them. Your organisation comes from your token; any tenant id you send is replaced.  Narrow to the agencies you are considering (an empty list means every agency) and to one location, so \"has worked here before\" means that site. Use a worker\'s `tblAgencyStaffId` in `requestedStaffIds` when sending a shift. The list is not paged.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary List agency workers who have worked for you
     * @param {PartnersTenantsGetPastWorkersRequest} partnersTenantsGetPastWorkersRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsGetPastWorkersRaw(requestParameters: PartnersTenantsGetPastWorkersOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsGetPastWorkers200Response>>;

    /**
     * Returns agency workers who have worked at least one shift for your organisation that stood (cancelled, refused, replaced and no-show bookings do not count), most recent first, with how many shifts, when they last worked, their rating across every client and whether you have liked them. Your organisation comes from your token; any tenant id you send is replaced.  Narrow to the agencies you are considering (an empty list means every agency) and to one location, so \"has worked here before\" means that site. Use a worker\'s `tblAgencyStaffId` in `requestedStaffIds` when sending a shift. The list is not paged.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * List agency workers who have worked for you
     */
    partnersTenantsGetPastWorkers(requestParameters: PartnersTenantsGetPastWorkersOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsGetPastWorkers200Response>;

    /**
     * Returns your organisation\'s shift requests to agencies, newest first, each with every agency it went to, how that agency has responded and the candidates it has put forward. Your organisation comes from your token; any tenant id you send is replaced.  By default only requests still running are listed: cancelled and expired ones are left out, filled ones stay. Set `liveOnly` to false to include everything. Narrow to one shift, one send (`dispatchId`) or one recurring series. Results are paged with `page` and `pageSize` (default 25) and come back as a plain list with no total. A worker the agency asked by email appears only once they have said yes and the agency has passed them on.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary List your shift requests to agencies
     * @param {PartnersTenantsGetShiftBroadcastsRequest} partnersTenantsGetShiftBroadcastsRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsGetShiftBroadcastsRaw(requestParameters: PartnersTenantsGetShiftBroadcastsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsGetShiftBroadcasts200Response>>;

    /**
     * Returns your organisation\'s shift requests to agencies, newest first, each with every agency it went to, how that agency has responded and the candidates it has put forward. Your organisation comes from your token; any tenant id you send is replaced.  By default only requests still running are listed: cancelled and expired ones are left out, filled ones stay. Set `liveOnly` to false to include everything. Narrow to one shift, one send (`dispatchId`) or one recurring series. Results are paged with `page` and `pageSize` (default 25) and come back as a plain list with no total. A worker the agency asked by email appears only once they have said yes and the agency has passed them on.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * List your shift requests to agencies
     */
    partnersTenantsGetShiftBroadcasts(requestParameters: PartnersTenantsGetShiftBroadcastsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsGetShiftBroadcasts200Response>;

    /**
     * Offers one open shift to every agency approved for its location, with nothing else to choose: the offer stands until the shift starts, nobody is chased, candidates always wait for you, and no rate is imposed (the rate agreed with each agency applies where there is one). The urgency is taken from the shift. Your organisation comes from your token; any tenant id you send is replaced.  The shift must belong to your organisation (otherwise 404) and have a location (otherwise 400). It is refused with 409 when it is not an open shift, is already fully staffed or has started, or when no agency is approved for its location. Offering a shift that already has a request amends it.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary Offer a shift to every approved agency
     * @param {PartnersTenantsOfferShiftToAgenciesRequest} partnersTenantsOfferShiftToAgenciesRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsOfferShiftToAgenciesRaw(requestParameters: PartnersTenantsOfferShiftToAgenciesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsOfferShiftToAgencies200Response>>;

    /**
     * Offers one open shift to every agency approved for its location, with nothing else to choose: the offer stands until the shift starts, nobody is chased, candidates always wait for you, and no rate is imposed (the rate agreed with each agency applies where there is one). The urgency is taken from the shift. Your organisation comes from your token; any tenant id you send is replaced.  The shift must belong to your organisation (otherwise 404) and have a location (otherwise 400). It is refused with 409 when it is not an open shift, is already fully staffed or has started, or when no agency is approved for its location. Offering a shift that already has a request amends it.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Offer a shift to every approved agency
     */
    partnersTenantsOfferShiftToAgencies(requestParameters: PartnersTenantsOfferShiftToAgenciesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsOfferShiftToAgencies200Response>;

    /**
     * Records your rating of the agency worker who worked a shift; the agency\'s own rating is built from these. Take the id from get-agency-ratings. Your organisation comes from your token; any tenant id you send is replaced. Returns the new rating\'s id.  The placement must belong to your organisation (otherwise 404). Only a worked shift whose scheduled end has passed can be rated (otherwise 400). Each placement is rated once and a rating cannot be changed: a second rating is refused with 409. `issueDescription` is required when `issueReported` is true.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary Rate an agency worker after a shift
     * @param {PartnersTenantsRateAgencyPlacementRequest} partnersTenantsRateAgencyPlacementRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsRateAgencyPlacementRaw(requestParameters: PartnersTenantsRateAgencyPlacementOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsRateAgencyPlacement200Response>>;

    /**
     * Records your rating of the agency worker who worked a shift; the agency\'s own rating is built from these. Take the id from get-agency-ratings. Your organisation comes from your token; any tenant id you send is replaced. Returns the new rating\'s id.  The placement must belong to your organisation (otherwise 404). Only a worked shift whose scheduled end has passed can be rated (otherwise 400). Each placement is rated once and a rating cannot be changed: a second rating is refused with 409. `issueDescription` is required when `issueReported` is true.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Rate an agency worker after a shift
     */
    partnersTenantsRateAgencyPlacement(requestParameters: PartnersTenantsRateAgencyPlacementOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsRateAgencyPlacement200Response>;

    /**
     * Turns down candidates. Nobody is placed, so the shift\'s places stay open for other candidates. Your organisation comes from your token; any tenant id you send is replaced. The reason is shown to the agency, and the agencies receive a shift.candidate.rejected event.  The request must belong to your organisation (otherwise 404). Candidates already accepted, declined or withdrawn are skipped and returned in `skippedIds`; if none can be declined the call is refused with 400.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary Decline candidates an agency put forward
     * @param {PartnersTenantsRejectAgencyCandidatesRequest} partnersTenantsRejectAgencyCandidatesRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsRejectAgencyCandidatesRaw(requestParameters: PartnersTenantsRejectAgencyCandidatesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsRejectAgencyCandidates200Response>>;

    /**
     * Turns down candidates. Nobody is placed, so the shift\'s places stay open for other candidates. Your organisation comes from your token; any tenant id you send is replaced. The reason is shown to the agency, and the agencies receive a shift.candidate.rejected event.  The request must belong to your organisation (otherwise 404). Candidates already accepted, declined or withdrawn are skipped and returned in `skippedIds`; if none can be declined the call is refused with 400.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Decline candidates an agency put forward
     */
    partnersTenantsRejectAgencyCandidates(requestParameters: PartnersTenantsRejectAgencyCandidatesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsRejectAgencyCandidates200Response>;

    /**
     * Cancels the booking of an agency worker taken off a shift and hands the place back to the request, so agencies can fill it again. The agency is told by email and by a shift.placement.cancelled event. Your organisation comes from your token; any tenant id you send is replaced. Returns 404 when that worker has no live booking on the shift.  When your integration removes an agency worker from a shift through the roster API, that call makes this one for you with your token, which is why `rosters.write` is enough. Call it yourself only if that follow-up did not go through. Remove the worker from the roster first: this call does not check, and on its own leaves the roster showing a worker whose booking is cancelled.  **Required scope:** `rosters.write` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary Cancel an agency booking after removing the worker
     * @param {PartnersTenantsRemoveAgencyPlacementRequest} partnersTenantsRemoveAgencyPlacementRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsRemoveAgencyPlacementRaw(requestParameters: PartnersTenantsRemoveAgencyPlacementOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsRemoveAgencyPlacement200Response>>;

    /**
     * Cancels the booking of an agency worker taken off a shift and hands the place back to the request, so agencies can fill it again. The agency is told by email and by a shift.placement.cancelled event. Your organisation comes from your token; any tenant id you send is replaced. Returns 404 when that worker has no live booking on the shift.  When your integration removes an agency worker from a shift through the roster API, that call makes this one for you with your token, which is why `rosters.write` is enough. Call it yourself only if that follow-up did not go through. Remove the worker from the roster first: this call does not check, and on its own leaves the roster showing a worker whose booking is cancelled.  **Required scope:** `rosters.write` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Cancel an agency booking after removing the worker
     */
    partnersTenantsRemoveAgencyPlacement(requestParameters: PartnersTenantsRemoveAgencyPlacementOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsRemoveAgencyPlacement200Response>;

    /**
     * Sends one open shift to the agencies you name, on your terms. If the shift already has a request this amends it (`wasUpdated`), and a shift already offered to every approved agency is turned into this request, keeping any candidates already put forward. Your organisation comes from your token; any tenant id you send is replaced. Agencies with `isPushWebhook` receive a shift.request.received event.  The shift must belong to your organisation (otherwise 404) and have a location (otherwise 400). It is refused with 409, listing each reason, when it is not an open shift, is already fully staffed, has started, or names an agency that is not an active partner approved for the shift\'s location, or a rate card that is not available to you. Every agency needs at least one notification channel, and auto-accept needs a rate ceiling (the agency\'s rate, a rate card, or `maxPayRate`). Under a tiered cascade the agency ranked n is notified (n - 1) × `autoEscalateAfterMinutes` after sending; any delay you send per agency is ignored.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary Send a shift to chosen agencies
     * @param {PartnersTenantsSendShiftToAgenciesRequest} partnersTenantsSendShiftToAgenciesRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsSendShiftToAgenciesRaw(requestParameters: PartnersTenantsSendShiftToAgenciesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsSendShiftToAgencies200Response>>;

    /**
     * Sends one open shift to the agencies you name, on your terms. If the shift already has a request this amends it (`wasUpdated`), and a shift already offered to every approved agency is turned into this request, keeping any candidates already put forward. Your organisation comes from your token; any tenant id you send is replaced. Agencies with `isPushWebhook` receive a shift.request.received event.  The shift must belong to your organisation (otherwise 404) and have a location (otherwise 400). It is refused with 409, listing each reason, when it is not an open shift, is already fully staffed, has started, or names an agency that is not an active partner approved for the shift\'s location, or a rate card that is not available to you. Every agency needs at least one notification channel, and auto-accept needs a rate ceiling (the agency\'s rate, a rate card, or `maxPayRate`). Under a tiered cascade the agency ranked n is notified (n - 1) × `autoEscalateAfterMinutes` after sending; any delay you send per agency is ignored.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Send a shift to chosen agencies
     */
    partnersTenantsSendShiftToAgencies(requestParameters: PartnersTenantsSendShiftToAgenciesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsSendShiftToAgencies200Response>;

    /**
     * Sends up to 200 open shifts to the same agencies on the same terms: one request per shift, all carrying the `dispatchId` returned. Your organisation comes from your token; any tenant id you send is replaced.  Each shift is checked and sent on its own, under the same rules as sending one shift. Shifts that could not be sent are listed in `blocked` with the reason, and the rest still go. If no shift could be sent the call is refused with 409, listing every reason. Each shift id must appear once.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary Send several shifts to agencies at once
     * @param {PartnersTenantsSendShiftsToAgenciesRequest} partnersTenantsSendShiftsToAgenciesRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsSendShiftsToAgenciesRaw(requestParameters: PartnersTenantsSendShiftsToAgenciesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsSendShiftsToAgencies200Response>>;

    /**
     * Sends up to 200 open shifts to the same agencies on the same terms: one request per shift, all carrying the `dispatchId` returned. Your organisation comes from your token; any tenant id you send is replaced.  Each shift is checked and sent on its own, under the same rules as sending one shift. Shifts that could not be sent are listed in `blocked` with the reason, and the rest still go. If no shift could be sent the call is refused with 409, listing every reason. Each shift id must appear once.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Send several shifts to agencies at once
     */
    partnersTenantsSendShiftsToAgencies(requestParameters: PartnersTenantsSendShiftsToAgenciesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsSendShiftsToAgencies200Response>;

    /**
     * Brings an agency request into line with its shift after your own staff have been rostered onto it: agencies may then fill only the places left, and a request with none left closes as filled (agencies are told with a shift.request.filled event). Bookings already made stand. Your organisation comes from your token; any tenant id you send is replaced. Returns 404 when the shift has no live agency request.  When your integration rosters your own staff onto an open shift through the roster API, that call makes this one for you with your token, which is why `rosters.write` is enough. Call it yourself only if that follow-up did not go through and the request still shows more places than the shift needs.  **Required scope:** `rosters.write` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * @summary Update an agency request after rostering your own staff
     * @param {PartnersTenantsShiftStaffingChangedRequest} partnersTenantsShiftStaffingChangedRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgencyDispatchApiInterface
     */
    partnersTenantsShiftStaffingChangedRaw(requestParameters: PartnersTenantsShiftStaffingChangedOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsShiftStaffingChanged200Response>>;

    /**
     * Brings an agency request into line with its shift after your own staff have been rostered onto it: agencies may then fill only the places left, and a request with none left closes as filled (agencies are told with a shift.request.filled event). Bookings already made stand. Your organisation comes from your token; any tenant id you send is replaced. Returns 404 when the shift has no live agency request.  When your integration rosters your own staff onto an open shift through the roster API, that call makes this one for you with your token, which is why `rosters.write` is enough. Call it yourself only if that follow-up did not go through and the request still shows more places than the shift needs.  **Required scope:** `rosters.write` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Update an agency request after rostering your own staff
     */
    partnersTenantsShiftStaffingChanged(requestParameters: PartnersTenantsShiftStaffingChangedOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsShiftStaffingChanged200Response>;

}

/**
 * 
 */
export class AgencyDispatchApi extends runtime.BaseAPI implements AgencyDispatchApiInterface {

    /**
     * Places candidates on the shift and counts them against its open places. Take the ids from get-shift-broadcasts (`tblAgencyPlacementId`). Your organisation comes from your token; any tenant id you send is replaced. The agencies receive a shift.candidate.accepted event.  The request must belong to your organisation (otherwise 404). Candidates already accepted, declined or withdrawn are skipped and returned in `skippedIds`; if none can be placed the call is refused with 400. It is refused with 409 when the request is cancelled or filled, the shift has finished, accepting would place more people than the shift still needs (your own rostered staff included), or a candidate is booked on an overlapping shift.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Accept candidates an agency put forward
     */
    async partnersTenantsAcceptAgencyCandidatesRaw(requestParameters: PartnersTenantsAcceptAgencyCandidatesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsAcceptAgencyCandidates200Response>> {
        if (requestParameters['partnersTenantsAcceptAgencyCandidatesRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsAcceptAgencyCandidatesRequest',
                'Required parameter "partnersTenantsAcceptAgencyCandidatesRequest" was null or undefined when calling partnersTenantsAcceptAgencyCandidates().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["agency_dispatch.write"]);
        }


        let urlPath = `/partners/tenants/accept-agency-candidates`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsAcceptAgencyCandidatesRequestToJSON(requestParameters['partnersTenantsAcceptAgencyCandidatesRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsAcceptAgencyCandidates200ResponseFromJSON(jsonValue));
    }

    /**
     * Places candidates on the shift and counts them against its open places. Take the ids from get-shift-broadcasts (`tblAgencyPlacementId`). Your organisation comes from your token; any tenant id you send is replaced. The agencies receive a shift.candidate.accepted event.  The request must belong to your organisation (otherwise 404). Candidates already accepted, declined or withdrawn are skipped and returned in `skippedIds`; if none can be placed the call is refused with 400. It is refused with 409 when the request is cancelled or filled, the shift has finished, accepting would place more people than the shift still needs (your own rostered staff included), or a candidate is booked on an overlapping shift.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Accept candidates an agency put forward
     */
    async partnersTenantsAcceptAgencyCandidates(requestParameters: PartnersTenantsAcceptAgencyCandidatesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsAcceptAgencyCandidates200Response> {
        const response = await this.partnersTenantsAcceptAgencyCandidatesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Places the same agency workers on every live occurrence of one recurring series, up to 200 occurrences, in date order. Each date is checked the way \"Accept agency candidates\" checks one shift, and a date that cannot take them is reported in `occurrences` rather than failing the call. Your organisation comes from your token.  Answers 200 when at least one date took a worker. Answers 400 when none did, and when `recurrenceGroupId` or `tblAgencyStaffIds` is empty. A series with no live occurrences, or one belonging to another organisation, answers 404. A date whose rate differs from `confirmedRates` is reported, not agreed unseen.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Accept agency candidates across a recurring series
     */
    async partnersTenantsAcceptAgencyCandidatesForSeriesRaw(requestParameters: PartnersTenantsAcceptAgencyCandidatesForSeriesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsAcceptAgencyCandidatesForSeries200Response>> {
        if (requestParameters['partnersTenantsAcceptAgencyCandidatesForSeriesRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsAcceptAgencyCandidatesForSeriesRequest',
                'Required parameter "partnersTenantsAcceptAgencyCandidatesForSeriesRequest" was null or undefined when calling partnersTenantsAcceptAgencyCandidatesForSeries().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["agency_dispatch.write"]);
        }


        let urlPath = `/partners/tenants/accept-agency-candidates-for-series`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsAcceptAgencyCandidatesForSeriesRequestToJSON(requestParameters['partnersTenantsAcceptAgencyCandidatesForSeriesRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsAcceptAgencyCandidatesForSeries200ResponseFromJSON(jsonValue));
    }

    /**
     * Places the same agency workers on every live occurrence of one recurring series, up to 200 occurrences, in date order. Each date is checked the way \"Accept agency candidates\" checks one shift, and a date that cannot take them is reported in `occurrences` rather than failing the call. Your organisation comes from your token.  Answers 200 when at least one date took a worker. Answers 400 when none did, and when `recurrenceGroupId` or `tblAgencyStaffIds` is empty. A series with no live occurrences, or one belonging to another organisation, answers 404. A date whose rate differs from `confirmedRates` is reported, not agreed unseen.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Accept agency candidates across a recurring series
     */
    async partnersTenantsAcceptAgencyCandidatesForSeries(requestParameters: PartnersTenantsAcceptAgencyCandidatesForSeriesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsAcceptAgencyCandidatesForSeries200Response> {
        const response = await this.partnersTenantsAcceptAgencyCandidatesForSeriesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Closes every agency request for a shift: each agency\'s request is withdrawn, candidates still waiting are closed as expired, and anyone booked on it is released. Nothing is deleted; the agencies keep the request, marked cancelled, and are told by email and by a shift.request.cancelled event. Your organisation comes from your token; any tenant id you send is replaced. Returns 404 when the shift has no open agency request.  When your integration deletes an open shift through the roster API, that call makes this one for you with your token, which is why `rosters.write` is enough. Call it yourself only if that follow-up did not go through (the shift is gone but the request still shows as live), or with `agency_dispatch.write` to withdraw a shift from agencies. It does not check that the shift has been deleted, so a shift still on your roster stays there with nobody from an agency on it.  **Required scope:** `rosters.write` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Close agency requests for a deleted shift
     */
    async partnersTenantsCancelShiftBroadcastRaw(requestParameters: PartnersTenantsCancelShiftBroadcastOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsCancelShiftBroadcast200Response>> {
        if (requestParameters['partnersTenantsCancelShiftBroadcastRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsCancelShiftBroadcastRequest',
                'Required parameter "partnersTenantsCancelShiftBroadcastRequest" was null or undefined when calling partnersTenantsCancelShiftBroadcast().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/partners/tenants/cancel-shift-broadcast`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsCancelShiftBroadcastRequestToJSON(requestParameters['partnersTenantsCancelShiftBroadcastRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsCancelShiftBroadcast200ResponseFromJSON(jsonValue));
    }

    /**
     * Closes every agency request for a shift: each agency\'s request is withdrawn, candidates still waiting are closed as expired, and anyone booked on it is released. Nothing is deleted; the agencies keep the request, marked cancelled, and are told by email and by a shift.request.cancelled event. Your organisation comes from your token; any tenant id you send is replaced. Returns 404 when the shift has no open agency request.  When your integration deletes an open shift through the roster API, that call makes this one for you with your token, which is why `rosters.write` is enough. Call it yourself only if that follow-up did not go through (the shift is gone but the request still shows as live), or with `agency_dispatch.write` to withdraw a shift from agencies. It does not check that the shift has been deleted, so a shift still on your roster stays there with nobody from an agency on it.  **Required scope:** `rosters.write` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Close agency requests for a deleted shift
     */
    async partnersTenantsCancelShiftBroadcast(requestParameters: PartnersTenantsCancelShiftBroadcastOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsCancelShiftBroadcast200Response> {
        const response = await this.partnersTenantsCancelShiftBroadcastRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Moves the request up one escalation tier and notifies again every agency that has not yet answered. `renotifiedAgencyCount` of 0 means every agency has already answered. Your organisation comes from your token; any tenant id you send is replaced. The agencies receive a shift.request.escalated event.  The request must belong to your organisation (otherwise 404). It is refused with 409 when the request is cancelled, expired or filled, or has closed.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Chase agencies that have not answered a request
     */
    async partnersTenantsEscalateShiftBroadcastRaw(requestParameters: PartnersTenantsEscalateShiftBroadcastOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsEscalateShiftBroadcast200Response>> {
        if (requestParameters['partnersTenantsEscalateShiftBroadcastRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsEscalateShiftBroadcastRequest',
                'Required parameter "partnersTenantsEscalateShiftBroadcastRequest" was null or undefined when calling partnersTenantsEscalateShiftBroadcast().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["agency_dispatch.write"]);
        }


        let urlPath = `/partners/tenants/escalate-shift-broadcast`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsEscalateShiftBroadcastRequestToJSON(requestParameters['partnersTenantsEscalateShiftBroadcastRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsEscalateShiftBroadcast200ResponseFromJSON(jsonValue));
    }

    /**
     * Moves the request up one escalation tier and notifies again every agency that has not yet answered. `renotifiedAgencyCount` of 0 means every agency has already answered. Your organisation comes from your token; any tenant id you send is replaced. The agencies receive a shift.request.escalated event.  The request must belong to your organisation (otherwise 404). It is refused with 409 when the request is cancelled, expired or filled, or has closed.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Chase agencies that have not answered a request
     */
    async partnersTenantsEscalateShiftBroadcast(requestParameters: PartnersTenantsEscalateShiftBroadcastOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsEscalateShiftBroadcast200Response> {
        const response = await this.partnersTenantsEscalateShiftBroadcastRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns measured performance for each of your partner agencies over a window: requests sent, responses, declines, placements, fill, on-time and no-show rates, compliance, reliability, ratings, a monthly trend and their most-used workers, plus averages across them. Your organisation comes from your token; any tenant id you send is replaced.  `fromDate` and `toDate` set the window by whole days. When `fromDate` is left out the window starts your organisation\'s agency metric window before today (90 days unless you have changed it), and a missing `toDate` means today. Rates are percentages from 0 to 100; a null figure means there was nothing to measure yet, and the averages leave those agencies out.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Get performance figures for your agencies
     */
    async partnersTenantsGetAgencyPerformanceRaw(requestParameters: PartnersTenantsGetAgencyPerformanceOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsGetAgencyPerformance200Response>> {
        if (requestParameters['partnersTenantsGetAgencyPerformanceRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsGetAgencyPerformanceRequest',
                'Required parameter "partnersTenantsGetAgencyPerformanceRequest" was null or undefined when calling partnersTenantsGetAgencyPerformance().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/partners/tenants/get-agency-performance`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsGetAgencyPerformanceRequestToJSON(requestParameters['partnersTenantsGetAgencyPerformanceRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsGetAgencyPerformance200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns measured performance for each of your partner agencies over a window: requests sent, responses, declines, placements, fill, on-time and no-show rates, compliance, reliability, ratings, a monthly trend and their most-used workers, plus averages across them. Your organisation comes from your token; any tenant id you send is replaced.  `fromDate` and `toDate` set the window by whole days. When `fromDate` is left out the window starts your organisation\'s agency metric window before today (90 days unless you have changed it), and a missing `toDate` means today. Rates are percentages from 0 to 100; a null figure means there was nothing to measure yet, and the averages leave those agencies out.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Get performance figures for your agencies
     */
    async partnersTenantsGetAgencyPerformance(requestParameters: PartnersTenantsGetAgencyPerformanceOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsGetAgencyPerformance200Response> {
        const response = await this.partnersTenantsGetAgencyPerformanceRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns worked, ended agency shifts at your organisation, newest first, with your rating where you have given one, plus how many fall in each tab. Your organisation comes from your token; any tenant id you send is replaced.  `tab` chooses which to list: 0 All · 1 To rate (default) · 2 Rated. Filter by agency, location, and shift start date (`fromDate` and `toDate`, whole days, both inclusive), and search on the worker\'s or agency\'s name. Paged with `page` and `pageSize` (default 10); `totalRecords` is the count for the chosen tab. A shift you have not rated counts as 5 stars in the agency\'s rating.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * List agency shifts to rate and ratings given
     */
    async partnersTenantsGetAgencyRatingsRaw(requestParameters: PartnersTenantsGetAgencyRatingsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsGetAgencyRatings200Response>> {
        if (requestParameters['partnersTenantsGetAgencyRatingsRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsGetAgencyRatingsRequest',
                'Required parameter "partnersTenantsGetAgencyRatingsRequest" was null or undefined when calling partnersTenantsGetAgencyRatings().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/partners/tenants/get-agency-ratings`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsGetAgencyRatingsRequestToJSON(requestParameters['partnersTenantsGetAgencyRatingsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsGetAgencyRatings200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns worked, ended agency shifts at your organisation, newest first, with your rating where you have given one, plus how many fall in each tab. Your organisation comes from your token; any tenant id you send is replaced.  `tab` chooses which to list: 0 All · 1 To rate (default) · 2 Rated. Filter by agency, location, and shift start date (`fromDate` and `toDate`, whole days, both inclusive), and search on the worker\'s or agency\'s name. Paged with `page` and `pageSize` (default 10); `totalRecords` is the count for the chosen tab. A shift you have not rated counts as 5 stars in the agency\'s rating.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * List agency shifts to rate and ratings given
     */
    async partnersTenantsGetAgencyRatings(requestParameters: PartnersTenantsGetAgencyRatingsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsGetAgencyRatings200Response> {
        const response = await this.partnersTenantsGetAgencyRatingsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns agency workers who have worked at least one shift for your organisation that stood (cancelled, refused, replaced and no-show bookings do not count), most recent first, with how many shifts, when they last worked, their rating across every client and whether you have liked them. Your organisation comes from your token; any tenant id you send is replaced.  Narrow to the agencies you are considering (an empty list means every agency) and to one location, so \"has worked here before\" means that site. Use a worker\'s `tblAgencyStaffId` in `requestedStaffIds` when sending a shift. The list is not paged.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * List agency workers who have worked for you
     */
    async partnersTenantsGetPastWorkersRaw(requestParameters: PartnersTenantsGetPastWorkersOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsGetPastWorkers200Response>> {
        if (requestParameters['partnersTenantsGetPastWorkersRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsGetPastWorkersRequest',
                'Required parameter "partnersTenantsGetPastWorkersRequest" was null or undefined when calling partnersTenantsGetPastWorkers().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/partners/tenants/get-past-workers`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsGetPastWorkersRequestToJSON(requestParameters['partnersTenantsGetPastWorkersRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsGetPastWorkers200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns agency workers who have worked at least one shift for your organisation that stood (cancelled, refused, replaced and no-show bookings do not count), most recent first, with how many shifts, when they last worked, their rating across every client and whether you have liked them. Your organisation comes from your token; any tenant id you send is replaced.  Narrow to the agencies you are considering (an empty list means every agency) and to one location, so \"has worked here before\" means that site. Use a worker\'s `tblAgencyStaffId` in `requestedStaffIds` when sending a shift. The list is not paged.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * List agency workers who have worked for you
     */
    async partnersTenantsGetPastWorkers(requestParameters: PartnersTenantsGetPastWorkersOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsGetPastWorkers200Response> {
        const response = await this.partnersTenantsGetPastWorkersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns your organisation\'s shift requests to agencies, newest first, each with every agency it went to, how that agency has responded and the candidates it has put forward. Your organisation comes from your token; any tenant id you send is replaced.  By default only requests still running are listed: cancelled and expired ones are left out, filled ones stay. Set `liveOnly` to false to include everything. Narrow to one shift, one send (`dispatchId`) or one recurring series. Results are paged with `page` and `pageSize` (default 25) and come back as a plain list with no total. A worker the agency asked by email appears only once they have said yes and the agency has passed them on.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * List your shift requests to agencies
     */
    async partnersTenantsGetShiftBroadcastsRaw(requestParameters: PartnersTenantsGetShiftBroadcastsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsGetShiftBroadcasts200Response>> {
        if (requestParameters['partnersTenantsGetShiftBroadcastsRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsGetShiftBroadcastsRequest',
                'Required parameter "partnersTenantsGetShiftBroadcastsRequest" was null or undefined when calling partnersTenantsGetShiftBroadcasts().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/partners/tenants/get-shift-broadcasts`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsGetShiftBroadcastsRequestToJSON(requestParameters['partnersTenantsGetShiftBroadcastsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsGetShiftBroadcasts200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns your organisation\'s shift requests to agencies, newest first, each with every agency it went to, how that agency has responded and the candidates it has put forward. Your organisation comes from your token; any tenant id you send is replaced.  By default only requests still running are listed: cancelled and expired ones are left out, filled ones stay. Set `liveOnly` to false to include everything. Narrow to one shift, one send (`dispatchId`) or one recurring series. Results are paged with `page` and `pageSize` (default 25) and come back as a plain list with no total. A worker the agency asked by email appears only once they have said yes and the agency has passed them on.  **Required scope:** `agency_dispatch.read` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * List your shift requests to agencies
     */
    async partnersTenantsGetShiftBroadcasts(requestParameters: PartnersTenantsGetShiftBroadcastsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsGetShiftBroadcasts200Response> {
        const response = await this.partnersTenantsGetShiftBroadcastsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Offers one open shift to every agency approved for its location, with nothing else to choose: the offer stands until the shift starts, nobody is chased, candidates always wait for you, and no rate is imposed (the rate agreed with each agency applies where there is one). The urgency is taken from the shift. Your organisation comes from your token; any tenant id you send is replaced.  The shift must belong to your organisation (otherwise 404) and have a location (otherwise 400). It is refused with 409 when it is not an open shift, is already fully staffed or has started, or when no agency is approved for its location. Offering a shift that already has a request amends it.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Offer a shift to every approved agency
     */
    async partnersTenantsOfferShiftToAgenciesRaw(requestParameters: PartnersTenantsOfferShiftToAgenciesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsOfferShiftToAgencies200Response>> {
        if (requestParameters['partnersTenantsOfferShiftToAgenciesRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsOfferShiftToAgenciesRequest',
                'Required parameter "partnersTenantsOfferShiftToAgenciesRequest" was null or undefined when calling partnersTenantsOfferShiftToAgencies().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["agency_dispatch.write"]);
        }


        let urlPath = `/partners/tenants/offer-shift-to-agencies`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsOfferShiftToAgenciesRequestToJSON(requestParameters['partnersTenantsOfferShiftToAgenciesRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsOfferShiftToAgencies200ResponseFromJSON(jsonValue));
    }

    /**
     * Offers one open shift to every agency approved for its location, with nothing else to choose: the offer stands until the shift starts, nobody is chased, candidates always wait for you, and no rate is imposed (the rate agreed with each agency applies where there is one). The urgency is taken from the shift. Your organisation comes from your token; any tenant id you send is replaced.  The shift must belong to your organisation (otherwise 404) and have a location (otherwise 400). It is refused with 409 when it is not an open shift, is already fully staffed or has started, or when no agency is approved for its location. Offering a shift that already has a request amends it.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Offer a shift to every approved agency
     */
    async partnersTenantsOfferShiftToAgencies(requestParameters: PartnersTenantsOfferShiftToAgenciesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsOfferShiftToAgencies200Response> {
        const response = await this.partnersTenantsOfferShiftToAgenciesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Records your rating of the agency worker who worked a shift; the agency\'s own rating is built from these. Take the id from get-agency-ratings. Your organisation comes from your token; any tenant id you send is replaced. Returns the new rating\'s id.  The placement must belong to your organisation (otherwise 404). Only a worked shift whose scheduled end has passed can be rated (otherwise 400). Each placement is rated once and a rating cannot be changed: a second rating is refused with 409. `issueDescription` is required when `issueReported` is true.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Rate an agency worker after a shift
     */
    async partnersTenantsRateAgencyPlacementRaw(requestParameters: PartnersTenantsRateAgencyPlacementOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsRateAgencyPlacement200Response>> {
        if (requestParameters['partnersTenantsRateAgencyPlacementRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsRateAgencyPlacementRequest',
                'Required parameter "partnersTenantsRateAgencyPlacementRequest" was null or undefined when calling partnersTenantsRateAgencyPlacement().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["agency_dispatch.write"]);
        }


        let urlPath = `/partners/tenants/rate-agency-placement`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsRateAgencyPlacementRequestToJSON(requestParameters['partnersTenantsRateAgencyPlacementRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsRateAgencyPlacement200ResponseFromJSON(jsonValue));
    }

    /**
     * Records your rating of the agency worker who worked a shift; the agency\'s own rating is built from these. Take the id from get-agency-ratings. Your organisation comes from your token; any tenant id you send is replaced. Returns the new rating\'s id.  The placement must belong to your organisation (otherwise 404). Only a worked shift whose scheduled end has passed can be rated (otherwise 400). Each placement is rated once and a rating cannot be changed: a second rating is refused with 409. `issueDescription` is required when `issueReported` is true.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Rate an agency worker after a shift
     */
    async partnersTenantsRateAgencyPlacement(requestParameters: PartnersTenantsRateAgencyPlacementOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsRateAgencyPlacement200Response> {
        const response = await this.partnersTenantsRateAgencyPlacementRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Turns down candidates. Nobody is placed, so the shift\'s places stay open for other candidates. Your organisation comes from your token; any tenant id you send is replaced. The reason is shown to the agency, and the agencies receive a shift.candidate.rejected event.  The request must belong to your organisation (otherwise 404). Candidates already accepted, declined or withdrawn are skipped and returned in `skippedIds`; if none can be declined the call is refused with 400.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Decline candidates an agency put forward
     */
    async partnersTenantsRejectAgencyCandidatesRaw(requestParameters: PartnersTenantsRejectAgencyCandidatesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsRejectAgencyCandidates200Response>> {
        if (requestParameters['partnersTenantsRejectAgencyCandidatesRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsRejectAgencyCandidatesRequest',
                'Required parameter "partnersTenantsRejectAgencyCandidatesRequest" was null or undefined when calling partnersTenantsRejectAgencyCandidates().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["agency_dispatch.write"]);
        }


        let urlPath = `/partners/tenants/reject-agency-candidates`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsRejectAgencyCandidatesRequestToJSON(requestParameters['partnersTenantsRejectAgencyCandidatesRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsRejectAgencyCandidates200ResponseFromJSON(jsonValue));
    }

    /**
     * Turns down candidates. Nobody is placed, so the shift\'s places stay open for other candidates. Your organisation comes from your token; any tenant id you send is replaced. The reason is shown to the agency, and the agencies receive a shift.candidate.rejected event.  The request must belong to your organisation (otherwise 404). Candidates already accepted, declined or withdrawn are skipped and returned in `skippedIds`; if none can be declined the call is refused with 400.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Decline candidates an agency put forward
     */
    async partnersTenantsRejectAgencyCandidates(requestParameters: PartnersTenantsRejectAgencyCandidatesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsRejectAgencyCandidates200Response> {
        const response = await this.partnersTenantsRejectAgencyCandidatesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Cancels the booking of an agency worker taken off a shift and hands the place back to the request, so agencies can fill it again. The agency is told by email and by a shift.placement.cancelled event. Your organisation comes from your token; any tenant id you send is replaced. Returns 404 when that worker has no live booking on the shift.  When your integration removes an agency worker from a shift through the roster API, that call makes this one for you with your token, which is why `rosters.write` is enough. Call it yourself only if that follow-up did not go through. Remove the worker from the roster first: this call does not check, and on its own leaves the roster showing a worker whose booking is cancelled.  **Required scope:** `rosters.write` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Cancel an agency booking after removing the worker
     */
    async partnersTenantsRemoveAgencyPlacementRaw(requestParameters: PartnersTenantsRemoveAgencyPlacementOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsRemoveAgencyPlacement200Response>> {
        if (requestParameters['partnersTenantsRemoveAgencyPlacementRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsRemoveAgencyPlacementRequest',
                'Required parameter "partnersTenantsRemoveAgencyPlacementRequest" was null or undefined when calling partnersTenantsRemoveAgencyPlacement().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/partners/tenants/remove-agency-placement`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsRemoveAgencyPlacementRequestToJSON(requestParameters['partnersTenantsRemoveAgencyPlacementRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsRemoveAgencyPlacement200ResponseFromJSON(jsonValue));
    }

    /**
     * Cancels the booking of an agency worker taken off a shift and hands the place back to the request, so agencies can fill it again. The agency is told by email and by a shift.placement.cancelled event. Your organisation comes from your token; any tenant id you send is replaced. Returns 404 when that worker has no live booking on the shift.  When your integration removes an agency worker from a shift through the roster API, that call makes this one for you with your token, which is why `rosters.write` is enough. Call it yourself only if that follow-up did not go through. Remove the worker from the roster first: this call does not check, and on its own leaves the roster showing a worker whose booking is cancelled.  **Required scope:** `rosters.write` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Cancel an agency booking after removing the worker
     */
    async partnersTenantsRemoveAgencyPlacement(requestParameters: PartnersTenantsRemoveAgencyPlacementOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsRemoveAgencyPlacement200Response> {
        const response = await this.partnersTenantsRemoveAgencyPlacementRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Sends one open shift to the agencies you name, on your terms. If the shift already has a request this amends it (`wasUpdated`), and a shift already offered to every approved agency is turned into this request, keeping any candidates already put forward. Your organisation comes from your token; any tenant id you send is replaced. Agencies with `isPushWebhook` receive a shift.request.received event.  The shift must belong to your organisation (otherwise 404) and have a location (otherwise 400). It is refused with 409, listing each reason, when it is not an open shift, is already fully staffed, has started, or names an agency that is not an active partner approved for the shift\'s location, or a rate card that is not available to you. Every agency needs at least one notification channel, and auto-accept needs a rate ceiling (the agency\'s rate, a rate card, or `maxPayRate`). Under a tiered cascade the agency ranked n is notified (n - 1) × `autoEscalateAfterMinutes` after sending; any delay you send per agency is ignored.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Send a shift to chosen agencies
     */
    async partnersTenantsSendShiftToAgenciesRaw(requestParameters: PartnersTenantsSendShiftToAgenciesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsSendShiftToAgencies200Response>> {
        if (requestParameters['partnersTenantsSendShiftToAgenciesRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsSendShiftToAgenciesRequest',
                'Required parameter "partnersTenantsSendShiftToAgenciesRequest" was null or undefined when calling partnersTenantsSendShiftToAgencies().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["agency_dispatch.write"]);
        }


        let urlPath = `/partners/tenants/send-shift-to-agencies`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsSendShiftToAgenciesRequestToJSON(requestParameters['partnersTenantsSendShiftToAgenciesRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsSendShiftToAgencies200ResponseFromJSON(jsonValue));
    }

    /**
     * Sends one open shift to the agencies you name, on your terms. If the shift already has a request this amends it (`wasUpdated`), and a shift already offered to every approved agency is turned into this request, keeping any candidates already put forward. Your organisation comes from your token; any tenant id you send is replaced. Agencies with `isPushWebhook` receive a shift.request.received event.  The shift must belong to your organisation (otherwise 404) and have a location (otherwise 400). It is refused with 409, listing each reason, when it is not an open shift, is already fully staffed, has started, or names an agency that is not an active partner approved for the shift\'s location, or a rate card that is not available to you. Every agency needs at least one notification channel, and auto-accept needs a rate ceiling (the agency\'s rate, a rate card, or `maxPayRate`). Under a tiered cascade the agency ranked n is notified (n - 1) × `autoEscalateAfterMinutes` after sending; any delay you send per agency is ignored.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Send a shift to chosen agencies
     */
    async partnersTenantsSendShiftToAgencies(requestParameters: PartnersTenantsSendShiftToAgenciesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsSendShiftToAgencies200Response> {
        const response = await this.partnersTenantsSendShiftToAgenciesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Sends up to 200 open shifts to the same agencies on the same terms: one request per shift, all carrying the `dispatchId` returned. Your organisation comes from your token; any tenant id you send is replaced.  Each shift is checked and sent on its own, under the same rules as sending one shift. Shifts that could not be sent are listed in `blocked` with the reason, and the rest still go. If no shift could be sent the call is refused with 409, listing every reason. Each shift id must appear once.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Send several shifts to agencies at once
     */
    async partnersTenantsSendShiftsToAgenciesRaw(requestParameters: PartnersTenantsSendShiftsToAgenciesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsSendShiftsToAgencies200Response>> {
        if (requestParameters['partnersTenantsSendShiftsToAgenciesRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsSendShiftsToAgenciesRequest',
                'Required parameter "partnersTenantsSendShiftsToAgenciesRequest" was null or undefined when calling partnersTenantsSendShiftsToAgencies().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["agency_dispatch.write"]);
        }


        let urlPath = `/partners/tenants/send-shifts-to-agencies`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsSendShiftsToAgenciesRequestToJSON(requestParameters['partnersTenantsSendShiftsToAgenciesRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsSendShiftsToAgencies200ResponseFromJSON(jsonValue));
    }

    /**
     * Sends up to 200 open shifts to the same agencies on the same terms: one request per shift, all carrying the `dispatchId` returned. Your organisation comes from your token; any tenant id you send is replaced.  Each shift is checked and sent on its own, under the same rules as sending one shift. Shifts that could not be sent are listed in `blocked` with the reason, and the rest still go. If no shift could be sent the call is refused with 409, listing every reason. Each shift id must appear once.  **Required scope:** `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Send several shifts to agencies at once
     */
    async partnersTenantsSendShiftsToAgencies(requestParameters: PartnersTenantsSendShiftsToAgenciesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsSendShiftsToAgencies200Response> {
        const response = await this.partnersTenantsSendShiftsToAgenciesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Brings an agency request into line with its shift after your own staff have been rostered onto it: agencies may then fill only the places left, and a request with none left closes as filled (agencies are told with a shift.request.filled event). Bookings already made stand. Your organisation comes from your token; any tenant id you send is replaced. Returns 404 when the shift has no live agency request.  When your integration rosters your own staff onto an open shift through the roster API, that call makes this one for you with your token, which is why `rosters.write` is enough. Call it yourself only if that follow-up did not go through and the request still shows more places than the shift needs.  **Required scope:** `rosters.write` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Update an agency request after rostering your own staff
     */
    async partnersTenantsShiftStaffingChangedRaw(requestParameters: PartnersTenantsShiftStaffingChangedOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PartnersTenantsShiftStaffingChanged200Response>> {
        if (requestParameters['partnersTenantsShiftStaffingChangedRequest'] == null) {
            throw new runtime.RequiredError(
                'partnersTenantsShiftStaffingChangedRequest',
                'Required parameter "partnersTenantsShiftStaffingChangedRequest" was null or undefined when calling partnersTenantsShiftStaffingChanged().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/partners/tenants/shift-staffing-changed`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PartnersTenantsShiftStaffingChangedRequestToJSON(requestParameters['partnersTenantsShiftStaffingChangedRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PartnersTenantsShiftStaffingChanged200ResponseFromJSON(jsonValue));
    }

    /**
     * Brings an agency request into line with its shift after your own staff have been rostered onto it: agencies may then fill only the places left, and a request with none left closes as filled (agencies are told with a shift.request.filled event). Bookings already made stand. Your organisation comes from your token; any tenant id you send is replaced. Returns 404 when the shift has no live agency request.  When your integration rosters your own staff onto an open shift through the roster API, that call makes this one for you with your token, which is why `rosters.write` is enough. Call it yourself only if that follow-up did not go through and the request still shows more places than the shift needs.  **Required scope:** `rosters.write` or `agency_dispatch.write`  See **Responses** below for the status codes this operation can return.
     * Update an agency request after rostering your own staff
     */
    async partnersTenantsShiftStaffingChanged(requestParameters: PartnersTenantsShiftStaffingChangedOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PartnersTenantsShiftStaffingChanged200Response> {
        const response = await this.partnersTenantsShiftStaffingChangedRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
