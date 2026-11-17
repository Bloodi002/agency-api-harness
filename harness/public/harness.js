// Shared helpers for the harness pages; no framework.
window.harness = {
  async api(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      headers: { 'content-type': 'application/json', ...(options.headers ?? {}) },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    if (response.status === 401) window.location.href = `/login?next=${encodeURIComponent(location.pathname + location.search)}`;
    const text = await response.text();
    const data = text ? JSON.parse(text) : undefined;
    if (!response.ok) throw new Error(data?.message ?? `HTTP ${response.status}`);
    return data;
  },

  config() {
    this.configPromise ??= this.api('/api/config');
    return this.configPromise;
  },

  // Fills every [data-environment] element with "SIT (gateway)".
  async showEnvironment() {
    const { environmentName, baseUrl, sdkVersion } = await this.config();
    document.querySelectorAll('[data-environment]').forEach((el) => { el.textContent = `${environmentName} · ${baseUrl}`; });
    document.querySelectorAll('[data-sdk-version]').forEach((el) => { el.textContent = sdkVersion; });
  },

  // Credentials live in this tab's sessionStorage only, one per API, so a tenant secret never reaches an agency call.
  credential(api) {
    try { return JSON.parse(sessionStorage.getItem(`harness.credential.${api}`) ?? '{}'); } catch { return {}; }
  },

  saveCredential(api, credential) {
    try { sessionStorage.setItem(`harness.credential.${api}`, JSON.stringify(credential)); } catch { /* storage blocked: re-enter each time */ }
  },

  cell(text, className) {
    const td = document.createElement('td');
    td.textContent = text ?? '';
    if (className) td.className = className;
    return td;
  },
};
