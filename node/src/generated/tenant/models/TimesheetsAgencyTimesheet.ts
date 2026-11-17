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
/**
 * One shift an agency-supplied worker was booked for at your organisation: what was rostered, what was clocked, and what it comes to. Every rate and amount is in AUD, GST inclusive.
 * @export
 * @interface TimesheetsAgencyTimesheet
 */
export interface TimesheetsAgencyTimesheet {
    /**
     * Identifies the agency timesheet: the booking id, or the attendance session id for an unscheduled punch. Send it to the detail and approval calls.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    tblAgencyPlacementId?: string;
    /**
     * The agency that supplied the worker.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    tblAgencyId?: string;
    /**
     * Agency name.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    agencyName?: string | null;
    /**
     * Your organisation id.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    tblTenantId?: string;
    /**
     * Your organisation name.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    clientName?: string | null;
    /**
     * The agency worker. Not one of your staff ids.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    tblAgencyStaffId?: string;
    /**
     * The worker's name.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    candidateName?: string | null;
    /**
     * The worker's primary role; null when none is recorded.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    roleName?: string | null;
    /**
     * Your rostered shift; null for an unscheduled punch.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    tblShiftId?: string | null;
    /**
     * The location of the shift.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    tblTenantLocationId?: string | null;
    /**
     * Location name.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    locationName?: string | null;
    /**
     * Rostered start; null for an unscheduled punch. Local wall-clock time at the location, with no time zone.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    scheduledStart?: string | null;
    /**
     * Rostered end; null for an unscheduled punch. Local wall-clock time at the location, with no time zone.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    scheduledEnd?: string | null;
    /**
     * Rostered hours, less the rostered break.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    scheduledHours?: number;
    /**
     * What the rostered hours come to. Needs `pay_conditions.read`; null without it.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    scheduledAmount?: number | null;
    /**
     * Clock-in; null when nothing was clocked. Local wall-clock time at the location, with no time zone.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    actualStart?: string | null;
    /**
     * Clock-out; null while the worker is still clocked in or never clocked out. Local wall-clock time at the location, with no time zone.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    actualEnd?: string | null;
    /**
     * Clocked hours less breaks; 0 while a clock-out is missing.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    actualHours?: number;
    /**
     * What the clocked hours come to. Needs `pay_conditions.read`; null without it.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    actualAmount?: number | null;
    /**
     * Which hours you agreed to pay this agency on: 0 ActualHours (clocked, the default) · 1 ScheduledHours (rostered). Both are always shown.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    payBasis?: number;
    /**
     * The break the roster allows for.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    scheduledBreakMinutes?: number;
    /**
     * The break deducted from the hours charged: what was punched, or the rostered break when nothing was.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    breakMinutes?: number;
    /**
     * The hours charged for.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    payableHours?: number;
    /**
     * Lowest hourly rate applied across the shift; null when the shift cannot be priced. Needs `pay_conditions.read`; null without it.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    rateFrom?: number | null;
    /**
     * Highest hourly rate applied; equal to rateFrom unless the shift crosses a rate change. Needs `pay_conditions.read`; null without it.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    rateTo?: number | null;
    /**
     * What the shift is charged at. Needs `pay_conditions.read`; null without it.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    amount?: number | null;
    /**
     * The GST already inside amount. Needs `pay_conditions.read`; null without it.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    gstAmount?: number | null;
    /**
     * 1 AwaitingAttendance (booked, nothing clocked yet) · 2 InProgress (clocked in, not out) · 3 Completed (clocked out) · 4 NoShow (you recorded a no-show; nothing is payable) · 5 Cancelled (cancelled after the worker started; the hours worked still count).
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    status?: number;
    /**
     * Where the rate came from: 0 None (cannot be priced) · 1 AgreedOnTheShift · 2 RateCard · 3 ClientDefault.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    rateSource?: number;
    /**
     * What is worth your attention, as the sum of: 1 NoAttendance · 2 MissingClockOut · 4 LateArrival · 8 EarlyDeparture · 16 Overtime · 32 BreakExceeded · 64 NoBreakRecorded (the rostered break was deducted) · 128 MultipleSessions (the earliest was used) · 256 Unpriced (no rate resolves) · 512 LocationTimeZoneMissing · 1024 Unscheduled (clocked in with nothing rostered). Shown only; never changes the amount.
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    flags?: number;
    /**
     * Your decision: 0 Pending (no decision yet; still counted in the totals) · 1 Approved · 2 Declined (listed, but left out of every total).
     * @type {number}
     * @memberof TimesheetsAgencyTimesheet
     */
    approvalStatus?: number;
    /**
     * Why you declined it; null otherwise.
     * @type {string}
     * @memberof TimesheetsAgencyTimesheet
     */
    approvalNote?: string | null;
    /**
     * When the decision was last recorded (UTC; may come without a trailing Z); null when there is none.
     * @type {Date}
     * @memberof TimesheetsAgencyTimesheet
     */
    approvalDecidedAt?: Date | null;
}

/**
 * Check if a given object implements the TimesheetsAgencyTimesheet interface.
 */
export function instanceOfTimesheetsAgencyTimesheet(value: object): value is TimesheetsAgencyTimesheet {
    return true;
}

export function TimesheetsAgencyTimesheetFromJSON(json: any): TimesheetsAgencyTimesheet {
    return TimesheetsAgencyTimesheetFromJSONTyped(json, false);
}

export function TimesheetsAgencyTimesheetFromJSONTyped(json: any, ignoreDiscriminator: boolean): TimesheetsAgencyTimesheet {
    if (json == null) {
        return json;
    }
    return {
        
        'tblAgencyPlacementId': json['tblAgencyPlacementId'] == null ? undefined : json['tblAgencyPlacementId'],
        'tblAgencyId': json['tblAgencyId'] == null ? undefined : json['tblAgencyId'],
        'agencyName': json['agencyName'] == null ? undefined : json['agencyName'],
        'tblTenantId': json['tblTenantId'] == null ? undefined : json['tblTenantId'],
        'clientName': json['clientName'] == null ? undefined : json['clientName'],
        'tblAgencyStaffId': json['tblAgencyStaffId'] == null ? undefined : json['tblAgencyStaffId'],
        'candidateName': json['candidateName'] == null ? undefined : json['candidateName'],
        'roleName': json['roleName'] == null ? undefined : json['roleName'],
        'tblShiftId': json['tblShiftId'] == null ? undefined : json['tblShiftId'],
        'tblTenantLocationId': json['tblTenantLocationId'] == null ? undefined : json['tblTenantLocationId'],
        'locationName': json['locationName'] == null ? undefined : json['locationName'],
        'scheduledStart': json['scheduledStart'] == null ? undefined : json['scheduledStart'],
        'scheduledEnd': json['scheduledEnd'] == null ? undefined : json['scheduledEnd'],
        'scheduledHours': json['scheduledHours'] == null ? undefined : json['scheduledHours'],
        'scheduledAmount': json['scheduledAmount'] == null ? undefined : json['scheduledAmount'],
        'actualStart': json['actualStart'] == null ? undefined : json['actualStart'],
        'actualEnd': json['actualEnd'] == null ? undefined : json['actualEnd'],
        'actualHours': json['actualHours'] == null ? undefined : json['actualHours'],
        'actualAmount': json['actualAmount'] == null ? undefined : json['actualAmount'],
        'payBasis': json['payBasis'] == null ? undefined : json['payBasis'],
        'scheduledBreakMinutes': json['scheduledBreakMinutes'] == null ? undefined : json['scheduledBreakMinutes'],
        'breakMinutes': json['breakMinutes'] == null ? undefined : json['breakMinutes'],
        'payableHours': json['payableHours'] == null ? undefined : json['payableHours'],
        'rateFrom': json['rateFrom'] == null ? undefined : json['rateFrom'],
        'rateTo': json['rateTo'] == null ? undefined : json['rateTo'],
        'amount': json['amount'] == null ? undefined : json['amount'],
        'gstAmount': json['gstAmount'] == null ? undefined : json['gstAmount'],
        'status': json['status'] == null ? undefined : json['status'],
        'rateSource': json['rateSource'] == null ? undefined : json['rateSource'],
        'flags': json['flags'] == null ? undefined : json['flags'],
        'approvalStatus': json['approvalStatus'] == null ? undefined : json['approvalStatus'],
        'approvalNote': json['approvalNote'] == null ? undefined : json['approvalNote'],
        'approvalDecidedAt': json['approvalDecidedAt'] == null ? undefined : (parseApiDate(json['approvalDecidedAt'])),
    };
}

export function TimesheetsAgencyTimesheetToJSON(json: any): TimesheetsAgencyTimesheet {
    return TimesheetsAgencyTimesheetToJSONTyped(json, false);
}

export function TimesheetsAgencyTimesheetToJSONTyped(value?: TimesheetsAgencyTimesheet | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'tblAgencyPlacementId': value['tblAgencyPlacementId'],
        'tblAgencyId': value['tblAgencyId'],
        'agencyName': value['agencyName'],
        'tblTenantId': value['tblTenantId'],
        'clientName': value['clientName'],
        'tblAgencyStaffId': value['tblAgencyStaffId'],
        'candidateName': value['candidateName'],
        'roleName': value['roleName'],
        'tblShiftId': value['tblShiftId'],
        'tblTenantLocationId': value['tblTenantLocationId'],
        'locationName': value['locationName'],
        'scheduledStart': value['scheduledStart'],
        'scheduledEnd': value['scheduledEnd'],
        'scheduledHours': value['scheduledHours'],
        'scheduledAmount': value['scheduledAmount'],
        'actualStart': value['actualStart'],
        'actualEnd': value['actualEnd'],
        'actualHours': value['actualHours'],
        'actualAmount': value['actualAmount'],
        'payBasis': value['payBasis'],
        'scheduledBreakMinutes': value['scheduledBreakMinutes'],
        'breakMinutes': value['breakMinutes'],
        'payableHours': value['payableHours'],
        'rateFrom': value['rateFrom'],
        'rateTo': value['rateTo'],
        'amount': value['amount'],
        'gstAmount': value['gstAmount'],
        'status': value['status'],
        'rateSource': value['rateSource'],
        'flags': value['flags'],
        'approvalStatus': value['approvalStatus'],
        'approvalNote': value['approvalNote'],
        'approvalDecidedAt': value['approvalDecidedAt'] === null ? null : ((value['approvalDecidedAt'] as any)?.toISOString()),
    };
}

