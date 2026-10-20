import type { SuggestResult } from "@/lib/gemini";
import { NextResponse } from "next/server";
import {
  createSuggestion,
  isAiConfigured,
  type SuggestRequest,
} from "@/lib/gemini";
import { CATEGORIES } from "@/lib/catalog";

export const runtime = "nodejs";
export const maxDuration = 60; // Vercel Hobby plan max

type Body = {
  categoryId?: string;
  caption?: string;
  imageBase64?: string;
  mimeType?: string;
  variation?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const categoryId = body.categoryId?.trim() || CATEGORIES[0].id;
    const valid = CATEGORIES.some((c) => c.id === categoryId);
    if (!valid) {
      return NextResponse.json(
        { error: "قسم غير معروف" },
        { status: 400 }
      );
    }

    const input: SuggestRequest = {
      categoryId,
      caption: body.caption?.slice(0, 500),
      imageBase64: body.imageBase64,
      mimeType: body.mimeType,
      variation: Number.isFinite(body.variation) ? Number(body.variation) : 0,
    };

    const suggestion = await createSuggestion(input);
    const aiConfigured = isAiConfigured();
    const debug = (suggestion as SuggestResult & { _debug?: string })._debug;
    return NextResponse.json({
      suggestion,
      aiConfigured,
      mode: suggestion.mock ? "mock" : "live",
      // legacy alias for older clients
      geminiConfigured: aiConfigured,
      ...(debug ? { debug } : {}),
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("[api/suggest] error:", errMsg);
    return NextResponse.json(
      { error: "تعذر إنشاء الاقتراح الآن. جرّب تاني بعد شوية.", detail: errMsg },
      { status: 500 }
    );
  }
}

export async function GET() {
  const aiConfigured = isAiConfigured();
  return NextResponse.json({
    ok: true,
    aiConfigured,
    mode: aiConfigured ? "live" : "mock",
    geminiConfigured: aiConfigured,
    categories: CATEGORIES.map((c) => ({ id: c.id, name: c.name })),
  });
}
