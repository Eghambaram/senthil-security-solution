import type { MetadataRoute } from "next";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { visible } from "@/lib/facts";
import { SITE_URL } from "@/lib/seo";

const STATIC_ROUTES = [
  { path: "/", priority: 1 },
  { path: "/site-assessment", priority: 0.9 },
  { path: "/services", priority: 0.9 },
  { path: "/industries", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/careers", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  { path: "/privacy-policy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
];

/** Only pages a visitor can reach: pending services/industries are excluded in production. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...STATIC_ROUTES,
    ...visible(services).map((s) => ({ path: `/services/${s.slug}`, priority: 0.8 })),
    ...visible(industries).map((i) => ({ path: `/industries/${i.slug}`, priority: 0.6 })),
  ];
  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
