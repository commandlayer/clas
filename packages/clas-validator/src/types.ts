export const TRUST_VERIFICATION_VERBS = [
  "verify",
  "authenticate",
  "authorize",
  "attest",
  "sign",
  "permit",
  "grant",
  "approve",
  "reject",
  "endorse",
] as const;

export type ClasTrustVerificationVerb =
  (typeof TRUST_VERIFICATION_VERBS)[number];

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};
