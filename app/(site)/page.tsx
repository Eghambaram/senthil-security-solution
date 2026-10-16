import { homeFaqs } from "@/content/faqs";
import { AboutFeature } from "@/components/sections/AboutFeature";
import { CompanyAtAGlance } from "@/components/sections/CompanyAtAGlance";
import { ConsultationBanner } from "@/components/sections/ConsultationBanner";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { HeroSection } from "@/components/sections/HeroSection";
import { IndustriesGrid } from "@/components/sections/IndustriesGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServicesGrid, getHomeServices } from "@/components/sections/ServicesGrid";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata, localBusinessJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Security Services in Chennai",
  description:
    "Trained security guards for factories, offices and residential communities across Chennai. Based in Tambaram since 2012. Request a site assessment.",
  path: "/",
});

export default function HomePage() {
  const hasServices = getHomeServices().cards.length > 0;

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <HeroSection showServicesLink={hasServices} />
      <ServicesGrid />
      <ConsultationBanner flushTop={hasServices} />
      <AboutFeature />
      <IndustriesGrid />
      <WhyChooseUs />
      <ProcessSteps />
      <CompanyAtAGlance />
      <FAQAccordion faqs={homeFaqs} />
      <CTASection />
    </>
  );
}
