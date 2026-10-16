import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  tone?: "light" | "dark";
  /** Compact size for the shrunken sticky header. */
  compact?: boolean;
  className?: string;
};

/**
 * Legacy raster crest + typeset wordmark. Replace the PNG with the vector
 * original once supplied (docs/CONTENT-GAPS.md #16).
 */
export function Logo({ tone = "light", compact = false, className }: Props) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-3 rounded-sm", className)}
    >
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-sm transition-[width,height] duration-200",
          tone === "dark" && "bg-white p-1",
          compact ? "size-10" : "size-12",
        )}
      >
        <Image
          src="/brand/logo-legacy.png"
          alt=""
          width={200}
          height={196}
          sizes="48px"
          className="h-full w-auto"
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[19px] font-extrabold uppercase tracking-[0.04em]",
            tone === "light" ? "text-navy-900" : "text-white",
          )}
        >
          Senthil
        </span>{" "}
        <span
          className={cn(
            "mt-1 whitespace-nowrap font-display text-[10.5px] font-bold uppercase tracking-[0.16em]",
            tone === "light" ? "text-navy-900/80" : "text-white/80",
          )}
        >
          Security Solutions
        </span>
      </span>
    </Link>
  );
}
