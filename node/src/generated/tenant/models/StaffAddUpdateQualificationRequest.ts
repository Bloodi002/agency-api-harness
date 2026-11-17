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
import type { StaffAddUpdateQualificationAdditionalFieldRequest } from './StaffAddUpdateQualificationAdditionalFieldRequest.js';
import {
    StaffAddUpdateQualificationAdditionalFieldRequestFromJSON,
    StaffAddUpdateQualificationAdditionalFieldRequestFromJSONTyped,
    StaffAddUpdateQualificationAdditionalFieldRequestToJSON,
    StaffAddUpdateQualificationAdditionalFieldRequestToJSONTyped,
} from './StaffAddUpdateQualificationAdditionalFieldRequest.js';
import type { StaffAddUpdateQualificationIndustryMappingRequest } from './StaffAddUpdateQualificationIndustryMappingRequest.js';
import {
    StaffAddUpdateQualificationIndustryMappingRequestFromJSON,
    StaffAddUpdateQualificationIndustryMappingRequestFromJSONTyped,
    StaffAddUpdateQualificationIndustryMappingRequestToJSON,
    StaffAddUpdateQualificationIndustryMappingRequestToJSONTyped,
} from './StaffAddUpdateQualificationIndustryMappingRequest.js';
import type { StaffAddUpdateQualificationStateMappingRequest } from './StaffAddUpdateQualificationStateMappingRequest.js';
import {
    StaffAddUpdateQualificationStateMappingRequestFromJSON,
    StaffAddUpdateQualificationStateMappingRequestFromJSONTyped,
    StaffAddUpdateQualificationStateMappingRequestToJSON,
    StaffAddUpdateQualificationStateMappingRequestToJSONTyped,
} from './StaffAddUpdateQualificationStateMappingRequest.js';

/**
 * 
 * @export
 * @interface StaffAddUpdateQualificationRequest
 */
export interface StaffAddUpdateQualificationRequest {
    /**
     * Omit (or send an empty id) to add a qualification; send an existing id to change it
     * @type {string}
     * @memberof StaffAddUpdateQualificationRequest
     */
    tblQualificationId?: string;
    /**
     * The platform qualification this one is based on, if any
     * @type {string}
     * @memberof StaffAddUpdateQualificationRequest
     */
    parentAdminTblQualificationId?: string | null;
    /**
     * Older way to name the owning organisation; use companyType and companyId instead
     * @type {string}
     * @memberof StaffAddUpdateQualificationRequest
     */
    tenantId?: string | null;
    /**
     * 1 tenant or 2 agency: who owns the qualification. 3 (platform) is refused (1 Tenant · 2 Agency · 3 Platform)
     * @type {number}
     * @memberof StaffAddUpdateQualificationRequest
     */
    companyType?: number;
    /**
     * The owner: your organisation or agency id
     * @type {string}
     * @memberof StaffAddUpdateQualificationRequest
     */
    companyId?: string | null;
    /**
     * Qualification type id
     * @type {string}
     * @memberof StaffAddUpdateQualificationRequest
     */
    qualificationTypeId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffAddUpdateQualificationRequest
     */
    qualificationName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffAddUpdateQualificationRequest
     */
    registrationNumberLabel?: string | null;
    /**
     * 1 when staff must give an issue date, 0 when not
     * @type {number}
     * @memberof StaffAddUpdateQualificationRequest
     */
    issueDateRequired?: number;
    /**
     * 
     * @type {string}
     * @memberof StaffAddUpdateQualificationRequest
     */
    issueDateLabel?: string | null;
    /**
     * 1 when staff must give an expiry date, 0 when not
     * @type {number}
     * @memberof StaffAddUpdateQualificationRequest
     */
    expiryDateRequired?: number;
    /**
     * 
     * @type {string}
     * @memberof StaffAddUpdateQualificationRequest
     */
    expiryDateLabel?: string | null;
    /**
     * How many months it stays valid
     * @type {number}
     * @memberof StaffAddUpdateQualificationRequest
     */
    qualificationValidity?: number | null;
    /**
     * true for active
     * @type {boolean}
     * @memberof StaffAddUpdateQualificationRequest
     */
    status?: boolean;
    /**
     * Days before expiry to send reminders, comma-separated (for example "30,7")
     * @type {string}
     * @memberof StaffAddUpdateQualificationRequest
     */
    sendExpiryWarning?: string | null;
    /**
     * true to limit weekly hours for staff holding it
     * @type {boolean}
     * @memberof StaffAddUpdateQualificationRequest
     */
    limitWorkersHour?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof StaffAddUpdateQualificationRequest
     */
    limitWorkersHourPerWeek?: boolean | null;
    /**
     * The hours limit
     * @type {number}
     * @memberof StaffAddUpdateQualificationRequest
     */
    limitWorkersHourValue?: number | null;
    /**
     * true to stop staff without it being rostered where it is required
     * @type {boolean}
     * @memberof StaffAddUpdateQualificationRequest
     */
    blockStaffRoster?: boolean;
    /**
     * true when a document must be attached
     * @type {boolean}
     * @memberof StaffAddUpdateQualificationRequest
     */
    attachmentRequired?: boolean;
    /**
     * true to add or remove staff from areas automatically as they gain or lose it
     * @type {boolean}
     * @memberof StaffAddUpdateQualificationRequest
     */
    addRemoveStaffToAreaAuto?: boolean;
    /**
     * true when a person must verify each staff qualification
     * @type {boolean}
     * @memberof StaffAddUpdateQualificationRequest
     */
    verificationRequired?: boolean | null;
    /**
     * 
     * @type {string}
     * @memberof StaffAddUpdateQualificationRequest
     */
    note?: string | null;
    /**
     * Not used
     * @type {number}
     * @memberof StaffAddUpdateQualificationRequest
     */
    value?: number | null;
    /**
     * Extra fields staff fill in
     * @type {Array<StaffAddUpdateQualificationAdditionalFieldRequest>}
     * @memberof StaffAddUpdateQualificationRequest
     */
    additionalFields?: Array<StaffAddUpdateQualificationAdditionalFieldRequest>;
    /**
     * States it applies to
     * @type {Array<StaffAddUpdateQualificationStateMappingRequest>}
     * @memberof StaffAddUpdateQualificationRequest
     */
    stateMappings?: Array<StaffAddUpdateQualificationStateMappingRequest>;
    /**
     * Industries it applies to
     * @type {Array<StaffAddUpdateQualificationIndustryMappingRequest>}
     * @memberof StaffAddUpdateQualificationRequest
     */
    industryMappings?: Array<StaffAddUpdateQualificationIndustryMappingRequest>;
}

/**
 * Check if a given object implements the StaffAddUpdateQualificationRequest interface.
 */
export function instanceOfStaffAddUpdateQualificationRequest(value: object): value is StaffAddUpdateQualificationRequest {
    return true;
}

export function StaffAddUpdateQualificationRequestFromJSON(json: any): StaffAddUpdateQualificationRequest {
    return StaffAddUpdateQualificationRequestFromJSONTyped(json, false);
}

export function StaffAddUpdateQualificationRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): StaffAddUpdateQualificationRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'tblQualificationId': json['tblQualificationId'] == null ? undefined : json['tblQualificationId'],
        'parentAdminTblQualificationId': json['parentAdminTblQualificationId'] == null ? undefined : json['parentAdminTblQualificationId'],
        'tenantId': json['tenantId'] == null ? undefined : json['tenantId'],
        'companyType': json['companyType'] == null ? undefined : json['companyType'],
        'companyId': json['companyId'] == null ? undefined : json['companyId'],
        'qualificationTypeId': json['qualificationTypeId'] == null ? undefined : json['qualificationTypeId'],
        'qualificationName': json['qualificationName'] == null ? undefined : json['qualificationName'],
        'registrationNumberLabel': json['registrationNumberLabel'] == null ? undefined : json['registrationNumberLabel'],
        'issueDateRequired': json['issueDateRequired'] == null ? undefined : json['issueDateRequired'],
        'issueDateLabel': json['issueDateLabel'] == null ? undefined : json['issueDateLabel'],
        'expiryDateRequired': json['expiryDateRequired'] == null ? undefined : json['expiryDateRequired'],
        'expiryDateLabel': json['expiryDateLabel'] == null ? undefined : json['expiryDateLabel'],
        'qualificationValidity': json['qualificationValidity'] == null ? undefined : json['qualificationValidity'],
        'status': json['status'] == null ? undefined : json['status'],
        'sendExpiryWarning': json['sendExpiryWarning'] == null ? undefined : json['sendExpiryWarning'],
        'limitWorkersHour': json['limitWorkersHour'] == null ? undefined : json['limitWorkersHour'],
        'limitWorkersHourPerWeek': json['limitWorkersHourPerWeek'] == null ? undefined : json['limitWorkersHourPerWeek'],
        'limitWorkersHourValue': json['limitWorkersHourValue'] == null ? undefined : json['limitWorkersHourValue'],
        'blockStaffRoster': json['blockStaffRoster'] == null ? undefined : json['blockStaffRoster'],
        'attachmentRequired': json['attachmentRequired'] == null ? undefined : json['attachmentRequired'],
        'addRemoveStaffToAreaAuto': json['addRemoveStaffToAreaAuto'] == null ? undefined : json['addRemoveStaffToAreaAuto'],
        'verificationRequired': json['verificationRequired'] == null ? undefined : json['verificationRequired'],
        'note': json['note'] == null ? undefined : json['note'],
        'value': json['value'] == null ? undefined : json['value'],
        'additionalFields': json['additionalFields'] == null ? undefined : ((json['additionalFields'] as Array<any>).map(StaffAddUpdateQualificationAdditionalFieldRequestFromJSON)),
        'stateMappings': json['stateMappings'] == null ? undefined : ((json['stateMappings'] as Array<any>).map(StaffAddUpdateQualificationStateMappingRequestFromJSON)),
        'industryMappings': json['industryMappings'] == null ? undefined : ((json['industryMappings'] as Array<any>).map(StaffAddUpdateQualificationIndustryMappingRequestFromJSON)),
    };
}

export function StaffAddUpdateQualificationRequestToJSON(json: any): StaffAddUpdateQualificationRequest {
    return StaffAddUpdateQualificationRequestToJSONTyped(json, false);
}

export function StaffAddUpdateQualificationRequestToJSONTyped(value?: StaffAddUpdateQualificationRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'tblQualificationId': value['tblQualificationId'],
        'parentAdminTblQualificationId': value['parentAdminTblQualificationId'],
        'tenantId': value['tenantId'],
        'companyType': value['companyType'],
        'companyId': value['companyId'],
        'qualificationTypeId': value['qualificationTypeId'],
        'qualificationName': value['qualificationName'],
        'registrationNumberLabel': value['registrationNumberLabel'],
        'issueDateRequired': value['issueDateRequired'],
        'issueDateLabel': value['issueDateLabel'],
        'expiryDateRequired': value['expiryDateRequired'],
        'expiryDateLabel': value['expiryDateLabel'],
        'qualificationValidity': value['qualificationValidity'],
        'status': value['status'],
        'sendExpiryWarning': value['sendExpiryWarning'],
        'limitWorkersHour': value['limitWorkersHour'],
        'limitWorkersHourPerWeek': value['limitWorkersHourPerWeek'],
        'limitWorkersHourValue': value['limitWorkersHourValue'],
        'blockStaffRoster': value['blockStaffRoster'],
        'attachmentRequired': value['attachmentRequired'],
        'addRemoveStaffToAreaAuto': value['addRemoveStaffToAreaAuto'],
        'verificationRequired': value['verificationRequired'],
        'note': value['note'],
        'value': value['value'],
        'additionalFields': value['additionalFields'] == null ? undefined : ((value['additionalFields'] as Array<any>).map(StaffAddUpdateQualificationAdditionalFieldRequestToJSON)),
        'stateMappings': value['stateMappings'] == null ? undefined : ((value['stateMappings'] as Array<any>).map(StaffAddUpdateQualificationStateMappingRequestToJSON)),
        'industryMappings': value['industryMappings'] == null ? undefined : ((value['industryMappings'] as Array<any>).map(StaffAddUpdateQualificationIndustryMappingRequestToJSON)),
    };
}

