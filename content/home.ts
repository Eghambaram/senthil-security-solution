import type { FactStatus } from "@/lib/facts";

/**
 * Homepage copy. Text marked approved in PROMPT.md §6 is used verbatim;
 * anything depending on a ⚑ fact carries `status: "pending"`.
 */

export const hero = {
  eyebrow: "People. Process. Protection.",
  /** Rendered as two lines; the accent closes the second line. */
  titleLine1: "Protection that",
  titleLine2: "earns",
  titleAccent: "your trust.",
  body: "Professional security solutions for industrial, commercial and residential environments—built around discipline, vigilance and people.",
  primaryCta: { label: "Discuss Your Security Needs", href: "/site-assessment" },
  secondaryCta: { label: "Explore Our Services", href: "#services" },
  panel: {
    title: "Security, delivered with discipline",
    body: "Trained teams, clear reporting and a single point of contact for your site.",
  },
};

export type TrustItem = {
  id: "since" | "personnel" | "vetted" | "location";
  /** Small line above the value. */
  label: string;
  value: string;
  footnote?: string;
  status: FactStatus;
};

export const trustRow: TrustItem[] = [
  { id: "since", label: "Established", value: "2012", status: "verified" },
  {
    id: "personnel",
    label: "Security staff*",
    value: "500+",
    footnote: "*Company-reported figure, as of October 2026.",
    status: "verified",
  },
  // Antecedent verification before induction (legacy site, CLAUDE.md §3).
  { id: "vetted", label: "Every officer", value: "Background-checked", status: "verified" },
  { id: "location", label: "Based in", value: "Tambaram, Chennai", status: "verified" },
];

export const servicesIntro = {
  eyebrow: "Our services",
  title: "Security for every environment.",
  description: "Professional security solutions tailored to the needs of your premises, people and operations.",
  fallbackTile: {
    title: "Not sure what you need?",
    body: "Tell us about your site and we will help you work out the right cover.",
    cta: { label: "Talk to us", href: "/site-assessment" },
  },
};

export const consultation = {
  eyebrow: "Your safety partner",
  title: "Let’s build a safer workplace.",
  body: "Talk to our team about a security plan tailored to your premises.",
  cta: { label: "Request a Consultation", href: "/site-assessment" },
};

export const about = {
  eyebrow: "About Senthil Security Solutions",
  title: "A safer tomorrow, built on discipline and service.",
  body: "Since 2012, Senthil Security Solutions has provided trained security personnel to factories, offices and residential communities across Chennai.",
  /** Shown only once the ex-forces background is confirmed. */
  forcesSentence: {
    text: "Our teams are built on the discipline of people who have served in India’s armed and disciplined forces, and on a simple commitment: show up, stay vigilant and keep you informed.",
    status: "verified" as FactStatus,
  },
  commitmentSentence: "Our teams are built on a simple commitment: show up, stay vigilant and keep you informed.",
  indicators: [
    { id: "management", label: "Experienced management", status: "verified" as FactStatus },
    { id: "trained", label: "Trained personnel", status: "verified" as FactStatus },
    { id: "client", label: "Client-focused approach", status: "verified" as FactStatus },
  ],
  cta: { label: "Know More About Us", href: "/about" },
  badge: { value: "Since 2012", label: "Tambaram Sanatorium, Chennai" },
};

export const industriesIntro = {
  eyebrow: "Industries we serve",
  title: "Wherever people work and live.",
};

export const whyChooseUs = {
  eyebrow: "Why choose us",
  title: "More than security. A long‑term partner.",
  description: "We focus on people, process and consistent service to create safer workplaces and communities.",
  items: [
    { id: "trained", title: "Trained, disciplined personnel", body: "Background-verified officers, trained for the site before deployment." },
    { id: "plans", title: "Plans built around your site", body: "Deployment shaped by your layout, shifts and risks." },
    { id: "safety", title: "Safety and discipline first", body: "Clear conduct standards on every shift." },
    { id: "sectors", title: "Experience across sectors", body: "Factories, offices and residential communities since 2012." },
    { id: "communication", title: "Responsive communication", body: "One point of contact who answers when you call." },
    { id: "relationships", title: "Long-term relationships", body: "We aim to earn renewals, not just first contracts." },
  ],
};

export const approach = {
  eyebrow: "Our approach",
  title: "From first visit to everyday vigilance.",
  status: "pending" as FactStatus,
  steps: [
    { title: "Understand your site", body: "We visit, walk the premises and listen to what concerns you." },
    { title: "Assess risks and operations", body: "Entry points, shifts, movement of people, vehicles and material." },
    { title: "Recommend a deployment plan", body: "Posts, headcount and duties, set out clearly before you commit." },
    { title: "Deploy, supervise and review", body: "Briefed teams on site, regular supervision and periodic reviews." },
  ],
};

export const glanceIntro = {
  eyebrow: "Company at a glance",
  title: "Rooted in Chennai since 2012.",
};

export const finalCta = {
  title: "Your premises deserve dependable protection.",
  body: "Tell us about your security requirements and let our team help you identify the next steps.",
  primary: { label: "Request a Site Assessment", href: "/site-assessment" },
  secondaryLabel: "Call Our Team",
};
