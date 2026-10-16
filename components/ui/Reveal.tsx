"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Seconds. */
  delay?: number;
  /** Pixels; capped at 24 per CLAUDE.md §9. */
  y?: number;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades content up once when it enters the viewport. */
export function Reveal({ children, delay = 0, y = 16, className }: Props) {
  const reduce = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={reduce ? false : { opacity: 0, y: Math.min(y, 24) }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.6, ease: EASE, delay }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
