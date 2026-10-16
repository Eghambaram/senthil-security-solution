import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "tertiary";
type Tone = "light" | "dark";

type StyleProps = {
  variant?: Variant;
  /** Surface the button sits on. */
  tone?: Tone;
  /** Show the trailing arrow that nudges on hover. */
  arrow?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

type AnchorProps = StyleProps & { href: string } & Omit<ComponentProps<"a">, keyof StyleProps | "href">;
type NativeButtonProps = StyleProps & { href?: undefined } & Omit<ComponentProps<"button">, keyof StyleProps>;

type Props = AnchorProps | NativeButtonProps;

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const solid = "h-12 rounded-md px-6 text-[15px]";
const link = "text-[15px] underline decoration-transparent decoration-1 underline-offset-4 hover:decoration-current";

const variants: Record<Variant, Record<Tone, string>> = {
  primary: {
    light: cn(solid, "bg-gold-500 text-navy-900 hover:bg-gold-300"),
    dark: cn(solid, "bg-gold-500 text-navy-900 hover:bg-gold-300"),
  },
  secondary: {
    light: cn(solid, "border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white"),
    dark: cn(solid, "border border-white/40 text-white hover:border-white hover:bg-white/10"),
  },
  tertiary: {
    light: cn(link, "text-gold-ink"),
    dark: cn(link, "text-gold-300"),
  },
};

function splitStyleProps<T extends StyleProps>(props: T) {
  const { variant, tone, arrow, icon, className, children, ...rest } = props;
  return { style: { variant, tone, arrow, icon, className, children }, rest };
}

export function Button(props: Props) {
  const { style, rest } = splitStyleProps(props);
  const { variant = "primary", tone = "light", arrow = false, icon, className, children } = style;
  const classes = cn(base, variants[variant][tone], className);

  const content = (
    <>
      {icon}
      <span>{children}</span>
      {arrow ? (
        <ArrowRight
          aria-hidden="true"
          strokeWidth={1.75}
          className="size-[18px] transition-transform duration-200 ease-brand group-hover:translate-x-1"
        />
      ) : null}
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchorRest } = rest as Omit<AnchorProps, keyof StyleProps>;
    if (/^(mailto:|tel:)/.test(href)) {
      return (
        <a href={href} className={classes} {...anchorRest}>
          {content}
        </a>
      );
    }
    if (/^https?:/.test(href)) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...anchorRest}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as Omit<NativeButtonProps, keyof StyleProps>;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
