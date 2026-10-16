import { CalendarCheck, MapPin, ShieldCheck, UserCheck, Users, type LucideIcon } from "lucide-react";
import { hero, trustRow, type TrustItem } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { ImageFrame, hasPhoto } from "@/components/ui/ImageFrame";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { cn } from "@/lib/cn";
import { isPending, visible } from "@/lib/facts";

const trustIcons: Record<TrustItem["id"], LucideIcon> = {
  since: CalendarCheck,
  personnel: Users,
  vetted: UserCheck,
  location: MapPin,
};

type Props = {
  /** Hide "Explore Our Services" when the services section is not rendered. */
  showServicesLink: boolean;
};

export function HeroSection({ showServicesLink }: Props) {
  const items = visible(trustRow);
  const footnote = items.find((i) => i.footnote)?.footnote;
  const photo = hasPhoto("hero");

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-white">
      {/* Image: first on mobile, bleeds to the right viewport edge on desktop. */}
      <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[44%] xl:w-[47%]">
        <div
          className={cn(
            "relative overflow-hidden lg:h-full",
            photo ? "aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto" : "aspect-[16/10] lg:aspect-auto",
          )}
        >
          <div className="absolute inset-0 animate-settle">
            <ImageFrame image="hero" sizes="(min-width: 1024px) 100vw, 230vw" quality={85} priority />
          </div>
        </div>

        <div className="relative z-10 mx-4 -mt-10 animate-rise [animation-delay:300ms] sm:mx-6 sm:max-w-sm lg:absolute lg:bottom-14 lg:left-8 lg:mx-0 lg:mt-0 lg:max-w-[22rem]">
          <div className="flex gap-4 rounded-lg border border-border bg-white p-5 shadow-float">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-ink">
              <Icon icon={ShieldCheck} size={24} />
            </span>
            <div>
              <p className="font-display text-[17px] font-bold leading-snug text-navy-900">{hero.panel.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{hero.panel.body}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-site relative">
        <div className="pb-14 pt-10 sm:pb-16 lg:min-h-[640px] lg:w-[56%] lg:py-24 lg:pr-8 xl:w-[50%] xl:py-28">
          <div className="animate-rise">
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </div>
          <h1 id="hero-title" className="mt-5 text-display lg:text-[3.5rem] xl:text-display">
            <span className="block animate-slide-up [animation-delay:80ms]">{hero.titleLine1}</span>{" "}
            <span className="block animate-slide-up [animation-delay:160ms]">
              {hero.titleLine2} <span className="text-gold-ink">{hero.titleAccent}</span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-body-lg text-ink-muted [animation-delay:240ms]">{hero.body}</p>

          <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:320ms]">
            <Button href={hero.primaryCta.href} arrow>
              {hero.primaryCta.label}
            </Button>
            {showServicesLink ? (
              <Button href={hero.secondaryCta.href} variant="secondary">
                {hero.secondaryCta.label}
              </Button>
            ) : null}
          </div>

          {/* 2×2 at every width: four items never fit one row beside the image. */}
          <ul className="mt-10 grid max-w-xl animate-rise grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-8 [animation-delay:400ms] sm:gap-x-10">
            {items.map((item) => (
              <li key={item.id} className="flex flex-col items-start gap-2.5 sm:flex-row sm:gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-ink sm:size-10">
                  <Icon icon={trustIcons[item.id]} size={20} />
                </span>
                <span className="min-w-0 text-sm leading-snug">
                  <span className="block text-ink-muted">{item.label}</span>
                  <span className="mt-0.5 block font-display text-[15px] font-bold leading-tight text-navy-900 sm:text-lg">
                    {item.value}
                    {isPending(item) ? <PendingBadge /> : null}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {footnote ? <p className="mt-4 text-xs text-ink-muted">{footnote}</p> : null}
        </div>
      </div>
    </section>
  );
}
