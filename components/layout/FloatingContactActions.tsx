"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardCheck, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { company } from "@/content/company";
import { primaryCta } from "@/content/navigation";
import { cn } from "@/lib/cn";
import { isVisible } from "@/lib/facts";

/**
 * Desktop: small Call (+ WhatsApp once confirmed) stack, bottom-right.
 * Mobile: 56px sticky action bar that hides on scroll-down and returns on
 * scroll-up. Both hide while any form is in the viewport so they never
 * cover a submit button (PROMPT.md §6).
 */
export function FloatingContactActions() {
  const pathname = usePathname();
  const [scrollHidden, setScrollHidden] = useState(false);
  const [formInView, setFormInView] = useState(false);

  const phone = company.phone.value;
  const mobile = company.mobile;
  const whatsapp = isVisible(mobile) ? `https://wa.me/${mobile.value.whatsapp}` : null;

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 8) return;
      setScrollHidden(y > lastY && y > 120);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const forms = document.querySelectorAll("main form");
    if (forms.length === 0) return;
    const inView = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inView.add(entry.target);
        else inView.delete(entry.target);
      }
      setFormInView(inView.size > 0);
    });
    forms.forEach((f) => observer.observe(f));
    return () => {
      observer.disconnect();
      setFormInView(false);
    };
  }, [pathname]);

  const hiddenMobile = scrollHidden || formInView;

  return (
    <>
      {/* Desktop stack */}
      <aside
        aria-label="Quick contact"
        className={cn(
          "fixed bottom-6 right-6 z-30 hidden flex-col gap-3 transition-opacity duration-200 lg:flex",
          formInView && "pointer-events-none opacity-0",
        )}
      >
        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp (opens in a new tab)"
            className="flex size-12 items-center justify-center rounded-full bg-white text-navy-900 shadow-float ring-1 ring-border transition-colors hover:bg-surface"
          >
            <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-6" />
          </a>
        ) : null}
        <a
          href={`tel:${phone.tel}`}
          aria-label={`Call ${phone.display}`}
          className="on-dark flex size-12 items-center justify-center rounded-full bg-navy-900 text-gold-500 shadow-float transition-colors hover:bg-navy-800"
        >
          <Phone aria-hidden="true" strokeWidth={1.5} className="size-6" />
        </a>
      </aside>

      {/* Mobile action bar */}
      <nav
        aria-label="Quick contact"
        className={cn(
          "on-dark fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-navy-900 pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-brand lg:hidden",
          hiddenMobile && "translate-y-full",
        )}
      >
        <ul className={cn("grid h-14", whatsapp ? "grid-cols-3" : "grid-cols-2")}>
          <li>
            <a href={`tel:${phone.tel}`} className="flex h-full items-center justify-center gap-2 text-[15px] font-semibold text-white">
              <Phone aria-hidden="true" strokeWidth={1.5} className="size-5 text-gold-500" />
              Call
            </a>
          </li>
          {whatsapp ? (
            <li>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full items-center justify-center gap-2 border-l border-white/10 text-[15px] font-semibold text-white"
              >
                <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-5 text-gold-500" />
                WhatsApp
              </a>
            </li>
          ) : null}
          <li>
            <Link
              href={primaryCta.href}
              className="flex h-full items-center justify-center gap-2 bg-gold-500 text-[15px] font-semibold text-navy-900"
            >
              <ClipboardCheck aria-hidden="true" strokeWidth={1.5} className="size-5" />
              Enquire
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
