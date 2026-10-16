import { GraduationCap, Handshake, UserCheck, type LucideIcon } from "lucide-react";
import { about } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isPending, isVisible, visible } from "@/lib/facts";

const indicatorIcons: Record<string, LucideIcon> = {
  management: UserCheck,
  trained: GraduationCap,
  client: Handshake,
};

export function AboutFeature() {
  const forces = isVisible(about.forcesSentence);

  return (
    <section aria-labelledby="about-title" className="section-y">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <div className="relative pb-16 pr-10 sm:pr-24">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <ImageFrame image="aboutPrimary" sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
            <div className="absolute bottom-0 right-0 aspect-[4/3] w-[48%] overflow-hidden rounded-lg border-4 border-white shadow-float">
              <ImageFrame image="aboutSecondary" sizes="(min-width: 1024px) 22vw, 48vw" />
            </div>
            <div className="absolute -bottom-2 left-4 rounded-lg border border-border bg-white px-5 py-4 shadow-float sm:left-6">
              <p className="font-display text-h3 text-navy-900">{about.badge.value}</p>
              <p className="mt-0.5 text-sm text-ink-muted">{about.badge.label}</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-6" delay={0.1}>
          <SectionHeading id="about-title" eyebrow={about.eyebrow} title={about.title} />
          <p className="mt-6 text-body-lg text-ink-muted">
            {about.body} {forces ? about.forcesSentence.text : about.commitmentSentence}
            {forces && isPending(about.forcesSentence) ? <PendingBadge /> : null}
          </p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {visible(about.indicators).map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gold-500/50 text-gold-ink">
                  <Icon icon={indicatorIcons[item.id] ?? Handshake} />
                </span>
                <span className="text-[15px] font-semibold leading-snug text-navy-900">
                  {item.label}
                  {isPending(item) ? <PendingBadge /> : null}
                </span>
              </li>
            ))}
          </ul>

          <Button href={about.cta.href} variant="secondary" arrow className="mt-10">
            {about.cta.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
