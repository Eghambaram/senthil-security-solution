import Link from "next/link";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { company } from "@/content/company";
import { industries } from "@/content/industries";
import { legalLinks } from "@/content/navigation";
import { services } from "@/content/services";
import { Icon } from "@/components/ui/Icon";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { isPending, isVisible, visible } from "@/lib/facts";
import { formatTime } from "@/lib/format";
import { Logo } from "./Logo";

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
  { label: "Request a Site Assessment", href: "/site-assessment" },
] as const;

const linkClass = "rounded-sm text-white/75 transition-colors hover:text-gold-300";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-white">{children}</h2>;
}

export function Footer() {
  const { address, phone, mobile, email, hours, geo, social, gstin } = company;
  const a = address.value;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${geo.value.lat},${geo.value.lng}`;
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-navy-900 text-[15px] text-white/75">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-4">
          <Logo tone="dark" />
          <p className="mt-6 max-w-sm">
            Helping businesses and communities create safer environments through professional security services and
            dependable operational support.
          </p>
          {isVisible(social) ? (
            <a
              href={social.value.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} mt-6 inline-flex items-center gap-2`}
            >
              Facebook
              <Icon icon={ExternalLink} className="size-4" label="(opens in a new tab)" />
            </a>
          ) : null}
        </div>

        <nav aria-labelledby="footer-quick" className="lg:col-span-2">
          <FooterHeading>
            <span id="footer-quick">Quick links</span>
          </FooterHeading>
          <ul className="mt-5 space-y-3">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-services" className="lg:col-span-3">
          <FooterHeading>
            <span id="footer-services">Services</span>
          </FooterHeading>
          <ul className="mt-5 space-y-3">
            {visible(services).map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={linkClass}>
                  {s.title}
                </Link>
                {isPending(s) ? <PendingBadge /> : null}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <FooterHeading>Industries</FooterHeading>
          </div>
          <ul className="mt-5 space-y-3">
            {visible(industries).map((i) => (
              <li key={i.slug}>
                <Link href={`/industries/${i.slug}`} className={linkClass}>
                  {i.title}
                </Link>
                {isPending(i) ? <PendingBadge /> : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <FooterHeading>Contact</FooterHeading>
          <address className="mt-5 space-y-4 not-italic">
            <p className="flex gap-3">
              <Icon icon={MapPin} className="mt-1 text-gold-500" />
              <span>
                {a.street},<br />
                {a.locality}, {a.city} {a.postalCode}
                <br />
                {a.region}
              </span>
            </p>
            <p className="flex gap-3">
              <Icon icon={Phone} className="mt-0.5 text-gold-500" />
              <span>
                <a href={`tel:${phone.value.tel}`} className={linkClass}>
                  {phone.value.display}
                </a>
                {isVisible(mobile) ? (
                  <>
                    <br />
                    <a href={`tel:${mobile.value.tel}`} className={linkClass}>
                      {mobile.value.display}
                    </a>
                  </>
                ) : null}
              </span>
            </p>
            {isVisible(mobile) ? (
              <p className="flex gap-3">
                <WhatsAppIcon className="mt-0.5 size-5 shrink-0 text-whatsapp" />
                <a href={`https://wa.me/${mobile.value.whatsapp}`} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp us<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            ) : null}
            {isVisible(email) && email.value ? (
              <p className="flex gap-3">
                <Icon icon={Mail} className="mt-0.5 text-gold-500" />
                <a href={`mailto:${email.value}`} className={`${linkClass} [overflow-wrap:anywhere]`}>
                  {email.value}
                </a>
              </p>
            ) : null}
            {isVisible(hours) ? (
              <p className="flex gap-3">
                <Icon icon={Clock} className="mt-0.5 text-gold-500" />
                <span>
                  {hours.value.days}, {formatTime(hours.value.opens)} – {formatTime(hours.value.closes)}
                  <br />
                  {hours.value.closed}: closed
                  {isPending(hours) ? <PendingBadge /> : null}
                </span>
              </p>
            ) : null}
          </address>
          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} mt-5 inline-flex items-center gap-2 text-gold-300`}
          >
            View on Google Maps
            <Icon icon={ExternalLink} className="size-4" label="(opens in a new tab)" />
          </a>
        </div>
      </div>

      {isVisible(gstin) ? (
        <div className="border-t border-white/10">
          <div className="container-site py-4 text-[13px] text-white/60">
            GSTIN: {gstin.value}
            {isPending(gstin) ? <PendingBadge /> : null}
          </div>
        </div>
      ) : null}

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-6 text-[13px] text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {year} Senthil Security Solutions. All rights reserved.</p>
          <ul className="flex gap-6">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
