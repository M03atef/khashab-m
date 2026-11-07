"use client";

import { useRef } from "react";
import { getImageProps } from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { buildWhatsAppLink } from "@/lib/contact";
import { scrollToId } from "./header";
import { EASE } from "./motion";

const LINES = ["نصنع لك الأثاث", "الذي يدوم."];

/** Hero photo: a slatted walnut wall — the same slats as the logo. */
function HeroPicture() {
  const alt = "صالة بتكسية حيطة من شرائح خشب طبيعي";
  const { props } = getImageProps({
    alt,
    src: "/products/wall_cladding/062cea1a34af237dca3b40c6a90b6ec5.jpg",
    width: 1200,
    height: 1800,
    sizes: "100vw",
    quality: 75,
    priority: true,
  });
  return <img {...props} alt={alt} className="absolute inset-0 h-full w-full object-cover object-[50%_35%] md:object-[50%_55%]" />;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-walnut-deep text-paper"
    >
      <motion.div className="absolute inset-0 -z-10" style={{ y: imgY }}>
        <div className="absolute inset-0 animate-ken">
          <HeroPicture />
        </div>
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-walnut-deep via-walnut-deep/55 to-walnut-deep/20" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/45 to-transparent" />

      <motion.div
        style={{ opacity: fade }}
        className="mx-auto w-full max-w-6xl px-5 pb-[calc(env(safe-area-inset-bottom)+7.5rem)] sm:px-8 md:pb-24"
      >
        <motion.p
          className="mb-5 flex items-center gap-3 text-sm text-oak-soft"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
        >
          <span className="h-px w-8 bg-oak-soft/60" />
          ورشة أثاث خشب طبيعي · القاهرة
        </motion.p>

        <h1 className="text-[clamp(2.6rem,11vw,5.6rem)] font-extrabold leading-[1.12]">
          {LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className={"block " + (i === 1 ? "text-oak-soft" : "")}
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 0.35 + i * 0.14, duration: 1, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-5 max-w-md text-base leading-8 text-paper/80 sm:text-lg"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8, ease: EASE }}
        >
          قطع خشب طبيعي بتتعمل بإيد مصرية على مقاس بيتك بالظبط — من الفكرة لحد باب البيت.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
        >
          <button
            onClick={() => scrollToId("advisor")}
            className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-oak px-7 text-base font-semibold text-walnut-deep shadow-[0_10px_30px_-10px_rgb(184_135_90/0.8)] transition active:scale-[0.98]"
          >
            <Sparkles className="h-5 w-5" />
            اقترح لي قطعة
            <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
          </button>
          <a
            href={buildWhatsAppLink("السلام عليكم، عايز أبدأ قطعة من خشبة")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-paper/25 bg-paper/10 px-7 text-base font-semibold backdrop-blur-md transition hover:bg-paper/20 active:scale-[0.98]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            كلّمنا واتساب
          </a>
        </motion.div>
      </motion.div>

      <button
        onClick={() => scrollToId("collections")}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-paper/60 md:flex"
        aria-label="انزل للأقسام"
      >
        <span className="relative h-10 w-px overflow-hidden bg-paper/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-paper animate-scroll-cue" />
        </span>
      </button>
    </section>
  );
}
