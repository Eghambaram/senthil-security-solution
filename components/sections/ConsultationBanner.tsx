import { consultation } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageFrame, hasPhoto } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type Props = {
  /** True when the previous section already provides bottom spacing. */
  flushTop?: boolean;
};

/** Dark navy band with a low-opacity duotone photo (PROMPT.md §4, pattern 4). */
export function ConsultationBanner({ flushTop = false }: Props) {
  return (
    <section aria-labelledby="consultation-title" className={cn("pb-16 lg:pb-24", !flushTop && "pt-16 lg:pt-24")}>
      <div className="container-site">
        <Reveal>
          <div className="on-dark relative isolate overflow-hidden rounded-lg bg-navy-900 px-6 py-12 sm:px-10 lg:px-14 lg:py-14">
            <div className={cn("absolute inset-0 -z-10", hasPhoto("consultation") && "opacity-20 mix-blend-luminosity")}>
              <ImageFrame image="consultation" sizes="(min-width: 1280px) 1216px, 100vw" />
            </div>
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className="lg:col-span-6">
                <Eyebrow tone="dark">{consultation.eyebrow}</Eyebrow>
                <h2 id="consultation-title" className="mt-4 text-h2 text-white">
                  {consultation.title}
                </h2>
              </div>
              <div className="lg:col-span-6 lg:border-l lg:border-white/15 lg:pl-12">
                <p className="text-body-lg text-white/80">{consultation.body}</p>
                <Button href={consultation.cta.href} tone="dark" arrow className="mt-6">
                  {consultation.cta.label}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
