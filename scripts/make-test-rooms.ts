/**
 * Builds a varied set of realistic "customer photos" in test-photos/ so the advisor
 * can be tested on many kinds of spaces — not just one picture.
 * Uses the free Cloudflare FLUX.2 klein model (text → image).
 *
 *   npx tsx scripts/make-test-rooms.ts
 */
import "./load-env";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOMS: [string, string][] = [
  ["living-empty-wall", "a large empty painted wall in an Egyptian apartment living room, beige sofa on the left edge, tiled floor, afternoon light"],
  ["bedroom-corner", "the empty corner of a modest Egyptian bedroom next to a window with curtains, bed edge visible, a power outlet on the wall"],
  ["entrance-hallway", "a narrow apartment entrance hallway with a wooden front door, bare wall on one side, ceramic floor tiles, ceiling light"],
  ["tv-wall", "a living room wall with a TV standing on a small cheap table, cables hanging, sofa in the foreground, evening lamp light"],
  ["kids-room", "a kids room with a single bed and toys on the floor, one empty wall with a light switch, colorful bedsheet"],
  ["under-stairs", "the empty space under an interior staircase in a villa, marble floor, white walls"],
  ["kitchen-corner", "an empty corner of a small kitchen next to the fridge, tiled backsplash, window above"],
  ["balcony-dim", "a small closed balcony converted to a room, dim warm light, plastic chair, bare wall, slightly blurry phone photo"],
  ["office-wall", "a small home office with a desk and chair in front of a bare wall, laptop on the desk, window light from the right"],
  ["dining-area", "a dining area with a 6-seat table and chairs, a long empty wall behind it, chandelier above"],
];

async function main() {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!account || !token) throw new Error("محتاج CLOUDFLARE_ACCOUNT_ID و CLOUDFLARE_API_TOKEN");
  const dir = "test-photos";
  mkdirSync(dir, { recursive: true });

  for (const [name, scene] of ROOMS) {
    const file = join(dir, `${name}.jpg`);
    if (existsSync(file)) {
      console.log(`  موجودة: ${file}`);
      continue;
    }
    const form = new FormData();
    form.append(
      "prompt",
      `An ordinary smartphone photo taken by a homeowner: ${scene}. Realistic, everyday, not staged, not a magazine photo, natural imperfections, eye-level, slightly wide angle.`
    );
    form.append("width", "1024");
    form.append("height", "768");
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/@cf/black-forest-labs/flux-2-klein-4b`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form }
    );
    const body = await res.json().catch(() => ({}));
    const image: string | undefined = body?.result?.image ?? body?.image;
    if (!res.ok || !image) {
      console.log(`  ✖ ${name}: ${res.status} ${body?.errors?.[0]?.message ?? ""}`);
      continue;
    }
    writeFileSync(file, Buffer.from(image, "base64"));
    console.log(`  ✔ ${file}`);
  }
}

main().catch((e) => {
  console.error("✖", e instanceof Error ? e.message : e);
  process.exit(1);
});
