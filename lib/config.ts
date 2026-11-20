/**
 * Server configuration for the form pipeline, read from env vars (CLAUDE.md §13).
 *
 * Only email is essential in production: the company's own mailbox over SMTP
 * (preferred, no third-party service) or Resend. Everything else is optional:
 *  - no DATABASE_URL → "mail-only": the notification email is the record;
 *    rate limiting falls back to memory (per Worker instance, best effort);
 *  - no R2 → CVs are attached to the careers email instead of linked;
 *  - no Turnstile keys → honeypot, timing check and rate limit only.
 *
 * Without any email transport:
 *  - in development, E2E runs (E2E_FAKE_BACKENDS=1) and client review
 *    previews (NEXT_PUBLIC_REVIEW_MODE=1) a local outbox is used and the
 *    success response is flagged `demo` so the visitor is told nothing was sent;
 *  - in production the request fails closed with ConfigError → HTTP 503,
 *    so a misconfigured deployment can never show a false success.
 */
import type { SmtpSecurity } from "@/lib/email/smtp";

export class ConfigError extends Error {
  constructor(missing: string[]) {
    super(`Form backend not configured: missing ${missing.join(", ")}`);
    this.name = "ConfigError";
  }
}

/** Cloudflare's documented Turnstile test keys (always pass). Dev only. */
export const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

type Addresses = { from: string; enquiryTo: string; careersTo: string };

export type Backends = {
  /** "mail-only": nothing is stored; the email is the record. */
  store: { kind: "neon"; url: string } | { kind: "mail-only" } | { kind: "memory" };
  mail:
    | ({ kind: "smtp"; host: string; port: number; secure: SmtpSecurity; user?: string; pass?: string } & Addresses)
    | ({ kind: "resend"; apiKey: string } & Addresses)
    | { kind: "outbox" };
  /** "attach": CVs go to the careers inbox as an email attachment and are not stored. */
  files:
    | { kind: "r2"; accountId: string; accessKeyId: string; secretAccessKey: string; bucket: string }
    | { kind: "attach" }
    | { kind: "memory" };
  turnstile: { kind: "verify"; secret: string } | { kind: "skip" };
  ipHashSalt: string;
};

export function fakesAllowed(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.E2E_FAKE_BACKENDS === "1" ||
    // Client review previews: forms work without real backends and say so (see isDemo).
    process.env.NEXT_PUBLIC_REVIEW_MODE === "1"
  );
}

/** True when submissions are not really stored or emailed (local stand-ins). */
export function isDemo(b: Backends): boolean {
  return b.store.kind === "memory" || b.mail.kind === "outbox";
}

function env(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}

/** SMTP_SECURE, or the usual default for the port: 465 → TLS, otherwise STARTTLS. */
function smtpSecurity(port: number): SmtpSecurity | undefined {
  const v = env("SMTP_SECURE")?.toLowerCase();
  if (!v) return port === 465 ? "tls" : "starttls";
  if (v === "tls" || v === "ssl" || v === "true") return "tls";
  if (v === "starttls" || v === "false") return "starttls";
  // Plain text is for local test servers (e.g. smtp4dev) only.
  if (v === "none" && process.env.NODE_ENV !== "production") return "none";
  return undefined;
}

function mailBackend(missing: string[], fakes: boolean): Backends["mail"] {
  const enquiryTo = env("ENQUIRY_TO_EMAIL");
  const careersTo = env("CAREERS_TO_EMAIL") ?? enquiryTo;

  const host = env("SMTP_HOST");
  if (host) {
    const port = Number(env("SMTP_PORT") ?? 465);
    const secure = smtpSecurity(port);
    const user = env("SMTP_USER");
    const pass = env("SMTP_PASS");
    // The mailbox you log in as is the natural sender; many hosts insist on it.
    const from = env("ENQUIRY_FROM_EMAIL") ?? user;
    const problems = [
      ...(!Number.isInteger(port) || port <= 0 ? ["SMTP_PORT"] : []),
      ...(!secure ? ["SMTP_SECURE (tls or starttls)"] : []),
      ...(!!user !== !!pass ? ["SMTP_USER and SMTP_PASS (both or neither)"] : []),
      ...(!from ? ["ENQUIRY_FROM_EMAIL"] : []),
      ...(!enquiryTo ? ["ENQUIRY_TO_EMAIL"] : []),
    ];
    if (problems.length) {
      missing.push(...problems);
      return { kind: "outbox" };
    }
    return { kind: "smtp", host, port, secure: secure!, user, pass, from: from!, enquiryTo: enquiryTo!, careersTo: careersTo! };
  }

  const apiKey = env("RESEND_API_KEY");
  const from = env("ENQUIRY_FROM_EMAIL");
  if (apiKey && from && enquiryTo) return { kind: "resend", apiKey, from, enquiryTo, careersTo: careersTo! };

  if (!fakes) missing.push("an email transport: SMTP_HOST / SMTP_USER / SMTP_PASS / ENQUIRY_TO_EMAIL (or RESEND_API_KEY)");
  return { kind: "outbox" };
}

export function getBackends(): Backends {
  const missing: string[] = [];
  const fakes = fakesAllowed();

  const mail = mailBackend(missing, fakes);
  const realMail = mail.kind !== "outbox";

  const databaseUrl = env("DATABASE_URL");
  const salt = env("IP_HASH_SALT");
  // The salt protects stored IP hashes; only needed when there is a database.
  if (databaseUrl && !salt && !fakes) missing.push("IP_HASH_SALT");

  const r2 = {
    accountId: env("R2_ACCOUNT_ID"),
    accessKeyId: env("R2_ACCESS_KEY_ID"),
    secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
    bucket: env("R2_BUCKET"),
  };
  const filesConfigured = Object.values(r2).every(Boolean);

  const turnstileSecret = env("TURNSTILE_SECRET_KEY");

  if (missing.length) throw new ConfigError(missing);

  return {
    // With a real mailbox but no database, the email is the record; with no
    // mailbox (dev/E2E/review) a memory store stands in.
    store: databaseUrl ? { kind: "neon", url: databaseUrl } : realMail ? { kind: "mail-only" } : { kind: "memory" },
    mail,
    files: filesConfigured
      ? {
          kind: "r2",
          accountId: r2.accountId!,
          accessKeyId: r2.accessKeyId!,
          secretAccessKey: r2.secretAccessKey!,
          bucket: r2.bucket!,
        }
      : realMail
        ? { kind: "attach" }
        : { kind: "memory" },
    turnstile: turnstileSecret
      ? { kind: "verify", secret: turnstileSecret }
      : process.env.NODE_ENV !== "production"
        ? { kind: "verify", secret: TURNSTILE_TEST_SECRET }
        : { kind: "skip" },
    // Mail-only: hashes live only in memory for the rate limit, so a per-instance salt suffices.
    ipHashSalt: salt ?? (process.env.NODE_ENV === "production" ? INSTANCE_SALT : "dev-only-salt"),
  };
}

const INSTANCE_SALT = crypto.randomUUID();
