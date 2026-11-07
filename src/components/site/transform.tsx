"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { scrollToId } from "./header";

/**
 * «من حيطة لحكاية» — a pinned, scroll-driven demo of the advisor:
 * a real customer wall gets clad slat by slat as you scroll, then the
 * advisor's actual render fades in. Ends with "try it on your space".
 */

// Where the back wall sits inside the 16:9 photo (percent of the frame).
const WALL = { left: 8.2, right: 88.3, top: 8, bottom: 90 };
const SLATS = 22;

/** 0→1 between a and b, clamped. (Function transforms avoid keyframe-range quirks.) */
const ramp = (v: number, a: number, b: number) => Math.max(0, Math.min(1, (v - a) / (b - a)));

const STEPS = [
  { n: "١", title: "صوّر المكان", body: "حيطة بلاطات صوت باهتة… زي ما هي." },
  { n: "٢", title: "المستشار يقرر", body: "شاف إن الحيطة نفسها هي المشكلة — فاقترح تكسية شرائح بإضاءة مخفية." },
  { n: "٣", title: "شوفها في مكانك", body: "نفس الصورة، نفس الزاوية — والقطعة متركّبة." },
];

function Slat({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const start = 0.28 + (i / SLATS) * 0.26;
  const scaleY = useTransform(progress, (v) => ramp(v, start, start + 0.08));
  const w = (WALL.right - WALL.left) / SLATS;
  return (
    <motion.span
      className="absolute origin-bottom rounded-[2px]"
      style={{
        scaleY,
        left: `${WALL.left + i * w + w * 0.06}%`,
        width: `${w * 0.88}%`,
        top: `${WALL.top}%`,
        bottom: `${100 - WALL.bottom}%`,
        background:
          i % 3 === 0
            ? "linear-gradient(180deg,#a7744a,#8a5a36 55%,#7a4e2e)"
            : i % 3 === 1
              ? "linear-gradient(180deg,#b9875b,#9a6a42 60%,#85593a)"
              : "linear-gradient(180deg,#ad7c50,#916140 50%,#7f5333)",
        boxShadow: "inset -2px 0 0 rgb(0 0 0/.18), 0 0 14px rgb(255 190 120/.25)",
      }}
    />
  );
}

function Step({ i, progress, children }: { i: number; progress: MotionValue<number>; children?: React.ReactNode }) {
  // Each caption owns a window of the scroll; fades in/out at its edges.
  const win: [number, number][] = [
    [-1, 0.25],
    [0.27, 0.6],
    [0.62, 2],
  ];
  const [from, to] = win[i];
  const vis = (v: number) => Math.max(0, Math.min(1, (v - from) / 0.04, (to - v) / 0.04));
  const opacity = useTransform(progress, vis);
  const y = useTransform(progress, (v) => (v < from + 0.04 ? 20 : v > to - 0.04 ? -20 : 0) * (1 - vis(v)));
  const s = STEPS[i];
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-5xl font-semibold leading-none text-oak-soft sm:text-6xl">{s.n}</span>
        <h3 className="text-2xl font-extrabold sm:text-4xl">{s.title}</h3>
      </div>
      <p className="mt-3 max-w-md text-[15px] leading-7 text-paper/75 sm:text-base">{s.body}</p>
      {children}
    </motion.div>
  );
}

export function Transform() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const after = useTransform(scrollYProgress, (v) => ramp(v, 0.6, 0.7));
  const slats = useTransform(scrollYProgress, (v) => 1 - ramp(v, 0.62, 0.72));
  const zoom = useTransform(scrollYProgress, (v) => 1.08 - 0.08 * ramp(v, 0, 1));
  const bar = useTransform(scrollYProgress, (v) => `${ramp(v, 0, 1) * 100}%`);
  const cta = useTransform(scrollYProgress, (v) => ramp(v, 0.74, 0.84));
  const ctaY = useTransform(scrollYProgress, (v) => 20 * (1 - ramp(v, 0.74, 0.84)));

  if (reduce) {
    return (
      <section className="bg-walnut-deep px-5 py-20 text-paper sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
          <img src="/showcase/wall-before.jpg" alt="الحيطة قبل" className="rounded-3xl" />
          <img src="/showcase/wall-after.jpg" alt="نفس الحيطة بعد تكسية خشب" className="rounded-3xl" />
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="من حيطة لحكاية" className="relative h-[340vh] bg-walnut-deep text-paper">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* Frame — keeps the photo at 16:9 so the slats stay on the wall at every screen size */}
        <div className="relative mt-16 h-[50vh] shrink-0 overflow-hidden sm:mt-20 sm:h-auto sm:flex-1">
          <motion.div
            className="absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2 overflow-hidden sm:h-auto sm:max-h-full sm:w-[min(92vw,1100px)] sm:rounded-[28px]"
            style={{ aspectRatio: "16 / 9", scale: zoom }}
          >
            <img src="/showcase/wall-before.jpg" alt="حيطة عميل قبل التنفيذ" className="absolute inset-0 h-full w-full object-cover" />
            <motion.div className="absolute inset-0" style={{ opacity: slats }} aria-hidden>
              {Array.from({ length: SLATS }, (_, i) => (
                <Slat key={i} i={i} progress={scrollYProgress} />
              ))}
            </motion.div>
            <motion.img
              src="/showcase/wall-after.jpg"
              alt="نفس الحيطة بتكسية شرائح خشب — من رسم مستشار خشبة"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: after }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-walnut-deep via-transparent to-transparent sm:from-walnut-deep/70" />
          </motion.div>
        </div>

        {/* Story captions */}
        <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pt-5 pb-[calc(env(safe-area-inset-bottom)+6rem)] sm:flex-none sm:px-8 md:pb-14">
          <div className="relative h-48 sm:h-44">
            {STEPS.map((_, i) => (
              <Step key={i} i={i} progress={scrollYProgress}>
                {i === 2 && (
              <motion.button
                style={{ opacity: cta, y: ctaY }}
                onClick={() => scrollToId("advisor")}
                className="group mt-4 inline-flex h-14 items-center gap-2 rounded-2xl bg-oak px-6 font-bold text-walnut-deep shadow-[0_10px_30px_-10px_rgb(184_135_90/0.8)] active:scale-[0.98]"
              >
                <Sparkles className="h-5 w-5" />
                جرّب على مكانك
                <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
              </motion.button>
                )}
              </Step>
            ))}
          </div>
          <div className="absolute inset-x-5 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] h-[3px] overflow-hidden rounded-full bg-paper/10 sm:inset-x-8 md:bottom-8">
            <motion.div className="h-full bg-oak-soft" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}
