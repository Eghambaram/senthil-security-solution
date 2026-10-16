import { LEGAL_UPDATED, terms } from "@/content/legal";
import { LegalDocument } from "@/components/sections/LegalDocument";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description: "Terms of use for the Senthil Security Solutions website, senthilsecuritysolutions.com.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalDocument title={terms.title} href="/terms" intro={terms.intro} updated={LEGAL_UPDATED} sections={terms.sections} />
  );
}
