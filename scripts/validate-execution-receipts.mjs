import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const schemaPath = path.join(repoRoot, 'schemas', 'execution', 'execution.receipt.schema.json');
const examplesDir = path.join(repoRoot, 'examples', 'execution');

const EXPECTATIONS = [
  { file: 'approve.execution.receipt.json', shouldPass: true },
  { file: 'approve.execution-private-settlement.receipt.json', shouldPass: true },
  { file: 'approve.execution-private-settlement.invalid-agent-covers-settlement.json', shouldPass: false },
];

function fail(msg) {
  process.stderr.write(`ERROR: ${msg}\n`);
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (!fs.existsSync(schemaPath)) fail(`Missing schema: ${schemaPath}`);
if (!fs.existsSync(examplesDir)) fail(`Missing examples directory: ${examplesDir}`);

const ajv = new Ajv2020({ allErrors: true, strict: false, validateFormats: true });
addFormats(ajv);
const schema = readJson(schemaPath);
const validate = ajv.compile(schema);

let failed = false;
process.stdout.write('\n[execution receipts]\n');

for (const { file, shouldPass } of EXPECTATIONS) {
  const targetPath = path.join(examplesDir, file);
  if (!fs.existsSync(targetPath)) fail(`Missing example file: ${targetPath}`);

  const payload = readJson(targetPath);
  const ok = validate(payload);
  const expectationMet = Boolean(ok) === shouldPass;
  const status = expectationMet ? 'PASS' : 'FAIL';
  const expected = shouldPass ? 'valid' : 'invalid';
  const got = ok ? 'valid' : 'invalid';
  process.stdout.write(`  ${status} ${file} expected ${expected}, got ${got}\n`);

  if (!expectationMet) {
    failed = true;
    for (const err of validate.errors ?? []) {
      process.stdout.write(`    - ${err.instancePath || '/'} ${err.message}\n`);
    }
  }
}

const executionOnly = readJson(path.join(examplesDir, 'approve.execution.receipt.json'));
const withSettlement = readJson(path.join(examplesDir, 'approve.execution-private-settlement.receipt.json'));

const malformedProofPayloads = [
  {
    name: 'missing proofs[]',
    payload: (() => {
      const copy = structuredClone(executionOnly);
      delete copy.proofs;
      return copy;
    })(),
  },
  {
    name: 'unknown proof type',
    payload: (() => {
      const copy = structuredClone(executionOnly);
      copy.proofs[0].type = 'payment';
      return copy;
    })(),
  },
  {
    name: 'execution proof covers settlement',
    payload: (() => {
      const copy = structuredClone(withSettlement);
      copy.proofs[0].covers = ['receipt_id', 'verb', 'agent', 'action', 'settlement'];
      return copy;
    })(),
  },
  {
    name: 'settlement proof covers action',
    payload: (() => {
      const copy = structuredClone(withSettlement);
      copy.proofs[1].covers = ['receipt_id', 'settlement', 'action'];
      return copy;
    })(),
  },
  {
    name: 'settlement without settlement proof',
    payload: (() => {
      const copy = structuredClone(withSettlement);
      copy.proofs = [copy.proofs[0]];
      return copy;
    })(),
  },
  {
    name: 'raw transaction hash payment_ref',
    payload: (() => {
      const copy = structuredClone(withSettlement);
      copy.settlement.payment_ref = `0x${'a'.repeat(64)}`;
      return copy;
    })(),
  },
];

for (const { name, payload } of malformedProofPayloads) {
  const ok = validate(payload);
  const passes = !ok;
  process.stdout.write(`  ${passes ? 'PASS' : 'FAIL'} malformed proofs/privacy rejected: ${name}\n`);
  if (!passes) failed = true;
}

const settlement = withSettlement.settlement;
const hasPublicStealthAddress = Object.prototype.hasOwnProperty.call(settlement, 'stealth_address');
process.stdout.write(`  ${!hasPublicStealthAddress ? 'PASS' : 'FAIL'} privacy example omits public settlement.stealth_address field\n`);
if (hasPublicStealthAddress) failed = true;

const rawTxHashPattern = /^0x[a-fA-F0-9]{64}$/;
const paymentRefIsOpaque = !rawTxHashPattern.test(settlement.payment_ref);
process.stdout.write(`  ${paymentRefIsOpaque ? 'PASS' : 'FAIL'} privacy example payment_ref is opaque, not raw 0x transaction hash\n`);
if (!paymentRefIsOpaque) failed = true;

const payeeCommitmentOk = /^sha256:.+/.test(settlement.payee_commitment);
process.stdout.write(`  ${payeeCommitmentOk ? 'PASS' : 'FAIL'} privacy example uses sha256 payee_commitment\n`);
if (!payeeCommitmentOk) failed = true;

if (failed) {
  process.stderr.write('\nOne or more execution receipt validations failed.\n');
  process.exit(1);
}

process.stdout.write('\nAll execution receipt validations matched expected outcomes.\n');
