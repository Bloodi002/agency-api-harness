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
import type { TenantLogoFile } from './TenantLogoFile.js';
import {
    TenantLogoFileFromJSON,
    TenantLogoFileFromJSONTyped,
    TenantLogoFileToJSON,
    TenantLogoFileToJSONTyped,
} from './TenantLogoFile.js';
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

/**
 * Your organisation profile.
 * @export
 * @interface TenantOrganisation
 */
export interface TenantOrganisation {
    /**
     * Your organisation id.
     * @type {string}
     * @memberof TenantOrganisation
     */
    tenantId?: string;
    /**
     * Organisation name.
     * @type {string}
     * @memberof TenantOrganisation
     */
    tenantName?: string;
    /**
     * Logo reference, when set.
     * @type {string}
     * @memberof TenantOrganisation
     */
    profileImage?: string | null;
    /**
     * Organisation email address.
     * @type {string}
     * @memberof TenantOrganisation
     */
    emailAddress?: string;
    /**
     * Contact person's first name.
     * @type {string}
     * @memberof TenantOrganisation
     */
    contactPersonName?: string | null;
    /**
     * Contact person's last name.
     * @type {string}
     * @memberof TenantOrganisation
     */
    contactPersonLastName?: string | null;
    /**
     * Contact person's email address.
     * @type {string}
     * @memberof TenantOrganisation
     */
    contactPersonEmail?: string | null;
    /**
     * Contact person's mobile number.
     * @type {string}
     * @memberof TenantOrganisation
     */
    contactPersonMobile?: string | null;
    /**
     * Organisation phone number.
     * @type {string}
     * @memberof TenantOrganisation
     */
    phoneNumber?: string | null;
    /**
     * Free-text notes.
     * @type {string}
     * @memberof TenantOrganisation
     */
    notes?: string | null;
    /**
     * Address line 1.
     * @type {string}
     * @memberof TenantOrganisation
     */
    addressLine1?: string | null;
    /**
     * Address line 2.
     * @type {string}
     * @memberof TenantOrganisation
     */
    addressLine2?: string | null;
    /**
     * Suburb or city.
     * @type {string}
     * @memberof TenantOrganisation
     */
    city?: string | null;
    /**
     * Always an empty string here; read `stateDetails`.
     * @type {string}
     * @memberof TenantOrganisation
     */
    state?: string | null;
    /**
     * Always an empty string here; read `countryDetails`.
     * @type {string}
     * @memberof TenantOrganisation
     */
    country?: string | null;
    /**
     * Postcode.
     * @type {number}
     * @memberof TenantOrganisation
     */
    postalCode?: number | null;
    /**
     * Same value as `profileImage`.
     * @type {string}
     * @memberof TenantOrganisation
     */
    logo?: string | null;
    /**
     * Business account status code.
     * @type {number}
     * @memberof TenantOrganisation
     */
    businessAccountStatus?: number;
    /**
     * 1 Active · 2 Onboarding · 0 any other lifecycle state.
     * @type {number}
     * @memberof TenantOrganisation
     */
    status?: number | null;
    /**
     * Australian Business Number, 11 digits, or null when not given.
     * @type {string}
     * @memberof TenantOrganisation
     */
    abn?: string | null;
    /**
     * Industry id.
     * @type {string}
     * @memberof TenantOrganisation
     */
    industry?: string | null;
    /**
     * Legacy tag string, when set.
     * @type {string}
     * @memberof TenantOrganisation
     */
    addTagAndColors?: string | null;
    /**
     * Not filled by this call; always null.
     * @type {number}
     * @memberof TenantOrganisation
     */
    locationCount?: number | null;
    /**
     * Who created the organisation.
     * @type {string}
     * @memberof TenantOrganisation
     */
    createdBy?: string;
    /**
     * Not filled by this call; always null.
     * @type {string}
     * @memberof TenantOrganisation
     */
    createdByName?: string | null;
    /**
     * When the organisation was created.
     * @type {Date}
     * @memberof TenantOrganisation
     */
    createdDate?: Date;
    /**
     * Who last changed it.
     * @type {string}
     * @memberof TenantOrganisation
     */
    modifiedBy?: string | null;
    /**
     * Not filled by this call; always null.
     * @type {string}
     * @memberof TenantOrganisation
     */
    modifiedByName?: string | null;
    /**
     * When it was last changed.
     * @type {Date}
     * @memberof TenantOrganisation
     */
    modifiedDate?: Date | null;
    /**
     * True when the organisation has been removed.
     * @type {boolean}
     * @memberof TenantOrganisation
     */
    isDeleted?: boolean;
    /**
     * 
     * @type {TenantLogoFile}
     * @memberof TenantOrganisation
     */
    file?: TenantLogoFile;
    /**
     * 
     * @type {TenantCountryDetails}
     * @memberof TenantOrganisation
     */
    countryDetails?: TenantCountryDetails | null;
    /**
     * 
     * @type {TenantStateDetails}
     * @memberof TenantOrganisation
     */
    stateDetails?: TenantStateDetails | null;
}

/**
 * Check if a given object implements the TenantOrganisation interface.
 */
export function instanceOfTenantOrganisation(value: object): value is TenantOrganisation {
    return true;
}

export function TenantOrganisationFromJSON(json: any): TenantOrganisation {
    return TenantOrganisationFromJSONTyped(json, false);
}

export function TenantOrganisationFromJSONTyped(json: any, ignoreDiscriminator: boolean): TenantOrganisation {
    if (json == null) {
        return json;
    }
    return {
        
        'tenantId': json['tenantId'] == null ? undefined : json['tenantId'],
        'tenantName': json['tenantName'] == null ? undefined : json['tenantName'],
        'profileImage': json['profileImage'] == null ? undefined : json['profileImage'],
        'emailAddress': json['emailAddress'] == null ? undefined : json['emailAddress'],
        'contactPersonName': json['contactPersonName'] == null ? undefined : json['contactPersonName'],
        'contactPersonLastName': json['contactPersonLastName'] == null ? undefined : json['contactPersonLastName'],
        'contactPersonEmail': json['contactPersonEmail'] == null ? undefined : json['contactPersonEmail'],
        'contactPersonMobile': json['contactPersonMobile'] == null ? undefined : json['contactPersonMobile'],
        'phoneNumber': json['phoneNumber'] == null ? undefined : json['phoneNumber'],
        'notes': json['notes'] == null ? undefined : json['notes'],
        'addressLine1': json['addressLine1'] == null ? undefined : json['addressLine1'],
        'addressLine2': json['addressLine2'] == null ? undefined : json['addressLine2'],
        'city': json['city'] == null ? undefined : json['city'],
        'state': json['state'] == null ? undefined : json['state'],
        'country': json['country'] == null ? undefined : json['country'],
        'postalCode': json['postalCode'] == null ? undefined : json['postalCode'],
        'logo': json['logo'] == null ? undefined : json['logo'],
        'businessAccountStatus': json['businessAccountStatus'] == null ? undefined : json['businessAccountStatus'],
        'status': json['status'] == null ? undefined : json['status'],
        'abn': json['abn'] == null ? undefined : json['abn'],
        'industry': json['industry'] == null ? undefined : json['industry'],
        'addTagAndColors': json['addTagAndColors'] == null ? undefined : json['addTagAndColors'],
        'locationCount': json['locationCount'] == null ? undefined : json['locationCount'],
        'createdBy': json['createdBy'] == null ? undefined : json['createdBy'],
        'createdByName': json['createdByName'] == null ? undefined : json['createdByName'],
        'createdDate': json['createdDate'] == null ? undefined : (parseApiDate(json['createdDate'])),
        'modifiedBy': json['modifiedBy'] == null ? undefined : json['modifiedBy'],
        'modifiedByName': json['modifiedByName'] == null ? undefined : json['modifiedByName'],
        'modifiedDate': json['modifiedDate'] == null ? undefined : (parseApiDate(json['modifiedDate'])),
        'isDeleted': json['isDeleted'] == null ? undefined : json['isDeleted'],
        'file': json['file'] == null ? undefined : TenantLogoFileFromJSON(json['file']),
        'countryDetails': json['countryDetails'] == null ? undefined : TenantCountryDetailsFromJSON(json['countryDetails']),
        'stateDetails': json['stateDetails'] == null ? undefined : TenantStateDetailsFromJSON(json['stateDetails']),
    };
}

export function TenantOrganisationToJSON(json: any): TenantOrganisation {
    return TenantOrganisationToJSONTyped(json, false);
}

export function TenantOrganisationToJSONTyped(value?: TenantOrganisation | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'tenantId': value['tenantId'],
        'tenantName': value['tenantName'],
        'profileImage': value['profileImage'],
        'emailAddress': value['emailAddress'],
        'contactPersonName': value['contactPersonName'],
        'contactPersonLastName': value['contactPersonLastName'],
        'contactPersonEmail': value['contactPersonEmail'],
        'contactPersonMobile': value['contactPersonMobile'],
        'phoneNumber': value['phoneNumber'],
        'notes': value['notes'],
        'addressLine1': value['addressLine1'],
        'addressLine2': value['addressLine2'],
        'city': value['city'],
        'state': value['state'],
        'country': value['country'],
        'postalCode': value['postalCode'],
        'logo': value['logo'],
        'businessAccountStatus': value['businessAccountStatus'],
        'status': value['status'],
        'abn': value['abn'],
        'industry': value['industry'],
        'addTagAndColors': value['addTagAndColors'],
        'locationCount': value['locationCount'],
        'createdBy': value['createdBy'],
        'createdByName': value['createdByName'],
        'createdDate': value['createdDate'] == null ? undefined : ((value['createdDate']).toISOString()),
        'modifiedBy': value['modifiedBy'],
        'modifiedByName': value['modifiedByName'],
        'modifiedDate': value['modifiedDate'] === null ? null : ((value['modifiedDate'] as any)?.toISOString()),
        'isDeleted': value['isDeleted'],
        'file': TenantLogoFileToJSON(value['file']),
        'countryDetails': TenantCountryDetailsToJSON(value['countryDetails']),
        'stateDetails': TenantStateDetailsToJSON(value['stateDetails']),
    };
}

