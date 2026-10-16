import Image from "next/image";
import { clients, clientsSection } from "@/content/clients";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { isPending, visible } from "@/lib/facts";

type Props = {
  /** Anchor for the section (the About page uses "clients" for /projects.php). */
  id?: string;
  className?: string;
};

/**
 * Client logo grid. Each logo is gated by its own status (permission per
 * organisation, CLAUDE.md §3); with none cleared, the section renders nothing.
 */
export function ClientLogos({ id, className }: Props) {
  const items = visible(clients);
  if (items.length === 0) return null;

  const headingId = `${id ?? "clients"}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className={cn("section-y scroll-mt-24", className)}>
      <div className="container-site">
        <Reveal>
          <SectionHeading
            id={headingId}
            eyebrow={clientsSection.eyebrow}
            title={
              <>
                {clientsSection.title}
                {items.some(isPending) ? <PendingBadge label="Pending permission" /> : null}
              </>
            }
            description={clientsSection.description}
          />
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {items.map((client, index) => (
            <li key={client.name}>
              <Reveal delay={Math.min(index, 9) * 0.03}>
                <div className="flex h-24 items-center justify-center rounded-md border border-border bg-white px-4 py-3 sm:h-28 sm:px-6">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={client.width}
                    height={client.height}
                    sizes="160px"
                    className="max-h-14 w-auto max-w-full object-contain sm:max-h-16"
                  />
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
