import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  tone?: "neutral" | "gold" | "success" | "danger";
  className?: string;
  children: ReactNode;
};

const tones = {
  neutral: "border-border bg-surface text-ink",
  gold: "border-gold-500/40 bg-gold-500/15 text-gold-ink",
  success: "border-success/30 bg-success/10 text-success",
  danger: "border-danger/30 bg-danger/10 text-danger",
} as const;

export function Badge({ tone = "neutral", className, children }: Props) {
  return (
    <span className={cn("inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}
