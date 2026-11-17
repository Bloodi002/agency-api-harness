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
/**
 * 
 * @export
 * @interface TenantV2SaveLocationRequest
 */
export interface TenantV2SaveLocationRequest {
    /**
     * The location to update. Empty or left out to create one.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    tenantLocationId?: string;
    /**
     * Your organisation id.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    tenantId: string;
    /**
     * Location name, up to 100 characters. Unique within your organisation.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    locationName: string;
    /**
     * Short code, up to 100 characters.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    shortCode?: string | null;
    /**
     * Address line 1, up to 200 characters.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    addressLine1: string;
    /**
     * Address line 2, up to 200 characters.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    addressLine2?: string | null;
    /**
     * Suburb or city, up to 100 characters.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    city: string;
    /**
     * State, up to 100 characters.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    state: string;
    /**
     * Country, up to 100 characters.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    country?: string | null;
    /**
     * Postcode, 1 or more.
     * @type {number}
     * @memberof TenantV2SaveLocationRequest
     */
    postalCode: number;
    /**
     * Country id.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    tblCountryId?: string | null;
    /**
     * State id.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    tblStateId?: string | null;
    /**
     * Latitude, up to 50 characters. Spelt `lattitude`.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    lattitude?: string | null;
    /**
     * Longitude, up to 50 characters.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    longitude?: string | null;
    /**
     * Maximum capacity.
     * @type {number}
     * @memberof TenantV2SaveLocationRequest
     */
    locationCapacity?: number | null;
    /**
     * 0 Inactive · 1 Active. Applied on create only; left out it is 0.
     * @type {number}
     * @memberof TenantV2SaveLocationRequest
     */
    status?: number | null;
    /**
     * Industry id.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    industry?: string | null;
    /**
     * Contact person's first name.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    contactPersonFirstName?: string | null;
    /**
     * Contact person's last name.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    contactPersonLastName?: string | null;
    /**
     * Contact person's email address.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    contactPersonEmail?: string | null;
    /**
     * Contact person's phone number.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    contactPersonPhone?: string | null;
    /**
     * Make this the default location. Clears the flag on your other locations.
     * @type {boolean}
     * @memberof TenantV2SaveLocationRequest
     */
    isDefault?: boolean;
    /**
     * Location group to put it in.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    locationGroupId?: string | null;
    /**
     * Tags to set on the location. Left out keeps the current tags.
     * @type {Array<string>}
     * @memberof TenantV2SaveLocationRequest
     */
    tagIds?: Array<string> | null;
    /**
     * Legacy tag string. Applied on create only.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    tagsWithColor?: string | null;
    /**
     * Applicable awards, as text.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    awardsApplicable?: string | null;
    /**
     * Staff ratios, as text.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    staffRatios?: string | null;
    /**
     * Required qualifications, as text.
     * @type {string}
     * @memberof TenantV2SaveLocationRequest
     */
    qualifications?: string | null;
}

/**
 * Check if a given object implements the TenantV2SaveLocationRequest interface.
 */
export function instanceOfTenantV2SaveLocationRequest(value: object): value is TenantV2SaveLocationRequest {
    if (!('tenantId' in value) || value['tenantId'] === undefined) return false;
    if (!('locationName' in value) || value['locationName'] === undefined) return false;
    if (!('addressLine1' in value) || value['addressLine1'] === undefined) return false;
    if (!('city' in value) || value['city'] === undefined) return false;
    if (!('state' in value) || value['state'] === undefined) return false;
    if (!('postalCode' in value) || value['postalCode'] === undefined) return false;
    return true;
}

export function TenantV2SaveLocationRequestFromJSON(json: any): TenantV2SaveLocationRequest {
    return TenantV2SaveLocationRequestFromJSONTyped(json, false);
}

export function TenantV2SaveLocationRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): TenantV2SaveLocationRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'tenantLocationId': json['tenantLocationId'] == null ? undefined : json['tenantLocationId'],
        'tenantId': json['tenantId'],
        'locationName': json['locationName'],
        'shortCode': json['shortCode'] == null ? undefined : json['shortCode'],
        'addressLine1': json['addressLine1'],
        'addressLine2': json['addressLine2'] == null ? undefined : json['addressLine2'],
        'city': json['city'],
        'state': json['state'],
        'country': json['country'] == null ? undefined : json['country'],
        'postalCode': json['postalCode'],
        'tblCountryId': json['tblCountryId'] == null ? undefined : json['tblCountryId'],
        'tblStateId': json['tblStateId'] == null ? undefined : json['tblStateId'],
        'lattitude': json['lattitude'] == null ? undefined : json['lattitude'],
        'longitude': json['longitude'] == null ? undefined : json['longitude'],
        'locationCapacity': json['locationCapacity'] == null ? undefined : json['locationCapacity'],
        'status': json['status'] == null ? undefined : json['status'],
        'industry': json['industry'] == null ? undefined : json['industry'],
        'contactPersonFirstName': json['contactPersonFirstName'] == null ? undefined : json['contactPersonFirstName'],
        'contactPersonLastName': json['contactPersonLastName'] == null ? undefined : json['contactPersonLastName'],
        'contactPersonEmail': json['contactPersonEmail'] == null ? undefined : json['contactPersonEmail'],
        'contactPersonPhone': json['contactPersonPhone'] == null ? undefined : json['contactPersonPhone'],
        'isDefault': json['isDefault'] == null ? undefined : json['isDefault'],
        'locationGroupId': json['locationGroupId'] == null ? undefined : json['locationGroupId'],
        'tagIds': json['tagIds'] == null ? undefined : json['tagIds'],
        'tagsWithColor': json['tagsWithColor'] == null ? undefined : json['tagsWithColor'],
        'awardsApplicable': json['awardsApplicable'] == null ? undefined : json['awardsApplicable'],
        'staffRatios': json['staffRatios'] == null ? undefined : json['staffRatios'],
        'qualifications': json['qualifications'] == null ? undefined : json['qualifications'],
    };
}

export function TenantV2SaveLocationRequestToJSON(json: any): TenantV2SaveLocationRequest {
    return TenantV2SaveLocationRequestToJSONTyped(json, false);
}

export function TenantV2SaveLocationRequestToJSONTyped(value?: TenantV2SaveLocationRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'tenantLocationId': value['tenantLocationId'],
        'tenantId': value['tenantId'],
        'locationName': value['locationName'],
        'shortCode': value['shortCode'],
        'addressLine1': value['addressLine1'],
        'addressLine2': value['addressLine2'],
        'city': value['city'],
        'state': value['state'],
        'country': value['country'],
        'postalCode': value['postalCode'],
        'tblCountryId': value['tblCountryId'],
        'tblStateId': value['tblStateId'],
        'lattitude': value['lattitude'],
        'longitude': value['longitude'],
        'locationCapacity': value['locationCapacity'],
        'status': value['status'],
        'industry': value['industry'],
        'contactPersonFirstName': value['contactPersonFirstName'],
        'contactPersonLastName': value['contactPersonLastName'],
        'contactPersonEmail': value['contactPersonEmail'],
        'contactPersonPhone': value['contactPersonPhone'],
        'isDefault': value['isDefault'],
        'locationGroupId': value['locationGroupId'],
        'tagIds': value['tagIds'],
        'tagsWithColor': value['tagsWithColor'],
        'awardsApplicable': value['awardsApplicable'],
        'staffRatios': value['staffRatios'],
        'qualifications': value['qualifications'],
    };
}

