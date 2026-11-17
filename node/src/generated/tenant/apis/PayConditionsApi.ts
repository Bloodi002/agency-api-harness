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
  SchedulingAllowanceList200Response,
  SchedulingClassificationList200Response,
  StaffGetLeaveSchemeBalances200Response,
  StaffGetStaffPayConditionByStaffId200Response,
  StaffGetStaffPayConditionByStaffIdRequest,
  StaffGetStaffPayConditionsHistory200Response,
  StaffGetStaffPayConditionsHistoryRequest,
  StaffSavePayCondition200Response,
  StaffSavePayConditionRequest,
  ValidationProblem,
} from '../models/index.js';
import {
    EnvelopeFromJSON,
    EnvelopeToJSON,
    SchedulingAllowanceList200ResponseFromJSON,
    SchedulingAllowanceList200ResponseToJSON,
    SchedulingClassificationList200ResponseFromJSON,
    SchedulingClassificationList200ResponseToJSON,
    StaffGetLeaveSchemeBalances200ResponseFromJSON,
    StaffGetLeaveSchemeBalances200ResponseToJSON,
    StaffGetStaffPayConditionByStaffId200ResponseFromJSON,
    StaffGetStaffPayConditionByStaffId200ResponseToJSON,
    StaffGetStaffPayConditionByStaffIdRequestFromJSON,
    StaffGetStaffPayConditionByStaffIdRequestToJSON,
    StaffGetStaffPayConditionsHistory200ResponseFromJSON,
    StaffGetStaffPayConditionsHistory200ResponseToJSON,
    StaffGetStaffPayConditionsHistoryRequestFromJSON,
    StaffGetStaffPayConditionsHistoryRequestToJSON,
    StaffSavePayCondition200ResponseFromJSON,
    StaffSavePayCondition200ResponseToJSON,
    StaffSavePayConditionRequestFromJSON,
    StaffSavePayConditionRequestToJSON,
    ValidationProblemFromJSON,
    ValidationProblemToJSON,
} from '../models/index.js';

export interface StaffGetLeaveSchemeBalancesRequest {
    staffId: string;
}

export interface StaffGetStaffPayConditionByStaffIdOperationRequest {
    staffGetStaffPayConditionByStaffIdRequest: StaffGetStaffPayConditionByStaffIdRequest;
}

export interface StaffGetStaffPayConditionsHistoryOperationRequest {
    staffGetStaffPayConditionsHistoryRequest: StaffGetStaffPayConditionsHistoryRequest;
}

export interface StaffSavePayConditionOperationRequest {
    staffSavePayConditionRequest: StaffSavePayConditionRequest;
}

/**
 * PayConditionsApi - interface
 * 
 * @export
 * @interface PayConditionsApiInterface
 */
export interface PayConditionsApiInterface {
    /**
     * Returns the award allowances you can attach to a shift. Send `allowanceId` back in a shift\'s `allowanceIDs`. The list is the same for every organisation and may be empty.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * @summary List award allowances
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PayConditionsApiInterface
     */
    schedulingAllowanceListRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingAllowanceList200Response>>;

    /**
     * Returns the award allowances you can attach to a shift. Send `allowanceId` back in a shift\'s `allowanceIDs`. The list is the same for every organisation and may be empty.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * List award allowances
     */
    schedulingAllowanceList(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingAllowanceList200Response>;

    /**
     * Returns the award classifications you can set as a shift\'s minimum or higher duties classification. Send `classificationId` back, not the name: several awards share names such as \"Level 2.2\". The list is the same for every organisation and may be empty.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * @summary List award classifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PayConditionsApiInterface
     */
    schedulingClassificationListRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingClassificationList200Response>>;

    /**
     * Returns the award classifications you can set as a shift\'s minimum or higher duties classification. Send `classificationId` back, not the name: several awards share names such as \"Level 2.2\". The list is the same for every organisation and may be empty.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * List award classifications
     */
    schedulingClassificationList(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingClassificationList200Response>;

    /**
     * Returns the staff member\'s rostered day off (RDO), accrued day off (ADO) and time off in lieu (TOIL) balances in hours. All three schemes are always returned; a scheme with no entries shows 0. Only your organisation\'s records are counted, so a staff member outside it shows three zero balances.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get a staff member\'s RDO, ADO and TOIL balances
     * @param {string} staffId The staff member\&#39;s id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PayConditionsApiInterface
     */
    staffGetLeaveSchemeBalancesRaw(requestParameters: StaffGetLeaveSchemeBalancesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetLeaveSchemeBalances200Response>>;

    /**
     * Returns the staff member\'s rostered day off (RDO), accrued day off (ADO) and time off in lieu (TOIL) balances in hours. All three schemes are always returned; a scheme with no entries shows 0. Only your organisation\'s records are counted, so a staff member outside it shows three zero balances.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s RDO, ADO and TOIL balances
     */
    staffGetLeaveSchemeBalances(requestParameters: StaffGetLeaveSchemeBalancesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetLeaveSchemeBalances200Response>;

    /**
     * Returns one active pay condition period for a staff member in your organisation: the award, classification, employment type, rates, hours and the RDO, ADO and TOIL settings. Choose the period with `payConditionCycle` (past, current or upcoming), or omit it and send the exact start and end dates of the period.  The response includes pay rates, so treat it as payroll data. Answers 404 when the staff member is not in your organisation or no period matches.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get a staff member\'s pay conditions for a period
     * @param {StaffGetStaffPayConditionByStaffIdRequest} staffGetStaffPayConditionByStaffIdRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PayConditionsApiInterface
     */
    staffGetStaffPayConditionByStaffIdRaw(requestParameters: StaffGetStaffPayConditionByStaffIdOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffPayConditionByStaffId200Response>>;

    /**
     * Returns one active pay condition period for a staff member in your organisation: the award, classification, employment type, rates, hours and the RDO, ADO and TOIL settings. Choose the period with `payConditionCycle` (past, current or upcoming), or omit it and send the exact start and end dates of the period.  The response includes pay rates, so treat it as payroll data. Answers 404 when the staff member is not in your organisation or no period matches.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s pay conditions for a period
     */
    staffGetStaffPayConditionByStaffId(requestParameters: StaffGetStaffPayConditionByStaffIdOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffPayConditionByStaffId200Response>;

    /**
     * Returns a staff member\'s pay condition periods for one cycle (past, current or upcoming) with award, classification, employment type, pay period and rates, plus the count of past periods. The staff member must belong to your organisation, or the call answers 404.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * @summary List a staff member\'s pay condition periods
     * @param {StaffGetStaffPayConditionsHistoryRequest} staffGetStaffPayConditionsHistoryRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PayConditionsApiInterface
     */
    staffGetStaffPayConditionsHistoryRaw(requestParameters: StaffGetStaffPayConditionsHistoryOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffPayConditionsHistory200Response>>;

    /**
     * Returns a staff member\'s pay condition periods for one cycle (past, current or upcoming) with award, classification, employment type, pay period and rates, plus the count of past periods. The staff member must belong to your organisation, or the call answers 404.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * List a staff member\'s pay condition periods
     */
    staffGetStaffPayConditionsHistory(requestParameters: StaffGetStaffPayConditionsHistoryOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffPayConditionsHistory200Response>;

    /**
     * Saves a pay condition period for a staff member in your organisation. A period that overlaps one existing period updates or replaces it as a new version; a period that overlaps none is added; a period that overlaps more than one is refused with 400, as are dates that end before they start.  Turning on award-rate overrides, or changing any override rate, is refused with 403 because it needs a person\'s approval; saving an override that is already in place, unchanged, is allowed. A save that races another change to the same staff member answers 409 and saves nothing.  **Required scope:** `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * @summary Save a staff member\'s pay conditions
     * @param {StaffSavePayConditionRequest} staffSavePayConditionRequest The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PayConditionsApiInterface
     */
    staffSavePayConditionRaw(requestParameters: StaffSavePayConditionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffSavePayCondition200Response>>;

    /**
     * Saves a pay condition period for a staff member in your organisation. A period that overlaps one existing period updates or replaces it as a new version; a period that overlaps none is added; a period that overlaps more than one is refused with 400, as are dates that end before they start.  Turning on award-rate overrides, or changing any override rate, is refused with 403 because it needs a person\'s approval; saving an override that is already in place, unchanged, is allowed. A save that races another change to the same staff member answers 409 and saves nothing.  **Required scope:** `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s pay conditions
     */
    staffSavePayCondition(requestParameters: StaffSavePayConditionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffSavePayCondition200Response>;

}

/**
 * 
 */
export class PayConditionsApi extends runtime.BaseAPI implements PayConditionsApiInterface {

    /**
     * Returns the award allowances you can attach to a shift. Send `allowanceId` back in a shift\'s `allowanceIDs`. The list is the same for every organisation and may be empty.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * List award allowances
     */
    async schedulingAllowanceListRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingAllowanceList200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/CalenderView/allowance-list`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingAllowanceList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the award allowances you can attach to a shift. Send `allowanceId` back in a shift\'s `allowanceIDs`. The list is the same for every organisation and may be empty.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * List award allowances
     */
    async schedulingAllowanceList(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingAllowanceList200Response> {
        const response = await this.schedulingAllowanceListRaw(initOverrides);
        return await response.value();
    }

    /**
     * Returns the award classifications you can set as a shift\'s minimum or higher duties classification. Send `classificationId` back, not the name: several awards share names such as \"Level 2.2\". The list is the same for every organisation and may be empty.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * List award classifications
     */
    async schedulingClassificationListRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SchedulingClassificationList200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/scheduling/api/CalenderView/classification-list`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SchedulingClassificationList200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the award classifications you can set as a shift\'s minimum or higher duties classification. Send `classificationId` back, not the name: several awards share names such as \"Level 2.2\". The list is the same for every organisation and may be empty.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * List award classifications
     */
    async schedulingClassificationList(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SchedulingClassificationList200Response> {
        const response = await this.schedulingClassificationListRaw(initOverrides);
        return await response.value();
    }

    /**
     * Returns the staff member\'s rostered day off (RDO), accrued day off (ADO) and time off in lieu (TOIL) balances in hours. All three schemes are always returned; a scheme with no entries shows 0. Only your organisation\'s records are counted, so a staff member outside it shows three zero balances.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s RDO, ADO and TOIL balances
     */
    async staffGetLeaveSchemeBalancesRaw(requestParameters: StaffGetLeaveSchemeBalancesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetLeaveSchemeBalances200Response>> {
        if (requestParameters['staffId'] == null) {
            throw new runtime.RequiredError(
                'staffId',
                'Required parameter "staffId" was null or undefined when calling staffGetLeaveSchemeBalances().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['staffId'] != null) {
            queryParameters['staffId'] = requestParameters['staffId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/get-leave-scheme-balances`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetLeaveSchemeBalances200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the staff member\'s rostered day off (RDO), accrued day off (ADO) and time off in lieu (TOIL) balances in hours. All three schemes are always returned; a scheme with no entries shows 0. Only your organisation\'s records are counted, so a staff member outside it shows three zero balances.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s RDO, ADO and TOIL balances
     */
    async staffGetLeaveSchemeBalances(requestParameters: StaffGetLeaveSchemeBalancesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetLeaveSchemeBalances200Response> {
        const response = await this.staffGetLeaveSchemeBalancesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one active pay condition period for a staff member in your organisation: the award, classification, employment type, rates, hours and the RDO, ADO and TOIL settings. Choose the period with `payConditionCycle` (past, current or upcoming), or omit it and send the exact start and end dates of the period.  The response includes pay rates, so treat it as payroll data. Answers 404 when the staff member is not in your organisation or no period matches.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s pay conditions for a period
     */
    async staffGetStaffPayConditionByStaffIdRaw(requestParameters: StaffGetStaffPayConditionByStaffIdOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffPayConditionByStaffId200Response>> {
        if (requestParameters['staffGetStaffPayConditionByStaffIdRequest'] == null) {
            throw new runtime.RequiredError(
                'staffGetStaffPayConditionByStaffIdRequest',
                'Required parameter "staffGetStaffPayConditionByStaffIdRequest" was null or undefined when calling staffGetStaffPayConditionByStaffId().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/get-staff-pay-condition-by-staff-id`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffGetStaffPayConditionByStaffIdRequestToJSON(requestParameters['staffGetStaffPayConditionByStaffIdRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetStaffPayConditionByStaffId200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one active pay condition period for a staff member in your organisation: the award, classification, employment type, rates, hours and the RDO, ADO and TOIL settings. Choose the period with `payConditionCycle` (past, current or upcoming), or omit it and send the exact start and end dates of the period.  The response includes pay rates, so treat it as payroll data. Answers 404 when the staff member is not in your organisation or no period matches.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * Get a staff member\'s pay conditions for a period
     */
    async staffGetStaffPayConditionByStaffId(requestParameters: StaffGetStaffPayConditionByStaffIdOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffPayConditionByStaffId200Response> {
        const response = await this.staffGetStaffPayConditionByStaffIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a staff member\'s pay condition periods for one cycle (past, current or upcoming) with award, classification, employment type, pay period and rates, plus the count of past periods. The staff member must belong to your organisation, or the call answers 404.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * List a staff member\'s pay condition periods
     */
    async staffGetStaffPayConditionsHistoryRaw(requestParameters: StaffGetStaffPayConditionsHistoryOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffGetStaffPayConditionsHistory200Response>> {
        if (requestParameters['staffGetStaffPayConditionsHistoryRequest'] == null) {
            throw new runtime.RequiredError(
                'staffGetStaffPayConditionsHistoryRequest',
                'Required parameter "staffGetStaffPayConditionsHistoryRequest" was null or undefined when calling staffGetStaffPayConditionsHistory().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/staff/get-staff-pay-conditions-history`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffGetStaffPayConditionsHistoryRequestToJSON(requestParameters['staffGetStaffPayConditionsHistoryRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffGetStaffPayConditionsHistory200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns a staff member\'s pay condition periods for one cycle (past, current or upcoming) with award, classification, employment type, pay period and rates, plus the count of past periods. The staff member must belong to your organisation, or the call answers 404.  **Required scope:** `pay_conditions.read` or `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * List a staff member\'s pay condition periods
     */
    async staffGetStaffPayConditionsHistory(requestParameters: StaffGetStaffPayConditionsHistoryOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffGetStaffPayConditionsHistory200Response> {
        const response = await this.staffGetStaffPayConditionsHistoryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Saves a pay condition period for a staff member in your organisation. A period that overlaps one existing period updates or replaces it as a new version; a period that overlaps none is added; a period that overlaps more than one is refused with 400, as are dates that end before they start.  Turning on award-rate overrides, or changing any override rate, is refused with 403 because it needs a person\'s approval; saving an override that is already in place, unchanged, is allowed. A save that races another change to the same staff member answers 409 and saves nothing.  **Required scope:** `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s pay conditions
     */
    async staffSavePayConditionRaw(requestParameters: StaffSavePayConditionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaffSavePayCondition200Response>> {
        if (requestParameters['staffSavePayConditionRequest'] == null) {
            throw new runtime.RequiredError(
                'staffSavePayConditionRequest',
                'Required parameter "staffSavePayConditionRequest" was null or undefined when calling staffSavePayCondition().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["pay_conditions.write"]);
        }


        let urlPath = `/staff/save-pay-condition`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaffSavePayConditionRequestToJSON(requestParameters['staffSavePayConditionRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaffSavePayCondition200ResponseFromJSON(jsonValue));
    }

    /**
     * Saves a pay condition period for a staff member in your organisation. A period that overlaps one existing period updates or replaces it as a new version; a period that overlaps none is added; a period that overlaps more than one is refused with 400, as are dates that end before they start.  Turning on award-rate overrides, or changing any override rate, is refused with 403 because it needs a person\'s approval; saving an override that is already in place, unchanged, is allowed. A save that races another change to the same staff member answers 409 and saves nothing.  **Required scope:** `pay_conditions.write`  See **Responses** below for the status codes this operation can return.
     * Save a staff member\'s pay conditions
     */
    async staffSavePayCondition(requestParameters: StaffSavePayConditionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaffSavePayCondition200Response> {
        const response = await this.staffSavePayConditionRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
