import type { Backends } from "@/lib/config";

export type Email = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

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
            from: `Senthil Security Solutions Website <${cfg.from}>`,
            to: [email.to],
            subject: email.subject,
            html: email.html,
            text: email.text,
            ...(email.replyTo ? { reply_to: email.replyTo } : {}),
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
  return config.kind === "resend" ? resendMailer(config) : outboxMailer();
}

/** Recipients for each form; the outbox uses placeholders. */
export function recipients(config: Backends["mail"]): { enquiry: string; careers: string } {
  return config.kind === "resend"
    ? { enquiry: config.enquiryTo, careers: config.careersTo }
    : { enquiry: "enquiries@dev.local", careers: "careers@dev.local" };
}
