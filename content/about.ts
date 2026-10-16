import type { FactStatus } from "@/lib/facts";

/**
 * About page copy. Leadership, people, training and vision come from the
 * company’s own legacy website (supplied by the project owner), rewritten in
 * plain English without superlatives (CLAUDE.md §9).
 */
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
      "We provide security to industrial units, garment and automobile factories, commercial establishments, IT offices, ATMs and residential apartments. Every site is different, so guards are trained for the nature of the work before they are deployed.",
    ],
  },
  vision: {
    eyebrow: "Our vision",
    title: "Zero loss is the goal.",
    items: [
      { title: "Prevent loss", body: "Aim for total loss control at every site we protect: zero loss." },
      { title: "Earn trust", body: "Meet our clients’ expectations and keep the confidence they place in us." },
      { title: "Keep improving", body: "Bring practical, well-thought-out ideas to the way security is done." },
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
  leadership: {
    eyebrow: "Leadership",
    title: "Run by people who know security.",
    status: "verified" as FactStatus,
    managingDirector: {
      bio: [
        "An MCA graduate, Mr. K. Senthil Raja is directly involved in the day-to-day management of the company. He is known for his social work across Tamil Nadu and is associated with Tamil Nadu’s security agencies at the managerial level.",
        "His approach has built lasting relationships with the clients the company serves.",
      ],
    },
    team: "The company is managed by professionals from defence, security, human resources and administration. Our General Manager and Executive Director come from the CISF and the Air Force, and they are supported by experienced officers and field staff.",
  },
  people: {
    eyebrow: "Our people",
    title: "Verified, trained and looked after.",
    status: "verified" as FactStatus,
    body: "Around 500 security personnel are on our rolls (company figure, October 2026), including ex-servicemen and people who have served in the CISF, Army, Navy and Air Force. Every officer is inducted only after a thorough antecedent verification, and receives PF and ESI benefits. Training covers:",
    training: [
      "Security systems and gate procedures",
      "Fire prevention and firefighting",
      "First aid",
      "Action during a bomb threat",
      "Crime detection",
      "Intelligence collection and vigilance",
      "Disaster management and mock drills",
    ],
  },
  details: {
    eyebrow: "Company details",
    title: "Who you are dealing with.",
  },
} as const;
