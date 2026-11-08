"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { buildWhatsAppLink } from "@/lib/contact";
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
    <section id="home" className="bg-walnut-deep text-paper">
      <div className="grid min-h-[100svh] lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-5 pb-8 pt-6 sm:px-10 lg:order-1 lg:px-14 lg:py-28 xl:px-20">
          <motion.p className="flex items-center gap-3 text-sm text-oak-soft" {...rise(0.05)}>
            <span className="h-px w-8 bg-oak-soft/70" />
            ورشة خشبة · القاهرة
          </motion.p>

          <h1 className="mt-5 text-[clamp(2.35rem,4.6vw,4.5rem)] font-extrabold leading-[1.18]">
            <motion.span className="block" {...rise(0.12)}>
              أثاث خشب
            </motion.span>
            <motion.span className="block text-oak-soft" {...rise(0.2)}>
              على مقاس البيت.
            </motion.span>
          </h1>

          <motion.p className="mt-5 max-w-md text-base leading-8 text-paper/75 sm:text-[17px]" {...rise(0.28)}>
            مكتبات، وحدات، وتكسية جدران من خشب طبيعي. بنقيس المكان، ننفّذ في الورشة، ونركّب لحد باب البيت.
          </motion.p>

          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" {...rise(0.36)}>
            <button
              onClick={() => scrollToId("advisor")}
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-oak px-7 text-base font-semibold text-walnut-deep shadow-[0_10px_30px_-12px_rgb(184_135_90/0.9)] transition active:scale-[0.98]"
            >
              <Sparkles className="h-5 w-5" />
              اقترح لي قطعة
              <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
            </button>
            <a
              href={buildWhatsAppLink("السلام عليكم، عايز أبدأ قطعة من خشبة")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-paper/20 px-7 text-base font-semibold transition hover:bg-paper/10 active:scale-[0.98]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              كلّمنا واتساب
            </a>
          </motion.div>

          <motion.dl
            className="mt-7 grid grid-cols-3 gap-4 border-t border-paper/15 pt-5 sm:mt-10 sm:pt-6"
            {...rise(0.46)}
          >
            {FACTS.map((f) => (
              <div key={f.k}>
                <dt className="text-[11px] font-semibold tracking-wide text-oak-soft/80">{f.k}</dt>
                <dd className="mt-1.5 text-sm font-semibold leading-6 text-paper">{f.v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="relative order-1 min-h-[36svh] sm:min-h-[46svh] lg:order-2 lg:min-h-[100svh]">
          <Image
            src="/hero/stage-3.jpg"
            alt="صالة بتكسية خشب ووحدة تلفزيون ومكتبة"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-walnut-deep to-transparent lg:hidden" />
        </div>
      </div>
    </section>
  );
}
