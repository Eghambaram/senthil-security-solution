import { company } from "@/content/company";
import { glanceIntro } from "@/content/home";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { cn } from "@/lib/cn";
import type { FactStatus } from "@/lib/facts";
import { isPending, visible } from "@/lib/facts";

type GlanceFact = { label: string; value: string; status: FactStatus };

const lgCols: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

/** Stands in for testimonials until attributable ones exist (PROMPT.md §6J). */
export function CompanyAtAGlance() {
  const { address, hours, psaraLicence } = company;

  const facts: GlanceFact[] = [
    { label: "Established", value: "2012", status: company.foundingDate.status },
    { label: "Based in", value: `${address.value.locality}, ${address.value.city}`, status: address.status },
    { label: "Open", value: `${hours.value.days}`, status: hours.status },
    { label: "PSARA", value: "Licensed", status: psaraLicence.status },
  ];

  const items = visible(facts);

  return (
    <section aria-labelledby="glance-title" className="on-dark bg-navy-900 py-14 lg:py-16">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <Eyebrow tone="dark">{glanceIntro.eyebrow}</Eyebrow>
          <h2 id="glance-title" className="mt-4 text-h3 text-white lg:text-[28px]">
            {glanceIntro.title}
          </h2>
        </div>
        <dl
          className={cn(
            "grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/10 lg:col-span-8 [&>*:last-child:nth-child(odd)]:col-span-2 lg:[&>*:last-child:nth-child(odd)]:col-span-1",
            lgCols[items.length],
          )}
        >
          {items.map((fact) => (
            <div key={fact.label} className="bg-navy-900 p-5 lg:px-6">
              <dt className="text-eyebrow uppercase text-white/60">{fact.label}</dt>
              <dd className="mt-2 font-display text-xl font-bold text-white">
                {fact.value}
                {isPending(fact) ? <PendingBadge /> : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
