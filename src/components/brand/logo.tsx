"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LATIN_BOX,
  LATIN_PATHS,
  MARK_BODY,
  MARK_BOX,
  MARK_DOT,
  WORD_BLOCKS,
  WORD_BODY,
  WORD_BOX,
} from "./geometry";

const SLAT = 40;
const GAP = 22;
const SLATS = Array.from(
  { length: Math.ceil((MARK_BOX.w + 40) / (SLAT + GAP)) },
  (_, i) => MARK_BOX.x - 12 + i * (SLAT + GAP)
);

/**
 * The «خ» mark built from vertical wood slats — the same slats Khashaba
 * builds into partitions and wall cladding.
 */
export function KhMark({
  className,
  animate = false,
  delay = 0,
  title = "خشبة",
}: {
  className?: string;
  animate?: boolean;
  delay?: number;
  title?: string;
}) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const play = animate && !reduce;
  const pad = 20;
  return (
    <svg
      viewBox={`${MARK_BOX.x - pad} ${MARK_BOX.y - pad} ${MARK_BOX.w + pad * 2} ${MARK_BOX.h + pad * 2}`}
      className={cn("block", className)}
      role="img"
      aria-label={title}
      fill="currentColor"
    >
      <defs>
        <clipPath id={`kh-${id}`}>
          <path d={MARK_BODY} />
        </clipPath>
      </defs>
      <g clipPath={`url(#kh-${id})`}>
        {SLATS.map((x, i) => (
          <motion.rect
            key={x}
            x={x}
            y={MARK_BOX.y}
            width={SLAT}
            height={MARK_BOX.h + 40}
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
            initial={play ? { scaleY: 0 } : false}
            animate={play ? { scaleY: 1 } : undefined}
            transition={{
              delay: delay + i * 0.06,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </g>
      <motion.path
        d={MARK_DOT}
        initial={play ? { y: -260, opacity: 0 } : false}
        animate={play ? { y: 0, opacity: 1 } : undefined}
        transition={{
          delay: delay + SLATS.length * 0.06 + 0.25,
          type: "spring",
          stiffness: 260,
          damping: 16,
        }}
      />
    </svg>
  );
}

/** Arabic wordmark «خشبة» with block dots, optional KHASHABA line. */
export function Wordmark({
  className,
  latin = false,
  latinClassName,
}: {
  className?: string;
  latin?: boolean;
  latinClassName?: string;
}) {
  const latinScale = (WORD_BOX.w * 0.86) / (LATIN_BOX.x1 - LATIN_BOX.x0);
  const latinW = (LATIN_BOX.x1 - LATIN_BOX.x0) * latinScale;
  const cx = WORD_BOX.x + WORD_BOX.w / 2;
  const height = latin ? WORD_BOX.h + 360 : WORD_BOX.h;
  return (
    <svg
      viewBox={`${WORD_BOX.x - 10} ${WORD_BOX.y - 10} ${WORD_BOX.w + 20} ${height + 20}`}
      className={cn("block", className)}
      role="img"
      aria-label="خشبة — KHASHABA"
      fill="currentColor"
    >
      <path d={WORD_BODY} />
      <path d={WORD_BLOCKS} />
      {latin && (
        <g
          className={latinClassName}
          transform={`translate(${cx - latinW / 2 - LATIN_BOX.x0 * latinScale} ${WORD_BOX.y + WORD_BOX.h + 330}) scale(${latinScale})`}
        >
          {LATIN_PATHS.map(([tx, d], i) => (
            <path key={i} transform={`translate(${tx} 0)`} d={d} />
          ))}
        </g>
      )}
    </svg>
  );
}

/** Horizontal lockup used in the header: mark on the right (RTL), word on the left. */
export function Lockup({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <KhMark className="h-full w-auto" />
      <Wordmark className="h-[62%] w-auto" />
    </span>
  );
}
