import Link from "next/link";
import { ArrowRight, Building2, Factory, Home, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import type { ServiceSummary } from "@/content/services";
import { Icon } from "@/components/ui/Icon";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { isPending } from "@/lib/facts";

const icons: Record<ServiceSummary["icon"], LucideIcon> = {
  factory: Factory,
  building: Building2,
  home: Home,
  users: Users,
  shield: ShieldCheck,
};

type Props = { service: ServiceSummary };

/** Photo-topped card with an icon tab overlapping the image edge. The title link covers the card. */
export function ServiceCard({ service }: Props) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white shadow-card transition-transform duration-300 ease-brand hover:-translate-y-1 has-[a:focus-visible]:-translate-y-1">
      <div className="relative aspect-[16/10]">
        <ImageFrame image={service.image} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
      </div>
      <div className="relative flex flex-1 flex-col px-5 pb-6 pt-10">
        <span className="absolute -top-6 left-5 flex size-12 items-center justify-center rounded-md border border-border bg-white text-navy-900 shadow-card">
          <Icon icon={icons[service.icon]} size={24} />
        </span>
        <h3 className="text-h3">
          <Link
            href={`/services/${service.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-offset-4"
          >
            {service.title}
          </Link>
          {isPending(service) ? <PendingBadge /> : null}
        </h3>
        <p className="mt-2 flex-1 text-[15px] text-ink-muted">{service.summary}</p>
        <span aria-hidden="true" className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-gold-ink">
          Explore service
          <ArrowRight strokeWidth={1.75} className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
