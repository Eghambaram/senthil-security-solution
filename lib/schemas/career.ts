import { z } from "zod";
import { antiSpam, consent, fullName, optionalEmail, phone } from "./common";

export const ROLES = [
  { value: "security-guard", label: "Security Guard" },
  { value: "supervisor", label: "Security Supervisor" },
  { value: "gunman", label: "Gunman" },
  { value: "other", label: "Other" },
] as const;

export const EXPERIENCE_RANGES = ["No experience", "Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "More than 10 years"] as const;

export const FORCES_BRANCHES = ["Army", "Navy", "Air Force", "CISF", "BSF", "CRPF", "Other CAPF", "State Police", "Other"] as const;

export const RESUME_MAX_BYTES = 5 * 1024 * 1024;

export const RESUME_TYPES = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
} as const;

const RESUME_EXTENSIONS = /\.(pdf|docx?)$/i;
const GENERIC_TYPES = new Set(["", "application/octet-stream"]);

/** Client/server check of name, declared type and size. Magic bytes are checked server-side (Phase 5). */
export const resume = z
  .instanceof(File)
  .refine((f) => f.size > 0, { error: "The selected file is empty." })
  .refine((f) => f.size <= RESUME_MAX_BYTES, { error: "Please upload a file smaller than 5 MB." })
  // Some browsers/OSes send no type or a generic one (e.g. for .doc); the real
  // type is confirmed server-side from the file's magic bytes.
  .refine((f) => RESUME_EXTENSIONS.test(f.name) && (GENERIC_TYPES.has(f.type) || f.type in RESUME_TYPES), {
    error: "Please upload a PDF, DOC or DOCX file.",
  });

export const careerSchema = z
  .object({
    fullName,
    phone,
    email: optionalEmail,
    preferredRole: z.enum(ROLES.map((r) => r.value) as [string, ...string[]], { error: "Please choose a role." }),
    experienceYears: z.enum(EXPERIENCE_RANGES, { error: "Please choose your experience." }),
    servedInForces: z.enum(["no", "yes"], { error: "Please tell us whether you have served." }),
    forcesBranch: z.union([z.literal(""), z.enum(FORCES_BRANCHES)]).optional(),
    location: z
      .string()
      .trim()
      .min(2, { error: "Please tell us where you live." })
      .max(150),
    resume: resume.optional(),
    consent,
    ...antiSpam,
  })
  .refine((v) => v.servedInForces === "no" || !!v.forcesBranch, {
    path: ["forcesBranch"],
    error: "Please choose where you served.",
  });

export type CareerInput = z.input<typeof careerSchema>;
export type Career = z.output<typeof careerSchema>;
