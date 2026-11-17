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
import type { TenantTagRef } from './TenantTagRef.js';
import {
    TenantTagRefFromJSON,
    TenantTagRefFromJSONTyped,
    TenantTagRefToJSON,
    TenantTagRefToJSONTyped,
} from './TenantTagRef.js';
import type { TenantCountryDetails } from './TenantCountryDetails.js';
import {
    TenantCountryDetailsFromJSON,
    TenantCountryDetailsFromJSONTyped,
    TenantCountryDetailsToJSON,
    TenantCountryDetailsToJSONTyped,
} from './TenantCountryDetails.js';
import type { TenantStateDetails } from './TenantStateDetails.js';
import {
    TenantStateDetailsFromJSON,
    TenantStateDetailsFromJSONTyped,
    TenantStateDetailsToJSON,
    TenantStateDetailsToJSONTyped,
} from './TenantStateDetails.js';
import type { TenantQualificationRequirement } from './TenantQualificationRequirement.js';
import {
    TenantQualificationRequirementFromJSON,
    TenantQualificationRequirementFromJSONTyped,
    TenantQualificationRequirementToJSON,
    TenantQualificationRequirementToJSONTyped,
} from './TenantQualificationRequirement.js';

/**
 * One location.
 * @export
 * @interface TenantLocation
 */
export interface TenantLocation {
    /**
     * Location id.
     * @type {string}
     * @memberof TenantLocation
     */
    tenantLocationId?: string;
    /**
     * Your organisation id.
     * @type {string}
     * @memberof TenantLocation
     */
    tenantId?: string;
    /**
     * Location name.
     * @type {string}
     * @memberof TenantLocation
     */
    locationName?: string;
    /**
     * Short code shown on rosters.
     * @type {string}
     * @memberof TenantLocation
     */
    shortCode?: string | null;
    /**
     * Latitude, as text. Spelt `lattitude`.
     * @type {string}
     * @memberof TenantLocation
     */
    lattitude?: string | null;
    /**
     * Longitude, as text.
     * @type {string}
     * @memberof TenantLocation
     */
    longitude?: string | null;
    /**
     * Address line 1.
     * @type {string}
     * @memberof TenantLocation
     */
    addressLine1?: string | null;
    /**
     * Address line 2.
     * @type {string}
     * @memberof TenantLocation
     */
    addressLine2?: string | null;
    /**
     * Suburb or city.
     * @type {string}
     * @memberof TenantLocation
     */
    city?: string | null;
    /**
     * State as stored (an empty string in the full list; read `stateDetails`).
     * @type {string}
     * @memberof TenantLocation
     */
    state?: string | null;
    /**
     * Country as stored (an empty string in the full list; read `countryDetails`).
     * @type {string}
     * @memberof TenantLocation
     */
    country?: string | null;
    /**
     * Postcode.
     * @type {number}
     * @memberof TenantLocation
     */
    postalCode?: number | null;
    /**
     * Maximum capacity.
     * @type {number}
     * @memberof TenantLocation
     */
    locationCapacity?: number | null;
    /**
     * 0 Inactive · 1 Active.
     * @type {number}
     * @memberof TenantLocation
     */
    status?: number | null;
    /**
     * Industry id.
     * @type {string}
     * @memberof TenantLocation
     */
    industry?: string | null;
    /**
     * Contact person's first name.
     * @type {string}
     * @memberof TenantLocation
     */
    contactPersonFirstName?: string | null;
    /**
     * Contact person's last name.
     * @type {string}
     * @memberof TenantLocation
     */
    contactPersonLastName?: string | null;
    /**
     * Contact person's email address.
     * @type {string}
     * @memberof TenantLocation
     */
    contactPersonEmail?: string | null;
    /**
     * Contact person's phone number.
     * @type {string}
     * @memberof TenantLocation
     */
    contactPersonPhone?: string | null;
    /**
     * True when the location has been deleted.
     * @type {boolean}
     * @memberof TenantLocation
     */
    isDeleted?: boolean;
    /**
     * True when the location has been archived.
     * @type {boolean}
     * @memberof TenantLocation
     */
    isArchived?: boolean;
    /**
     * True for the organisation's default location.
     * @type {boolean}
     * @memberof TenantLocation
     */
    isDefault?: boolean;
    /**
     * Location group the location belongs to.
     * @type {string}
     * @memberof TenantLocation
     */
    locationGroupId?: string | null;
    /**
     * Login account linked to the contact person, when there is one.
     * @type {string}
     * @memberof TenantLocation
     */
    userId?: string | null;
    /**
     * Distinct staff assigned to an area of the location (list only).
     * @type {number}
     * @memberof TenantLocation
     */
    staffCount?: number | null;
    /**
     * Not filled by these calls; null.
     * @type {string}
     * @memberof TenantLocation
     */
    areaNames?: string | null;
    /**
     * Legacy tag string, when set.
     * @type {string}
     * @memberof TenantLocation
     */
    tagsWithColor?: string | null;
    /**
     * Tags on the location.
     * @type {Array<TenantTagRef>}
     * @memberof TenantLocation
     */
    tags?: Array<TenantTagRef>;
    /**
     * Ids of the tags on the location.
     * @type {Array<string>}
     * @memberof TenantLocation
     */
    tagIds?: Array<string> | null;
    /**
     * Applicable awards, as stored text.
     * @type {string}
     * @memberof TenantLocation
     */
    awardsApplicable?: string | null;
    /**
     * Staff ratios, as stored text.
     * @type {string}
     * @memberof TenantLocation
     */
    staffRatios?: string | null;
    /**
     * Not filled by these calls; null.
     * @type {string}
     * @memberof TenantLocation
     */
    qualificationsRaw?: string | null;
    /**
     * Qualifications the location requires.
     * @type {Array<TenantQualificationRequirement>}
     * @memberof TenantLocation
     */
    qualifications?: Array<TenantQualificationRequirement>;
    /**
     * Who created the location.
     * @type {string}
     * @memberof TenantLocation
     */
    createdBy?: string;
    /**
     * Not filled by these calls; null.
     * @type {string}
     * @memberof TenantLocation
     */
    createdByName?: string | null;
    /**
     * When the location was created.
     * @type {Date}
     * @memberof TenantLocation
     */
    createdDate?: Date;
    /**
     * Who last changed it.
     * @type {string}
     * @memberof TenantLocation
     */
    modifiedBy?: string | null;
    /**
     * Not filled by these calls; null.
     * @type {string}
     * @memberof TenantLocation
     */
    modifiedByName?: string | null;
    /**
     * When it was last changed.
     * @type {Date}
     * @memberof TenantLocation
     */
    modifiedDate?: Date | null;
    /**
     * 
     * @type {TenantCountryDetails}
     * @memberof TenantLocation
     */
    countryDetails?: TenantCountryDetails | null;
    /**
     * 
     * @type {TenantStateDetails}
     * @memberof TenantLocation
     */
    stateDetails?: TenantStateDetails | null;
}

/**
 * Check if a given object implements the TenantLocation interface.
 */
export function instanceOfTenantLocation(value: object): value is TenantLocation {
    return true;
}

export function TenantLocationFromJSON(json: any): TenantLocation {
    return TenantLocationFromJSONTyped(json, false);
}

export function TenantLocationFromJSONTyped(json: any, ignoreDiscriminator: boolean): TenantLocation {
    if (json == null) {
        return json;
    }
    return {
        
        'tenantLocationId': json['tenantLocationId'] == null ? undefined : json['tenantLocationId'],
        'tenantId': json['tenantId'] == null ? undefined : json['tenantId'],
        'locationName': json['locationName'] == null ? undefined : json['locationName'],
        'shortCode': json['shortCode'] == null ? undefined : json['shortCode'],
        'lattitude': json['lattitude'] == null ? undefined : json['lattitude'],
        'longitude': json['longitude'] == null ? undefined : json['longitude'],
        'addressLine1': json['addressLine1'] == null ? undefined : json['addressLine1'],
        'addressLine2': json['addressLine2'] == null ? undefined : json['addressLine2'],
        'city': json['city'] == null ? undefined : json['city'],
        'state': json['state'] == null ? undefined : json['state'],
        'country': json['country'] == null ? undefined : json['country'],
        'postalCode': json['postalCode'] == null ? undefined : json['postalCode'],
        'locationCapacity': json['locationCapacity'] == null ? undefined : json['locationCapacity'],
        'status': json['status'] == null ? undefined : json['status'],
        'industry': json['industry'] == null ? undefined : json['industry'],
        'contactPersonFirstName': json['contactPersonFirstName'] == null ? undefined : json['contactPersonFirstName'],
        'contactPersonLastName': json['contactPersonLastName'] == null ? undefined : json['contactPersonLastName'],
        'contactPersonEmail': json['contactPersonEmail'] == null ? undefined : json['contactPersonEmail'],
        'contactPersonPhone': json['contactPersonPhone'] == null ? undefined : json['contactPersonPhone'],
        'isDeleted': json['isDeleted'] == null ? undefined : json['isDeleted'],
        'isArchived': json['isArchived'] == null ? undefined : json['isArchived'],
        'isDefault': json['isDefault'] == null ? undefined : json['isDefault'],
        'locationGroupId': json['locationGroupId'] == null ? undefined : json['locationGroupId'],
        'userId': json['userId'] == null ? undefined : json['userId'],
        'staffCount': json['staffCount'] == null ? undefined : json['staffCount'],
        'areaNames': json['areaNames'] == null ? undefined : json['areaNames'],
        'tagsWithColor': json['tagsWithColor'] == null ? undefined : json['tagsWithColor'],
        'tags': json['tags'] == null ? undefined : ((json['tags'] as Array<any>).map(TenantTagRefFromJSON)),
        'tagIds': json['tagIds'] == null ? undefined : json['tagIds'],
        'awardsApplicable': json['awardsApplicable'] == null ? undefined : json['awardsApplicable'],
        'staffRatios': json['staffRatios'] == null ? undefined : json['staffRatios'],
        'qualificationsRaw': json['qualificationsRaw'] == null ? undefined : json['qualificationsRaw'],
        'qualifications': json['qualifications'] == null ? undefined : ((json['qualifications'] as Array<any>).map(TenantQualificationRequirementFromJSON)),
        'createdBy': json['createdBy'] == null ? undefined : json['createdBy'],
        'createdByName': json['createdByName'] == null ? undefined : json['createdByName'],
        'createdDate': json['createdDate'] == null ? undefined : (parseApiDate(json['createdDate'])),
        'modifiedBy': json['modifiedBy'] == null ? undefined : json['modifiedBy'],
        'modifiedByName': json['modifiedByName'] == null ? undefined : json['modifiedByName'],
        'modifiedDate': json['modifiedDate'] == null ? undefined : (parseApiDate(json['modifiedDate'])),
        'countryDetails': json['countryDetails'] == null ? undefined : TenantCountryDetailsFromJSON(json['countryDetails']),
        'stateDetails': json['stateDetails'] == null ? undefined : TenantStateDetailsFromJSON(json['stateDetails']),
    };
}

export function TenantLocationToJSON(json: any): TenantLocation {
    return TenantLocationToJSONTyped(json, false);
}

export function TenantLocationToJSONTyped(value?: TenantLocation | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'tenantLocationId': value['tenantLocationId'],
        'tenantId': value['tenantId'],
        'locationName': value['locationName'],
        'shortCode': value['shortCode'],
        'lattitude': value['lattitude'],
        'longitude': value['longitude'],
        'addressLine1': value['addressLine1'],
        'addressLine2': value['addressLine2'],
        'city': value['city'],
        'state': value['state'],
        'country': value['country'],
        'postalCode': value['postalCode'],
        'locationCapacity': value['locationCapacity'],
        'status': value['status'],
        'industry': value['industry'],
        'contactPersonFirstName': value['contactPersonFirstName'],
        'contactPersonLastName': value['contactPersonLastName'],
        'contactPersonEmail': value['contactPersonEmail'],
        'contactPersonPhone': value['contactPersonPhone'],
        'isDeleted': value['isDeleted'],
        'isArchived': value['isArchived'],
        'isDefault': value['isDefault'],
        'locationGroupId': value['locationGroupId'],
        'userId': value['userId'],
        'staffCount': value['staffCount'],
        'areaNames': value['areaNames'],
        'tagsWithColor': value['tagsWithColor'],
        'tags': value['tags'] == null ? undefined : ((value['tags'] as Array<any>).map(TenantTagRefToJSON)),
        'tagIds': value['tagIds'],
        'awardsApplicable': value['awardsApplicable'],
        'staffRatios': value['staffRatios'],
        'qualificationsRaw': value['qualificationsRaw'],
        'qualifications': value['qualifications'] == null ? undefined : ((value['qualifications'] as Array<any>).map(TenantQualificationRequirementToJSON)),
        'createdBy': value['createdBy'],
        'createdByName': value['createdByName'],
        'createdDate': value['createdDate'] == null ? undefined : ((value['createdDate']).toISOString()),
        'modifiedBy': value['modifiedBy'],
        'modifiedByName': value['modifiedByName'],
        'modifiedDate': value['modifiedDate'] === null ? null : ((value['modifiedDate'] as any)?.toISOString()),
        'countryDetails': TenantCountryDetailsToJSON(value['countryDetails']),
        'stateDetails': TenantStateDetailsToJSON(value['stateDetails']),
    };
}

