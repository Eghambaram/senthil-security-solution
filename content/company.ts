/**
 * Business facts register — mirrors CLAUDE.md §3.
 * Only `verified` facts may render in production. `pending` facts render
 * nothing in production and a yellow dev badge in development. `missing`
 * and `conflict` facts never render.
 *
 * Re-audited 16 Oct 2026 (live site + public listings).
 */

import type { FactStatus } from "@/lib/facts";

export type Fact<T> = {
  value: T | null;
  status: FactStatus;
  source: string;
  note?: string;
};

export const company = {
  name: {
    value: "Senthil Security Solutions",
    status: "verified",
    source: "Website, Facebook",
  },
  shortName: { value: "SSS", status: "verified", source: "Facebook" },
  foundingDate: {
    value: "2012-05-26",
    status: "verified",
    source: "Facebook, Sulekha, live site ('registered on 26-05-2012')",
  },
  legalEntity: {
    value: null,
    status: "conflict",
    source: "Facebook vs Justdial GSTIN",
    note: "Facebook says Companies Act 1956; GSTIN PAN segment indicates Firm/LLP. Do not print.",
  },
  gstin: {
    value: "33ACDFS1683A1ZJ",
    status: "pending",
    source: "Justdial",
    note: "Footer only if client approves.",
  },
  address: {
    value: {
      street: "No. 2, Railway Station Road, Kamaraj Nagar",
      locality: "Tambaram Sanatorium",
      city: "Chennai",
      region: "Tamil Nadu",
      postalCode: "600047",
      country: "IN",
      landmark: "Near G K Restaurant",
    },
    status: "verified",
    source: "Justdial, Sulekha, Facebook; live site shows '2 Station Road'",
    note: "Confirm exact formatting with client.",
  },
  geo: {
    value: { lat: 12.937477, lng: 80.1287727 },
    status: "verified",
    source: "Legacy site Google Maps embed",
  },
  phone: {
    value: { display: "+91 44 4380 6837", tel: "+914443806837" },
    status: "verified",
    source: "Facebook, ZoomInfo, live site",
  },
  mobile: {
    value: null,
    status: "pending",
    source: "Live site (16 Oct 2026)",
    note: "Live site shows +91 90940 25252, +91 95511 25252 and +91 90943 31333; tel: links point to +91 44 4850 9111. Client to confirm which is the WhatsApp business number.",
  },
  email: {
    value: null,
    status: "pending",
    source: "Live site (16 Oct 2026)",
    note: "Live site lists info@ and support@senthilsecuritysolutions.com. Confirm which inbox is monitored for enquiries and careers.",
  },
  hours: {
    value: { days: "Mon–Sat", opens: "09:00", closes: "19:00" },
    status: "pending",
    source: "Sulekha",
  },
  contactPerson: {
    value: "Senthil Raja",
    status: "pending",
    source: "Sulekha",
    note: "Name and title needed before any leadership section.",
  },
  personnelStrength: {
    value: 500,
    status: "pending",
    source: "Facebook, live site (self-reported, undated)",
    note: "Third-party estimate: 185 employees. Show '500+' only with client confirmation and a dated footnote.",
  },
  personnelBackground: {
    value: ["CISF", "Air Force", "Navy", "Army"],
    status: "pending",
    source: "Facebook, live site",
  },
  managementBackground: {
    value: "Two managerial staff from CISF / Air Force",
    status: "pending",
    source: "Facebook",
  },
  training: {
    value: [
      "Security systems",
      "Fire prevention and firefighting",
      "First aid",
      "Bomb-threat response",
      "Crime detection",
    ],
    status: "pending",
    source: "Sulekha, live site",
  },
  staffWelfare: {
    value: ["Staff verification", "PF and ESI benefits"],
    status: "pending",
    source: "Live site (16 Oct 2026)",
  },
  servicesListed: {
    value: [
      "Industrial / factory",
      "Commercial",
      "IT",
      "ATM",
      "Residential",
      "Personal bodyguards",
      "Event",
      "Religious facilities",
      "Armed guards",
    ],
    status: "pending",
    source: "Sulekha, Justdial, ZoomInfo, live site",
    note: "Confirm per service. Armed guards gated on PSARA + arms licence.",
  },
  serviceArea: {
    value: null,
    status: "missing",
    source: "Live site mentions 'Chennai or across India'",
    note: "Confirm actual coverage before claiming beyond Chennai.",
  },
  psaraLicence: { value: null, status: "missing", source: "Not found" },
  armsLicence: { value: null, status: "missing", source: "Not found" },
  clients: {
    value: null,
    status: "missing",
    source: "Not on live site",
    note: "Need written permission per logo.",
  },
  justdialRating: {
    value: { rating: 4.5, count: 28, asOf: "2026-10" },
    status: "pending",
    source: "Justdial",
    note: "Optional 'Rated on Justdial' link only; never as testimonials.",
  },
  social: {
    value: { facebook: "https://www.facebook.com/ssschennaicity" },
    status: "verified",
    source: "Facebook",
    note: "LinkedIn/Twitter exist per ZoomInfo; URLs needed.",
  },
  logo: {
    value: "https://senthilsecuritysolutions.com/image/logo-1.png",
    status: "verified",
    source: "Website",
    note: "Raster only; request vector original.",
  },
} satisfies Record<string, Fact<unknown>>;
