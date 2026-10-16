import { Phone } from "lucide-react";
import { company } from "@/content/company";
import { finalCta } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function CTASection() {
  const phone = company.phone.value;

  return (
    <section aria-labelledby="cta-title" className="section-y bg-surface">
      <Reveal className="container-site text-center">
        <span aria-hidden="true" className="mx-auto block h-0.5 w-10 bg-gold-500" />
        <h2 id="cta-title" className="mx-auto mt-6 max-w-3xl text-h2">
          {finalCta.title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-body-lg text-ink-muted">{finalCta.body}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href={finalCta.primary.href} arrow>
            {finalCta.primary.label}
          </Button>
          <Button
            href={`tel:${phone.tel}`}
            variant="secondary"
            icon={<Phone aria-hidden="true" strokeWidth={1.5} className="size-5" />}
          >
            {finalCta.secondaryLabel}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
