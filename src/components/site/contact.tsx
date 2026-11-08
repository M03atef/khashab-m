"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { KhMark, Wordmark } from "@/components/brand/logo";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { BRAND } from "@/lib/catalog";
import { buildWhatsAppLink } from "@/lib/contact";
import { NAV, scrollToId } from "./header";
import { Reveal } from "./motion";

const START = "السلام عليكم، عايز أبدأ قطعة من خشبة";

export function Contact() {
  return (
    <footer id="contact" className="relative scroll-mt-16 overflow-hidden bg-walnut-deep text-paper">
      <div className="mx-auto max-w-6xl px-5 pb-36 pt-20 sm:px-8 md:pb-16 sm:pt-28">
        <Reveal className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <KhMark animate className="h-24 w-auto text-oak" />
            <h2 className="mt-6 text-4xl font-extrabold leading-tight sm:text-6xl">
              جاهز تبدأ
              <br />
              <span className="text-oak-soft">قطعتك؟</span>
            </h2>
            <p className="mt-4 max-w-md leading-8 text-paper/70">
              قولنا محتاج إيه — هنقيس، نصمم، ونصنع، ونركّب لحد باب بيتك.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
            <a
              href={buildWhatsAppLink(START)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-oak px-8 text-lg font-bold text-walnut-deep active:scale-[0.99]"
            >
              <WhatsAppIcon className="h-6 w-6" />
              واتساب
            </a>
            <a
              href={`tel:${BRAND.phone}`}
              className="flex h-16 items-center justify-center gap-2 rounded-2xl border border-paper/20 px-8 text-lg font-semibold active:scale-[0.99]"
            >
              <Phone className="h-5 w-5" />
              <span dir="ltr">{BRAND.phoneDisplay}</span>
            </a>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 border-t border-paper/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Wordmark latin className="h-14 w-auto" latinClassName="opacity-60" />
            <p className="mt-4 text-sm leading-7 text-paper/60">{BRAND.tagline}. مصنوع في مصر، ويتركّب لحد باب البيت.</p>
          </div>
          <ul className="space-y-3 text-sm text-paper/75">
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-oak" />
              {BRAND.address}
            </li>
            <li className="flex gap-3">
              <Clock className="h-5 w-5 shrink-0 text-oak" />
              {BRAND.workingHours}
            </li>
            <li className="flex gap-3">
              <Mail className="h-5 w-5 shrink-0 text-oak" />
              <a href={`mailto:${BRAND.email}`} dir="ltr" className="hover:text-paper">
                {BRAND.email}
              </a>
            </li>
          </ul>
          <ul className="grid grid-cols-2 gap-2 text-sm text-paper/75 sm:block sm:space-y-2">
            {NAV.map((n) => (
              <li key={n.id}>
                <button onClick={() => scrollToId(n.id)} className="hover:text-paper">
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            {[
              { href: BRAND.instagram, label: "إنستجرام", Icon: Instagram },
              { href: BRAND.facebook, label: "فيسبوك", Icon: Facebook },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-12 w-12 place-items-center rounded-full border border-paper/15 transition hover:bg-paper hover:text-walnut"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 text-xs text-paper/45 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} خشبة · KHASHABA</span>
          <span>صُنع بحب في مصر</span>
        </div>
      </div>
    </footer>
  );
}

/** Bottom action bar on phones — shows after the hero, hides near the footer. */
export function MobileDock() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const footer = document.getElementById("contact");
      const nearEnd = footer ? footer.getBoundingClientRect().top < window.innerHeight * 0.8 : false;
      setShow(window.scrollY > window.innerHeight * 0.7 && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          className="fixed inset-x-3 bottom-3 z-40 md:hidden"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex gap-2 rounded-[22px] bg-walnut/95 p-2 text-paper shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => scrollToId("advisor")}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-semibold"
            >
              <Sparkles className="h-5 w-5 text-oak-soft" />
              اقترح لي
            </button>
            <a
              href={`tel:${BRAND.phone}`}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-paper/10"
              aria-label="اتصل بخشبة"
            >
              <Phone className="h-5 w-5" />
            </a>
            <a
              href={buildWhatsAppLink(START)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 flex-[1.3] items-center justify-center gap-2 rounded-2xl bg-oak text-sm font-bold text-walnut-deep"
            >
              <WhatsAppIcon className="h-5 w-5" />
              ابدأ قطعتك
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Desktop floating WhatsApp button. */
export function WhatsAppFab() {
  return (
    <a
      href={buildWhatsAppLink(START)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="كلّم خشبة على واتساب"
      className="fixed bottom-6 left-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-oak text-walnut-deep shadow-xl transition hover:scale-105 md:grid"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
