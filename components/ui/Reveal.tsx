import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Seconds. */
  delay?: number;
  /** Pixels; capped at 24 per CLAUDE.md §9. */
  y?: number;
  className?: string;
};

/**
 * Fades content up once when it enters the viewport. Pure markup: one
 * shared observer (`RevealObserver`) flips `data-revealed`, and CSS in
 * globals.css does the motion. Content stays visible without JavaScript.
 */
export function Reveal({ children, delay = 0, y = 16, className }: Props) {
  const style = {
    "--reveal-delay": `${delay}s`,
    "--reveal-y": `${Math.min(y, 24)}px`,
  } as CSSProperties;

  return (
    <div data-reveal="" style={style} className={className}>
      {children}
    </div>
  );
}
