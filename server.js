// Plain-Node entry point: builds the SDK once if it is missing, then starts the harness.
const { existsSync } = require('node:fs');
const { execSync } = require('node:child_process');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');

const root = __dirname;
const sdkBuilt = existsSync(join(root, 'node', 'dist', 'index.js'));
const sdkLinked = existsSync(join(root, 'harness', 'node_modules', '@rosteredai', 'sdk', 'package.json'));

if (!sdkBuilt || !sdkLinked) {
  console.log('Building the SDK for the harness...');
  execSync('npm run build', { cwd: root, stdio: 'inherit' });
}

import(pathToFileURL(join(root, 'harness', 'server.mjs')).href).catch((error) => {
  console.error(error);
  process.exit(1);
});
