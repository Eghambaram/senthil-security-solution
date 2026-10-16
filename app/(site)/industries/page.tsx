import { industries } from "@/content/industries";
import { CTASection } from "@/components/sections/CTASection";
import { IndustriesGrid } from "@/components/sections/IndustriesGrid";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { visible } from "@/lib/facts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Industries We Serve",
  description:
    "Security for factories, warehouses, offices, IT parks, commercial buildings, apartments and events in Chennai, planned around each sector’s risks.",
  path: "/industries",
});

export default function IndustriesPage() {
  const hasIndustries = visible(industries).length > 0;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Industries", href: "/industries" }]}
        eyebrow="Industries we serve"
        title="Wherever people work and live."
        intro="Every type of premises has its own weak points. We plan security around the way your site actually runs."
        actions={
          <Button href="/site-assessment" arrow>
            Request a Site Assessment
          </Button>
        }
      />
      {hasIndustries ? (
        <IndustriesGrid showHeading={false} />
      ) : (
        <section aria-labelledby="sector-title" className="section-y">
          <div className="container-site max-w-3xl">
            <h2 id="sector-title" className="text-h2">
              Tell us about your premises.
            </h2>
            <p className="mt-4 text-body-lg text-ink-muted">
              Factories, offices, shops, residential communities or a one-off event: describe your site and we will
              explain how we would approach it.
            </p>
            <Button href="/site-assessment" arrow className="mt-8">
              Request a Site Assessment
            </Button>
          </div>
        </section>
      )}
      <CTASection />
    </>
  );
}
