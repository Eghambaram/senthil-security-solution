import { Check, Eye, HeartHandshake, Scale, ShieldCheck, Target, TrendingUp, Handshake, type LucideIcon } from "lucide-react";
import { aboutPage } from "@/content/about";
import { company } from "@/content/company";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isPending, isVisible, visible, type FactStatus } from "@/lib/facts";
import { formatTime } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description: aboutPage.metaDescription,
  path: "/about",
});

const valueIcons: Record<string, LucideIcon> = {
  Discipline: ShieldCheck,
  Vigilance: Eye,
  Integrity: Scale,
  Respect: HeartHandshake,
};

const visionIcons: LucideIcon[] = [Target, Handshake, TrendingUp];

export default function AboutPage() {
  const { story, vision, values, leadership, people, details } = aboutPage;
  const md = company.managingDirector;
  const hours = company.hours.value;
  const a = company.address.value;

  const companyDetails: { label: string; value: string; status: FactStatus }[] = [
    { label: "Established", value: "26 May 2012", status: company.foundingDate.status },
    {
      label: "Registered office",
      value: `${a.street}, ${a.locality}, ${a.city}, ${a.region} ${a.postalCode}`,
      status: company.address.status,
    },
    { label: "Managing Director", value: md.value.name, status: md.status },
    { label: "Office phone", value: company.phone.value.display, status: company.phone.status },
    { label: "Mobile & WhatsApp", value: company.mobile.value.display, status: company.mobile.status },
    { label: "Email", value: company.email.value, status: company.email.status },
    {
      label: "Office hours",
      value: `${hours.days}, ${formatTime(hours.opens)} – ${formatTime(hours.closes)}; ${hours.closed} closed`,
      status: company.hours.status,
    },
    { label: "GSTIN", value: company.gstin.value, status: company.gstin.status },
    { label: "PSARA licence", value: "", status: company.psaraLicence.status },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: "About", href: "/about" }]}
        eyebrow={aboutPage.eyebrow}
        title={aboutPage.title}
        intro={aboutPage.intro}
        image="aboutPrimary"
      />

      <section aria-labelledby="story-title" className="section-y">
        <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <SectionHeading id="story-title" eyebrow={story.eyebrow} title={story.title} />
            <div className="mt-6 space-y-5 text-body-lg text-ink-muted">
              {story.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <ImageFrame image="aboutSecondary" sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="vision-title" className="on-dark bg-navy-900 py-16 lg:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading id="vision-title" tone="dark" eyebrow={vision.eyebrow} title={vision.title} />
          </Reveal>
          <ul className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {vision.items.map((v, index) => (
              <li key={v.title}>
                <Reveal delay={index * 0.06}>
                  <Icon icon={visionIcons[index] ?? Target} size={24} className="text-gold-500" />
                  <h3 className="mt-4 font-display text-lg font-bold text-white">{v.title}</h3>
                  <p className="mt-1.5 text-[15px] text-white/75">{v.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="values-title" className="section-y bg-surface">
        <div className="container-site">
          <Reveal>
            <SectionHeading id="values-title" eyebrow={values.eyebrow} title={values.title} />
          </Reveal>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-2 lg:grid-cols-4">
            {values.items.map((v, index) => (
              <li key={v.title} className="bg-white p-6 sm:p-7">
                <Reveal delay={index * 0.06}>
                  <Icon icon={valueIcons[v.title] ?? ShieldCheck} size={24} className="text-gold-ink" />
                  <h3 className="mt-4 font-display text-xl font-bold text-navy-900">{v.title}</h3>
                  <p className="mt-2 text-[15px] text-ink-muted">{v.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {isVisible(leadership) && isVisible(md) ? (
        <section id="leadership" aria-labelledby="leadership-title" className="section-y scroll-mt-24">
          <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <SectionHeading id="leadership-title" eyebrow={leadership.eyebrow} title={leadership.title} />
              <p className="mt-5 text-ink-muted">{leadership.team}</p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-8">
              <article className="flex flex-col gap-6 rounded-lg border border-border p-6 shadow-card sm:flex-row sm:p-8">
                <span
                  aria-hidden="true"
                  className="flex size-20 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-2xl font-extrabold text-gold-500"
                >
                  KS
                </span>
                <div>
                  <h3 className="text-h3">{md.value.name}</h3>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-gold-ink">
                    {md.value.title}, Senthil Security Solutions
                  </p>
                  <div className="mt-4 space-y-3 text-ink-muted">
                    {leadership.managingDirector.bio.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>
      ) : null}

      {isVisible(people) ? (
        <section aria-labelledby="people-title" className="section-y">
          <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <SectionHeading
                id="people-title"
                eyebrow={people.eyebrow}
                title={
                  <>
                    {people.title}
                    {isPending(people) ? <PendingBadge /> : null}
                  </>
                }
              />
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-7">
              <p className="text-body-lg text-ink-muted">{people.body}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {people.training.map((t) => (
                  <li key={t} className="flex gap-3 text-[15px] text-ink">
                    <Icon icon={Check} className="mt-0.5 text-gold-ink" />
                    {t}
                  </li>
                ))}
              </ul>
              <Button href="/careers" variant="tertiary" arrow className="mt-8">
                Join our team
              </Button>
            </Reveal>
          </div>
        </section>
      ) : null}

      <ProcessSteps />

      <section aria-labelledby="details-title" className="section-y border-t border-border">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading id="details-title" eyebrow={details.eyebrow} title={details.title} />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-8">
            <dl className="divide-y divide-border border-y border-border">
              {visible(companyDetails).map((d) => (
                <div key={d.label} className="grid gap-1 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-muted">{d.label}</dt>
                  <dd className="text-ink">
                    {d.value}
                    {isPending(d) ? <PendingBadge /> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
