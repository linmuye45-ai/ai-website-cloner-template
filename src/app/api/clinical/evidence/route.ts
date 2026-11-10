import { NextResponse } from "next/server";
import { evaluateClinicalEvidence } from "@/server/clinical-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      query?: string;
      egfr?: number;
      potassium?: number;
      drugIds?: string[];
    };

    const result = evaluateClinicalEvidence({
      query: body.query ?? "",
      egfr: Number(body.egfr ?? 36),
      potassium: Number(body.potassium ?? 4.6),
      drugIds: Array.isArray(body.drugIds) ? body.drugIds : [],
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Evidence error" },
      { status: 500 }
    );
  }
}
