import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

type Props = {
  eyebrow: string;
  /** id for the heading, used by aria-labelledby on the section. */
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Pages own their single h1, so sections default to h2. */
  as?: "h1" | "h2";
  tone?: "light" | "dark";
  align?: "start" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  id,
  title,
  description,
  as: Heading = "h2",
  tone = "light",
  align = "start",
  className,
}: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Eyebrow tone={tone} className={cn(align === "center" && "justify-center")}>
        {eyebrow}
      </Eyebrow>
      <Heading id={id} className={cn("mt-4", Heading === "h1" ? "text-h1" : "text-h2", tone === "dark" && "text-white")}>
        {title}
      </Heading>
      {description ? (
        <p className={cn("mt-4 text-body-lg", tone === "light" ? "text-ink-muted" : "text-white/75")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
