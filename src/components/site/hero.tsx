"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { scrollToId } from "./header";
import { EASE } from "./motion";

const FACTS = [
  { k: "الخامة", v: "زان وجوز" },
  { k: "التنفيذ", v: "على المقاس" },
  { k: "التسليم", v: "في البيت" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.7, ease: EASE },
        };

  return (
    <section id="home" className="relative isolate min-h-[100svh] overflow-hidden bg-walnut-deep text-paper">
      <Image
        src="/hero/stage-3.jpg"
        alt="صالة بتكسية خشب ووحدة تلفزيون ومكتبة من شغل خشبة"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[42%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(22_13_7/.12)_0%,rgb(22_13_7/.25)_35%,rgb(22_13_7/.92)_72%,rgb(22_13_7/.98)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-walnut-deep via-walnut-deep/45 to-transparent" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl items-end px-5 pb-8 pt-28 sm:px-8 sm:pb-12 lg:items-center lg:pb-0">
        <div className="max-w-xl lg:ms-auto lg:w-[48%] lg:pb-4">
          <motion.p className="flex items-center gap-3 text-sm font-semibold text-oak-soft" {...rise(0.05)}>
            <span className="h-px w-8 bg-oak-soft/70" />
            ورشة خشبة · القاهرة
          </motion.p>

          <h1 className="mt-5 text-[clamp(3rem,6vw,6.2rem)] font-extrabold leading-[.98] tracking-[-.045em]">
            <motion.span className="block" {...rise(0.12)}>
              خشب يتفصّل
            </motion.span>
            <motion.span className="block text-oak-soft" {...rise(0.2)}>
              لحياتك.
            </motion.span>
          </h1>

          <motion.p className="mt-6 max-w-lg text-base leading-8 text-paper/80 sm:text-lg" {...rise(0.28)}>
            ابعت صورة مساحتك، ونساعدك تختار قطعة عملية وتليق ببيتك — من الفكرة لحد التركيب.
          </motion.p>

          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" {...rise(0.36)}>
            <button
              onClick={() => scrollToId("brief")}
              className="group inline-flex h-15 min-h-14 items-center justify-center gap-2 rounded-full bg-oak px-7 text-base font-bold text-walnut-deep shadow-[0_18px_45px_-20px_rgb(0_0_0/.9)] transition hover:bg-oak-soft active:scale-[0.98]"
            >
              <Sparkles className="h-5 w-5" />
              ابدأ من صورة المكان
              <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
            </button>
            <button
              onClick={() => scrollToId("advisor")}
              className="inline-flex h-15 min-h-14 items-center justify-center gap-2 rounded-full border border-paper/25 bg-black/10 px-6 text-base font-semibold backdrop-blur-sm transition hover:bg-paper/10 active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" />
              ساعدني أختار
            </button>
          </motion.div>

          <motion.dl className="mt-9 grid grid-cols-3 gap-2 border-t border-paper/15 pt-5" {...rise(0.46)}>
            {FACTS.map((f) => (
              <div key={f.k} className="border-s border-paper/15 ps-3 first:border-s-0 first:ps-0">
                <dt className="text-[11px] font-semibold text-oak-soft/80">{f.k}</dt>
                <dd className="mt-1 text-sm font-bold leading-6 text-paper">{f.v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
