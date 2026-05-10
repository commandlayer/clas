import Ajv, { ErrorObject, ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import {
  ClasTrustVerificationVerb,
  ValidationResult,
} from "./types";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const schemaCache = new Map<string, ValidateFunction>();

function formatAjvError(error: ErrorObject): string {
  const location = error.instancePath || "/";
  return `${location} ${error.message ?? "is invalid"}`;
}

function getSchemaPath(
  verb: ClasTrustVerificationVerb,
  kind: "request" | "receipt",
): string {
  return path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "schemas",
    "trust-verification",
    verb,
    `${verb}.${kind}.schema.json`,
  );
}

function getValidator(
  verb: ClasTrustVerificationVerb,
  kind: "request" | "receipt",
): ValidateFunction {
  const key = `${verb}:${kind}`;
  const existing = schemaCache.get(key);
  if (existing) {
    return existing;
  }

  const schemaPath = getSchemaPath(verb, kind);
  if (!existsSync(schemaPath)) {
    throw new Error(
      `Schema file not found for ${key}: ${schemaPath}. This validator currently expects to run from within the CLAS repository layout.`,
    );
  }

  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  const validator = ajv.compile(schema);
  schemaCache.set(key, validator);
  return validator;
}

function validateByKind(
  verb: ClasTrustVerificationVerb,
  data: unknown,
  kind: "request" | "receipt",
): ValidationResult {
  const validator = getValidator(verb, kind);
  const valid = Boolean(validator(data));
  const errors = valid
    ? []
    : (validator.errors ?? []).map((error) => formatAjvError(error));

  return { valid, errors };
}


export function validateTrustRequest(
  verb: ClasTrustVerificationVerb,
  data: unknown,
): ValidationResult {
  return validateByKind(verb, data, "request");
}

export function validateTrustReceipt(
  verb: ClasTrustVerificationVerb,
  data: unknown,
): ValidationResult {
  return validateByKind(verb, data, "receipt");
}

export function assertValidTrustRequest(
  verb: ClasTrustVerificationVerb,
  data: unknown,
): void {
  const result = validateTrustRequest(verb, data);
  if (!result.valid) {
    throw new Error(
      `Invalid trust request for '${verb}': ${result.errors.join("; ")}`,
    );
  }
}

export function assertValidTrustReceipt(
  verb: ClasTrustVerificationVerb,
  data: unknown,
): void {
  const result = validateTrustReceipt(verb, data);
  if (!result.valid) {
    throw new Error(
      `Invalid trust receipt for '${verb}': ${result.errors.join("; ")}`,
    );
  }
}
