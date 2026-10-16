import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import { getService, services, type ServiceDetail } from "@/content/services";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { CTASection } from "@/components/sections/CTASection";
import { EnquirySteps } from "@/components/sections/EnquirySteps";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isPending, isVisible } from "@/lib/facts";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";

type Params = { slug: string };
type Props = { params: Promise<Params> };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return services.filter(isVisible).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service || !isVisible(service)) return {};
  return buildMetadata({ title: service.metaTitle, description: service.metaDescription, path: `/services/${service.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service || !isVisible(service)) notFound();

  const related = service.related.map(getService).filter((s): s is ServiceDetail => s !== undefined && isVisible(s));
  const lower = service.title.toLowerCase();

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      <PageHero
        crumbs={[
          { label: "Services", href: "/services" },
          { label: service.title, href: `/services/${service.slug}` },
        ]}
        eyebrow="Our services"
        title={service.title}
        intro={service.intro}
        image={service.image}
        pending={isPending(service)}
        actions={
          <Button href="/site-assessment" arrow>
            Request a Site Assessment
          </Button>
        }
      />

      {/* What it is + typical requirements */}
      <section aria-labelledby="overview-title" className="section-y">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <SectionHeading id="overview-title" eyebrow="Overview" title={`What ${lower} covers.`} />
            <div className="mt-6 space-y-5 text-body-lg text-ink-muted">
              {service.overview.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
              <h2 className="font-display text-lg font-bold text-navy-900">Typical requirements we cover</h2>
              <ul className="mt-5 space-y-3.5">
                {service.requirements.map((r) => (
                  <li key={r} className="flex gap-3 text-[15px] text-ink">
                    <Icon icon={Check} className="mt-0.5 text-gold-ink" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section aria-labelledby="capabilities-title" className="section-y bg-surface">
        <div className="container-site">
          <Reveal>
            <SectionHeading id="capabilities-title" eyebrow="Capabilities" title="What our officers do on site." />
          </Reveal>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-2 lg:grid-cols-3">
            {service.capabilities.map((c, index) => (
              <li key={c.title} className="bg-white p-6 sm:p-7">
                <Reveal delay={index * 0.05}>
                  <span className="font-display text-sm font-bold text-gold-ink">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-display text-lg font-bold text-navy-900">{c.title}</h3>
                  <p className="mt-2 text-[15px] text-ink-muted">{c.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {service.procedures ? (
        <section aria-labelledby="procedures-title" className="section-y">
          <div className="container-site">
            <Reveal>
              <SectionHeading
                id="procedures-title"
                eyebrow="How we work"
                title={service.procedures.title}
                description={service.procedures.intro}
              />
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {service.procedures.groups.map((group, index) => (
                <Reveal key={group.title} delay={index * 0.05} className="rounded-lg border border-border p-6">
                  <h3 className="font-display text-lg font-bold text-navy-900">{group.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[15px] text-ink">
                        <Icon icon={Check} className="mt-0.5 text-gold-ink" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Benefits + facilities */}
      <section aria-labelledby="benefits-title" className={service.procedures ? "section-y border-t border-border" : "section-y"}>
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionHeading id="benefits-title" eyebrow="Benefits" title="What it means for you." />
            </Reveal>
            <dl className="mt-10 grid gap-8 sm:grid-cols-2">
              {service.benefits.map((b, index) => (
                <Reveal key={b.title} delay={index * 0.05}>
                  <dt className="flex items-center gap-3 font-display text-lg font-bold text-navy-900">
                    <span aria-hidden="true" className="h-0.5 w-5 bg-gold-500" />
                    {b.title}
                  </dt>
                  <dd className="mt-2 text-[15px] text-ink-muted">{b.body}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="on-dark rounded-lg bg-navy-900 p-6 text-white sm:p-8">
              <Eyebrow tone="dark">Suitable for</Eyebrow>
              <h2 className="mt-4 font-display text-xl font-bold text-white">Premises we typically secure</h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {service.facilities.map((f) => (
                  <li key={f} className="rounded-sm border border-white/20 px-3 py-1.5 text-sm text-white/85">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="enquiry-steps-title" className="section-y bg-surface">
        <div className="container-site">
          <Reveal>
            <Eyebrow>Getting started</Eyebrow>
            <div className="mt-4">
              <EnquirySteps id="enquiry-steps-title" title={`How to arrange ${lower}.`} />
            </div>
          </Reveal>
        </div>
      </section>

      <FAQAccordion
        faqs={service.faqs.map((f) => ({ ...f, status: service.status }))}
        eyebrow={`${service.title} FAQ`}
        title="Common questions."
      />

      {related.length > 0 ? (
        <section aria-labelledby="related-title" className="section-y border-t border-border">
          <div className="container-site">
            <SectionHeading id="related-title" eyebrow="Related services" title="You may also need." />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <li key={s.slug}>
                  <ServiceCard service={s} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <CTASection />
    </>
  );
}
