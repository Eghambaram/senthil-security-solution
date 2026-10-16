import type { ImageKey } from "@/content/images";
import type { FactStatus } from "@/lib/facts";

export type IndustrySummary = {
  slug: string;
  title: string;
  image: ImageKey;
  status: FactStatus;
};

/** Sectors from PROMPT.md §6G. Pending until the client confirms coverage. */
export const industries: readonly IndustrySummary[] = [
  { slug: "manufacturing-industrial", title: "Manufacturing & Industrial", image: "industryManufacturing", status: "pending" },
  { slug: "corporate-offices-it-parks", title: "Corporate Offices & IT Parks", image: "industryCorporate", status: "pending" },
  { slug: "commercial-retail", title: "Commercial Buildings & Retail", image: "industryCommercial", status: "pending" },
  { slug: "residential-communities", title: "Residential Communities", image: "industryResidential", status: "pending" },
  { slug: "warehouses-logistics", title: "Warehouses & Logistics", image: "industryWarehouse", status: "pending" },
  { slug: "events-religious-venues", title: "Events & Religious Venues", image: "industryEvents", status: "pending" },
];
