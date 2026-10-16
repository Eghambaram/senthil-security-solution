"use client";

import { Phone } from "lucide-react";
import { useEffect, useRef } from "react";
import { company } from "@/content/company";

type ErrorProps = {
  message: string;
  /** Field-level problems to list, each linking to its field. */
  fields?: { id: string; message: string }[];
};

/** Error summary announced to screen readers, with the phone as a fallback. */
export function FormErrorSummary({ message, fields = [] }: ErrorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const phone = company.phone.value;

  useEffect(() => {
    ref.current?.focus();
  }, [message, fields.length]);

  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className="rounded-lg border border-danger/30 bg-danger/5 p-5 text-[15px] outline-none"
    >
      <p className="font-semibold text-danger">{message}</p>
      {fields.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-ink">
          {fields.map((f) => (
            <li key={f.id}>
              <a href={`#${f.id}`} className="underline underline-offset-2 hover:text-danger">
                {f.message}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-3 text-ink-muted">
        Prefer to talk? Call{" "}
        <a href={`tel:${phone.tel}`} className="inline-flex items-center gap-1 font-semibold text-navy-900 underline underline-offset-2">
          <Phone aria-hidden="true" strokeWidth={1.5} className="size-4" />
          {phone.display}
        </a>
        .
      </p>
    </div>
  );
}
