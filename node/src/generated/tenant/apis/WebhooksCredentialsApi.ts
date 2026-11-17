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
  TokenError,
  TokenResponse,
  UserIntegrationsCatalogue200Response,
  UserIntegrationsWebhooksDeliveries200Response,
  UserIntegrationsWebhooksEndpoints200Response,
  UserIntegrationsWebhooksEndpointsRequest,
  UserIntegrationsWebhooksReplay200Response,
  UserIntegrationsWebhooksRotateSecret200Response,
  UserIntegrationsWebhooksSettings200Response,
  UserIntegrationsWebhooksTest200Response,
  UserIntegrationsWebhooksTestRequest,
  ValidationProblem,
} from '../models/index.js';
import {
    EnvelopeFromJSON,
    EnvelopeToJSON,
    TokenErrorFromJSON,
    TokenErrorToJSON,
    TokenResponseFromJSON,
    TokenResponseToJSON,
    UserIntegrationsCatalogue200ResponseFromJSON,
    UserIntegrationsCatalogue200ResponseToJSON,
    UserIntegrationsWebhooksDeliveries200ResponseFromJSON,
    UserIntegrationsWebhooksDeliveries200ResponseToJSON,
    UserIntegrationsWebhooksEndpoints200ResponseFromJSON,
    UserIntegrationsWebhooksEndpoints200ResponseToJSON,
    UserIntegrationsWebhooksEndpointsRequestFromJSON,
    UserIntegrationsWebhooksEndpointsRequestToJSON,
    UserIntegrationsWebhooksReplay200ResponseFromJSON,
    UserIntegrationsWebhooksReplay200ResponseToJSON,
    UserIntegrationsWebhooksRotateSecret200ResponseFromJSON,
    UserIntegrationsWebhooksRotateSecret200ResponseToJSON,
    UserIntegrationsWebhooksSettings200ResponseFromJSON,
    UserIntegrationsWebhooksSettings200ResponseToJSON,
    UserIntegrationsWebhooksTest200ResponseFromJSON,
    UserIntegrationsWebhooksTest200ResponseToJSON,
    UserIntegrationsWebhooksTestRequestFromJSON,
    UserIntegrationsWebhooksTestRequestToJSON,
    ValidationProblemFromJSON,
    ValidationProblemToJSON,
} from '../models/index.js';

export interface UserIntegrationsTokenRequest {
    grantType: string;
    clientId: string;
    clientSecret: string;
    scope?: string;
}

export interface UserIntegrationsWebhooksDeliveriesRequest {
    webhookEndpointId?: string;
    status?: number;
    eventType?: string;
    from?: Date;
    to?: Date;
    page?: number;
    pageSize?: number;
}

export interface UserIntegrationsWebhooksDeliveryRequest {
    webhookDeliveryId: string;
}

export interface UserIntegrationsWebhooksEndpointsOperationRequest {
    userIntegrationsWebhooksEndpointsRequest: UserIntegrationsWebhooksEndpointsRequest;
}

export interface UserIntegrationsWebhooksReplayRequest {
    webhookDeliveryId: string;
}

export interface UserIntegrationsWebhooksRotateSecretRequest {
    webhookEndpointId: string;
}

export interface UserIntegrationsWebhooksTestOperationRequest {
    userIntegrationsWebhooksTestRequest?: UserIntegrationsWebhooksTestRequest;
}

/**
 * WebhooksCredentialsApi - interface
 * 
 * @export
 * @interface WebhooksCredentialsApiInterface
 */
export interface WebhooksCredentialsApiInterface {
    /**
     * Every scope your organisation can grant a credential, grouped by area with the calls each one unlocks, and every webhook event your endpoints can subscribe to.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * @summary Read the scopes and events available to you
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksCredentialsApiInterface
     */
    userIntegrationsCatalogueRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsCatalogue200Response>>;

    /**
     * Every scope your organisation can grant a credential, grouped by area with the calls each one unlocks, and every webhook event your endpoints can subscribe to.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Read the scopes and events available to you
     */
    userIntegrationsCatalogue(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsCatalogue200Response>;

    /**
     * OAuth 2.0 client credentials. Form-encoded, no bearer token. Omit `scope` to receive every scope your credential holds; a requested scope it does not hold is refused with `invalid_scope`. There is no refresh token — request a new one when it expires.
     * @summary Get an access token
     * @param {string} grantType 
     * @param {string} clientId 
     * @param {string} clientSecret 
     * @param {string} [scope] Optional, space-separated
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksCredentialsApiInterface
     */
    userIntegrationsTokenRaw(requestParameters: UserIntegrationsTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TokenResponse>>;

    /**
     * OAuth 2.0 client credentials. Form-encoded, no bearer token. Omit `scope` to receive every scope your credential holds; a requested scope it does not hold is refused with `invalid_scope`. There is no refresh token — request a new one when it expires.
     * Get an access token
     */
    userIntegrationsToken(requestParameters: UserIntegrationsTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TokenResponse>;

    /**
     * The delivery log, newest first. Filters are query parameters.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * @summary List webhook deliveries
     * @param {string} [webhookEndpointId] One endpoint only
     * @param {number} [status] 0 Pending · 1 Success · 2 Failed · 3 Dead letter
     * @param {string} [eventType] One event type only
     * @param {Date} [from] Created on or after (UTC)
     * @param {Date} [to] Created before (UTC)
     * @param {number} [page] Page number
     * @param {number} [pageSize] Rows per page
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksCredentialsApiInterface
     */
    userIntegrationsWebhooksDeliveriesRaw(requestParameters: UserIntegrationsWebhooksDeliveriesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksDeliveries200Response>>;

    /**
     * The delivery log, newest first. Filters are query parameters.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * List webhook deliveries
     */
    userIntegrationsWebhooksDeliveries(requestParameters: UserIntegrationsWebhooksDeliveriesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksDeliveries200Response>;

    /**
     * One delivery and every attempt at it, newest first. It is answered in the same page shape as the list, with a single row.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * @summary Read one delivery with its attempts
     * @param {string} webhookDeliveryId The delivery
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksCredentialsApiInterface
     */
    userIntegrationsWebhooksDeliveryRaw(requestParameters: UserIntegrationsWebhooksDeliveryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksDeliveries200Response>>;

    /**
     * One delivery and every attempt at it, newest first. It is answered in the same page shape as the list, with a single row.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Read one delivery with its attempts
     */
    userIntegrationsWebhooksDelivery(requestParameters: UserIntegrationsWebhooksDeliveryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksDeliveries200Response>;

    /**
     * Send webhookEndpointId to update; leave it out to create. The URL must be HTTPS on a public internet address. A new endpoint starts as Pending verification with its own signing secret, returned only in this response; it receives events straight away, and its first successful delivery (or a test) makes it Active. isEnabled false disables the endpoint, true re-enables it (back to Pending verification), and null leaves the status alone. Changing the URL also returns it to Pending verification. subscribedEventTypes is the complete set, and every event must be one your organisation can receive. The events we send are listed under **Callbacks** below.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * @summary Register or update a webhook endpoint
     * @param {UserIntegrationsWebhooksEndpointsRequest} userIntegrationsWebhooksEndpointsRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksCredentialsApiInterface
     */
    userIntegrationsWebhooksEndpointsRaw(requestParameters: UserIntegrationsWebhooksEndpointsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksEndpoints200Response>>;

    /**
     * Send webhookEndpointId to update; leave it out to create. The URL must be HTTPS on a public internet address. A new endpoint starts as Pending verification with its own signing secret, returned only in this response; it receives events straight away, and its first successful delivery (or a test) makes it Active. isEnabled false disables the endpoint, true re-enables it (back to Pending verification), and null leaves the status alone. Changing the URL also returns it to Pending verification. subscribedEventTypes is the complete set, and every event must be one your organisation can receive. The events we send are listed under **Callbacks** below.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Register or update a webhook endpoint
     */
    userIntegrationsWebhooksEndpoints(requestParameters: UserIntegrationsWebhooksEndpointsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksEndpoints200Response>;

    /**
     * Queues a failed or dead-letter delivery from the last 30 days again, with the same eventId, so your deduplication still recognises it. No body is needed.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * @summary Replay a stopped delivery
     * @param {string} webhookDeliveryId The delivery to replay
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksCredentialsApiInterface
     */
    userIntegrationsWebhooksReplayRaw(requestParameters: UserIntegrationsWebhooksReplayRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksReplay200Response>>;

    /**
     * Queues a failed or dead-letter delivery from the last 30 days again, with the same eventId, so your deduplication still recognises it. No body is needed.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Replay a stopped delivery
     */
    userIntegrationsWebhooksReplay(requestParameters: UserIntegrationsWebhooksReplayRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksReplay200Response>;

    /**
     * Issues a new signing secret, returned only in this response. Deliveries are signed with the new secret from now on, so update your receiver straight away. No body is needed.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * @summary Rotate an endpoint\'s signing secret
     * @param {string} webhookEndpointId The endpoint
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksCredentialsApiInterface
     */
    userIntegrationsWebhooksRotateSecretRaw(requestParameters: UserIntegrationsWebhooksRotateSecretRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksRotateSecret200Response>>;

    /**
     * Issues a new signing secret, returned only in this response. Deliveries are signed with the new secret from now on, so update your receiver straight away. No body is needed.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Rotate an endpoint\'s signing secret
     */
    userIntegrationsWebhooksRotateSecret(requestParameters: UserIntegrationsWebhooksRotateSecretRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksRotateSecret200Response>;

    /**
     * Your endpoints and the event types you can subscribe to. Signing secrets are never returned here.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * @summary Read webhook settings
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksCredentialsApiInterface
     */
    userIntegrationsWebhooksSettingsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksSettings200Response>>;

    /**
     * Your endpoints and the event types you can subscribe to. Signing secrets are never returned here.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Read webhook settings
     */
    userIntegrationsWebhooksSettings(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksSettings200Response>;

    /**
     * Sends a signed `webhook.test` event. With webhookEndpointId it tests that endpoint whatever its subscriptions; without it, every endpoint subscribed to `webhook.test`. A successful test moves a Pending endpoint to Active.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * @summary Send a test delivery
     * @param {UserIntegrationsWebhooksTestRequest} [userIntegrationsWebhooksTestRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksCredentialsApiInterface
     */
    userIntegrationsWebhooksTestRaw(requestParameters: UserIntegrationsWebhooksTestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksTest200Response>>;

    /**
     * Sends a signed `webhook.test` event. With webhookEndpointId it tests that endpoint whatever its subscriptions; without it, every endpoint subscribed to `webhook.test`. A successful test moves a Pending endpoint to Active.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Send a test delivery
     */
    userIntegrationsWebhooksTest(requestParameters: UserIntegrationsWebhooksTestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksTest200Response>;

}

/**
 * 
 */
export class WebhooksCredentialsApi extends runtime.BaseAPI implements WebhooksCredentialsApiInterface {

    /**
     * Every scope your organisation can grant a credential, grouped by area with the calls each one unlocks, and every webhook event your endpoints can subscribe to.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Read the scopes and events available to you
     */
    async userIntegrationsCatalogueRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsCatalogue200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/user/api/integrations/catalogue`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserIntegrationsCatalogue200ResponseFromJSON(jsonValue));
    }

    /**
     * Every scope your organisation can grant a credential, grouped by area with the calls each one unlocks, and every webhook event your endpoints can subscribe to.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Read the scopes and events available to you
     */
    async userIntegrationsCatalogue(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsCatalogue200Response> {
        const response = await this.userIntegrationsCatalogueRaw(initOverrides);
        return await response.value();
    }

    /**
     * OAuth 2.0 client credentials. Form-encoded, no bearer token. Omit `scope` to receive every scope your credential holds; a requested scope it does not hold is refused with `invalid_scope`. There is no refresh token — request a new one when it expires.
     * Get an access token
     */
    async userIntegrationsTokenRaw(requestParameters: UserIntegrationsTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TokenResponse>> {
        if (requestParameters['grantType'] == null) {
            throw new runtime.RequiredError(
                'grantType',
                'Required parameter "grantType" was null or undefined when calling userIntegrationsToken().'
            );
        }

        if (requestParameters['clientId'] == null) {
            throw new runtime.RequiredError(
                'clientId',
                'Required parameter "clientId" was null or undefined when calling userIntegrationsToken().'
            );
        }

        if (requestParameters['clientSecret'] == null) {
            throw new runtime.RequiredError(
                'clientSecret',
                'Required parameter "clientSecret" was null or undefined when calling userIntegrationsToken().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const consumes: runtime.Consume[] = [
            { contentType: 'application/x-www-form-urlencoded' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters['grantType'] != null) {
            formParams.append('grant_type', requestParameters['grantType'] as any);
        }

        if (requestParameters['clientId'] != null) {
            formParams.append('client_id', requestParameters['clientId'] as any);
        }

        if (requestParameters['clientSecret'] != null) {
            formParams.append('client_secret', requestParameters['clientSecret'] as any);
        }

        if (requestParameters['scope'] != null) {
            formParams.append('scope', requestParameters['scope'] as any);
        }


        let urlPath = `/user/api/integrations/token`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TokenResponseFromJSON(jsonValue));
    }

    /**
     * OAuth 2.0 client credentials. Form-encoded, no bearer token. Omit `scope` to receive every scope your credential holds; a requested scope it does not hold is refused with `invalid_scope`. There is no refresh token — request a new one when it expires.
     * Get an access token
     */
    async userIntegrationsToken(requestParameters: UserIntegrationsTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TokenResponse> {
        const response = await this.userIntegrationsTokenRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * The delivery log, newest first. Filters are query parameters.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * List webhook deliveries
     */
    async userIntegrationsWebhooksDeliveriesRaw(requestParameters: UserIntegrationsWebhooksDeliveriesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksDeliveries200Response>> {
        const queryParameters: any = {};

        if (requestParameters['webhookEndpointId'] != null) {
            queryParameters['webhookEndpointId'] = requestParameters['webhookEndpointId'];
        }

        if (requestParameters['status'] != null) {
            queryParameters['status'] = requestParameters['status'];
        }

        if (requestParameters['eventType'] != null) {
            queryParameters['eventType'] = requestParameters['eventType'];
        }

        if (requestParameters['from'] != null) {
            queryParameters['from'] = (requestParameters['from'] as any).toISOString();
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = (requestParameters['to'] as any).toISOString();
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


        let urlPath = `/user/api/integrations/webhooks/deliveries`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserIntegrationsWebhooksDeliveries200ResponseFromJSON(jsonValue));
    }

    /**
     * The delivery log, newest first. Filters are query parameters.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * List webhook deliveries
     */
    async userIntegrationsWebhooksDeliveries(requestParameters: UserIntegrationsWebhooksDeliveriesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksDeliveries200Response> {
        const response = await this.userIntegrationsWebhooksDeliveriesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * One delivery and every attempt at it, newest first. It is answered in the same page shape as the list, with a single row.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Read one delivery with its attempts
     */
    async userIntegrationsWebhooksDeliveryRaw(requestParameters: UserIntegrationsWebhooksDeliveryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksDeliveries200Response>> {
        if (requestParameters['webhookDeliveryId'] == null) {
            throw new runtime.RequiredError(
                'webhookDeliveryId',
                'Required parameter "webhookDeliveryId" was null or undefined when calling userIntegrationsWebhooksDelivery().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/user/api/integrations/webhooks/deliveries/{webhookDeliveryId}`;
        urlPath = urlPath.replace(`{${"webhookDeliveryId"}}`, encodeURIComponent(String(requestParameters['webhookDeliveryId'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserIntegrationsWebhooksDeliveries200ResponseFromJSON(jsonValue));
    }

    /**
     * One delivery and every attempt at it, newest first. It is answered in the same page shape as the list, with a single row.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Read one delivery with its attempts
     */
    async userIntegrationsWebhooksDelivery(requestParameters: UserIntegrationsWebhooksDeliveryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksDeliveries200Response> {
        const response = await this.userIntegrationsWebhooksDeliveryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Send webhookEndpointId to update; leave it out to create. The URL must be HTTPS on a public internet address. A new endpoint starts as Pending verification with its own signing secret, returned only in this response; it receives events straight away, and its first successful delivery (or a test) makes it Active. isEnabled false disables the endpoint, true re-enables it (back to Pending verification), and null leaves the status alone. Changing the URL also returns it to Pending verification. subscribedEventTypes is the complete set, and every event must be one your organisation can receive. The events we send are listed under **Callbacks** below.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Register or update a webhook endpoint
     */
    async userIntegrationsWebhooksEndpointsRaw(requestParameters: UserIntegrationsWebhooksEndpointsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksEndpoints200Response>> {
        if (requestParameters['userIntegrationsWebhooksEndpointsRequest'] == null) {
            throw new runtime.RequiredError(
                'userIntegrationsWebhooksEndpointsRequest',
                'Required parameter "userIntegrationsWebhooksEndpointsRequest" was null or undefined when calling userIntegrationsWebhooksEndpoints().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["webhooks.write"]);
        }


        let urlPath = `/user/api/integrations/webhooks/endpoints`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserIntegrationsWebhooksEndpointsRequestToJSON(requestParameters['userIntegrationsWebhooksEndpointsRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserIntegrationsWebhooksEndpoints200ResponseFromJSON(jsonValue));
    }

    /**
     * Send webhookEndpointId to update; leave it out to create. The URL must be HTTPS on a public internet address. A new endpoint starts as Pending verification with its own signing secret, returned only in this response; it receives events straight away, and its first successful delivery (or a test) makes it Active. isEnabled false disables the endpoint, true re-enables it (back to Pending verification), and null leaves the status alone. Changing the URL also returns it to Pending verification. subscribedEventTypes is the complete set, and every event must be one your organisation can receive. The events we send are listed under **Callbacks** below.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Register or update a webhook endpoint
     */
    async userIntegrationsWebhooksEndpoints(requestParameters: UserIntegrationsWebhooksEndpointsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksEndpoints200Response> {
        const response = await this.userIntegrationsWebhooksEndpointsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Queues a failed or dead-letter delivery from the last 30 days again, with the same eventId, so your deduplication still recognises it. No body is needed.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Replay a stopped delivery
     */
    async userIntegrationsWebhooksReplayRaw(requestParameters: UserIntegrationsWebhooksReplayRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksReplay200Response>> {
        if (requestParameters['webhookDeliveryId'] == null) {
            throw new runtime.RequiredError(
                'webhookDeliveryId',
                'Required parameter "webhookDeliveryId" was null or undefined when calling userIntegrationsWebhooksReplay().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["webhooks.write"]);
        }


        let urlPath = `/user/api/integrations/webhooks/deliveries/{webhookDeliveryId}/replay`;
        urlPath = urlPath.replace(`{${"webhookDeliveryId"}}`, encodeURIComponent(String(requestParameters['webhookDeliveryId'])));

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserIntegrationsWebhooksReplay200ResponseFromJSON(jsonValue));
    }

    /**
     * Queues a failed or dead-letter delivery from the last 30 days again, with the same eventId, so your deduplication still recognises it. No body is needed.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Replay a stopped delivery
     */
    async userIntegrationsWebhooksReplay(requestParameters: UserIntegrationsWebhooksReplayRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksReplay200Response> {
        const response = await this.userIntegrationsWebhooksReplayRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Issues a new signing secret, returned only in this response. Deliveries are signed with the new secret from now on, so update your receiver straight away. No body is needed.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Rotate an endpoint\'s signing secret
     */
    async userIntegrationsWebhooksRotateSecretRaw(requestParameters: UserIntegrationsWebhooksRotateSecretRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksRotateSecret200Response>> {
        if (requestParameters['webhookEndpointId'] == null) {
            throw new runtime.RequiredError(
                'webhookEndpointId',
                'Required parameter "webhookEndpointId" was null or undefined when calling userIntegrationsWebhooksRotateSecret().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["webhooks.write"]);
        }


        let urlPath = `/user/api/integrations/webhooks/endpoints/{webhookEndpointId}/rotate-secret`;
        urlPath = urlPath.replace(`{${"webhookEndpointId"}}`, encodeURIComponent(String(requestParameters['webhookEndpointId'])));

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserIntegrationsWebhooksRotateSecret200ResponseFromJSON(jsonValue));
    }

    /**
     * Issues a new signing secret, returned only in this response. Deliveries are signed with the new secret from now on, so update your receiver straight away. No body is needed.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Rotate an endpoint\'s signing secret
     */
    async userIntegrationsWebhooksRotateSecret(requestParameters: UserIntegrationsWebhooksRotateSecretRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksRotateSecret200Response> {
        const response = await this.userIntegrationsWebhooksRotateSecretRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Your endpoints and the event types you can subscribe to. Signing secrets are never returned here.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Read webhook settings
     */
    async userIntegrationsWebhooksSettingsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksSettings200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", []);
        }


        let urlPath = `/user/api/integrations/webhooks/settings`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserIntegrationsWebhooksSettings200ResponseFromJSON(jsonValue));
    }

    /**
     * Your endpoints and the event types you can subscribe to. Signing secrets are never returned here.  **Required scope:** `webhooks.read` or `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Read webhook settings
     */
    async userIntegrationsWebhooksSettings(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksSettings200Response> {
        const response = await this.userIntegrationsWebhooksSettingsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Sends a signed `webhook.test` event. With webhookEndpointId it tests that endpoint whatever its subscriptions; without it, every endpoint subscribed to `webhook.test`. A successful test moves a Pending endpoint to Active.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Send a test delivery
     */
    async userIntegrationsWebhooksTestRaw(requestParameters: UserIntegrationsWebhooksTestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserIntegrationsWebhooksTest200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2ClientCredentials", ["webhooks.write"]);
        }


        let urlPath = `/user/api/integrations/webhooks/test`;

        const response = await this.request({
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserIntegrationsWebhooksTestRequestToJSON(requestParameters['userIntegrationsWebhooksTestRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserIntegrationsWebhooksTest200ResponseFromJSON(jsonValue));
    }

    /**
     * Sends a signed `webhook.test` event. With webhookEndpointId it tests that endpoint whatever its subscriptions; without it, every endpoint subscribed to `webhook.test`. A successful test moves a Pending endpoint to Active.  **Required scope:** `webhooks.write`  See **Responses** below for the status codes this operation can return.
     * Send a test delivery
     */
    async userIntegrationsWebhooksTest(requestParameters: UserIntegrationsWebhooksTestOperationRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserIntegrationsWebhooksTest200Response> {
        const response = await this.userIntegrationsWebhooksTestRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
