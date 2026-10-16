"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";

type SuccessProps = {
  title: string;
  body: string;
  reference: string;
};

/** Shown only after the server confirms the submission (CLAUDE.md §2.6). */
export function FormSuccess({ title, body, reference }: SuccessProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="rounded-lg border border-success/30 bg-success/5 p-6 outline-none sm:p-8"
    >
      <CheckCircle2 aria-hidden="true" strokeWidth={1.5} className="size-10 text-success" />
      <h2 className="mt-4 text-h3">{title}</h2>
      <p className="mt-2 text-ink-muted">{body}</p>
      <p className="mt-4 text-sm text-ink">
        Your reference: <strong className="font-mono text-navy-900">{reference}</strong>
      </p>
    </div>
  );
}
