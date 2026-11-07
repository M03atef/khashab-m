"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, Images } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { CATEGORIES, type Category } from "@/lib/catalog";
import { buildWhatsAppLink } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { Eyebrow, Reveal } from "./motion";

const WORDS = ["زان", "جوز", "بلط", "رماد", "صناعة يدوية", "حسب المقاس", "تشطيب يدوم", "من الورشة لبيتك"];

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="relative overflow-hidden border-y border-walnut/10 bg-linen py-4" aria-hidden>
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-8 text-lg font-semibold text-walnut/80">
            {w}
            <span className="block h-2 w-2 rounded-[2px] bg-oak" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Collections({ onOpenGallery }: { onOpenGallery: (categoryId: string) => void }) {
  const [active, setActive] = useState<Category | null>(null);

  return (
    <section id="collections" className="scroll-mt-16 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>الأقسام</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-walnut sm:text-5xl">
              كل قطعة
              <br />
              بتتعمل على مقاسك
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm leading-7 text-muted-foreground md:block">
            {CATEGORIES.length} أقسام من الخشب الطبيعي — اختار اللي يناسبك وإحنا نظبطه على مساحتك.
          </p>
        </Reveal>
      </div>

      {/* Phone: swipeable row. Desktop: grid. */}
      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 md:mx-auto md:grid md:max-w-6xl md:grid-cols-3 md:gap-6 md:overflow-visible md:px-8 lg:grid-cols-4">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.id} delay={Math.min(i, 4) * 0.06} className="shrink-0 snap-start">
            <button
              onClick={() => setActive(c)}
              className="group relative block aspect-[3/4] w-[72vw] max-w-[300px] overflow-hidden rounded-3xl bg-sand text-start md:w-full md:max-w-none"
            >
              <Image
                src={c.images[0]}
                alt={c.name}
                fill
                sizes="(min-width: 768px) 300px, 72vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-walnut-deep/90 via-walnut-deep/10 to-transparent" />
              <span className="absolute right-4 top-4 rounded-full bg-paper/90 px-3 py-1 font-serif text-sm text-walnut" dir="ltr">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute inset-x-0 bottom-0 p-5 text-paper">
                <span className="block text-2xl font-extrabold">{c.name}</span>
                <span className="mt-1.5 block text-sm leading-6 text-paper/75">{c.short}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-oak-soft">
                  شوف الشغل
                  <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                </span>
              </span>
            </button>
          </Reveal>
        ))}
        <span className="w-1 shrink-0 md:hidden" aria-hidden />
      </div>

      <CategoryDrawer
        category={active}
        onClose={() => setActive(null)}
        onOpenGallery={(id) => {
          setActive(null);
          onOpenGallery(id);
        }}
      />
    </section>
  );
}

function CategoryDrawer({
  category,
  onClose,
  onOpenGallery,
}: {
  category: Category | null;
  onClose: () => void;
  onOpenGallery: (id: string) => void;
}) {
  const [emblaRef, embla] = useEmblaCarousel({ direction: "rtl", align: "center", loop: false });
  const [index, setIndex] = useState(0);
  const onSelect = useCallback(() => embla && setIndex(embla.selectedScrollSnap()), [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect).on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect).off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  useEffect(() => {
    embla?.reInit();
    embla?.scrollTo(0, true);
  }, [category, embla]);

  return (
    <Drawer open={!!category} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[92svh] rounded-t-[28px] border-none bg-paper">
        {category && (
          <div className="overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+1rem)]">
            <div className="mt-2 overflow-hidden" ref={emblaRef} dir="rtl">
              <div className="flex">
                {category.images.map((src, i) => (
                  <div key={src} className="min-w-0 flex-[0_0_84%] ps-3 first:ps-5 sm:flex-[0_0_46%]">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
                      <Image
                        src={src}
                        alt={`${category.name} — صورة ${i + 1}`}
                        fill
                        sizes="(min-width: 640px) 46vw, 84vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
                <div className="w-5 shrink-0" />
              </div>
            </div>
            <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
              {category.images.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-6 bg-walnut" : "w-1.5 bg-walnut/20"
                  )}
                />
              ))}
            </div>

            <div className="px-5 pt-6">
              <DrawerTitle className="text-3xl font-extrabold text-walnut">{category.name}</DrawerTitle>
              <p className="mt-1 font-serif text-lg italic text-oak">{category.nameEn}</p>
              <DrawerDescription className="mt-4 text-[15px] leading-8 text-foreground/75">
                {category.description}
              </DrawerDescription>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a
                  href={buildWhatsAppLink(`السلام عليكم، عايز أستفسر عن ${category.name} من خشبة`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-walnut font-semibold text-paper active:scale-[0.98]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  اطلب {category.name}
                </a>
                <button
                  onClick={() => onOpenGallery(category.id)}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-walnut/15 font-semibold text-walnut active:scale-[0.98]"
                >
                  <Images className="h-5 w-5" />
                  كل صور القسم في المعرض
                </button>
              </div>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
