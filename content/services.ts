import type { ImageKey } from "@/content/images";
import type { FactStatus } from "@/lib/facts";

/**
 * Service summaries for navigation and cards. Full page copy is added in
 * Phase 4. Every service is `pending` until the client confirms it
 * (CLAUDE.md §3). Armed security stays `missing` until PSARA and arms
 * licences are confirmed (CLAUDE.md §2.5).
 */
export type ServiceSummary = {
  slug: string;
  title: string;
  summary: string;
  icon: "factory" | "building" | "home" | "users" | "shield";
  image: ImageKey;
  status: FactStatus;
};

export const services: readonly ServiceSummary[] = [
  {
    slug: "industrial-security",
    title: "Industrial Security",
    summary: "Gate, material and visitor control for factories, plants and warehouses.",
    icon: "factory",
    image: "serviceIndustrial",
    status: "pending",
  },
  {
    slug: "corporate-commercial-security",
    title: "Corporate & Commercial Security",
    summary: "Front-of-house and access control for offices, IT parks and commercial buildings.",
    icon: "building",
    image: "serviceCorporate",
    status: "pending",
  },
  {
    slug: "residential-security",
    title: "Residential Security",
    summary: "Gate control and visitor logs for apartments and gated communities.",
    icon: "home",
    image: "serviceResidential",
    status: "pending",
  },
  {
    slug: "event-security",
    title: "Event & Personal Security",
    summary: "Entry screening, crowd flow and planned deployment for events.",
    icon: "users",
    image: "serviceEvent",
    status: "pending",
  },
  {
    slug: "armed-ex-servicemen",
    title: "Armed Security & Ex-Servicemen",
    summary: "Licensed armed personnel for sites with specific risk requirements.",
    icon: "shield",
    image: "serviceArmed",
    status: "missing",
  },
];
