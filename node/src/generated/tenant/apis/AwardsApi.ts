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
  AwardsAllowancesAward200Response,
  AwardsAllowancesGet200Response,
  AwardsAwardVersionsAvuwTenantQueue200Response,
  AwardsAwardVersionsAvuwTenantQueueReview200Response,
  AwardsAwardsAvailable200Response,
  AwardsAwardsDetails200Response,
  AwardsAwardsGet200Response,
  AwardsClassificationsAward200Response,
  AwardsEnterpriseAgreements200Response,
  AwardsEnterpriseAgreementsGet200Response,
  AwardsEnterpriseAgreementsVersionsGet200Response,
  AwardsPayRatesClassification200Response,
  AwardsStreamsAward200Response,
  AwardsStreamsClassifications200Response,
  Envelope,
} from '../models/index.js';
import {
    AwardsAllowancesAward200ResponseFromJSON,
    AwardsAllowancesAward200ResponseToJSON,
    AwardsAllowancesGet200ResponseFromJSON,
    AwardsAllowancesGet200ResponseToJSON,
    AwardsAwardVersionsAvuwTenantQueue200ResponseFromJSON,
    AwardsAwardVersionsAvuwTenantQueue200ResponseToJSON,
    AwardsAwardVersionsAvuwTenantQueueReview200ResponseFromJSON,
    AwardsAwardVersionsAvuwTenantQueueReview200ResponseToJSON,
    AwardsAwardsAvailable200ResponseFromJSON,
    AwardsAwardsAvailable200ResponseToJSON,
    AwardsAwardsDetails200ResponseFromJSON,
    AwardsAwardsDetails200ResponseToJSON,
    AwardsAwardsGet200ResponseFromJSON,
    AwardsAwardsGet200ResponseToJSON,
    AwardsClassificationsAward200ResponseFromJSON,
    AwardsClassificationsAward200ResponseToJSON,
    AwardsEnterpriseAgreements200ResponseFromJSON,
    AwardsEnterpriseAgreements200ResponseToJSON,
    AwardsEnterpriseAgreementsGet200ResponseFromJSON,
    AwardsEnterpriseAgreementsGet200ResponseToJSON,
    AwardsEnterpriseAgreementsVersionsGet200ResponseFromJSON,
    AwardsEnterpriseAgreementsVersionsGet200ResponseToJSON,
    AwardsPayRatesClassification200ResponseFromJSON,
    AwardsPayRatesClassification200ResponseToJSON,
    AwardsStreamsAward200ResponseFromJSON,
    AwardsStreamsAward200ResponseToJSON,
    AwardsStreamsClassifications200ResponseFromJSON,
    AwardsStreamsClassifications200ResponseToJSON,
    EnvelopeFromJSON,
    EnvelopeToJSON,
} from '../models/index.js';

export interface AwardsAllowancesAwardRequest {
    awardId: string;
    search?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    isActive?: boolean;
    includeSuperseded?: boolean;
}

export interface AwardsAllowancesGetRequest {
    id: string;
}

export interface AwardsAwardVersionsAvuwTenantQueueReviewRequest {
    id: string;
}

export interface AwardsAwardsDetailsRequest {
    awardId: string;
}

export interface AwardsAwardsGetRequest {
    awardId: string;
}

export interface AwardsClassificationsAwardRequest {
    awardId: string;
    search?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    includeHistory?: boolean;
    ids?: string;
}

export interface AwardsEnterpriseAgreementsGetRequest {
    id: string;
}

export interface AwardsEnterpriseAgreementsVersionsGetRequest {
    versionId: string;
}

export interface AwardsPayRatesClassificationRequest {
    classificationId: string;
}

export interface AwardsStreamsAwardRequest {
    awardId: string;
}

export interface AwardsStreamsClassificationsRequest {
    streamId: string;
}

/**
 * AwardsApi - interface
 * 
 * @export
 * @interface AwardsApiInterface
 */
export interface AwardsApiInterface {
    /**
     * Returns one page of an award\'s allowances: the award\'s own rows plus your organisation\'s overrides. `isActive` true gives the allowances in use, false the ones only available to add, and leaving it out gives both. Only the active version\'s rows come back unless `includeSuperseded` is set. Search matches name, description and frequency. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary Search an award\'s allowances
     * @param {string} awardId The award id.
     * @param {string} [search] Text to match.
     * @param {number} [page] Page number, from 1. Out-of-range values are clamped.
     * @param {number} [size] Rows per page, 1 to 500. Out-of-range values are clamped.
     * @param {string} [sortBy] Sort column: allowanceName, amount, frequencyName, isActive, triggerType, source or priority. Anything else sorts by name.
     * @param {string} [sortDir] desc for descending; anything else is ascending.
     * @param {boolean} [isActive] true for allowances in use, false for ones only available to add; leave out for both.
     * @param {boolean} [includeSuperseded] true returns every version\&#39;s rows, not only the active version\&#39;s.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsAllowancesAwardRaw(requestParameters: AwardsAllowancesAwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAllowancesAward200Response>>;

    /**
     * Returns one page of an award\'s allowances: the award\'s own rows plus your organisation\'s overrides. `isActive` true gives the allowances in use, false the ones only available to add, and leaving it out gives both. Only the active version\'s rows come back unless `includeSuperseded` is set. Search matches name, description and frequency. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Search an award\'s allowances
     */
    awardsAllowancesAward(requestParameters: AwardsAllowancesAwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAllowancesAward200Response>;

    /**
     * Returns one allowance of an award your organisation has adopted. An allowance of an award you have not adopted answers 404, the same as one that does not exist.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get one allowance
     * @param {string} id The allowance id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsAllowancesGetRaw(requestParameters: AwardsAllowancesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAllowancesGet200Response>>;

    /**
     * Returns one allowance of an award your organisation has adopted. An allowance of an award you have not adopted answers 404, the same as one that does not exist.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get one allowance
     */
    awardsAllowancesGet(requestParameters: AwardsAllowancesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAllowancesGet200Response>;

    /**
     * Returns your organisation\'s Award Updates queue: each new award version pushed to you that is pending or snoozed, with the version it would replace and how many changes it carries. Ordered by award code, newest version first. Approving, rejecting and snoozing are not available to your integration.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary List award updates waiting for your approval
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsAwardVersionsAvuwTenantQueueRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAwardVersionsAvuwTenantQueue200Response>>;

    /**
     * Returns your organisation\'s Award Updates queue: each new award version pushed to you that is pending or snoozed, with the version it would replace and how many changes it carries. Ordered by award code, newest version first. Approving, rejecting and snoozing are not available to your integration.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List award updates waiting for your approval
     */
    awardsAwardVersionsAvuwTenantQueue(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAwardVersionsAvuwTenantQueue200Response>;

    /**
     * Returns one award update in your queue with every change it makes: classifications, pay rates, allowances and rules added, updated, removed or translated, with before and after values and the changes that need a manual check. An update that is not your organisation\'s answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary Review the changes in an award update
     * @param {string} id The award update id, &#x60;tenantAwardAdoptionId&#x60; from the queue.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsAwardVersionsAvuwTenantQueueReviewRaw(requestParameters: AwardsAwardVersionsAvuwTenantQueueReviewRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAwardVersionsAvuwTenantQueueReview200Response>>;

    /**
     * Returns one award update in your queue with every change it makes: classifications, pay rates, allowances and rules added, updated, removed or translated, with before and after values and the changes that need a manual check. An update that is not your organisation\'s answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Review the changes in an award update
     */
    awardsAwardVersionsAvuwTenantQueueReview(requestParameters: AwardsAwardVersionsAvuwTenantQueueReviewRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAwardVersionsAvuwTenantQueueReview200Response>;

    /**
     * Returns the awards your organisation has adopted, ordered by name, each with its currently active version. An award pushed to you but still waiting on your Award Updates queue is not listed until it is approved.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary List the awards your organisation uses
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsAwardsAvailableRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAwardsAvailable200Response>>;

    /**
     * Returns the awards your organisation has adopted, ordered by name, each with its currently active version. An award pushed to you but still waiting on your Award Updates queue is not listed until it is approved.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List the awards your organisation uses
     */
    awardsAwardsAvailable(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAwardsAvailable200Response>;

    /**
     * Returns one award your organisation has adopted, with how many streams, classifications, rules, allowances, break rules and pay rates it holds. Counts cover the active version and include your own overrides. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get an award with its content counts
     * @param {string} awardId The award id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsAwardsDetailsRaw(requestParameters: AwardsAwardsDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAwardsDetails200Response>>;

    /**
     * Returns one award your organisation has adopted, with how many streams, classifications, rules, allowances, break rules and pay rates it holds. Counts cover the active version and include your own overrides. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get an award with its content counts
     */
    awardsAwardsDetails(requestParameters: AwardsAwardsDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAwardsDetails200Response>;

    /**
     * Returns one award your organisation has adopted, with its active version. An award you have not adopted answers 404, the same as one that does not exist.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get one award
     * @param {string} awardId The award id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsAwardsGetRaw(requestParameters: AwardsAwardsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAwardsGet200Response>>;

    /**
     * Returns one award your organisation has adopted, with its active version. An award you have not adopted answers 404, the same as one that does not exist.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get one award
     */
    awardsAwardsGet(requestParameters: AwardsAwardsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAwardsGet200Response>;

    /**
     * Returns one page of an award\'s classifications, searching name, level code and description. By default only the active version\'s rows come back; set `includeHistory` for every version\'s copy. Send `ids` to look up particular classifications by id instead of searching. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary Search an award\'s classifications
     * @param {string} awardId The award id.
     * @param {string} [search] Text to match.
     * @param {number} [page] Page number, from 1. Out-of-range values are clamped.
     * @param {number} [size] Rows per page, 1 to 500. Out-of-range values are clamped.
     * @param {string} [sortBy] Sort column: name, levelCode, fwcFixedId, provenance or effectiveFrom. Anything else sorts by level code then name.
     * @param {string} [sortDir] desc for descending; anything else is ascending.
     * @param {boolean} [includeHistory] true returns every version\&#39;s rows, not only the active version\&#39;s.
     * @param {string} [ids] Comma-separated classification ids. When sent, only these rows come back and &#x60;search&#x60; is ignored; malformed ids are skipped.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsClassificationsAwardRaw(requestParameters: AwardsClassificationsAwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsClassificationsAward200Response>>;

    /**
     * Returns one page of an award\'s classifications, searching name, level code and description. By default only the active version\'s rows come back; set `includeHistory` for every version\'s copy. Send `ids` to look up particular classifications by id instead of searching. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Search an award\'s classifications
     */
    awardsClassificationsAward(requestParameters: AwardsClassificationsAwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsClassificationsAward200Response>;

    /**
     * Returns your organisation\'s enterprise agreements and individual flexibility arrangements, ordered by name, each with its versions newest first.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary List your enterprise agreements
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsEnterpriseAgreementsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsEnterpriseAgreements200Response>>;

    /**
     * Returns your organisation\'s enterprise agreements and individual flexibility arrangements, ordered by name, each with its versions newest first.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List your enterprise agreements
     */
    awardsEnterpriseAgreements(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsEnterpriseAgreements200Response>;

    /**
     * Returns one of your organisation\'s agreements with its versions, newest first. Another organisation\'s agreement answers 404, the same as one that does not exist.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get one enterprise agreement
     * @param {string} id The agreement id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsEnterpriseAgreementsGetRaw(requestParameters: AwardsEnterpriseAgreementsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsEnterpriseAgreementsGet200Response>>;

    /**
     * Returns one of your organisation\'s agreements with its versions, newest first. Another organisation\'s agreement answers 404, the same as one that does not exist.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get one enterprise agreement
     */
    awardsEnterpriseAgreementsGet(requestParameters: AwardsEnterpriseAgreementsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsEnterpriseAgreementsGet200Response>;

    /**
     * Returns one version of one of your organisation\'s agreements in full: dates and approval details, classifications with pay rates, penalty rates, allowances, coverage, leave entitlements and working conditions. A version of another organisation\'s agreement answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary Get one enterprise agreement version in full
     * @param {string} versionId The agreement version id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsEnterpriseAgreementsVersionsGetRaw(requestParameters: AwardsEnterpriseAgreementsVersionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsEnterpriseAgreementsVersionsGet200Response>>;

    /**
     * Returns one version of one of your organisation\'s agreements in full: dates and approval details, classifications with pay rates, penalty rates, allowances, coverage, leave entitlements and working conditions. A version of another organisation\'s agreement answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get one enterprise agreement version in full
     */
    awardsEnterpriseAgreementsVersionsGet(requestParameters: AwardsEnterpriseAgreementsVersionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsEnterpriseAgreementsVersionsGet200Response>;

    /**
     * Returns every pay rate of one classification (adult, junior and apprentice, each employment type, every effective period), with weekday, weekend, public holiday, overtime, shift and leave rates. A classification of an award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary List a classification\'s pay rates
     * @param {string} classificationId The classification id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsPayRatesClassificationRaw(requestParameters: AwardsPayRatesClassificationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsPayRatesClassification200Response>>;

    /**
     * Returns every pay rate of one classification (adult, junior and apprentice, each employment type, every effective period), with weekday, weekend, public holiday, overtime, shift and leave rates. A classification of an award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List a classification\'s pay rates
     */
    awardsPayRatesClassification(requestParameters: AwardsPayRatesClassificationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsPayRatesClassification200Response>;

    /**
     * Returns the classification streams of one award your organisation has adopted, ordered by name. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary List an award\'s classification streams
     * @param {string} awardId The award id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsStreamsAwardRaw(requestParameters: AwardsStreamsAwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsStreamsAward200Response>>;

    /**
     * Returns the classification streams of one award your organisation has adopted, ordered by name. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List an award\'s classification streams
     */
    awardsStreamsAward(requestParameters: AwardsStreamsAwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsStreamsAward200Response>;

    /**
     * Returns the classifications in one stream of an award your organisation has adopted. A stream of an award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * @summary List the classifications in a stream
     * @param {string} streamId The stream id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AwardsApiInterface
     */
    awardsStreamsClassificationsRaw(requestParameters: AwardsStreamsClassificationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsStreamsClassifications200Response>>;

    /**
     * Returns the classifications in one stream of an award your organisation has adopted. A stream of an award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List the classifications in a stream
     */
    awardsStreamsClassifications(requestParameters: AwardsStreamsClassificationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsStreamsClassifications200Response>;

}

/**
 * 
 */
export class AwardsApi extends runtime.BaseAPI implements AwardsApiInterface {

    /**
     * Returns one page of an award\'s allowances: the award\'s own rows plus your organisation\'s overrides. `isActive` true gives the allowances in use, false the ones only available to add, and leaving it out gives both. Only the active version\'s rows come back unless `includeSuperseded` is set. Search matches name, description and frequency. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Search an award\'s allowances
     */
    async awardsAllowancesAwardRaw(requestParameters: AwardsAllowancesAwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAllowancesAward200Response>> {
        if (requestParameters['awardId'] == null) {
            throw new runtime.RequiredError(
                'awardId',
                'Required parameter "awardId" was null or undefined when calling awardsAllowancesAward().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['size'] != null) {
            queryParameters['size'] = requestParameters['size'];
        }

        if (requestParameters['sortBy'] != null) {
            queryParameters['sortBy'] = requestParameters['sortBy'];
        }

        if (requestParameters['sortDir'] != null) {
            queryParameters['sortDir'] = requestParameters['sortDir'];
        }

        if (requestParameters['isActive'] != null) {
            queryParameters['isActive'] = requestParameters['isActive'];
        }

        if (requestParameters['includeSuperseded'] != null) {
            queryParameters['includeSuperseded'] = requestParameters['includeSuperseded'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/api/allowances/award/{awardId}`;
        urlPath = urlPath.replace(`{${"awardId"}}`, encodeURIComponent(String(requestParameters['awardId'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsAllowancesAward200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one page of an award\'s allowances: the award\'s own rows plus your organisation\'s overrides. `isActive` true gives the allowances in use, false the ones only available to add, and leaving it out gives both. Only the active version\'s rows come back unless `includeSuperseded` is set. Search matches name, description and frequency. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Search an award\'s allowances
     */
    async awardsAllowancesAward(requestParameters: AwardsAllowancesAwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAllowancesAward200Response> {
        const response = await this.awardsAllowancesAwardRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one allowance of an award your organisation has adopted. An allowance of an award you have not adopted answers 404, the same as one that does not exist.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get one allowance
     */
    async awardsAllowancesGetRaw(requestParameters: AwardsAllowancesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAllowancesGet200Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling awardsAllowancesGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/api/allowances/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsAllowancesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one allowance of an award your organisation has adopted. An allowance of an award you have not adopted answers 404, the same as one that does not exist.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get one allowance
     */
    async awardsAllowancesGet(requestParameters: AwardsAllowancesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAllowancesGet200Response> {
        const response = await this.awardsAllowancesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns your organisation\'s Award Updates queue: each new award version pushed to you that is pending or snoozed, with the version it would replace and how many changes it carries. Ordered by award code, newest version first. Approving, rejecting and snoozing are not available to your integration.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List award updates waiting for your approval
     */
    async awardsAwardVersionsAvuwTenantQueueRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAwardVersionsAvuwTenantQueue200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/api/award-versions/avuw/tenant/queue`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsAwardVersionsAvuwTenantQueue200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns your organisation\'s Award Updates queue: each new award version pushed to you that is pending or snoozed, with the version it would replace and how many changes it carries. Ordered by award code, newest version first. Approving, rejecting and snoozing are not available to your integration.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List award updates waiting for your approval
     */
    async awardsAwardVersionsAvuwTenantQueue(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAwardVersionsAvuwTenantQueue200Response> {
        const response = await this.awardsAwardVersionsAvuwTenantQueueRaw(initOverrides);
        return await response.value();
    }

    /**
     * Returns one award update in your queue with every change it makes: classifications, pay rates, allowances and rules added, updated, removed or translated, with before and after values and the changes that need a manual check. An update that is not your organisation\'s answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Review the changes in an award update
     */
    async awardsAwardVersionsAvuwTenantQueueReviewRaw(requestParameters: AwardsAwardVersionsAvuwTenantQueueReviewRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAwardVersionsAvuwTenantQueueReview200Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling awardsAwardVersionsAvuwTenantQueueReview().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/api/award-versions/avuw/tenant/queue/{id}/review`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsAwardVersionsAvuwTenantQueueReview200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one award update in your queue with every change it makes: classifications, pay rates, allowances and rules added, updated, removed or translated, with before and after values and the changes that need a manual check. An update that is not your organisation\'s answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Review the changes in an award update
     */
    async awardsAwardVersionsAvuwTenantQueueReview(requestParameters: AwardsAwardVersionsAvuwTenantQueueReviewRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAwardVersionsAvuwTenantQueueReview200Response> {
        const response = await this.awardsAwardVersionsAvuwTenantQueueReviewRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the awards your organisation has adopted, ordered by name, each with its currently active version. An award pushed to you but still waiting on your Award Updates queue is not listed until it is approved.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List the awards your organisation uses
     */
    async awardsAwardsAvailableRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAwardsAvailable200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/api/Awards/available`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsAwardsAvailable200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the awards your organisation has adopted, ordered by name, each with its currently active version. An award pushed to you but still waiting on your Award Updates queue is not listed until it is approved.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List the awards your organisation uses
     */
    async awardsAwardsAvailable(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAwardsAvailable200Response> {
        const response = await this.awardsAwardsAvailableRaw(initOverrides);
        return await response.value();
    }

    /**
     * Returns one award your organisation has adopted, with how many streams, classifications, rules, allowances, break rules and pay rates it holds. Counts cover the active version and include your own overrides. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get an award with its content counts
     */
    async awardsAwardsDetailsRaw(requestParameters: AwardsAwardsDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAwardsDetails200Response>> {
        if (requestParameters['awardId'] == null) {
            throw new runtime.RequiredError(
                'awardId',
                'Required parameter "awardId" was null or undefined when calling awardsAwardsDetails().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/api/Awards/{awardId}/details`;
        urlPath = urlPath.replace(`{${"awardId"}}`, encodeURIComponent(String(requestParameters['awardId'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsAwardsDetails200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one award your organisation has adopted, with how many streams, classifications, rules, allowances, break rules and pay rates it holds. Counts cover the active version and include your own overrides. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get an award with its content counts
     */
    async awardsAwardsDetails(requestParameters: AwardsAwardsDetailsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAwardsDetails200Response> {
        const response = await this.awardsAwardsDetailsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one award your organisation has adopted, with its active version. An award you have not adopted answers 404, the same as one that does not exist.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get one award
     */
    async awardsAwardsGetRaw(requestParameters: AwardsAwardsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsAwardsGet200Response>> {
        if (requestParameters['awardId'] == null) {
            throw new runtime.RequiredError(
                'awardId',
                'Required parameter "awardId" was null or undefined when calling awardsAwardsGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/api/Awards/{awardId}`;
        urlPath = urlPath.replace(`{${"awardId"}}`, encodeURIComponent(String(requestParameters['awardId'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsAwardsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one award your organisation has adopted, with its active version. An award you have not adopted answers 404, the same as one that does not exist.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get one award
     */
    async awardsAwardsGet(requestParameters: AwardsAwardsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsAwardsGet200Response> {
        const response = await this.awardsAwardsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one page of an award\'s classifications, searching name, level code and description. By default only the active version\'s rows come back; set `includeHistory` for every version\'s copy. Send `ids` to look up particular classifications by id instead of searching. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Search an award\'s classifications
     */
    async awardsClassificationsAwardRaw(requestParameters: AwardsClassificationsAwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsClassificationsAward200Response>> {
        if (requestParameters['awardId'] == null) {
            throw new runtime.RequiredError(
                'awardId',
                'Required parameter "awardId" was null or undefined when calling awardsClassificationsAward().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['size'] != null) {
            queryParameters['size'] = requestParameters['size'];
        }

        if (requestParameters['sortBy'] != null) {
            queryParameters['sortBy'] = requestParameters['sortBy'];
        }

        if (requestParameters['sortDir'] != null) {
            queryParameters['sortDir'] = requestParameters['sortDir'];
        }

        if (requestParameters['includeHistory'] != null) {
            queryParameters['includeHistory'] = requestParameters['includeHistory'];
        }

        if (requestParameters['ids'] != null) {
            queryParameters['ids'] = requestParameters['ids'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/api/classifications/award/{awardId}`;
        urlPath = urlPath.replace(`{${"awardId"}}`, encodeURIComponent(String(requestParameters['awardId'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsClassificationsAward200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one page of an award\'s classifications, searching name, level code and description. By default only the active version\'s rows come back; set `includeHistory` for every version\'s copy. Send `ids` to look up particular classifications by id instead of searching. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Search an award\'s classifications
     */
    async awardsClassificationsAward(requestParameters: AwardsClassificationsAwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsClassificationsAward200Response> {
        const response = await this.awardsClassificationsAwardRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns your organisation\'s enterprise agreements and individual flexibility arrangements, ordered by name, each with its versions newest first.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List your enterprise agreements
     */
    async awardsEnterpriseAgreementsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsEnterpriseAgreements200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/enterprise-agreements`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsEnterpriseAgreements200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns your organisation\'s enterprise agreements and individual flexibility arrangements, ordered by name, each with its versions newest first.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List your enterprise agreements
     */
    async awardsEnterpriseAgreements(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsEnterpriseAgreements200Response> {
        const response = await this.awardsEnterpriseAgreementsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Returns one of your organisation\'s agreements with its versions, newest first. Another organisation\'s agreement answers 404, the same as one that does not exist.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get one enterprise agreement
     */
    async awardsEnterpriseAgreementsGetRaw(requestParameters: AwardsEnterpriseAgreementsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsEnterpriseAgreementsGet200Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling awardsEnterpriseAgreementsGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/enterprise-agreements/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsEnterpriseAgreementsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one of your organisation\'s agreements with its versions, newest first. Another organisation\'s agreement answers 404, the same as one that does not exist.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get one enterprise agreement
     */
    async awardsEnterpriseAgreementsGet(requestParameters: AwardsEnterpriseAgreementsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsEnterpriseAgreementsGet200Response> {
        const response = await this.awardsEnterpriseAgreementsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one version of one of your organisation\'s agreements in full: dates and approval details, classifications with pay rates, penalty rates, allowances, coverage, leave entitlements and working conditions. A version of another organisation\'s agreement answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get one enterprise agreement version in full
     */
    async awardsEnterpriseAgreementsVersionsGetRaw(requestParameters: AwardsEnterpriseAgreementsVersionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsEnterpriseAgreementsVersionsGet200Response>> {
        if (requestParameters['versionId'] == null) {
            throw new runtime.RequiredError(
                'versionId',
                'Required parameter "versionId" was null or undefined when calling awardsEnterpriseAgreementsVersionsGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/enterprise-agreements/versions/{versionId}`;
        urlPath = urlPath.replace(`{${"versionId"}}`, encodeURIComponent(String(requestParameters['versionId'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsEnterpriseAgreementsVersionsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one version of one of your organisation\'s agreements in full: dates and approval details, classifications with pay rates, penalty rates, allowances, coverage, leave entitlements and working conditions. A version of another organisation\'s agreement answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * Get one enterprise agreement version in full
     */
    async awardsEnterpriseAgreementsVersionsGet(requestParameters: AwardsEnterpriseAgreementsVersionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsEnterpriseAgreementsVersionsGet200Response> {
        const response = await this.awardsEnterpriseAgreementsVersionsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns every pay rate of one classification (adult, junior and apprentice, each employment type, every effective period), with weekday, weekend, public holiday, overtime, shift and leave rates. A classification of an award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List a classification\'s pay rates
     */
    async awardsPayRatesClassificationRaw(requestParameters: AwardsPayRatesClassificationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsPayRatesClassification200Response>> {
        if (requestParameters['classificationId'] == null) {
            throw new runtime.RequiredError(
                'classificationId',
                'Required parameter "classificationId" was null or undefined when calling awardsPayRatesClassification().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/api/pay-rates/classification/{classificationId}`;
        urlPath = urlPath.replace(`{${"classificationId"}}`, encodeURIComponent(String(requestParameters['classificationId'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsPayRatesClassification200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns every pay rate of one classification (adult, junior and apprentice, each employment type, every effective period), with weekday, weekend, public holiday, overtime, shift and leave rates. A classification of an award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List a classification\'s pay rates
     */
    async awardsPayRatesClassification(requestParameters: AwardsPayRatesClassificationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsPayRatesClassification200Response> {
        const response = await this.awardsPayRatesClassificationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the classification streams of one award your organisation has adopted, ordered by name. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List an award\'s classification streams
     */
    async awardsStreamsAwardRaw(requestParameters: AwardsStreamsAwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsStreamsAward200Response>> {
        if (requestParameters['awardId'] == null) {
            throw new runtime.RequiredError(
                'awardId',
                'Required parameter "awardId" was null or undefined when calling awardsStreamsAward().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/api/streams/award/{awardId}`;
        urlPath = urlPath.replace(`{${"awardId"}}`, encodeURIComponent(String(requestParameters['awardId'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsStreamsAward200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the classification streams of one award your organisation has adopted, ordered by name. An award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List an award\'s classification streams
     */
    async awardsStreamsAward(requestParameters: AwardsStreamsAwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsStreamsAward200Response> {
        const response = await this.awardsStreamsAwardRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the classifications in one stream of an award your organisation has adopted. A stream of an award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List the classifications in a stream
     */
    async awardsStreamsClassificationsRaw(requestParameters: AwardsStreamsClassificationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AwardsStreamsClassifications200Response>> {
        if (requestParameters['streamId'] == null) {
            throw new runtime.RequiredError(
                'streamId',
                'Required parameter "streamId" was null or undefined when calling awardsStreamsClassifications().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["awards.read"]);
        }


        let urlPath = `/awards/api/streams/{streamId}/classifications`;
        urlPath = urlPath.replace(`{${"streamId"}}`, encodeURIComponent(String(requestParameters['streamId'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AwardsStreamsClassifications200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the classifications in one stream of an award your organisation has adopted. A stream of an award you have not adopted answers 404.  **Required scope:** `awards.read`  See **Responses** below for the status codes this operation can return.
     * List the classifications in a stream
     */
    async awardsStreamsClassifications(requestParameters: AwardsStreamsClassificationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AwardsStreamsClassifications200Response> {
        const response = await this.awardsStreamsClassificationsRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
