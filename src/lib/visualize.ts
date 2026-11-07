import type { Idea } from "@/lib/ai";

/**
 * «شوفها في مكانك» — takes the customer's own photo and returns the SAME photo
 * with the suggested Khashaba piece added, everything else left untouched.
 *
 * Uses a Gemini image-editing model ("Nano Banana" family). Note: image output
 * is NOT on the Gemini free tier — the API key's project needs billing enabled.
 * Override models with GEMINI_IMAGE_MODEL="a,b".
 */

const DEFAULT_IMAGE_MODELS = ["gemini-3.1-flash-image-preview", "gemini-2.5-flash-image"];
const fromEnv = process.env.GEMINI_IMAGE_MODEL?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
const IMAGE_MODELS = fromEnv.length ? fromEnv : DEFAULT_IMAGE_MODELS;

const RATIOS: [string, number][] = [
  ["1:1", 1],
  ["4:5", 4 / 5],
  ["5:4", 5 / 4],
  ["3:4", 3 / 4],
  ["4:3", 4 / 3],
  ["2:3", 2 / 3],
  ["3:2", 3 / 2],
  ["9:16", 9 / 16],
  ["16:9", 16 / 9],
  ["21:9", 21 / 9],
];

/** Closest aspect ratio the model supports, so the output frame matches the photo. */
export function nearestRatio(width?: number, height?: number): string | undefined {
  if (!width || !height || width <= 0 || height <= 0) return undefined;
  const r = width / height;
  let best = RATIOS[0];
  for (const cand of RATIOS) if (Math.abs(Math.log(cand[1] / r)) < Math.abs(Math.log(best[1] / r))) best = cand;
  return best[0];
}

function editPrompt(idea: Idea, note?: string) {
  return `Edit this exact photo of a real room. This is a photo EDIT, not a new image.

ADD ONLY this custom woodwork piece made by a carpentry workshop:
- Piece: ${idea.title}
- Description: ${idea.description}
- Where: ${idea.placement}
- Approximate size: ${idea.size}
- Materials / finish: ${idea.materials.join("، ") || "natural wood"}
${note ? `- Customer request: ${note}\n` : ""}
STRICT RULES:
1. Keep EVERYTHING else pixel-faithful to the original: same camera angle, framing, crop, perspective, lens, lighting, white balance and colors.
2. Do NOT remove, move, restyle or recolor anything already in the photo — walls, wall texture, ceiling, moldings, curtains, furniture, objects on surfaces, cables, decorations all stay exactly as they are.
3. The new piece must sit physically correct in the space: correct scale for the room, attached to the wall/floor where it should be, perspective-matched, with realistic contact shadows and light that matches the existing light in the photo.
4. Photorealistic result that looks like a real photo taken after installation. No text, no labels, no watermark, no people.`;
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

export type RenderInput = {
  imageBase64: string;
  mimeType: string;
  idea: Idea;
  note?: string;
  width?: number;
  height?: number;
};

export async function renderInPlace(input: RenderInput, budgetMs = 54000): Promise<{ dataUrl: string; model: string }> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("NO_KEY");
  const deadline = Date.now() + budgetMs;
  const aspectRatio = nearestRatio(input.width, input.height);
  const errors: string[] = [];

  for (const model of IMAGE_MODELS) {
    const left = deadline - Date.now();
    if (left < 8000) break;
    try {
      const res = await withTimeout(left - 1000, (signal) =>
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          signal,
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { inlineData: { mimeType: input.mimeType, data: input.imageBase64 } },
                  { text: editPrompt(input.idea, input.note) },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ["IMAGE"],
              ...(aspectRatio ? { imageConfig: { aspectRatio } } : {}),
            },
          }),
        })
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        errors.push(`${model}: ${res.status} ${String(body?.error?.message ?? res.statusText).slice(0, 160)}`);
        if ([400, 403, 404, 429, 500, 503].includes(res.status)) continue;
        break;
      }
      const parts: { inlineData?: { mimeType?: string; data?: string }; inline_data?: { mime_type?: string; data?: string } }[] =
        body?.candidates?.[0]?.content?.parts ?? [];
      for (const p of parts) {
        const d = p.inlineData ?? (p.inline_data && { mimeType: p.inline_data.mime_type, data: p.inline_data.data });
        if (d?.data) return { dataUrl: `data:${d.mimeType || "image/png"};base64,${d.data}`, model };
      }
      errors.push(`${model}: no image (${body?.candidates?.[0]?.finishReason ?? body?.promptFeedback?.blockReason ?? "?"})`);
    } catch (e) {
      errors.push(`${model}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  throw new Error(errors.join(" | ") || "Image model unavailable");
}
