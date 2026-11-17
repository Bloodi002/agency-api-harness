import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const APIS = { tenant: 'tenant.json', agency: 'agency.json' };

// The SDK's own copies of the published specs: they document each operation the explorer lists.
export function loadSpecs(dir) {
  return Object.fromEntries(Object.entries(APIS).map(([api, file]) => [api, readFileSync(resolve(dir, file), 'utf8')]));
}
