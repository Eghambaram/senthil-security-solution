"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { get, useForm, useWatch, type FieldErrors } from "react-hook-form";
import {
  MESSAGE_MAX,
  PERSONNEL_RANGES,
  PREMISES_TYPES,
  SERVICE_NOT_SURE,
  enquirySchema,
  type Enquiry,
  type EnquiryInput,
} from "@/lib/schemas/enquiry";
import { submitForm } from "@/lib/forms/submit";
import { cn } from "@/lib/cn";
import { FormErrorSummary } from "./FormErrorSummary";
import { FormField, describedBy, inputClass } from "./FormField";
import { FormSuccess } from "./FormSuccess";
import { SubmitButton } from "./SubmitButton";
import { TURNSTILE_SITE_KEY, TurnstileWidget } from "./TurnstileWidget";

type Props = {
  variant: "assessment" | "contact";
  /** Confirmed service names (from content/services.ts); "Not sure" is always added. */
  serviceOptions?: string[];
};

/** Field order, for listing errors in the same order the visitor sees them. */
const FIELD_ORDER = [
  "fullName",
  "organisation",
  "phone",
  "email",
  "serviceRequired",
  "siteLocation",
  "premisesType",
  "personnelRequired",
  "message",
  "consent",
] as const;

type Status = { kind: "idle" } | { kind: "error"; message: string } | { kind: "success"; reference: string; demo: boolean };

export function EnquiryForm({ variant, serviceOptions = [] }: Props) {
  const isAssessment = variant === "assessment";
  const prefix = `enq-${variant}`;
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [summaryFields, setSummaryFields] = useState<{ id: string; message: string }[]>([]);
  const [turnstileReset, setTurnstileReset] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput, unknown, Enquiry>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { kind: variant, website: "" } as EnquiryInput,
    shouldFocusError: false,
  });

  // Start the human-timing clock once the form is interactive.
  useEffect(() => {
    setValue("startedAt", Date.now());
  }, [setValue]);

  const messageLength = (useWatch({ control, name: "message" }) ?? "").length;

  const errorFor = (name: string): string | undefined => get(errors, name)?.message as string | undefined;

  const collectFieldErrors = (errs: FieldErrors<EnquiryInput>) =>
    FIELD_ORDER.flatMap((name) => {
      const message = get(errs, name)?.message as string | undefined;
      return message ? [{ id: `${prefix}-${name}`, message }] : [];
    });

  const onInvalid = (errs: FieldErrors<EnquiryInput>) => {
    const fields = collectFieldErrors(errs);
    setSummaryFields(fields);
    setStatus({
      kind: "error",
      message: fields.length
        ? "Please check the highlighted fields."
        : "Something went wrong preparing your enquiry. Please reload the page and try again.",
    });
  };

  const onValid = async (values: Enquiry) => {
    setSummaryFields([]);
    if (TURNSTILE_SITE_KEY && !values.turnstileToken) {
      setStatus({ kind: "error", message: "Please wait for the security check to finish, then submit again." });
      return;
    }
    setStatus({ kind: "idle" });
    const result = await submitForm("/api/enquiry", values);
    if (result.ok) {
      setStatus({ kind: "success", reference: result.reference, demo: result.demo });
      return;
    }
    // Turnstile tokens are single-use: get a fresh one for the retry.
    setTurnstileReset((n) => n + 1);
    if (result.fieldErrors) {
      for (const [name, message] of Object.entries(result.fieldErrors)) {
        setError(name as keyof EnquiryInput, { type: "server", message });
      }
      setSummaryFields(
        Object.entries(result.fieldErrors).map(([name, message]) => ({ id: `${prefix}-${name}`, message })),
      );
    }
    setStatus({ kind: "error", message: result.message });
  };

  if (status.kind === "success") {
    return (
      <FormSuccess
        title="Thank you. We have your enquiry."
        body="Our team will contact you to discuss your requirements. Please keep your reference handy if you call us."
        reference={status.reference}
        demo={status.demo}
      />
    );
  }

  const a11y = (name: string, hint?: string) => ({
    id: `${prefix}-${name}`,
    "aria-invalid": errorFor(name) ? true : undefined,
    "aria-describedby": describedBy(`${prefix}-${name}`, hint, errorFor(name)),
  });

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate className="space-y-6" aria-describedby={`${prefix}-required-note`}>
      <p id={`${prefix}-required-note`} className="text-sm text-ink-muted">
        Fields marked <span className="text-danger">*</span> are required.
      </p>

      <div aria-live="polite">
        {status.kind === "error" ? <FormErrorSummary message={status.message} fields={summaryFields} /> : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id={`${prefix}-fullName`} label="Full name" required error={errorFor("fullName")}>
          <input type="text" autoComplete="name" className={inputClass} {...a11y("fullName")} {...register("fullName")} />
        </FormField>

        {isAssessment ? (
          <FormField id={`${prefix}-organisation`} label="Organisation" error={errorFor("organisation")}>
            <input
              type="text"
              autoComplete="organization"
              className={inputClass}
              {...a11y("organisation")}
              {...register("organisation")}
            />
          </FormField>
        ) : null}

        <FormField id={`${prefix}-phone`} label="Phone" required error={errorFor("phone")}>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            className={inputClass}
            {...a11y("phone")}
            {...register("phone")}
          />
        </FormField>

        <FormField id={`${prefix}-email`} label="Email" required error={errorFor("email")}>
          <input type="email" autoComplete="email" className={inputClass} {...a11y("email")} {...register("email")} />
        </FormField>

        {isAssessment ? (
          <>
            <FormField id={`${prefix}-serviceRequired`} label="Service required" required error={errorFor("serviceRequired")}>
              <select className={inputClass} defaultValue="" {...a11y("serviceRequired")} {...register("serviceRequired")}>
                <option value="" disabled>
                  Choose a service
                </option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value={SERVICE_NOT_SURE}>{SERVICE_NOT_SURE}</option>
              </select>
            </FormField>

            <FormField id={`${prefix}-premisesType`} label="Type of premises" required error={errorFor("premisesType")}>
              <select className={inputClass} defaultValue="" {...a11y("premisesType")} {...register("premisesType")}>
                <option value="" disabled>
                  Choose a type
                </option>
                {PREMISES_TYPES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              id={`${prefix}-siteLocation`}
              label="Site location"
              required
              hint="Area or locality, e.g. Guindy, Chennai"
              error={errorFor("siteLocation")}
            >
              <input
                type="text"
                autoComplete="address-level2"
                className={inputClass}
                {...a11y("siteLocation", "hint")}
                {...register("siteLocation")}
              />
            </FormField>

            <FormField id={`${prefix}-personnelRequired`} label="Personnel needed" error={errorFor("personnelRequired")}>
              <select className={inputClass} defaultValue="" {...a11y("personnelRequired")} {...register("personnelRequired")}>
                <option value="">Choose a range</option>
                {PERSONNEL_RANGES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </FormField>
          </>
        ) : null}
      </div>

      <FormField
        id={`${prefix}-message`}
        label={isAssessment ? "Anything else we should know?" : "How can we help?"}
        required={!isAssessment}
        error={errorFor("message")}
      >
        <textarea
          rows={5}
          maxLength={MESSAGE_MAX}
          className={cn(inputClass, "resize-y")}
          {...a11y("message")}
          {...register("message")}
        />
        <p className="mt-1 text-right text-xs text-ink-muted" aria-live="polite">
          {messageLength} / {MESSAGE_MAX}
        </p>
      </FormField>

      {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={`${prefix}-website`}>Website</label>
        <input id={`${prefix}-website`} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <div className="flex gap-3">
          <input
            type="checkbox"
            className="mt-1 size-5 shrink-0 accent-navy-900"
            {...a11y("consent")}
            {...register("consent")}
          />
          <label htmlFor={`${prefix}-consent`} className="text-[15px] text-ink">
            I agree that Senthil Security Solutions may use these details to respond to my enquiry, as described in the{" "}
            <Link href="/privacy-policy" className="font-semibold text-navy-900 underline underline-offset-2">
              privacy policy
            </Link>
            . <span className="text-danger" aria-hidden="true">*</span>
          </label>
        </div>
        {errorFor("consent") ? (
          <p id={`${prefix}-consent-error`} className="mt-1.5 text-sm font-medium text-danger">
            {errorFor("consent")}
          </p>
        ) : null}
      </div>

      <TurnstileWidget onToken={(token) => setValue("turnstileToken", token)} resetKey={turnstileReset} />

      <SubmitButton pending={isSubmitting}>{isAssessment ? "Request a Site Assessment" : "Send Enquiry"}</SubmitButton>
    </form>
  );
}
