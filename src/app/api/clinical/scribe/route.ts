import { NextResponse } from "next/server";
import {
  generateAndOptionallySignScribe,
  getDatabaseOverview,
} from "@/server/clinical-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      patientId?: string;
      transcript?: string;
      signAndArchive?: boolean;
      clinicianName?: string;
    };

    if (!body.patientId || !body.transcript?.trim()) {
      return NextResponse.json(
        { ok: false, error: "patientId and transcript required" },
        { status: 400 }
      );
    }

    const result = generateAndOptionallySignScribe({
      patientId: body.patientId,
      transcript: body.transcript,
      signAndArchive: Boolean(body.signAndArchive),
      clinicianName: body.clinicianName || "主任医师 · 延续护理签审",
    });

    const overview = getDatabaseOverview();
    return NextResponse.json({
      ok: true,
      ...result,
      encounters: overview.encounters,
      escalations: overview.escalations,
      stats: overview.stats,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Scribe error" },
      { status: 500 }
    );
  }
}
