"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/catalog";
import { buildWhatsAppLink } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

type Suggestion = {
  title: string;
  description: string;
  styleNotes: string[];
  previewImage: string;
  mockupImage?: string;
  categoryId: string;
  categoryName: string;
  mode: "max-creativity" | "guided";
  mock: boolean;
};

/** Downscale large room photos so /api/suggest stays fast on mobile. */
async function compressImageFile(file: File): Promise<{
  dataUrl: string;
  mimeType: string;
}> {
  const bitmap = await createImageBitmap(file);
  const maxSide = 1280;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    return { dataUrl, mimeType: file.type || "image/jpeg" };
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const mimeType = "image/jpeg";
  const dataUrl = canvas.toDataURL(mimeType, 0.82);
  return { dataUrl, mimeType };
}

export function SuggestSection() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [style, setStyle] = useState<string>("modern");
  const [colorPalette, setColorPalette] = useState<string>("warm");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);

  const active = suggestions[activeIndex] ?? null;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health")
      .then((r) => r.json())
      .then((data: { aiConfigured?: boolean }) => {
        if (!cancelled) setAiConfigured(Boolean(data.aiConfigured));
      })
      .catch(() => {
        if (!cancelled) setAiConfigured(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onFile = async (file: File | null) => {
    if (!file) {
      setPreview(null);
      setMimeType(undefined);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("ارفع صورة فقط (JPG أو PNG).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("حجم الصورة كبير — جرّب أقل من 8MB.");
      return;
    }
    setError(null);
    try {
      const { dataUrl, mimeType: outMime } = await compressImageFile(file);
      setMimeType(outMime);
      setPreview(dataUrl);
    } catch {
      setError("ما قدرناش نقرأ الصورة — جرّب ملف تاني.");
    }
  };

  const requestSuggestion = async (asNewVariation: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const variation = asNewVariation ? suggestions.length : 0;
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          caption,
          categoryId: categoryId || undefined,
          imageBase64: preview ?? undefined,
          mimeType,
          variation,
          style,
          colorPalette,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل الاقتراح");
      }
      setAiConfigured(
        Boolean(data.aiConfigured ?? data.geminiConfigured)
      );
      const next = data.suggestion as Suggestion;
      if (asNewVariation && suggestions.length > 0) {
        setSuggestions((prev) => [...prev, next].slice(0, 3));
        setActiveIndex(Math.min(suggestions.length, 2));
      } else {
        setSuggestions([next]);
        setActiveIndex(0);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "حصل خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const whatsappForActive = active
    ? buildWhatsAppLink(
        `السلام عليكم، عجبني اقتراح «${active.title}» من موقع خشبة وعايز أتكلم في التفاصيل`
      )
    : buildWhatsAppLink();

  return (
    <section
      id="suggest"
      className="py-16 sm:py-24 border-b border-border/60 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.12]">
        <Image
          src="/assets/bookshelf-nook.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 border border-accent/30 px-4 py-1.5 text-sm font-semibold text-accent-foreground mb-4">
            <Wand2 className="w-4 h-4 text-accent" />
            اقترح لي قطعتك
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-4">
            خلّي الـ <span className="text-accent">AI</span> يفكر معاك
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            ارفع صورة للمساحة (اختياري)، واكتب توجيه أو سيبه فاضي
            لإبداع حر. هتوصلك لحد 3 اقتراحات مختلفة.
          </p>
          {aiConfigured === false && (
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground bg-secondary/80 border border-border rounded-lg px-3 py-2 inline-block">
              الوضع التجريبي نشط — اقتراحات غنية من معرض خشبة. لتفعيل الـ AI
              الحي أضف مفتاح AI في ملف البيئة ثم أعد تشغيل السيرفر.
            </p>
          )}
          {aiConfigured === true && (
            <p className="mt-3 text-xs sm:text-sm text-accent-foreground/90 bg-accent/10 border border-accent/30 rounded-lg px-3 py-2 inline-block">
              الـ AI الحي مفعّل — الاقتراحات بتطلع من النموذج مباشرة.
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-10 items-start max-w-6xl mx-auto">
          <div className="space-y-4 bg-card/70 backdrop-blur-sm border border-border/70 rounded-2xl p-4 sm:p-6">

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-primary">
                توجيهك (اختياري)
              </span>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="مثال: رفوف معلقة فوق الكنبة بألوان خشب فاتح… أو سيبه فاضي لإبداع حر"
                className="min-h-24 resize-y"
                maxLength={500}
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-primary">
                صورة المساحة (اختياري)
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border border-dashed border-border hover:border-accent/50 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors bg-background/60"
              >
                {preview ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="معاينة المساحة"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <>
                    <ImagePlus className="w-8 h-8 text-accent" />
                    <span className="text-sm text-muted-foreground">
                      اضغط لرفع صورة الغرفة أو الحائط
                    </span>
                  </>
                )}
              </button>
              {preview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                >
                  إزالة الصورة
                </Button>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <Button
                className="gap-2 flex-1"
                disabled={loading}
                onClick={() => requestSuggestion(false)}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                اقترح لي قطعة
              </Button>
              <Button
                variant="outline"
                className="gap-2 flex-1"
                disabled={loading || suggestions.length === 0 || suggestions.length >= 3}
                onClick={() => requestSuggestion(true)}
              >
                اقتراح تاني مختلف
              </Button>
            </div>
          </div>

          <div className="bg-card/70 backdrop-blur-sm border border-border/70 rounded-2xl p-4 sm:p-6 min-h-[320px] flex flex-col">
            {!active && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-muted-foreground py-10">
                <Wand2 className="w-10 h-10 text-accent/70" />
                <p className="text-sm sm:text-base max-w-sm">
                  النتيجة هتظهر هنا: وصف الاقتراح + صورة مرجعية من أسلوب خشبة.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <p className="text-sm text-muted-foreground">بيفكر في قطعتك…</p>
              </div>
            )}

            {active && !loading && (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className={active.mockupImage ? "grid grid-cols-2 gap-3" : ""}>
                  {active.mockupImage && (
                    <div>
                      <span className="text-xs font-bold bg-background/95 text-muted-foreground px-2 py-1 rounded-full mb-2 inline-block">قبل</span>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview || ""} alt="المساحة الأصلية" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                  <div>
                    {active.mockupImage && (
                      <span className="text-xs font-bold bg-accent text-accent-foreground px-2 py-1 rounded-full mb-2 inline-block">بعد ✨</span>
                    )}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary">
                      <Image
                        src={active.mockupImage || active.previewImage}
                        alt={active.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-extrabold text-primary">
                      {active.title}
                    </h3>
                    <span
                      className={cn(
                        "text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full border",
                        active.mock
                          ? "bg-secondary text-muted-foreground border-border"
                          : "bg-accent/15 text-accent-foreground border-accent/30"
                      )}
                    >
                      {active.mock ? "تجريبي" : "AI"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {active.description}
                  </p>
                  <ul className="flex flex-wrap gap-2 pt-1">
                    {active.styleNotes.map((note) => (
                      <li
                        key={note}
                        className="text-xs bg-secondary/80 border border-border px-2.5 py-1 rounded-md text-foreground/80"
                      >
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>

                {suggestions.length > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={activeIndex === 0}
                      onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                      aria-label="السابق"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <div className="flex gap-1.5">
                      {suggestions.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          aria-label={`الاقتراح ${i + 1}`}
                          onClick={() => setActiveIndex(i)}
                          className={cn(
                            "w-2.5 h-2.5 rounded-full transition-colors",
                            i === activeIndex ? "bg-accent" : "bg-border"
                          )}
                        />
                      ))}
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={activeIndex >= suggestions.length - 1}
                      onClick={() =>
                        setActiveIndex((i) =>
                          Math.min(suggestions.length - 1, i + 1)
                        )
                      }
                      aria-label="التالي"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <a
                  href={whatsappForActive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block pt-1"
                >
                  <Button className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#1ebe57]">
                    <WhatsAppIcon className="w-4 h-4" />
                    كمل الطلب على واتساب
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
