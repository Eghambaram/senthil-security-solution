import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  tone?: "light" | "dark";
  className?: string;
  children: ReactNode;
};

/** Uppercase label preceded by a 24×2px gold rule. */
export function Eyebrow({ tone = "light", className, children }: Props) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-eyebrow uppercase",
        tone === "light" ? "text-navy-900" : "text-white/85",
        className,
      )}
    >
      <span aria-hidden="true" className="h-0.5 w-6 shrink-0 bg-gold-500" />
      {children}
    </p>
  );
}
