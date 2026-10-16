import type { LegalSection } from "@/content/legal";
import { PageHero } from "@/components/sections/PageHero";

type Props = {
  title: string;
  href: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export function LegalDocument({ title, href, intro, updated, sections }: Props) {
  return (
    <>
      <PageHero crumbs={[{ label: title, href }]} eyebrow="Legal" title={title} intro={intro} />
      <article className="section-y">
        <div className="container-site max-w-3xl">
          <p className="text-sm text-ink-muted">
            Last updated: <time dateTime={updated}>{formatDate(updated)}</time>
          </p>
          <div className="mt-8 space-y-10">
            {sections.map((section) => (
              <section key={section.heading} aria-labelledby={`legal-${slug(section.heading)}`}>
                <h2 id={`legal-${slug(section.heading)}`} className="text-h3">
                  {section.heading}
                </h2>
                {section.paragraphs?.map((p) => (
                  <p key={p} className="mt-3 text-ink">
                    {p}
                  </p>
                ))}
                {section.list ? (
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-ink marker:text-gold-ink">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
