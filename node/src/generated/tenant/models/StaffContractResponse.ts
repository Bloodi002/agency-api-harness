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
import type { StaffLocationData } from './StaffLocationData.js';
import {
    StaffLocationDataFromJSON,
    StaffLocationDataFromJSONTyped,
    StaffLocationDataToJSON,
    StaffLocationDataToJSONTyped,
} from './StaffLocationData.js';
import type { StaffStatus } from './StaffStatus.js';
import {
    StaffStatusFromJSON,
    StaffStatusFromJSONTyped,
    StaffStatusToJSON,
    StaffStatusToJSONTyped,
} from './StaffStatus.js';
import type { StaffContractCommunicationResponse } from './StaffContractCommunicationResponse.js';
import {
    StaffContractCommunicationResponseFromJSON,
    StaffContractCommunicationResponseFromJSONTyped,
    StaffContractCommunicationResponseToJSON,
    StaffContractCommunicationResponseToJSONTyped,
} from './StaffContractCommunicationResponse.js';
import type { StaffEmploymentType } from './StaffEmploymentType.js';
import {
    StaffEmploymentTypeFromJSON,
    StaffEmploymentTypeFromJSONTyped,
    StaffEmploymentTypeToJSON,
    StaffEmploymentTypeToJSONTyped,
} from './StaffEmploymentType.js';
import type { StaffContractTagDto } from './StaffContractTagDto.js';
import {
    StaffContractTagDtoFromJSON,
    StaffContractTagDtoFromJSONTyped,
    StaffContractTagDtoToJSON,
    StaffContractTagDtoToJSONTyped,
} from './StaffContractTagDto.js';
import type { StaffDepartmentRole } from './StaffDepartmentRole.js';
import {
    StaffDepartmentRoleFromJSON,
    StaffDepartmentRoleFromJSONTyped,
    StaffDepartmentRoleToJSON,
    StaffDepartmentRoleToJSONTyped,
} from './StaffDepartmentRole.js';

/**
 * 
 * @export
 * @interface StaffContractResponse
 */
export interface StaffContractResponse {
    /**
     * The contract template id
     * @type {string}
     * @memberof StaffContractResponse
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffContractResponse
     */
    templateName?: string;
    /**
     * 
     * @type {Array<StaffEmploymentType>}
     * @memberof StaffContractResponse
     */
    employmentTypes?: Array<StaffEmploymentType> | null;
    /**
     * 
     * @type {Array<StaffDepartmentRole>}
     * @memberof StaffContractResponse
     */
    departmentRoles?: Array<StaffDepartmentRole> | null;
    /**
     * Not filled by this call; see tagDetails
     * @type {string}
     * @memberof StaffContractResponse
     */
    tags?: string | null;
    /**
     * 
     * @type {Array<StaffContractTagDto>}
     * @memberof StaffContractResponse
     */
    tagDetails?: Array<StaffContractTagDto> | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffContractResponse
     */
    effectiveDate?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffContractResponse
     */
    isDocument?: boolean;
    /**
     * 
     * @type {string}
     * @memberof StaffContractResponse
     */
    pdfToken?: string | null;
    /**
     * 
     * @type {Array<StaffLocationData>}
     * @memberof StaffContractResponse
     */
    areas?: Array<StaffLocationData> | null;
    /**
     * 
     * @type {string}
     * @memberof StaffContractResponse
     */
    description?: string | null;
    /**
     * A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof StaffContractResponse
     */
    effectiveFromDate?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffContractResponse
     */
    ackRequired?: boolean;
    /**
     * 
     * @type {string}
     * @memberof StaffContractResponse
     */
    documentContent?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffContractResponse
     */
    documentURL?: string | null;
    /**
     * The current version number, written as a string (for example "2")
     * @type {string}
     * @memberof StaffContractResponse
     */
    version?: string;
    /**
     * 
     * @type {string}
     * @memberof StaffContractResponse
     */
    createdBy?: string;
    /**
     * 
     * @type {Date}
     * @memberof StaffContractResponse
     */
    createdOn?: Date;
    /**
     * 
     * @type {string}
     * @memberof StaffContractResponse
     */
    modifiedBy?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof StaffContractResponse
     */
    modifiedOn?: Date | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffContractResponse
     */
    isDelete?: boolean;
    /**
     * The owning organisation; null for a platform template
     * @type {string}
     * @memberof StaffContractResponse
     */
    tblTenantId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffContractResponse
     */
    contractTypeLookUpId?: string;
    /**
     * 
     * @type {number}
     * @memberof StaffContractResponse
     */
    useCase?: number | null;
    /**
     * 
     * @type {string}
     * @memberof StaffContractResponse
     */
    contractTypeLookUpName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffContractResponse
     */
    createdByName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StaffContractResponse
     */
    modifiedByName?: string | null;
    /**
     * 
     * @type {StaffStatus}
     * @memberof StaffContractResponse
     */
    status?: StaffStatus | null;
    /**
     * 
     * @type {boolean}
     * @memberof StaffContractResponse
     */
    isPDF?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof StaffContractResponse
     */
    isArchived?: boolean;
    /**
     * 
     * @type {string}
     * @memberof StaffContractResponse
     */
    fileName?: string | null;
    /**
     * 
     * @type {number}
     * @memberof StaffContractResponse
     */
    docuSealPDFTempId?: number | null;
    /**
     * 
     * @type {string}
     * @memberof StaffContractResponse
     */
    tblContractDocuSealFieldId?: string | null;
    /**
     * Every time this template was sent, with its current status
     * @type {Array<StaffContractCommunicationResponse>}
     * @memberof StaffContractResponse
     */
    contractCommunicationResponses?: Array<StaffContractCommunicationResponse> | null;
}

/**
 * Check if a given object implements the StaffContractResponse interface.
 */
export function instanceOfStaffContractResponse(value: object): value is StaffContractResponse {
    return true;
}

export function StaffContractResponseFromJSON(json: any): StaffContractResponse {
    return StaffContractResponseFromJSONTyped(json, false);
}

export function StaffContractResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): StaffContractResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'templateName': json['templateName'] == null ? undefined : json['templateName'],
        'employmentTypes': json['employmentTypes'] == null ? undefined : ((json['employmentTypes'] as Array<any>).map(StaffEmploymentTypeFromJSON)),
        'departmentRoles': json['departmentRoles'] == null ? undefined : ((json['departmentRoles'] as Array<any>).map(StaffDepartmentRoleFromJSON)),
        'tags': json['tags'] == null ? undefined : json['tags'],
        'tagDetails': json['tagDetails'] == null ? undefined : ((json['tagDetails'] as Array<any>).map(StaffContractTagDtoFromJSON)),
        'effectiveDate': json['effectiveDate'] == null ? undefined : json['effectiveDate'],
        'isDocument': json['isDocument'] == null ? undefined : json['isDocument'],
        'pdfToken': json['pdfToken'] == null ? undefined : json['pdfToken'],
        'areas': json['areas'] == null ? undefined : ((json['areas'] as Array<any>).map(StaffLocationDataFromJSON)),
        'description': json['description'] == null ? undefined : json['description'],
        'effectiveFromDate': json['effectiveFromDate'] == null ? undefined : json['effectiveFromDate'],
        'ackRequired': json['ackRequired'] == null ? undefined : json['ackRequired'],
        'documentContent': json['documentContent'] == null ? undefined : json['documentContent'],
        'documentURL': json['documentURL'] == null ? undefined : json['documentURL'],
        'version': json['version'] == null ? undefined : json['version'],
        'createdBy': json['createdBy'] == null ? undefined : json['createdBy'],
        'createdOn': json['createdOn'] == null ? undefined : (parseApiDate(json['createdOn'])),
        'modifiedBy': json['modifiedBy'] == null ? undefined : json['modifiedBy'],
        'modifiedOn': json['modifiedOn'] == null ? undefined : (parseApiDate(json['modifiedOn'])),
        'isDelete': json['isDelete'] == null ? undefined : json['isDelete'],
        'tblTenantId': json['tblTenantId'] == null ? undefined : json['tblTenantId'],
        'contractTypeLookUpId': json['contractTypeLookUpId'] == null ? undefined : json['contractTypeLookUpId'],
        'useCase': json['useCase'] == null ? undefined : json['useCase'],
        'contractTypeLookUpName': json['contractTypeLookUpName'] == null ? undefined : json['contractTypeLookUpName'],
        'createdByName': json['createdByName'] == null ? undefined : json['createdByName'],
        'modifiedByName': json['modifiedByName'] == null ? undefined : json['modifiedByName'],
        'status': json['status'] == null ? undefined : StaffStatusFromJSON(json['status']),
        'isPDF': json['isPDF'] == null ? undefined : json['isPDF'],
        'isArchived': json['isArchived'] == null ? undefined : json['isArchived'],
        'fileName': json['fileName'] == null ? undefined : json['fileName'],
        'docuSealPDFTempId': json['docuSealPDFTempId'] == null ? undefined : json['docuSealPDFTempId'],
        'tblContractDocuSealFieldId': json['tblContractDocuSealFieldId'] == null ? undefined : json['tblContractDocuSealFieldId'],
        'contractCommunicationResponses': json['contractCommunicationResponses'] == null ? undefined : ((json['contractCommunicationResponses'] as Array<any>).map(StaffContractCommunicationResponseFromJSON)),
    };
}

export function StaffContractResponseToJSON(json: any): StaffContractResponse {
    return StaffContractResponseToJSONTyped(json, false);
}

export function StaffContractResponseToJSONTyped(value?: StaffContractResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'templateName': value['templateName'],
        'employmentTypes': value['employmentTypes'] == null ? undefined : ((value['employmentTypes'] as Array<any>).map(StaffEmploymentTypeToJSON)),
        'departmentRoles': value['departmentRoles'] == null ? undefined : ((value['departmentRoles'] as Array<any>).map(StaffDepartmentRoleToJSON)),
        'tags': value['tags'],
        'tagDetails': value['tagDetails'] == null ? undefined : ((value['tagDetails'] as Array<any>).map(StaffContractTagDtoToJSON)),
        'effectiveDate': value['effectiveDate'],
        'isDocument': value['isDocument'],
        'pdfToken': value['pdfToken'],
        'areas': value['areas'] == null ? undefined : ((value['areas'] as Array<any>).map(StaffLocationDataToJSON)),
        'description': value['description'],
        'effectiveFromDate': value['effectiveFromDate'],
        'ackRequired': value['ackRequired'],
        'documentContent': value['documentContent'],
        'documentURL': value['documentURL'],
        'version': value['version'],
        'createdBy': value['createdBy'],
        'createdOn': value['createdOn'] == null ? undefined : ((value['createdOn']).toISOString()),
        'modifiedBy': value['modifiedBy'],
        'modifiedOn': value['modifiedOn'] === null ? null : ((value['modifiedOn'] as any)?.toISOString()),
        'isDelete': value['isDelete'],
        'tblTenantId': value['tblTenantId'],
        'contractTypeLookUpId': value['contractTypeLookUpId'],
        'useCase': value['useCase'],
        'contractTypeLookUpName': value['contractTypeLookUpName'],
        'createdByName': value['createdByName'],
        'modifiedByName': value['modifiedByName'],
        'status': StaffStatusToJSON(value['status']),
        'isPDF': value['isPDF'],
        'isArchived': value['isArchived'],
        'fileName': value['fileName'],
        'docuSealPDFTempId': value['docuSealPDFTempId'],
        'tblContractDocuSealFieldId': value['tblContractDocuSealFieldId'],
        'contractCommunicationResponses': value['contractCommunicationResponses'] == null ? undefined : ((value['contractCommunicationResponses'] as Array<any>).map(StaffContractCommunicationResponseToJSON)),
    };
}

