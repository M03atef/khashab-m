import { NextResponse } from "next/server";
import { testGeminiConnection } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET() {
  const result = await testGeminiConnection();
  return NextResponse.json(result);
}
