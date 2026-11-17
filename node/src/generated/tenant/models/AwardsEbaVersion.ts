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
import { parseApiDate } from '../../../dates.js';
import type { AwardsEbaVersionCoverageMappingsInner } from './AwardsEbaVersionCoverageMappingsInner.js';
import {
    AwardsEbaVersionCoverageMappingsInnerFromJSON,
    AwardsEbaVersionCoverageMappingsInnerFromJSONTyped,
    AwardsEbaVersionCoverageMappingsInnerToJSON,
    AwardsEbaVersionCoverageMappingsInnerToJSONTyped,
} from './AwardsEbaVersionCoverageMappingsInner.js';
import type { AwardsEbaVersionLeaveEntitlementsInner } from './AwardsEbaVersionLeaveEntitlementsInner.js';
import {
    AwardsEbaVersionLeaveEntitlementsInnerFromJSON,
    AwardsEbaVersionLeaveEntitlementsInnerFromJSONTyped,
    AwardsEbaVersionLeaveEntitlementsInnerToJSON,
    AwardsEbaVersionLeaveEntitlementsInnerToJSONTyped,
} from './AwardsEbaVersionLeaveEntitlementsInner.js';
import type { AwardsEbaVersionClassificationsInner } from './AwardsEbaVersionClassificationsInner.js';
import {
    AwardsEbaVersionClassificationsInnerFromJSON,
    AwardsEbaVersionClassificationsInnerFromJSONTyped,
    AwardsEbaVersionClassificationsInnerToJSON,
    AwardsEbaVersionClassificationsInnerToJSONTyped,
} from './AwardsEbaVersionClassificationsInner.js';
import type { AwardsEbaVersionPenaltyRatesInner } from './AwardsEbaVersionPenaltyRatesInner.js';
import {
    AwardsEbaVersionPenaltyRatesInnerFromJSON,
    AwardsEbaVersionPenaltyRatesInnerFromJSONTyped,
    AwardsEbaVersionPenaltyRatesInnerToJSON,
    AwardsEbaVersionPenaltyRatesInnerToJSONTyped,
} from './AwardsEbaVersionPenaltyRatesInner.js';
import type { AwardsEbaVersionAllowancesInner } from './AwardsEbaVersionAllowancesInner.js';
import {
    AwardsEbaVersionAllowancesInnerFromJSON,
    AwardsEbaVersionAllowancesInnerFromJSONTyped,
    AwardsEbaVersionAllowancesInnerToJSON,
    AwardsEbaVersionAllowancesInnerToJSONTyped,
} from './AwardsEbaVersionAllowancesInner.js';
import type { AwardsEbaVersionWorkingConditionsInner } from './AwardsEbaVersionWorkingConditionsInner.js';
import {
    AwardsEbaVersionWorkingConditionsInnerFromJSON,
    AwardsEbaVersionWorkingConditionsInnerFromJSONTyped,
    AwardsEbaVersionWorkingConditionsInnerToJSON,
    AwardsEbaVersionWorkingConditionsInnerToJSONTyped,
} from './AwardsEbaVersionWorkingConditionsInner.js';

/**
 * One agreement version in full.
 * @export
 * @interface AwardsEbaVersion
 */
export interface AwardsEbaVersion {
    /**
     * Version id.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    ebaVersionId?: string;
    /**
     * Agreement id.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    enterpriseAgreementId?: string;
    /**
     * Version number.
     * @type {number}
     * @memberof AwardsEbaVersion
     */
    versionNumber?: number;
    /**
     * The version it replaced.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    previousVersionId?: string | null;
    /**
     * Fair Work Commission approval number.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    fwcApprovalNumber?: string | null;
    /**
     * Fair Work Commission matter reference.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    fwcReferenceNumber?: string | null;
    /**
     * Approval date.
     * @type {Date}
     * @memberof AwardsEbaVersion
     */
    approvalDate?: Date | null;
    /**
     * Commencement date. A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    commencementDate?: string;
    /**
     * Nominal expiry date. A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    nominalExpiryDate?: string;
    /**
     * Version status, such as Active, Scheduled, NominalExpiry, Superseded, Terminated or Expired.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    status?: string;
    /**
     * Better-off-overall test outcome, such as Unevaluated.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    bootOutcome?: string;
    /**
     * Reasoning recorded for the test outcome.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    bootJustification?: string | null;
    /**
     * When the test was last run (UTC).
     * @type {Date}
     * @memberof AwardsEbaVersion
     */
    bootLastEvaluatedAtUtc?: Date | null;
    /**
     * Annual pay increase, per cent.
     * @type {number}
     * @memberof AwardsEbaVersion
     */
    annualIncreasePercent?: number | null;
    /**
     * Date of the next increase. A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    nextIncreaseDate?: string | null;
    /**
     * Superannuation, per cent.
     * @type {number}
     * @memberof AwardsEbaVersion
     */
    superannuationPercent?: number | null;
    /**
     * Annual leave, weeks.
     * @type {number}
     * @memberof AwardsEbaVersion
     */
    annualLeaveWeeks?: number | null;
    /**
     * Personal leave, days.
     * @type {number}
     * @memberof AwardsEbaVersion
     */
    personalLeaveDays?: number | null;
    /**
     * Start date. A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    effectiveFrom?: string;
    /**
     * End date, if any. A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    effectiveTo?: string | null;
    /**
     * Date the notice of employee representational rights was issued. A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    nerrIssuedDate?: string | null;
    /**
     * Date the ballot opened. A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    ballotOpenedDate?: string | null;
    /**
     * Date the ballot closed. A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    ballotClosedDate?: string | null;
    /**
     * Ballot result.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    ballotResult?: string | null;
    /**
     * Date lodged with the Fair Work Commission. A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    fwcLodgedDate?: string | null;
    /**
     * Approval status at the Commission.
     * @type {string}
     * @memberof AwardsEbaVersion
     */
    fwcApprovalStatus?: string | null;
    /**
     * Classifications, by level.
     * @type {Array<AwardsEbaVersionClassificationsInner>}
     * @memberof AwardsEbaVersion
     */
    classifications?: Array<AwardsEbaVersionClassificationsInner>;
    /**
     * Penalty rates.
     * @type {Array<AwardsEbaVersionPenaltyRatesInner>}
     * @memberof AwardsEbaVersion
     */
    penaltyRates?: Array<AwardsEbaVersionPenaltyRatesInner>;
    /**
     * Allowances.
     * @type {Array<AwardsEbaVersionAllowancesInner>}
     * @memberof AwardsEbaVersion
     */
    allowances?: Array<AwardsEbaVersionAllowancesInner>;
    /**
     * Where the agreement applies.
     * @type {Array<AwardsEbaVersionCoverageMappingsInner>}
     * @memberof AwardsEbaVersion
     */
    coverageMappings?: Array<AwardsEbaVersionCoverageMappingsInner>;
    /**
     * Leave entitlements.
     * @type {Array<AwardsEbaVersionLeaveEntitlementsInner>}
     * @memberof AwardsEbaVersion
     */
    leaveEntitlements?: Array<AwardsEbaVersionLeaveEntitlementsInner>;
    /**
     * Working conditions.
     * @type {Array<AwardsEbaVersionWorkingConditionsInner>}
     * @memberof AwardsEbaVersion
     */
    workingConditions?: Array<AwardsEbaVersionWorkingConditionsInner>;
}

/**
 * Check if a given object implements the AwardsEbaVersion interface.
 */
export function instanceOfAwardsEbaVersion(value: object): value is AwardsEbaVersion {
    return true;
}

export function AwardsEbaVersionFromJSON(json: any): AwardsEbaVersion {
    return AwardsEbaVersionFromJSONTyped(json, false);
}

export function AwardsEbaVersionFromJSONTyped(json: any, ignoreDiscriminator: boolean): AwardsEbaVersion {
    if (json == null) {
        return json;
    }
    return {
        
        'ebaVersionId': json['ebaVersionId'] == null ? undefined : json['ebaVersionId'],
        'enterpriseAgreementId': json['enterpriseAgreementId'] == null ? undefined : json['enterpriseAgreementId'],
        'versionNumber': json['versionNumber'] == null ? undefined : json['versionNumber'],
        'previousVersionId': json['previousVersionId'] == null ? undefined : json['previousVersionId'],
        'fwcApprovalNumber': json['fwcApprovalNumber'] == null ? undefined : json['fwcApprovalNumber'],
        'fwcReferenceNumber': json['fwcReferenceNumber'] == null ? undefined : json['fwcReferenceNumber'],
        'approvalDate': json['approvalDate'] == null ? undefined : (parseApiDate(json['approvalDate'])),
        'commencementDate': json['commencementDate'] == null ? undefined : json['commencementDate'],
        'nominalExpiryDate': json['nominalExpiryDate'] == null ? undefined : json['nominalExpiryDate'],
        'status': json['status'] == null ? undefined : json['status'],
        'bootOutcome': json['bootOutcome'] == null ? undefined : json['bootOutcome'],
        'bootJustification': json['bootJustification'] == null ? undefined : json['bootJustification'],
        'bootLastEvaluatedAtUtc': json['bootLastEvaluatedAtUtc'] == null ? undefined : (parseApiDate(json['bootLastEvaluatedAtUtc'])),
        'annualIncreasePercent': json['annualIncreasePercent'] == null ? undefined : json['annualIncreasePercent'],
        'nextIncreaseDate': json['nextIncreaseDate'] == null ? undefined : json['nextIncreaseDate'],
        'superannuationPercent': json['superannuationPercent'] == null ? undefined : json['superannuationPercent'],
        'annualLeaveWeeks': json['annualLeaveWeeks'] == null ? undefined : json['annualLeaveWeeks'],
        'personalLeaveDays': json['personalLeaveDays'] == null ? undefined : json['personalLeaveDays'],
        'effectiveFrom': json['effectiveFrom'] == null ? undefined : json['effectiveFrom'],
        'effectiveTo': json['effectiveTo'] == null ? undefined : json['effectiveTo'],
        'nerrIssuedDate': json['nerrIssuedDate'] == null ? undefined : json['nerrIssuedDate'],
        'ballotOpenedDate': json['ballotOpenedDate'] == null ? undefined : json['ballotOpenedDate'],
        'ballotClosedDate': json['ballotClosedDate'] == null ? undefined : json['ballotClosedDate'],
        'ballotResult': json['ballotResult'] == null ? undefined : json['ballotResult'],
        'fwcLodgedDate': json['fwcLodgedDate'] == null ? undefined : json['fwcLodgedDate'],
        'fwcApprovalStatus': json['fwcApprovalStatus'] == null ? undefined : json['fwcApprovalStatus'],
        'classifications': json['classifications'] == null ? undefined : ((json['classifications'] as Array<any>).map(AwardsEbaVersionClassificationsInnerFromJSON)),
        'penaltyRates': json['penaltyRates'] == null ? undefined : ((json['penaltyRates'] as Array<any>).map(AwardsEbaVersionPenaltyRatesInnerFromJSON)),
        'allowances': json['allowances'] == null ? undefined : ((json['allowances'] as Array<any>).map(AwardsEbaVersionAllowancesInnerFromJSON)),
        'coverageMappings': json['coverageMappings'] == null ? undefined : ((json['coverageMappings'] as Array<any>).map(AwardsEbaVersionCoverageMappingsInnerFromJSON)),
        'leaveEntitlements': json['leaveEntitlements'] == null ? undefined : ((json['leaveEntitlements'] as Array<any>).map(AwardsEbaVersionLeaveEntitlementsInnerFromJSON)),
        'workingConditions': json['workingConditions'] == null ? undefined : ((json['workingConditions'] as Array<any>).map(AwardsEbaVersionWorkingConditionsInnerFromJSON)),
    };
}

export function AwardsEbaVersionToJSON(json: any): AwardsEbaVersion {
    return AwardsEbaVersionToJSONTyped(json, false);
}

export function AwardsEbaVersionToJSONTyped(value?: AwardsEbaVersion | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'ebaVersionId': value['ebaVersionId'],
        'enterpriseAgreementId': value['enterpriseAgreementId'],
        'versionNumber': value['versionNumber'],
        'previousVersionId': value['previousVersionId'],
        'fwcApprovalNumber': value['fwcApprovalNumber'],
        'fwcReferenceNumber': value['fwcReferenceNumber'],
        'approvalDate': value['approvalDate'] === null ? null : ((value['approvalDate'] as any)?.toISOString()),
        'commencementDate': value['commencementDate'],
        'nominalExpiryDate': value['nominalExpiryDate'],
        'status': value['status'],
        'bootOutcome': value['bootOutcome'],
        'bootJustification': value['bootJustification'],
        'bootLastEvaluatedAtUtc': value['bootLastEvaluatedAtUtc'] === null ? null : ((value['bootLastEvaluatedAtUtc'] as any)?.toISOString()),
        'annualIncreasePercent': value['annualIncreasePercent'],
        'nextIncreaseDate': value['nextIncreaseDate'],
        'superannuationPercent': value['superannuationPercent'],
        'annualLeaveWeeks': value['annualLeaveWeeks'],
        'personalLeaveDays': value['personalLeaveDays'],
        'effectiveFrom': value['effectiveFrom'],
        'effectiveTo': value['effectiveTo'],
        'nerrIssuedDate': value['nerrIssuedDate'],
        'ballotOpenedDate': value['ballotOpenedDate'],
        'ballotClosedDate': value['ballotClosedDate'],
        'ballotResult': value['ballotResult'],
        'fwcLodgedDate': value['fwcLodgedDate'],
        'fwcApprovalStatus': value['fwcApprovalStatus'],
        'classifications': value['classifications'] == null ? undefined : ((value['classifications'] as Array<any>).map(AwardsEbaVersionClassificationsInnerToJSON)),
        'penaltyRates': value['penaltyRates'] == null ? undefined : ((value['penaltyRates'] as Array<any>).map(AwardsEbaVersionPenaltyRatesInnerToJSON)),
        'allowances': value['allowances'] == null ? undefined : ((value['allowances'] as Array<any>).map(AwardsEbaVersionAllowancesInnerToJSON)),
        'coverageMappings': value['coverageMappings'] == null ? undefined : ((value['coverageMappings'] as Array<any>).map(AwardsEbaVersionCoverageMappingsInnerToJSON)),
        'leaveEntitlements': value['leaveEntitlements'] == null ? undefined : ((value['leaveEntitlements'] as Array<any>).map(AwardsEbaVersionLeaveEntitlementsInnerToJSON)),
        'workingConditions': value['workingConditions'] == null ? undefined : ((value['workingConditions'] as Array<any>).map(AwardsEbaVersionWorkingConditionsInnerToJSON)),
    };
}

