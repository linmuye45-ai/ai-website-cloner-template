import { NextResponse } from "next/server";
import { getClinicalDb } from "@/server/clinical-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Base payment points per DRG weight unit (CNY) by hospital tier.
// Reflects China NRDL / DRG-DIP differential reimbursement tiers.
const BASE_POINTS_BY_TIER: Record<string, number> = {
  clinic: 2200,
  "tier-1": 2600,
  "tier-2": 3000,
  "tier-3a": 3400,
  "tier-3b": 3100,
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      icd10_code?: string;
      age?: number;
      discharge_days?: number;
      hospital_tier?: string;
      procedures?: string[];
    };

    if (!body.icd10_code) {
      return NextResponse.json(
        { ok: false, error: "icd10_code required" },
        { status: 400 }
      );
    }

    const db = getClinicalDb();
    const row = db
      .prepare(
        "SELECT code, name_zh, name_en, drg_weight FROM icd10_codes WHERE code = ?"
      )
      .get(body.icd10_code) as
      | { code: string; name_zh: string; name_en: string; drg_weight: number }
      | undefined;

    if (!row) {
      return NextResponse.json(
        { ok: false, error: `ICD-10 code ${body.icd10_code} not found` },
        { status: 404 }
      );
    }

    const tier = body.hospital_tier || "tier-2";
    const basePoints = BASE_POINTS_BY_TIER[tier] ?? BASE_POINTS_BY_TIER["tier-2"];
    const drgWeight = row.drg_weight;
    const age = Math.max(0, Math.min(120, Number(body.age ?? 55)));
    const days = Math.max(1, Math.min(60, Number(body.discharge_days ?? 7)));

    // Age adjustment factor: pediatric & geriatric cases carry higher resource weight.
    let ageFactor = 1.0;
    if (age < 18) ageFactor = 1.15;
    else if (age > 75) ageFactor = 1.25;
    else if (age > 65) ageFactor = 1.1;

    // DRG base payment
    const basePayment = basePoints * drgWeight * ageFactor;

    // Excess bed-day top-up (beyond typical 7-day stay for this DRG weight band)
    const typicalStay = Math.ceil(5 + drgWeight * 2);
    const excessDays = Math.max(0, days - typicalStay);
    const excessDaySurcharge = excessDays * basePoints * 0.35 * ageFactor;

    const grossPayment = basePayment + excessDaySurcharge;
    // Co-payment / patient share (simplified: 10% for urban employee insurance)
    const patientShare = Math.round(grossPayment * 0.1);
    const insurancePayment = Math.round(grossPayment - patientShare);

    const drgGroup = `DRG-${row.code.replace(".", "")}-W${drgWeight.toFixed(2)}`;

    return NextResponse.json({
      ok: true,
      icd10: {
        code: row.code,
        name_zh: row.name_zh,
        name_en: row.name_en,
        drg_weight: drgWeight,
      },
      drg_group: drgGroup,
      typical_stay_days: typicalStay,
      excess_days: excessDays,
      age_factor: ageFactor,
      base_points: basePoints,
      tier,
      payments: {
        gross_cny: Math.round(grossPayment),
        insurance_cny: insurancePayment,
        patient_cny: patientShare,
      },
      breakdown_zh: [
        `DRG 病组权重：${drgWeight.toFixed(2)}`,
        `基础付费点数（${tier}）：${basePoints} 元/点`,
        `年龄调整系数：${ageFactor.toFixed(2)}`,
        `基础 DRG 付费：${Math.round(basePayment)} 元`,
        `超额床日：${excessDays} 天，附加 ${Math.round(excessDaySurcharge)} 元`,
        `医保支付：${insurancePayment} 元`,
        `患者自付（约10%）：${patientShare} 元`,
      ],
      breakdown_en: [
        `DRG weight: ${drgWeight.toFixed(2)}`,
        `Base points (${tier}): ¥${basePoints}/point`,
        `Age adjustment factor: ${ageFactor.toFixed(2)}`,
        `Base DRG payment: ¥${Math.round(basePayment)}`,
        `Excess bed-days: ${excessDays} days, surcharge ¥${Math.round(excessDaySurcharge)}`,
        `Insurance payment: ¥${insurancePayment}`,
        `Patient co-pay (~10%): ¥${patientShare}`,
      ],
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "DRG-DIP error" },
      { status: 500 }
    );
  }
}
