import { NextResponse } from "next/server";
import { isAiConfigured } from "@/lib/gemini";

export const runtime = "nodejs";

/** Lightweight readiness probe for local / Vercel smoke tests. */
export async function GET() {
  const aiConfigured = isAiConfigured();
  return NextResponse.json({
    ok: true,
    service: "khashaba",
    aiConfigured,
    mode: aiConfigured ? "live" : "mock",
    timestamp: new Date().toISOString(),
  });
}
