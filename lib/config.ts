/**
 * Server configuration for the form pipeline. Every external service is
 * read from env vars (CLAUDE.md §13). When a service is not configured:
 *  - in development (and in E2E runs with E2E_FAKE_BACKENDS=1) a local
 *    in-memory stand-in is used so the forms can be exercised end to end;
 *  - in production the request fails closed with ConfigError → HTTP 503,
 *    so a misconfigured deployment can never show a false success.
 */

export class ConfigError extends Error {
  constructor(missing: string[]) {
    super(`Form backend not configured: missing ${missing.join(", ")}`);
    this.name = "ConfigError";
  }
}

/** Cloudflare's documented Turnstile test keys (always pass). Dev only. */
export const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

export type Backends = {
  store: { kind: "neon"; url: string } | { kind: "memory" };
  mail:
    | { kind: "resend"; apiKey: string; from: string; enquiryTo: string; careersTo: string }
    | { kind: "outbox" };
  files:
    | { kind: "r2"; accountId: string; accessKeyId: string; secretAccessKey: string; bucket: string }
    | { kind: "memory" };
  turnstile: { kind: "verify"; secret: string } | { kind: "skip" };
  ipHashSalt: string;
};

export function fakesAllowed(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.E2E_FAKE_BACKENDS === "1";
}

function env(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}

export function getBackends(): Backends {
  const missing: string[] = [];
  const fakes = fakesAllowed();

  const databaseUrl = env("DATABASE_URL");
  if (!databaseUrl && !fakes) missing.push("DATABASE_URL");

  const resendKey = env("RESEND_API_KEY");
  const from = env("ENQUIRY_FROM_EMAIL");
  const enquiryTo = env("ENQUIRY_TO_EMAIL");
  const careersTo = env("CAREERS_TO_EMAIL") ?? enquiryTo;
  const mailConfigured = !!(resendKey && from && enquiryTo && careersTo);
  if (!mailConfigured && !fakes) missing.push("RESEND_API_KEY / ENQUIRY_FROM_EMAIL / ENQUIRY_TO_EMAIL");

  const r2 = {
    accountId: env("R2_ACCOUNT_ID"),
    accessKeyId: env("R2_ACCESS_KEY_ID"),
    secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
    bucket: env("R2_BUCKET"),
  };
  const filesConfigured = Object.values(r2).every(Boolean);
  if (!filesConfigured && !fakes) missing.push("R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET");

  const turnstileSecret = env("TURNSTILE_SECRET_KEY");
  if (!turnstileSecret && !fakes) missing.push("TURNSTILE_SECRET_KEY");

  const salt = env("IP_HASH_SALT");
  if (!salt && !fakes) missing.push("IP_HASH_SALT");

  if (missing.length) throw new ConfigError(missing);

  return {
    store: databaseUrl ? { kind: "neon", url: databaseUrl } : { kind: "memory" },
    mail: mailConfigured
      ? { kind: "resend", apiKey: resendKey!, from: from!, enquiryTo: enquiryTo!, careersTo: careersTo! }
      : { kind: "outbox" },
    files: filesConfigured
      ? {
          kind: "r2",
          accountId: r2.accountId!,
          accessKeyId: r2.accessKeyId!,
          secretAccessKey: r2.secretAccessKey!,
          bucket: r2.bucket!,
        }
      : { kind: "memory" },
    turnstile: turnstileSecret
      ? { kind: "verify", secret: turnstileSecret }
      : process.env.NODE_ENV !== "production"
        ? { kind: "verify", secret: TURNSTILE_TEST_SECRET }
        : { kind: "skip" },
    ipHashSalt: salt ?? "dev-only-salt",
  };
}
