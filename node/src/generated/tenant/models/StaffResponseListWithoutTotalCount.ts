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
import type { StaffTagDto } from './StaffTagDto.js';
import {
    StaffTagDtoFromJSON,
    StaffTagDtoFromJSONTyped,
    StaffTagDtoToJSON,
    StaffTagDtoToJSONTyped,
} from './StaffTagDto.js';
import type { StaffRoleDto } from './StaffRoleDto.js';
import {
    StaffRoleDtoFromJSON,
    StaffRoleDtoFromJSONTyped,
    StaffRoleDtoToJSON,
    StaffRoleDtoToJSONTyped,
} from './StaffRoleDto.js';

/**
 * 
 * @export
 * @interface StaffResponseListWithoutTotalCount
 */
export interface StaffResponseListWithoutTotalCount {
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    tblStaffId?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    tblUserId?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    tblTenantId?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    tblStaffCategoryId?: string | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    hiredOn?: string | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    terminatedOn?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    addressLine1?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    addressLine2?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    city?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    state?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    country?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    postCode?: string | null;
    /**
     * Staff status: 0 InActive, 1 Active, 2 Onboarding, 3 Archived, 4 Terminated
     * @type {number}
     * @memberof StaffResponseListWithoutTotalCount
     */
    status?: number | null;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    createdBy?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof StaffResponseListWithoutTotalCount
     */
    createdDate?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    modifiedBy?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof StaffResponseListWithoutTotalCount
     */
    modifiedDate?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    firstName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    middleName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    lastName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    prefferedName?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    emailAddress?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    mobileNumber?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    phoneNumber?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {Date}
     * @memberof StaffResponseListWithoutTotalCount
     */
    dateOfBirth?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    defaultArea?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    locationName?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    contracts?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    document?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    additionalDoc?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    comment?: string | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    genderId?: string | null;
    /**
     * Needs `pay_conditions.read`; null without it.
     * @type {Date}
     * @memberof StaffResponseListWithoutTotalCount
     */
    payrollCesDt?: Date | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    profilePic?: string | null;
    /**
     * The staff member's six-digit time-clock passcode Needs `staff.finance.read`; null without it.
     * @type {number}
     * @memberof StaffResponseListWithoutTotalCount
     */
    timeClockPasscode?: number | null;
    /**
     * The staff member's payroll id Needs `staff.finance.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    payrollId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    regType?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffResponseListWithoutTotalCount
     */
    isDesktopLoginEnable?: boolean | null;
    /**
     * The staff member's roles
     * @type {Array<StaffRoleDto>}
     * @memberof StaffResponseListWithoutTotalCount
     */
    permissionLevel?: Array<StaffRoleDto>;
    /**
     * Not used Needs `pay_conditions.read`; the all-zero id without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    tblStaffPayRateId?: string;
    /**
     * Not used Needs `pay_conditions.read`; the all-zero id without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    tblPayRollId?: string;
    /**
     * Always empty Needs `staff.finance.read`; blank without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    passCode?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    position?: string;
    /**
     * 
     * @type {Array<StaffTagDto>}
     * @memberof StaffResponseListWithoutTotalCount
     */
    tagDetails?: Array<StaffTagDto>;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    qualification?: string;
    /**
     * Needs `staff.personal.read`; blank without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    lastLogin?: string;
    /**
     * Always empty Needs `pay_conditions.read`; blank without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    payRate?: string;
    /**
     * 
     * @type {boolean}
     * @memberof StaffResponseListWithoutTotalCount
     */
    userInvitedOrNot?: boolean;
    /**
     * Account invitation status
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    invitationStatus?: string | null;
    /**
     * Locations and areas, formatted for display
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    locationWithArea?: string | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    employeeStartDate?: string | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    employeeEndDate?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    primaryLocation?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    primaryAreaId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    locationGroupId?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffResponseListWithoutTotalCount
     */
    locationRosteredOn?: boolean | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffResponseListWithoutTotalCount
     */
    isManagerCanRostered?: boolean | null;
    /**
     * Needs `staff.personal.read`; null without it.
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    gender?: string | null;
    /**
     * Onboarding invitation status
     * @type {number}
     * @memberof StaffResponseListWithoutTotalCount
     */
    onboardingInvitationStatus?: number | null;
    /**
     * 
     * @type {string}
     * @memberof StaffResponseListWithoutTotalCount
     */
    statusName?: string | null;
}

/**
 * Check if a given object implements the StaffResponseListWithoutTotalCount interface.
 */
export function instanceOfStaffResponseListWithoutTotalCount(value: object): value is StaffResponseListWithoutTotalCount {
    return true;
}

export function StaffResponseListWithoutTotalCountFromJSON(json: any): StaffResponseListWithoutTotalCount {
    return StaffResponseListWithoutTotalCountFromJSONTyped(json, false);
}

export function StaffResponseListWithoutTotalCountFromJSONTyped(json: any, ignoreDiscriminator: boolean): StaffResponseListWithoutTotalCount {
    if (json == null) {
        return json;
    }
    return {
        
        'tblStaffId': json['tblStaffId'] == null ? undefined : json['tblStaffId'],
        'tblUserId': json['tblUserId'] == null ? undefined : json['tblUserId'],
        'tblTenantId': json['tblTenantId'] == null ? undefined : json['tblTenantId'],
        'tblStaffCategoryId': json['tblStaffCategoryId'] == null ? undefined : json['tblStaffCategoryId'],
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
        'firstName': json['firstName'] == null ? undefined : json['firstName'],
        'middleName': json['middleName'] == null ? undefined : json['middleName'],
        'lastName': json['lastName'] == null ? undefined : json['lastName'],
        'prefferedName': json['prefferedName'] == null ? undefined : json['prefferedName'],
        'emailAddress': json['emailAddress'] == null ? undefined : json['emailAddress'],
        'mobileNumber': json['mobileNumber'] == null ? undefined : json['mobileNumber'],
        'phoneNumber': json['phoneNumber'] == null ? undefined : json['phoneNumber'],
        'dateOfBirth': json['dateOfBirth'] == null ? undefined : (parseApiDate(json['dateOfBirth'])),
        'defaultArea': json['defaultArea'] == null ? undefined : json['defaultArea'],
        'locationName': json['locationName'] == null ? undefined : json['locationName'],
        'contracts': json['contracts'] == null ? undefined : json['contracts'],
        'document': json['document'] == null ? undefined : json['document'],
        'additionalDoc': json['additionalDoc'] == null ? undefined : json['additionalDoc'],
        'comment': json['comment'] == null ? undefined : json['comment'],
        'genderId': json['genderId'] == null ? undefined : json['genderId'],
        'payrollCesDt': json['payrollCesDt'] == null ? undefined : (parseApiDate(json['payrollCesDt'])),
        'profilePic': json['profilePic'] == null ? undefined : json['profilePic'],
        'timeClockPasscode': json['timeClockPasscode'] == null ? undefined : json['timeClockPasscode'],
        'payrollId': json['payrollId'] == null ? undefined : json['payrollId'],
        'regType': json['regType'] == null ? undefined : json['regType'],
        'isDesktopLoginEnable': json['isDesktopLoginEnable'] == null ? undefined : json['isDesktopLoginEnable'],
        'permissionLevel': json['permissionLevel'] == null ? undefined : ((json['permissionLevel'] as Array<any>).map(StaffRoleDtoFromJSON)),
        'tblStaffPayRateId': json['tblStaffPayRateId'] == null ? undefined : json['tblStaffPayRateId'],
        'tblPayRollId': json['tblPayRollId'] == null ? undefined : json['tblPayRollId'],
        'passCode': json['passCode'] == null ? undefined : json['passCode'],
        'position': json['position'] == null ? undefined : json['position'],
        'tagDetails': json['tagDetails'] == null ? undefined : ((json['tagDetails'] as Array<any>).map(StaffTagDtoFromJSON)),
        'qualification': json['qualification'] == null ? undefined : json['qualification'],
        'lastLogin': json['lastLogin'] == null ? undefined : json['lastLogin'],
        'payRate': json['payRate'] == null ? undefined : json['payRate'],
        'userInvitedOrNot': json['userInvitedOrNot'] == null ? undefined : json['userInvitedOrNot'],
        'invitationStatus': json['invitationStatus'] == null ? undefined : json['invitationStatus'],
        'locationWithArea': json['locationWithArea'] == null ? undefined : json['locationWithArea'],
        'employeeStartDate': json['employeeStartDate'] == null ? undefined : json['employeeStartDate'],
        'employeeEndDate': json['employeeEndDate'] == null ? undefined : json['employeeEndDate'],
        'primaryLocation': json['primaryLocation'] == null ? undefined : json['primaryLocation'],
        'primaryAreaId': json['primaryAreaId'] == null ? undefined : json['primaryAreaId'],
        'locationGroupId': json['locationGroupId'] == null ? undefined : json['locationGroupId'],
        'locationRosteredOn': json['locationRosteredOn'] == null ? undefined : json['locationRosteredOn'],
        'isManagerCanRostered': json['isManagerCanRostered'] == null ? undefined : json['isManagerCanRostered'],
        'gender': json['gender'] == null ? undefined : json['gender'],
        'onboardingInvitationStatus': json['onboardingInvitationStatus'] == null ? undefined : json['onboardingInvitationStatus'],
        'statusName': json['statusName'] == null ? undefined : json['statusName'],
    };
}

export function StaffResponseListWithoutTotalCountToJSON(json: any): StaffResponseListWithoutTotalCount {
    return StaffResponseListWithoutTotalCountToJSONTyped(json, false);
}

export function StaffResponseListWithoutTotalCountToJSONTyped(value?: StaffResponseListWithoutTotalCount | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'tblStaffId': value['tblStaffId'],
        'tblUserId': value['tblUserId'],
        'tblTenantId': value['tblTenantId'],
        'tblStaffCategoryId': value['tblStaffCategoryId'],
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
        'firstName': value['firstName'],
        'middleName': value['middleName'],
        'lastName': value['lastName'],
        'prefferedName': value['prefferedName'],
        'emailAddress': value['emailAddress'],
        'mobileNumber': value['mobileNumber'],
        'phoneNumber': value['phoneNumber'],
        'dateOfBirth': value['dateOfBirth'] === null ? null : ((value['dateOfBirth'] as any)?.toISOString().substring(0,10)),
        'defaultArea': value['defaultArea'],
        'locationName': value['locationName'],
        'contracts': value['contracts'],
        'document': value['document'],
        'additionalDoc': value['additionalDoc'],
        'comment': value['comment'],
        'genderId': value['genderId'],
        'payrollCesDt': value['payrollCesDt'] === null ? null : ((value['payrollCesDt'] as any)?.toISOString()),
        'profilePic': value['profilePic'],
        'timeClockPasscode': value['timeClockPasscode'],
        'payrollId': value['payrollId'],
        'regType': value['regType'],
        'isDesktopLoginEnable': value['isDesktopLoginEnable'],
        'permissionLevel': value['permissionLevel'] == null ? undefined : ((value['permissionLevel'] as Array<any>).map(StaffRoleDtoToJSON)),
        'tblStaffPayRateId': value['tblStaffPayRateId'],
        'tblPayRollId': value['tblPayRollId'],
        'passCode': value['passCode'],
        'position': value['position'],
        'tagDetails': value['tagDetails'] == null ? undefined : ((value['tagDetails'] as Array<any>).map(StaffTagDtoToJSON)),
        'qualification': value['qualification'],
        'lastLogin': value['lastLogin'],
        'payRate': value['payRate'],
        'userInvitedOrNot': value['userInvitedOrNot'],
        'invitationStatus': value['invitationStatus'],
        'locationWithArea': value['locationWithArea'],
        'employeeStartDate': value['employeeStartDate'],
        'employeeEndDate': value['employeeEndDate'],
        'primaryLocation': value['primaryLocation'],
        'primaryAreaId': value['primaryAreaId'],
        'locationGroupId': value['locationGroupId'],
        'locationRosteredOn': value['locationRosteredOn'],
        'isManagerCanRostered': value['isManagerCanRostered'],
        'gender': value['gender'],
        'onboardingInvitationStatus': value['onboardingInvitationStatus'],
        'statusName': value['statusName'],
    };
}

