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
import type { StaffQualificationStaffDetails } from './StaffQualificationStaffDetails.js';
import {
    StaffQualificationStaffDetailsFromJSON,
    StaffQualificationStaffDetailsFromJSONTyped,
    StaffQualificationStaffDetailsToJSON,
    StaffQualificationStaffDetailsToJSONTyped,
} from './StaffQualificationStaffDetails.js';
import type { StaffQualificationAdditionalFieldResponse } from './StaffQualificationAdditionalFieldResponse.js';
import {
    StaffQualificationAdditionalFieldResponseFromJSON,
    StaffQualificationAdditionalFieldResponseFromJSONTyped,
    StaffQualificationAdditionalFieldResponseToJSON,
    StaffQualificationAdditionalFieldResponseToJSONTyped,
} from './StaffQualificationAdditionalFieldResponse.js';
import type { StaffQualificationAreaDetails } from './StaffQualificationAreaDetails.js';
import {
    StaffQualificationAreaDetailsFromJSON,
    StaffQualificationAreaDetailsFromJSONTyped,
    StaffQualificationAreaDetailsToJSON,
    StaffQualificationAreaDetailsToJSONTyped,
} from './StaffQualificationAreaDetails.js';

/**
 * 
 * @export
 * @interface StaffQualificationlistDetailResponce
 */
export interface StaffQualificationlistDetailResponce {
    /**
     * The qualification id
     * @type {string}
     * @memberof StaffQualificationlistDetailResponce
     */
    tblQualificationId?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffQualificationlistDetailResponce
     */
    qualificationName?: string | null;
    /**
     * The qualification type id
     * @type {string}
     * @memberof StaffQualificationlistDetailResponce
     */
    tblQualificationTypeId?: string | null;
    /**
     * Not filled by the list calls
     * @type {number}
     * @memberof StaffQualificationlistDetailResponce
     */
    expiryDateRequired?: number;
    /**
     * Not filled by the list calls
     * @type {number}
     * @memberof StaffQualificationlistDetailResponce
     */
    issueDateRequired?: number;
    /**
     * The qualification type name
     * @type {string}
     * @memberof StaffQualificationlistDetailResponce
     */
    qualificationType?: string | null;
    /**
     * How many months the qualification stays valid
     * @type {number}
     * @memberof StaffQualificationlistDetailResponce
     */
    defaultValidity?: number | null;
    /**
     * The weekly hours limit for staff holding it, if any
     * @type {number}
     * @memberof StaffQualificationlistDetailResponce
     */
    maximumHours?: number | null;
    /**
     * Staff in an organisation who hold this qualification
     * @type {Array<StaffQualificationStaffDetails>}
     * @memberof StaffQualificationlistDetailResponce
     */
    qualificationStaffDetails?: Array<StaffQualificationStaffDetails>;
    /**
     * Areas that require this qualification
     * @type {Array<StaffQualificationAreaDetails>}
     * @memberof StaffQualificationlistDetailResponce
     */
    qualificationAreaDetails?: Array<StaffQualificationAreaDetails>;
    /**
     * true when active
     * @type {boolean}
     * @memberof StaffQualificationlistDetailResponce
     */
    status?: boolean;
    /**
     * Industry names the qualification applies to
     * @type {Array<string>}
     * @memberof StaffQualificationlistDetailResponce
     */
    industries?: Array<string> | null;
    /**
     * State names the qualification applies to
     * @type {Array<string>}
     * @memberof StaffQualificationlistDetailResponce
     */
    states?: Array<string> | null;
    /**
     * true when staff are added to or removed from areas automatically as they gain or lose it
     * @type {boolean}
     * @memberof StaffQualificationlistDetailResponce
     */
    addRemoveStaffToAreaAuto?: boolean;
    /**
     * true when staff without it cannot be rostered where it is required
     * @type {boolean}
     * @memberof StaffQualificationlistDetailResponce
     */
    blockStaffRoster?: boolean;
    /**
     * Not filled by the list calls
     * @type {Array<StaffQualificationAdditionalFieldResponse>}
     * @memberof StaffQualificationlistDetailResponce
     */
    additionalField?: Array<StaffQualificationAdditionalFieldResponse>;
}

/**
 * Check if a given object implements the StaffQualificationlistDetailResponce interface.
 */
export function instanceOfStaffQualificationlistDetailResponce(value: object): value is StaffQualificationlistDetailResponce {
    return true;
}

export function StaffQualificationlistDetailResponceFromJSON(json: any): StaffQualificationlistDetailResponce {
    return StaffQualificationlistDetailResponceFromJSONTyped(json, false);
}

export function StaffQualificationlistDetailResponceFromJSONTyped(json: any, ignoreDiscriminator: boolean): StaffQualificationlistDetailResponce {
    if (json == null) {
        return json;
    }
    return {
        
        'tblQualificationId': json['tblQualificationId'] == null ? undefined : json['tblQualificationId'],
        'qualificationName': json['qualificationName'] == null ? undefined : json['qualificationName'],
        'tblQualificationTypeId': json['tblQualificationTypeId'] == null ? undefined : json['tblQualificationTypeId'],
        'expiryDateRequired': json['expiryDateRequired'] == null ? undefined : json['expiryDateRequired'],
        'issueDateRequired': json['issueDateRequired'] == null ? undefined : json['issueDateRequired'],
        'qualificationType': json['qualificationType'] == null ? undefined : json['qualificationType'],
        'defaultValidity': json['defaultValidity'] == null ? undefined : json['defaultValidity'],
        'maximumHours': json['maximumHours'] == null ? undefined : json['maximumHours'],
        'qualificationStaffDetails': json['qualificationStaffDetails'] == null ? undefined : ((json['qualificationStaffDetails'] as Array<any>).map(StaffQualificationStaffDetailsFromJSON)),
        'qualificationAreaDetails': json['qualificationAreaDetails'] == null ? undefined : ((json['qualificationAreaDetails'] as Array<any>).map(StaffQualificationAreaDetailsFromJSON)),
        'status': json['status'] == null ? undefined : json['status'],
        'industries': json['industries'] == null ? undefined : json['industries'],
        'states': json['states'] == null ? undefined : json['states'],
        'addRemoveStaffToAreaAuto': json['addRemoveStaffToAreaAuto'] == null ? undefined : json['addRemoveStaffToAreaAuto'],
        'blockStaffRoster': json['blockStaffRoster'] == null ? undefined : json['blockStaffRoster'],
        'additionalField': json['additionalField'] == null ? undefined : ((json['additionalField'] as Array<any>).map(StaffQualificationAdditionalFieldResponseFromJSON)),
    };
}

export function StaffQualificationlistDetailResponceToJSON(json: any): StaffQualificationlistDetailResponce {
    return StaffQualificationlistDetailResponceToJSONTyped(json, false);
}

export function StaffQualificationlistDetailResponceToJSONTyped(value?: StaffQualificationlistDetailResponce | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'tblQualificationId': value['tblQualificationId'],
        'qualificationName': value['qualificationName'],
        'tblQualificationTypeId': value['tblQualificationTypeId'],
        'expiryDateRequired': value['expiryDateRequired'],
        'issueDateRequired': value['issueDateRequired'],
        'qualificationType': value['qualificationType'],
        'defaultValidity': value['defaultValidity'],
        'maximumHours': value['maximumHours'],
        'qualificationStaffDetails': value['qualificationStaffDetails'] == null ? undefined : ((value['qualificationStaffDetails'] as Array<any>).map(StaffQualificationStaffDetailsToJSON)),
        'qualificationAreaDetails': value['qualificationAreaDetails'] == null ? undefined : ((value['qualificationAreaDetails'] as Array<any>).map(StaffQualificationAreaDetailsToJSON)),
        'status': value['status'],
        'industries': value['industries'],
        'states': value['states'],
        'addRemoveStaffToAreaAuto': value['addRemoveStaffToAreaAuto'],
        'blockStaffRoster': value['blockStaffRoster'],
        'additionalField': value['additionalField'] == null ? undefined : ((value['additionalField'] as Array<any>).map(StaffQualificationAdditionalFieldResponseToJSON)),
    };
}

