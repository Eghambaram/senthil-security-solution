import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { isPending, visible } from "@/lib/facts";

export type NavChild = { label: string; href: string; pending: boolean };

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export function getMainNav(): NavItem[] {
  return [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    {
      label: "Services",
      href: "/services",
      children: visible(services).map((s) => ({
        label: s.title,
        href: `/services/${s.slug}`,
        pending: isPending(s),
      })),
    },
    {
      label: "Industries",
      href: "/industries",
      children: visible(industries).map((i) => ({
        label: i.title,
        href: `/industries/${i.slug}`,
        pending: isPending(i),
      })),
    },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ];
}

export const primaryCta = { label: "Request a Site Assessment", href: "/site-assessment" } as const;

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
] as const;
