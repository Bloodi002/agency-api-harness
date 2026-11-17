import { RosteredAIClient, TOKEN_PATH } from '@rosteredai/sdk';

const camel = (operationId) => operationId.replace(/[_-]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, (c) => c.toLowerCase());

function resolveRef(spec, schema) {
  let current = schema;
  for (let depth = 0; current?.$ref && depth < 20; depth++) {
    current = current.$ref.replace(/^#\//, '').split('/').reduce((node, key) => node?.[key], spec);
  }
  return current ?? {};
}

function exampleOf(spec, schema, depth = 0) {
  const resolved = resolveRef(spec, schema);
  if (resolved.example !== undefined) return resolved.example;
  if (depth > 4) return undefined;
  if (resolved.type === 'array') {
    const item = exampleOf(spec, resolved.items, depth + 1);
    return item === undefined ? [] : [item];
  }
  if (resolved.properties) {
    return Object.fromEntries(Object.entries(resolved.properties)
      .map(([name, property]) => [name, exampleOf(spec, property, depth + 1)])
      .filter(([, value]) => value !== undefined));
  }
  return undefined;
}

// The generated method's own source is the truth for its request field names; the spec supplies the documentation.
function sdkFields(rawMethod) {
  const source = rawMethod.toString();
  const names = [...new Set([...source.matchAll(/requestParameters\['([^']+)'\]/g)].map((m) => m[1]))];
  const required = new Set([...source.matchAll(/RequiredError\('([^']+)'/g)].map((m) => m[1]));
  return names.map((name) => ({ name, required: required.has(name) }));
}

function describeOperation(spec, api, group, method, rawMethod, path, httpMethod, operation) {
  const parameters = Object.fromEntries((operation.parameters ?? []).map((p) => [camel(p.name), p]));
  const json = operation.requestBody?.content?.['application/json'];
  const form = operation.requestBody?.content?.['multipart/form-data'];
  const formProperties = resolveRef(spec, form?.schema).properties ?? {};
  const fields = sdkFields(rawMethod).map(({ name, required }) => {
    const parameter = parameters[name];
    if (parameter) {
      return { name, required, in: parameter.in, description: parameter.description ?? '', example: parameter.example ?? resolveRef(spec, parameter.schema).example, schema: parameter.schema };
    }
    if (form && formProperties[name] !== undefined) {
      const property = resolveRef(spec, formProperties[name]);
      const binary = property.format === 'binary' || resolveRef(spec, property.items).format === 'binary';
      return { name, required, in: 'form', binary, multiple: property.type === 'array', description: property.description ?? '', example: binary ? undefined : property.example };
    }
    return { name, required, in: 'body', description: operation.requestBody?.description ?? 'Request body (JSON)', example: json?.example ?? exampleOf(spec, json?.schema), schema: json?.schema };
  });
  return {
    id: `${group}.${method}`,
    api,
    group,
    method,
    tag: operation.tags?.[0] ?? group,
    httpMethod: httpMethod.toUpperCase(),
    path,
    summary: operation.summary ?? '',
    description: operation.description ?? '',
    scopes: (operation.security ?? spec.security ?? []).flatMap((s) => Object.values(s).flat()),
    fields,
  };
}

/** Every operation the SDK exposes for both APIs, keyed api -> id, with the spec's documentation attached. */
export function buildCatalogue(specs) {
  const probe = new RosteredAIClient({ baseUrl: 'https://catalogue.invalid', clientId: 'catalogue', clientSecret: 'catalogue' });
  const catalogue = {};
  const unmatched = [];
  for (const [api, specText] of Object.entries(specs)) {
    const spec = JSON.parse(specText);
    const byMethod = new Map();
    for (const [path, item] of Object.entries(spec.paths)) {
      for (const [httpMethod, operation] of Object.entries(item)) {
        if (operation?.operationId) byMethod.set(camel(operation.operationId), { path, httpMethod, operation });
      }
    }
    catalogue[api] = new Map();
    for (const [group, instance] of Object.entries(probe[api])) {
      if (group === 'configuration') continue;
      for (const name of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
        if (!name.endsWith('Raw')) continue;
        const method = name.slice(0, -3);
        const found = byMethod.get(method);
        if (!found) { unmatched.push(`${api}.${group}.${method}`); continue; }
        byMethod.delete(method);
        // The client fetches tokens itself; calling the token operation by hand would test nothing the SDK does.
        if (found.path === TOKEN_PATH) continue;
        const entry = describeOperation(spec, api, group, method, instance[name], found.path, found.httpMethod, found.operation);
        catalogue[api].set(entry.id, entry);
      }
    }
    unmatched.push(...[...byMethod.keys()].map((m) => `${api} spec operation ${m} has no SDK method`));
  }
  return { catalogue, unmatched };
}

/** Turns ISO strings into Dates wherever the spec says date or date-time, because the generated serialisers call toISOString(). */
export function reviveDates(spec, schema, value) {
  const resolved = resolveRef(spec, schema);
  if (value === null || value === undefined) return value;
  if ((resolved.format === 'date-time' || resolved.format === 'date') && typeof value === 'string') {
    const date = new Date(/T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(value) ? `${value}Z` : value);
    if (Number.isNaN(date.getTime())) throw Object.assign(new Error(`"${value}" is not a valid ${resolved.format}`), { status: 400 });
    return date;
  }
  if (resolved.type === 'array' && Array.isArray(value)) return value.map((item) => reviveDates(spec, resolved.items, item));
  if (resolved.properties && typeof value === 'object' && !Array.isArray(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolved.properties[key] ? reviveDates(spec, resolved.properties[key], item) : item]));
  }
  return value;
}
