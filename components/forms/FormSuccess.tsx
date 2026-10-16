"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";

type SuccessProps = {
  title: string;
  body: string;
  reference: string;
  /** Preview build without live email/storage: say plainly that nothing was sent. */
  demo?: boolean;
};

/** Shown only after the server confirms the submission (CLAUDE.md §2.6). */
export function FormSuccess({ title, body, reference, demo = false }: SuccessProps) {
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
      {demo ? (
        <>
          <h2 className="mt-4 text-h3">Preview: the form works</h2>
          <p className="mt-2 text-ink-muted">
            This is a review copy of the new website. Your details were checked but <strong>not sent</strong>: email
            delivery and file uploads will be connected before launch.
          </p>
        </>
      ) : (
        <>
          <h2 className="mt-4 text-h3">{title}</h2>
          <p className="mt-2 text-ink-muted">{body}</p>
        </>
      )}
      <p className="mt-4 text-sm text-ink">
        Your reference: <strong className="font-mono text-navy-900">{reference}</strong>
      </p>
    </div>
  );
}
