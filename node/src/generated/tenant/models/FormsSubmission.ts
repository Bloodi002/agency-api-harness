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
import type { FormsAssignmentRule } from './FormsAssignmentRule.js';
import {
    FormsAssignmentRuleFromJSON,
    FormsAssignmentRuleFromJSONTyped,
    FormsAssignmentRuleToJSON,
    FormsAssignmentRuleToJSONTyped,
} from './FormsAssignmentRule.js';
import type { FormsSubmissionTemplate } from './FormsSubmissionTemplate.js';
import {
    FormsSubmissionTemplateFromJSON,
    FormsSubmissionTemplateFromJSONTyped,
    FormsSubmissionTemplateToJSON,
    FormsSubmissionTemplateToJSONTyped,
} from './FormsSubmissionTemplate.js';

/**
 * One fill-out of a template. A Draft addressed to someone is that person's outstanding form.
 * @export
 * @interface FormsSubmission
 */
export interface FormsSubmission {
    /**
     * Submission id.
     * @type {string}
     * @memberof FormsSubmission
     */
    id?: string;
    /**
     * Your organisation.
     * @type {string}
     * @memberof FormsSubmission
     */
    tenantId?: string;
    /**
     * The template.
     * @type {string}
     * @memberof FormsSubmission
     */
    formTemplateId?: string;
    /**
     * The template as stored; null if it could not be loaded.
     * @type {FormsSubmissionTemplate}
     * @memberof FormsSubmission
     */
    formTemplate?: FormsSubmissionTemplate | null;
    /**
     * The template version this submission was started against.
     * @type {number}
     * @memberof FormsSubmission
     */
    templateVersion?: number;
    /**
     * The assignment rule that created it, if any.
     * @type {string}
     * @memberof FormsSubmission
     */
    formAssignmentId?: string | null;
    /**
     * The assignment rule, filled in on the single-submission read and the submit response; null in the list.
     * @type {FormsAssignmentRule}
     * @memberof FormsSubmission
     */
    formAssignment?: FormsAssignmentRule | null;
    /**
     * 0 Draft · 1 Submitted · 2 PendingReview · 3 Approved · 4 Rejected.
     * @type {number}
     * @memberof FormsSubmission
     */
    status?: number;
    /**
     * The answers as a JSON object string keyed by the template's field ids. Needs `forms.responses.read`; null without it.
     * @type {string}
     * @memberof FormsSubmission
     */
    responsesJson?: string | null;
    /**
     * Score, when one was recorded.
     * @type {number}
     * @memberof FormsSubmission
     */
    score?: number | null;
    /**
     * 0 Pass · 1 Fail · 2 NotApplicable.
     * @type {number}
     * @memberof FormsSubmission
     */
    passFail?: number | null;
    /**
     * The staff member (or user) the form is addressed to.
     * @type {string}
     * @memberof FormsSubmission
     */
    assignedTo?: string | null;
    /**
     * When the form is due (UTC). A calendar date with no time zone; not an instant.
     * @type {string}
     * @memberof FormsSubmission
     */
    dueDate?: string | null;
    /**
     * Who submitted it; 00000000-0000-0000-0000-000000000000 when your integration did.
     * @type {string}
     * @memberof FormsSubmission
     */
    submittedBy?: string | null;
    /**
     * When it was last submitted (UTC).
     * @type {Date}
     * @memberof FormsSubmission
     */
    submittedDate?: Date | null;
    /**
     * Who reviewed it.
     * @type {string}
     * @memberof FormsSubmission
     */
    reviewedBy?: string | null;
    /**
     * When it was reviewed (UTC).
     * @type {Date}
     * @memberof FormsSubmission
     */
    reviewedDate?: Date | null;
    /**
     * The reviewer's comments. Needs `forms.responses.read`; null without it.
     * @type {string}
     * @memberof FormsSubmission
     */
    reviewComments?: string | null;
    /**
     * Latitude captured with the submission.
     * @type {number}
     * @memberof FormsSubmission
     */
    locationLatitude?: number | null;
    /**
     * Longitude captured with the submission.
     * @type {number}
     * @memberof FormsSubmission
     */
    locationLongitude?: number | null;
    /**
     * Address captured with the submission.
     * @type {string}
     * @memberof FormsSubmission
     */
    locationAddress?: string | null;
    /**
     * JSON array string [{fieldId, fileName, fileUrl, fileType}].
     * @type {string}
     * @memberof FormsSubmission
     */
    attachmentsJson?: string | null;
    /**
     * Instructions for the person filling it out (HTML).
     * @type {string}
     * @memberof FormsSubmission
     */
    instructions?: string | null;
    /**
     * When the submission was created (UTC).
     * @type {Date}
     * @memberof FormsSubmission
     */
    createdDate?: Date;
    /**
     * When it was last changed (UTC).
     * @type {Date}
     * @memberof FormsSubmission
     */
    modifiedDate?: Date | null;
}

/**
 * Check if a given object implements the FormsSubmission interface.
 */
export function instanceOfFormsSubmission(value: object): value is FormsSubmission {
    return true;
}

export function FormsSubmissionFromJSON(json: any): FormsSubmission {
    return FormsSubmissionFromJSONTyped(json, false);
}

export function FormsSubmissionFromJSONTyped(json: any, ignoreDiscriminator: boolean): FormsSubmission {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'tenantId': json['tenantId'] == null ? undefined : json['tenantId'],
        'formTemplateId': json['formTemplateId'] == null ? undefined : json['formTemplateId'],
        'formTemplate': json['formTemplate'] == null ? undefined : FormsSubmissionTemplateFromJSON(json['formTemplate']),
        'templateVersion': json['templateVersion'] == null ? undefined : json['templateVersion'],
        'formAssignmentId': json['formAssignmentId'] == null ? undefined : json['formAssignmentId'],
        'formAssignment': json['formAssignment'] == null ? undefined : FormsAssignmentRuleFromJSON(json['formAssignment']),
        'status': json['status'] == null ? undefined : json['status'],
        'responsesJson': json['responsesJson'] == null ? undefined : json['responsesJson'],
        'score': json['score'] == null ? undefined : json['score'],
        'passFail': json['passFail'] == null ? undefined : json['passFail'],
        'assignedTo': json['assignedTo'] == null ? undefined : json['assignedTo'],
        'dueDate': json['dueDate'] == null ? undefined : json['dueDate'],
        'submittedBy': json['submittedBy'] == null ? undefined : json['submittedBy'],
        'submittedDate': json['submittedDate'] == null ? undefined : (parseApiDate(json['submittedDate'])),
        'reviewedBy': json['reviewedBy'] == null ? undefined : json['reviewedBy'],
        'reviewedDate': json['reviewedDate'] == null ? undefined : (parseApiDate(json['reviewedDate'])),
        'reviewComments': json['reviewComments'] == null ? undefined : json['reviewComments'],
        'locationLatitude': json['locationLatitude'] == null ? undefined : json['locationLatitude'],
        'locationLongitude': json['locationLongitude'] == null ? undefined : json['locationLongitude'],
        'locationAddress': json['locationAddress'] == null ? undefined : json['locationAddress'],
        'attachmentsJson': json['attachmentsJson'] == null ? undefined : json['attachmentsJson'],
        'instructions': json['instructions'] == null ? undefined : json['instructions'],
        'createdDate': json['createdDate'] == null ? undefined : (parseApiDate(json['createdDate'])),
        'modifiedDate': json['modifiedDate'] == null ? undefined : (parseApiDate(json['modifiedDate'])),
    };
}

export function FormsSubmissionToJSON(json: any): FormsSubmission {
    return FormsSubmissionToJSONTyped(json, false);
}

export function FormsSubmissionToJSONTyped(value?: FormsSubmission | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'tenantId': value['tenantId'],
        'formTemplateId': value['formTemplateId'],
        'formTemplate': FormsSubmissionTemplateToJSON(value['formTemplate']),
        'templateVersion': value['templateVersion'],
        'formAssignmentId': value['formAssignmentId'],
        'formAssignment': FormsAssignmentRuleToJSON(value['formAssignment']),
        'status': value['status'],
        'responsesJson': value['responsesJson'],
        'score': value['score'],
        'passFail': value['passFail'],
        'assignedTo': value['assignedTo'],
        'dueDate': value['dueDate'],
        'submittedBy': value['submittedBy'],
        'submittedDate': value['submittedDate'] === null ? null : ((value['submittedDate'] as any)?.toISOString()),
        'reviewedBy': value['reviewedBy'],
        'reviewedDate': value['reviewedDate'] === null ? null : ((value['reviewedDate'] as any)?.toISOString()),
        'reviewComments': value['reviewComments'],
        'locationLatitude': value['locationLatitude'],
        'locationLongitude': value['locationLongitude'],
        'locationAddress': value['locationAddress'],
        'attachmentsJson': value['attachmentsJson'],
        'instructions': value['instructions'],
        'createdDate': value['createdDate'] == null ? undefined : ((value['createdDate']).toISOString()),
        'modifiedDate': value['modifiedDate'] === null ? null : ((value['modifiedDate'] as any)?.toISOString()),
    };
}

