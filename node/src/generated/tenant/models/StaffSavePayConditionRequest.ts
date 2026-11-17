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
/**
 * 
 * @export
 * @interface StaffSavePayConditionRequest
 */
export interface StaffSavePayConditionRequest {
    /**
     * The period being edited, if any; used to tell whether award-rate overrides changed. The period itself is matched by its dates
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    tblStaffPayConditionId?: string;
    /**
     * The staff member's id; must belong to your organisation, or the call answers 404
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    tblStaffId: string;
    /**
     * 
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    payCycleType?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    positionId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    payrateType?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    industryAwardId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    classificationId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    employmentTypeId?: string | null;
    /**
     * Contracted hours per week (decimals allowed)
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    contractedHours?: number | null;
    /**
     * Pay period id; when sent it must be an active pay period
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    payPeriodId?: string | null;
    /**
     * Overriding award rates. Turning this on, or changing any override rate, is refused with 403: it needs a person's approval
     * @type {boolean}
     * @memberof StaffSavePayConditionRequest
     */
    isOverrideAwardRates?: boolean;
    /**
     * Custom hourly rate, AUD
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    customHourlyRate?: number | null;
    /**
     * Annual salary, AUD
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    annualSalaryRate?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    baseHourlyRate?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    saturdayRatePercent?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    sundayRatePercent?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    publicHolidayPercent?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    otFirst2HoursPercent?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    otAfter2HoursPercent?: number | null;
    /**
     * 
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    reason?: string | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    oldRate?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    newRate?: number | null;
    /**
     * Period start. Required A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    retrospectiveFrom: string;
    /**
     * Period end; omit for an open-ended period A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    retrospectiveTo?: string | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    effectiveFrom?: string | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    effectiveTo?: string | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    totalTimesheets?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    totalHours?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    totalAdjustment?: number | null;
    /**
     * 
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    positionTemplateId?: string | null;
    /**
     * Award allowances that apply. Omit to leave them as they are; an empty list removes them all
     * @type {Array<string>}
     * @memberof StaffSavePayConditionRequest
     */
    awardAllowanceIds?: Array<string> | null;
    /**
     * 
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    positionTitleId?: string | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    fte?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    guaranteedMinHoursPerWeek?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    averagingPeriodWeeks?: number | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    averagingCycleStartDate?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffSavePayConditionRequest
     */
    isShiftWorker?: boolean | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffSavePayConditionRequest
     */
    isRotatingShiftWorker?: boolean | null;
    /**
     * 
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    rotationPattern?: string | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    rotationCycleWeeks?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    avgNightsPerCycle?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    annualLeaveWeeks?: number | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffSavePayConditionRequest
     */
    isRosteredSundays?: boolean | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffSavePayConditionRequest
     */
    isRosteredPublicHolidays?: boolean | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    superannuationPercent?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    ordinaryHoursPerWeek?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    ordinaryHoursPerDay?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    rosterCycleWeeks?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    overtimeAfterDailyHours?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    overtimeAfterWeeklyHours?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    eveningLoadingPercent?: number | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffSavePayConditionRequest
     */
    customizeOrdinaryHours?: boolean | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffSavePayConditionRequest
     */
    customizeLoadings?: boolean | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffSavePayConditionRequest
     */
    rdoApplicable?: boolean | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    rdoAnchorDate?: string | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    rdoPreferredDay?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    rdoCycleWeeks?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    rdoExtraMinutesPerDay?: number | null;
    /**
     * How an RDO shortfall is handled
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    rdoShortfallTreatment?: number | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffSavePayConditionRequest
     */
    adoApplicable?: boolean | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    adoExtraOrdinaryMinutesPerDay?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    adoHoursPerDayOff?: number | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffSavePayConditionRequest
     */
    adoAutoScheduleDayOff?: boolean | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    adoMaxConsecutiveDays?: number | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffSavePayConditionRequest
     */
    toilApplicable?: boolean | null;
    /**
     * 
     * @type {string}
     * @memberof StaffSavePayConditionRequest
     */
    toilConversionMethod?: string | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    toilMaxBalanceHours?: number | null;
    /**
     * 
     * @type {number}
     * @memberof StaffSavePayConditionRequest
     */
    toilExpiryDays?: number | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffSavePayConditionRequest
     */
    toilPreApprovalRequired?: boolean | null;
}

/**
 * Check if a given object implements the StaffSavePayConditionRequest interface.
 */
export function instanceOfStaffSavePayConditionRequest(value: object): value is StaffSavePayConditionRequest {
    if (!('tblStaffId' in value) || value['tblStaffId'] === undefined) return false;
    if (!('retrospectiveFrom' in value) || value['retrospectiveFrom'] === undefined) return false;
    return true;
}

export function StaffSavePayConditionRequestFromJSON(json: any): StaffSavePayConditionRequest {
    return StaffSavePayConditionRequestFromJSONTyped(json, false);
}

export function StaffSavePayConditionRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): StaffSavePayConditionRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'tblStaffPayConditionId': json['tblStaffPayConditionId'] == null ? undefined : json['tblStaffPayConditionId'],
        'tblStaffId': json['tblStaffId'],
        'payCycleType': json['payCycleType'] == null ? undefined : json['payCycleType'],
        'positionId': json['positionId'] == null ? undefined : json['positionId'],
        'payrateType': json['payrateType'] == null ? undefined : json['payrateType'],
        'industryAwardId': json['industryAwardId'] == null ? undefined : json['industryAwardId'],
        'classificationId': json['classificationId'] == null ? undefined : json['classificationId'],
        'employmentTypeId': json['employmentTypeId'] == null ? undefined : json['employmentTypeId'],
        'contractedHours': json['contractedHours'] == null ? undefined : json['contractedHours'],
        'payPeriodId': json['payPeriodId'] == null ? undefined : json['payPeriodId'],
        'isOverrideAwardRates': json['isOverrideAwardRates'] == null ? undefined : json['isOverrideAwardRates'],
        'customHourlyRate': json['customHourlyRate'] == null ? undefined : json['customHourlyRate'],
        'annualSalaryRate': json['annualSalaryRate'] == null ? undefined : json['annualSalaryRate'],
        'baseHourlyRate': json['baseHourlyRate'] == null ? undefined : json['baseHourlyRate'],
        'saturdayRatePercent': json['saturdayRatePercent'] == null ? undefined : json['saturdayRatePercent'],
        'sundayRatePercent': json['sundayRatePercent'] == null ? undefined : json['sundayRatePercent'],
        'publicHolidayPercent': json['publicHolidayPercent'] == null ? undefined : json['publicHolidayPercent'],
        'otFirst2HoursPercent': json['otFirst2HoursPercent'] == null ? undefined : json['otFirst2HoursPercent'],
        'otAfter2HoursPercent': json['otAfter2HoursPercent'] == null ? undefined : json['otAfter2HoursPercent'],
        'reason': json['reason'] == null ? undefined : json['reason'],
        'oldRate': json['oldRate'] == null ? undefined : json['oldRate'],
        'newRate': json['newRate'] == null ? undefined : json['newRate'],
        'retrospectiveFrom': json['retrospectiveFrom'],
        'retrospectiveTo': json['retrospectiveTo'] == null ? undefined : json['retrospectiveTo'],
        'effectiveFrom': json['effectiveFrom'] == null ? undefined : json['effectiveFrom'],
        'effectiveTo': json['effectiveTo'] == null ? undefined : json['effectiveTo'],
        'totalTimesheets': json['totalTimesheets'] == null ? undefined : json['totalTimesheets'],
        'totalHours': json['totalHours'] == null ? undefined : json['totalHours'],
        'totalAdjustment': json['totalAdjustment'] == null ? undefined : json['totalAdjustment'],
        'positionTemplateId': json['positionTemplateId'] == null ? undefined : json['positionTemplateId'],
        'awardAllowanceIds': json['awardAllowanceIds'] == null ? undefined : json['awardAllowanceIds'],
        'positionTitleId': json['positionTitleId'] == null ? undefined : json['positionTitleId'],
        'fte': json['fte'] == null ? undefined : json['fte'],
        'guaranteedMinHoursPerWeek': json['guaranteedMinHoursPerWeek'] == null ? undefined : json['guaranteedMinHoursPerWeek'],
        'averagingPeriodWeeks': json['averagingPeriodWeeks'] == null ? undefined : json['averagingPeriodWeeks'],
        'averagingCycleStartDate': json['averagingCycleStartDate'] == null ? undefined : json['averagingCycleStartDate'],
        'isShiftWorker': json['isShiftWorker'] == null ? undefined : json['isShiftWorker'],
        'isRotatingShiftWorker': json['isRotatingShiftWorker'] == null ? undefined : json['isRotatingShiftWorker'],
        'rotationPattern': json['rotationPattern'] == null ? undefined : json['rotationPattern'],
        'rotationCycleWeeks': json['rotationCycleWeeks'] == null ? undefined : json['rotationCycleWeeks'],
        'avgNightsPerCycle': json['avgNightsPerCycle'] == null ? undefined : json['avgNightsPerCycle'],
        'annualLeaveWeeks': json['annualLeaveWeeks'] == null ? undefined : json['annualLeaveWeeks'],
        'isRosteredSundays': json['isRosteredSundays'] == null ? undefined : json['isRosteredSundays'],
        'isRosteredPublicHolidays': json['isRosteredPublicHolidays'] == null ? undefined : json['isRosteredPublicHolidays'],
        'superannuationPercent': json['superannuationPercent'] == null ? undefined : json['superannuationPercent'],
        'ordinaryHoursPerWeek': json['ordinaryHoursPerWeek'] == null ? undefined : json['ordinaryHoursPerWeek'],
        'ordinaryHoursPerDay': json['ordinaryHoursPerDay'] == null ? undefined : json['ordinaryHoursPerDay'],
        'rosterCycleWeeks': json['rosterCycleWeeks'] == null ? undefined : json['rosterCycleWeeks'],
        'overtimeAfterDailyHours': json['overtimeAfterDailyHours'] == null ? undefined : json['overtimeAfterDailyHours'],
        'overtimeAfterWeeklyHours': json['overtimeAfterWeeklyHours'] == null ? undefined : json['overtimeAfterWeeklyHours'],
        'eveningLoadingPercent': json['eveningLoadingPercent'] == null ? undefined : json['eveningLoadingPercent'],
        'customizeOrdinaryHours': json['customizeOrdinaryHours'] == null ? undefined : json['customizeOrdinaryHours'],
        'customizeLoadings': json['customizeLoadings'] == null ? undefined : json['customizeLoadings'],
        'rdoApplicable': json['rdoApplicable'] == null ? undefined : json['rdoApplicable'],
        'rdoAnchorDate': json['rdoAnchorDate'] == null ? undefined : json['rdoAnchorDate'],
        'rdoPreferredDay': json['rdoPreferredDay'] == null ? undefined : json['rdoPreferredDay'],
        'rdoCycleWeeks': json['rdoCycleWeeks'] == null ? undefined : json['rdoCycleWeeks'],
        'rdoExtraMinutesPerDay': json['rdoExtraMinutesPerDay'] == null ? undefined : json['rdoExtraMinutesPerDay'],
        'rdoShortfallTreatment': json['rdoShortfallTreatment'] == null ? undefined : json['rdoShortfallTreatment'],
        'adoApplicable': json['adoApplicable'] == null ? undefined : json['adoApplicable'],
        'adoExtraOrdinaryMinutesPerDay': json['adoExtraOrdinaryMinutesPerDay'] == null ? undefined : json['adoExtraOrdinaryMinutesPerDay'],
        'adoHoursPerDayOff': json['adoHoursPerDayOff'] == null ? undefined : json['adoHoursPerDayOff'],
        'adoAutoScheduleDayOff': json['adoAutoScheduleDayOff'] == null ? undefined : json['adoAutoScheduleDayOff'],
        'adoMaxConsecutiveDays': json['adoMaxConsecutiveDays'] == null ? undefined : json['adoMaxConsecutiveDays'],
        'toilApplicable': json['toilApplicable'] == null ? undefined : json['toilApplicable'],
        'toilConversionMethod': json['toilConversionMethod'] == null ? undefined : json['toilConversionMethod'],
        'toilMaxBalanceHours': json['toilMaxBalanceHours'] == null ? undefined : json['toilMaxBalanceHours'],
        'toilExpiryDays': json['toilExpiryDays'] == null ? undefined : json['toilExpiryDays'],
        'toilPreApprovalRequired': json['toilPreApprovalRequired'] == null ? undefined : json['toilPreApprovalRequired'],
    };
}

export function StaffSavePayConditionRequestToJSON(json: any): StaffSavePayConditionRequest {
    return StaffSavePayConditionRequestToJSONTyped(json, false);
}

export function StaffSavePayConditionRequestToJSONTyped(value?: StaffSavePayConditionRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'tblStaffPayConditionId': value['tblStaffPayConditionId'],
        'tblStaffId': value['tblStaffId'],
        'payCycleType': value['payCycleType'],
        'positionId': value['positionId'],
        'payrateType': value['payrateType'],
        'industryAwardId': value['industryAwardId'],
        'classificationId': value['classificationId'],
        'employmentTypeId': value['employmentTypeId'],
        'contractedHours': value['contractedHours'],
        'payPeriodId': value['payPeriodId'],
        'isOverrideAwardRates': value['isOverrideAwardRates'],
        'customHourlyRate': value['customHourlyRate'],
        'annualSalaryRate': value['annualSalaryRate'],
        'baseHourlyRate': value['baseHourlyRate'],
        'saturdayRatePercent': value['saturdayRatePercent'],
        'sundayRatePercent': value['sundayRatePercent'],
        'publicHolidayPercent': value['publicHolidayPercent'],
        'otFirst2HoursPercent': value['otFirst2HoursPercent'],
        'otAfter2HoursPercent': value['otAfter2HoursPercent'],
        'reason': value['reason'],
        'oldRate': value['oldRate'],
        'newRate': value['newRate'],
        'retrospectiveFrom': value['retrospectiveFrom'],
        'retrospectiveTo': value['retrospectiveTo'],
        'effectiveFrom': value['effectiveFrom'],
        'effectiveTo': value['effectiveTo'],
        'totalTimesheets': value['totalTimesheets'],
        'totalHours': value['totalHours'],
        'totalAdjustment': value['totalAdjustment'],
        'positionTemplateId': value['positionTemplateId'],
        'awardAllowanceIds': value['awardAllowanceIds'],
        'positionTitleId': value['positionTitleId'],
        'fte': value['fte'],
        'guaranteedMinHoursPerWeek': value['guaranteedMinHoursPerWeek'],
        'averagingPeriodWeeks': value['averagingPeriodWeeks'],
        'averagingCycleStartDate': value['averagingCycleStartDate'],
        'isShiftWorker': value['isShiftWorker'],
        'isRotatingShiftWorker': value['isRotatingShiftWorker'],
        'rotationPattern': value['rotationPattern'],
        'rotationCycleWeeks': value['rotationCycleWeeks'],
        'avgNightsPerCycle': value['avgNightsPerCycle'],
        'annualLeaveWeeks': value['annualLeaveWeeks'],
        'isRosteredSundays': value['isRosteredSundays'],
        'isRosteredPublicHolidays': value['isRosteredPublicHolidays'],
        'superannuationPercent': value['superannuationPercent'],
        'ordinaryHoursPerWeek': value['ordinaryHoursPerWeek'],
        'ordinaryHoursPerDay': value['ordinaryHoursPerDay'],
        'rosterCycleWeeks': value['rosterCycleWeeks'],
        'overtimeAfterDailyHours': value['overtimeAfterDailyHours'],
        'overtimeAfterWeeklyHours': value['overtimeAfterWeeklyHours'],
        'eveningLoadingPercent': value['eveningLoadingPercent'],
        'customizeOrdinaryHours': value['customizeOrdinaryHours'],
        'customizeLoadings': value['customizeLoadings'],
        'rdoApplicable': value['rdoApplicable'],
        'rdoAnchorDate': value['rdoAnchorDate'],
        'rdoPreferredDay': value['rdoPreferredDay'],
        'rdoCycleWeeks': value['rdoCycleWeeks'],
        'rdoExtraMinutesPerDay': value['rdoExtraMinutesPerDay'],
        'rdoShortfallTreatment': value['rdoShortfallTreatment'],
        'adoApplicable': value['adoApplicable'],
        'adoExtraOrdinaryMinutesPerDay': value['adoExtraOrdinaryMinutesPerDay'],
        'adoHoursPerDayOff': value['adoHoursPerDayOff'],
        'adoAutoScheduleDayOff': value['adoAutoScheduleDayOff'],
        'adoMaxConsecutiveDays': value['adoMaxConsecutiveDays'],
        'toilApplicable': value['toilApplicable'],
        'toilConversionMethod': value['toilConversionMethod'],
        'toilMaxBalanceHours': value['toilMaxBalanceHours'],
        'toilExpiryDays': value['toilExpiryDays'],
        'toilPreApprovalRequired': value['toilPreApprovalRequired'],
    };
}

