"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { CATEGORIES } from "@/lib/catalog";
import { buildWhatsAppLink } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { EASE, Eyebrow, Reveal } from "./motion";

type Shot = { src: string; categoryId: string; category: string };

const ALL: Shot[] = CATEGORIES.flatMap((c) => c.images.map((src) => ({ src, categoryId: c.id, category: c.name })));

export function Gallery({ filter, setFilter }: { filter: string; setFilter: (id: string) => void }) {
  const shots = useMemo(() => (filter === "all" ? ALL : ALL.filter((s) => s.categoryId === filter)), [filter]);
  // "show more" count, reset whenever the filter changes
  const [more, setMore] = useState({ filter, n: 12 });
  const limit = more.filter === filter ? more.n : 12;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="gallery" className="scroll-mt-16 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>المعرض</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-walnut sm:text-5xl">
            أفكار نقدر
            <br />
            ننفذهالك
          </h2>
        </Reveal>
      </div>

      <div className="sticky top-16 z-30 mt-8 bg-paper/90 py-3 backdrop-blur-xl sm:top-20">
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 sm:px-8">
          {[{ id: "all", name: "الكل" }, ...CATEGORIES].map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                filter === c.id ? "bg-walnut text-paper" : "bg-linen text-walnut/80 hover:bg-sand"
              )}
              aria-pressed={filter === c.id}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-6xl px-3 sm:px-8">
        <motion.div layout className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          <AnimatePresence mode="popLayout">
            {shots.slice(0, limit).map((s, i) => (
              <motion.button
                layout
                key={s.src}
                onClick={() => setOpen(i)}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-sand"
              >
                <Image
                  src={s.src}
                  alt={`${s.category} — من معرض خشبة`}
                  width={600}
                  height={800}
                  sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                  className="h-auto w-full transition duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-x-2 bottom-2 rounded-full bg-paper/85 px-3 py-1 text-start text-xs font-semibold text-walnut opacity-0 backdrop-blur transition group-hover:opacity-100">
                  {s.category}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {limit < shots.length && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setMore({ filter, n: limit + 12 })}
              className="h-12 rounded-full border border-walnut/15 px-8 font-semibold text-walnut transition hover:bg-linen"
            >
              صور أكتر ({shots.length - limit})
            </button>
          </div>
        )}
      </div>

      <Lightbox shots={shots} index={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function Lightbox({ shots, index, onClose }: { shots: Shot[]; index: number | null; onClose: () => void }) {
  const [emblaRef, embla] = useEmblaCarousel({ direction: "rtl", startIndex: index ?? 0 });
  const [current, setCurrent] = useState(index ?? 0);
  const onSelect = useCallback(() => embla && setCurrent(embla.selectedScrollSnap()), [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect).on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect).off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  useEffect(() => {
    if (index === null) return;
    embla?.reInit({ direction: "rtl", startIndex: index });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") embla?.scrollNext();
      if (e.key === "ArrowRight") embla?.scrollPrev();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [index, embla, onClose]);

  const shot = shots[current];

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col bg-walnut-deep text-paper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="عرض الصور"
          style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <span className="font-serif text-lg" dir="ltr">
              {current + 1} / {shots.length}
            </span>
            <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-paper/10" aria-label="اقفل">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden" ref={emblaRef} dir="rtl">
            <div className="flex h-full">
              {shots.map((s) => (
                <div key={s.src} className="relative h-full min-w-0 flex-[0_0_100%]">
                  <Image src={s.src} alt={s.category} fill sizes="100vw" className="object-contain" />
                </div>
              ))}
            </div>
          </div>
          {shot && (
            <div className="flex items-center justify-between gap-3 p-4">
              <span className="font-semibold">{shot.category}</span>
              <a
                href={buildWhatsAppLink(`السلام عليكم، عايز حاجة زي دي من ${shot.category}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-oak px-5 font-semibold text-walnut-deep"
              >
                <WhatsAppIcon className="h-5 w-5" />
                عايز زيها
              </a>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
