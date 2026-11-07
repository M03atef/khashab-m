/**
 * Local test bench for «مستشار خشبة» + «شوفها في مكانك».
 * Runs the exact same prompts the site uses, on your own photos.
 *
 *   PowerShell:
 *     $env:GEMINI_API_KEY="your-key"
 *     npx tsx scripts/try-advisor.ts photo1.jpg photo2.jpg
 *   Optional: add  --note "ضيف رفوف هنا"  and  --runs 2
 *
 * Results land in advisor-tests/<time>/ — open report.html to see before/after.
 */
import "./load-env";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { getAdvice } from "@/lib/ai";
import { renderInPlace } from "@/lib/visualize";

function imageSize(buf: Buffer): { width?: number; height?: number } {
  if (buf.readUInt32BE(0) === 0x89504e47) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) break;
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  }
  return {};
}

const MIME: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

async function main() {
  const args = process.argv.slice(2);
  let note: string | undefined;
  let runs = 1;
  const photos: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--note") note = args[++i];
    else if (args[i] === "--runs") runs = Math.max(1, Number(args[++i]) || 1);
    else photos.push(args[i]);
  }
  if (!process.env.GEMINI_API_KEY) throw new Error('حط المفتاح الأول:  $env:GEMINI_API_KEY="..."');
  if (!photos.length) throw new Error("اكتب مسار صورة واحدة على الأقل.");

  const out = join("advisor-tests", new Date().toISOString().replace(/[:.]/g, "-"));
  mkdirSync(out, { recursive: true });
  const rows: string[] = [];

  for (const path of photos) {
    const buf = readFileSync(path);
    const mimeType = MIME[extname(path).toLowerCase()] ?? "image/jpeg";
    const { width, height } = imageSize(buf);
    const name = basename(path, extname(path));
    const imageBase64 = buf.toString("base64");
    const beforeUrl = `data:${mimeType};base64,${imageBase64}`;
    console.log(`\n▶ ${name} (${width}×${height})`);

    let t = Date.now();
    const advice = await getAdvice({ imageBase64, mimeType, note });
    console.log(`  اقتراح (${((Date.now() - t) / 1000).toFixed(1)}s): ${advice.primary?.title ?? "—"}`);
    writeFileSync(join(out, `${name}-advice.json`), JSON.stringify(advice, null, 2));
    if (!advice.primary) {
      rows.push(`<h2>${name}</h2><p>مش مكان: ${advice.seen}</p>`);
      continue;
    }

    for (let r = 1; r <= runs; r++) {
      t = Date.now();
      try {
        const res = await renderInPlace({ imageBase64, mimeType, idea: advice.primary, note, width, height }, 120000);
        const ext = res.dataUrl.slice(5, res.dataUrl.indexOf(";")).split("/")[1] || "png";
        const file = `${name}-after-${r}.${ext}`;
        writeFileSync(join(out, file), Buffer.from(res.dataUrl.split(",")[1], "base64"));
        console.log(`  صورة ${r} (${res.model}, ${((Date.now() - t) / 1000).toFixed(1)}s): ${file}`);
        rows.push(
          `<h2>${name} — محاولة ${r} <small>${res.model}</small></h2><p><b>${advice.primary.title}</b> — ${advice.primary.placement}</p>` +
            `<div class="pair"><figure><img src="${beforeUrl}"><figcaption>قبل</figcaption></figure>` +
            `<figure><img src="${file}"><figcaption>بعد</figcaption></figure></div>`
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log(`  ✖ صورة ${r}: ${msg}`);
        rows.push(`<h2>${name} — محاولة ${r}</h2><pre>${msg.replace(/</g, "&lt;")}</pre>`);
      }
    }
  }

  writeFileSync(
    join(out, "report.html"),
    `<!doctype html><meta charset="utf-8"><title>اختبار المستشار</title><body dir="rtl" style="font-family:sans-serif;max-width:1200px;margin:auto;padding:16px">
<style>.pair{display:grid;grid-template-columns:1fr 1fr;gap:8px}img{width:100%;border-radius:8px}figure{margin:0}pre{white-space:pre-wrap;background:#fee;padding:8px}</style>
${rows.join("\n")}</body>`
  );
  console.log(`\n✔ النتايج في: ${out}\\report.html`);
}

main().catch((e) => {
  console.error("✖", e instanceof Error ? e.message : e);
  process.exit(1);
});
