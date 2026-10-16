/**
 * Image manifest (CLAUDE.md §2.4, §7). Every image slot on the site is
 * listed here. `src: null` (or `approved: false`) renders a neutral navy
 * placeholder frame.
 *
 * Images are web versions made by `scripts/process-images.mjs` from the
 * files supplied by the project owner, kept unpublished in assets/source-images/ (16 Oct 2026).
 * None show company staff (`isAuthentic: false`): they are illustrative,
 * unbranded, and should be replaced by authentic photos when available.
 * `brief` is the art direction for that replacement photo shoot.
 */
export type ImageEntry = {
  src: string | null;
  alt: string;
  brief: string;
  width: number;
  height: number;
  /** CSS object-position: keeps the subject in frame when cropped. */
  position?: string;
  /** Photo of real company staff / sites. */
  isAuthentic: boolean;
  /** Cleared for use on the website. */
  approved: boolean;
  credit: string | null;
};

const AI = "AI-generated illustration supplied by the project owner. Not company staff.";
const STOCK = "Photograph supplied by the project owner. Licence to be confirmed. Not company staff.";

type Supplied = { src: string; width: number; height: number; alt: string; credit: string; position?: string };

function photo(s: Supplied, brief: string): ImageEntry {
  return { ...s, src: `/images/site/${s.src}`, brief, isAuthentic: false, approved: true };
}

function slot(alt: string, brief: string, width = 1600, height = 1200): ImageEntry {
  return { src: null, alt, brief, width, height, isAuthentic: false, approved: false, credit: null };
}

const heroGate: Supplied = {
  src: "hero-gate.webp",
  width: 2400,
  height: 1351,
  alt: "Security officer in uniform standing watch at an industrial site entrance at sunrise",
  credit: AI,
  position: "68% 30%",
};
const truckCheck: Supplied = {
  src: "industrial-truck-check.webp",
  width: 1480,
  height: 753,
  alt: "Security officer in a high-visibility vest checking a truck driver’s documents at an industrial gate",
  credit: AI,
  position: "40% 50%",
};
const lobby: Supplied = {
  src: "corporate-lobby.webp",
  width: 1319,
  height: 768,
  alt: "Office lobby with access-card turnstiles and a security officer at the front desk",
  credit: AI,
  position: "60% 50%",
};
const residentialGate: Supplied = {
  src: "residential-gate.webp",
  width: 1380,
  height: 873,
  alt: "Security officer logging a visitor’s car at the boom barrier of an apartment complex",
  credit: AI,
  position: "35% 50%",
};
const eventScreening: Supplied = {
  src: "event-screening.webp",
  width: 1600,
  height: 826,
  alt: "Guests walking through door-frame metal detectors at an event entrance, watched by event staff",
  credit: STOCK,
  position: "50% 40%",
};
const briefing: Supplied = {
  src: "team-briefing.webp",
  width: 1536,
  height: 1024,
  alt: "Supervisor briefing three security officers at a facility entrance before their shift",
  credit: AI,
  position: "45% 35%",
};
const patrol: Supplied = {
  src: "perimeter-patrol.webp",
  width: 1536,
  height: 1024,
  alt: "Security officer on a perimeter patrol with a radio along a factory fence",
  credit: AI,
  position: "42% 40%",
};
const gateInspection: Supplied = {
  src: "gate-inspection.webp",
  width: 1600,
  height: 900,
  alt: "Security officer checking a truck driver’s pass at a factory boom barrier",
  credit: AI,
  position: "30% 45%",
};
const itPark: Supplied = {
  src: "it-park-checkpoint.webp",
  width: 1600,
  height: 900,
  alt: "Security officer checking an employee’s ID card at the turnstiles of an IT park",
  credit: AI,
  position: "40% 45%",
};
const retail: Supplied = {
  src: "retail-entrance.webp",
  width: 1034,
  height: 475,
  alt: "Security officers standing at the entrance of a retail store as shoppers walk out",
  credit: STOCK,
  position: "50% 45%",
};

export const images = {
  hero: photo(heroGate, "Guard at a factory or IT-park gate, daylight, eye level, purposeful not posing"),
  serviceIndustrial: photo(truckCheck, "Factory gate with vehicle/material check"),
  serviceCorporate: photo(lobby, "Office or IT-park lobby, front-of-house desk"),
  serviceResidential: photo(residentialGate, "Apartment / gated community gate"),
  serviceEvent: photo(eventScreening, "Event entry screening in Chennai, daylight"),
  serviceArmed: slot("Ex-servicemen security personnel", "Only authentic, licensed armed personnel"),
  consultation: { ...photo(heroGate, "Low-opacity background: site perimeter or gate at dusk"), alt: "" },
  aboutPrimary: photo(briefing, "Supervisor briefing at shift start"),
  aboutSecondary: photo(patrol, "Site patrol round, not a control room"),
  industryManufacturing: photo(gateInspection, "Factory exterior / gate"),
  industryCorporate: photo(itPark, "Office / IT-park exterior"),
  industryCommercial: photo(retail, "Commercial building or mall"),
  industryResidential: { ...photo(residentialGate, "Gated community exterior"), position: "70% 50%" },
  industryWarehouse: photo(truckCheck, "Warehouse yard / loading bay"),
  industryEvents: photo(eventScreening, "Event or religious venue entrance"),
  // Studio portrait of the MD supplied by the project owner (16 Oct 2026). It
  // replaces an earlier photo whose background sign showed a logo that is not
  // the company's crest. The MD should approve it before launch.
  managingDirector: {
    src: "/images/site/managing-director-studio.webp",
    width: 800,
    height: 1000,
    alt: "Mr. K. Senthil Raja, Managing Director of Senthil Security Solutions",
    brief: "Head-and-shoulders portrait of the Managing Director, plain or office background",
    position: "50% 20%",
    isAuthentic: true,
    approved: true,
    credit: "Portrait supplied by the project owner.",
  },
} satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof images;
