import type { Metadata } from "next";
import { company } from "@/content/company";
import { isVerified } from "@/lib/facts";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://senthilsecuritysolutions.com";
export const SITE_NAME = "Senthil Security Solutions";

type Options = {
  /** Page name; becomes "{title} | Senthil Security Solutions, Chennai". */
  title: string;
  /** ≤ 155 characters. */
  description: string;
  path: string;
  noIndex?: boolean;
};

export function buildMetadata({ title, description, path, noIndex = false }: Options): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}, Chennai`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

/**
 * LocalBusiness JSON-LD (CLAUDE.md §11). Structured data uses strictly
 * `verified` facts, in every environment, so it never leaks pending values.
 */
export function localBusinessJsonLd() {
  const { name, address, phone, geo, foundingDate, social, hours, logo } = company;
  const a = address.value;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: name.value,
    description:
      "Manned security services for industrial, commercial and residential premises in Chennai, Tamil Nadu.",
    url: SITE_URL,
    logo: logo.value,
    telephone: phone.value.tel,
    foundingDate: foundingDate.value,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: `${a.locality}, ${a.city}`,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: geo.value.lat, longitude: geo.value.lng },
    areaServed: { "@type": "City", name: "Chennai" },
    ...(isVerified(social) ? { sameAs: Object.values(social.value) } : {}),
    ...(isVerified(hours)
      ? {
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: hours.value.opens,
            closes: hours.value.closes,
          },
        }
      : {}),
  };
}

export function faqJsonLd(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export type Crumb = { label: string; href: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${SITE_URL}${c.href === "/" ? "" : c.href}`,
    })),
  };
}

export function serviceJsonLd(service: { title: string; metaDescription: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription,
    url: `${SITE_URL}/services/${service.slug}`,
    serviceType: service.title,
    areaServed: { "@type": "City", name: "Chennai" },
    provider: { "@id": `${SITE_URL}/#business` },
  };
}
