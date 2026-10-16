"use client";

import { FileText, Upload, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  accept: string;
  file: File | undefined;
  onChange: (file: File | undefined) => void;
  invalid?: boolean;
  describedBy?: string;
};

function formatSize(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Keyboard-accessible file picker with drag-and-drop. */
export function FileDropzone({ id, accept, file, onChange, invalid = false, describedBy }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onChange(dropped);
  };

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3">
        <FileText aria-hidden="true" strokeWidth={1.5} className="size-6 shrink-0 text-navy-900" />
        <p className="min-w-0 flex-1 text-sm">
          <span className="block truncate font-semibold text-navy-900">{file.name}</span>
          <span className="text-ink-muted">{formatSize(file.size)}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            onChange(undefined);
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="inline-flex size-10 items-center justify-center rounded-md text-ink-muted hover:bg-white hover:text-danger"
          aria-label={`Remove ${file.name}`}
        >
          <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
        </button>
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-7 text-center transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy-900",
        dragging ? "border-navy-900 bg-surface" : "border-border hover:border-ink-muted/60 hover:bg-surface/60",
        invalid && "border-danger",
      )}
    >
      <Upload aria-hidden="true" strokeWidth={1.5} className="size-6 text-navy-900" />
      <span className="text-sm">
        <span className="font-semibold text-navy-900 underline underline-offset-2">Choose a file</span>
        <span className="text-ink-muted"> or drag it here</span>
      </span>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.files?.[0])}
      />
    </label>
  );
}
