import type { FactStatus } from "@/lib/facts";

/**
 * Client logos from the legacy site's "Clients" page, supplied by the project
 * owner (16 Oct 2026). Web versions are made by `scripts/process-logos.mjs`.
 *
 * CLAUDE.md §3: a client logo needs that organisation’s written permission.
 * The project owner confirmed on 16 Oct 2026 that all 15 named clients have
 * given permission, so they are `verified`. Add new logos as "pending" until
 * permission is confirmed. `missing` entries never render.
 */
export type ClientLogo = {
  name: string;
  logo: string;
  width: number;
  height: number;
  status: FactStatus;
  note?: string;
};

const logo = (name: string, file: string, width: number, height: number, status: FactStatus = "verified"): ClientLogo => ({
  name,
  logo: `/images/clients/${file}`,
  width,
  height,
  status,
});

export const clientsSection = {
  eyebrow: "Clients",
  title: "Organisations we have served.",
  description:
    "Manufacturers, automobile and component makers, garment and leather exporters, a hospital, a bank and commercial businesses.",
};

export const clients: ClientLogo[] = [
  logo("Afflatus", "afflatus.webp", 291, 128),
  logo("Avalon", "avalon.webp", 184, 70),
  logo("Coromandel Engineering", "coromandel-engineering.webp", 220, 128),
  logo("Eskay Cartons", "eskay-cartons.webp", 160, 53),
  logo("Evolv Clothing Company", "evolv-clothing.webp", 240, 104),
  logo("Flowwell Castings", "flowwell-castings.webp", 221, 45),
  logo("Gajanan Hospitals", "gajanan-hospitals.webp", 200, 128),
  logo("Hans Ford", "hans-ford.webp", 159, 45),
  logo("Maansarovar Honda", "maansarovar-honda.webp", 269, 118),
  logo("Mass Auto Components", "mass-auto-components.webp", 294, 48),
  logo("Padmash Leathers and Exports", "padmash-leathers.webp", 320, 116),
  logo("Powerica", "powerica.webp", 181, 90),
  logo("Quintessence", "quintessence.webp", 320, 48),
  logo("Super Auto Forge", "super-auto-forge.webp", 295, 76),
  logo("Tamilnad Mercantile Bank", "tamilnad-mercantile-bank.webp", 320, 101),
  {
    ...logo("Unidentified client", "unidentified-5.webp", 128, 128, "missing"),
    note: "Supplied as 5.jpg (red emblem on blue). Name needed before it can be shown.",
  },
];
