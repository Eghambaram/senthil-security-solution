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
      "Factories and warehouses, offices and IT parks, commercial buildings, and residential communities such as apartments and gated layouts.",
    status: "pending",
  },
  {
    question: "Are your security personnel trained?",
    answer:
      "Yes. Training covers security systems, fire prevention and firefighting, first aid, bomb-threat response and crime detection.",
    status: "pending",
  },
  {
    question: "Do you employ ex-servicemen?",
    answer:
      "Yes. Our personnel include people who have served in the CISF, Army, Navy and Air Force. We also welcome applications from ex-servicemen.",
    status: "pending",
  },
  {
    question: "Are you licensed under PSARA?",
    answer: "",
    status: "missing",
  },
];
