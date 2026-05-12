#!/usr/bin/env node
'use strict';

const path = require('node:path');
const fs = require('node:fs');

const HELP = `Usage: clas-validate <file.json> [options]

Options:
  --verb <verb>    Action verb (e.g. verify, authenticate, authorize)
                   Auto-detected from file content if omitted
  --kind <kind>    request or receipt (auto-detected if omitted)
  --help           Show this help

Examples:
  clas-validate receipt.json
  clas-validate request.json --verb verify --kind request
`;

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help')) {
  process.stdout.write(HELP);
  process.exit(0);
}

let filePath = null;
let verb = null;
let kind = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--verb' && args[i + 1]) { verb = args[++i]; continue; }
  if (args[i] === '--kind' && args[i + 1]) { kind = args[++i]; continue; }
  if (!args[i].startsWith('--')) { filePath = args[i]; }
}

if (!filePath) {
  process.stderr.write('Error: no input file specified\n');
  process.exit(1);
}

const resolved = path.resolve(filePath);
if (!fs.existsSync(resolved)) {
  process.stderr.write(`Error: file not found: ${resolved}\n`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(resolved, 'utf8'));
} catch (e) {
  process.stderr.write(`Error: invalid JSON: ${e.message}\n`);
  process.exit(1);
}

verb = verb || data.verb;
if (!verb) {
  process.stderr.write('Error: could not detect verb from file content. Use --verb <verb>\n');
  process.exit(1);
}

kind = kind || (data.proof !== undefined ? 'receipt' : 'request');

let validator;
try {
  validator = require('../dist/index.js');
} catch (e) {
  process.stderr.write(`Error: could not load validator (run npm run build first)\n${e.message}\n`);
  process.exit(1);
}

const fn = kind === 'receipt' ? validator.validateTrustReceipt : validator.validateTrustRequest;
const result = fn(verb, data);

if (result.valid) {
  process.stdout.write(`VALID ${kind} — verb: ${verb}\n`);
  process.exit(0);
} else {
  process.stderr.write(`INVALID ${kind} — verb: ${verb}\n`);
  for (const err of result.errors) {
    process.stderr.write(`  ${err}\n`);
  }
  process.exit(1);
}
