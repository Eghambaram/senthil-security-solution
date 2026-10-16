import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, ClipboardList } from "lucide-react";
import type { Metadata } from "next";
import { getIndustry, industries } from "@/content/industries";
import { getService, type ServiceDetail } from "@/content/services";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isPending, isVisible, visible } from "@/lib/facts";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string };
type Props = { params: Promise<Params> };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return industries.filter(isVisible).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const industry = getIndustry((await params).slug);
  if (!industry || !isVisible(industry)) return {};
  return buildMetadata({ title: industry.metaTitle, description: industry.metaDescription, path: `/industries/${industry.slug}` });
}

export default async function IndustryPage({ params }: Props) {
  const industry = getIndustry((await params).slug);
  if (!industry || !isVisible(industry)) notFound();

  const relevant = industry.services.map(getService).filter((s): s is ServiceDetail => s !== undefined && isVisible(s));
  const others = visible(industries).filter((i) => i.slug !== industry.slug);

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Industries", href: "/industries" },
          { label: industry.title, href: `/industries/${industry.slug}` },
        ]}
        eyebrow="Industries we serve"
        title={industry.title}
        intro={industry.intro}
        image={industry.image}
        pending={isPending(industry)}
        actions={
          <Button href="/site-assessment" arrow>
            Request a Site Assessment
          </Button>
        }
      />

      <section aria-labelledby="challenges-title" className="section-y">
        <div className="container-site">
          <Reveal>
            <SectionHeading id="challenges-title" eyebrow="The challenge" title="What we see in this sector." />
          </Reveal>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {industry.challenges.map((c, index) => (
              <li key={c.title}>
                <Reveal delay={index * 0.05} className="flex h-full gap-4 rounded-lg border border-border p-6">
                  <Icon icon={AlertTriangle} size={24} className="text-gold-ink" />
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-900">{c.title}</h3>
                    <p className="mt-1.5 text-[15px] text-ink-muted">{c.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {relevant.length > 0 ? (
        <section aria-labelledby="help-title" className="section-y bg-surface">
          <div className="container-site">
            <Reveal>
              <SectionHeading id="help-title" eyebrow="How we help" title="Services that fit." />
            </Reveal>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relevant.map((s) => (
                <li key={s.slug}>
                  <ServiceCard service={s} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="planning-title" className="section-y">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <SectionHeading id="planning-title" eyebrow="Planning" title="What we look at during the site visit." />
            <ul className="mt-8 space-y-4">
              {industry.planningPoints.map((p) => (
                <li key={p} className="flex gap-3 text-body-lg text-ink">
                  <Icon icon={ClipboardList} className="mt-1 text-gold-ink" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          {others.length > 0 ? (
            <Reveal delay={0.1} className="lg:col-span-5">
              <nav aria-labelledby="other-industries" className="rounded-lg border border-border bg-surface p-6 sm:p-8">
                <h2 id="other-industries" className="font-display text-lg font-bold text-navy-900">
                  Other industries
                </h2>
                <ul className="mt-4 divide-y divide-border">
                  {others.map((i) => (
                    <li key={i.slug}>
                      <Link
                        href={`/industries/${i.slug}`}
                        className="group flex min-h-12 items-center justify-between gap-3 text-[15px] text-ink hover:text-navy-900"
                      >
                        <span>
                          {i.title}
                          {isPending(i) ? <PendingBadge /> : null}
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="size-4 text-gold-ink transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </Reveal>
          ) : null}
        </div>
      </section>

      <CTASection />
    </>
  );
}
