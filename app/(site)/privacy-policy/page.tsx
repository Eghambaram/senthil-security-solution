import { LEGAL_UPDATED, privacyPolicy } from "@/content/legal";
import { LegalDocument } from "@/components/sections/LegalDocument";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Senthil Security Solutions collects, uses and keeps personal data from enquiries and job applications, and your rights under the DPDP Act 2023.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title={privacyPolicy.title}
      href="/privacy-policy"
      intro={privacyPolicy.intro}
      updated={LEGAL_UPDATED}
      sections={privacyPolicy.sections}
    />
  );
}
