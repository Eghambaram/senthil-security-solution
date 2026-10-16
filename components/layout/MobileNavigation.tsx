"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { company } from "@/content/company";
import type { NavItem } from "@/content/navigation";
import { Button } from "@/components/ui/Button";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { cn } from "@/lib/cn";
import { isActive } from "./NavigationMenu";

type Props = {
  items: NavItem[];
  cta: { label: string; href: string };
};

/**
 * Hamburger → full-height sheet. Uses a modal <dialog>, which makes the rest
 * of the page inert (focus trap) and closes on Esc; body scroll is locked
 * while open.
 */
export function MobileNavigation({ items, cta }: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const phone = company.phone.value;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) document.documentElement.style.overflow = "";
  }, [open]);

  // Close if the viewport grows to desktop while open.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-md text-navy-900 hover:bg-surface lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" strokeWidth={1.5} className="size-6" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // Close after following any link inside the sheet.
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-white p-0 text-ink backdrop:bg-navy-900/50 open:flex open:flex-col"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <span className="font-display text-lg font-bold text-navy-900">Menu</span>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-navy-900 hover:bg-surface"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X aria-hidden="true" strokeWidth={1.5} className="size-6" />
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 py-2">
          <ul className="divide-y divide-border">
            {items.map((item) =>
              item.children ? (
                <li key={item.href}>
                  <MobileGroup item={item} pathname={pathname} />
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center text-[17px] font-medium text-navy-900",
                      isActive(pathname, item.href) && "text-gold-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="shrink-0 space-y-3 border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button href={cta.href} arrow className="w-full">
            {cta.label}
          </Button>
          <Button
            href={`tel:${phone.tel}`}
            variant="secondary"
            className="w-full"
            icon={<Phone aria-hidden="true" strokeWidth={1.5} className="size-5" />}
          >
            Call {phone.display}
          </Button>
        </div>
      </dialog>
    </>
  );
}

function MobileGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const [expanded, setExpanded] = useState(isActive(pathname, item.href));
  const panelId = useId();
  const links = [{ label: `All ${item.label.toLowerCase()}`, href: item.href, pending: false }, ...(item.children ?? [])];

  return (
    <>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "flex min-h-12 w-full items-center justify-between text-left text-[17px] font-medium text-navy-900",
          isActive(pathname, item.href) && "text-gold-ink",
        )}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.5}
          className={cn("size-5 transition-transform duration-200", expanded && "rotate-180")}
        />
      </button>
      <ul id={panelId} hidden={!expanded} className="pb-2 pl-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="flex min-h-12 items-center border-l-2 border-border pl-4 text-[15px] text-ink aria-[current=page]:border-gold-500 aria-[current=page]:font-semibold"
            >
              {link.label}
              {link.pending ? <PendingBadge /> : null}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
