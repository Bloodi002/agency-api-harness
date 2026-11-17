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
import type { SchedulingRegularShiftDetailDataAttendance } from './SchedulingRegularShiftDetailDataAttendance.js';
import {
    SchedulingRegularShiftDetailDataAttendanceFromJSON,
    SchedulingRegularShiftDetailDataAttendanceFromJSONTyped,
    SchedulingRegularShiftDetailDataAttendanceToJSON,
    SchedulingRegularShiftDetailDataAttendanceToJSONTyped,
} from './SchedulingRegularShiftDetailDataAttendance.js';
import type { SchedulingStaffRole } from './SchedulingStaffRole.js';
import {
    SchedulingStaffRoleFromJSON,
    SchedulingStaffRoleFromJSONTyped,
    SchedulingStaffRoleToJSON,
    SchedulingStaffRoleToJSONTyped,
} from './SchedulingStaffRole.js';
import type { SchedulingGetGeneratedShiftDetailById200ResponseDataDataAllOfBreaksInner } from './SchedulingGetGeneratedShiftDetailById200ResponseDataDataAllOfBreaksInner.js';
import {
    SchedulingGetGeneratedShiftDetailById200ResponseDataDataAllOfBreaksInnerFromJSON,
    SchedulingGetGeneratedShiftDetailById200ResponseDataDataAllOfBreaksInnerFromJSONTyped,
    SchedulingGetGeneratedShiftDetailById200ResponseDataDataAllOfBreaksInnerToJSON,
    SchedulingGetGeneratedShiftDetailById200ResponseDataDataAllOfBreaksInnerToJSONTyped,
} from './SchedulingGetGeneratedShiftDetailById200ResponseDataDataAllOfBreaksInner.js';

/**
 * The shift.
 * @export
 * @interface SchedulingRegularShiftDetailData
 */
export interface SchedulingRegularShiftDetailData {
    /**
     * The staff shift id.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    rosterShiftId?: string;
    /**
     * Your organisation's id.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    tblTenantId?: string;
    /**
     * Area id.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    areaId?: string;
    /**
     * Area name.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    areaName?: string | null;
    /**
     * The area's location.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    locationId?: string | null;
    /**
     * Location name.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    locationName?: string | null;
    /**
     * The shift's date. The location's wall clock, sent with no offset; not UTC.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    shiftDate?: string;
    /**
     * Start time. Time of day as hh:mm:ss.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    startTime?: string;
    /**
     * End time. Time of day as hh:mm:ss.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    endTime?: string;
    /**
     * Break in minutes.
     * @type {number}
     * @memberof SchedulingRegularShiftDetailData
     */
    breakMins?: number;
    /**
     * People the shift was created for: from the open or empty shift it was filled from, or 1 when created directly for this person.
     * @type {number}
     * @memberof SchedulingRegularShiftDetailData
     */
    requiredEmployeeCount?: number;
    /**
     * The person working the shift: your staff member, or the agency worker when companyType is 2.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    assignedStaffId?: string;
    /**
     * Their name.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    assignedStaffName?: string | null;
    /**
     * 1 your own staff · 2 an agency worker.
     * @type {number}
     * @memberof SchedulingRegularShiftDetailData
     */
    companyType?: number;
    /**
     * Your organisation's id for your own staff; the agency's id for an agency worker.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    companyId?: string;
    /**
     * The agency's name; only for an agency worker.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    agencyName?: string | null;
    /**
     * Roles the person holds.
     * @type {Array<SchedulingStaffRole>}
     * @memberof SchedulingRegularShiftDetailData
     */
    roles?: Array<SchedulingStaffRole>;
    /**
     * Shift type id.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    shiftTypeId?: string | null;
    /**
     * Shift type name.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    shiftTypeName?: string | null;
    /**
     * Higher duties classification from the shift template; null when the shift was not made from a template.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    higherDutiesClassification?: string | null;
    /**
     * The shift template it was made from.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    shiftTemplateId?: string | null;
    /**
     * Unpublished, Published, Confirmed or Completed. A shift whose end time has passed reads Completed.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    shiftStatus?: string;
    /**
     * Whether the person has acknowledged the shift.
     * @type {boolean}
     * @memberof SchedulingRegularShiftDetailData
     */
    isConfirmed?: boolean;
    /**
     * Whether the shift was explicitly marked complete.
     * @type {boolean}
     * @memberof SchedulingRegularShiftDetailData
     */
    isCompleted?: boolean;
    /**
     * Hourly rate (AUD). Needs `pay_conditions.read`; null without it.
     * @type {number}
     * @memberof SchedulingRegularShiftDetailData
     */
    hourlyRate?: number | null;
    /**
     * Total cost of the shift (AUD). Needs `pay_conditions.read`; null without it.
     * @type {number}
     * @memberof SchedulingRegularShiftDetailData
     */
    totalCost?: number | null;
    /**
     * Notes.
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    notes?: string | null;
    /**
     * Whether the shift is active.
     * @type {boolean}
     * @memberof SchedulingRegularShiftDetailData
     */
    isActive?: boolean;
    /**
     * IANA name of the location's time zone, for example `Australia/Sydney`: the zone this record's times are the wall clock of. Null when the location has no zone set; set one with "Set a location's opening hours and time zone".
     * @type {string}
     * @memberof SchedulingRegularShiftDetailData
     */
    timeZone?: string | null;
    /**
     * 
     * @type {Array<SchedulingGetGeneratedShiftDetailById200ResponseDataDataAllOfBreaksInner>}
     * @memberof SchedulingRegularShiftDetailData
     */
    breaks?: Array<SchedulingGetGeneratedShiftDetailById200ResponseDataDataAllOfBreaksInner> | null;
    /**
     * 
     * @type {SchedulingRegularShiftDetailDataAttendance}
     * @memberof SchedulingRegularShiftDetailData
     */
    attendance?: SchedulingRegularShiftDetailDataAttendance | null;
}

/**
 * Check if a given object implements the SchedulingRegularShiftDetailData interface.
 */
export function instanceOfSchedulingRegularShiftDetailData(value: object): value is SchedulingRegularShiftDetailData {
    return true;
}

export function SchedulingRegularShiftDetailDataFromJSON(json: any): SchedulingRegularShiftDetailData {
    return SchedulingRegularShiftDetailDataFromJSONTyped(json, false);
}

export function SchedulingRegularShiftDetailDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): SchedulingRegularShiftDetailData {
    if (json == null) {
        return json;
    }
    return {
        
        'rosterShiftId': json['rosterShiftId'] == null ? undefined : json['rosterShiftId'],
        'tblTenantId': json['tblTenantId'] == null ? undefined : json['tblTenantId'],
        'areaId': json['areaId'] == null ? undefined : json['areaId'],
        'areaName': json['areaName'] == null ? undefined : json['areaName'],
        'locationId': json['locationId'] == null ? undefined : json['locationId'],
        'locationName': json['locationName'] == null ? undefined : json['locationName'],
        'shiftDate': json['shiftDate'] == null ? undefined : json['shiftDate'],
        'startTime': json['startTime'] == null ? undefined : json['startTime'],
        'endTime': json['endTime'] == null ? undefined : json['endTime'],
        'breakMins': json['breakMins'] == null ? undefined : json['breakMins'],
        'requiredEmployeeCount': json['requiredEmployeeCount'] == null ? undefined : json['requiredEmployeeCount'],
        'assignedStaffId': json['assignedStaffId'] == null ? undefined : json['assignedStaffId'],
        'assignedStaffName': json['assignedStaffName'] == null ? undefined : json['assignedStaffName'],
        'companyType': json['companyType'] == null ? undefined : json['companyType'],
        'companyId': json['companyId'] == null ? undefined : json['companyId'],
        'agencyName': json['agencyName'] == null ? undefined : json['agencyName'],
        'roles': json['roles'] == null ? undefined : ((json['roles'] as Array<any>).map(SchedulingStaffRoleFromJSON)),
        'shiftTypeId': json['shiftTypeId'] == null ? undefined : json['shiftTypeId'],
        'shiftTypeName': json['shiftTypeName'] == null ? undefined : json['shiftTypeName'],
        'higherDutiesClassification': json['higherDutiesClassification'] == null ? undefined : json['higherDutiesClassification'],
        'shiftTemplateId': json['shiftTemplateId'] == null ? undefined : json['shiftTemplateId'],
        'shiftStatus': json['shiftStatus'] == null ? undefined : json['shiftStatus'],
        'isConfirmed': json['isConfirmed'] == null ? undefined : json['isConfirmed'],
        'isCompleted': json['isCompleted'] == null ? undefined : json['isCompleted'],
        'hourlyRate': json['hourlyRate'] == null ? undefined : json['hourlyRate'],
        'totalCost': json['totalCost'] == null ? undefined : json['totalCost'],
        'notes': json['notes'] == null ? undefined : json['notes'],
        'isActive': json['isActive'] == null ? undefined : json['isActive'],
        'timeZone': json['timeZone'] == null ? undefined : json['timeZone'],
        'breaks': json['breaks'] == null ? undefined : ((json['breaks'] as Array<any>).map(SchedulingGetGeneratedShiftDetailById200ResponseDataDataAllOfBreaksInnerFromJSON)),
        'attendance': json['attendance'] == null ? undefined : SchedulingRegularShiftDetailDataAttendanceFromJSON(json['attendance']),
    };
}

export function SchedulingRegularShiftDetailDataToJSON(json: any): SchedulingRegularShiftDetailData {
    return SchedulingRegularShiftDetailDataToJSONTyped(json, false);
}

export function SchedulingRegularShiftDetailDataToJSONTyped(value?: SchedulingRegularShiftDetailData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'rosterShiftId': value['rosterShiftId'],
        'tblTenantId': value['tblTenantId'],
        'areaId': value['areaId'],
        'areaName': value['areaName'],
        'locationId': value['locationId'],
        'locationName': value['locationName'],
        'shiftDate': value['shiftDate'],
        'startTime': value['startTime'],
        'endTime': value['endTime'],
        'breakMins': value['breakMins'],
        'requiredEmployeeCount': value['requiredEmployeeCount'],
        'assignedStaffId': value['assignedStaffId'],
        'assignedStaffName': value['assignedStaffName'],
        'companyType': value['companyType'],
        'companyId': value['companyId'],
        'agencyName': value['agencyName'],
        'roles': value['roles'] == null ? undefined : ((value['roles'] as Array<any>).map(SchedulingStaffRoleToJSON)),
        'shiftTypeId': value['shiftTypeId'],
        'shiftTypeName': value['shiftTypeName'],
        'higherDutiesClassification': value['higherDutiesClassification'],
        'shiftTemplateId': value['shiftTemplateId'],
        'shiftStatus': value['shiftStatus'],
        'isConfirmed': value['isConfirmed'],
        'isCompleted': value['isCompleted'],
        'hourlyRate': value['hourlyRate'],
        'totalCost': value['totalCost'],
        'notes': value['notes'],
        'isActive': value['isActive'],
        'timeZone': value['timeZone'],
        'breaks': value['breaks'] == null ? undefined : ((value['breaks'] as Array<any>).map(SchedulingGetGeneratedShiftDetailById200ResponseDataDataAllOfBreaksInnerToJSON)),
        'attendance': SchedulingRegularShiftDetailDataAttendanceToJSON(value['attendance']),
    };
}

