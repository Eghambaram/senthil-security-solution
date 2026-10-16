import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { company } from "@/content/company";
import SiteLayout from "./(site)/layout";

export default function NotFound() {
  const phone = company.phone.value;
  return (
    <SiteLayout>
      <section className="section-y">
        <div className="container-site max-w-2xl">
          <Eyebrow>Page not found</Eyebrow>
          <h1 className="mt-5 text-h1">We couldn’t find that page.</h1>
          <p className="mt-5 text-body-lg text-ink-muted">
            The page may have moved when we rebuilt our website. Start from the homepage or call our team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/" arrow>
              Go to homepage
            </Button>
            <Button
              href={`tel:${phone.tel}`}
              variant="secondary"
              icon={<Phone aria-hidden="true" strokeWidth={1.5} className="size-5" />}
            >
              {phone.display}
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
