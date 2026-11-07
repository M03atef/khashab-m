"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { Hammer, Ruler, ShieldCheck, TreePine } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";
import { Eyebrow, Reveal } from "./motion";

function Count({ to, prefix = "+" }: { to: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {v}
    </span>
  );
}

const VALUES = [
  { icon: TreePine, title: "خامات أصلية", desc: "خشب طبيعي مختار: زان، جوز، بلط، ورماد." },
  { icon: Hammer, title: "صناعة يدوية", desc: "كل قطعة بتعدّي على إيد نجّار مصري فاهم." },
  { icon: Ruler, title: "على مقاسك", desc: "بنقيس عندك ونفصّل القطعة على المكان بالسنتي." },
  { icon: ShieldCheck, title: "ضمان الجودة", desc: "تشطيب يتحمّل الاستخدام اليومي ويعيش سنين." },
];

const WOODS = [
  { name: "زان", en: "Beech", color: "#D8B48A" },
  { name: "رماد", en: "Ash", color: "#CDB797" },
  { name: "بلط", en: "Oak", color: "#B07A4A" },
  { name: "جوز", en: "Walnut", color: "#5A3A24" },
];

export function Story() {
  return (
    <section id="story" className="scroll-mt-16 bg-linen py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px]">
            <Image
              src="/products/bookcases/bceec4e9134a3a849fd7e8400ad73f7e.jpg"
              alt="مكتبة خشب بإضاءة دافية من شغل خشبة"
              fill
              sizes="(min-width:1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-4 rounded-3xl bg-walnut p-5 text-paper shadow-2xl sm:left-8">
            <div className="text-4xl font-extrabold text-oak-soft">
              <Count to={100} />
            </div>
            <div className="mt-1 text-sm text-paper/75">قطعة اتنفذت لحد دلوقتي</div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>حكايتنا</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-walnut sm:text-5xl">
              من الورشة
              <br />
              لحد باب بيتك
            </h2>
            <p className="mt-5 text-[17px] leading-9 text-foreground/75">
              بنختار الخشب بإيدينا، ونشتغله بإيد صنايعية مصريين فاهمين. عشان القطعة اللي تدخل بيتك متبقاش مجرد أثاث — تبقى حاجة تعيش معاك سنين وتحلو مع الوقت.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-3 gap-3 border-y border-walnut/10 py-6 text-center">
            <div>
              <div className="text-3xl font-extrabold text-walnut">
                <Count to={5} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">سنين خبرة</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-walnut">
                <Count to={CATEGORIES.length} prefix="" />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">أقسام أثاث</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-walnut">
                <Count to={100} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">منتج منفّذ</div>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={0.05 * i} className="rounded-3xl bg-paper p-5">
                <v.icon className="h-6 w-6 text-oak" strokeWidth={1.6} />
                <h3 className="mt-3 font-bold text-walnut">{v.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h3 className="text-xl font-extrabold text-walnut">الخشب اللي بنشتغل بيه</h3>
        </Reveal>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {WOODS.map((w, i) => (
            <Reveal key={w.name} delay={0.06 * i} className="overflow-hidden rounded-3xl bg-paper">
              <div
                className="h-24"
                style={{
                  backgroundColor: w.color,
                  backgroundImage:
                    "repeating-linear-gradient(100deg, rgb(0 0 0/.07) 0 2px, transparent 2px 11px), repeating-linear-gradient(97deg, rgb(255 255 255/.06) 0 1px, transparent 1px 7px)",
                }}
              />
              <div className="flex items-baseline justify-between p-4">
                <span className="text-lg font-bold text-walnut">{w.name}</span>
                <span className="font-serif text-base italic text-muted-foreground">{w.en}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
