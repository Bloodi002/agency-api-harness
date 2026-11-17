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
import type { StaffQualificationAdditionalDetails } from './StaffQualificationAdditionalDetails.js';
import {
    StaffQualificationAdditionalDetailsFromJSON,
    StaffQualificationAdditionalDetailsFromJSONTyped,
    StaffQualificationAdditionalDetailsToJSON,
    StaffQualificationAdditionalDetailsToJSONTyped,
} from './StaffQualificationAdditionalDetails.js';
import type { StaffFileAttachmentResponse } from './StaffFileAttachmentResponse.js';
import {
    StaffFileAttachmentResponseFromJSON,
    StaffFileAttachmentResponseFromJSONTyped,
    StaffFileAttachmentResponseToJSON,
    StaffFileAttachmentResponseToJSONTyped,
} from './StaffFileAttachmentResponse.js';

/**
 * 
 * @export
 * @interface StaffGetStaffQualificationDetails200ResponseData
 */
export interface StaffGetStaffQualificationDetails200ResponseData {
    /**
     * The staff qualification id
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    tblStaffQualificationDetailsId?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    tblQualificationId?: string;
    /**
     * The tenant staff member's id; null for an agency candidate
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    tblStaffId?: string | null;
    /**
     * 1 tenant or 2 agency: who owns the record
     * @type {number}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    companyType?: number;
    /**
     * The owning tenant or agency
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    companyId?: string;
    /**
     * The person: a tenant staff id or an agency candidate id
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    companyStaffId?: string;
    /**
     * Who requested the qualification
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    requestedByUserId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    requesterName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    registrationNumber?: string | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    issueDate?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    note?: string | null;
    /**
     * A note from the person who requested it, or the reason for rejection
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    requesterNote?: string | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    expiryDate?: string | null;
    /**
     * Status name: "Needs Approval", "Approved", "Pending Verification", "Expiring Soon", "Rejected" or "Requested"
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    status?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    comment?: string | null;
    /**
     * When the qualification is due A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    dueDate?: string | null;
    /**
     * How many months it stays valid
     * @type {number}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    qualificationValidity?: number | null;
    /**
     * Answers to the qualification's extra fields
     * @type {Array<StaffQualificationAdditionalDetails>}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    staffQualificationAdditionalDetails?: Array<StaffQualificationAdditionalDetails>;
    /**
     * Attached documents. Links are direct storage links; treat them as private
     * @type {Array<StaffFileAttachmentResponse>}
     * @memberof StaffGetStaffQualificationDetails200ResponseData
     */
    attachments?: Array<StaffFileAttachmentResponse>;
}

/**
 * Check if a given object implements the StaffGetStaffQualificationDetails200ResponseData interface.
 */
export function instanceOfStaffGetStaffQualificationDetails200ResponseData(value: object): value is StaffGetStaffQualificationDetails200ResponseData {
    return true;
}

export function StaffGetStaffQualificationDetails200ResponseDataFromJSON(json: any): StaffGetStaffQualificationDetails200ResponseData {
    return StaffGetStaffQualificationDetails200ResponseDataFromJSONTyped(json, false);
}

export function StaffGetStaffQualificationDetails200ResponseDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): StaffGetStaffQualificationDetails200ResponseData {
    if (json == null) {
        return json;
    }
    return {
        
        'tblStaffQualificationDetailsId': json['tblStaffQualificationDetailsId'] == null ? undefined : json['tblStaffQualificationDetailsId'],
        'tblQualificationId': json['tblQualificationId'] == null ? undefined : json['tblQualificationId'],
        'tblStaffId': json['tblStaffId'] == null ? undefined : json['tblStaffId'],
        'companyType': json['companyType'] == null ? undefined : json['companyType'],
        'companyId': json['companyId'] == null ? undefined : json['companyId'],
        'companyStaffId': json['companyStaffId'] == null ? undefined : json['companyStaffId'],
        'requestedByUserId': json['requestedByUserId'] == null ? undefined : json['requestedByUserId'],
        'requesterName': json['requesterName'] == null ? undefined : json['requesterName'],
        'registrationNumber': json['registrationNumber'] == null ? undefined : json['registrationNumber'],
        'issueDate': json['issueDate'] == null ? undefined : json['issueDate'],
        'note': json['note'] == null ? undefined : json['note'],
        'requesterNote': json['requesterNote'] == null ? undefined : json['requesterNote'],
        'expiryDate': json['expiryDate'] == null ? undefined : json['expiryDate'],
        'status': json['status'] == null ? undefined : json['status'],
        'comment': json['comment'] == null ? undefined : json['comment'],
        'dueDate': json['dueDate'] == null ? undefined : json['dueDate'],
        'qualificationValidity': json['qualificationValidity'] == null ? undefined : json['qualificationValidity'],
        'staffQualificationAdditionalDetails': json['staffQualificationAdditionalDetails'] == null ? undefined : ((json['staffQualificationAdditionalDetails'] as Array<any>).map(StaffQualificationAdditionalDetailsFromJSON)),
        'attachments': json['attachments'] == null ? undefined : ((json['attachments'] as Array<any>).map(StaffFileAttachmentResponseFromJSON)),
    };
}

export function StaffGetStaffQualificationDetails200ResponseDataToJSON(json: any): StaffGetStaffQualificationDetails200ResponseData {
    return StaffGetStaffQualificationDetails200ResponseDataToJSONTyped(json, false);
}

export function StaffGetStaffQualificationDetails200ResponseDataToJSONTyped(value?: StaffGetStaffQualificationDetails200ResponseData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'tblStaffQualificationDetailsId': value['tblStaffQualificationDetailsId'],
        'tblQualificationId': value['tblQualificationId'],
        'tblStaffId': value['tblStaffId'],
        'companyType': value['companyType'],
        'companyId': value['companyId'],
        'companyStaffId': value['companyStaffId'],
        'requestedByUserId': value['requestedByUserId'],
        'requesterName': value['requesterName'],
        'registrationNumber': value['registrationNumber'],
        'issueDate': value['issueDate'],
        'note': value['note'],
        'requesterNote': value['requesterNote'],
        'expiryDate': value['expiryDate'],
        'status': value['status'],
        'comment': value['comment'],
        'dueDate': value['dueDate'],
        'qualificationValidity': value['qualificationValidity'],
        'staffQualificationAdditionalDetails': value['staffQualificationAdditionalDetails'] == null ? undefined : ((value['staffQualificationAdditionalDetails'] as Array<any>).map(StaffQualificationAdditionalDetailsToJSON)),
        'attachments': value['attachments'] == null ? undefined : ((value['attachments'] as Array<any>).map(StaffFileAttachmentResponseToJSON)),
    };
}

