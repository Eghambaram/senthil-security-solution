import { Clock, ExternalLink, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { company } from "@/content/company";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { isPending, isVisible } from "@/lib/facts";
import { formatTime } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Contact Senthil Security Solutions, No. 2 Railway Station Road, Tambaram Sanatorium, Chennai 600047. Call +91 44 4380 6837 or send an enquiry.",
  path: "/contact",
});

function ContactItem({ icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 py-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-500">
        <Icon icon={icon} />
      </span>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-muted">{label}</h3>
        <div className="mt-1 text-[16px] text-ink">{children}</div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const { address, phone, email, hours, geo } = company;
  const a = address.value;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${geo.value.lat},${geo.value.lng}`;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact", href: "/contact" }]}
        eyebrow="Contact"
        title="Talk to our team."
        intro="Call us, visit our office in Tambaram Sanatorium, or send a short enquiry and we will get back to you."
      />

      <section aria-label="Contact details and enquiry form" className="section-y">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-5">
            <h2 className="text-h3">Contact details</h2>
            <div className="mt-2 divide-y divide-border">
              <ContactItem icon={Phone} label="Phone">
                <a href={`tel:${phone.value.tel}`} className="font-semibold text-navy-900 underline-offset-4 hover:underline">
                  {phone.value.display}
                </a>
              </ContactItem>
              {isVisible(email) && email.value ? (
                <ContactItem icon={Mail} label="Email">
                  <a href={`mailto:${email.value}`} className="font-semibold text-navy-900 underline-offset-4 hover:underline">
                    {email.value}
                  </a>
                  {isPending(email) ? <PendingBadge /> : null}
                </ContactItem>
              ) : null}
              <ContactItem icon={MapPin} label="Office">
                <address className="not-italic">
                  Senthil Security Solutions
                  <br />
                  {a.street},
                  <br />
                  {a.locality}, {a.city} {a.postalCode}
                  <br />
                  {a.region}
                </address>
                <p className="mt-1 text-sm text-ink-muted">{a.landmark}</p>
              </ContactItem>
              {isVisible(hours) ? (
                <ContactItem icon={Clock} label="Office hours">
                  {hours.value.days}, {formatTime(hours.value.opens)} – {formatTime(hours.value.closes)}
                  {isPending(hours) ? <PendingBadge /> : null}
                </ContactItem>
              ) : null}
            </div>

            <div className="mt-6">
              <MapEmbed lat={geo.value.lat} lng={geo.value.lng} title="Map showing the Senthil Security Solutions office" />
              <Button
                href={mapsHref}
                variant="tertiary"
                icon={<ExternalLink aria-hidden="true" strokeWidth={1.5} className="size-4" />}
                className="mt-4"
              >
                Open in Google Maps
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <div className="rounded-lg border border-border bg-white p-6 shadow-card sm:p-8">
              <h2 className="text-h3">Send an enquiry</h2>
              <p className="mt-2 text-ink-muted">
                Need a full proposal for a site?{" "}
                <Link href="/site-assessment" className="font-semibold text-gold-ink underline underline-offset-4">
                  Request a site assessment
                </Link>{" "}
                instead.
              </p>
              <div className="mt-6">
                <EnquiryForm variant="contact" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
