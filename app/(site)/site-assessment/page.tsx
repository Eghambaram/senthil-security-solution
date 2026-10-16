import { Phone } from "lucide-react";
import { company } from "@/content/company";
import { services } from "@/content/services";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { EnquirySteps } from "@/components/sections/EnquirySteps";
import { PageHero } from "@/components/sections/PageHero";
import { visible } from "@/lib/facts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Request a Site Assessment",
  description:
    "Request a security site assessment in Chennai. Tell us about your factory, office, apartment or event and our team will contact you to arrange a visit.",
  path: "/site-assessment",
});

export default function SiteAssessmentPage() {
  const serviceOptions = visible(services).map((s) => s.title);
  const phone = company.phone.value;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Site Assessment", href: "/site-assessment" }]}
        eyebrow="Site assessment"
        title="Request a site assessment."
        intro="Tell us about your premises and what you need. Our team will contact you to discuss your requirements and arrange a visit."
      />

      <section aria-label="Site assessment form" className="section-y">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="order-2 min-w-0 lg:order-1 lg:col-span-7">
            <div className="rounded-lg border border-border bg-white p-6 shadow-card sm:p-8">
              <h2 className="text-h3">Your details and your site</h2>
              <div className="mt-6">
                <EnquiryForm variant="assessment" serviceOptions={serviceOptions} />
              </div>
            </div>
          </div>

          <aside aria-label="What happens next" className="order-1 min-w-0 lg:order-2 lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <EnquirySteps title="What happens next" as="h2" compact />
              <div className="on-dark mt-10 rounded-lg bg-navy-900 p-6 text-white">
                <p className="font-display text-lg font-bold text-white">Prefer to talk?</p>
                <p className="mt-1 text-[15px] text-white/75">Call our office and we will take your details over the phone.</p>
                <a
                  href={`tel:${phone.tel}`}
                  className="mt-4 inline-flex items-center gap-2 font-display text-xl font-bold text-gold-300 hover:text-gold-500"
                >
                  <Phone aria-hidden="true" strokeWidth={1.5} className="size-5" />
                  {phone.display}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
