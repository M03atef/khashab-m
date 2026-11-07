import { NextResponse } from "next/server";
import type { Idea } from "@/lib/ai";
import { imageProvider, renderInPlace } from "@/lib/visualize";

export const runtime = "nodejs";
export const maxDuration = 60; // Vercel Hobby max

const MAX_BYTES = 3.5 * 1024 * 1024;
const MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: {
    imageBase64?: string;
    mimeType?: string;
    note?: string;
    idea?: Partial<Idea>;
    width?: number;
    height?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "الطلب مش مفهوم." }, { status: 400 });
  }

  const data = (body.imageBase64 ?? "").replace(/^data:[^;]+;base64,/, "");
  const mimeType = body.mimeType && MIME.has(body.mimeType) ? body.mimeType : "image/jpeg";
  if (!data) return NextResponse.json({ error: "مفيش صورة." }, { status: 400 });
  if (data.length * 0.75 > MAX_BYTES) return NextResponse.json({ error: "الصورة كبيرة." }, { status: 413 });

  const raw = body.idea ?? {};
  const idea: Idea = {
    categoryId: s(raw.categoryId, 40) || "custom",
    title: s(raw.title, 120),
    description: s(raw.description, 600),
    placement: s(raw.placement, 300),
    size: s(raw.size, 120),
    materials: Array.isArray(raw.materials) ? raw.materials.map((m) => s(m, 80)).filter(Boolean).slice(0, 4) : [],
  };
  if (!idea.title) return NextResponse.json({ error: "مفيش اقتراح نرسمه." }, { status: 400 });

  if (!imageProvider()) {
    return NextResponse.json({ error: "التصوّر مش متاح دلوقتي.", code: "NO_KEY" }, { status: 503 });
  }

  try {
    const out = await renderInPlace({
      imageBase64: data,
      mimeType,
      idea,
      note: s(body.note, 400) || undefined,
      width: Number(body.width) || undefined,
      height: Number(body.height) || undefined,
    });
    return NextResponse.json({ image: out.dataUrl });
  } catch (e) {
    console.error("[api/visualize]", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { error: "ماقدرناش نرسم القطعة في صورتك دلوقتي — جرّب كمان شوية.", code: "AI_FAILED" },
      { status: 502 }
    );
  }
}
