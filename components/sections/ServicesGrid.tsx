import { MessageSquare } from "lucide-react";
import { servicesIntro } from "@/content/home";
import { services, type ServiceDetail } from "@/content/services";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isVisible } from "@/lib/facts";

const CORE = ["industrial-security", "corporate-commercial-security", "residential-security"];

/**
 * Three core services plus a fourth card: armed (if licensed), else event
 * (if confirmed), else a "talk to us" tile (PROMPT.md §6D).
 */
export function getHomeServices(): { cards: ServiceDetail[]; showFallback: boolean } {
  const bySlug = (slug: string) => services.find((s) => s.slug === slug);
  const core = CORE.map(bySlug).filter((s): s is ServiceDetail => !!s && isVisible(s));
  const fourth = [bySlug("armed-ex-servicemen"), bySlug("event-security")].find((s) => s && isVisible(s));
  const cards = fourth ? [...core, fourth] : core;
  return { cards, showFallback: cards.length > 0 && cards.length < 4 };
}

export function ServicesGrid() {
  const { cards, showFallback } = getHomeServices();
  if (cards.length === 0) return null;

  return (
    <section id="services" aria-labelledby="services-title" className="section-y scroll-mt-20">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow={servicesIntro.eyebrow}
            id="services-title"
            title={servicesIntro.title}
            description={servicesIntro.description}
          />
        </Reveal>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((service, index) => (
            <li key={service.slug}>
              <Reveal delay={index * 0.08} className="h-full">
                <ServiceCard service={service} />
              </Reveal>
            </li>
          ))}
          {showFallback ? (
            <li>
              <Reveal delay={cards.length * 0.08} className="h-full">
                <div className="on-dark flex h-full flex-col justify-between rounded-lg bg-navy-900 p-6 text-white">
                  <div>
                    <span className="flex size-12 items-center justify-center rounded-md bg-white/10 text-gold-500">
                      <Icon icon={MessageSquare} size={24} />
                    </span>
                    <h3 className="mt-6 text-h3 text-white">{servicesIntro.fallbackTile.title}</h3>
                    <p className="mt-2 text-[15px] text-white/75">{servicesIntro.fallbackTile.body}</p>
                  </div>
                  <Button href={servicesIntro.fallbackTile.cta.href} tone="dark" variant="tertiary" arrow className="mt-6 self-start">
                    {servicesIntro.fallbackTile.cta.label}
                  </Button>
                </div>
              </Reveal>
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}
