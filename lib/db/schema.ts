import { bigserial, boolean, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Site-assessment and contact enquiries. Retained 12 months (CLAUDE.md §10). */
export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: text("reference").notNull().unique(),
    kind: text("kind", { enum: ["assessment", "contact"] }).notNull(),
    fullName: text("full_name").notNull(),
    organisation: text("organisation"),
    phone: text("phone").notNull(),
    email: text("email").notNull(),
    serviceRequired: text("service_required"),
    siteLocation: text("site_location"),
    premisesType: text("premises_type"),
    personnelRequired: text("personnel_required"),
    message: text("message"),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    ipHash: text("ip_hash").notNull(),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    notifiedAt: timestamp("notified_at", { withTimezone: true }),
    notifyError: text("notify_error"),
  },
  (t) => [index("enquiries_created_at_idx").on(t.createdAt)],
);

/** Career applications. Retained 6 months; CVs live in the private R2 bucket. */
export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: text("reference").notNull().unique(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    preferredRole: text("preferred_role").notNull(),
    experience: text("experience").notNull(),
    servedInForces: boolean("served_in_forces").notNull(),
    forcesBranch: text("forces_branch"),
    location: text("location").notNull(),
    resumeKey: text("resume_key"),
    resumeName: text("resume_name"),
    resumeSize: integer("resume_size"),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    ipHash: text("ip_hash").notNull(),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    notifiedAt: timestamp("notified_at", { withTimezone: true }),
    notifyError: text("notify_error"),
  },
  (t) => [index("applications_created_at_idx").on(t.createdAt)],
);

/** Rate-limit log (5 per 10 minutes per hashed IP per form). Pruned after a day. */
export const submissionAttempts = pgTable(
  "submission_attempts",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    form: text("form", { enum: ["enquiry", "careers"] }).notNull(),
    ipHash: text("ip_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("submission_attempts_lookup_idx").on(t.form, t.ipHash, t.createdAt)],
);

export type NewEnquiry = typeof enquiries.$inferInsert;
export type NewApplication = typeof applications.$inferInsert;
