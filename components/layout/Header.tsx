"use client";

import { useEffect, useState } from "react";
import type { NavItem } from "@/content/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { MobileNavigation } from "./MobileNavigation";
import { NavigationMenu } from "./NavigationMenu";

type Props = {
  nav: NavItem[];
  cta: { label: string; href: string };
};

/** Sticky white header; shrinks from 76px to 64px with a shadow after 24px of scroll. */
export function Header({ nav, cta }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-white transition-[box-shadow,border-color] duration-200",
        scrolled ? "border-transparent shadow-card" : "border-border",
      )}
    >
      <div
        className={cn(
          "container-site flex items-center justify-between gap-4 xl:gap-6 transition-[height] duration-200 ease-brand",
          scrolled ? "h-16" : "h-[76px]",
        )}
      >
        <Logo compact={scrolled} />
        <NavigationMenu items={nav} className="hidden lg:flex" />
        <div className="flex items-center gap-2">
          <Button href={cta.href} arrow className="hidden h-11 px-4 text-sm lg:inline-flex xl:px-5">
            {cta.label}
          </Button>
          <MobileNavigation items={nav} cta={cta} />
        </div>
      </div>
    </header>
  );
}
