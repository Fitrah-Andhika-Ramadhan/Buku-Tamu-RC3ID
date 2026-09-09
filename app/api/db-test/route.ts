import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await db.participant.count();
    return NextResponse.json({
      status: "✅ CONNECTED",
      participantCount: count,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const error = err as { message?: string; code?: string; meta?: unknown };
    return NextResponse.json({
      status: "❌ CONNECTION FAILED",
      errorMessage: error?.message ?? "Unknown error",
      errorCode: error?.code ?? "N/A",
      errorMeta: error?.meta ?? null,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
