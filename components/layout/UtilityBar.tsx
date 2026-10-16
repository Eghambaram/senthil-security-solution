import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { company } from "@/content/company";
import { Icon } from "@/components/ui/Icon";
import { isVisible } from "@/lib/facts";

/** Navy 40px strip above the header. Only the phone shows below 768px. */
export function UtilityBar() {
  const phone = company.phone.value;

  return (
    <section aria-label="Contact information" className="on-dark bg-navy-900 text-[13px] text-white/85">
      <div className="container-site flex h-10 items-center justify-center md:justify-between">
        <p className="hidden items-center gap-2 md:flex">
          <Icon icon={MapPin} size={20} className="size-4 text-gold-500" />
          <span>Professional Security Services</span>
          <span aria-hidden="true" className="text-white/40">
            ·
          </span>
          <span>Chennai, Tamil Nadu</span>
        </p>
        <ul className="flex items-center">
          <li className="md:pr-4">
            <a href={`tel:${phone.tel}`} className="inline-flex items-center gap-2 rounded-sm hover:text-gold-300">
              <Icon icon={Phone} size={20} className="size-4 text-gold-500" />
              <span>{phone.display}</span>
            </a>
          </li>
          {isVisible(company.mobile) ? (
            <li className="hidden border-l border-white/20 px-4 lg:block">
              <a
                href={`https://wa.me/${company.mobile.value.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm hover:text-gold-300"
              >
                <Icon icon={MessageCircle} size={20} className="size-4 text-gold-500" />
                <span>WhatsApp {company.mobile.value.display}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ) : null}
          <li className="hidden border-l border-white/20 px-4 md:block">
            <Link href="/careers" className="rounded-sm hover:text-gold-300">
              Careers
            </Link>
          </li>
          <li className="hidden border-l border-white/20 pl-4 md:block">
            <Link href="/contact" className="rounded-sm hover:text-gold-300">
              Enquiry
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
