import { notFound } from "next/navigation";
import { Building2, Factory, Home, Phone, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Styleguide",
  description: "Internal design-system reference.",
  path: "/styleguide",
  noIndex: true,
});

const colors = [
  { name: "navy-900", hex: "#0B1C32", className: "bg-navy-900", note: "Utility bar, banners, footer" },
  { name: "navy-800", hex: "#142B45", className: "bg-navy-800", note: "Hover, cards on dark" },
  { name: "graphite", hex: "#202A35", className: "bg-graphite", note: "Deep neutral" },
  { name: "gold-500", hex: "#D6A33C", className: "bg-gold-500", note: "CTA fill, rules, icons on dark. Never text on white" },
  { name: "gold-300", hex: "#F2C76A", className: "bg-gold-300", note: "Hover / text on dark" },
  { name: "gold-ink", hex: "#8A6316", className: "bg-gold-ink", note: "Gold-toned text on light" },
  { name: "ink", hex: "#17263A", className: "bg-ink", note: "Primary text" },
  { name: "ink-muted", hex: "#647184", className: "bg-ink-muted", note: "Secondary text" },
  { name: "surface", hex: "#F5F7FA", className: "bg-surface", note: "Alt section background" },
  { name: "border", hex: "#E2E7ED", className: "bg-border", note: "Hairlines" },
  { name: "success", hex: "#1F7A4D", className: "bg-success", note: "Success states" },
  { name: "danger", hex: "#B42318", className: "bg-danger", note: "Errors" },
] as const;

const typeScale = [
  { token: "text-display", sample: "Protection that earns your trust." },
  { token: "text-h1", sample: "A safer tomorrow, built on discipline." },
  { token: "text-h2", sample: "Security for every environment." },
  { token: "text-h3", sample: "Industrial Security" },
  { token: "text-body-lg", sample: "Professional security solutions built around people, discipline and reliability." },
  { token: "text-body", sample: "Trained teams, clear reporting and a single point of contact for your site." },
] as const;

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-12 first:border-t-0">
      <h2 className="mb-8 text-h3">{title}</h2>
      {children}
    </section>
  );
}

/** Dev-only reference for every design-system component (PROMPT.md §9, Phase 2). */
export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="container-site py-12 lg:py-16">
      <Eyebrow>Internal · Dev only</Eyebrow>
      <h1 className="mt-4 text-h1">Styleguide</h1>
      <p className="mt-3 max-w-2xl text-ink-muted">
        Tokens and components from CLAUDE.md §8. This route returns 404 in production.
      </p>

      <Block title="Colour">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {colors.map((c) => (
            <li key={c.name} className="overflow-hidden rounded-lg border border-border">
              <div className={`h-20 ${c.className}`} />
              <div className="p-3 text-sm">
                <p className="font-semibold text-navy-900">
                  {c.name} <span className="font-normal text-ink-muted">{c.hex}</span>
                </p>
                <p className="mt-1 text-ink-muted">{c.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Type scale">
        <div className="space-y-8">
          {typeScale.map((t) => (
            <div key={t.token} className="grid gap-2 md:grid-cols-[160px_1fr] md:items-baseline">
              <code className="text-sm text-ink-muted">{t.token}</code>
              <p className={`${t.token} ${t.token.startsWith("text-h") || t.token === "text-display" ? "font-display text-navy-900" : ""}`}>
                {t.sample}
              </p>
            </div>
          ))}
          <div className="grid gap-2 md:grid-cols-[160px_1fr] md:items-baseline">
            <code className="text-sm text-ink-muted">Eyebrow</code>
            <Eyebrow>Our services</Eyebrow>
          </div>
        </div>
      </Block>

      <Block title="Section heading">
        <SectionHeading
          eyebrow="Our services"
          title="Security for every environment."
          description="Professional security solutions tailored to the needs of your premises, people and operations."
        />
      </Block>

      <Block title="Buttons: light surface">
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/site-assessment" arrow>
            Request a Site Assessment
          </Button>
          <Button href="/services" variant="secondary">
            Explore Our Services
          </Button>
          <Button href="/services" variant="tertiary" arrow>
            Explore service
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </Block>

      <Block title="Buttons: dark surface">
        <div className="on-dark flex flex-wrap items-center gap-4 rounded-lg bg-navy-900 p-8">
          <Button href="/site-assessment" tone="dark" arrow>
            Request a Consultation
          </Button>
          <Button
            href="tel:+914443806837"
            tone="dark"
            variant="secondary"
            icon={<Phone aria-hidden="true" strokeWidth={1.5} className="size-5" />}
          >
            Call Our Team
          </Button>
          <Button href="/about" tone="dark" variant="tertiary" arrow>
            Know more about us
          </Button>
          <SectionHeading
            className="mt-6 w-full"
            tone="dark"
            eyebrow="Your safety partner"
            title="Let’s build a safer workplace."
            description="Talk to our team about a security plan tailored to your premises."
          />
        </div>
      </Block>

      <Block title="Icons (Lucide, 1.5px stroke, 20/24px)">
        <div className="flex flex-wrap items-center gap-6 text-navy-900">
          {[Factory, Building2, Home, ShieldCheck, Phone].map((I, i) => (
            <span key={i} className="flex items-center gap-3">
              <Icon icon={I} size={20} />
              <Icon icon={I} size={24} />
            </span>
          ))}
        </div>
      </Block>

      <Block title="Badges">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Neutral</Badge>
          <Badge tone="gold">Since 2012</Badge>
          <Badge tone="success">Submitted</Badge>
          <Badge tone="danger">Required</Badge>
          <span className="text-sm text-ink-muted">
            Pending fact
            <PendingBadge />
          </span>
        </div>
      </Block>

      <Block title="Card surface & radius">
        <div className="grid gap-6 sm:grid-cols-3">
          {(["rounded-sm", "rounded-md", "rounded-lg"] as const).map((r) => (
            <div
              key={r}
              className={`${r} border border-border bg-white p-6 shadow-card transition-transform duration-200 ease-brand hover:-translate-y-1`}
            >
              <p className="font-display font-bold text-navy-900">{r}</p>
              <p className="mt-1 text-sm text-ink-muted">shadow-card · lifts 4px on hover</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Motion: Reveal">
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 0.08, 0.16].map((d) => (
            <Reveal key={d} delay={d} className="rounded-lg bg-surface p-6 text-sm text-ink-muted">
              Reveal, delay {d}s
            </Reveal>
          ))}
        </div>
      </Block>
    </div>
  );
}
