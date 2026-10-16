import type { FactStatus } from "@/lib/facts";

export type IndustrySummary = {
  slug: string;
  title: string;
  status: FactStatus;
};

/** Sectors from PROMPT.md §6G. Pending until the client confirms coverage. */
export const industries: readonly IndustrySummary[] = [
  { slug: "manufacturing-industrial", title: "Manufacturing & Industrial", status: "pending" },
  { slug: "corporate-offices-it-parks", title: "Corporate Offices & IT Parks", status: "pending" },
  { slug: "commercial-retail", title: "Commercial Buildings & Retail", status: "pending" },
  { slug: "residential-communities", title: "Residential Communities", status: "pending" },
  { slug: "warehouses-logistics", title: "Warehouses & Logistics", status: "pending" },
  { slug: "events-religious-venues", title: "Events & Religious Venues", status: "pending" },
];
