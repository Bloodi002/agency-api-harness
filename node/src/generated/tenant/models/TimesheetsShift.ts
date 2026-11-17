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
import type { TimesheetsShiftAllowance } from './TimesheetsShiftAllowance.js';
import {
    TimesheetsShiftAllowanceFromJSON,
    TimesheetsShiftAllowanceFromJSONTyped,
    TimesheetsShiftAllowanceToJSON,
    TimesheetsShiftAllowanceToJSONTyped,
} from './TimesheetsShiftAllowance.js';
import type { TimesheetsShiftBreak } from './TimesheetsShiftBreak.js';
import {
    TimesheetsShiftBreakFromJSON,
    TimesheetsShiftBreakFromJSONTyped,
    TimesheetsShiftBreakToJSON,
    TimesheetsShiftBreakToJSONTyped,
} from './TimesheetsShiftBreak.js';

/**
 * One shift (day line) on a timesheet.
 * @export
 * @interface TimesheetsShift
 */
export interface TimesheetsShift {
    /**
     * The shift id.
     * @type {string}
     * @memberof TimesheetsShift
     */
    tblTimesheetDailyDetailId?: string;
    /**
     * The day the shift was worked. The location's wall clock, sent with no offset; not UTC.
     * @type {string}
     * @memberof TimesheetsShift
     */
    day?: string | null;
    /**
     * Clock-in time. The location's wall clock, sent with no offset; not UTC.
     * @type {string}
     * @memberof TimesheetsShift
     */
    clockIn?: string | null;
    /**
     * Clock-out time. The location's wall clock, sent with no offset; not UTC.
     * @type {string}
     * @memberof TimesheetsShift
     */
    clockOut?: string | null;
    /**
     * Hours between clock-in and clock-out.
     * @type {number}
     * @memberof TimesheetsShift
     */
    grossHours?: number | null;
    /**
     * Total break minutes.
     * @type {number}
     * @memberof TimesheetsShift
     */
    totalBreakInMin?: number | null;
    /**
     * Hours worked after breaks.
     * @type {number}
     * @memberof TimesheetsShift
     */
    netHours?: number | null;
    /**
     * Overtime hours.
     * @type {number}
     * @memberof TimesheetsShift
     */
    overtime?: number | null;
    /**
     * Amount for the shift, in AUD. Needs `pay_conditions.read`; null without it.
     * @type {number}
     * @memberof TimesheetsShift
     */
    dailyAmount?: number | null;
    /**
     * Where the shift was worked, if recorded.
     * @type {string}
     * @memberof TimesheetsShift
     */
    tblTenantLocationId?: string | null;
    /**
     * A note about this shift for the approver.
     * @type {string}
     * @memberof TimesheetsShift
     */
    note?: string | null;
    /**
     * The leave request this shift is linked to, if any.
     * @type {string}
     * @memberof TimesheetsShift
     */
    tblLeaveRequestId?: string | null;
    /**
     * Leave type of the linked request.
     * @type {string}
     * @memberof TimesheetsShift
     */
    leaveType?: string | null;
    /**
     * Status of the linked leave request.
     * @type {string}
     * @memberof TimesheetsShift
     */
    leaveStatus?: string | null;
    /**
     * True when the linked leave request was declined or does not cover this day.
     * @type {boolean}
     * @memberof TimesheetsShift
     */
    leaveLinkMismatch?: boolean;
    /**
     * Duration of the linked leave request.
     * @type {string}
     * @memberof TimesheetsShift
     */
    leaveDuration?: string | null;
    /**
     * Start time of partial-day leave (HH:mm:ss).
     * @type {string}
     * @memberof TimesheetsShift
     */
    leaveHoursFrom?: string | null;
    /**
     * End time of partial-day leave (HH:mm:ss).
     * @type {string}
     * @memberof TimesheetsShift
     */
    leaveHoursTo?: string | null;
    /**
     * Rostered start, copied from the linked roster shift. The location's wall clock, sent with no offset; not UTC.
     * @type {string}
     * @memberof TimesheetsShift
     */
    rosteredStart?: string | null;
    /**
     * Rostered end, copied from the linked roster shift. The location's wall clock, sent with no offset; not UTC.
     * @type {string}
     * @memberof TimesheetsShift
     */
    rosteredEnd?: string | null;
    /**
     * Rostered break minutes.
     * @type {number}
     * @memberof TimesheetsShift
     */
    rosteredBreakMins?: number | null;
    /**
     * True when the day is a rostered day off.
     * @type {boolean}
     * @memberof TimesheetsShift
     */
    isRosteredDayOff?: boolean;
    /**
     * The roster shift this shift is linked to, if any.
     * @type {string}
     * @memberof TimesheetsShift
     */
    rosterShiftId?: string | null;
    /**
     * The attendance session this shift is linked to, if any.
     * @type {string}
     * @memberof TimesheetsShift
     */
    attendanceSessionId?: string | null;
    /**
     * Breaks taken in the shift.
     * @type {Array<TimesheetsShiftBreak>}
     * @memberof TimesheetsShift
     */
    breaks?: Array<TimesheetsShiftBreak> | null;
    /**
     * Allowances claimed on the shift.
     * @type {Array<TimesheetsShiftAllowance>}
     * @memberof TimesheetsShift
     */
    allowances?: Array<TimesheetsShiftAllowance> | null;
}

/**
 * Check if a given object implements the TimesheetsShift interface.
 */
export function instanceOfTimesheetsShift(value: object): value is TimesheetsShift {
    return true;
}

export function TimesheetsShiftFromJSON(json: any): TimesheetsShift {
    return TimesheetsShiftFromJSONTyped(json, false);
}

export function TimesheetsShiftFromJSONTyped(json: any, ignoreDiscriminator: boolean): TimesheetsShift {
    if (json == null) {
        return json;
    }
    return {
        
        'tblTimesheetDailyDetailId': json['tblTimesheetDailyDetailId'] == null ? undefined : json['tblTimesheetDailyDetailId'],
        'day': json['day'] == null ? undefined : json['day'],
        'clockIn': json['clockIn'] == null ? undefined : json['clockIn'],
        'clockOut': json['clockOut'] == null ? undefined : json['clockOut'],
        'grossHours': json['grossHours'] == null ? undefined : json['grossHours'],
        'totalBreakInMin': json['totalBreakInMin'] == null ? undefined : json['totalBreakInMin'],
        'netHours': json['netHours'] == null ? undefined : json['netHours'],
        'overtime': json['overtime'] == null ? undefined : json['overtime'],
        'dailyAmount': json['dailyAmount'] == null ? undefined : json['dailyAmount'],
        'tblTenantLocationId': json['tblTenantLocationId'] == null ? undefined : json['tblTenantLocationId'],
        'note': json['note'] == null ? undefined : json['note'],
        'tblLeaveRequestId': json['tblLeaveRequestId'] == null ? undefined : json['tblLeaveRequestId'],
        'leaveType': json['leaveType'] == null ? undefined : json['leaveType'],
        'leaveStatus': json['leaveStatus'] == null ? undefined : json['leaveStatus'],
        'leaveLinkMismatch': json['leaveLinkMismatch'] == null ? undefined : json['leaveLinkMismatch'],
        'leaveDuration': json['leaveDuration'] == null ? undefined : json['leaveDuration'],
        'leaveHoursFrom': json['leaveHoursFrom'] == null ? undefined : json['leaveHoursFrom'],
        'leaveHoursTo': json['leaveHoursTo'] == null ? undefined : json['leaveHoursTo'],
        'rosteredStart': json['rosteredStart'] == null ? undefined : json['rosteredStart'],
        'rosteredEnd': json['rosteredEnd'] == null ? undefined : json['rosteredEnd'],
        'rosteredBreakMins': json['rosteredBreakMins'] == null ? undefined : json['rosteredBreakMins'],
        'isRosteredDayOff': json['isRosteredDayOff'] == null ? undefined : json['isRosteredDayOff'],
        'rosterShiftId': json['rosterShiftId'] == null ? undefined : json['rosterShiftId'],
        'attendanceSessionId': json['attendanceSessionId'] == null ? undefined : json['attendanceSessionId'],
        'breaks': json['breaks'] == null ? undefined : ((json['breaks'] as Array<any>).map(TimesheetsShiftBreakFromJSON)),
        'allowances': json['allowances'] == null ? undefined : ((json['allowances'] as Array<any>).map(TimesheetsShiftAllowanceFromJSON)),
    };
}

export function TimesheetsShiftToJSON(json: any): TimesheetsShift {
    return TimesheetsShiftToJSONTyped(json, false);
}

export function TimesheetsShiftToJSONTyped(value?: TimesheetsShift | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'tblTimesheetDailyDetailId': value['tblTimesheetDailyDetailId'],
        'day': value['day'],
        'clockIn': value['clockIn'],
        'clockOut': value['clockOut'],
        'grossHours': value['grossHours'],
        'totalBreakInMin': value['totalBreakInMin'],
        'netHours': value['netHours'],
        'overtime': value['overtime'],
        'dailyAmount': value['dailyAmount'],
        'tblTenantLocationId': value['tblTenantLocationId'],
        'note': value['note'],
        'tblLeaveRequestId': value['tblLeaveRequestId'],
        'leaveType': value['leaveType'],
        'leaveStatus': value['leaveStatus'],
        'leaveLinkMismatch': value['leaveLinkMismatch'],
        'leaveDuration': value['leaveDuration'],
        'leaveHoursFrom': value['leaveHoursFrom'],
        'leaveHoursTo': value['leaveHoursTo'],
        'rosteredStart': value['rosteredStart'],
        'rosteredEnd': value['rosteredEnd'],
        'rosteredBreakMins': value['rosteredBreakMins'],
        'isRosteredDayOff': value['isRosteredDayOff'],
        'rosterShiftId': value['rosterShiftId'],
        'attendanceSessionId': value['attendanceSessionId'],
        'breaks': value['breaks'] == null ? undefined : ((value['breaks'] as Array<any>).map(TimesheetsShiftBreakToJSON)),
        'allowances': value['allowances'] == null ? undefined : ((value['allowances'] as Array<any>).map(TimesheetsShiftAllowanceToJSON)),
    };
}

