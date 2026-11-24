import type { ImageKey } from "@/content/images";

/**
 * /gallery: the client's own photos of its staff (supplied 24 Nov 2026).
 * Left out: a barrier photo showing a hospital's name (not a listed client)
 * and a group photo of staff not in security uniform (role unconfirmed).
 */
export type GalleryItem = { image: ImageKey; caption: string };

export type GalleryGroup = { id: string; title: string; heading: string; intro: string; items: GalleryItem[] };

export const galleryPage = {
  metaDescription:
    "Photos of Senthil Security Solutions guards in first-aid and fire-safety training, drill, uniform inspection and ceremonial duty.",
  eyebrow: "Gallery",
  title: "Our people, in training and on parade.",
  intro:
    "These are our own guards and supervisors: first-aid and fire-safety training, drill and inspection, and ceremonial duty at client sites.",
};

export const galleryGroups: GalleryGroup[] = [
  {
    id: "training",
    title: "Training",
    heading: "Practised, not just explained.",
    intro: "First aid, casualty handling and fire safety are practised hands-on, not just explained.",
    items: [
      { image: "trainingCpr", caption: "First-aid training: chest compressions" },
      { image: "trainingFirstAid", caption: "First aid, step by step" },
      { image: "trainingFireExtinguisher", caption: "Fire-extinguisher drill" },
      { image: "trainingCasualtyCarry", caption: "Carrying an injured person to safety" },
    ],
  },
  {
    id: "drill-inspection",
    title: "Drill and inspection",
    heading: "Turned out and ready.",
    intro: "Drill and turnout checks keep teams disciplined and ready for duty.",
    items: [
      { image: "paradeInspectionNavy", caption: "Line-up for inspection" },
      { image: "paradeOfficer", caption: "Senior officer with his team" },
      { image: "paradeSalute", caption: "Salute" },
      { image: "paradeUniformCheck", caption: "Uniform and turnout check" },
      { image: "paradeMarch", caption: "Drill practice" },
      { image: "paradeLineupSite", caption: "Site team in formation" },
      { image: "paradeBriefing", caption: "Briefing before duty" },
      { image: "paradeGuardCommander", caption: "Guard commander and squad" },
      { image: "paradeLineupNavy", caption: "Standing at attention" },
      { image: "paradeAssembly", caption: "Full team assembly at a client site" },
    ],
  },
  {
    id: "ceremonial",
    title: "Ceremonial duty",
    heading: "On parade for the flag.",
    intro: "Our ceremonial guard turns out for flag ceremonies at client sites.",
    items: [
      { image: "ceremonialFlagSalute", caption: "Independence Day flag salute" },
      { image: "ceremonialGuard", caption: "Ceremonial guard" },
      { image: "ceremonialSalute", caption: "Salute during the flag ceremony" },
    ],
  },
  {
    id: "lady-security-guards",
    title: "Lady security guards",
    heading: "Women guards for women visitors.",
    intro: "Women guards handle visitor screening, front desks and the frisking of women visitors.",
    items: [
      { image: "ladyGuardsScreening", caption: "Screening a visitor" },
      { image: "ladyGuardsControlDesk", caption: "At the front desk" },
    ],
  },
];
