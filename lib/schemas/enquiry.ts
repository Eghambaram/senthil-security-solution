import { z } from "zod";
import { antiSpam, consent, email, fullName, phone } from "./common";

export const PREMISES_TYPES = [
  "Factory",
  "Warehouse",
  "Office",
  "IT Park",
  "Commercial building",
  "Residential community",
  "Event",
  "Other",
] as const;

export const PERSONNEL_RANGES = ["1–5", "6–15", "16–30", "31–50", "More than 50", "Not sure"] as const;

/** Value used when the visitor is unsure which service fits. */
export const SERVICE_NOT_SURE = "Not sure / need advice";

export const MESSAGE_MAX = 1500;

const message = z.string().trim().max(MESSAGE_MAX, { error: `Please keep your message under ${MESSAGE_MAX} characters.` });

/** Full site-assessment enquiry (CLAUDE.md §10). */
export const assessmentSchema = z.object({
  kind: z.literal("assessment"),
  fullName,
  organisation: z.string().trim().max(150).optional(),
  phone,
  email,
  serviceRequired: z.string().trim().min(1, { error: "Please choose a service, or “Not sure”." }),
  siteLocation: z
    .string()
    .trim()
    .min(2, { error: "Please tell us where the site is." })
    .max(200),
  premisesType: z.enum(PREMISES_TYPES, { error: "Please choose the type of premises." }),
  personnelRequired: z.union([z.literal(""), z.enum(PERSONNEL_RANGES)]).optional(),
  message: message.optional(),
  consent,
  ...antiSpam,
});

/** Short contact-page enquiry. */
export const contactSchema = z.object({
  kind: z.literal("contact"),
  fullName,
  phone,
  email,
  message: message.min(10, { error: "Please tell us a little about what you need (at least 10 characters)." }),
  consent,
  ...antiSpam,
});

export const enquirySchema = z.discriminatedUnion("kind", [assessmentSchema, contactSchema]);

export type AssessmentInput = z.input<typeof assessmentSchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;
