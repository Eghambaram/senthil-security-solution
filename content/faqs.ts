import type { FactStatus } from "@/lib/facts";

export type Faq = {
  question: string;
  answer: string;
  status: FactStatus;
};

/** Homepage FAQs. Answers use verified facts only; others stay pending. */
export const homeFaqs: readonly Faq[] = [
  {
    question: "How do I request a site assessment?",
    answer:
      "Fill in the site assessment form or call us on +91 44 4380 6837. Tell us about your premises and what concerns you, and our team will contact you to arrange a visit.",
    status: "verified",
  },
  {
    question: "How long has Senthil Security Solutions been operating?",
    answer: "We were established on 26 May 2012 and are based in Tambaram Sanatorium, Chennai.",
    status: "verified",
  },
  {
    question: "Which areas do you serve?",
    answer: "We are based in Tambaram Sanatorium and serve sites across Chennai.",
    status: "pending",
  },
  {
    question: "What kind of premises do you secure?",
    answer:
      "Industrial units, garment and automobile factories, commercial establishments, IT offices, ATMs and residential apartments.",
    status: "verified",
  },
  {
    question: "Are your security personnel trained?",
    answer:
      "Yes. Training covers security systems, fire prevention and firefighting, first aid, bomb-threat response, crime detection, intelligence and vigilance, and disaster management with mock drills. Guards are also briefed on the needs of each site before deployment.",
    status: "verified",
  },
  {
    question: "Do you employ ex-servicemen?",
    answer:
      "Yes. Our personnel include people who have served in the CISF, Army, Navy and Air Force, and our General Manager and Executive Director come from the CISF and the Air Force. We welcome applications from ex-servicemen.",
    status: "verified",
  },
  {
    question: "Do you check your guards’ backgrounds?",
    answer:
      "Yes. Every officer is inducted only after a thorough antecedent (background) verification. Our staff also receive PF and ESI benefits.",
    status: "verified",
  },
  {
    question: "What are your office hours?",
    answer:
      "Our office in Tambaram Sanatorium is open Monday to Saturday, 9:00 AM to 6:00 PM, and closed on Sunday. You can call or WhatsApp us on +91 90943 31333.",
    status: "verified",
  },
  {
    question: "Are you licensed under PSARA?",
    answer: "",
    status: "missing",
  },
];
