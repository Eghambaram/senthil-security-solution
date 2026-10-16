"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { get, useForm, useWatch, type FieldErrors } from "react-hook-form";
import {
  EXPERIENCE_RANGES,
  FORCES_BRANCHES,
  RESUME_TYPES,
  careerSchema,
  type Career,
  type CareerInput,
} from "@/lib/schemas/career";
import { submitForm } from "@/lib/forms/submit";
import { FileDropzone } from "./FileDropzone";
import { FormErrorSummary } from "./FormErrorSummary";
import { FormField, describedBy, inputClass } from "./FormField";
import { FormSuccess } from "./FormSuccess";
import { SubmitButton } from "./SubmitButton";

type Props = {
  /** Roles open for applications; gated roles are filtered out by the page. */
  roleOptions: { value: string; label: string }[];
};

const PREFIX = "career";
const FIELD_ORDER = [
  "fullName",
  "phone",
  "email",
  "preferredRole",
  "experienceYears",
  "servedInForces",
  "forcesBranch",
  "location",
  "resume",
  "consent",
] as const;

const ACCEPT = [...Object.keys(RESUME_TYPES), ...Object.values(RESUME_TYPES)].join(",");

type Status = { kind: "idle" } | { kind: "error"; message: string } | { kind: "success"; reference: string };

export function CareerApplicationForm({ roleOptions }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [summaryFields, setSummaryFields] = useState<{ id: string; message: string }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CareerInput, unknown, Career>({
    resolver: zodResolver(careerSchema),
    defaultValues: { website: "", servedInForces: undefined },
    shouldFocusError: false,
  });

  useEffect(() => {
    setValue("startedAt", Date.now());
  }, [setValue]);

  const served = useWatch({ control, name: "servedInForces" });
  const resume = useWatch({ control, name: "resume" });

  const errorFor = (name: string): string | undefined => get(errors, name)?.message as string | undefined;

  const a11y = (name: string, hint?: string) => ({
    id: `${PREFIX}-${name}`,
    "aria-invalid": errorFor(name) ? true : undefined,
    "aria-describedby": describedBy(`${PREFIX}-${name}`, hint, errorFor(name)),
  });

  const onInvalid = (errs: FieldErrors<CareerInput>) => {
    const fields = FIELD_ORDER.flatMap((name) => {
      const message = get(errs, name)?.message as string | undefined;
      return message ? [{ id: `${PREFIX}-${name}`, message }] : [];
    });
    setSummaryFields(fields);
    setStatus({
      kind: "error",
      message: fields.length
        ? "Please check the highlighted fields."
        : "Something went wrong preparing your application. Please reload the page and try again.",
    });
  };

  const onValid = async (values: Career) => {
    setSummaryFields([]);
    setStatus({ kind: "idle" });

    const data = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === "") continue;
      data.append(key, value instanceof File ? value : String(value));
    }

    const result = await submitForm("/api/careers", data);
    if (result.ok) {
      setStatus({ kind: "success", reference: result.reference });
      return;
    }
    if (result.fieldErrors) {
      for (const [name, message] of Object.entries(result.fieldErrors)) {
        setError(name as keyof CareerInput, { type: "server", message });
      }
      setSummaryFields(Object.entries(result.fieldErrors).map(([name, message]) => ({ id: `${PREFIX}-${name}`, message })));
    }
    setStatus({ kind: "error", message: result.message });
  };

  if (status.kind === "success") {
    return (
      <FormSuccess
        title="Thank you for applying."
        body="Our team will review your application and contact you if there is a suitable opening."
        reference={status.reference}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate className="space-y-6">
      <p className="text-sm text-ink-muted">
        Fields marked <span className="text-danger">*</span> are required.
      </p>

      <div aria-live="polite">
        {status.kind === "error" ? <FormErrorSummary message={status.message} fields={summaryFields} /> : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id={`${PREFIX}-fullName`} label="Full name" required error={errorFor("fullName")}>
          <input type="text" autoComplete="name" className={inputClass} {...a11y("fullName")} {...register("fullName")} />
        </FormField>

        <FormField id={`${PREFIX}-phone`} label="Phone" required error={errorFor("phone")}>
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

        <FormField id={`${PREFIX}-email`} label="Email" error={errorFor("email")}>
          <input type="email" autoComplete="email" className={inputClass} {...a11y("email")} {...register("email")} />
        </FormField>

        <FormField id={`${PREFIX}-location`} label="Where do you live?" required hint="Area and city" error={errorFor("location")}>
          <input
            type="text"
            autoComplete="address-level2"
            className={inputClass}
            {...a11y("location", "hint")}
            {...register("location")}
          />
        </FormField>

        <FormField id={`${PREFIX}-preferredRole`} label="Preferred role" required error={errorFor("preferredRole")}>
          <select className={inputClass} defaultValue="" {...a11y("preferredRole")} {...register("preferredRole")}>
            <option value="" disabled>
              Choose a role
            </option>
            {roleOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id={`${PREFIX}-experienceYears`} label="Security experience" required error={errorFor("experienceYears")}>
          <select className={inputClass} defaultValue="" {...a11y("experienceYears")} {...register("experienceYears")}>
            <option value="" disabled>
              Choose your experience
            </option>
            {EXPERIENCE_RANGES.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <fieldset aria-describedby={errorFor("servedInForces") ? `${PREFIX}-servedInForces-error` : undefined}>
        <legend className="mb-2 text-sm font-semibold text-navy-900">
          Have you served in the armed forces, a central armed police force or the police?
          <span className="text-danger" aria-hidden="true">
            {" "}
            *
          </span>
        </legend>
        <div className="flex gap-6" id={`${PREFIX}-servedInForces`} tabIndex={-1}>
          {(["yes", "no"] as const).map((v) => (
            <label key={v} className="flex min-h-11 items-center gap-2 text-[15px]">
              <input type="radio" value={v} className="size-5 accent-navy-900" {...register("servedInForces")} />
              {v === "yes" ? "Yes" : "No"}
            </label>
          ))}
        </div>
        {errorFor("servedInForces") ? (
          <p id={`${PREFIX}-servedInForces-error`} className="mt-1.5 text-sm font-medium text-danger">
            {errorFor("servedInForces")}
          </p>
        ) : null}
      </fieldset>

      {served === "yes" ? (
        <FormField id={`${PREFIX}-forcesBranch`} label="Where did you serve?" required error={errorFor("forcesBranch")} className="sm:max-w-sm">
          <select className={inputClass} defaultValue="" {...a11y("forcesBranch")} {...register("forcesBranch")}>
            <option value="" disabled>
              Choose one
            </option>
            {FORCES_BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </FormField>
      ) : null}

      <FormField id={`${PREFIX}-resume`} label="CV / resume" hint="PDF, DOC or DOCX, up to 5 MB" error={errorFor("resume")}>
        <FileDropzone
          id={`${PREFIX}-resume`}
          accept={ACCEPT}
          file={resume}
          invalid={!!errorFor("resume")}
          describedBy={describedBy(`${PREFIX}-resume`, "hint", errorFor("resume"))}
          onChange={(file) => setValue("resume", file, { shouldValidate: true })}
        />
      </FormField>

      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={`${PREFIX}-website`}>Website</label>
        <input id={`${PREFIX}-website`} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <div className="flex gap-3">
          <input type="checkbox" className="mt-1 size-5 shrink-0 accent-navy-900" {...a11y("consent")} {...register("consent")} />
          <label htmlFor={`${PREFIX}-consent`} className="text-[15px] text-ink">
            I agree that Senthil Security Solutions may use these details to assess my application, as described in the{" "}
            <Link href="/privacy-policy" className="font-semibold text-navy-900 underline underline-offset-2">
              privacy policy
            </Link>
            . <span className="text-danger" aria-hidden="true">*</span>
          </label>
        </div>
        {errorFor("consent") ? (
          <p id={`${PREFIX}-consent-error`} className="mt-1.5 text-sm font-medium text-danger">
            {errorFor("consent")}
          </p>
        ) : null}
      </div>

      <SubmitButton pending={isSubmitting}>Submit Application</SubmitButton>
    </form>
  );
}
