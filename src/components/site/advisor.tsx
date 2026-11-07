"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ImagePlus, Lightbulb, MapPin, Ruler, RotateCcw, Sparkles, Wand2, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { KhMark } from "@/components/brand/logo";
import { CATEGORIES } from "@/lib/catalog";
import { buildWhatsAppLink } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { EASE, Eyebrow, Reveal } from "./motion";

type Idea = {
  categoryId: string;
  title: string;
  description: string;
  placement: string;
  size: string;
  materials: string[];
  visual?: string;
};
type Advice = { isSpace: boolean; seen: string; primary: Idea | null; alternatives: Idea[]; tip?: string };
type Photo = { dataUrl: string; blob: Blob; width: number; height: number };
type Render = { status: "loading" | "done" | "error"; src?: string; error?: string };

const RENDERING = ["بنركّب القطعة في صورتك…", "بنظبط المقاس والضل…", "لمسات أخيرة…"];

const NOTE_CHIPS = ["ضيف وحدات هنا", "عايز مكتبة", "مكان للشاشة", "ركن قهوة", "تكسية للحيطة"];
const THINKING = [
  "بنبص على المساحة…",
  "بنقيس الحيطة بعين النجّار…",
  "بنختار الخشب اللي يليق بالمكان…",
  "بنجهّز اقتراحك…",
];

/** Downscale phone photos so the request stays small and fast. */
async function compress(file: File): Promise<Photo> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
  const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/jpeg", 0.82));
  return { dataUrl, blob, width: canvas.width, height: canvas.height };
}

function categoryOf(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export function Advisor() {
  const fileRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [renders, setRenders] = useState<Record<number, Render>>({});
  const runId = useRef(0);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, THINKING.length - 1)), 2600);
    return () => clearInterval(t);
  }, [loading]);

  const pick = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("ارفع صورة بس (JPG أو PNG).");
    setError(null);
    setAdvice(null);
    setRenders({});
    runId.current++;
    try {
      setPhoto(await compress(file));
    } catch {
      setError("ماقدرناش نقرا الصورة — جرّب صورة تانية.");
    }
  };

  const analyze = async () => {
    if (!photo) return fileRef.current?.click();
    setStep(0);
    setLoading(true);
    setError(null);
    setAdvice(null);
    setRenders({});
    const run = ++runId.current;
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: photo.dataUrl, mimeType: "image/jpeg", note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "حصلت مشكلة — جرّب تاني.");
      if (run !== runId.current) return;
      setAdvice(data.advice);
      // Show the suggestion inside the customer's own photo right away.
      if (data.advice?.isSpace && data.advice.primary) visualize(0, data.advice.primary, run);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حصلت مشكلة — جرّب تاني.");
    } finally {
      setLoading(false);
    }
  };

  /** Same photo, same angle — with the suggested piece added. */
  const visualize = async (index: number, idea: Idea, run = runId.current) => {
    if (!photo) return;
    setRenders((r) => ({ ...r, [index]: { status: "loading" } }));
    try {
      const res = await fetch("/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: photo.dataUrl,
          mimeType: "image/jpeg",
          note,
          idea,
          width: photo.width,
          height: photo.height,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (run !== runId.current) return;
      if (!res.ok || !data.image) throw new Error(data.error || "ماقدرناش نرسم القطعة دلوقتي.");
      setRenders((r) => ({ ...r, [index]: { status: "done", src: data.image } }));
    } catch (e) {
      if (run !== runId.current) return;
      setRenders((r) => ({
        ...r,
        [index]: { status: "error", error: e instanceof Error ? e.message : "ماقدرناش نرسم القطعة دلوقتي." },
      }));
    }
  };

  const reset = () => {
    runId.current++;
    setRenders({});
    setPhoto(null);
    setAdvice(null);
    setNote("");
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const brief = () => {
    const lines = ["السلام عليكم، جربت «مستشار خشبة» على الموقع."];
    if (note.trim()) lines.push(`طلبي: ${note.trim()}`);
    if (advice?.primary) lines.push(`الاقتراح اللي عجبني: ${advice.primary.title} (${advice.primary.size})`);
    lines.push("هبعتلكم صورة المكان — عايز أعرف التفاصيل والسعر.");
    return lines.join("\n");
  };

  /** On phones, share the actual photo + brief straight into WhatsApp. */
  const sendToWorkshop = async () => {
    const text = brief();
    const files: File[] = [];
    if (photo) files.push(new File([photo.blob], "my-space.jpg", { type: "image/jpeg" }));
    const rendered = renders[0]?.src;
    if (rendered) {
      try {
        const b = await (await fetch(rendered)).blob();
        files.push(new File([b], "khashaba-idea." + (b.type.split("/")[1] || "png"), { type: b.type || "image/png" }));
      } catch {
        /* skip the render if it can't be attached */
      }
    }
    try {
      if (files.length && navigator.canShare?.({ files })) {
        await navigator.share({ files, text });
        return;
      }
    } catch {
      /* user cancelled or share failed — fall back to the link */
    }
    window.open(buildWhatsAppLink(text), "_blank", "noopener");
  };

  return (
    <section id="advisor" className="relative scroll-mt-16 overflow-hidden bg-walnut py-20 text-paper slats sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow light>مستشار خشبة</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">
            صوّر المكان،
            <br />
            <span className="text-oak-soft">وإحنا نقولك يليق عليه إيه.</span>
          </h2>
          <p className="mt-4 max-w-lg leading-8 text-paper/75">
            ارفع صورة للحيطة أو الركن الفاضي. لو عندك فكرة اكتبها، ولو مش عارف سيبها علينا — هنقترح عليك قطعة أساسية واتنين بدائل تتنفّذ على مقاس المكان.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => pick(e.target.files?.[0])}
            aria-label="ارفع صورة المكان"
          />

          {/* Photo slot */}
          <div className="relative overflow-hidden rounded-[28px] border border-paper/15 bg-walnut-deep/60">
            {photo ? (
              <div className="relative" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
                <img src={photo.dataUrl} alt="صورة المكان بتاعك" className="h-full w-full object-contain" />
                {loading && <ScanOverlay />}
                {!loading && (
                  <button
                    onClick={reset}
                    className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-walnut-deep/70 backdrop-blur"
                    aria-label="شيل الصورة"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-4 p-6 text-center transition hover:bg-paper/5"
              >
                <span className="grid h-20 w-20 place-items-center rounded-full bg-oak text-walnut-deep shadow-[0_10px_40px_-10px_rgb(184_135_90/0.9)]">
                  <Camera className="h-9 w-9" />
                </span>
                <span className="text-xl font-bold">صوّر المكان أو ارفع صورة</span>
                <span className="text-sm text-paper/60">صورة واضحة للحيطة أو الركن من بعيد شوية</span>
              </button>
            )}
          </div>

          {/* Note */}
          <div className="mt-4 rounded-[24px] border border-paper/15 bg-paper/5 p-4">
            <label htmlFor="note" className="text-sm font-semibold text-paper/80">
              عايز حاجة معينة؟ <span className="font-normal text-paper/50">(اختياري)</span>
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 400))}
              rows={2}
              placeholder="مثلًا: ضيف وحدات هنا للكتب والديكور"
              className="mt-2 w-full resize-none bg-transparent text-base leading-7 text-paper placeholder:text-paper/35 focus:outline-none"
            />
            <div className="no-scrollbar -mx-1 mt-1 flex gap-2 overflow-x-auto px-1">
              {NOTE_CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNote(c)}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition",
                    note === c ? "border-oak bg-oak text-walnut-deep" : "border-paper/20 text-paper/75 hover:border-paper/40"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={analyze}
            disabled={loading}
            className="mt-5 flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-oak text-lg font-bold text-walnut-deep transition active:scale-[0.99] disabled:opacity-80"
          >
            {loading ? (
              <AnimatePresence mode="wait">
                <motion.span
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2"
                >
                  <KhMark className="h-6 w-auto animate-pulse" />
                  {THINKING[step]}
                </motion.span>
              </AnimatePresence>
            ) : photo ? (
              <>
                <Sparkles className="h-5 w-5" />
                اقترح لي
              </>
            ) : (
              <>
                <ImagePlus className="h-5 w-5" />
                اختار صورة
              </>
            )}
          </button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 rounded-2xl border border-oak/40 bg-oak/10 p-4 text-sm leading-7"
                role="alert"
              >
                {error}
                {photo && (
                  <button onClick={sendToWorkshop} className="mt-2 flex items-center gap-2 font-semibold text-oak-soft underline-offset-4 hover:underline">
                    <WhatsAppIcon className="h-4 w-4" />
                    ابعت الصورة لخشبة على واتساب
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>

        <div ref={resultRef} className="scroll-mt-20">
          <AnimatePresence>{advice && photo && (
              <Result
                advice={advice}
                photo={photo}
                renders={renders}
                onVisualize={visualize}
                onSend={sendToWorkshop}
                onReset={reset}
              />
            )}</AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ScanOverlay() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-walnut-deep/30" aria-hidden>
      <motion.div
        className="absolute inset-y-0 w-1/3 bg-gradient-to-l from-transparent via-oak-soft/40 to-transparent"
        initial={{ x: "-120%" }}
        animate={{ x: "320%" }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgb(243 237 228/.15) 1px,transparent 1px),linear-gradient(90deg,rgb(243 237 228/.15) 1px,transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  );
}

function Result({
  advice,
  photo,
  renders,
  onVisualize,
  onSend,
  onReset,
}: {
  advice: Advice;
  photo: Photo;
  renders: Record<number, Render>;
  onVisualize: (index: number, idea: Idea) => void;
  onSend: () => void;
  onReset: () => void;
}) {
  if (!advice.isSpace || !advice.primary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-[24px] bg-paper p-6 text-walnut"
      >
        <p className="leading-8">{advice.seen || "محتاجين صورة أوضح للمكان عشان نقترح صح."}</p>
        <button onClick={onReset} className="mt-4 inline-flex items-center gap-2 font-semibold text-oak">
          <RotateCcw className="h-4 w-4" />
          جرّب صورة تانية
        </button>
      </motion.div>
    );
  }
  const ideas = [advice.primary, ...advice.alternatives];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 space-y-5">
      {advice.seen && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: EASE, duration: 0.7 }}
          className="rounded-2xl border border-paper/15 bg-paper/5 p-4 leading-8 text-paper/85"
        >
          <span className="font-semibold text-oak-soft">شفنا في الصورة: </span>
          {advice.seen}
        </motion.p>
      )}

      {ideas.map((idea, i) => (
        <IdeaCard
          key={idea.title + i}
          idea={idea}
          primary={i === 0}
          index={i}
          photo={photo}
          render={renders[i]}
          onVisualize={() => onVisualize(i, idea)}
        />
      ))}

      {advice.tip && (
        <p className="flex gap-3 rounded-2xl bg-oak/15 p-4 text-sm leading-7 text-paper/85">
          <Lightbulb className="mt-1 h-5 w-5 shrink-0 text-oak-soft" />
          {advice.tip}
        </p>
      )}

      <div className="grid gap-3 pt-2 sm:grid-cols-[2fr_1fr]">
        <button
          onClick={onSend}
          className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-paper text-lg font-bold text-walnut active:scale-[0.99]"
        >
          <WhatsAppIcon className="h-6 w-6" />
          ابعت الاقتراح والصورة لخشبة
        </button>
        <button
          onClick={onReset}
          className="flex h-16 items-center justify-center gap-2 rounded-2xl border border-paper/20 font-semibold"
        >
          <RotateCcw className="h-5 w-5" />
          مكان تاني
        </button>
      </div>
      <p className="text-center text-xs text-paper/50">المقاسات تقريبية — بنأكدها بالمعاينة قبل التنفيذ.</p>
    </motion.div>
  );
}

function IdeaCard({
  idea,
  primary,
  index,
  photo,
  render,
  onVisualize,
}: {
  idea: Idea;
  primary: boolean;
  index: number;
  photo: Photo;
  render?: Render;
  onVisualize: () => void;
}) {
  const cat = categoryOf(idea.categoryId);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.15, duration: 0.7, ease: EASE }}
      className={cn("overflow-hidden rounded-[28px] text-walnut", primary ? "bg-paper" : "bg-linen")}
    >
      {render && <InPlace photo={photo} render={render} onRetry={onVisualize} />}

      <div className={cn("flex gap-4 p-5", !primary && "items-start")}>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold text-oak">
            {primary ? "الاقتراح الأساسي" : index === 1 ? "بديل أول" : "بديل تاني"} · {cat?.name ?? "تصميم خاص"}
          </span>
          <h3 className={cn("mt-1 font-extrabold leading-snug", primary ? "text-2xl" : "text-lg")}>{idea.title}</h3>
          <p className="mt-2 text-[15px] leading-7 text-walnut/75">{idea.description}</p>
          {!primary && !render && (
            <button
              onClick={onVisualize}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-walnut px-4 py-2 text-sm font-semibold text-paper active:scale-[0.98]"
            >
              <Wand2 className="h-4 w-4" />
              شوفها في مكانك
            </button>
          )}
          {primary && (
            <>
              <dl className="mt-4 space-y-2 text-sm">
                {idea.placement && (
                  <div className="flex gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-oak" />
                    <dd className="leading-6">{idea.placement}</dd>
                  </div>
                )}
                {idea.size && (
                  <div className="flex gap-2">
                    <Ruler className="mt-0.5 h-4 w-4 shrink-0 text-oak" />
                    <dd className="leading-6">{idea.size}</dd>
                  </div>
                )}
              </dl>
              {idea.materials.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {idea.materials.map((m) => (
                    <span key={m} className="rounded-full bg-linen px-3 py-1 text-xs font-semibold">
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/** The customer's own photo with the piece added, plus a before/after slider. */
function InPlace({ photo, render, onRetry }: { photo: Photo; render: Render; onRetry: () => void }) {
  const [pos, setPos] = useState(100);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (render.status !== "loading") return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, RENDERING.length - 1)), 6000);
    return () => {
      clearInterval(t);
      setStep(0);
    };
  }, [render.status]);

  return (
    <div className="p-2">
      <div
        dir="ltr"
        className="relative w-full overflow-hidden rounded-[22px] bg-walnut-deep"
        style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
      >
        {render.status === "done" && render.src ? (
          <>
            {/* after */}
            <img src={render.src} alt="القطعة المقترحة في مكانك" className="absolute inset-0 h-full w-full object-cover" />
            {/* before, revealed from the right as the handle moves */}
            <img
              src={photo.dataUrl}
              alt="صورتك قبل"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            />
            <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-paper/90" style={{ left: `${pos}%` }} />
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-walnut-deep/70 px-3 py-1 text-xs font-semibold text-paper backdrop-blur">
              بعد
            </span>
            {pos < 100 && (
              <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-walnut-deep/70 px-3 py-1 text-xs font-semibold text-paper backdrop-blur">
                قبل
              </span>
            )}
            <input
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="قارن قبل وبعد"
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </>
        ) : (
          <>
            <img src={photo.dataUrl} alt="صورتك" className="absolute inset-0 h-full w-full object-cover opacity-70" />
            {render.status === "loading" ? (
              <>
                <ScanOverlay />
                <span className="absolute inset-x-0 bottom-4 mx-auto w-fit rounded-full bg-walnut-deep/80 px-4 py-2 text-sm font-semibold text-paper backdrop-blur">
                  {RENDERING[step]}
                </span>
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-walnut-deep/60 p-6 text-center text-paper" dir="rtl">
                <div>
                  <p className="text-sm leading-7">{render.error}</p>
                  <button onClick={onRetry} className="mt-3 inline-flex items-center gap-2 rounded-full bg-oak px-4 py-2 text-sm font-bold text-walnut-deep">
                    <RotateCcw className="h-4 w-4" />
                    جرّب تاني
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {render.status === "done" && (
        <div className="mt-2 flex items-center justify-between px-2 text-xs text-walnut/60">
          <span>اسحب على الصورة عشان تقارن قبل وبعد</span>
          <button onClick={() => setPos((p) => (p === 100 ? 50 : 100))} className="font-semibold text-oak">
            {pos === 100 ? "قارن" : "بعد بس"}
          </button>
        </div>
      )}
    </div>
  );
}
