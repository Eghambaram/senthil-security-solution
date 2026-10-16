import type { ReactNode } from "react";
import type { ImageKey } from "@/content/images";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { PendingBadge } from "@/components/ui/PendingBadge";
import type { Crumb } from "@/lib/seo";

type Props = {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  intro: string;
  image?: ImageKey;
  pending?: boolean;
  actions?: ReactNode;
};

/** Inner-page hero: breadcrumbs, eyebrow, the page's single h1, intro and optional image. */
export function PageHero({ crumbs, eyebrow, title, intro, image, pending = false, actions }: Props) {
  return (
    <section aria-labelledby="page-title" className="border-b border-border bg-surface">
      <div className="container-site grid gap-10 py-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-16">
        <div className={image ? "lg:col-span-7" : "lg:col-span-9"}>
          <Breadcrumbs items={crumbs} />
          <Eyebrow className="mt-8">{eyebrow}</Eyebrow>
          <h1 id="page-title" className="mt-4 text-h1">
            {title}
            {pending ? <PendingBadge /> : null}
          </h1>
          <p className="mt-5 max-w-2xl text-body-lg text-ink-muted">{intro}</p>
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg lg:col-span-5">
            <ImageFrame image={image} sizes="(min-width: 1024px) 40vw, 100vw" priority />
          </div>
        ) : null}
      </div>
    </section>
  );
}
