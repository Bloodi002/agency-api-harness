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


import * as runtime from '../runtime.js';
import type {
  Envelope,
  FormschecklistsBulkAssignForms200Response,
  FormschecklistsBulkAssignFormsRequest,
  FormschecklistsCreateAssignmentRule201Response,
  FormschecklistsCreateAssignmentRuleRequest,
  FormschecklistsCreateTask201Response,
  FormschecklistsCreateTaskRequest,
  FormschecklistsGetFormSubmissionStats200Response,
  FormschecklistsGetFormTemplate200Response,
  FormschecklistsGetStageTaskCounts200Response,
  FormschecklistsGetTaskPipeline200Response,
  FormschecklistsGetTaskStats200Response,
  FormschecklistsGetTaskType200Response,
  FormschecklistsListAssignmentRules200Response,
  FormschecklistsListFormSubmissions200Response,
  FormschecklistsListFormTemplates200Response,
  FormschecklistsListTaskPipelines200Response,
  FormschecklistsListTaskTypes200Response,
  FormschecklistsListTasks200Response,
  FormschecklistsMoveTaskStageRequest,
  FormschecklistsStartFormSubmission201Response,
  FormschecklistsStartFormSubmissionRequest,
  FormschecklistsSubmitFormSubmissionRequest,
  ValidationProblem,
} from '../models/index.js';
import {
    EnvelopeFromJSON,
    EnvelopeToJSON,
    FormschecklistsBulkAssignForms200ResponseFromJSON,
    FormschecklistsBulkAssignForms200ResponseToJSON,
    FormschecklistsBulkAssignFormsRequestFromJSON,
    FormschecklistsBulkAssignFormsRequestToJSON,
    FormschecklistsCreateAssignmentRule201ResponseFromJSON,
    FormschecklistsCreateAssignmentRule201ResponseToJSON,
    FormschecklistsCreateAssignmentRuleRequestFromJSON,
    FormschecklistsCreateAssignmentRuleRequestToJSON,
    FormschecklistsCreateTask201ResponseFromJSON,
    FormschecklistsCreateTask201ResponseToJSON,
    FormschecklistsCreateTaskRequestFromJSON,
    FormschecklistsCreateTaskRequestToJSON,
    FormschecklistsGetFormSubmissionStats200ResponseFromJSON,
    FormschecklistsGetFormSubmissionStats200ResponseToJSON,
    FormschecklistsGetFormTemplate200ResponseFromJSON,
    FormschecklistsGetFormTemplate200ResponseToJSON,
    FormschecklistsGetStageTaskCounts200ResponseFromJSON,
    FormschecklistsGetStageTaskCounts200ResponseToJSON,
    FormschecklistsGetTaskPipeline200ResponseFromJSON,
    FormschecklistsGetTaskPipeline200ResponseToJSON,
    FormschecklistsGetTaskStats200ResponseFromJSON,
    FormschecklistsGetTaskStats200ResponseToJSON,
    FormschecklistsGetTaskType200ResponseFromJSON,
    FormschecklistsGetTaskType200ResponseToJSON,
    FormschecklistsListAssignmentRules200ResponseFromJSON,
    FormschecklistsListAssignmentRules200ResponseToJSON,
    FormschecklistsListFormSubmissions200ResponseFromJSON,
    FormschecklistsListFormSubmissions200ResponseToJSON,
    FormschecklistsListFormTemplates200ResponseFromJSON,
    FormschecklistsListFormTemplates200ResponseToJSON,
    FormschecklistsListTaskPipelines200ResponseFromJSON,
    FormschecklistsListTaskPipelines200ResponseToJSON,
    FormschecklistsListTaskTypes200ResponseFromJSON,
    FormschecklistsListTaskTypes200ResponseToJSON,
    FormschecklistsListTasks200ResponseFromJSON,
    FormschecklistsListTasks200ResponseToJSON,
    FormschecklistsMoveTaskStageRequestFromJSON,
    FormschecklistsMoveTaskStageRequestToJSON,
    FormschecklistsStartFormSubmission201ResponseFromJSON,
    FormschecklistsStartFormSubmission201ResponseToJSON,
    FormschecklistsStartFormSubmissionRequestFromJSON,
    FormschecklistsStartFormSubmissionRequestToJSON,
    FormschecklistsSubmitFormSubmissionRequestFromJSON,
    FormschecklistsSubmitFormSubmissionRequestToJSON,
    ValidationProblemFromJSON,
    ValidationProblemToJSON,
} from '../models/index.js';

export interface FormschecklistsActivateAssignmentRuleRequest {
    id: string;
}

export interface FormschecklistsBulkAssignFormsOperationRequest {
    formschecklistsBulkAssignFormsRequest: FormschecklistsBulkAssignFormsRequest;
}

export interface FormschecklistsCreateAssignmentRuleOperationRequest {
    formschecklistsCreateAssignmentRuleRequest: FormschecklistsCreateAssignmentRuleRequest;
}

export interface FormschecklistsCreateTaskOperationRequest {
    formschecklistsCreateTaskRequest: FormschecklistsCreateTaskRequest;
}

export interface FormschecklistsDeactivateAssignmentRuleRequest {
    id: string;
}

export interface FormschecklistsGetAssignmentRuleRequest {
    id: string;
}

export interface FormschecklistsGetFormSubmissionRequest {
    id: string;
}

export interface FormschecklistsGetFormSubmissionStatsRequest {
    templateId?: string;
    assignedTo?: string;
}

export interface FormschecklistsGetFormTemplateRequest {
    id: string;
}

export interface FormschecklistsGetTaskRequest {
    id: string;
}

export interface FormschecklistsGetTaskPipelineRequest {
    id: string;
}

export interface FormschecklistsGetTaskStatsRequest {
    pipelineId?: string;
    typeId?: string;
    priority?: number;
    assignedTo?: string;
    search?: string;
}

export interface FormschecklistsGetTaskTypeRequest {
    id: string;
}

export interface FormschecklistsListAssignmentRulesRequest {
    templateId?: string;
}

export interface FormschecklistsListFormSubmissionsRequest {
    templateId?: string;
    assignedTo?: string;
    status?: number;
    excludeStatus?: number;
    page?: number;
    pageSize?: number;
}

export interface FormschecklistsListFormTemplatesRequest {
    locationId?: string;
    scope?: number;
    industry?: string;
    category?: string;
}

export interface FormschecklistsListTasksRequest {
    pipelineId?: string;
    stageId?: string;
    stageKind?: number;
    overdueOnly?: boolean;
    typeId?: string;
    priority?: number;
    assignedTo?: string;
    search?: string;
    page?: number;
    pageSize?: number;
}

export interface FormschecklistsMoveTaskStageOperationRequest {
    id: string;
    formschecklistsMoveTaskStageRequest: FormschecklistsMoveTaskStageRequest;
}

export interface FormschecklistsStartFormSubmissionOperationRequest {
    formschecklistsStartFormSubmissionRequest: FormschecklistsStartFormSubmissionRequest;
}

export interface FormschecklistsSubmitFormSubmissionOperationRequest {
    id: string;
    formschecklistsSubmitFormSubmissionRequest: FormschecklistsSubmitFormSubmissionRequest;
}

/**
 * FormsTasksApi - interface
 * 
 * @export
 * @interface FormsTasksApiInterface
 */
export interface FormsTasksApiInterface {
    /**
     * Turns a deactivated assignment rule back on so it generates forms again. New rules start active. A rule that is not in your organisation answers 404. No request body.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Reactivate an assignment rule
     * @param {string} id Rule id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsActivateAssignmentRuleRaw(requestParameters: FormschecklistsActivateAssignmentRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateAssignmentRule201Response>>;

    /**
     * Turns a deactivated assignment rule back on so it generates forms again. New rules start active. A rule that is not in your organisation answers 404. No request body.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Reactivate an assignment rule
     */
    formschecklistsActivateAssignmentRule(requestParameters: FormschecklistsActivateAssignmentRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateAssignmentRule201Response>;

    /**
     * Assigns one or more templates to one or more staff members, once or on a repeating schedule, and returns how many forms were created.  - `occurrence` \"Once\" (any case) creates one Draft per template per staff member, due at `dueDate`. - Any other `occurrence` is recurring: for each template it creates an assignment rule for those staff (`assignmentName`, or the template name), scheduled by `frequency` at the time of day of `dueDate` from its date, and immediately creates only the first 7 days of forms, from that date to `endDate` if that is sooner. Later forms come from the rule on its background schedule, so `created` counts that first week, not the whole schedule.  Templates that are not Published, or are neither your organisation\'s nor a system template, are skipped without error, so check `created`. A staff id that belongs to another organisation answers 400 and nothing is created. Placeholders such as {{staff_name}} in `instructions` are filled in for each person. Each form created raises `form.assigned`.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Assign forms to staff in bulk
     * @param {FormschecklistsBulkAssignFormsRequest} formschecklistsBulkAssignFormsRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsBulkAssignFormsRaw(requestParameters: FormschecklistsBulkAssignFormsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsBulkAssignForms200Response>>;

    /**
     * Assigns one or more templates to one or more staff members, once or on a repeating schedule, and returns how many forms were created.  - `occurrence` \"Once\" (any case) creates one Draft per template per staff member, due at `dueDate`. - Any other `occurrence` is recurring: for each template it creates an assignment rule for those staff (`assignmentName`, or the template name), scheduled by `frequency` at the time of day of `dueDate` from its date, and immediately creates only the first 7 days of forms, from that date to `endDate` if that is sooner. Later forms come from the rule on its background schedule, so `created` counts that first week, not the whole schedule.  Templates that are not Published, or are neither your organisation\'s nor a system template, are skipped without error, so check `created`. A staff id that belongs to another organisation answers 400 and nothing is created. Placeholders such as {{staff_name}} in `instructions` are filled in for each person. Each form created raises `form.assigned`.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Assign forms to staff in bulk
     */
    formschecklistsBulkAssignForms(requestParameters: FormschecklistsBulkAssignFormsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsBulkAssignForms200Response>;

    /**
     * Creates an active assignment rule and answers with **201 Created**. The template must be Published and be your organisation\'s own or a system template, or the call is refused with 400.  Only Scheduled rules (`trigger` 3) targeting Individual, Role or Location currently generate forms: they are checked every 15 minutes and forms are created for occurrences from 7 days ago to 30 days ahead, each raising `form.assigned`. Team and ShiftStaff targets, and the roster and event triggers, are stored but do not generate forms yet.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Create an assignment rule
     * @param {FormschecklistsCreateAssignmentRuleRequest} formschecklistsCreateAssignmentRuleRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsCreateAssignmentRuleRaw(requestParameters: FormschecklistsCreateAssignmentRuleOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateAssignmentRule201Response>>;

    /**
     * Creates an active assignment rule and answers with **201 Created**. The template must be Published and be your organisation\'s own or a system template, or the call is refused with 400.  Only Scheduled rules (`trigger` 3) targeting Individual, Role or Location currently generate forms: they are checked every 15 minutes and forms are created for occurrences from 7 days ago to 30 days ahead, each raising `form.assigned`. Team and ShiftStaff targets, and the roster and event triggers, are stored but do not generate forms yet.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Create an assignment rule
     */
    formschecklistsCreateAssignmentRule(requestParameters: FormschecklistsCreateAssignmentRuleOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateAssignmentRule201Response>;

    /**
     * Adds a task to a board and answers with **201 Created**. Get the board, stage and type ids from \"List task boards\" and \"List task types\". The stage must belong to the board, or the call is refused with 400; a missing title, type or stage is also a 400. A task created straight into a Completed stage is stamped completed. `createdBy` is left empty (null) for a task your integration creates. Raises `task.created`.  `formSubmission` needs `forms.responses.read`; without it it is null.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Create a task
     * @param {FormschecklistsCreateTaskRequest} formschecklistsCreateTaskRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsCreateTaskRaw(requestParameters: FormschecklistsCreateTaskOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateTask201Response>>;

    /**
     * Adds a task to a board and answers with **201 Created**. Get the board, stage and type ids from \"List task boards\" and \"List task types\". The stage must belong to the board, or the call is refused with 400; a missing title, type or stage is also a 400. A task created straight into a Completed stage is stamped completed. `createdBy` is left empty (null) for a task your integration creates. Raises `task.created`.  `formSubmission` needs `forms.responses.read`; without it it is null.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Create a task
     */
    formschecklistsCreateTask(requestParameters: FormschecklistsCreateTaskOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateTask201Response>;

    /**
     * Turns an assignment rule off so it stops generating forms; forms it already generated are kept. Reactivate it to turn it back on. A rule that is not in your organisation answers 404. No request body.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Deactivate an assignment rule
     * @param {string} id Rule id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsDeactivateAssignmentRuleRaw(requestParameters: FormschecklistsDeactivateAssignmentRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateAssignmentRule201Response>>;

    /**
     * Turns an assignment rule off so it stops generating forms; forms it already generated are kept. Reactivate it to turn it back on. A rule that is not in your organisation answers 404. No request body.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Deactivate an assignment rule
     */
    formschecklistsDeactivateAssignmentRule(requestParameters: FormschecklistsDeactivateAssignmentRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateAssignmentRule201Response>;

    /**
     * Returns one assignment rule. A rule that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one assignment rule
     * @param {string} id Rule id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsGetAssignmentRuleRaw(requestParameters: FormschecklistsGetAssignmentRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateAssignmentRule201Response>>;

    /**
     * Returns one assignment rule. A rule that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one assignment rule
     */
    formschecklistsGetAssignmentRule(requestParameters: FormschecklistsGetAssignmentRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateAssignmentRule201Response>;

    /**
     * Returns one submission with its answers, its template and the assignment rule that created it (if any). A submission that does not belong to your organisation answers 404.  `responsesJson` and `reviewComments` need `forms.responses.read`; without it they are null. `score` and `passFail` stay visible.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one form submission
     * @param {string} id Submission id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsGetFormSubmissionRaw(requestParameters: FormschecklistsGetFormSubmissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsStartFormSubmission201Response>>;

    /**
     * Returns one submission with its answers, its template and the assignment rule that created it (if any). A submission that does not belong to your organisation answers 404.  `responsesJson` and `reviewComments` need `forms.responses.read`; without it they are null. `score` and `passFail` stay visible.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one form submission
     */
    formschecklistsGetFormSubmission(requestParameters: FormschecklistsGetFormSubmissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsStartFormSubmission201Response>;

    /**
     * Counts your organisation\'s form submissions by status, with how many failed an audit and the average score. Narrow it to one template or one person with `templateId` and `assignedTo`. No answers are returned.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Count form submissions by status
     * @param {string} [templateId] Only submissions of this template.
     * @param {string} [assignedTo] Only submissions assigned to this staff member (or user) id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsGetFormSubmissionStatsRaw(requestParameters: FormschecklistsGetFormSubmissionStatsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsGetFormSubmissionStats200Response>>;

    /**
     * Counts your organisation\'s form submissions by status, with how many failed an audit and the average score. Narrow it to one template or one person with `templateId` and `assignedTo`. No answers are returned.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Count form submissions by status
     */
    formschecklistsGetFormSubmissionStats(requestParameters: FormschecklistsGetFormSubmissionStatsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsGetFormSubmissionStats200Response>;

    /**
     * Returns one template with its full design (`definitionJson`), whose field ids are the keys you answer in a submission. Your organisation\'s own templates and system templates can be read; anything else answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one form template
     * @param {string} id Template id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsGetFormTemplateRaw(requestParameters: FormschecklistsGetFormTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsGetFormTemplate200Response>>;

    /**
     * Returns one template with its full design (`definitionJson`), whose field ids are the keys you answer in a submission. Your organisation\'s own templates and system templates can be read; anything else answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one form template
     */
    formschecklistsGetFormTemplate(requestParameters: FormschecklistsGetFormTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsGetFormTemplate200Response>;

    /**
     * Returns how many of your organisation\'s tasks sit in each stage, across every board, as an object keyed by stage id. Stages with no tasks are left out.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Count tasks in each stage
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsGetStageTaskCountsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsGetStageTaskCounts200Response>>;

    /**
     * Returns how many of your organisation\'s tasks sit in each stage, across every board, as an object keyed by stage id. Stages with no tasks are left out.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Count tasks in each stage
     */
    formschecklistsGetStageTaskCounts(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsGetStageTaskCounts200Response>;

    /**
     * Returns one task with its current stage. A task that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one task
     * @param {string} id Task id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsGetTaskRaw(requestParameters: FormschecklistsGetTaskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateTask201Response>>;

    /**
     * Returns one task with its current stage. A task that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one task
     */
    formschecklistsGetTask(requestParameters: FormschecklistsGetTaskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateTask201Response>;

    /**
     * Returns one task board with its stages, left to right. A board that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one task board
     * @param {string} id Board id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsGetTaskPipelineRaw(requestParameters: FormschecklistsGetTaskPipelineRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsGetTaskPipeline200Response>>;

    /**
     * Returns one task board with its stages, left to right. A board that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one task board
     */
    formschecklistsGetTaskPipeline(requestParameters: FormschecklistsGetTaskPipelineRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsGetTaskPipeline200Response>;

    /**
     * Counts your organisation\'s tasks by the kind of stage they are in, plus how many are overdue (past due and not in a Completed stage), using the same filters as \"List tasks\".  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Count tasks by stage kind
     * @param {string} [pipelineId] Only tasks on this board.
     * @param {string} [typeId] Only tasks of this type.
     * @param {number} [priority] Only this priority: 0 Low · 1 Medium · 2 High · 3 Critical.
     * @param {string} [assignedTo] Only tasks assigned to this staff member (or user) id.
     * @param {string} [search] Text to find in the title or description.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsGetTaskStatsRaw(requestParameters: FormschecklistsGetTaskStatsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsGetTaskStats200Response>>;

    /**
     * Counts your organisation\'s tasks by the kind of stage they are in, plus how many are overdue (past due and not in a Completed stage), using the same filters as \"List tasks\".  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Count tasks by stage kind
     */
    formschecklistsGetTaskStats(requestParameters: FormschecklistsGetTaskStatsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsGetTaskStats200Response>;

    /**
     * Returns one task type. A type that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Get one task type
     * @param {string} id Task type id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsGetTaskTypeRaw(requestParameters: FormschecklistsGetTaskTypeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsGetTaskType200Response>>;

    /**
     * Returns one task type. A type that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one task type
     */
    formschecklistsGetTaskType(requestParameters: FormschecklistsGetTaskTypeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsGetTaskType200Response>;

    /**
     * Returns your organisation\'s assignment rules, newest first: who each template goes to and on what schedule.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary List assignment rules
     * @param {string} [templateId] Only rules for this template.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsListAssignmentRulesRaw(requestParameters: FormschecklistsListAssignmentRulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsListAssignmentRules200Response>>;

    /**
     * Returns your organisation\'s assignment rules, newest first: who each template goes to and on what schedule.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List assignment rules
     */
    formschecklistsListAssignmentRules(requestParameters: FormschecklistsListAssignmentRulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsListAssignmentRules200Response>;

    /**
     * Returns one page of the form submissions in your organisation, newest first, including outstanding (Draft) forms that have been assigned to someone. Each item carries the template it was made from. Narrow it with the filters and page through it with `page` and `pageSize`.  `responsesJson` and `reviewComments` need `forms.responses.read`; without it they are null. `score` and `passFail` stay visible.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary List form submissions
     * @param {string} [templateId] Only submissions of this template.
     * @param {string} [assignedTo] Only submissions addressed to this staff member (or user) id.
     * @param {number} [status] Only this status: 0 Draft · 1 Submitted · 2 PendingReview · 3 Approved · 4 Rejected. The member name (for example PendingReview) is also accepted.
     * @param {number} [excludeStatus] Leave out this status (same values as &#x60;status&#x60;), for example 0 to hide outstanding Drafts.
     * @param {number} [page] Page number, from 1.
     * @param {number} [pageSize] Page size, 1–200; anything outside that uses 30. Above 200 is lowered to 200 without an error.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsListFormSubmissionsRaw(requestParameters: FormschecklistsListFormSubmissionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsListFormSubmissions200Response>>;

    /**
     * Returns one page of the form submissions in your organisation, newest first, including outstanding (Draft) forms that have been assigned to someone. Each item carries the template it was made from. Narrow it with the filters and page through it with `page` and `pageSize`.  `responsesJson` and `reviewComments` need `forms.responses.read`; without it they are null. `score` and `passFail` stay visible.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List form submissions
     */
    formschecklistsListFormSubmissions(requestParameters: FormschecklistsListFormSubmissionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsListFormSubmissions200Response>;

    /**
     * Returns the enabled templates your organisation can use: its own templates plus the system catalogue, ordered by name. Drafts and archived templates are included; only Published ones can be started or assigned (check `status`).  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary List form templates
     * @param {string} [locationId] Only templates scoped to this location.
     * @param {number} [scope] Only this scope: 0 System · 1 Tenant · 2 Location.
     * @param {string} [industry] Only templates tagged with this industry slug, for example agedcare.
     * @param {string} [category] Only this category, for example safety.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsListFormTemplatesRaw(requestParameters: FormschecklistsListFormTemplatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsListFormTemplates200Response>>;

    /**
     * Returns the enabled templates your organisation can use: its own templates plus the system catalogue, ordered by name. Drafts and archived templates are included; only Published ones can be started or assigned (check `status`).  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List form templates
     */
    formschecklistsListFormTemplates(requestParameters: FormschecklistsListFormTemplatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsListFormTemplates200Response>;

    /**
     * Returns your organisation\'s task boards with their stages, left to right. If your organisation has none yet, the three default boards (Default Workflow, Maintenance Pipeline and Corrective Action Pipeline) are created on this first read and returned. Use a stage\'s `kind`, not its name, to tell whether it means open, in progress, blocked or completed.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary List task boards
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsListTaskPipelinesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsListTaskPipelines200Response>>;

    /**
     * Returns your organisation\'s task boards with their stages, left to right. If your organisation has none yet, the three default boards (Default Workflow, Maintenance Pipeline and Corrective Action Pipeline) are created on this first read and returned. Use a stage\'s `kind`, not its name, to tell whether it means open, in progress, blocked or completed.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List task boards
     */
    formschecklistsListTaskPipelines(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsListTaskPipelines200Response>;

    /**
     * Returns your organisation\'s task types, oldest first. If it has none yet, the defaults (Work Order, Maintenance and Corrective Action) are created on this first read and returned.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary List task types
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsListTaskTypesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsListTaskTypes200Response>>;

    /**
     * Returns your organisation\'s task types, oldest first. If it has none yet, the defaults (Work Order, Maintenance and Corrective Action) are created on this first read and returned.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List task types
     */
    formschecklistsListTaskTypes(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsListTaskTypes200Response>;

    /**
     * Returns one page of your organisation\'s tasks, newest first, with comment and subtask counts. `stage` is not filled in on list items; look stages up from \"List task boards\" by `stageId`.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary List tasks
     * @param {string} [pipelineId] Only tasks on this board.
     * @param {string} [stageId] Only tasks in this stage.
     * @param {number} [stageKind] Only tasks in stages of this kind: 0 Open · 1 InProgress · 2 Blocked · 3 Completed.
     * @param {boolean} [overdueOnly] Only tasks past their due date and not in a Completed stage.
     * @param {string} [typeId] Only tasks of this type.
     * @param {number} [priority] Only this priority: 0 Low · 1 Medium · 2 High · 3 Critical.
     * @param {string} [assignedTo] Only tasks assigned to this staff member (or user) id.
     * @param {string} [search] Text to find in the title or description.
     * @param {number} [page] Page number, from 1.
     * @param {number} [pageSize] Page size, 1–200; anything outside that uses 30. Above 200 is lowered to 200 without an error.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsListTasksRaw(requestParameters: FormschecklistsListTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsListTasks200Response>>;

    /**
     * Returns one page of your organisation\'s tasks, newest first, with comment and subtask counts. `stage` is not filled in on list items; look stages up from \"List task boards\" by `stageId`.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List tasks
     */
    formschecklistsListTasks(requestParameters: FormschecklistsListTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsListTasks200Response>;

    /**
     * Moves a task to another stage on its own board. The stage must belong to the task\'s board, or the call is refused with 400; a task that is not in your organisation answers 404. Moving into a Completed stage stamps `completedDate`; moving back out clears it. A move to a different stage raises `task.stage_changed`; moving to the stage it is already in changes nothing.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Move a task to another stage
     * @param {string} id Task id.
     * @param {FormschecklistsMoveTaskStageRequest} formschecklistsMoveTaskStageRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsMoveTaskStageRaw(requestParameters: FormschecklistsMoveTaskStageOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateTask201Response>>;

    /**
     * Moves a task to another stage on its own board. The stage must belong to the task\'s board, or the call is refused with 400; a task that is not in your organisation answers 404. Moving into a Completed stage stamps `completedDate`; moving back out clears it. A move to a different stage raises `task.stage_changed`; moving to the stage it is already in changes nothing.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Move a task to another stage
     */
    formschecklistsMoveTaskStage(requestParameters: FormschecklistsMoveTaskStageOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateTask201Response>;

    /**
     * Creates a Draft submission of a template, optionally addressed to a staff member with a due date; an addressed Draft is that person\'s outstanding form. Answers with **201 Created** and the new submission. The template must be Published and be either your organisation\'s own or a system template, or the call is refused with 400 (\"Template not found.\" or \"Only Published templates can be submitted against.\").  Starting a submission with an assignee raises `form.assigned`. Your integration cannot save drafts; fill the form in one step with \"Submit a form submission\".  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Start a form submission
     * @param {FormschecklistsStartFormSubmissionRequest} formschecklistsStartFormSubmissionRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsStartFormSubmissionRaw(requestParameters: FormschecklistsStartFormSubmissionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsStartFormSubmission201Response>>;

    /**
     * Creates a Draft submission of a template, optionally addressed to a staff member with a due date; an addressed Draft is that person\'s outstanding form. Answers with **201 Created** and the new submission. The template must be Published and be either your organisation\'s own or a system template, or the call is refused with 400 (\"Template not found.\" or \"Only Published templates can be submitted against.\").  Starting a submission with an assignee raises `form.assigned`. Your integration cannot save drafts; fill the form in one step with \"Submit a form submission\".  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Start a form submission
     */
    formschecklistsStartFormSubmission(requestParameters: FormschecklistsStartFormSubmissionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsStartFormSubmission201Response>;

    /**
     * Records the answers on a submission and sends it for review. Your integration **must** send `\"requiresReview\": true`: completing a form without review counts as approving it, which no scope allows, so `requiresReview: false` is refused with 403. The submission moves to PendingReview and `submittedBy` is stored as the empty id 00000000-0000-0000-0000-000000000000. Review itself is done by a person in Rostered.  A Draft, Submitted or PendingReview submission can be submitted, and resubmitting replaces the answers; an Approved or Rejected one, or an id that is not in your organisation, answers 400. Each submit raises `form.submission.submitted`. When `passFail` is 1 (Fail), a High-priority corrective action task is raised automatically on the Corrective Action Pipeline, assigned to the submission\'s assignee, which also raises `task.created`.  `responsesJson` and `reviewComments` need `forms.responses.read`; without it they are null. `score` and `passFail` stay visible.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * @summary Submit a form submission
     * @param {string} id Submission id.
     * @param {FormschecklistsSubmitFormSubmissionRequest} formschecklistsSubmitFormSubmissionRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsTasksApiInterface
     */
    formschecklistsSubmitFormSubmissionRaw(requestParameters: FormschecklistsSubmitFormSubmissionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsStartFormSubmission201Response>>;

    /**
     * Records the answers on a submission and sends it for review. Your integration **must** send `\"requiresReview\": true`: completing a form without review counts as approving it, which no scope allows, so `requiresReview: false` is refused with 403. The submission moves to PendingReview and `submittedBy` is stored as the empty id 00000000-0000-0000-0000-000000000000. Review itself is done by a person in Rostered.  A Draft, Submitted or PendingReview submission can be submitted, and resubmitting replaces the answers; an Approved or Rejected one, or an id that is not in your organisation, answers 400. Each submit raises `form.submission.submitted`. When `passFail` is 1 (Fail), a High-priority corrective action task is raised automatically on the Corrective Action Pipeline, assigned to the submission\'s assignee, which also raises `task.created`.  `responsesJson` and `reviewComments` need `forms.responses.read`; without it they are null. `score` and `passFail` stay visible.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Submit a form submission
     */
    formschecklistsSubmitFormSubmission(requestParameters: FormschecklistsSubmitFormSubmissionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsStartFormSubmission201Response>;

}

/**
 * 
 */
export class FormsTasksApi extends runtime.BaseAPI implements FormsTasksApiInterface {

    /**
     * Turns a deactivated assignment rule back on so it generates forms again. New rules start active. A rule that is not in your organisation answers 404. No request body.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Reactivate an assignment rule
     */
    async formschecklistsActivateAssignmentRuleRaw(requestParameters: FormschecklistsActivateAssignmentRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateAssignmentRule201Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling formschecklistsActivateAssignmentRule().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["forms.write"]);
        }


        let urlPath = `/formschecklists/api/FormAssignments/{id}/activate`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsCreateAssignmentRule201ResponseFromJSON(jsonValue));
    }

    /**
     * Turns a deactivated assignment rule back on so it generates forms again. New rules start active. A rule that is not in your organisation answers 404. No request body.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Reactivate an assignment rule
     */
    async formschecklistsActivateAssignmentRule(requestParameters: FormschecklistsActivateAssignmentRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateAssignmentRule201Response> {
        const response = await this.formschecklistsActivateAssignmentRuleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Assigns one or more templates to one or more staff members, once or on a repeating schedule, and returns how many forms were created.  - `occurrence` \"Once\" (any case) creates one Draft per template per staff member, due at `dueDate`. - Any other `occurrence` is recurring: for each template it creates an assignment rule for those staff (`assignmentName`, or the template name), scheduled by `frequency` at the time of day of `dueDate` from its date, and immediately creates only the first 7 days of forms, from that date to `endDate` if that is sooner. Later forms come from the rule on its background schedule, so `created` counts that first week, not the whole schedule.  Templates that are not Published, or are neither your organisation\'s nor a system template, are skipped without error, so check `created`. A staff id that belongs to another organisation answers 400 and nothing is created. Placeholders such as {{staff_name}} in `instructions` are filled in for each person. Each form created raises `form.assigned`.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Assign forms to staff in bulk
     */
    async formschecklistsBulkAssignFormsRaw(requestParameters: FormschecklistsBulkAssignFormsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsBulkAssignForms200Response>> {
        if (requestParameters['formschecklistsBulkAssignFormsRequest'] == null) {
            throw new runtime.RequiredError(
                'formschecklistsBulkAssignFormsRequest',
                'Required parameter "formschecklistsBulkAssignFormsRequest" was null or undefined when calling formschecklistsBulkAssignForms().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["forms.write"]);
        }


        let urlPath = `/formschecklists/api/FormSubmissions/bulk`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: FormschecklistsBulkAssignFormsRequestToJSON(requestParameters['formschecklistsBulkAssignFormsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsBulkAssignForms200ResponseFromJSON(jsonValue));
    }

    /**
     * Assigns one or more templates to one or more staff members, once or on a repeating schedule, and returns how many forms were created.  - `occurrence` \"Once\" (any case) creates one Draft per template per staff member, due at `dueDate`. - Any other `occurrence` is recurring: for each template it creates an assignment rule for those staff (`assignmentName`, or the template name), scheduled by `frequency` at the time of day of `dueDate` from its date, and immediately creates only the first 7 days of forms, from that date to `endDate` if that is sooner. Later forms come from the rule on its background schedule, so `created` counts that first week, not the whole schedule.  Templates that are not Published, or are neither your organisation\'s nor a system template, are skipped without error, so check `created`. A staff id that belongs to another organisation answers 400 and nothing is created. Placeholders such as {{staff_name}} in `instructions` are filled in for each person. Each form created raises `form.assigned`.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Assign forms to staff in bulk
     */
    async formschecklistsBulkAssignForms(requestParameters: FormschecklistsBulkAssignFormsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsBulkAssignForms200Response> {
        const response = await this.formschecklistsBulkAssignFormsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates an active assignment rule and answers with **201 Created**. The template must be Published and be your organisation\'s own or a system template, or the call is refused with 400.  Only Scheduled rules (`trigger` 3) targeting Individual, Role or Location currently generate forms: they are checked every 15 minutes and forms are created for occurrences from 7 days ago to 30 days ahead, each raising `form.assigned`. Team and ShiftStaff targets, and the roster and event triggers, are stored but do not generate forms yet.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Create an assignment rule
     */
    async formschecklistsCreateAssignmentRuleRaw(requestParameters: FormschecklistsCreateAssignmentRuleOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateAssignmentRule201Response>> {
        if (requestParameters['formschecklistsCreateAssignmentRuleRequest'] == null) {
            throw new runtime.RequiredError(
                'formschecklistsCreateAssignmentRuleRequest',
                'Required parameter "formschecklistsCreateAssignmentRuleRequest" was null or undefined when calling formschecklistsCreateAssignmentRule().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["forms.write"]);
        }


        let urlPath = `/formschecklists/api/FormAssignments`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: FormschecklistsCreateAssignmentRuleRequestToJSON(requestParameters['formschecklistsCreateAssignmentRuleRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsCreateAssignmentRule201ResponseFromJSON(jsonValue));
    }

    /**
     * Creates an active assignment rule and answers with **201 Created**. The template must be Published and be your organisation\'s own or a system template, or the call is refused with 400.  Only Scheduled rules (`trigger` 3) targeting Individual, Role or Location currently generate forms: they are checked every 15 minutes and forms are created for occurrences from 7 days ago to 30 days ahead, each raising `form.assigned`. Team and ShiftStaff targets, and the roster and event triggers, are stored but do not generate forms yet.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Create an assignment rule
     */
    async formschecklistsCreateAssignmentRule(requestParameters: FormschecklistsCreateAssignmentRuleOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateAssignmentRule201Response> {
        const response = await this.formschecklistsCreateAssignmentRuleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Adds a task to a board and answers with **201 Created**. Get the board, stage and type ids from \"List task boards\" and \"List task types\". The stage must belong to the board, or the call is refused with 400; a missing title, type or stage is also a 400. A task created straight into a Completed stage is stamped completed. `createdBy` is left empty (null) for a task your integration creates. Raises `task.created`.  `formSubmission` needs `forms.responses.read`; without it it is null.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Create a task
     */
    async formschecklistsCreateTaskRaw(requestParameters: FormschecklistsCreateTaskOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateTask201Response>> {
        if (requestParameters['formschecklistsCreateTaskRequest'] == null) {
            throw new runtime.RequiredError(
                'formschecklistsCreateTaskRequest',
                'Required parameter "formschecklistsCreateTaskRequest" was null or undefined when calling formschecklistsCreateTask().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["forms.write"]);
        }


        let urlPath = `/formschecklists/api/Tasks`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: FormschecklistsCreateTaskRequestToJSON(requestParameters['formschecklistsCreateTaskRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsCreateTask201ResponseFromJSON(jsonValue));
    }

    /**
     * Adds a task to a board and answers with **201 Created**. Get the board, stage and type ids from \"List task boards\" and \"List task types\". The stage must belong to the board, or the call is refused with 400; a missing title, type or stage is also a 400. A task created straight into a Completed stage is stamped completed. `createdBy` is left empty (null) for a task your integration creates. Raises `task.created`.  `formSubmission` needs `forms.responses.read`; without it it is null.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Create a task
     */
    async formschecklistsCreateTask(requestParameters: FormschecklistsCreateTaskOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateTask201Response> {
        const response = await this.formschecklistsCreateTaskRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Turns an assignment rule off so it stops generating forms; forms it already generated are kept. Reactivate it to turn it back on. A rule that is not in your organisation answers 404. No request body.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Deactivate an assignment rule
     */
    async formschecklistsDeactivateAssignmentRuleRaw(requestParameters: FormschecklistsDeactivateAssignmentRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateAssignmentRule201Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling formschecklistsDeactivateAssignmentRule().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["forms.write"]);
        }


        let urlPath = `/formschecklists/api/FormAssignments/{id}/deactivate`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsCreateAssignmentRule201ResponseFromJSON(jsonValue));
    }

    /**
     * Turns an assignment rule off so it stops generating forms; forms it already generated are kept. Reactivate it to turn it back on. A rule that is not in your organisation answers 404. No request body.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Deactivate an assignment rule
     */
    async formschecklistsDeactivateAssignmentRule(requestParameters: FormschecklistsDeactivateAssignmentRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateAssignmentRule201Response> {
        const response = await this.formschecklistsDeactivateAssignmentRuleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one assignment rule. A rule that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one assignment rule
     */
    async formschecklistsGetAssignmentRuleRaw(requestParameters: FormschecklistsGetAssignmentRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateAssignmentRule201Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling formschecklistsGetAssignmentRule().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/FormAssignments/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsCreateAssignmentRule201ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one assignment rule. A rule that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one assignment rule
     */
    async formschecklistsGetAssignmentRule(requestParameters: FormschecklistsGetAssignmentRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateAssignmentRule201Response> {
        const response = await this.formschecklistsGetAssignmentRuleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one submission with its answers, its template and the assignment rule that created it (if any). A submission that does not belong to your organisation answers 404.  `responsesJson` and `reviewComments` need `forms.responses.read`; without it they are null. `score` and `passFail` stay visible.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one form submission
     */
    async formschecklistsGetFormSubmissionRaw(requestParameters: FormschecklistsGetFormSubmissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsStartFormSubmission201Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling formschecklistsGetFormSubmission().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/FormSubmissions/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsStartFormSubmission201ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one submission with its answers, its template and the assignment rule that created it (if any). A submission that does not belong to your organisation answers 404.  `responsesJson` and `reviewComments` need `forms.responses.read`; without it they are null. `score` and `passFail` stay visible.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one form submission
     */
    async formschecklistsGetFormSubmission(requestParameters: FormschecklistsGetFormSubmissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsStartFormSubmission201Response> {
        const response = await this.formschecklistsGetFormSubmissionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Counts your organisation\'s form submissions by status, with how many failed an audit and the average score. Narrow it to one template or one person with `templateId` and `assignedTo`. No answers are returned.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Count form submissions by status
     */
    async formschecklistsGetFormSubmissionStatsRaw(requestParameters: FormschecklistsGetFormSubmissionStatsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsGetFormSubmissionStats200Response>> {
        const queryParameters: any = {};

        if (requestParameters['templateId'] != null) {
            queryParameters['templateId'] = requestParameters['templateId'];
        }

        if (requestParameters['assignedTo'] != null) {
            queryParameters['assignedTo'] = requestParameters['assignedTo'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/FormSubmissions/stats`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsGetFormSubmissionStats200ResponseFromJSON(jsonValue));
    }

    /**
     * Counts your organisation\'s form submissions by status, with how many failed an audit and the average score. Narrow it to one template or one person with `templateId` and `assignedTo`. No answers are returned.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Count form submissions by status
     */
    async formschecklistsGetFormSubmissionStats(requestParameters: FormschecklistsGetFormSubmissionStatsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsGetFormSubmissionStats200Response> {
        const response = await this.formschecklistsGetFormSubmissionStatsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one template with its full design (`definitionJson`), whose field ids are the keys you answer in a submission. Your organisation\'s own templates and system templates can be read; anything else answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one form template
     */
    async formschecklistsGetFormTemplateRaw(requestParameters: FormschecklistsGetFormTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsGetFormTemplate200Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling formschecklistsGetFormTemplate().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/FormTemplates/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsGetFormTemplate200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one template with its full design (`definitionJson`), whose field ids are the keys you answer in a submission. Your organisation\'s own templates and system templates can be read; anything else answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one form template
     */
    async formschecklistsGetFormTemplate(requestParameters: FormschecklistsGetFormTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsGetFormTemplate200Response> {
        const response = await this.formschecklistsGetFormTemplateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns how many of your organisation\'s tasks sit in each stage, across every board, as an object keyed by stage id. Stages with no tasks are left out.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Count tasks in each stage
     */
    async formschecklistsGetStageTaskCountsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsGetStageTaskCounts200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/TaskPipelines/stage-task-counts`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsGetStageTaskCounts200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns how many of your organisation\'s tasks sit in each stage, across every board, as an object keyed by stage id. Stages with no tasks are left out.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Count tasks in each stage
     */
    async formschecklistsGetStageTaskCounts(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsGetStageTaskCounts200Response> {
        const response = await this.formschecklistsGetStageTaskCountsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Returns one task with its current stage. A task that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one task
     */
    async formschecklistsGetTaskRaw(requestParameters: FormschecklistsGetTaskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateTask201Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling formschecklistsGetTask().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/Tasks/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsCreateTask201ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one task with its current stage. A task that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one task
     */
    async formschecklistsGetTask(requestParameters: FormschecklistsGetTaskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateTask201Response> {
        const response = await this.formschecklistsGetTaskRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one task board with its stages, left to right. A board that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one task board
     */
    async formschecklistsGetTaskPipelineRaw(requestParameters: FormschecklistsGetTaskPipelineRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsGetTaskPipeline200Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling formschecklistsGetTaskPipeline().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/TaskPipelines/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsGetTaskPipeline200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one task board with its stages, left to right. A board that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one task board
     */
    async formschecklistsGetTaskPipeline(requestParameters: FormschecklistsGetTaskPipelineRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsGetTaskPipeline200Response> {
        const response = await this.formschecklistsGetTaskPipelineRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Counts your organisation\'s tasks by the kind of stage they are in, plus how many are overdue (past due and not in a Completed stage), using the same filters as \"List tasks\".  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Count tasks by stage kind
     */
    async formschecklistsGetTaskStatsRaw(requestParameters: FormschecklistsGetTaskStatsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsGetTaskStats200Response>> {
        const queryParameters: any = {};

        if (requestParameters['pipelineId'] != null) {
            queryParameters['pipelineId'] = requestParameters['pipelineId'];
        }

        if (requestParameters['typeId'] != null) {
            queryParameters['typeId'] = requestParameters['typeId'];
        }

        if (requestParameters['priority'] != null) {
            queryParameters['priority'] = requestParameters['priority'];
        }

        if (requestParameters['assignedTo'] != null) {
            queryParameters['assignedTo'] = requestParameters['assignedTo'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/Tasks/stats`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsGetTaskStats200ResponseFromJSON(jsonValue));
    }

    /**
     * Counts your organisation\'s tasks by the kind of stage they are in, plus how many are overdue (past due and not in a Completed stage), using the same filters as \"List tasks\".  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Count tasks by stage kind
     */
    async formschecklistsGetTaskStats(requestParameters: FormschecklistsGetTaskStatsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsGetTaskStats200Response> {
        const response = await this.formschecklistsGetTaskStatsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one task type. A type that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one task type
     */
    async formschecklistsGetTaskTypeRaw(requestParameters: FormschecklistsGetTaskTypeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsGetTaskType200Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling formschecklistsGetTaskType().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/TaskTypes/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsGetTaskType200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one task type. A type that is not in your organisation answers 404.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * Get one task type
     */
    async formschecklistsGetTaskType(requestParameters: FormschecklistsGetTaskTypeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsGetTaskType200Response> {
        const response = await this.formschecklistsGetTaskTypeRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns your organisation\'s assignment rules, newest first: who each template goes to and on what schedule.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List assignment rules
     */
    async formschecklistsListAssignmentRulesRaw(requestParameters: FormschecklistsListAssignmentRulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsListAssignmentRules200Response>> {
        const queryParameters: any = {};

        if (requestParameters['templateId'] != null) {
            queryParameters['templateId'] = requestParameters['templateId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/FormAssignments`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsListAssignmentRules200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns your organisation\'s assignment rules, newest first: who each template goes to and on what schedule.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List assignment rules
     */
    async formschecklistsListAssignmentRules(requestParameters: FormschecklistsListAssignmentRulesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsListAssignmentRules200Response> {
        const response = await this.formschecklistsListAssignmentRulesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns one page of the form submissions in your organisation, newest first, including outstanding (Draft) forms that have been assigned to someone. Each item carries the template it was made from. Narrow it with the filters and page through it with `page` and `pageSize`.  `responsesJson` and `reviewComments` need `forms.responses.read`; without it they are null. `score` and `passFail` stay visible.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List form submissions
     */
    async formschecklistsListFormSubmissionsRaw(requestParameters: FormschecklistsListFormSubmissionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsListFormSubmissions200Response>> {
        const queryParameters: any = {};

        if (requestParameters['templateId'] != null) {
            queryParameters['templateId'] = requestParameters['templateId'];
        }

        if (requestParameters['assignedTo'] != null) {
            queryParameters['assignedTo'] = requestParameters['assignedTo'];
        }

        if (requestParameters['status'] != null) {
            queryParameters['status'] = requestParameters['status'];
        }

        if (requestParameters['excludeStatus'] != null) {
            queryParameters['excludeStatus'] = requestParameters['excludeStatus'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['pageSize'] != null) {
            queryParameters['pageSize'] = requestParameters['pageSize'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/FormSubmissions`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsListFormSubmissions200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one page of the form submissions in your organisation, newest first, including outstanding (Draft) forms that have been assigned to someone. Each item carries the template it was made from. Narrow it with the filters and page through it with `page` and `pageSize`.  `responsesJson` and `reviewComments` need `forms.responses.read`; without it they are null. `score` and `passFail` stay visible.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List form submissions
     */
    async formschecklistsListFormSubmissions(requestParameters: FormschecklistsListFormSubmissionsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsListFormSubmissions200Response> {
        const response = await this.formschecklistsListFormSubmissionsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the enabled templates your organisation can use: its own templates plus the system catalogue, ordered by name. Drafts and archived templates are included; only Published ones can be started or assigned (check `status`).  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List form templates
     */
    async formschecklistsListFormTemplatesRaw(requestParameters: FormschecklistsListFormTemplatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsListFormTemplates200Response>> {
        const queryParameters: any = {};

        if (requestParameters['locationId'] != null) {
            queryParameters['locationId'] = requestParameters['locationId'];
        }

        if (requestParameters['scope'] != null) {
            queryParameters['scope'] = requestParameters['scope'];
        }

        if (requestParameters['industry'] != null) {
            queryParameters['industry'] = requestParameters['industry'];
        }

        if (requestParameters['category'] != null) {
            queryParameters['category'] = requestParameters['category'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/FormTemplates`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsListFormTemplates200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the enabled templates your organisation can use: its own templates plus the system catalogue, ordered by name. Drafts and archived templates are included; only Published ones can be started or assigned (check `status`).  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List form templates
     */
    async formschecklistsListFormTemplates(requestParameters: FormschecklistsListFormTemplatesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsListFormTemplates200Response> {
        const response = await this.formschecklistsListFormTemplatesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns your organisation\'s task boards with their stages, left to right. If your organisation has none yet, the three default boards (Default Workflow, Maintenance Pipeline and Corrective Action Pipeline) are created on this first read and returned. Use a stage\'s `kind`, not its name, to tell whether it means open, in progress, blocked or completed.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List task boards
     */
    async formschecklistsListTaskPipelinesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsListTaskPipelines200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/TaskPipelines`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsListTaskPipelines200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns your organisation\'s task boards with their stages, left to right. If your organisation has none yet, the three default boards (Default Workflow, Maintenance Pipeline and Corrective Action Pipeline) are created on this first read and returned. Use a stage\'s `kind`, not its name, to tell whether it means open, in progress, blocked or completed.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List task boards
     */
    async formschecklistsListTaskPipelines(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsListTaskPipelines200Response> {
        const response = await this.formschecklistsListTaskPipelinesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Returns your organisation\'s task types, oldest first. If it has none yet, the defaults (Work Order, Maintenance and Corrective Action) are created on this first read and returned.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List task types
     */
    async formschecklistsListTaskTypesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsListTaskTypes200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/TaskTypes`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsListTaskTypes200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns your organisation\'s task types, oldest first. If it has none yet, the defaults (Work Order, Maintenance and Corrective Action) are created on this first read and returned.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List task types
     */
    async formschecklistsListTaskTypes(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsListTaskTypes200Response> {
        const response = await this.formschecklistsListTaskTypesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Returns one page of your organisation\'s tasks, newest first, with comment and subtask counts. `stage` is not filled in on list items; look stages up from \"List task boards\" by `stageId`.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List tasks
     */
    async formschecklistsListTasksRaw(requestParameters: FormschecklistsListTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsListTasks200Response>> {
        const queryParameters: any = {};

        if (requestParameters['pipelineId'] != null) {
            queryParameters['pipelineId'] = requestParameters['pipelineId'];
        }

        if (requestParameters['stageId'] != null) {
            queryParameters['stageId'] = requestParameters['stageId'];
        }

        if (requestParameters['stageKind'] != null) {
            queryParameters['stageKind'] = requestParameters['stageKind'];
        }

        if (requestParameters['overdueOnly'] != null) {
            queryParameters['overdueOnly'] = requestParameters['overdueOnly'];
        }

        if (requestParameters['typeId'] != null) {
            queryParameters['typeId'] = requestParameters['typeId'];
        }

        if (requestParameters['priority'] != null) {
            queryParameters['priority'] = requestParameters['priority'];
        }

        if (requestParameters['assignedTo'] != null) {
            queryParameters['assignedTo'] = requestParameters['assignedTo'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['pageSize'] != null) {
            queryParameters['pageSize'] = requestParameters['pageSize'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/formschecklists/api/Tasks`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsListTasks200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns one page of your organisation\'s tasks, newest first, with comment and subtask counts. `stage` is not filled in on list items; look stages up from \"List task boards\" by `stageId`.  **Required scope:** `forms.read` or `forms.write`  See **Responses** below for the status codes this operation can return.
     * List tasks
     */
    async formschecklistsListTasks(requestParameters: FormschecklistsListTasksRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsListTasks200Response> {
        const response = await this.formschecklistsListTasksRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Moves a task to another stage on its own board. The stage must belong to the task\'s board, or the call is refused with 400; a task that is not in your organisation answers 404. Moving into a Completed stage stamps `completedDate`; moving back out clears it. A move to a different stage raises `task.stage_changed`; moving to the stage it is already in changes nothing.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Move a task to another stage
     */
    async formschecklistsMoveTaskStageRaw(requestParameters: FormschecklistsMoveTaskStageOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsCreateTask201Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling formschecklistsMoveTaskStage().'
            );
        }

        if (requestParameters['formschecklistsMoveTaskStageRequest'] == null) {
            throw new runtime.RequiredError(
                'formschecklistsMoveTaskStageRequest',
                'Required parameter "formschecklistsMoveTaskStageRequest" was null or undefined when calling formschecklistsMoveTaskStage().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["forms.write"]);
        }


        let urlPath = `/formschecklists/api/Tasks/{id}/stage`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: FormschecklistsMoveTaskStageRequestToJSON(requestParameters['formschecklistsMoveTaskStageRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsCreateTask201ResponseFromJSON(jsonValue));
    }

    /**
     * Moves a task to another stage on its own board. The stage must belong to the task\'s board, or the call is refused with 400; a task that is not in your organisation answers 404. Moving into a Completed stage stamps `completedDate`; moving back out clears it. A move to a different stage raises `task.stage_changed`; moving to the stage it is already in changes nothing.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Move a task to another stage
     */
    async formschecklistsMoveTaskStage(requestParameters: FormschecklistsMoveTaskStageOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsCreateTask201Response> {
        const response = await this.formschecklistsMoveTaskStageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates a Draft submission of a template, optionally addressed to a staff member with a due date; an addressed Draft is that person\'s outstanding form. Answers with **201 Created** and the new submission. The template must be Published and be either your organisation\'s own or a system template, or the call is refused with 400 (\"Template not found.\" or \"Only Published templates can be submitted against.\").  Starting a submission with an assignee raises `form.assigned`. Your integration cannot save drafts; fill the form in one step with \"Submit a form submission\".  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Start a form submission
     */
    async formschecklistsStartFormSubmissionRaw(requestParameters: FormschecklistsStartFormSubmissionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsStartFormSubmission201Response>> {
        if (requestParameters['formschecklistsStartFormSubmissionRequest'] == null) {
            throw new runtime.RequiredError(
                'formschecklistsStartFormSubmissionRequest',
                'Required parameter "formschecklistsStartFormSubmissionRequest" was null or undefined when calling formschecklistsStartFormSubmission().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["forms.write"]);
        }


        let urlPath = `/formschecklists/api/FormSubmissions`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: FormschecklistsStartFormSubmissionRequestToJSON(requestParameters['formschecklistsStartFormSubmissionRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsStartFormSubmission201ResponseFromJSON(jsonValue));
    }

    /**
     * Creates a Draft submission of a template, optionally addressed to a staff member with a due date; an addressed Draft is that person\'s outstanding form. Answers with **201 Created** and the new submission. The template must be Published and be either your organisation\'s own or a system template, or the call is refused with 400 (\"Template not found.\" or \"Only Published templates can be submitted against.\").  Starting a submission with an assignee raises `form.assigned`. Your integration cannot save drafts; fill the form in one step with \"Submit a form submission\".  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Start a form submission
     */
    async formschecklistsStartFormSubmission(requestParameters: FormschecklistsStartFormSubmissionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsStartFormSubmission201Response> {
        const response = await this.formschecklistsStartFormSubmissionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Records the answers on a submission and sends it for review. Your integration **must** send `\"requiresReview\": true`: completing a form without review counts as approving it, which no scope allows, so `requiresReview: false` is refused with 403. The submission moves to PendingReview and `submittedBy` is stored as the empty id 00000000-0000-0000-0000-000000000000. Review itself is done by a person in Rostered.  A Draft, Submitted or PendingReview submission can be submitted, and resubmitting replaces the answers; an Approved or Rejected one, or an id that is not in your organisation, answers 400. Each submit raises `form.submission.submitted`. When `passFail` is 1 (Fail), a High-priority corrective action task is raised automatically on the Corrective Action Pipeline, assigned to the submission\'s assignee, which also raises `task.created`.  `responsesJson` and `reviewComments` need `forms.responses.read`; without it they are null. `score` and `passFail` stay visible.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Submit a form submission
     */
    async formschecklistsSubmitFormSubmissionRaw(requestParameters: FormschecklistsSubmitFormSubmissionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FormschecklistsStartFormSubmission201Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling formschecklistsSubmitFormSubmission().'
            );
        }

        if (requestParameters['formschecklistsSubmitFormSubmissionRequest'] == null) {
            throw new runtime.RequiredError(
                'formschecklistsSubmitFormSubmissionRequest',
                'Required parameter "formschecklistsSubmitFormSubmissionRequest" was null or undefined when calling formschecklistsSubmitFormSubmission().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["forms.write"]);
        }


        let urlPath = `/formschecklists/api/FormSubmissions/{id}/submit`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: FormschecklistsSubmitFormSubmissionRequestToJSON(requestParameters['formschecklistsSubmitFormSubmissionRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FormschecklistsStartFormSubmission201ResponseFromJSON(jsonValue));
    }

    /**
     * Records the answers on a submission and sends it for review. Your integration **must** send `\"requiresReview\": true`: completing a form without review counts as approving it, which no scope allows, so `requiresReview: false` is refused with 403. The submission moves to PendingReview and `submittedBy` is stored as the empty id 00000000-0000-0000-0000-000000000000. Review itself is done by a person in Rostered.  A Draft, Submitted or PendingReview submission can be submitted, and resubmitting replaces the answers; an Approved or Rejected one, or an id that is not in your organisation, answers 400. Each submit raises `form.submission.submitted`. When `passFail` is 1 (Fail), a High-priority corrective action task is raised automatically on the Corrective Action Pipeline, assigned to the submission\'s assignee, which also raises `task.created`.  `responsesJson` and `reviewComments` need `forms.responses.read`; without it they are null. `score` and `passFail` stay visible.  **Required scope:** `forms.write`  See **Responses** below for the status codes this operation can return.
     * Submit a form submission
     */
    async formschecklistsSubmitFormSubmission(requestParameters: FormschecklistsSubmitFormSubmissionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FormschecklistsStartFormSubmission201Response> {
        const response = await this.formschecklistsSubmitFormSubmissionRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
