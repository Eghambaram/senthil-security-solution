// Checks the SMTP settings the website will use, and optionally sends a test email.
//
//   pnpm mail:test                  check connection + login only (sends nothing)
//   pnpm mail:test you@example.com  also send a test email to that address
//
// Reads SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS and
// ENQUIRY_FROM_EMAIL from the environment or .env.local (same as the site).
// Loads lib/email/smtp.ts directly through Node's built-in TypeScript support.
import { sendMail, verifySmtp } from "../lib/email/smtp.ts";

const env = (k) => process.env[k]?.trim() || undefined;

const host = env("SMTP_HOST");
if (!host) {
  console.error("SMTP_HOST is not set. Add the SMTP settings to .env.local (see .env.example).");
  process.exit(1);
}
const port = Number(env("SMTP_PORT") ?? 465);
const secureEnv = env("SMTP_SECURE")?.toLowerCase();
const secure = !secureEnv
  ? port === 465
    ? "tls"
    : "starttls"
  : ["tls", "ssl", "true"].includes(secureEnv)
    ? "tls"
    : secureEnv === "none"
      ? "none"
      : "starttls";
const user = env("SMTP_USER");
const pass = env("SMTP_PASS");
const from = env("ENQUIRY_FROM_EMAIL") ?? user;
const cfg = { host, port, secure, user, pass, timeoutMs: 20_000 };

console.log(`Connecting to ${host}:${port} (${secure}) as ${user ?? "(no login)"} …`);
const check = await verifySmtp(cfg, from?.split("@")[1] ?? "localhost");
if (!check.ok) {
  console.error(`✗ ${check.error}`);
  console.error("  Check the host, port, security mode, username and password (some hosts need an app password).");
  process.exit(1);
}
console.log(user ? "✓ Connected and logged in." : "✓ Connected (no login configured).");

const to = process.argv[2];
if (!to) {
  console.log("Nothing sent. Run `pnpm mail:test you@example.com` to send a test email.");
  process.exit(0);
}
if (!from) {
  console.error("Set ENQUIRY_FROM_EMAIL (or SMTP_USER) to send.");
  process.exit(1);
}

const sent = await sendMail(cfg, {
  from: { name: "Senthil Security Solutions Website", address: from },
  to: [to],
  subject: "Test email from the Senthil Security Solutions website",
  text: `This is a test from the website's mail settings.\n\nServer: ${host}:${port} (${secure})\nSender: ${from}\nSent: ${new Date().toISOString()}`,
  html: `<p>This is a test from the website's mail settings.</p><p>Server: ${host}:${port} (${secure})<br>Sender: ${from}<br>Sent: ${new Date().toISOString()}</p>`,
});
if (!sent.ok) {
  console.error(`✗ ${sent.error}`);
  process.exit(1);
}
console.log(`✓ Sent to ${to} (${sent.messageId}). Check the inbox and the spam folder.`);
