import { z } from "zod";

/**
 * Indian phone numbers: mobiles (6–9 + 9 digits) and landlines with STD
 * code (e.g. 044 4380 6837), with optional +91 / 91 / 0 prefix. Spaces,
 * dashes and brackets are ignored.
 */
export function isIndianPhone(value: string): boolean {
  const digits = value.replace(/[\s\-().]/g, "");
  return /^(?:\+?91|0)?[2-9]\d{9}$/.test(digits);
}

export const fullName = z
  .string()
  .trim()
  .min(2, { error: "Please enter your full name." })
  .max(100, { error: "Please keep your name under 100 characters." });

export const phone = z
  .string()
  .trim()
  .min(1, { error: "Please enter a phone number." })
  .refine(isIndianPhone, { error: "Please enter a valid Indian phone number, e.g. 98765 43210." });

export const email = z.email({ error: "Please enter a valid email address." }).trim().max(200);

export const optionalEmail = z.union([z.literal(""), email]).optional();

export const consent = z.literal(true, { error: "Please confirm you agree so we can contact you." });

/** Hidden field bots fill in; humans never see it. */
export const honeypot = z.string().max(0).optional();

/** Spam controls carried with every submission (verified server-side in Phase 5). */
export const antiSpam = {
  website: honeypot,
  startedAt: z.number().int().positive(),
  turnstileToken: z.string().optional(),
};

/** Minimum time a human takes to fill a form; faster submissions are treated as bots. */
export const MIN_SUBMIT_MS = 3000;
