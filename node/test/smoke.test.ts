import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Agency, Tenant, USER_AGENT } from '../src/index.js';
import { BASE_URL, FakeFetch, client, json, ok, TENANT_ID } from './fake-fetch.js';

test('tenant call hits the absolute /tenant URL with the bearer token', async () => {
  const fake = new FakeFetch().queue(ok);
  const response = await client(fake).tenant.organisationLocations.tenantGetTenant({ id: TENANT_ID });
  assert.equal(response.data?.tenantId, TENANT_ID);
  const [request] = fake.apiRequests;
  assert.equal(request?.method, 'GET');
  assert.equal(request?.url, `${BASE_URL}/tenant/api/Tenant/get-tenant?id=${TENANT_ID}`);
  assert.equal(request?.headers.get('authorization'), 'Bearer tok-1');
  assert.equal(request?.headers.get('user-agent'), USER_AGENT);
});

test('agency call hits the absolute /partners URL with the bearer token', async () => {
  const fake = new FakeFetch().queue(() => json(200, { data: [], message: 'OK' }));
  await client(fake).agency.skills.agencySkills({ agencySkillsRequest: { isActive: true } });
  const [request] = fake.apiRequests;
  assert.equal(request?.method, 'POST');
  assert.equal(request?.url, `${BASE_URL}/partners/agency/skills`);
  assert.equal(request?.headers.get('authorization'), 'Bearer tok-1');
  assert.equal(request?.headers.get('user-agent'), USER_AGENT);
  assert.deepEqual(JSON.parse(request?.body ?? ''), { isActive: true });
});

test('the token request carries the User-Agent and no bearer token', async () => {
  const fake = new FakeFetch();
  await client(fake).getAccessToken();
  assert.equal(fake.requests[0]?.headers.get('user-agent'), USER_AGENT);
  assert.equal(fake.requests[0]?.headers.has('authorization'), false);
});

test('agency staff qualification call hits the gateway root, not /partners', async () => {
  const fake = new FakeFetch().queue(() => json(200, { data: null, message: 'OK' }));
  await client(fake).agency.staffQualifications.staffAgencyGetQualificationDetails({ qualificationId: 'q-1' });
  assert.equal(fake.apiRequests[0]?.url, `${BASE_URL}/staff/get-qualification-details?qualificationId=q-1`);
});

test('a multipart id list is sent one part per id', async () => {
  const fake = new FakeFetch().queue(() => json(200, { data: null, message: 'OK' }));
  const ids = ['6c9e2f5a-1b8d-4d3f-9a7e-3c5b8d1f4e29', 'a1c9e7d2-4b3f-4f8e-9a6c-2e5d7b8f1c04'];
  await client(fake).tenant.qualifications.staffAddUpdateStaffQualificationDetails({ companyType: 1, deletedAttachments: ids });
  assert.deepEqual(fake.apiRequests[0]?.form?.getAll('deletedAttachments'), ids);
});

test('a date-time without an offset reads as UTC, and one with an offset keeps it', async () => {
  // The live API sends date-times without an offset; they are UTC, never the caller's local time.
  const fake = new FakeFetch().queue(() => json(200, { data: [
    { locationName: 'Depot', createdDate: '2026-07-09T04:35:53.583', countryDetails: null },
    { locationName: 'Yard', createdDate: '2026-07-09T14:35:53+10:00' },
  ], message: 'OK' }));
  const response = await client(fake).tenant.organisationLocations.tenantGetLocation({ tenantId: TENANT_ID });
  assert.equal(response.data?.[0]?.createdDate?.toISOString(), '2026-07-09T04:35:53.583Z');
  assert.equal(response.data?.[1]?.createdDate?.toISOString(), '2026-07-09T04:35:53.000Z');
});

test('a wall-clock shift time comes back exactly as sent', async () => {
  const fake = new FakeFetch().queue(() => json(200, { data: { success: true, message: 'ok', data: { patternStartDate: '2026-11-16T07:00:00', timeZone: 'Australia/Sydney' } }, message: 'ok' }));
  const response = await client(fake).tenant.rosters.schedulingGetRecurringShiftPatternById({ patternId: TENANT_ID, tenantId: TENANT_ID });
  assert.equal(response.data?.data?.patternStartDate, '2026-11-16T07:00:00');
  assert.equal(response.data?.data?.timeZone, 'Australia/Sydney');
});

test('every generated API class is reachable from the client', () => {
  const c = client(new FakeFetch());
  const missing = (generated: Record<string, unknown>, exposed: object) =>
    Object.entries(generated)
      .filter(([name, value]) => name.endsWith('Api') && typeof value === 'function')
      .filter(([, cls]) => !Object.values(exposed).some((api) => api instanceof (cls as new (...args: never[]) => unknown)))
      .map(([name]) => name);
  assert.deepEqual(missing(Tenant, c.tenant), []);
  assert.deepEqual(missing(Agency, c.agency), []);
});

test('agency timesheets call hits the gateway root /timesheet, not /partners', async () => {
  const fake = new FakeFetch().queue(() => json(200, { data: null, message: 'OK' }));
  await client(fake).agency.agencyTimesheets.timesheetsAgencyGetAgencyTimesheets({
    timesheetsGetAgencyTimesheetsRequest: { fromDate: '2026-11-01T00:00:00', toDate: '2026-11-07T00:00:00' },
  });
  assert.equal(fake.apiRequests[0]?.method, 'POST');
  assert.equal(fake.apiRequests[0]?.url, `${BASE_URL}/timesheet/get-agency-timesheets`);
});
