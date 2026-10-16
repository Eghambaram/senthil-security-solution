import { describe, expect, it } from "vitest";
import { careerSchema } from "@/lib/schemas/career";
import { isIndianPhone } from "@/lib/schemas/common";
import { assessmentSchema, contactSchema, enquirySchema } from "@/lib/schemas/enquiry";

describe("isIndianPhone", () => {
  it.each(["9876543210", "+91 98765 43210", "+919876543210", "098765-43210", "044 4380 6837", "+91 44 4380 6837"])(
    "accepts %s",
    (v) => expect(isIndianPhone(v)).toBe(true),
  );
  it.each(["12345", "1234567890", "+1 415 555 0100", "98765 4321", "abcdefghij"])("rejects %s", (v) =>
    expect(isIndianPhone(v)).toBe(false),
  );
});

const base = { website: "", startedAt: 1_700_000_000_000, consent: true as const };

describe("enquiry schemas", () => {
  const assessment = {
    ...base,
    kind: "assessment" as const,
    fullName: "Priya Raman",
    phone: "98765 43210",
    email: "priya@example.com",
    serviceRequired: "Industrial Security",
    siteLocation: "Guindy, Chennai",
    premisesType: "Factory" as const,
  };

  it("accepts a complete site assessment", () => {
    expect(assessmentSchema.safeParse(assessment).success).toBe(true);
    expect(enquirySchema.safeParse(assessment).success).toBe(true);
  });

  it("requires consent", () => {
    expect(assessmentSchema.safeParse({ ...assessment, consent: false }).success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    expect(assessmentSchema.safeParse({ ...assessment, website: "http://spam" }).success).toBe(false);
  });

  it("rejects messages over 1500 characters", () => {
    expect(assessmentSchema.safeParse({ ...assessment, message: "x".repeat(1501) }).success).toBe(false);
  });

  it("rejects an unknown premises type", () => {
    expect(assessmentSchema.safeParse({ ...assessment, premisesType: "Castle" }).success).toBe(false);
  });

  it("contact form requires a message of at least 10 characters", () => {
    const contact = { ...base, kind: "contact" as const, fullName: "Arun K", phone: "9876543210", email: "a@b.in" };
    expect(contactSchema.safeParse({ ...contact, message: "Hi" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...contact, message: "Need guards for our office." }).success).toBe(true);
  });
});

describe("career schema", () => {
  const application = {
    ...base,
    fullName: "Murugan S",
    phone: "9876543210",
    email: "",
    preferredRole: "security-guard",
    experienceYears: "1–3 years" as const,
    servedInForces: "no" as const,
    location: "Tambaram",
  };

  it("accepts an application without email or CV", () => {
    expect(careerSchema.safeParse(application).success).toBe(true);
  });

  it("requires a branch when the applicant has served", () => {
    const r = careerSchema.safeParse({ ...application, servedInForces: "yes" });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.path).toEqual(["forcesBranch"]);
    expect(careerSchema.safeParse({ ...application, servedInForces: "yes", forcesBranch: "Army" }).success).toBe(true);
  });

  it("accepts a PDF CV under 5 MB and rejects other files", () => {
    const pdf = new File([new Uint8Array(1024)], "cv.pdf", { type: "application/pdf" });
    const big = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "cv.pdf", { type: "application/pdf" });
    const exe = new File([new Uint8Array(10)], "cv.exe", { type: "application/octet-stream" });
    expect(careerSchema.safeParse({ ...application, resume: pdf }).success).toBe(true);
    expect(careerSchema.safeParse({ ...application, resume: big }).success).toBe(false);
    expect(careerSchema.safeParse({ ...application, resume: exe }).success).toBe(false);
  });
});
