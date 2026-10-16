import type { z } from "zod";
import { careersPage } from "@/content/careers";
import { company } from "@/content/company";
import { services } from "@/content/services";
import { ConfigError, getBackends, isDemo, type Backends } from "@/lib/config";
import { createStore, type FormStore } from "@/lib/db/store";
import { applicationEmail, enquiryEmail } from "@/lib/email/templates";
import { createMailer, recipients, type Mailer } from "@/lib/email/send";
import { isVisible } from "@/lib/facts";
import { checkRateLimit } from "@/lib/rate-limit";
import { MIN_SUBMIT_MS } from "@/lib/schemas/common";
import { EXPERIENCE_RANGES, ROLES, careerSchema } from "@/lib/schemas/career";
import { SERVICE_NOT_SURE, enquirySchema } from "@/lib/schemas/enquiry";
import { createFileStore, RESUME_LINK_TTL_SECONDS, type FileStore } from "@/lib/storage";
import { verifyTurnstile } from "@/lib/turnstile";
import { detectResume, extensionMatches, resumeContentType, type ResumeKind } from "./files";
import { makeReference } from "./reference";
import { getClientIp, hashIp } from "./request";

export type Deps = {
  backends: Backends;
  store: FormStore;
  mailer: Mailer;
  files: FileStore;
  verifyTurnstile: (token: string | undefined, ip: string | undefined) => Promise<boolean>;
  now: () => Date;
};

/** Real dependencies from env. Throws ConfigError when production is misconfigured. */
export function createDeps(): Deps {
  const backends = getBackends();
  return {
    backends,
    store: createStore(backends.store),
    mailer: createMailer(backends.mail),
    files: createFileStore(backends.files),
    verifyTurnstile: (token, ip) => verifyTurnstile(backends.turnstile, token, ip),
    now: () => new Date(),
  };
}

const PHONE = company.phone.value.display;

export const MESSAGES = {
  unavailable: `Our online form is temporarily unavailable. Please call us on ${PHONE}.`,
  badRequest: `We couldn’t read your submission. Please reload the page and try again, or call us on ${PHONE}.`,
  rejected: `We couldn’t accept this submission. Please try again, or call us on ${PHONE}.`,
  tooFast: "That was very quick. Please check your details, wait a few seconds and submit again.",
  rateLimited: `You’ve sent several submissions in a short time. Please wait 10 minutes, or call us on ${PHONE}.`,
  turnstile: "Please complete the security check and submit again.",
  invalid: "Please check the highlighted fields.",
  saveFailed: `We couldn’t save your details. Please try again in a moment, or call us on ${PHONE}.`,
  notifyFailed: `We received your details but couldn’t confirm delivery to our team. Please call us on ${PHONE} so we don’t miss you.`,
  tooLarge: "Your CV is too large. Please upload a file smaller than 5 MB.",
} as const;

const MAX_BODY_BYTES = 6 * 1024 * 1024;

function json(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const fail = (status: number, error: string, fieldErrors?: Record<string, string>) =>
  json(status, { ok: false, error, ...(fieldErrors ? { fieldErrors } : {}) });

function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

/** Shared checks before any data is stored: honeypot, timing, rate limit, Turnstile. */
async function guard(
  deps: Deps,
  request: Request,
  form: "enquiry" | "careers",
  data: { website?: string; startedAt: number; turnstileToken?: string },
): Promise<{ ok: true; ipHash: string } | { ok: false; response: Response }> {
  const now = deps.now();
  if (data.website) return { ok: false, response: fail(400, MESSAGES.rejected) };
  if (now.getTime() - data.startedAt < MIN_SUBMIT_MS) return { ok: false, response: fail(400, MESSAGES.tooFast) };

  const ip = getClientIp(request);
  const ipHash = await hashIp(ip, deps.backends.ipHashSalt);
  if (!(await checkRateLimit(deps.store, form, ipHash, now))) {
    return { ok: false, response: fail(429, MESSAGES.rateLimited) };
  }
  if (!(await deps.verifyTurnstile(data.turnstileToken, ip))) {
    return { ok: false, response: fail(400, MESSAGES.turnstile) };
  }
  return { ok: true, ipHash };
}

function resolveDeps(get: () => Deps): Deps | Response {
  try {
    return get();
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error(err.message);
      return fail(503, MESSAGES.unavailable);
    }
    throw err;
  }
}

/** POST /api/enquiry — site assessment and contact forms. */
export async function handleEnquiry(request: Request, getDeps: () => Deps = createDeps): Promise<Response> {
  const deps = resolveDeps(getDeps);
  if (deps instanceof Response) return deps;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return fail(400, MESSAGES.badRequest);
  }

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error);
    // A filled honeypot or missing timing field is a bot, not a user mistake.
    if (fieldErrors.website || fieldErrors.startedAt || fieldErrors.kind) return fail(400, MESSAGES.rejected);
    return fail(422, MESSAGES.invalid, fieldErrors);
  }
  const data = parsed.data;

  const gate = await guard(deps, request, "enquiry", data);
  if (!gate.ok) return gate.response;

  if (data.kind === "assessment") {
    const allowed = new Set([...services.filter(isVisible).map((s) => s.title), SERVICE_NOT_SURE]);
    if (!allowed.has(data.serviceRequired)) {
      return fail(422, MESSAGES.invalid, { serviceRequired: "Please choose a service from the list." });
    }
  }

  const now = deps.now();
  const reference = makeReference("ENQ", now);
  const assessment = data.kind === "assessment" ? data : undefined;

  let id: string;
  try {
    ({ id } = await deps.store.insertEnquiry({
      reference,
      kind: data.kind,
      fullName: data.fullName,
      organisation: assessment?.organisation || null,
      phone: data.phone,
      email: data.email,
      serviceRequired: assessment?.serviceRequired ?? null,
      siteLocation: assessment?.siteLocation ?? null,
      premisesType: assessment?.premisesType ?? null,
      personnelRequired: assessment?.personnelRequired || null,
      message: data.message || null,
      consentAt: now,
      ipHash: gate.ipHash,
      userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
      createdAt: now,
    }));
  } catch (err) {
    console.error("enquiry insert failed", err);
    return fail(500, MESSAGES.saveFailed);
  }

  const to = recipients(deps.backends.mail).enquiry;
  const sent = await deps.mailer.send(
    enquiryEmail(to, reference, {
      kind: data.kind,
      fullName: data.fullName,
      organisation: assessment?.organisation,
      phone: data.phone,
      email: data.email,
      serviceRequired: assessment?.serviceRequired,
      siteLocation: assessment?.siteLocation,
      premisesType: assessment?.premisesType,
      personnelRequired: assessment?.personnelRequired || undefined,
      message: data.message,
      receivedAt: now,
    }),
  );

  await deps.store.markNotified("enquiries", id, sent.ok ? undefined : sent.error).catch(() => undefined);
  if (!sent.ok) {
    console.error("enquiry notification failed", reference, sent.error);
    return fail(502, MESSAGES.notifyFailed);
  }
  return json(200, { ok: true, reference, ...(isDemo(deps.backends) ? { demo: true } : {}) });
}

/** POST /api/careers — multipart application with optional CV. */
export async function handleCareers(request: Request, getDeps: () => Deps = createDeps): Promise<Response> {
  const deps = resolveDeps(getDeps);
  if (deps instanceof Response) return deps;

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return fail(413, MESSAGES.tooLarge, { resume: MESSAGES.tooLarge });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, MESSAGES.badRequest);
  }

  const str = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v : undefined;
  };
  const file = form.get("resume");
  const candidate = {
    fullName: str("fullName") ?? "",
    phone: str("phone") ?? "",
    email: str("email") ?? "",
    preferredRole: str("preferredRole") ?? "",
    experienceYears: str("experienceYears") ?? "",
    servedInForces: str("servedInForces") ?? "",
    forcesBranch: str("forcesBranch") ?? "",
    location: str("location") ?? "",
    resume: file instanceof File && file.size > 0 ? file : undefined,
    consent: str("consent") === "true",
    website: str("website") ?? "",
    startedAt: Number(str("startedAt")),
    turnstileToken: str("turnstileToken"),
  };

  const parsed = careerSchema.safeParse(candidate);
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error);
    if (fieldErrors.website || fieldErrors.startedAt) return fail(400, MESSAGES.rejected);
    return fail(422, MESSAGES.invalid, fieldErrors);
  }
  const data = parsed.data;

  const gate = await guard(deps, request, "careers", data);
  if (!gate.ok) return gate.response;

  const openRoles = new Set(["other", ...careersPage.roles.items.filter(isVisible).map((r) => r.id)]);
  if (!openRoles.has(data.preferredRole)) {
    return fail(422, MESSAGES.invalid, { preferredRole: "Please choose a role from the list." });
  }

  // CV: check real file type from magic bytes before storing anything.
  let resume: { bytes: Uint8Array; kind: ResumeKind; name: string } | undefined;
  if (data.resume) {
    const bytes = new Uint8Array(await data.resume.arrayBuffer());
    const kind = detectResume(bytes);
    if (!kind || !extensionMatches(data.resume.name, kind)) {
      return fail(422, MESSAGES.invalid, { resume: "This file doesn’t look like a PDF, DOC or DOCX. Please upload your CV again." });
    }
    resume = { bytes, kind, name: data.resume.name.slice(0, 150) };
  }

  const now = deps.now();
  const reference = makeReference("APP", now);
  const resumeKey = resume
    ? `resumes/${now.toISOString().slice(0, 7)}/${reference}-${crypto.randomUUID().slice(0, 8)}.${resume.kind}`
    : undefined;

  if (resume && resumeKey) {
    try {
      await deps.files.put(resumeKey, resume.bytes, resumeContentType(resume.kind));
    } catch (err) {
      console.error("resume upload failed", err);
      return fail(500, MESSAGES.saveFailed);
    }
  }

  let id: string;
  try {
    ({ id } = await deps.store.insertApplication({
      reference,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || null,
      preferredRole: data.preferredRole,
      experience: data.experienceYears,
      servedInForces: data.servedInForces === "yes",
      forcesBranch: data.servedInForces === "yes" ? data.forcesBranch || null : null,
      location: data.location,
      resumeKey: resumeKey ?? null,
      resumeName: resume?.name ?? null,
      resumeSize: resume?.bytes.byteLength ?? null,
      consentAt: now,
      ipHash: gate.ipHash,
      userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
      createdAt: now,
    }));
  } catch (err) {
    console.error("application insert failed", err);
    if (resumeKey) await deps.files.remove(resumeKey).catch(() => undefined);
    return fail(500, MESSAGES.saveFailed);
  }

  const roleLabel = ROLES.find((r) => r.value === data.preferredRole)?.label ?? data.preferredRole;
  const resumeUrl = resumeKey ? await deps.files.signedUrl(resumeKey, RESUME_LINK_TTL_SECONDS).catch(() => undefined) : undefined;
  const sent = await deps.mailer.send(
    applicationEmail(recipients(deps.backends.mail).careers, reference, {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || undefined,
      role: roleLabel,
      experience: EXPERIENCE_RANGES.includes(data.experienceYears) ? data.experienceYears : "",
      served: data.servedInForces === "yes" ? `Yes${data.forcesBranch ? ` (${data.forcesBranch})` : ""}` : "No",
      location: data.location,
      resumeName: resume?.name,
      resumeUrl,
      receivedAt: now,
    }),
  );

  await deps.store.markNotified("applications", id, sent.ok ? undefined : sent.error).catch(() => undefined);
  if (!sent.ok) {
    console.error("application notification failed", reference, sent.error);
    return fail(502, MESSAGES.notifyFailed);
  }
  return json(200, { ok: true, reference, ...(isDemo(deps.backends) ? { demo: true } : {}) });
}
