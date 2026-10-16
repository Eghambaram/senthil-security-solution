import { MessageSquare } from "lucide-react";
import { services } from "@/content/services";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { CTASection } from "@/components/sections/CTASection";
import { EnquirySteps } from "@/components/sections/EnquirySteps";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { visible } from "@/lib/facts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Security Services",
  description:
    "Security services in Chennai for factories, offices, IT parks, apartments and events, planned around your premises. Request a site assessment.",
  path: "/services",
});

export default function ServicesPage() {
  const items = visible(services);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }]}
        eyebrow="Our services"
        title="Security for every environment."
        intro="Professional security solutions tailored to the needs of your premises, people and operations."
        actions={
          <Button href="/site-assessment" arrow>
            Request a Site Assessment
          </Button>
        }
      />

      <section aria-labelledby="all-services-title" className="section-y">
        <h2 id="all-services-title" className="sr-only">
          All services
        </h2>
        <ul className="container-site grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service, index) => (
            <li key={service.slug}>
              <Reveal delay={index * 0.06} className="h-full">
                <ServiceCard service={service} />
              </Reveal>
            </li>
          ))}
          <li className={items.length === 0 ? "sm:col-span-2 lg:col-span-3" : undefined}>
            <Reveal delay={items.length * 0.06} className="h-full">
              <div className="on-dark flex h-full flex-col justify-between rounded-lg bg-navy-900 p-6 text-white sm:p-8">
                <div>
                  <span className="flex size-12 items-center justify-center rounded-md bg-white/10 text-gold-500">
                    <Icon icon={MessageSquare} size={24} />
                  </span>
                  <h3 className="mt-6 text-h3 text-white">Not sure what you need?</h3>
                  <p className="mt-2 max-w-xl text-[15px] text-white/75">
                    Tell us about your premises and what worries you. We will visit, look at the site and suggest the right
                    cover.
                  </p>
                </div>
                <Button href="/site-assessment" tone="dark" variant="tertiary" arrow className="mt-6 self-start">
                  Talk to us
                </Button>
              </div>
            </Reveal>
          </li>
        </ul>
      </section>

      <section aria-labelledby="steps-title" className="section-y border-t border-border pt-16 lg:pt-20">
        <div className="container-site">
          <EnquirySteps id="steps-title" title="How an enquiry works." />
        </div>
      </section>

      <CTASection />
    </>
  );
}
