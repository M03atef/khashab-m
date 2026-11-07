"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, X } from "lucide-react";
import { KhMark, Wordmark } from "@/components/brand/logo";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { BRAND } from "@/lib/catalog";
import { buildWhatsAppLink } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { EASE } from "./motion";

export const NAV = [
  { id: "collections", label: "الأقسام" },
  { id: "advisor", label: "اقترح لي" },
  { id: "gallery", label: "المعرض" },
  { id: "story", label: "حكايتنا" },
  { id: "contact", label: "تواصل" },
];

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 250 : 0);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500",
          solid && !open
            ? "bg-paper/85 text-walnut shadow-[0_1px_0_rgb(58_37_22/0.08)] backdrop-blur-xl"
            : "bg-transparent text-paper"
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
          <button
            onClick={() => go("home")}
            className="flex h-10 items-center gap-2.5"
            aria-label="خشبة — الرئيسية"
          >
            <KhMark className="h-9 w-auto" />
            <Wordmark className="h-6 w-auto" />
          </button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="أقسام الموقع">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className="rounded-full px-4 py-2 text-sm font-semibold opacity-80 transition hover:opacity-100 hover:bg-current/10"
              >
                {n.label}
              </button>
            ))}
            <a
              href={buildWhatsAppLink("السلام عليكم، عايز أبدأ قطعة من خشبة")}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "ms-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
                solid ? "bg-walnut text-paper hover:bg-walnut-deep" : "bg-paper text-walnut hover:bg-linen"
              )}
            >
              <WhatsAppIcon className="h-4 w-4" />
              ابدأ قطعتك
            </a>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="relative grid h-11 w-11 place-items-center md:hidden"
            aria-label={open ? "اقفل القائمة" : "افتح القائمة"}
            aria-expanded={open}
          >
            <span className="flex flex-col items-end gap-[5px]">
              <span className="block h-[2px] w-6 rounded bg-current" />
              <span className="block h-[2px] w-4 rounded bg-current" />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-walnut text-paper slats"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
            role="dialog"
            aria-modal="true"
            aria-label="القائمة"
          >
            <div className="flex h-16 items-center justify-between px-5">
              <span className="flex h-10 items-center gap-2.5">
                <KhMark className="h-9 w-auto text-oak" />
                <Wordmark className="h-6 w-auto" />
              </span>
              <button
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center"
                aria-label="اقفل القائمة"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-1 px-7" aria-label="القائمة">
              {[{ id: "home", label: "الرئيسية" }, ...NAV].map((n, i) => (
                <motion.button
                  key={n.id}
                  onClick={() => go(n.id)}
                  className="flex items-baseline gap-4 py-2.5 text-start text-4xl font-extrabold"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: EASE }}
                >
                  <span className="font-serif text-base text-oak-soft/70" dir="ltr">
                    0{i + 1}
                  </span>
                  {n.label}
                </motion.button>
              ))}
            </nav>

            <motion.div
              className="grid grid-cols-2 gap-3 p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
            >
              <a
                href={`tel:${BRAND.phone}`}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-paper/20 font-semibold"
              >
                <Phone className="h-5 w-5" />
                اتصل بينا
              </a>
              <a
                href={buildWhatsAppLink("السلام عليكم، عايز أبدأ قطعة من خشبة")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-oak font-semibold text-walnut-deep"
              >
                <WhatsAppIcon className="h-5 w-5" />
                واتساب
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
