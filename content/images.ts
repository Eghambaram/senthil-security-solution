/**
 * Image manifest (CLAUDE.md §2.4, §7). Every image slot on the site is
 * listed here. `src: null` (or `approved: false`) renders a neutral navy
 * placeholder frame.
 *
 * Images are web versions made by `scripts/process-images.mjs` from the
 * files supplied by the project owner, kept unpublished in assets/source-images/ (16 Oct 2026).
 * Those are illustrative (`isAuthentic: false`): unbranded, not company staff,
 * and to be replaced by authentic photos when available. The training,
 * parade and lady-guard photos (24 Nov 2026) are the client's own photos of
 * its staff (`isAuthentic: true`) and also fill /gallery (content/gallery.ts).
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

const CLIENT = "Photograph supplied by Senthil Security Solutions: company staff.";

/** The client's own photos of its staff (all 1600 px wide unless portrait). */
function staff(src: string, alt: string, opts: { portrait?: boolean; position?: string } = {}): ImageEntry {
  return {
    src: `/images/site/${src}.webp`,
    alt,
    brief: "Authentic company photo",
    width: opts.portrait ? 1100 : 1600,
    height: opts.portrait ? 1650 : 1067,
    position: opts.position,
    isAuthentic: true,
    approved: true,
    credit: CLIENT,
  };
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
  // Authentic photos replace the AI briefing and patrol illustrations (24 Nov 2026).
  aboutPrimary: staff("parade-inspection-navy", "Senthil Security Solutions guards in navy uniform lined up for inspection at a client site", { position: "45% 50%" }),
  aboutSecondary: staff("training-first-aid", "Trainer guiding a security officer through first aid on a colleague lying on a bench during a training session", { position: "40% 60%" }),
  careersHero: staff("lady-guards-screening", "Lady security guards in SSS uniform screening a visitor with a hand-held metal detector", { position: "65% 40%" }),
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
  // Training and parade photos supplied by the client (24 Nov 2026), used on /gallery and the About page.
  trainingCpr: staff("training-cpr-demo", "Instructor demonstrating chest compressions on a volunteer while guards watch during first-aid training", { position: "55% 50%" }),
  trainingFirstAid: staff("training-first-aid", "Trainer guiding a security officer through first aid on a colleague lying on a bench", { position: "40% 60%" }),
  trainingCasualtyCarry: staff("training-casualty-carry", "Security officer practising a fireman’s carry of a colleague as trainers and guards look on", { position: "40% 45%" }),
  trainingFireExtinguisher: staff("training-fire-extinguisher", "Security officer discharging a fire extinguisher during fire-safety training, watched by the trainer", { portrait: true, position: "50% 45%" }),
  paradeBriefing: staff("parade-briefing", "Guards in navy uniform standing in formation during a briefing in a factory compound"),
  paradeLineupNavy: staff("parade-lineup-navy", "Two rows of security guards in navy uniform standing at attention"),
  paradeInspectionNavy: staff("parade-inspection-navy", "Senthil Security Solutions guards in navy uniform lined up for inspection"),
  paradeOfficer: staff("parade-officer", "Close-up of a senior security officer in SSS uniform with his team behind him", { position: "60% 35%" }),
  paradeSalute: staff("parade-salute", "Security officer in SSS uniform saluting", { portrait: true, position: "50% 30%" }),
  paradeUniformCheck: staff("parade-uniform-check", "Supervisor checking guards’ turnout during a uniform inspection"),
  paradeLineupSite: staff("parade-lineup-site", "Guards in sky-blue site uniform lined up in front of a factory, led by a guard commander"),
  paradeGuardCommander: staff("parade-guard-commander", "Guard commander in ceremonial turban and sash in front of his squad", { position: "45% 40%" }),
  paradeMarch: staff("parade-march", "Squad of security guards marching in step during drill practice"),
  paradeAssembly: staff("parade-assembly", "Full security team assembled in formation at a client site"),
  ceremonialSalute: staff("ceremonial-salute", "Ceremonial guard in turbans and sashes saluting during a flag ceremony"),
  ceremonialGuard: staff("ceremonial-guard", "Five ceremonial guards in turbans and white gaiters saluting"),
  ceremonialFlagSalute: staff("ceremonial-flag-salute", "Ceremonial guard saluting during an Independence Day flag ceremony"),
  ladyGuardsScreening: staff("lady-guards-screening", "Lady security guards screening a visitor with a hand-held metal detector", { position: "65% 40%" }),
  ladyGuardsControlDesk: staff("lady-guards-control-desk", "Lady security guards at a front desk, one answering the intercom phone", { portrait: true, position: "50% 35%" }),
} satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof images;
