import { cn } from "@/lib/cn";

type Props = { className?: string; label?: string };

/**
 * Yellow dev-only marker for content awaiting client confirmation
 * (CLAUDE.md §2.2). Renders nothing in production.
 */
export function PendingBadge({ className, label = "Pending" }: Props) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <span
      title="Awaiting client confirmation. Hidden in production."
      className={cn(
        "ml-1.5 inline-flex shrink-0 items-center rounded-sm bg-yellow-300 px-1.5 py-px align-middle font-sans text-[10px] font-bold uppercase tracking-wide text-black",
        className,
      )}
    >
      {label}
    </span>
  );
}
