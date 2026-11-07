"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade + rise into view once. Falls back to static when reduced motion is on. */
export function Reveal({
  delay = 0,
  y = 28,
  children,
  ...rest
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Section eyebrow: small label with a slat accent. */
export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide " +
        (light ? "text-oak-soft" : "text-oak")
      }
    >
      <span aria-hidden className="flex gap-[3px]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="block h-3.5 w-[3px] rounded-full bg-current" />
        ))}
      </span>
      {children}
    </span>
  );
}
