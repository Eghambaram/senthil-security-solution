import { approach } from "@/content/home";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isPending, isVisible } from "@/lib/facts";

/** Numbered process rail: horizontal on desktop, vertical on mobile (PROMPT.md §4, pattern 5). */
export function ProcessSteps() {
  if (!isVisible(approach)) return null;

  return (
    <section aria-labelledby="approach-title" className="section-y">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            id="approach-title"
            eyebrow={approach.eyebrow}
            title={
              <>
                {approach.title}
                {isPending(approach) ? <PendingBadge label="Pending: confirm practice" /> : null}
              </>
            }
          />
        </Reveal>
        <ol className="relative mt-14 grid gap-10 lg:grid-cols-4 lg:gap-8">
          {/* Connecting rule */}
          <span aria-hidden="true" className="absolute bottom-4 left-[27px] top-4 w-px bg-border lg:hidden" />
          <span aria-hidden="true" className="absolute left-0 right-0 top-[27px] hidden h-px bg-border lg:block" />
          {approach.steps.map((step, index) => (
            <li key={step.title} className="relative">
              <Reveal delay={index * 0.08} className="grid grid-cols-[56px_1fr] gap-5 lg:block">
                <span
                  aria-hidden="true"
                  className="relative flex size-14 items-center justify-center bg-white font-display text-[28px] font-extrabold text-transparent [-webkit-text-stroke:1.25px_var(--color-gold-ink)] lg:justify-start lg:pr-4"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="lg:mt-6">
                  <h3 className="font-display text-lg font-bold text-navy-900">
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] text-ink-muted">{step.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
