import type { Email } from "./send";

/** Escape user input for HTML. Every interpolated value goes through this. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Row = [label: string, value: string | undefined | null];
type Action = { label: string; href: string };

function layout(title: string, reference: string, rows: Row[], footer: string, action?: Action) {
  const filled = rows.filter((r): r is [string, string] => !!r[1]);

  const rowsHtml = filled
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e2e7ed;width:38%;vertical-align:top;font-size:13px;color:#647184">${escapeHtml(label)}</td>` +
        `<td style="padding:8px 0;border-bottom:1px solid #e2e7ed;font-size:14px;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("\n");

  const actionHtml = action
    ? `<p style="margin:16px 0 0"><a href="${escapeHtml(action.href)}" style="display:inline-block;background:#d6a33c;color:#0b1c32;padding:10px 16px;border-radius:6px;font-weight:bold;text-decoration:none">${escapeHtml(action.label)}</a></p>`
    : "";

  const html = `<!doctype html><html><body style="margin:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;color:#17263a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e7ed;border-radius:8px">
<tr><td style="background:#0b1c32;padding:20px 24px;border-radius:8px 8px 0 0">
<p style="margin:0;color:#f2c76a;font-size:12px;letter-spacing:.14em;text-transform:uppercase">Senthil Security Solutions · Website</p>
<h1 style="margin:8px 0 0;color:#ffffff;font-size:20px">${escapeHtml(title)}</h1></td></tr>
<tr><td style="padding:20px 24px 8px"><p style="margin:0;font-size:14px;color:#647184">Reference</p>
<p style="margin:4px 0 0;font-size:18px;font-weight:bold;font-family:Consolas,monospace">${escapeHtml(reference)}</p></td></tr>
<tr><td style="padding:8px 24px 16px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${rowsHtml}
</table>${actionHtml}</td></tr>
<tr><td style="padding:0 24px 24px;font-size:12px;color:#647184">${escapeHtml(footer)}</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    title,
    `Reference: ${reference}`,
    "",
    ...filled.map(([l, v]) => `${l}: ${v}`),
    ...(action ? ["", `${action.label}: ${action.href}`] : []),
    "",
    footer,
  ].join("\n");

  return { html, text };
}

const fmt = (d: Date) => d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

export type EnquiryEmailData = {
  kind: "assessment" | "contact";
  fullName: string;
  organisation?: string;
  phone: string;
  email: string;
  serviceRequired?: string;
  siteLocation?: string;
  premisesType?: string;
  personnelRequired?: string;
  message?: string;
  receivedAt: Date;
};

export function enquiryEmail(to: string, reference: string, d: EnquiryEmailData): Email {
  const title = d.kind === "assessment" ? "New site assessment request" : "New website enquiry";
  const { html, text } = layout(
    title,
    reference,
    [
      ["Name", d.fullName],
      ["Organisation", d.organisation],
      ["Phone", d.phone],
      ["Email", d.email],
      ["Service", d.serviceRequired],
      ["Premises", d.premisesType],
      ["Site location", d.siteLocation],
      ["Personnel needed", d.personnelRequired],
      ["Message", d.message],
      ["Received", fmt(d.receivedAt)],
    ],
    "Reply to this email to respond to the enquirer directly. Enquiries are kept for 12 months under our privacy policy.",
  );
  return { to, subject: `${title}: ${d.fullName} (${reference})`, html, text, replyTo: d.email };
}

export type ApplicationEmailData = {
  fullName: string;
  phone: string;
  email?: string;
  role: string;
  experience: string;
  served: string;
  location: string;
  resumeName?: string;
  resumeUrl?: string;
  receivedAt: Date;
};

export function applicationEmail(to: string, reference: string, d: ApplicationEmailData): Email {
  const title = "New job application";
  const { html, text } = layout(
    title,
    reference,
    [
      ["Name", d.fullName],
      ["Phone", d.phone],
      ["Email", d.email],
      ["Role", d.role],
      ["Experience", d.experience],
      ["Served in forces", d.served],
      ["Lives in", d.location],
      ["CV", d.resumeName ?? "Not provided"],
      ["Received", fmt(d.receivedAt)],
    ],
    "Applications and CVs are kept for 6 months under our privacy policy. Do not forward CVs outside the recruitment team.",
    d.resumeUrl ? { label: "Download CV (link valid 7 days)", href: d.resumeUrl } : undefined,
  );
  return { to, subject: `${title}: ${d.fullName}, ${d.role} (${reference})`, html, text, replyTo: d.email || undefined };
}
