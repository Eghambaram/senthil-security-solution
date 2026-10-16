import type { ImageKey } from "@/content/images";
import type { FactStatus } from "@/lib/facts";

/**
 * Sectors from PROMPT.md §6G with page copy (§7: sector pain points →
 * which services apply). Manufacturing, offices/IT, commercial and residential
 * are confirmed by the company’s legacy website; warehouses and events are not.
 */
export type IndustrySummary = {
  slug: string;
  title: string;
  image: ImageKey;
  status: FactStatus;
};

export type IndustryDetail = IndustrySummary & {
  metaTitle: string;
  metaDescription: string;
  intro: string;
  challenges: { title: string; body: string }[];
  services: string[];
  planningPoints: string[];
};

export const industries: readonly IndustryDetail[] = [
  {
    slug: "manufacturing-industrial",
    title: "Manufacturing & Industrial",
    image: "industryManufacturing",
    status: "verified",
    metaTitle: "Security for Manufacturing Plants in Chennai",
    metaDescription:
      "Security for factories and industrial units in Chennai: material movement control, contract-labour checks, shift-change cover and night patrols.",
    intro:
      "Factories, garment units and automobile plants run around the clock, with trucks, contract labour and valuable stock moving through a handful of gates.",
    challenges: [
      {
        title: "Material leaving without a trail",
        body: "Scrap, finished goods and tools can go out mixed with legitimate loads when gate checks are rushed.",
      },
      {
        title: "Large, changing workforces",
        body: "Contract labour changes week to week, making it hard to know who should be on the shop floor.",
      },
      {
        title: "Weak points at shift change",
        body: "Handover periods are when gates get crowded and attention drops.",
      },
      {
        title: "Big perimeters, quiet nights",
        body: "Long boundary walls and idle sheds are easy targets once production stops.",
      },
    ],
    services: ["industrial-security", "event-security"],
    planningPoints: [
      "Number of gates and their operating hours",
      "Inward and outward documentation you already use",
      "Shift timings and peak truck movement",
      "Areas needing fire-watch or restricted access",
    ],
  },
  {
    slug: "corporate-offices-it-parks",
    title: "Corporate Offices & IT Parks",
    image: "industryCorporate",
    status: "verified",
    metaTitle: "Security for Corporate Offices & IT Parks in Chennai",
    metaDescription:
      "Security for offices and IT parks in Chennai: courteous reception security, visitor management, access-card discipline and after-hours patrols.",
    intro: "Offices need security that protects people and data while staying polite to every visitor.",
    challenges: [
      {
        title: "Tailgating and shared cards",
        body: "One tap at a turnstile can let several people through if no one is watching.",
      },
      {
        title: "High visitor volumes",
        body: "Candidates, vendors and couriers arrive all day and need to be handled quickly.",
      },
      {
        title: "Client and audit expectations",
        body: "Clients and certifications often ask for visitor and access records.",
      },
      {
        title: "Empty floors after hours",
        body: "Late-evening and weekend periods leave equipment and data rooms unattended.",
      },
    ],
    services: ["corporate-commercial-security"],
    planningPoints: [
      "Entry points, turnstiles and lift-lobby controls",
      "Visitor-management system in use, if any",
      "Business hours and late-working teams",
      "Rooms needing restricted access",
    ],
  },
  {
    slug: "commercial-retail",
    title: "Commercial Buildings & Retail",
    image: "industryCommercial",
    status: "verified",
    metaTitle: "Security for Commercial Buildings & Retail in Chennai",
    metaDescription:
      "Security for malls, shops and multi-tenant commercial buildings in Chennai: floor coverage, parking control, opening and closing checks.",
    intro:
      "Shops and multi-tenant buildings mix open public access with stock, cash and tenants who each expect protection.",
    challenges: [
      {
        title: "Open doors, all day",
        body: "Public access makes it hard to spot shoplifting or people with no business inside.",
      },
      {
        title: "Many tenants, one building",
        body: "Different tenants have different hours, deliveries and expectations of security.",
      },
      {
        title: "Busy parking and service areas",
        body: "Basements and loading bays see constant traffic and little supervision.",
      },
      {
        title: "Opening and closing routines",
        body: "Shutters, cash and alarms are most exposed at the start and end of trading.",
      },
    ],
    services: ["corporate-commercial-security", "event-security"],
    planningPoints: [
      "Trading hours for the building and individual tenants",
      "Delivery times and loading-bay access",
      "Parking layout and attendant arrangements",
      "Peak days, sales and festival periods",
    ],
  },
  {
    slug: "residential-communities",
    title: "Residential Communities",
    image: "industryResidential",
    status: "verified",
    metaTitle: "Security for Apartments & Gated Communities in Chennai",
    metaDescription:
      "Security for apartments and gated communities in Chennai: visitor confirmation, delivery logs, domestic-staff registers and night rounds.",
    intro: "Families want a gate that is friendly to residents and firm with everyone else.",
    challenges: [
      {
        title: "Endless deliveries",
        body: "Food and parcel riders arrive at all hours and often ask to go straight to the door.",
      },
      {
        title: "Daily domestic staff",
        body: "Maids, cooks and drivers come and go every day across many flats.",
      },
      {
        title: "Rules that change by shift",
        body: "Residents notice quickly when the night team applies rules differently from the day team.",
      },
      {
        title: "Quiet corners at night",
        body: "Basements, terraces and boundary walls go unwatched after residents turn in.",
      },
    ],
    services: ["residential-security", "event-security"],
    planningPoints: [
      "Number of gates and blocks",
      "Visitor and delivery approval rules agreed by the association",
      "Community app or intercom in use",
      "Clubhouse, pool and common-area timings",
    ],
  },
  {
    slug: "warehouses-logistics",
    title: "Warehouses & Logistics",
    image: "industryWarehouse",
    status: "pending",
    metaTitle: "Warehouse & Logistics Security in Chennai",
    metaDescription:
      "Warehouse security in Chennai: dock and yard control, vehicle logs, seal checks and patrols for distribution centres and logistics parks.",
    intro: "Warehouses hold high-value stock and see heavy vehicle traffic, often through the night.",
    challenges: [
      {
        title: "Dock and yard congestion",
        body: "Trucks queue, park and turn around in yards with little oversight.",
      },
      {
        title: "Seal and load integrity",
        body: "Tampered seals or short loads are hard to prove without records at the gate.",
      },
      {
        title: "Night-time operations",
        body: "Many warehouses load and unload at night with a small team on site.",
      },
      {
        title: "Driver and helper movement",
        body: "Drivers and helpers from many transporters need to stay in permitted areas.",
      },
    ],
    services: ["industrial-security"],
    planningPoints: [
      "Dock count and loading schedule",
      "Seal and document checks required by your clients",
      "Yard layout and vehicle waiting areas",
      "Areas off-limits to drivers and helpers",
    ],
  },
  {
    slug: "events-religious-venues",
    title: "Events & Religious Venues",
    image: "industryEvents",
    status: "pending",
    metaTitle: "Security for Events & Religious Venues in Chennai",
    metaDescription:
      "Security for functions, festivals and places of worship in Chennai: entry management, crowd flow, valuables watch and parking control.",
    intro: "Festivals, functions and places of worship bring large, emotional crowds into a limited space.",
    challenges: [
      {
        title: "Sudden crowd peaks",
        body: "Festival days and auspicious timings bring far more people than usual at once.",
      },
      {
        title: "Respectful handling",
        body: "Security has to be firm on safety while respecting customs and devotees.",
      },
      {
        title: "Offerings and valuables",
        body: "Hundis, jewellery and donations need constant, discreet watch.",
      },
      {
        title: "Parking spill-over",
        body: "Vehicles overflow into surrounding streets and block access routes.",
      },
    ],
    services: ["event-security", "residential-security"],
    planningPoints: [
      "Expected crowd numbers and peak timings",
      "Entry, exit and queue routes",
      "Customs officers need to observe",
      "Parking areas and coordination with local police",
    ],
  },
];

export function getIndustry(slug: string): IndustryDetail | undefined {
  return industries.find((i) => i.slug === slug);
}
