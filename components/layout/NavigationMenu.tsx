"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { NavItem } from "@/content/navigation";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { cn } from "@/lib/cn";

type Props = {
  items: NavItem[];
  className?: string;
};

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkBase =
  "relative inline-flex h-10 items-center gap-1 rounded-sm px-2.5 text-[15px] xl:px-3 font-medium text-navy-900 transition-colors hover:text-gold-ink";

function ActiveRule({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-x-2.5 -bottom-0.5 xl:inset-x-3 h-0.5 origin-left bg-gold-500 transition-transform duration-200 ease-brand",
        active ? "scale-x-100" : "scale-x-0",
      )}
    />
  );
}

export function NavigationMenu({ items, className }: Props) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={className}>
      <ul className="flex items-center xl:gap-1">
        {items.map((item) =>
          item.children ? (
            <li key={item.href}>
              <Dropdown item={item} active={isActive(pathname, item.href)} pathname={pathname} />
            </li>
          ) : (
            <li key={item.href}>
              <Link
                href={item.href}
                className={linkBase}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
                <ActiveRule active={isActive(pathname, item.href)} />
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}

type DropdownProps = {
  item: NavItem;
  active: boolean;
  pathname: string;
};

const OPEN_DELAY = 80;
const CLOSE_DELAY = 180;

function Dropdown({ item, active, pathname }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const links = [{ label: `All ${item.label.toLowerCase()}`, href: item.href, pending: false }, ...(item.children ?? [])];

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const schedule = (next: boolean) => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(next), next ? OPEN_DELAY : CLOSE_DELAY);
  };

  const focusItem = useCallback((index: number) => {
    const nodes = rootRef.current?.querySelectorAll<HTMLAnchorElement>("[data-menu-item]");
    if (!nodes || nodes.length === 0) return;
    const i = (index + nodes.length) % nodes.length;
    nodes[i]?.focus();
  }, []);

  // Close on outside click and on route change.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  useEffect(() => clearTimer, []);

  const onButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(-1));
    }
  };

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const nodes = Array.from(rootRef.current?.querySelectorAll<HTMLAnchorElement>("[data-menu-item]") ?? []);
    const current = nodes.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(current + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(current - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(-1);
    }
  };

  const onRootKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => schedule(true)}
      onMouseLeave={() => schedule(false)}
      onKeyDown={onRootKeyDown}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={linkBase}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          clearTimer();
          setOpen((v) => !v);
        }}
        onKeyDown={onButtonKeyDown}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.5}
          className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
        />
        <ActiveRule active={active} />
      </button>

      <div
        id={panelId}
        hidden={!open}
        onKeyDown={onPanelKeyDown}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
        className="absolute left-0 top-full z-50 pt-3"
      >
        <ul className="w-80 rounded-lg border border-border bg-white p-2 shadow-float">
          {links.map((link, index) => (
            <li key={link.href}>
              <Link
                href={link.href}
                data-menu-item
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-md px-3 text-[15px] text-ink transition-colors hover:bg-surface hover:text-navy-900",
                  index === 0 && "font-semibold text-navy-900",
                  pathname === link.href && "bg-surface",
                )}
              >
                {link.label}
                {link.pending ? <PendingBadge /> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
