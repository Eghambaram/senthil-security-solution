import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export const inputClass =
  "block w-full rounded-md border border-border bg-white px-3.5 py-3 text-[16px] text-ink placeholder:text-ink-muted/70 transition-colors hover:border-ink-muted/60 focus-visible:border-navy-900 focus-visible:outline-2 focus-visible:outline-offset-0 aria-[invalid=true]:border-danger";

/** ids for the hint and error, to wire into aria-describedby. */
export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

export function FormField({ id, label, required = false, hint, error, className, children }: Props) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-900">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-ink-muted"> (optional)</span>
        )}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mb-1.5 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className={cn("mt-1.5 text-sm font-medium text-danger")}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
