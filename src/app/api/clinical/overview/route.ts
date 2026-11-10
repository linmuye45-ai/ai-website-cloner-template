import { NextResponse } from "next/server";
import { createPatientRecord, getDatabaseOverview } from "@/server/clinical-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = getDatabaseOverview();
    return NextResponse.json({ ok: true, ...data });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "DB error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      nameZh?: string;
      age?: number;
      sex?: "M" | "F";
      wardZh?: string;
      diagnosisZh?: string;
      egfr?: number;
      potassium?: number;
      spo2?: number;
      medications?: string[];
    };

    if (!body.nameZh || !body.diagnosisZh) {
      return NextResponse.json(
        { ok: false, error: "Missing patient name or diagnosis" },
        { status: 400 }
      );
    }

    const created = createPatientRecord({
      nameZh: body.nameZh,
      age: Number(body.age || 65),
      sex: body.sex === "F" ? "F" : "M",
      wardZh: body.wardZh || "心内科病房 · 出院第3天",
      diagnosisZh: body.diagnosisZh,
      egfr: Number(body.egfr ?? 45),
      potassium: Number(body.potassium ?? 4.4),
      spo2: Number(body.spo2 ?? 96),
      medications: Array.isArray(body.medications) ? body.medications : ["aspirin"],
    });

    const overview = getDatabaseOverview();
    return NextResponse.json({ ok: true, created, ...overview });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Create failed" },
      { status: 500 }
    );
  }
}
