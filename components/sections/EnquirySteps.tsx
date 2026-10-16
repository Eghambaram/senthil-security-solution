import { enquirySteps } from "@/content/services";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  id?: string;
  /** Heading level within the page outline. */
  as?: "h2" | "h3";
  compact?: boolean;
  className?: string;
};

/** The three steps from first contact to proposal. */
export function EnquirySteps({ title, id, as: Heading = "h2", compact = false, className }: Props) {
  const Step = Heading === "h2" ? "h3" : "h4";

  return (
    <div className={className}>
      <Heading id={id} className={cn(compact ? "text-h3" : "text-h2")}>{title}</Heading>
      <ol className={cn("mt-8 grid gap-6", !compact && "md:grid-cols-3 md:gap-8")}>
        {enquirySteps.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-sm font-bold text-gold-500"
            >
              {index + 1}
            </span>
            <div>
              <Step className="font-display text-lg font-bold text-navy-900">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </Step>
              <p className="mt-1.5 text-[15px] text-ink-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
