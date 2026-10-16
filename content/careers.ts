import type { FactStatus } from "@/lib/facts";

export const careersPage = {
  metaDescription:
    "Security guard and supervisor jobs in Chennai with Senthil Security Solutions, Tambaram. Ex-servicemen welcome. Apply online or call our office.",
  eyebrow: "Careers",
  title: "Join a disciplined security team.",
  intro:
    "We recruit security guards and supervisors for sites in and around Chennai. Tell us about yourself and our team will contact you about suitable openings.",
  why: {
    eyebrow: "Working with us",
    title: "What you can expect.",
    items: [
      {
        title: "A local employer",
        body: "Our office is in Tambaram Sanatorium, so you can visit us and speak to a person.",
        status: "verified" as FactStatus,
      },
      {
        title: "Clear duties",
        body: "Every post comes with a briefing on the site, its rules and who you report to.",
        status: "verified" as FactStatus,
      },
      {
        title: "Training",
        body: "Training in security procedures, fire safety and first aid.",
        status: "pending" as FactStatus,
      },
      {
        title: "Statutory benefits",
        body: "PF and ESI as applicable.",
        status: "pending" as FactStatus,
      },
    ],
  },
  roles: {
    eyebrow: "Roles",
    title: "Positions we recruit for.",
    items: [
      {
        id: "security-guard",
        title: "Security Guard",
        body: "Gate control, visitor and vehicle logs, patrols and incident reporting at a client site.",
        status: "verified" as FactStatus,
      },
      {
        id: "supervisor",
        title: "Security Supervisor",
        body: "Leads a team across shifts, checks posts, handles client communication and keeps records in order.",
        status: "verified" as FactStatus,
      },
      {
        id: "gunman",
        title: "Gunman",
        body: "Armed security post for licensed personnel.",
        status: "missing" as FactStatus,
      },
    ],
  },
  exServicemen: {
    title: "Ex-servicemen welcome",
    body: "If you have served in the Army, Navy, Air Force or a central armed police force, your experience is valued here. Mention your service in the application.",
    status: "pending" as FactStatus,
  },
  privacyNote:
    "We use your details only to assess your application and contact you about it. Read our privacy policy for how long we keep applications and how to ask us to delete them.",
} as const;
