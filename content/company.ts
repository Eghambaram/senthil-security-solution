/**
 * Business facts register — mirrors CLAUDE.md §3.
 * Only `verified` facts render on the live site. `pending` facts render
 * only in development and client review mode (with a yellow badge).
 * `missing` and `conflict` facts never render.
 *
 * Re-audited 16 Oct 2026 (live site + public listings). Updated the same day
 * with content from the company’s own legacy website and Google Business
 * Profile, supplied by the project owner for the client-approval build.
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
    source: "Company legacy website (‘26-05-2012’), Facebook, Sulekha",
  },
  legalEntity: {
    value: null,
    status: "conflict",
    source: "Legacy website / Facebook vs Justdial GSTIN",
    note: "Legacy site and Facebook say ‘registered as per Companies Act 1956’; the GSTIN PAN segment indicates a Firm/LLP. Do not print.",
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
      landmark: "Near Sukkubhai Biryani",
    },
    status: "verified",
    source: "Legacy website, Google Business Profile (‘2, Station Rd, Kamaraj Nagar’), Justdial; landmark from project owner (20 Nov 2026)",
  },
  geo: {
    value: { lat: 12.937477, lng: 80.1287727 },
    status: "verified",
    source: "Legacy site Google Maps embed",
  },
  /** Office number for calls (the main number across the site). */
  phone: {
    value: { display: "+91 98842 96146", tel: "+919884296146" },
    status: "verified",
    source: "Project owner (20 Nov 2026): office number",
    note: "Replaces the legacy landline +91 44 4380 6837.",
  },
  /** WhatsApp number (chat links). */
  mobile: {
    value: { display: "+91 90940 25252", tel: "+919094025252", whatsapp: "919094025252" },
    status: "verified",
    source: "Project owner (20 Nov 2026): WhatsApp number",
    note: "Legacy site also lists +91 95511 25252; not shown until confirmed.",
  },
  /** The Managing Director's own mobile, shown with his name. */
  mdMobile: {
    value: { display: "+91 90943 31333", tel: "+919094331333" },
    status: "verified",
    source: "Project owner (20 Nov 2026): Managing Director's mobile",
  },
  email: {
    value: "senthilsolutions.sss@gmail.com",
    status: "verified",
    source: "Project owner (20 Nov 2026)",
    note: "Replaces info@senthilsecuritysolutions.com from the legacy site. Form notifications go to ENQUIRY_TO_EMAIL / CAREERS_TO_EMAIL.",
  },
  hours: {
    value: { days: "Mon–Sat", opens: "09:00", closes: "18:00", closed: "Sunday" },
    status: "verified",
    source: "Google Business Profile (supplied by project owner); replaces Sulekha’s 9–7",
  },
  managingDirector: {
    value: { name: "Mr. K. Senthil Raja", title: "Managing Director", qualification: "MCA graduate" },
    status: "verified",
    source: "Company legacy website, ‘The Team’ page",
    note: "Studio portrait supplied by the project owner (16 Oct 2026); MD to approve before launch.",
  },
  personnelStrength: {
    value: 1000,
    status: "verified",
    source: "Project owner (20 Nov 2026), company-reported; was ‘around 500’ on the legacy website",
    note: "Shown as ‘1000+’ with the footnote ‘Company-reported figure, as of November 2026’.",
  },
  personnelBackground: {
    value: ["CISF", "Air Force", "Navy", "Army"],
    status: "verified",
    source: "Company legacy website, Facebook",
  },
  managementBackground: {
    value: "The General Manager and the Executive Director come from the CISF and the Air Force",
    status: "verified",
    source: "Company legacy website, Facebook",
  },
  training: {
    value: [
      "Security systems",
      "Fire prevention and firefighting",
      "First aid",
      "Bomb-threat response",
      "Crime detection",
      "Intelligence collection and vigilance",
      "Disaster management and mock drills",
    ],
    status: "verified",
    source: "Company legacy website",
  },
  staffWelfare: {
    value: ["Antecedent (background) verification before induction", "PF and ESI benefits"],
    status: "verified",
    source: "Company legacy website",
  },
  servicesListed: {
    value: [
      "Major industrial units",
      "Commercial establishments",
      "Garment factories",
      "Automobile industries",
      "IT sector",
      "ATMs",
      "Residential apartments",
    ],
    status: "verified",
    source: "Company legacy website, About Us",
    note: "Event, religious-venue and personal-bodyguard services appear only in third-party listings (still pending). Armed guards gated on PSARA + arms licence.",
  },
  serviceArea: {
    value: null,
    status: "missing",
    source: "Legacy site says ‘Chennai or all over India’",
    note: "Confirm actual coverage before claiming beyond Chennai.",
  },
  psaraLicence: { value: null, status: "missing", source: "Not found" },
  armsLicence: { value: null, status: "missing", source: "Not found" },
  clients: {
    value: null,
    status: "verified",
    source: "Legacy ‘Clients’ page logos, supplied by the project owner (16 Oct 2026)",
    note: "15 named logos in content/clients.ts; project owner confirmed client permission on 16 Oct 2026. One logo (5.jpg) unidentified, not shown.",
  },
  justdialRating: {
    value: { rating: 4.5, count: 28, asOf: "2026-10" },
    status: "pending",
    source: "Justdial",
    note: "Optional ‘Rated on Justdial’ link only; never as testimonials.",
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
