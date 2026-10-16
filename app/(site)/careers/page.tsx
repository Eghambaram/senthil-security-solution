import { BadgeCheck, Medal, Phone } from "lucide-react";
import { careersPage } from "@/content/careers";
import { company } from "@/content/company";
import { CareerApplicationForm } from "@/components/forms/CareerApplicationForm";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isPending, isVisible, visible } from "@/lib/facts";
import { ROLES } from "@/lib/schemas/career";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Security Guard Jobs in Chennai",
  description: careersPage.metaDescription,
  path: "/careers",
});

export default function CareersPage() {
  const { why, roles, exServicemen, privacyNote } = careersPage;
  const openRoles = visible(roles.items);
  const openRoleIds = new Set(openRoles.map((r) => r.id));
  // "Other" is always open; gated roles (e.g. gunman) only when their role is visible.
  const roleOptions = ROLES.filter((r) => r.value === "other" || openRoleIds.has(r.value)).map((r) => ({
    value: r.value,
    label: r.label,
  }));
  const phone = company.phone.value;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Careers", href: "/careers" }]}
        eyebrow={careersPage.eyebrow}
        title={careersPage.title}
        intro={careersPage.intro}
        actions={
          <>
            <Button href="#apply" arrow>
              Apply now
            </Button>
            <Button
              href={`tel:${phone.tel}`}
              variant="secondary"
              icon={<Phone aria-hidden="true" strokeWidth={1.5} className="size-5" />}
            >
              Call {phone.display}
            </Button>
          </>
        }
      />

      <section aria-labelledby="why-work-title" className="section-y">
        <div className="container-site">
          <Reveal>
            <SectionHeading id="why-work-title" eyebrow={why.eyebrow} title={why.title} />
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visible(why.items).map((item, index) => (
              <li key={item.title}>
                <Reveal delay={index * 0.05} className="h-full rounded-lg border border-border p-6">
                  <Icon icon={BadgeCheck} size={24} className="text-gold-ink" />
                  <h3 className="mt-4 font-display text-lg font-bold text-navy-900">
                    {item.title}
                    {isPending(item) ? <PendingBadge /> : null}
                  </h3>
                  <p className="mt-1.5 text-[15px] text-ink-muted">{item.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="roles-title" className="section-y bg-surface">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading id="roles-title" eyebrow={roles.eyebrow} title={roles.title} />
          </Reveal>
          <div className="space-y-6 lg:col-span-8">
            <ul className="grid gap-6 sm:grid-cols-2">
              {openRoles.map((role, index) => (
                <li key={role.id}>
                  <Reveal delay={index * 0.06} className="h-full rounded-lg border border-border bg-white p-6 shadow-card">
                    <h3 className="text-h3">{role.title}</h3>
                    <p className="mt-2 text-[15px] text-ink-muted">{role.body}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
            {isVisible(exServicemen) ? (
              <Reveal className="on-dark flex gap-4 rounded-lg bg-navy-900 p-6 text-white sm:p-8">
                <Icon icon={Medal} size={24} className="text-gold-500" />
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {exServicemen.title}
                    {isPending(exServicemen) ? <PendingBadge /> : null}
                  </h3>
                  <p className="mt-1.5 text-[15px] text-white/80">{exServicemen.body}</p>
                </div>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      <section id="apply" aria-labelledby="apply-title" className="section-y scroll-mt-24">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading id="apply-title" eyebrow="Apply" title="Send us your application." />
            <p className="mt-5 text-ink-muted">{privacyNote}</p>
            <p className="mt-5 text-ink-muted">
              You can also apply in person at our office in Tambaram Sanatorium, or call{" "}
              <a href={`tel:${phone.tel}`} className="whitespace-nowrap font-semibold text-gold-ink underline underline-offset-4">
                {phone.display}
              </a>
              .
            </p>
          </div>
          <div className="rounded-lg border border-border bg-white p-6 shadow-card sm:p-8 lg:col-span-8">
            <CareerApplicationForm roleOptions={roleOptions} />
          </div>
        </div>
      </section>
    </>
  );
}
