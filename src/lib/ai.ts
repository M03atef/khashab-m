import { CATEGORIES } from "@/lib/catalog";

/**
 * «مستشار خشبة» — looks at a photo of the customer's space and proposes
 * one main Khashaba piece plus two alternatives.
 *
 * Provider-agnostic: uses GEMINI_API_KEY (free tier) when present,
 * otherwise ANTHROPIC_API_KEY. Plain fetch, no SDKs.
 */

export type Idea = {
  categoryId: string;
  title: string;
  description: string;
  placement: string;
  size: string;
  materials: string[];
  /** English brief for the image model: exact location, coverage and scale. */
  visual?: string;
};

export type Advice = {
  isSpace: boolean;
  seen: string;
  primary: Idea | null;
  alternatives: Idea[];
  tip?: string;
};

export type AdviceInput = { imageBase64: string; mimeType: string; note?: string };

const IDS = CATEGORIES.map((c) => c.id);
const CATALOG_LINES = CATEGORIES.map((c) => `- ${c.id}: ${c.name} — ${c.short}`).join("\n");

function systemPrompt(note?: string) {
  return `أنت «مستشار خشبة»: مصمم داخلي ونجّار خبير في ورشة «خشبة» بالقاهرة. الورشة بتنفّذ أي شغل خشب حسب المقاس — أثاث، وحدات، تكسيات، أبواب، ديكورات، تفاصيل نجارة… أي حاجة من الخشب.
العميل بعتلك صورة لمكان في بيته أو شغله${note ? " ومعاها طلب" : ""}. مهمتك تقترح عليه أنسب قطعة خشب تتنفّذ للمكان ده بالظبط.

اشتغل كده:
1) افهم المكان الأول: بص على الصورة كويس — نوع المكان، الحيطة أو الركن الفاضي، الأبواب والشبابيك والأفياش، الأثاث الموجود، ألوان الحيطان والأرضية، الإضاءة. وقدّر المقاسات تقريبًا من الحاجات المعروفة (باب ≈ ٢١٠سم، فيشة ≈ ٣٠سم من الأرض، كنبة ≈ ٨٥سم ارتفاع، بلاطة أرضية ≈ ٦٠سم).
2) ${
    note
      ? "العميل كتب طلب — اسمع كلامه ونفّذه حرفيًا. الاقتراح الأساسي لازم يبقى اللي طلبه بالظبط (متصمم صح على المكان)، والبديلين يبقوا تنويعات قريبة من طلبه."
      : `العميل ماكتبش طلب — فكّر زي مصمم شاطر. ابدأ بـ «إيه أكبر مشكلة أو أوضح فرصة في الصورة؟» وبعدها اختار القطعة اللي تحلّها:
   • حيطة كبيرة سطحها وحش أو مش متشطّب أو باهت (بلاطات صوت مخرّمة، جبس متقسّم، شروخ، دهان قديم، فواصل ظاهرة) → تجاليد/تكسية خشب للحيطة دي (wall_cladding) — دي أول اختيار، ووحدات أو رفوف تبقى بدائل.
   • حيطة فاضية ونضيفة في صالة أو قعدة → تكسية جزئية مع رف، أو وحدة حائط، حسب حجمها.
   • تليفزيون على ترابيزة أو سلوك ظاهرة → وحدة تليفزيون (tv_units).
   • نيش أو تجويف فاضي → رفوف أو مكتبة جوّه النيش.
   • ركن فاضي → وحدة ركنة أو رفوف ركنة.
   • مدخل أو طرقة → كونسول أو جزامة أو تكسية.
   • مكان واسع محتاج يتقسّم → بارتيشن خشب.
   • أوضة نوم → الحيطة اللي ورا راس السرير هي أهم مكان: تجليد/هيدبورد خشب بعرض السرير أو أعرض، مع كومودينو معلق أو إضاءة.
   • الاقتراح الأساسي لازم يعمل فرق واضح لما العميل يشوفه: ماتختارش قطعة صغيرة (رف واحد، برواز) كاقتراح أساسي إلا لو المكان نفسه صغير جدًا — خليها بديل.
   القطعة لازم تتناسب مع حجم المساحة: حيطة عرضها ٣–٥ متر ماينفعش يتحط عليها قطعة صغيرة في النص وخلاص.`
  }
3) الاقتراح لازم يبقى مبني على اللي شايفه فعلًا في الصورة (اذكر مكانه بالظبط: «في الركن اللي على يمين الشباك»…). ماتخترعش حاجات مش موجودة في الصورة.
4) اختار نوع خشب ولون وتشطيب يمشوا مع ألوان المكان الموجودة.
5) البديلين لازم يكونوا مختلفين بجد عن الاقتراح الأساسي (مش نفس الفكرة بكلام تاني).

أمثلة من معرض خشبة (للاسترشاد بس — مش لازم تلتزم بيها):
${CATALOG_LINES}
في كل اقتراح حط categoryId = أقرب قسم من دول عشان نعرض صور شبهه، ولو الاقتراح مالوش قسم قريب حط categoryId = "custom".

قواعد:
- لازم الاقتراح يكون شغل خشب ينفع يتنفّذ في ورشة نجارة (مش أجهزة ولا قماش ولا نباتات كاقتراح أساسي).
- الاقتراح بيتضاف للمكان زي ما هو: ماتقترحش قطعة موجودة أصلًا في الصورة بحالة كويسة (لو فيه مكتب كويس ماتقترحش مكتب)، واختار قطعة تكمّل الموجود وتتحط في مساحة فاضية فعلًا من غير ما تخبط في أي حاجة. الاستثناء الوحيد: لو فيه قطعة مؤقتة أو رخيصة أو مش مناسبة واضح إنها المشكلة (زي تليفزيون على ترابيزة صغيرة)، القطعة الجديدة تحل محلها — وقول ده صراحة في visual.
- في كل اقتراح اكتب "visual": وصف بالإنجليزي لرسّام الصور (٢-٤ جمل) يحدد بالظبط: القطعة وشكلها ولونها، مكانها بالنسبة لحاجات ظاهرة في الصورة (مثلًا "on the right wall, from the window frame to the right edge of the photo")، وحجمها كنسبة من الحيطة أو من الصورة (مثلًا "covers the full wall height from floor to ceiling" أو "about 60% of the wall width")، ولو بتحل محل حاجة قول "replaces the small wooden table under the TV". لو تكسية: قول أنهي حيطة بالظبط وهتغطي قد إيه منها.
- عربي مصري بسيط وراقي، جمل قصيرة وواضحة، من غير إيموجي.
- ممنوع أسعار أو مواعيد تسليم أو وعود.
- size تقدير تقريبي بالسنتيمتر (عرض × ارتفاع × عمق) مع كلمة «تقريبًا».
- لو الصورة مش لمكان (سيلفي، أكل، صورة مش واضحة…) خلّي isSpace = false واكتب في seen رسالة لطيفة تطلب صورة للمكان، وسيب primary = null وalternatives فاضية.

رجّع JSON بس بالشكل ده:
{
  "isSpace": true,
  "seen": "جملة أو اتنين: فهمت إيه من المكان",
  "primary": { "categoryId": "...", "title": "اسم القطعة المقترحة", "description": "٢-٣ جمل ليه دي أنسب حاجة وشكلها هيبقى إزاي", "placement": "هتتحط فين بالظبط", "size": "تقريبًا ...", "materials": ["خشب/تشطيب", "إضاءة أو تفصيلة", "..."], "visual": "English brief: piece, exact position relative to visible objects, coverage/scale, what it replaces if anything" },
  "alternatives": [ { نفس الشكل }, { نفس الشكل } ],
  "tip": "نصيحة صغيرة عملية للمكان (اختياري)"
}`;
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fenced?.[1] ?? text).trim();
  try {
    return JSON.parse(raw);
  } catch {
    const a = raw.indexOf("{");
    const b = raw.lastIndexOf("}");
    if (a >= 0 && b > a) return JSON.parse(raw.slice(a, b + 1));
    throw new Error("Model did not return JSON");
  }
}

const str = (v: unknown, max = 600) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function cleanIdea(v: unknown): Idea | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  // Gallery categories are only used to show similar photos; anything else is a custom piece.
  const raw = str(o.categoryId, 40);
  const categoryId = IDS.includes(raw) ? raw : "custom";
  const title = str(o.title, 120);
  if (!title) return null;
  return {
    categoryId,
    title,
    description: str(o.description),
    placement: str(o.placement, 300),
    size: str(o.size, 120),
    materials: Array.isArray(o.materials) ? o.materials.map((m) => str(m, 80)).filter(Boolean).slice(0, 4) : [],
    visual: str(o.visual, 800) || undefined,
  };
}

export function normalizeAdvice(raw: unknown): Advice {
  const o = (raw ?? {}) as Record<string, unknown>;
  const primary = cleanIdea(o.primary);
  const alternatives = (Array.isArray(o.alternatives) ? o.alternatives : [])
    .map(cleanIdea)
    .filter((x): x is Idea => !!x && x.categoryId + x.title !== (primary?.categoryId ?? "") + (primary?.title ?? ""))
    .slice(0, 2);
  const isSpace = o.isSpace !== false && !!primary;
  return {
    isSpace,
    seen: str(o.seen, 500),
    primary: isSpace ? primary : null,
    alternatives: isSpace ? alternatives : [],
    tip: str(o.tip, 300) || undefined,
  };
}

async function withTimeout<T>(ms: number, fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fn(ctrl.signal);
  } finally {
    clearTimeout(t);
  }
}

/* ---------------- Gemini (free tier) ---------------- */

const DEFAULT_GEMINI = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-3-flash-preview", "gemini-2.5-flash"];
const fromEnv = process.env.GEMINI_MODEL?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
/** Free-tier vision models, best first. Override with GEMINI_MODEL="a,b". */
const GEMINI_MODELS = fromEnv.length ? fromEnv : DEFAULT_GEMINI;

async function askGemini(input: AdviceInput, key: string, deadline: number): Promise<Advice> {
  const errors: string[] = [];
  for (const model of GEMINI_MODELS) {
    const left = deadline - Date.now();
    if (left < 6000) break;
    try {
      const res = await withTimeout(Math.min(left - 1000, 40000), (signal) =>
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          signal,
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt(input.note) }] },
            contents: [
              {
                role: "user",
                parts: [
                  { inlineData: { mimeType: input.mimeType, data: input.imageBase64 } },
                  { text: input.note ? `طلب العميل: ${input.note}` : "مفيش طلب مكتوب — اقترح انت الأنسب." },
                ],
              },
            ],
            generationConfig: { responseMimeType: "application/json" },
          }),
        })
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = body?.error?.message ?? res.statusText;
        errors.push(`${model}: ${res.status} ${String(msg).slice(0, 160)}`);
        // Model missing / not allowed / overloaded → try the next one
        if ([400, 403, 404, 429, 500, 503].includes(res.status)) continue;
        break;
      }
      const text: string =
        body?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
      if (!text) {
        errors.push(`${model}: empty (${body?.candidates?.[0]?.finishReason ?? body?.promptFeedback?.blockReason ?? "?"})`);
        continue;
      }
      return normalizeAdvice(extractJson(text));
    } catch (e) {
      errors.push(`${model}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  throw new Error(errors.join(" | ") || "Gemini unavailable");
}

/* ---------------- Claude (optional, paid) ---------------- */

async function askClaude(input: AdviceInput, key: string, deadline: number): Promise<Advice> {
  const model = process.env.ANTHROPIC_MODEL?.trim() || "claude-haiku-4-5";
  const res = await withTimeout(Math.max(5000, deadline - Date.now() - 1000), (signal) =>
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1500,
        system: systemPrompt(input.note),
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: input.mimeType, data: input.imageBase64 } },
              { type: "text", text: input.note ? `طلب العميل: ${input.note}` : "مفيش طلب مكتوب — اقترح انت الأنسب. رجّع JSON بس." },
            ],
          },
        ],
      }),
    })
  );
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`claude ${res.status}: ${body?.error?.message ?? res.statusText}`);
  const text: string = body?.content?.map((c: { text?: string }) => c.text ?? "").join("") ?? "";
  return normalizeAdvice(extractJson(text));
}

export function aiProvider(): "gemini" | "claude" | null {
  if (process.env.GEMINI_API_KEY?.trim()) return "gemini";
  if (process.env.ANTHROPIC_API_KEY?.trim()) return "claude";
  return null;
}

export async function getAdvice(input: AdviceInput, budgetMs = 52000): Promise<Advice> {
  const deadline = Date.now() + budgetMs;
  const gemini = process.env.GEMINI_API_KEY?.trim();
  const claude = process.env.ANTHROPIC_API_KEY?.trim();
  if (!gemini && !claude) throw new Error("NO_KEY");
  if (gemini) {
    try {
      return await askGemini(input, gemini, claude ? deadline - 15000 : deadline);
    } catch (e) {
      if (!claude) throw e;
    }
  }
  return askClaude(input, claude!, deadline);
}
