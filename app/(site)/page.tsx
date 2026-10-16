import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Security Services in Chennai",
  description:
    "Professional security solutions for industrial, commercial and residential environments in Chennai, built around discipline, vigilance and people.",
  path: "/",
});

/** Provisional hero using approved copy (PROMPT.md §6C). Full homepage lands in Phase 3. */
export default function HomePage() {
  return (
    <section className="section-y">
      <div className="container-site max-w-3xl">
        <Eyebrow>People. Process. Protection.</Eyebrow>
        <h1 className="mt-5 text-display">
          Protection that earns <span className="text-gold-ink">your trust.</span>
        </h1>
        <p className="mt-6 max-w-xl text-body-lg text-ink-muted">
          Professional security solutions for industrial, commercial and residential environments—built around
          discipline, vigilance and people.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/site-assessment" arrow>
            Discuss Your Security Needs
          </Button>
          <Button href="/services" variant="secondary">
            Explore Our Services
          </Button>
        </div>
      </div>
    </section>
  );
}
