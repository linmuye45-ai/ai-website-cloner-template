import { NextResponse } from "next/server";
import { getDatabaseOverview, simulateClinicalTurn } from "@/server/clinical-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      patientId?: string;
      utterance?: string;
    };

    if (!body.patientId || !body.utterance?.trim()) {
      return NextResponse.json(
        { ok: false, error: "patientId and utterance required" },
        { status: 400 }
      );
    }

    const result = simulateClinicalTurn({
      patientId: body.patientId,
      utterance: body.utterance,
    });
    const overview = getDatabaseOverview();

    return NextResponse.json({
      ok: true,
      ...result,
      escalations: overview.escalations,
      stats: overview.stats,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Simulation error" },
      { status: 500 }
    );
  }
}
