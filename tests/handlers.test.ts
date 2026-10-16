import { beforeEach, describe, expect, it } from "vitest";
import { ConfigError, getBackends, type Backends } from "@/lib/config";
import { memoryStore, type FormStore } from "@/lib/db/store";
import { outboxMailer, type Email, type Mailer } from "@/lib/email/send";
import { detectResume } from "@/lib/forms/files";
import { handleCareers, handleEnquiry, MESSAGES, type Deps } from "@/lib/forms/handlers";
import { makeReference } from "@/lib/forms/reference";
import { purgeExpired } from "@/lib/retention";
import { memoryFileStore, type FileStore } from "@/lib/storage";
import { verifyTurnstile } from "@/lib/turnstile";

const NOW = new Date("2026-10-16T06:30:00Z");

type State = Parameters<typeof memoryStore>[0] & object;
let state: NonNullable<State>;
let box: Email[];
let files: Map<string, { body: Uint8Array; contentType: string }>;

const backends: Backends = {
  store: { kind: "memory" },
  mail: { kind: "outbox" },
  files: { kind: "memory" },
  turnstile: { kind: "verify", secret: "test" },
  ipHashSalt: "test-salt",
};

function deps(overrides: Partial<Deps> = {}): () => Deps {
  return () => ({
    backends,
    store: memoryStore(state),
    mailer: outboxMailer(box),
    files: memoryFileStore(files),
    verifyTurnstile: async (token) => token === "ok-token",
    now: () => NOW,
    ...overrides,
  });
}

beforeEach(() => {
  state = { attempts: [], enquiries: [], applications: [] };
  box = [];
  files = new Map();
});

const assessment = {
  kind: "assessment",
  fullName: "Priya Raman",
  organisation: "Raman Textiles",
  phone: "98765 43210",
  email: "priya@example.com",
  serviceRequired: "Industrial Security",
  siteLocation: "Guindy, Chennai",
  premisesType: "Factory",
  personnelRequired: "6–15",
  message: "Two gates, three shifts.",
  consent: true,
  website: "",
  startedAt: NOW.getTime() - 60_000,
  turnstileToken: "ok-token",
};

function enquiryRequest(body: unknown, ip = "203.0.113.7"): Request {
  return new Request("http://localhost/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json", "cf-connecting-ip": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/enquiry", () => {
  it("stores the enquiry, emails the team and returns a reference", async () => {
    const res = await handleEnquiry(enquiryRequest(assessment), deps());
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.reference).toMatch(/^SSS-ENQ-261016-[2-9A-Z]{4}$/);
    expect(state.enquiries).toHaveLength(1);
    expect(state.enquiries[0]).toMatchObject({ fullName: "Priya Raman", reference: body.reference });
    expect(state.enquiries[0]!.notifiedAt).toBeInstanceOf(Date);
    expect(state.enquiries[0]!.ipHash).not.toContain("203.0.113.7");
    expect(box).toHaveLength(1);
    expect(box[0]).toMatchObject({ replyTo: "priya@example.com" });
    expect(box[0]!.subject).toContain(body.reference);
  });

  it("escapes user input in the notification email", async () => {
    await handleEnquiry(enquiryRequest({ ...assessment, fullName: "<script>alert(1)</script>" }), deps());
    expect(box[0]!.html).not.toContain("<script>alert(1)</script>");
    expect(box[0]!.html).toContain("&lt;script&gt;");
  });

  it("accepts the short contact form", async () => {
    const res = await handleEnquiry(
      enquiryRequest({
        kind: "contact",
        fullName: "Arun K",
        phone: "044 4380 6837",
        email: "arun@example.com",
        message: "Please call me about office security.",
        consent: true,
        website: "",
        startedAt: NOW.getTime() - 20_000,
        turnstileToken: "ok-token",
      }),
      deps(),
    );
    expect(res.status).toBe(200);
    expect(state.enquiries[0]!.kind).toBe("contact");
  });

  it("rejects a filled honeypot without storing anything", async () => {
    const res = await handleEnquiry(enquiryRequest({ ...assessment, website: "http://spam.example" }), deps());
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe(MESSAGES.rejected);
    expect(state.enquiries).toHaveLength(0);
    expect(box).toHaveLength(0);
  });

  it("rejects submissions made faster than a human could", async () => {
    const res = await handleEnquiry(enquiryRequest({ ...assessment, startedAt: NOW.getTime() - 500 }), deps());
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe(MESSAGES.tooFast);
  });

  it("returns field errors for invalid input", async () => {
    const res = await handleEnquiry(enquiryRequest({ ...assessment, phone: "123", email: "nope" }), deps());
    const body = await res.json();
    expect(res.status).toBe(422);
    expect(Object.keys(body.fieldErrors)).toEqual(expect.arrayContaining(["phone", "email"]));
  });

  it("rejects malformed JSON", async () => {
    const res = await handleEnquiry(enquiryRequest("{not json"), deps());
    expect(res.status).toBe(400);
  });

  it("rejects a service that is not offered", async () => {
    const res = await handleEnquiry(enquiryRequest({ ...assessment, serviceRequired: "Armed Security & Ex-Servicemen" }), deps());
    expect(res.status).toBe(422);
    expect((await res.json()).fieldErrors.serviceRequired).toBeTruthy();
  });

  it("fails the security check without a valid Turnstile token", async () => {
    const res = await handleEnquiry(enquiryRequest({ ...assessment, turnstileToken: "bad" }), deps());
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe(MESSAGES.turnstile);
    expect(state.enquiries).toHaveLength(0);
  });

  it("allows 5 submissions per 10 minutes per IP, then returns 429", async () => {
    for (let i = 0; i < 5; i++) {
      expect((await handleEnquiry(enquiryRequest(assessment), deps())).status).toBe(200);
    }
    const sixth = await handleEnquiry(enquiryRequest(assessment), deps());
    expect(sixth.status).toBe(429);
    // A different visitor is unaffected.
    expect((await handleEnquiry(enquiryRequest(assessment, "198.51.100.2"), deps())).status).toBe(200);
  });

  it("counts failed security checks towards the limit", async () => {
    for (let i = 0; i < 5; i++) await handleEnquiry(enquiryRequest({ ...assessment, turnstileToken: "bad" }), deps());
    expect((await handleEnquiry(enquiryRequest(assessment), deps())).status).toBe(429);
  });

  it("does not report success when the email cannot be sent", async () => {
    const failingMailer: Mailer = { send: async () => ({ ok: false, error: "Resend 500" }) };
    const res = await handleEnquiry(enquiryRequest(assessment), deps({ mailer: failingMailer }));
    expect(res.status).toBe(502);
    expect((await res.json()).ok).toBe(false);
    // Kept so the team can follow up; flagged as not notified.
    expect(state.enquiries[0]).toMatchObject({ notifyError: "Resend 500" });
    expect(state.enquiries[0]!.notifiedAt ?? null).toBeNull();
  });

  it("does not report success when the database write fails", async () => {
    const broken: FormStore = { ...memoryStore(state), insertEnquiry: async () => Promise.reject(new Error("db down")) };
    const res = await handleEnquiry(enquiryRequest(assessment), deps({ store: broken }));
    expect(res.status).toBe(500);
    expect(box).toHaveLength(0);
  });

  it("fails closed with 503 when production is not configured", async () => {
    const res = await handleEnquiry(enquiryRequest(assessment), () => {
      throw new ConfigError(["DATABASE_URL"]);
    });
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe(MESSAGES.unavailable);
  });
});

const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 0x0a, ...new Array(200).fill(0x20)]);

function careersRequest(fields: Record<string, string>, file?: File): Request {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  if (file) form.append("resume", file);
  return new Request("http://localhost/api/careers", { method: "POST", body: form, headers: { "cf-connecting-ip": "203.0.113.9" } });
}

const application = {
  fullName: "Murugan S",
  phone: "9876543210",
  email: "",
  preferredRole: "security-guard",
  experienceYears: "3–5 years",
  servedInForces: "yes",
  forcesBranch: "Army",
  location: "Tambaram",
  consent: "true",
  website: "",
  startedAt: String(NOW.getTime() - 90_000),
  turnstileToken: "ok-token",
};

describe("POST /api/careers", () => {
  it("stores the application and CV privately and emails a download link", async () => {
    const res = await handleCareers(careersRequest(application, new File([PDF], "Murugan CV.pdf", { type: "application/pdf" })), deps());
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.reference).toMatch(/^SSS-APP-/);
    const row = state.applications[0]!;
    expect(row).toMatchObject({ servedInForces: true, forcesBranch: "Army", resumeName: "Murugan CV.pdf" });
    expect(row.resumeKey).toMatch(/^resumes\/2026-10\/SSS-APP-.*\.pdf$/);
    expect(files.get(row.resumeKey!)?.contentType).toBe("application/pdf");
    expect(box[0]!.html).toContain("Download CV");
  });

  it("accepts an application without a CV", async () => {
    const res = await handleCareers(careersRequest({ ...application, servedInForces: "no", forcesBranch: "" }), deps());
    expect(res.status).toBe(200);
    expect(state.applications[0]!.resumeKey ?? null).toBeNull();
  });

  it("rejects a file whose content is not really a PDF/DOC/DOCX", async () => {
    const fake = new File([new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 1, 2, 3])], "cv.pdf", { type: "application/pdf" });
    const res = await handleCareers(careersRequest(application, fake), deps());
    expect(res.status).toBe(422);
    expect((await res.json()).fieldErrors.resume).toBeTruthy();
    expect(files.size).toBe(0);
  });

  it("rejects the gated Gunman role", async () => {
    const res = await handleCareers(careersRequest({ ...application, preferredRole: "gunman" }), deps());
    expect(res.status).toBe(422);
    expect((await res.json()).fieldErrors.preferredRole).toBeTruthy();
  });

  it("requires a branch when the applicant has served", async () => {
    const res = await handleCareers(careersRequest({ ...application, forcesBranch: "" }), deps());
    expect(res.status).toBe(422);
    expect((await res.json()).fieldErrors.forcesBranch).toBeTruthy();
  });

  it("removes the uploaded CV if the database write fails", async () => {
    const broken: FormStore = { ...memoryStore(state), insertApplication: async () => Promise.reject(new Error("db down")) };
    const res = await handleCareers(careersRequest(application, new File([PDF], "cv.pdf")), deps({ store: broken }));
    expect(res.status).toBe(500);
    expect(files.size).toBe(0);
  });

  it("does not store anything if the CV upload fails", async () => {
    const brokenFiles: FileStore = { ...memoryFileStore(files), put: async () => Promise.reject(new Error("r2 down")) };
    const res = await handleCareers(careersRequest(application, new File([PDF], "cv.pdf")), deps({ files: brokenFiles }));
    expect(res.status).toBe(500);
    expect(state.applications).toHaveLength(0);
  });
});

describe("configuration", () => {
  it("fails closed in production when services are missing", () => {
    const saved = { ...process.env };
    try {
      Object.assign(process.env, { NODE_ENV: "production", E2E_FAKE_BACKENDS: "" });
      for (const k of ["DATABASE_URL", "RESEND_API_KEY", "TURNSTILE_SECRET_KEY", "R2_BUCKET", "IP_HASH_SALT"]) delete process.env[k];
      expect(() => getBackends()).toThrow(ConfigError);
    } finally {
      process.env = saved;
    }
  });

  it("uses local stand-ins in development", () => {
    const b = getBackends();
    expect(b.store.kind).toBe("memory");
    expect(b.mail.kind).toBe("outbox");
  });
});

describe("helpers", () => {
  it("verifies Turnstile tokens with Cloudflare", async () => {
    const fakeFetch = (async (_url: string, init: RequestInit) => {
      const token = (init.body as FormData).get("response");
      return Response.json({ success: token === "good" });
    }) as unknown as typeof fetch;
    expect(await verifyTurnstile({ kind: "verify", secret: "s" }, "good", "1.2.3.4", fakeFetch)).toBe(true);
    expect(await verifyTurnstile({ kind: "verify", secret: "s" }, "bad", "1.2.3.4", fakeFetch)).toBe(false);
    expect(await verifyTurnstile({ kind: "verify", secret: "s" }, undefined, undefined, fakeFetch)).toBe(false);
  });

  it("detects CV types from magic bytes", () => {
    expect(detectResume(PDF)).toBe("pdf");
    expect(detectResume(new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0]))).toBe("doc");
    const docx = new Uint8Array([0x50, 0x4b, 0x03, 0x04, ...new TextEncoder().encode("....word/document.xml")]);
    expect(detectResume(docx)).toBe("docx");
    expect(detectResume(new Uint8Array([0x50, 0x4b, 0x03, 0x04, 1, 2, 3]))).toBeNull();
    expect(detectResume(new Uint8Array([0x4d, 0x5a]))).toBeNull();
  });

  it("makes unambiguous references", () => {
    for (let i = 0; i < 50; i++) expect(makeReference("ENQ", NOW)).toMatch(/^SSS-ENQ-261016-[2-9A-HJKMNP-Z]{4}$/);
  });

  it("purges data past its retention period", async () => {
    const store = memoryStore(state);
    const old = new Date("2025-09-01T00:00:00Z");
    state.enquiries.push({ id: "e1", createdAt: old } as never, { id: "e2", createdAt: NOW } as never);
    state.applications.push({ id: "a1", createdAt: new Date("2026-03-01T00:00:00Z"), resumeKey: "resumes/x.pdf" } as never);
    files.set("resumes/x.pdf", { body: PDF, contentType: "application/pdf" });
    state.attempts.push({ form: "enquiry", ipHash: "h", at: new Date("2026-10-14T00:00:00Z") });
    const result = await purgeExpired(store, memoryFileStore(files), NOW);
    expect(result).toEqual({ enquiries: 1, applications: 1, attempts: 1, filesDeleted: 1 });
    expect(state.enquiries.map((e) => e.id)).toEqual(["e2"]);
    expect(files.size).toBe(0);
  });
});
