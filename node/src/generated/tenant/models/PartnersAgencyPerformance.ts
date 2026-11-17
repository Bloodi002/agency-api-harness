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

import { mapValues } from '../runtime.js';
import type { PartnersAgencyTopWorker } from './PartnersAgencyTopWorker.js';
import {
    PartnersAgencyTopWorkerFromJSON,
    PartnersAgencyTopWorkerFromJSONTyped,
    PartnersAgencyTopWorkerToJSON,
    PartnersAgencyTopWorkerToJSONTyped,
} from './PartnersAgencyTopWorker.js';
import type { PartnersAgencyTrendPoint } from './PartnersAgencyTrendPoint.js';
import {
    PartnersAgencyTrendPointFromJSON,
    PartnersAgencyTrendPointFromJSONTyped,
    PartnersAgencyTrendPointToJSON,
    PartnersAgencyTrendPointToJSONTyped,
} from './PartnersAgencyTrendPoint.js';

/**
 * One partner agency's figures for your organisation. Rates are percentages from 0 to 100; null means there was nothing to measure yet.
 * @export
 * @interface PartnersAgencyPerformance
 */
export interface PartnersAgencyPerformance {
    /**
     * 
     * @type {string}
     * @memberof PartnersAgencyPerformance
     */
    tblAgencyId?: string;
    /**
     * 
     * @type {string}
     * @memberof PartnersAgencyPerformance
     */
    agencyName?: string | null;
    /**
     * Shift requests sent to the agency in the window.
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    proposalCount?: number;
    /**
     * 
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    respondedCount?: number;
    /**
     * 
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    declinedCount?: number;
    /**
     * Candidates put forward.
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    submittedCount?: number;
    /**
     * 
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    placementCount?: number;
    /**
     * 
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    completedCount?: number;
    /**
     * Average minutes from sending to the agency's first response.
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    avgResponseMinutes?: number | null;
    /**
     * Placements over requests sent.
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    fillRate?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    onTimeRate?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    noShowRate?: number | null;
    /**
     * Compliance requirements met over those that apply.
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    complianceScore?: number | null;
    /**
     * Placements that went well over those that reached an outcome.
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    reliabilityScore?: number | null;
    /**
     * Average minutes from sending to the first placement.
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    avgTimeToFillMinutes?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    ratingCount?: number;
    /**
     * Out of 5.
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    overallRating?: number | null;
    /**
     * Worked, ended shifts you have not rated; each counts as 5.
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    unratedShiftCount?: number;
    /**
     * 
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    likeCount?: number;
    /**
     * overallRating as a percentage of 5.
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    satisfactionRate?: number | null;
    /**
     * Liked over rated shifts.
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    likeRate?: number | null;
    /**
     * Shifts with a reported issue over rated shifts.
     * @type {number}
     * @memberof PartnersAgencyPerformance
     */
    issueRate?: number | null;
    /**
     * 
     * @type {Array<PartnersAgencyTrendPoint>}
     * @memberof PartnersAgencyPerformance
     */
    trend?: Array<PartnersAgencyTrendPoint>;
    /**
     * 
     * @type {Array<PartnersAgencyTopWorker>}
     * @memberof PartnersAgencyPerformance
     */
    topWorkers?: Array<PartnersAgencyTopWorker>;
}

/**
 * Check if a given object implements the PartnersAgencyPerformance interface.
 */
export function instanceOfPartnersAgencyPerformance(value: object): value is PartnersAgencyPerformance {
    return true;
}

export function PartnersAgencyPerformanceFromJSON(json: any): PartnersAgencyPerformance {
    return PartnersAgencyPerformanceFromJSONTyped(json, false);
}

export function PartnersAgencyPerformanceFromJSONTyped(json: any, ignoreDiscriminator: boolean): PartnersAgencyPerformance {
    if (json == null) {
        return json;
    }
    return {
        
        'tblAgencyId': json['tblAgencyId'] == null ? undefined : json['tblAgencyId'],
        'agencyName': json['agencyName'] == null ? undefined : json['agencyName'],
        'proposalCount': json['proposalCount'] == null ? undefined : json['proposalCount'],
        'respondedCount': json['respondedCount'] == null ? undefined : json['respondedCount'],
        'declinedCount': json['declinedCount'] == null ? undefined : json['declinedCount'],
        'submittedCount': json['submittedCount'] == null ? undefined : json['submittedCount'],
        'placementCount': json['placementCount'] == null ? undefined : json['placementCount'],
        'completedCount': json['completedCount'] == null ? undefined : json['completedCount'],
        'avgResponseMinutes': json['avgResponseMinutes'] == null ? undefined : json['avgResponseMinutes'],
        'fillRate': json['fillRate'] == null ? undefined : json['fillRate'],
        'onTimeRate': json['onTimeRate'] == null ? undefined : json['onTimeRate'],
        'noShowRate': json['noShowRate'] == null ? undefined : json['noShowRate'],
        'complianceScore': json['complianceScore'] == null ? undefined : json['complianceScore'],
        'reliabilityScore': json['reliabilityScore'] == null ? undefined : json['reliabilityScore'],
        'avgTimeToFillMinutes': json['avgTimeToFillMinutes'] == null ? undefined : json['avgTimeToFillMinutes'],
        'ratingCount': json['ratingCount'] == null ? undefined : json['ratingCount'],
        'overallRating': json['overallRating'] == null ? undefined : json['overallRating'],
        'unratedShiftCount': json['unratedShiftCount'] == null ? undefined : json['unratedShiftCount'],
        'likeCount': json['likeCount'] == null ? undefined : json['likeCount'],
        'satisfactionRate': json['satisfactionRate'] == null ? undefined : json['satisfactionRate'],
        'likeRate': json['likeRate'] == null ? undefined : json['likeRate'],
        'issueRate': json['issueRate'] == null ? undefined : json['issueRate'],
        'trend': json['trend'] == null ? undefined : ((json['trend'] as Array<any>).map(PartnersAgencyTrendPointFromJSON)),
        'topWorkers': json['topWorkers'] == null ? undefined : ((json['topWorkers'] as Array<any>).map(PartnersAgencyTopWorkerFromJSON)),
    };
}

export function PartnersAgencyPerformanceToJSON(json: any): PartnersAgencyPerformance {
    return PartnersAgencyPerformanceToJSONTyped(json, false);
}

export function PartnersAgencyPerformanceToJSONTyped(value?: PartnersAgencyPerformance | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'tblAgencyId': value['tblAgencyId'],
        'agencyName': value['agencyName'],
        'proposalCount': value['proposalCount'],
        'respondedCount': value['respondedCount'],
        'declinedCount': value['declinedCount'],
        'submittedCount': value['submittedCount'],
        'placementCount': value['placementCount'],
        'completedCount': value['completedCount'],
        'avgResponseMinutes': value['avgResponseMinutes'],
        'fillRate': value['fillRate'],
        'onTimeRate': value['onTimeRate'],
        'noShowRate': value['noShowRate'],
        'complianceScore': value['complianceScore'],
        'reliabilityScore': value['reliabilityScore'],
        'avgTimeToFillMinutes': value['avgTimeToFillMinutes'],
        'ratingCount': value['ratingCount'],
        'overallRating': value['overallRating'],
        'unratedShiftCount': value['unratedShiftCount'],
        'likeCount': value['likeCount'],
        'satisfactionRate': value['satisfactionRate'],
        'likeRate': value['likeRate'],
        'issueRate': value['issueRate'],
        'trend': value['trend'] == null ? undefined : ((value['trend'] as Array<any>).map(PartnersAgencyTrendPointToJSON)),
        'topWorkers': value['topWorkers'] == null ? undefined : ((value['topWorkers'] as Array<any>).map(PartnersAgencyTopWorkerToJSON)),
    };
}

