"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/contact";
import { cn } from "@/lib/utils";

const SERVICES = ["وحدة تلفزيون", "مكتبة", "تكسية حائط", "دريسنج / دولاب", "قطعة تفصيل"];
const AREAS = ["القاهرة", "الجيزة", "القاهرة الجديدة", "6 أكتوبر / الشيخ زايد", "مكان تاني"];

export function QuickBrief() {
  const [service, setService] = useState("");
  const [area, setArea] = useState("");

  const href = buildWhatsAppLink(
    [
      "السلام عليكم، عايز أبدأ طلب مع خشبة.",
      `نوع الطلب: ${service || "لسه محتاج مساعدة أختار"}`,
      `المنطقة: ${area || "هقولها في المحادثة"}`,
      "هبعت صورة المكان والمقاسات لو متاحة.",
    ].join("\n"),
  );

  return (
    <section id="brief" className="scroll-mt-16 bg-paper py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-oak">ابدأ من مساحتك</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-walnut sm:text-5xl">
            مش لازم تعرف
            <br />
            <span className="text-oak">تطلب إيه بالظبط.</span>
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-9 text-foreground/75">
            اختار أقرب حاجة في بالك، وابعتلنا صورة المكان. هنساعدك تحدد التصميم والمقاس المناسبين قبل أي التزام.
          </p>
          <ul className="mt-7 space-y-3 text-sm leading-6 text-foreground/75">
            {[
              "اختار نوع القطعة أو قولنا على فكرتك.",
              "ابعت صورة المكان والمقاسات لو متاحة.",
              "نكمل التفاصيل معاك على واتساب.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-oak" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[32px] bg-linen p-5 shadow-[0_22px_70px_-40px_rgb(58_37_22/.5)] sm:p-8">
          <fieldset>
            <legend className="text-base font-bold text-walnut">إيه أقرب طلب ليك؟</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {SERVICES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setService(item)}
                  className={cn(
                    "rounded-full border px-4 py-2.5 text-sm font-semibold transition",
                    service === item ? "border-walnut bg-walnut text-paper" : "border-walnut/15 bg-paper text-walnut hover:border-oak",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="text-base font-bold text-walnut">أنت فين؟</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {AREAS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setArea(item)}
                  className={cn(
                    "rounded-full border px-4 py-2.5 text-sm font-semibold transition",
                    area === item ? "border-oak bg-oak text-walnut-deep" : "border-walnut/15 bg-paper text-walnut hover:border-oak",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-walnut px-6 text-lg font-bold text-paper transition hover:bg-walnut-deep active:scale-[.99]"
          >
            <MessageCircle className="h-5 w-5" />
            ابعت تفاصيل طلبي على واتساب
            <ArrowLeft className="h-5 w-5" />
          </a>
          <p className="mt-3 text-center text-xs leading-6 text-muted-foreground">اختياراتك بتوصل في رسالة واتساب منظمة، عشان نرد عليك أسرع.</p>
        </div>
      </div>
    </section>
  );
}
