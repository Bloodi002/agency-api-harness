import { TokenProvider } from './auth.js';
import { ApiError } from './errors.js';
import { createTransport } from './retry.js';
import * as Agency from './generated/agency/index.js';
import * as Tenant from './generated/tenant/index.js';

export const SDK_VERSION = '0.1.0';
export const USER_AGENT = `rosteredai-sdk-node/${SDK_VERSION}`;

export interface RosteredAIClientOptions {
  /** Host only, e.g. `https://api.rostered.ai`; a trailing slash is trimmed. */
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  /** Scopes to request; omitted means every scope the credential holds. */
  scopes?: readonly string[];
  /** Per-attempt timeout in milliseconds. Default 30 000. */
  timeoutMs?: number;
  /** Retries for 429/502/503/504 and network errors on GET, HEAD, PUT, DELETE and OPTIONS. Default 3. */
  maxRetries?: number;
  /** Replacement for the global fetch (proxies, tests). */
  fetch?: typeof fetch;
}

/** The business (tenant) API classes, configured with this client's base URL, auth and retries. */
export interface TenantApis {
  readonly configuration: Tenant.Configuration;
  readonly agencyDispatch: Tenant.AgencyDispatchApi;
  readonly availabilityLeave: Tenant.AvailabilityLeaveApi;
  readonly awards: Tenant.AwardsApi;
  readonly formsTasks: Tenant.FormsTasksApi;
  readonly organisationLocations: Tenant.OrganisationLocationsApi;
  readonly payConditions: Tenant.PayConditionsApi;
  readonly qualifications: Tenant.QualificationsApi;
  readonly rosters: Tenant.RostersApi;
  readonly staff: Tenant.StaffApi;
  readonly staffFinance: Tenant.StaffFinanceSensitiveApi;
  readonly timesheetsPayroll: Tenant.TimesheetsPayrollApi;
  readonly webhooksCredentials: Tenant.WebhooksCredentialsApi;
}

/** The agency partner API classes, configured with this client's base URL, auth and retries. */
export interface AgencyApis {
  readonly configuration: Agency.Configuration;
  readonly agencyTimesheets: Agency.AgencyTimesheetsApi;
  readonly authentication: Agency.AuthenticationApi;
  readonly businessProfile: Agency.BusinessProfileApi;
  readonly candidatesQualifications: Agency.CandidatesQualificationsApi;
  readonly clients: Agency.ClientsApi;
  readonly compliance: Agency.ComplianceApi;
  readonly placements: Agency.PlacementsApi;
  readonly shiftRequests: Agency.ShiftRequestsApi;
  readonly skills: Agency.SkillsApi;
  readonly staffQualifications: Agency.StaffQualificationsApi;
  readonly webhookManagement: Agency.WebhookManagementApi;
}

/** Entry point: one client per credential, safe to share across concurrent requests. */
export class RosteredAIClient {
  readonly baseUrl: string;
  readonly tenant: TenantApis;
  readonly agency: AgencyApis;
  private readonly tokens: TokenProvider;

  constructor(options: RosteredAIClientOptions) {
    if (!options.baseUrl) throw new TypeError('baseUrl is required');
    if (!options.clientId || !options.clientSecret) throw new TypeError('clientId and clientSecret are required');

    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    const timeoutMs = options.timeoutMs ?? 30_000;
    const maxRetries = Math.max(0, options.maxRetries ?? 3);
    const baseFetch = options.fetch ?? globalThis.fetch.bind(globalThis);

    this.tokens = new TokenProvider({
      baseUrl: this.baseUrl,
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      scopes: options.scopes,
      fetch: baseFetch,
      userAgent: USER_AGENT,
      timeoutMs,
    });

    const settings = {
      basePath: this.baseUrl,
      fetchApi: createTransport({ fetch: baseFetch, tokens: this.tokens, maxRetries, timeoutMs, userAgent: USER_AGENT }),
      middleware: [errorMiddleware],
    };
    this.tenant = tenantApis(new Tenant.Configuration(settings));
    this.agency = agencyApis(new Agency.Configuration(settings));
  }

  /** A bearer token for this credential, cached until 60 s before it expires. */
  getAccessToken(): Promise<string> {
    return this.tokens.getToken();
  }
}

// Throws ApiError before the generated code wraps the response in its own ResponseError; rethrows transport errors unwrapped.
const errorMiddleware: Tenant.Middleware & Agency.Middleware = {
  async post({ response }) {
    if (response.status < 200 || response.status >= 300) throw await ApiError.fromResponse(response);
  },
  async onError({ error }) {
    throw error;
  },
};

function tenantApis(configuration: Tenant.Configuration): TenantApis {
  return {
    configuration,
    agencyDispatch: new Tenant.AgencyDispatchApi(configuration),
    availabilityLeave: new Tenant.AvailabilityLeaveApi(configuration),
    awards: new Tenant.AwardsApi(configuration),
    formsTasks: new Tenant.FormsTasksApi(configuration),
    organisationLocations: new Tenant.OrganisationLocationsApi(configuration),
    payConditions: new Tenant.PayConditionsApi(configuration),
    qualifications: new Tenant.QualificationsApi(configuration),
    rosters: new Tenant.RostersApi(configuration),
    staff: new Tenant.StaffApi(configuration),
    staffFinance: new Tenant.StaffFinanceSensitiveApi(configuration),
    timesheetsPayroll: new Tenant.TimesheetsPayrollApi(configuration),
    webhooksCredentials: new Tenant.WebhooksCredentialsApi(configuration),
  };
}

function agencyApis(configuration: Agency.Configuration): AgencyApis {
  return {
    configuration,
    agencyTimesheets: new Agency.AgencyTimesheetsApi(configuration),
    authentication: new Agency.AuthenticationApi(configuration),
    businessProfile: new Agency.BusinessProfileApi(configuration),
    candidatesQualifications: new Agency.CandidatesQualificationsApi(configuration),
    clients: new Agency.ClientsApi(configuration),
    compliance: new Agency.ComplianceApi(configuration),
    placements: new Agency.PlacementsApi(configuration),
    shiftRequests: new Agency.ShiftRequestsApi(configuration),
    skills: new Agency.SkillsApi(configuration),
    staffQualifications: new Agency.StaffQualificationsApi(configuration),
    webhookManagement: new Agency.WebhookManagementApi(configuration),
  };
}
