import { NextResponse } from "next/server";
import { aiProvider, getAdvice } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60; // Vercel Hobby max

const MAX_BYTES = 3.5 * 1024 * 1024;
const MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function GET() {
  return NextResponse.json({ ok: true, ready: aiProvider() !== null });
}

export async function POST(request: Request) {
  let body: { imageBase64?: string; mimeType?: string; note?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "الطلب مش مفهوم — جرّب تاني." }, { status: 400 });
  }

  const data = (body.imageBase64 ?? "").replace(/^data:[^;]+;base64,/, "");
  const mimeType = body.mimeType && MIME.has(body.mimeType) ? body.mimeType : "image/jpeg";
  if (!data) return NextResponse.json({ error: "ارفع صورة للمكان الأول." }, { status: 400 });
  if (data.length * 0.75 > MAX_BYTES)
    return NextResponse.json({ error: "الصورة كبيرة — جرّب صورة تانية." }, { status: 413 });

  if (!aiProvider()) {
    return NextResponse.json(
      { error: "المستشار مش متاح دلوقتي — ابعتلنا الصورة على واتساب وهنرد عليك بنفسنا.", code: "NO_KEY" },
      { status: 503 }
    );
  }

  try {
    const advice = await getAdvice({ imageBase64: data, mimeType, note: body.note?.trim().slice(0, 400) || undefined });
    return NextResponse.json({ advice });
  } catch (e) {
    console.error("[api/suggest]", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { error: "المستشار مشغول شوية — جرّب كمان دقيقة، أو ابعتلنا الصورة على واتساب.", code: "AI_FAILED" },
      { status: 502 }
    );
  }
}
