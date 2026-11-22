"use client";

import { ArrowLeft, Camera, ClipboardCheck, Hammer } from "lucide-react";
import { scrollToId } from "./header";

const STEPS = [
  { icon: Camera, number: "01", title: "صوّر المكان", body: "ابعت صورة للحيطة أو الركن الفاضي، حتى لو لسه مش عارف عايز إيه." },
  { icon: ClipboardCheck, number: "02", title: "نرتب الفكرة", body: "نساعدك تختار التصميم والمقاس المناسبين لمساحتك." },
  { icon: Hammer, number: "03", title: "ننفّذ ونركّب", body: "بعد الاتفاق على التفاصيل، القطعة تتعمل في الورشة وتوصل لبيتك." },
];

export function Journey() {
  return (
    <section className="relative overflow-hidden bg-walnut-deep py-14 text-paper sm:py-20">
      <div className="absolute inset-0 slats opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 border-b border-paper/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-oak-soft">من فكرة لقطعة في بيتك</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">3 خطوات، من غير لَف كتير.</h2>
          </div>
          <button
            onClick={() => scrollToId("brief")}
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-oak-soft hover:text-paper"
          >
            ابدأ بطلبك
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.number} className="group rounded-3xl border border-paper/10 bg-paper/[.045] p-5 transition hover:bg-paper/[.08] sm:p-6">
              <div className="flex items-start justify-between">
                <step.icon className="h-6 w-6 text-oak-soft" strokeWidth={1.6} />
                <span className="font-serif text-lg text-paper/40" dir="ltr">{step.number}</span>
              </div>
              <h3 className="mt-8 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-7 text-paper/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
