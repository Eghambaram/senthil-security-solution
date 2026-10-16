CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"preferred_role" text NOT NULL,
	"experience" text NOT NULL,
	"served_in_forces" boolean NOT NULL,
	"forces_branch" text,
	"location" text NOT NULL,
	"resume_key" text,
	"resume_name" text,
	"resume_size" integer,
	"consent_at" timestamp with time zone NOT NULL,
	"ip_hash" text NOT NULL,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notified_at" timestamp with time zone,
	"notify_error" text,
	CONSTRAINT "applications_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"kind" text NOT NULL,
	"full_name" text NOT NULL,
	"organisation" text,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"service_required" text,
	"site_location" text,
	"premises_type" text,
	"personnel_required" text,
	"message" text,
	"consent_at" timestamp with time zone NOT NULL,
	"ip_hash" text NOT NULL,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notified_at" timestamp with time zone,
	"notify_error" text,
	CONSTRAINT "enquiries_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "submission_attempts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"form" text NOT NULL,
	"ip_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "applications_created_at_idx" ON "applications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "submission_attempts_lookup_idx" ON "submission_attempts" USING btree ("form","ip_hash","created_at");