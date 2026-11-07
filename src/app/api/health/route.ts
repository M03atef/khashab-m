import { NextResponse } from "next/server";

/** Lightweight readiness probe for Vercel smoke tests. */
export async function GET() {
  return NextResponse.json({ ok: true, service: "khashaba", timestamp: new Date().toISOString() });
}
