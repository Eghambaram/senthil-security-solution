import Image from "next/image";
import { galleryGroups, galleryPage } from "@/content/gallery";
import { images } from "@/content/images";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Gallery",
  description: galleryPage.metaDescription,
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Gallery", href: "/gallery" }]}
        eyebrow={galleryPage.eyebrow}
        title={galleryPage.title}
        intro={galleryPage.intro}
        actions={
          <>
            <Button href="/site-assessment" arrow>
              Request a Site Assessment
            </Button>
            <Button href="/careers" variant="secondary">
              Join our team
            </Button>
          </>
        }
      />

      {galleryGroups.map((group, index) => (
        <section
          key={group.id}
          id={group.id}
          aria-labelledby={`${group.id}-title`}
          className={index % 2 === 1 ? "section-y scroll-mt-24 bg-surface" : "section-y scroll-mt-24"}
        >
          <div className="container-site">
            <Reveal>
              <SectionHeading
                id={`${group.id}-title`}
                eyebrow={group.title}
                title={group.heading}
                description={group.intro}
              />
            </Reveal>
            {/* CSS columns keep each photo's own shape (landscape and portrait). */}
            <ul className="mt-10 gap-6 sm:columns-2 lg:columns-3">
              {group.items.map(({ image, caption }) => {
                const entry = images[image];
                if (!entry.src || !entry.approved) return null;
                return (
                  <li key={image} className="mb-6 break-inside-avoid">
                    <figure>
                      <div className="overflow-hidden rounded-lg bg-navy-900">
                        <Image
                          src={entry.src}
                          alt={entry.alt}
                          width={entry.width}
                          height={entry.height}
                          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                          className="h-auto w-full"
                        />
                      </div>
                      <figcaption className="mt-2.5 text-sm text-ink-muted">{caption}</figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ))}

      <CTASection />
    </>
  );
}
