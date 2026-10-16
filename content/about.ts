import type { FactStatus } from "@/lib/facts";

export const aboutPage = {
  metaDescription:
    "Senthil Security Solutions has provided security personnel in Chennai since May 2012, from our Tambaram Sanatorium office. Our story, values and approach.",
  eyebrow: "About us",
  title: "A Chennai security partner since 2012.",
  intro:
    "Senthil Security Solutions was established on 26 May 2012 in Tambaram Sanatorium. We provide trained security personnel to the businesses and communities around us.",
  story: {
    eyebrow: "Our story",
    title: "Local, accountable, and here for the long term.",
    paragraphs: [
      "Our office is on Railway Station Road in Tambaram Sanatorium. Being close to the sites we look after means we can visit, answer the phone and sort out problems quickly.",
      "Clients deal with people they can meet in person, and our officers report to supervisors who know their sites. That is how we prefer to work: plainly, and for the long term.",
    ],
  },
  values: {
    eyebrow: "What we stand for",
    title: "Four values, on every shift.",
    items: [
      { title: "Discipline", body: "Turn up on time, in uniform, and follow the procedure even when no one is watching." },
      { title: "Vigilance", body: "Notice what is out of place and act on it early." },
      { title: "Integrity", body: "Record what happened honestly and report problems, including our own." },
      { title: "Respect", body: "Treat residents, employees and visitors courteously, whoever they are." },
    ],
  },
  people: {
    eyebrow: "Our people",
    title: "Trained for the work they do.",
    status: "pending" as FactStatus,
    body: "Our personnel include people who have served in the CISF, Army, Navy and Air Force. Training covers:",
    training: [
      "Security systems and procedures",
      "Fire prevention and firefighting",
      "First aid",
      "Bomb-threat response",
      "Crime detection and reporting",
    ],
  },
  details: {
    eyebrow: "Company details",
    title: "Who you are dealing with.",
  },
} as const;
