import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";

type Props = {
  /** Trail after Home; the last item is the current page. */
  items: Crumb[];
};

export function Breadcrumbs({ items }: Props) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="font-medium text-navy-900">
                    {crumb.label}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.href} className="rounded-sm hover:text-navy-900 hover:underline">
                      {crumb.label}
                    </Link>
                    <ChevronRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
