import { Plus } from "lucide-react";
import type { Faq } from "@/content/faqs";
import { company } from "@/content/company";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqJsonLd } from "@/lib/seo";
import { isPending, visible } from "@/lib/facts";

type Props = {
  faqs: readonly Faq[];
  eyebrow?: string;
  title?: string;
};

/** Native <details> accordion (works without JS) plus FAQPage JSON-LD for the rendered items. */
export function FAQAccordion({ faqs, eyebrow = "FAQ", title = "Questions we are often asked." }: Props) {
  const items = visible(faqs);
  if (items.length === 0) return null;
  const phone = company.phone.value;

  return (
    <section aria-labelledby="faq-title" className="section-y">
      <JsonLd data={faqJsonLd(items)} />
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <SectionHeading id="faq-title" eyebrow={eyebrow} title={title} />
          <p className="mt-5 text-ink-muted">
            Can’t find your answer? Call us on{" "}
            <a href={`tel:${phone.tel}`} className="whitespace-nowrap font-semibold text-gold-ink underline underline-offset-4">
              {phone.display}
            </a>
            .
          </p>
        </Reveal>
        <div className="divide-y divide-border border-y border-border lg:col-span-8">
          {items.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left font-display text-lg font-bold text-navy-900 [&::-webkit-details-marker]:hidden">
                <span>
                  {faq.question}
                  {isPending(faq) ? <PendingBadge /> : null}
                </span>
                <Plus
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="mt-0.5 size-6 shrink-0 text-gold-ink transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="max-w-2xl pb-6 text-ink-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
