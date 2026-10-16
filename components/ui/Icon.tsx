import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  icon: LucideIcon;
  size?: 20 | 24;
  className?: string;
  /** Accessible label; omit for decorative icons. */
  label?: string;
};

/** Lucide icon at the system stroke weight and sizes. */
export function Icon({ icon: LucideComponent, size = 20, className, label }: Props) {
  return (
    <LucideComponent
      size={size}
      strokeWidth={1.5}
      className={cn("shrink-0", className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
