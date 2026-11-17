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
import type { StaffStateDetails } from './StaffStateDetails.js';
import {
    StaffStateDetailsFromJSON,
    StaffStateDetailsFromJSONTyped,
    StaffStateDetailsToJSON,
    StaffStateDetailsToJSONTyped,
} from './StaffStateDetails.js';
import type { StaffAttchmentFiles } from './StaffAttchmentFiles.js';
import {
    StaffAttchmentFilesFromJSON,
    StaffAttchmentFilesFromJSONTyped,
    StaffAttchmentFilesToJSON,
    StaffAttchmentFilesToJSONTyped,
} from './StaffAttchmentFiles.js';
import type { StaffTagDto } from './StaffTagDto.js';
import {
    StaffTagDtoFromJSON,
    StaffTagDtoFromJSONTyped,
    StaffTagDtoToJSON,
    StaffTagDtoToJSONTyped,
} from './StaffTagDto.js';
import type { StaffCountryDetails } from './StaffCountryDetails.js';
import {
    StaffCountryDetailsFromJSON,
    StaffCountryDetailsFromJSONTyped,
    StaffCountryDetailsToJSON,
    StaffCountryDetailsToJSONTyped,
} from './StaffCountryDetails.js';

/**
 * 
 * @export
 * @interface StaffGetStaff200ResponseData
 */
export interface StaffGetStaff200ResponseData {
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    tblStaffId?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    tblUserId?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    tblTenantId?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    tblStaffCategoryId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    firstName?: string | null;
    /**
     * A short-lived link to the profile picture Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    profilePicture?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    middleName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    lastName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    prefferedName?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    emailAddress?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    mobileNumber?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    phoneNumber?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {Date}
     * @memberof StaffGetStaff200ResponseData
     */
    dateOfBirth?: Date | null;
    /**
     * Areas the staff member works in, keyed by area id, with the area name as the value
     * @type {{ [key: string]: string; }}
     * @memberof StaffGetStaff200ResponseData
     */
    areas?: { [key: string]: string; };
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    defaultArea?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    contracts?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    document?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    additionalDoc?: string | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    hiredOn?: string | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    terminatedOn?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    addressLine1?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    addressLine2?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    city?: string | null;
    /**
     * Always empty; see stateDetails Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    state?: string | null;
    /**
     * Always empty; see countryDetails Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    country?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    postCode?: string | null;
    /**
     * Staff status: 0 InActive, 1 Active, 2 Onboarding, 3 Archived, 4 Terminated
     * @type {number}
     * @memberof StaffGetStaff200ResponseData
     */
    status?: number | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    createdBy?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof StaffGetStaff200ResponseData
     */
    createdDate?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    modifiedBy?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof StaffGetStaff200ResponseData
     */
    modifiedDate?: Date | null;
    /**
     * Role names, comma-separated
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    permissionLevel?: string | null;
    /**
     * Documents attached to the profile
     * @type {Array<StaffAttchmentFiles>}
     * @memberof StaffGetStaff200ResponseData
     */
    files?: Array<StaffAttchmentFiles>;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    genderId?: string | null;
    /**
     * The staff member's tax file number from their tax declaration Needs `staff.finance.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    tfnNumber?: string | null;
    /**
     * Employment type id from the latest pay condition (spelt this way)
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    employemnentType?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    primaryLocationId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    primaryAreaId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    tblLocationGroupId?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffGetStaff200ResponseData
     */
    locationRosteredOn?: boolean | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffGetStaff200ResponseData
     */
    isManagerCanRostered?: boolean | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    gender?: string | null;
    /**
     * The profile picture file id Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    profilePic?: string | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    employeeStartDate?: string | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    employeeEndDate?: string | null;
    /**
     * Six-digit time-clock passcode Needs `staff.finance.read`; null without it.
     * @type {number}
     * @memberof StaffGetStaff200ResponseData
     */
    timeClockPasscode?: number | null;
    /**
     * Payroll id Needs `staff.finance.read`; null without it.
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    payrollId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffGetStaff200ResponseData
     */
    invitationStatus?: string | null;
    /**
     * 
     * @type {number}
     * @memberof StaffGetStaff200ResponseData
     */
    onboardingInvitationStatus?: number;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {StaffCountryDetails}
     * @memberof StaffGetStaff200ResponseData
     */
    countryDetails?: StaffCountryDetails | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {StaffStateDetails}
     * @memberof StaffGetStaff200ResponseData
     */
    stateDetails?: StaffStateDetails | null;
    /**
     * true for your organisation's main administrator
     * @type {boolean}
     * @memberof StaffGetStaff200ResponseData
     */
    isDefaultTenantAdmin?: boolean;
    /**
     * 
     * @type {Array<StaffTagDto>}
     * @memberof StaffGetStaff200ResponseData
     */
    tags?: Array<StaffTagDto>;
}

/**
 * Check if a given object implements the StaffGetStaff200ResponseData interface.
 */
export function instanceOfStaffGetStaff200ResponseData(value: object): value is StaffGetStaff200ResponseData {
    return true;
}

export function StaffGetStaff200ResponseDataFromJSON(json: any): StaffGetStaff200ResponseData {
    return StaffGetStaff200ResponseDataFromJSONTyped(json, false);
}

export function StaffGetStaff200ResponseDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): StaffGetStaff200ResponseData {
    if (json == null) {
        return json;
    }
    return {
        
        'tblStaffId': json['tblStaffId'] == null ? undefined : json['tblStaffId'],
        'tblUserId': json['tblUserId'] == null ? undefined : json['tblUserId'],
        'tblTenantId': json['tblTenantId'] == null ? undefined : json['tblTenantId'],
        'tblStaffCategoryId': json['tblStaffCategoryId'] == null ? undefined : json['tblStaffCategoryId'],
        'firstName': json['firstName'] == null ? undefined : json['firstName'],
        'profilePicture': json['profilePicture'] == null ? undefined : json['profilePicture'],
        'middleName': json['middleName'] == null ? undefined : json['middleName'],
        'lastName': json['lastName'] == null ? undefined : json['lastName'],
        'prefferedName': json['prefferedName'] == null ? undefined : json['prefferedName'],
        'emailAddress': json['emailAddress'] == null ? undefined : json['emailAddress'],
        'mobileNumber': json['mobileNumber'] == null ? undefined : json['mobileNumber'],
        'phoneNumber': json['phoneNumber'] == null ? undefined : json['phoneNumber'],
        'dateOfBirth': json['dateOfBirth'] == null ? undefined : (parseApiDate(json['dateOfBirth'])),
        'areas': json['areas'] == null ? undefined : json['areas'],
        'defaultArea': json['defaultArea'] == null ? undefined : json['defaultArea'],
        'contracts': json['contracts'] == null ? undefined : json['contracts'],
        'document': json['document'] == null ? undefined : json['document'],
        'additionalDoc': json['additionalDoc'] == null ? undefined : json['additionalDoc'],
        'hiredOn': json['hiredOn'] == null ? undefined : json['hiredOn'],
        'terminatedOn': json['terminatedOn'] == null ? undefined : json['terminatedOn'],
        'addressLine1': json['addressLine1'] == null ? undefined : json['addressLine1'],
        'addressLine2': json['addressLine2'] == null ? undefined : json['addressLine2'],
        'city': json['city'] == null ? undefined : json['city'],
        'state': json['state'] == null ? undefined : json['state'],
        'country': json['country'] == null ? undefined : json['country'],
        'postCode': json['postCode'] == null ? undefined : json['postCode'],
        'status': json['status'] == null ? undefined : json['status'],
        'createdBy': json['createdBy'] == null ? undefined : json['createdBy'],
        'createdDate': json['createdDate'] == null ? undefined : (parseApiDate(json['createdDate'])),
        'modifiedBy': json['modifiedBy'] == null ? undefined : json['modifiedBy'],
        'modifiedDate': json['modifiedDate'] == null ? undefined : (parseApiDate(json['modifiedDate'])),
        'permissionLevel': json['permissionLevel'] == null ? undefined : json['permissionLevel'],
        'files': json['files'] == null ? undefined : ((json['files'] as Array<any>).map(StaffAttchmentFilesFromJSON)),
        'genderId': json['genderId'] == null ? undefined : json['genderId'],
        'tfnNumber': json['tfnNumber'] == null ? undefined : json['tfnNumber'],
        'employemnentType': json['employemnentType'] == null ? undefined : json['employemnentType'],
        'primaryLocationId': json['primaryLocationId'] == null ? undefined : json['primaryLocationId'],
        'primaryAreaId': json['primaryAreaId'] == null ? undefined : json['primaryAreaId'],
        'tblLocationGroupId': json['tblLocationGroupId'] == null ? undefined : json['tblLocationGroupId'],
        'locationRosteredOn': json['locationRosteredOn'] == null ? undefined : json['locationRosteredOn'],
        'isManagerCanRostered': json['isManagerCanRostered'] == null ? undefined : json['isManagerCanRostered'],
        'gender': json['gender'] == null ? undefined : json['gender'],
        'profilePic': json['profilePic'] == null ? undefined : json['profilePic'],
        'employeeStartDate': json['employeeStartDate'] == null ? undefined : json['employeeStartDate'],
        'employeeEndDate': json['employeeEndDate'] == null ? undefined : json['employeeEndDate'],
        'timeClockPasscode': json['timeClockPasscode'] == null ? undefined : json['timeClockPasscode'],
        'payrollId': json['payrollId'] == null ? undefined : json['payrollId'],
        'invitationStatus': json['invitationStatus'] == null ? undefined : json['invitationStatus'],
        'onboardingInvitationStatus': json['onboardingInvitationStatus'] == null ? undefined : json['onboardingInvitationStatus'],
        'countryDetails': json['countryDetails'] == null ? undefined : StaffCountryDetailsFromJSON(json['countryDetails']),
        'stateDetails': json['stateDetails'] == null ? undefined : StaffStateDetailsFromJSON(json['stateDetails']),
        'isDefaultTenantAdmin': json['isDefaultTenantAdmin'] == null ? undefined : json['isDefaultTenantAdmin'],
        'tags': json['tags'] == null ? undefined : ((json['tags'] as Array<any>).map(StaffTagDtoFromJSON)),
    };
}

export function StaffGetStaff200ResponseDataToJSON(json: any): StaffGetStaff200ResponseData {
    return StaffGetStaff200ResponseDataToJSONTyped(json, false);
}

export function StaffGetStaff200ResponseDataToJSONTyped(value?: StaffGetStaff200ResponseData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'tblStaffId': value['tblStaffId'],
        'tblUserId': value['tblUserId'],
        'tblTenantId': value['tblTenantId'],
        'tblStaffCategoryId': value['tblStaffCategoryId'],
        'firstName': value['firstName'],
        'profilePicture': value['profilePicture'],
        'middleName': value['middleName'],
        'lastName': value['lastName'],
        'prefferedName': value['prefferedName'],
        'emailAddress': value['emailAddress'],
        'mobileNumber': value['mobileNumber'],
        'phoneNumber': value['phoneNumber'],
        'dateOfBirth': value['dateOfBirth'] === null ? null : ((value['dateOfBirth'] as any)?.toISOString().substring(0,10)),
        'areas': value['areas'],
        'defaultArea': value['defaultArea'],
        'contracts': value['contracts'],
        'document': value['document'],
        'additionalDoc': value['additionalDoc'],
        'hiredOn': value['hiredOn'],
        'terminatedOn': value['terminatedOn'],
        'addressLine1': value['addressLine1'],
        'addressLine2': value['addressLine2'],
        'city': value['city'],
        'state': value['state'],
        'country': value['country'],
        'postCode': value['postCode'],
        'status': value['status'],
        'createdBy': value['createdBy'],
        'createdDate': value['createdDate'] === null ? null : ((value['createdDate'] as any)?.toISOString()),
        'modifiedBy': value['modifiedBy'],
        'modifiedDate': value['modifiedDate'] === null ? null : ((value['modifiedDate'] as any)?.toISOString()),
        'permissionLevel': value['permissionLevel'],
        'files': value['files'] == null ? undefined : ((value['files'] as Array<any>).map(StaffAttchmentFilesToJSON)),
        'genderId': value['genderId'],
        'tfnNumber': value['tfnNumber'],
        'employemnentType': value['employemnentType'],
        'primaryLocationId': value['primaryLocationId'],
        'primaryAreaId': value['primaryAreaId'],
        'tblLocationGroupId': value['tblLocationGroupId'],
        'locationRosteredOn': value['locationRosteredOn'],
        'isManagerCanRostered': value['isManagerCanRostered'],
        'gender': value['gender'],
        'profilePic': value['profilePic'],
        'employeeStartDate': value['employeeStartDate'],
        'employeeEndDate': value['employeeEndDate'],
        'timeClockPasscode': value['timeClockPasscode'],
        'payrollId': value['payrollId'],
        'invitationStatus': value['invitationStatus'],
        'onboardingInvitationStatus': value['onboardingInvitationStatus'],
        'countryDetails': StaffCountryDetailsToJSON(value['countryDetails']),
        'stateDetails': StaffStateDetailsToJSON(value['stateDetails']),
        'isDefaultTenantAdmin': value['isDefaultTenantAdmin'],
        'tags': value['tags'] == null ? undefined : ((value['tags'] as Array<any>).map(StaffTagDtoToJSON)),
    };
}

