import type { Backends } from "@/lib/config";
import { base64, sendMail, type SmtpAttachment } from "./smtp";

export type Email = {
  /** One address, or several separated by commas. */
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: SmtpAttachment[];
};

const SENDER_NAME = "Senthil Security Solutions Website";

const splitAddresses = (to: string) =>
  to
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

/** The company's own mailbox over SMTP: no third-party email service. */
function smtpMailer(cfg: Extract<Backends["mail"], { kind: "smtp" }>): Mailer {
  return {
    async send(email) {
      const result = await sendMail(
        { host: cfg.host, port: cfg.port, secure: cfg.secure, user: cfg.user, pass: cfg.pass },
        {
          from: { name: SENDER_NAME, address: cfg.from },
          to: splitAddresses(email.to),
          replyTo: email.replyTo,
          subject: email.subject,
          text: email.text,
          html: email.html,
          attachments: email.attachments,
        },
      );
      return result.ok ? { ok: true, id: result.messageId } : result;
    },
  };
}

export type Mailer = {
  send(email: Email): Promise<{ ok: true; id: string } | { ok: false; error: string }>;
};

/** Resend REST API — no SDK, to keep the Cloudflare Worker small. */
function resendMailer(cfg: Extract<Backends["mail"], { kind: "resend" }>, fetchImpl: typeof fetch = fetch): Mailer {
  return {
    async send(email) {
      try {
        const res = await fetchImpl("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${cfg.apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: `${SENDER_NAME} <${cfg.from}>`,
            to: splitAddresses(email.to),
            subject: email.subject,
            html: email.html,
            text: email.text,
            ...(email.replyTo ? { reply_to: email.replyTo } : {}),
            ...(email.attachments?.length
              ? { attachments: email.attachments.map((a) => ({ filename: a.filename, content: base64(a.content) })) }
              : {}),
          }),
        });
        const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
        if (!res.ok || !data.id) return { ok: false, error: `Resend ${res.status}: ${data.message ?? "unknown error"}` };
        return { ok: true, id: data.id };
      } catch (err) {
        return { ok: false, error: `Resend request failed: ${String(err)}` };
      }
    },
  };
}

/** Dev/E2E outbox: keeps messages in memory and logs them; nothing is sent. */
export function outbox(): Email[] {
  const g = globalThis as { __sssOutbox?: Email[] };
  g.__sssOutbox ??= [];
  return g.__sssOutbox;
}

export function outboxMailer(box: Email[] = outbox()): Mailer {
  return {
    async send(email) {
      box.push(email);
      console.info(`[dev outbox] would send "${email.subject}" to ${email.to}`);
      return { ok: true, id: `outbox-${box.length}` };
    },
  };
}

export function createMailer(config: Backends["mail"]): Mailer {
  if (config.kind === "smtp") return smtpMailer(config);
  return config.kind === "resend" ? resendMailer(config) : outboxMailer();
}

/** Recipients for each form; the outbox uses placeholders. */
export function recipients(config: Backends["mail"]): { enquiry: string; careers: string } {
  return config.kind === "outbox"
    ? { enquiry: "enquiries@dev.local", careers: "careers@dev.local" }
    : { enquiry: config.enquiryTo, careers: config.careersTo };
}
