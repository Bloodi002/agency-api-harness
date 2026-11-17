// The harness talks to one environment only (SIT), through the SDK; ROSTEREDAI_BASE_URL is its gateway root.
export function readConfig(env) {
  const raw = env.ROSTEREDAI_BASE_URL;
  if (!raw) throw new Error('ROSTEREDAI_BASE_URL is not set; set it to the SIT gateway, e.g. https://dev.rostered.ai/api.rosteredaidev');
  const url = new URL(raw);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('ROSTEREDAI_BASE_URL must be http or https');
  // The harness proxies real SIT calls, so it never runs open.
  if (!env.HARNESS_PASSWORD) throw new Error('HARNESS_PASSWORD is not set; the harness refuses to start without a shared QA password');
  return {
    port: Number(env.PORT ?? 8080),
    baseUrl: `${url.origin}${url.pathname.replace(/\/+$/, '')}`,
    environmentName: env.HARNESS_ENVIRONMENT_NAME ?? 'SIT',
    password: env.HARNESS_PASSWORD,
  };
}
