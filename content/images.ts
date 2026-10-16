/**
 * Image manifest (CLAUDE.md §2.4, §7). Every image slot on the site is
 * listed here. `src: null` renders a neutral navy placeholder frame; set
 * `src` (file under /public/images) once an approved photo exists.
 *
 * `brief` is the art-direction note shown on the dev placeholder and used
 * as the shot list for the client / photographer (PROMPT.md §4).
 */
export type ImageEntry = {
  src: string | null;
  alt: string;
  brief: string;
  width: number;
  height: number;
  /** Photo of real company staff / sites. */
  isAuthentic: boolean;
  /** Client has approved use on the website. */
  approved: boolean;
  credit: string | null;
};

function slot(alt: string, brief: string, width = 1600, height = 1200): ImageEntry {
  return { src: null, alt, brief, width, height, isAuthentic: false, approved: false, credit: null };
}

export const images = {
  hero: slot(
    "Security officer on duty at a site entrance",
    "Guard at a factory or IT-park gate, daylight, eye level, purposeful not posing",
    1600,
    2000,
  ),
  serviceIndustrial: slot("Security officer at a factory gate", "Factory gate with vehicle/material check"),
  serviceCorporate: slot("Security officer at an office lobby", "Office or IT-park lobby, front-of-house desk"),
  serviceResidential: slot("Security officer at a gated community entrance", "Apartment / gated community gate"),
  serviceEvent: slot("Security team managing an event entrance", "Event entry screening, daylight"),
  serviceArmed: slot("Ex-servicemen security personnel", "Only authentic, licensed armed personnel"),
  consultation: slot("", "Low-opacity background: site perimeter or gate at dusk", 2400, 900),
  aboutPrimary: slot("Supervisor briefing security officers before a shift", "Supervisor briefing at shift start"),
  aboutSecondary: slot("Security officer on a site patrol", "Site patrol round, not a control room"),
  industryManufacturing: slot("Manufacturing plant entrance", "Factory exterior / gate"),
  industryCorporate: slot("Corporate office building", "Office / IT-park exterior"),
  industryCommercial: slot("Commercial building and retail frontage", "Commercial building or mall"),
  industryResidential: slot("Residential apartment community", "Gated community exterior"),
  industryWarehouse: slot("Warehouse loading area", "Warehouse yard / loading bay"),
  industryEvents: slot("Event venue entrance", "Event or religious venue entrance"),
} satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof images;
