/**
 * Builds the hero opening: one living room that furnishes itself in woodwork.
 * The finished room is generated first at full size; each earlier stage is one edit
 * of it that REMOVES pieces, so every frame shares one camera.
 * Already have a finished room you like? Set HERO_KEEP=1 to reuse public/hero/stage-3.jpg.
 *
 *   npx tsx scripts/make-hero-sequence.ts
 * Writes public/hero/stage-0.jpg … stage-3.jpg (0 = empty, 3 = finished).
 */
import "./load-env";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MODEL = process.env.CF_HERO_MODEL?.trim() || "@cf/black-forest-labs/flux-2-klein-9b";
const W = 1920;
const H = 1088;
const OUT = join("public", "hero");

const FINISHED =
  "Architectural interior photograph of a calm, warm, modern Egyptian living room at golden hour. " +
  "The whole back wall is clad floor-to-ceiling in vertical natural oak wood slats with hidden warm LED lines. " +
  "In front of it a long low floating walnut TV console, a built-in oak bookcase on the right with soft shelf lighting, " +
  "a cream linen sofa and a round travertine coffee table on a light rug, large window on the left with sheer curtains, " +
  "light marble floor, recessed ceiling with a warm cove light. Wide angle, eye level, centered, editorial, photorealistic, sharp.";

const KEEP =
  " Keep the exact same camera position, lens, zoom and framing — the window on the left, the ceiling, the floor and every edge stay at the same place in the frame. Same daylight.";

// Each earlier stage is ONE edit from the sharp finished room (no drift from chaining).
const STAGES: { n: number; prompt: string }[] = [
  { n: 2, prompt: "Edit this photo: remove the sofas, the coffee table and the rug, and turn off the LED strips and the cove light." + KEEP },
  {
    n: 1,
    prompt:
      "Edit this photo: remove the sofas, coffee table, rug, the TV, the floating TV console and the whole bookcase, and turn off all LED lights. Only the vertical oak slat cladding on the back wall stays." +
      KEEP,
  },
  {
    n: 0,
    prompt:
      "Edit this photo: empty the room completely — remove all furniture, the TV, the console, the bookcase and the wooden slat cladding, leaving a clean plain off-white painted back wall. Turn off all LED lights." +
      KEEP,
  },
];

async function run(form: FormData) {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!account || !token) throw new Error("محتاج CLOUDFLARE_ACCOUNT_ID و CLOUDFLARE_API_TOKEN في .env.local");
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${MODEL}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const body = await res.json().catch(() => ({}));
  const image: string | undefined = body?.result?.image ?? body?.image;
  if (!res.ok || !image) throw new Error(`${res.status} ${body?.errors?.[0]?.message ?? ""}`);
  return Buffer.from(image, "base64");
}

async function shrink(buf: Buffer) {
  const sharp = (await import("sharp")).default;
  return sharp(buf).resize(512, 512, { fit: "inside" }).jpeg({ quality: 92 }).toBuffer();
}

async function toJpeg(buf: Buffer) {
  const sharp = (await import("sharp")).default;
  return sharp(buf).resize(W, H, { fit: "cover" }).jpeg({ quality: 80, progressive: true, mozjpeg: true }).toBuffer();
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const seed = String(Number(process.env.HERO_SEED) || 7);

  const reuse = process.env.HERO_KEEP === "1" && existsSync(join(OUT, "stage-3.jpg"));
  console.log(reuse ? "▶ stage-3: reusing the existing finished room" : "▶ stage-3 (finished room)…");
  const f = new FormData();
  f.append("prompt", FINISHED);
  f.append("width", String(W));
  f.append("height", String(H));
  f.append("seed", seed);
  const current = reuse ? readFileSync(join(OUT, "stage-3.jpg")) : await run(f);
  if (!reuse) writeFileSync(join(OUT, "stage-3.jpg"), await toJpeg(current));
  console.log("  ✔ public/hero/stage-3.jpg");

  const finished = await shrink(current);
  for (const { n, prompt } of STAGES) {
    console.log(`▶ stage-${n}…`);
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("input_image_0", new Blob([new Uint8Array(finished)], { type: "image/jpeg" }), "room.jpg");
    form.append("width", String(W));
    form.append("height", String(H));
    form.append("seed", seed);
    const img = await run(form);
    writeFileSync(join(OUT, `stage-${n}.jpg`), await toJpeg(img));
    console.log(`  ✔ public/hero/stage-${n}.jpg`);
  }
  console.log("\n✔ خلص — الصور في public/hero");
}

main().catch((e) => {
  console.error("✖", e instanceof Error ? e.message : e);
  process.exit(1);
});
