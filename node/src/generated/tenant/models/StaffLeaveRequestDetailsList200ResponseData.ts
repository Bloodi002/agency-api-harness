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
import type { StaffFileDto } from './StaffFileDto.js';
import {
    StaffFileDtoFromJSON,
    StaffFileDtoFromJSONTyped,
    StaffFileDtoToJSON,
    StaffFileDtoToJSONTyped,
} from './StaffFileDto.js';
import type { StaffDetails } from './StaffDetails.js';
import {
    StaffDetailsFromJSON,
    StaffDetailsFromJSONTyped,
    StaffDetailsToJSON,
    StaffDetailsToJSONTyped,
} from './StaffDetails.js';
import type { StaffLeaveRequestBreakDown } from './StaffLeaveRequestBreakDown.js';
import {
    StaffLeaveRequestBreakDownFromJSON,
    StaffLeaveRequestBreakDownFromJSONTyped,
    StaffLeaveRequestBreakDownToJSON,
    StaffLeaveRequestBreakDownToJSONTyped,
} from './StaffLeaveRequestBreakDown.js';

/**
 * 
 * @export
 * @interface StaffLeaveRequestDetailsList200ResponseData
 */
export interface StaffLeaveRequestDetailsList200ResponseData {
    /**
     * 
     * @type {string}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    tblLeaveRequestId?: string;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    leaveStartDate?: string;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    leaveEndDate?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    leaveType?: string;
    /**
     * "pending", "approved" or "declined"
     * @type {string}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    leaveStatus?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    leaveReason?: string;
    /**
     * Attachment links as stored, comma-separated; see files
     * @type {string}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    attachments?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    leaveDuration?: string;
    /**
     * Total payable hours
     * @type {number}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    payableHours?: number;
    /**
     * The staff member and their locations
     * @type {StaffDetails}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    staffDetails?: StaffDetails | null;
    /**
     * One row per day of leave
     * @type {Array<StaffLeaveRequestBreakDown>}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    leaveRequestBreakDown?: Array<StaffLeaveRequestBreakDown> | null;
    /**
     * 
     * @type {Date}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    createdDate?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    modifiedBy?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    modifiedDate?: Date | null;
    /**
     * Who last changed the request
     * @type {string}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    modifiedUser?: string | null;
    /**
     * 
     * @type {Array<StaffFileDto>}
     * @memberof StaffLeaveRequestDetailsList200ResponseData
     */
    files?: Array<StaffFileDto> | null;
}

/**
 * Check if a given object implements the StaffLeaveRequestDetailsList200ResponseData interface.
 */
export function instanceOfStaffLeaveRequestDetailsList200ResponseData(value: object): value is StaffLeaveRequestDetailsList200ResponseData {
    return true;
}

export function StaffLeaveRequestDetailsList200ResponseDataFromJSON(json: any): StaffLeaveRequestDetailsList200ResponseData {
    return StaffLeaveRequestDetailsList200ResponseDataFromJSONTyped(json, false);
}

export function StaffLeaveRequestDetailsList200ResponseDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): StaffLeaveRequestDetailsList200ResponseData {
    if (json == null) {
        return json;
    }
    return {
        
        'tblLeaveRequestId': json['tblLeaveRequestId'] == null ? undefined : json['tblLeaveRequestId'],
        'leaveStartDate': json['leaveStartDate'] == null ? undefined : json['leaveStartDate'],
        'leaveEndDate': json['leaveEndDate'] == null ? undefined : json['leaveEndDate'],
        'leaveType': json['leaveType'] == null ? undefined : json['leaveType'],
        'leaveStatus': json['leaveStatus'] == null ? undefined : json['leaveStatus'],
        'leaveReason': json['leaveReason'] == null ? undefined : json['leaveReason'],
        'attachments': json['attachments'] == null ? undefined : json['attachments'],
        'leaveDuration': json['leaveDuration'] == null ? undefined : json['leaveDuration'],
        'payableHours': json['payableHours'] == null ? undefined : json['payableHours'],
        'staffDetails': json['staffDetails'] == null ? undefined : StaffDetailsFromJSON(json['staffDetails']),
        'leaveRequestBreakDown': json['leaveRequestBreakDown'] == null ? undefined : ((json['leaveRequestBreakDown'] as Array<any>).map(StaffLeaveRequestBreakDownFromJSON)),
        'createdDate': json['createdDate'] == null ? undefined : (parseApiDate(json['createdDate'])),
        'modifiedBy': json['modifiedBy'] == null ? undefined : json['modifiedBy'],
        'modifiedDate': json['modifiedDate'] == null ? undefined : (parseApiDate(json['modifiedDate'])),
        'modifiedUser': json['modifiedUser'] == null ? undefined : json['modifiedUser'],
        'files': json['files'] == null ? undefined : ((json['files'] as Array<any>).map(StaffFileDtoFromJSON)),
    };
}

export function StaffLeaveRequestDetailsList200ResponseDataToJSON(json: any): StaffLeaveRequestDetailsList200ResponseData {
    return StaffLeaveRequestDetailsList200ResponseDataToJSONTyped(json, false);
}

export function StaffLeaveRequestDetailsList200ResponseDataToJSONTyped(value?: StaffLeaveRequestDetailsList200ResponseData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'tblLeaveRequestId': value['tblLeaveRequestId'],
        'leaveStartDate': value['leaveStartDate'],
        'leaveEndDate': value['leaveEndDate'],
        'leaveType': value['leaveType'],
        'leaveStatus': value['leaveStatus'],
        'leaveReason': value['leaveReason'],
        'attachments': value['attachments'],
        'leaveDuration': value['leaveDuration'],
        'payableHours': value['payableHours'],
        'staffDetails': StaffDetailsToJSON(value['staffDetails']),
        'leaveRequestBreakDown': value['leaveRequestBreakDown'] == null ? undefined : ((value['leaveRequestBreakDown'] as Array<any>).map(StaffLeaveRequestBreakDownToJSON)),
        'createdDate': value['createdDate'] === null ? null : ((value['createdDate'] as any)?.toISOString()),
        'modifiedBy': value['modifiedBy'],
        'modifiedDate': value['modifiedDate'] === null ? null : ((value['modifiedDate'] as any)?.toISOString()),
        'modifiedUser': value['modifiedUser'],
        'files': value['files'] == null ? undefined : ((value['files'] as Array<any>).map(StaffFileDtoToJSON)),
    };
}

