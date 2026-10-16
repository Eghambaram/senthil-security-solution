import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industriesIntro } from "@/content/home";
import { industries } from "@/content/industries";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { isPending, visible } from "@/lib/facts";

type Props = {
  /** Hide the section heading when the page hero already introduces the list. */
  showHeading?: boolean;
};

/** Sector mosaic: two large tiles over four small ones, captions on a navy scrim. */
export function IndustriesGrid({ showHeading = true }: Props) {
  const items = visible(industries);
  if (items.length === 0) return null;

  const TileHeading = showHeading ? "h3" : "h2";

  return (
    <section aria-labelledby={showHeading ? "industries-title" : undefined} aria-label={showHeading ? undefined : "Industries"} className="section-y">
      <div className="container-site">
        {showHeading ? (
          <Reveal>
            <SectionHeading id="industries-title" eyebrow={industriesIntro.eyebrow} title={industriesIntro.title} />
          </Reveal>
        ) : null}
        <ul className={cn(showHeading && "mt-12", "grid auto-rows-[180px] grid-cols-2 gap-4 lg:auto-rows-[200px] lg:grid-cols-4")}>
          {items.map((industry, index) => {
            const large = index < 2;
            return (
              <li key={industry.slug} className={cn(large ? "col-span-2 row-span-2 sm:col-span-1 lg:col-span-2" : "col-span-1")}>
                <Reveal delay={index * 0.06} className="h-full">
                  <div className="group relative h-full overflow-hidden rounded-lg">
                    <ImageFrame
                      image={industry.image}
                      sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                      imgClassName="transition-transform duration-500 ease-brand group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/95 via-navy-900/70 to-transparent p-4 pt-12 lg:p-5 lg:pt-16">
                      <TileHeading className={cn("flex items-end justify-between gap-3 font-display font-bold text-white", large ? "text-xl lg:text-2xl" : "text-base lg:text-lg")}>
                        <Link
                          href={`/industries/${industry.slug}`}
                          className="on-dark rounded-sm after:absolute after:inset-0 after:content-['']"
                        >
                          {industry.title}
                          {isPending(industry) ? <PendingBadge /> : null}
                        </Link>
                        <ArrowUpRight
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="size-5 shrink-0 text-gold-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </TileHeading>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
