import type { Idea } from "@/lib/ai";

/**
 * «شوفها في مكانك» — takes the customer's own photo and returns the SAME photo
 * with the suggested Khashaba piece added, everything else left untouched.
 *
 * Providers (first one configured wins):
 *  1. Cloudflare Workers AI — FLUX.2 [klein]. FREE daily allocation, no card needed.
 *     CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN (optional CF_IMAGE_MODEL).
 *  2. Gemini image models ("Nano Banana") — needs billing on the key's project.
 *     GEMINI_API_KEY (optional GEMINI_IMAGE_MODEL="a,b").
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

/* ---------------- Cloudflare Workers AI (free) ---------------- */

const CF_MODEL = process.env.CF_IMAGE_MODEL?.trim() || "@cf/black-forest-labs/flux-2-klein-4b";

/** FLUX.2 klein wants reference images under 512px; output keeps the photo's proportions. */
async function shrinkForReference(buf: Buffer): Promise<{ data: Buffer; type: string }> {
  try {
    const sharp = (await import("sharp")).default;
    const data = await sharp(buf).rotate().resize(512, 512, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 90 }).toBuffer();
    return { data, type: "image/jpeg" };
  } catch {
    return { data: buf, type: "image/jpeg" };
  }
}

function outputSize(width?: number, height?: number) {
  const r = width && height ? width / height : 4 / 3;
  const long = 1024;
  const snap = (v: number) => Math.max(256, Math.min(1920, Math.round(v / 16) * 16));
  return r >= 1 ? { w: snap(long), h: snap(long / r) } : { w: snap(long * r), h: snap(long) };
}

function sniffMime(b64: string) {
  if (b64.startsWith("iVBOR")) return "image/png";
  if (b64.startsWith("UklGR")) return "image/webp";
  return "image/jpeg";
}

async function renderCloudflare(input: RenderInput, account: string, token: string, budgetMs: number) {
  const ref = await shrinkForReference(Buffer.from(input.imageBase64, "base64"));
  const { w, h } = outputSize(input.width, input.height);
  const form = new FormData();
  form.append("prompt", editPrompt(input.idea, input.note) + "\nThe input image (image 0) IS the room — output that same room photo with the piece added.");
  form.append("input_image_0", new Blob([new Uint8Array(ref.data)], { type: ref.type }), "room.jpg");
  form.append("width", String(w));
  form.append("height", String(h));
  const res = await withTimeout(budgetMs, (signal) =>
    fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${CF_MODEL}`, {
      method: "POST",
      signal,
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
  );
  const body = await res.json().catch(() => ({}));
  const image: string | undefined = body?.result?.image ?? body?.image;
  if (!res.ok || !image) {
    const msg = body?.errors?.[0]?.message ?? res.statusText;
    throw new Error(`cloudflare ${CF_MODEL}: ${res.status} ${String(msg).slice(0, 200)}`);
  }
  return { dataUrl: `data:${sniffMime(image)};base64,${image}`, model: CF_MODEL };
}

export function imageProvider(): "cloudflare" | "gemini" | null {
  if (process.env.CLOUDFLARE_ACCOUNT_ID?.trim() && process.env.CLOUDFLARE_API_TOKEN?.trim()) return "cloudflare";
  if (process.env.GEMINI_API_KEY?.trim()) return "gemini";
  return null;
}

export async function renderInPlace(input: RenderInput, budgetMs = 54000): Promise<{ dataUrl: string; model: string }> {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (account && token) return renderCloudflare(input, account, token, budgetMs);
  return renderGemini(input, budgetMs);
}

async function renderGemini(input: RenderInput, budgetMs: number): Promise<{ dataUrl: string; model: string }> {
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
