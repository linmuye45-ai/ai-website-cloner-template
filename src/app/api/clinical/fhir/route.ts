import { NextResponse } from "next/server";
import { getClinicalDb } from "@/server/clinical-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fhirPatient(row: Record<string, unknown>) {
  return {
    resourceType: "Patient",
    id: String(row.id),
    identifier: [
      {
        system: "urn:oid:zhongjing.hospital.mrn",
        value: String(row.mrn),
      },
    ],
    name: [
      {
        use: "official",
        text: String(row.name_zh),
        family: [String(row.name_zh)],
        given: [String(row.name_zh)],
      },
    ],
    gender: row.sex === "F" ? "female" : "male",
    birthDate: "1950-01-01",
  };
}

function fhirEncounter(row: Record<string, unknown>, patientId: string) {
  return {
    resourceType: "Encounter",
    id: `ENC-${row.id}`,
    status: "finished",
    class: { system: "http://terminology.hl7.org/CodeSystem/v3-ActCode", code: "AMB" },
    subject: { reference: `Patient/${patientId}` },
    period: { start: String(row.created_at) },
    type: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: "follow-up",
            display: "Post-discharge follow-up",
          },
        ],
      },
    ],
  };
}

function fhirCondition(row: Record<string, unknown>, icd: { code: string; name: string }) {
  return {
    resourceType: "Condition",
    id: `COND-${row.id}`,
    clinicalStatus: {
      coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }],
    },
    code: {
      coding: [{ system: "http://hl7.org/fhir/sid/icd-10", code: icd.code, display: icd.name }],
      text: icd.name,
    },
    subject: { reference: `Patient/${row.id}` },
  };
}

function fhirObservation(row: Record<string, unknown>) {
  return {
    resourceType: "Observation",
    id: `OBS-${row.id}-egfr`,
    status: "final",
    code: {
      coding: [{ system: "http://loinc.org", code: "62238-1", display: "eGFR" }],
      text: "eGFR",
    },
    subject: { reference: `Patient/${row.id}` },
    valueQuantity: { value: Number(row.egfr), unit: "mL/min/1.73m2" },
    effectiveDateTime: String(row.created_at),
  };
}

function fhirMedicationRequest(
  row: Record<string, unknown>,
  medId: string,
  medName: string,
) {
  return {
    resourceType: "MedicationRequest",
    id: `MED-${row.id}-${medId}`,
    status: "active",
    intent: "order",
    medicationCodeableConcept: {
      text: medName,
    },
    subject: { reference: `Patient/${row.id}` },
    authoredOn: String(row.created_at),
  };
}

function fhirDiagnosticReport(row: Record<string, unknown>) {
  return {
    resourceType: "DiagnosticReport",
    id: `DIAG-${row.id}`,
    status: "final",
    code: {
      coding: [{ system: "http://loinc.org", code: "11502-2", display: "Laboratory report" }],
      text: "Clinical laboratory report",
    },
    subject: { reference: `Patient/${row.id}` },
    effectiveDateTime: String(row.created_at),
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const patientId = url.searchParams.get("patientId");
    const format = url.searchParams.get("format") ?? "json";

    if (!patientId) {
      return NextResponse.json(
        { ok: false, error: "patientId query parameter required" },
        { status: 400 },
      );
    }

    const db = getClinicalDb();
    const row = db
      .prepare("SELECT * FROM patients WHERE id = ?")
      .get(patientId) as Record<string, unknown> | undefined;

    if (!row) {
      return NextResponse.json(
        { ok: false, error: `Patient ${patientId} not found` },
        { status: 404 },
      );
    }

    const medIds = JSON.parse(String(row.medications_json || "[]")) as string[];
    const medNames: Record<string, string> = {};
    if (medIds.length > 0) {
      const drugs = db
        .prepare(
          `SELECT id, name_zh, name_en FROM drugs WHERE id IN (${medIds.map(() => "?").join(",")})`,
        )
        .all(...medIds) as Record<string, unknown>[];
      for (const d of drugs) {
        medNames[String(d.id)] = String(d.name_zh);
      }
    }

    const bundle = {
      resourceType: "Bundle",
      id: `FHIR-BUNDLE-${patientId}`,
      type: "collection",
      timestamp: new Date().toISOString(),
      entry: [
        { fullUrl: `Patient/${patientId}`, resource: fhirPatient(row) },
        { fullUrl: `Encounter/ENC-${row.id}`, resource: fhirEncounter(row, patientId) },
        { fullUrl: `Condition/COND-${row.id}`, resource: fhirCondition(row, { code: String(row.icd10_code), name: String(row.diagnosis_zh) }) },
        { fullUrl: `Observation/OBS-${row.id}-egfr`, resource: fhirObservation(row) },
        ...medIds.map((mId) => ({
          fullUrl: `MedicationRequest/MED-${row.id}-${mId}`,
          resource: fhirMedicationRequest(row, mId, medNames[mId] || mId),
        })),
        { fullUrl: `DiagnosticReport/DIAG-${row.id}`, resource: fhirDiagnosticReport(row) },
      ],
    };

    const contentType = format === "xml" ? "application/fhir+xml" : "application/fhir+json";
    return new NextResponse(JSON.stringify(bundle, null, 2), {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "FHIR error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      patientId?: string;
      resourceTypes?: string[];
    };

    if (!body.patientId) {
      return NextResponse.json(
        { ok: false, error: "patientId required" },
        { status: 400 },
      );
    }

    const patientId = body.patientId;
    const db = getClinicalDb();
    const row = db
      .prepare("SELECT * FROM patients WHERE id = ?")
      .get(patientId) as Record<string, unknown> | undefined;

    if (!row) {
      return NextResponse.json(
        { ok: false, error: `Patient ${patientId} not found` },
        { status: 404 },
      );
    }

    const requested = body.resourceTypes || [
      "Patient",
      "Encounter",
      "Condition",
      "Observation",
      "MedicationRequest",
      "DiagnosticReport",
    ];

    const entry: Array<{ fullUrl: string; resource: Record<string, unknown> }> = [];

    if (requested.includes("Patient")) {
      entry.push({ fullUrl: `Patient/${patientId}`, resource: fhirPatient(row) });
    }
    if (requested.includes("Encounter")) {
      entry.push({ fullUrl: `Encounter/ENC-${row.id}`, resource: fhirEncounter(row, patientId) });
    }
    if (requested.includes("Condition")) {
      entry.push({
        fullUrl: `Condition/COND-${row.id}`,
        resource: fhirCondition(row, { code: String(row.icd10_code), name: String(row.diagnosis_zh) }),
      });
    }
    if (requested.includes("Observation")) {
      entry.push({ fullUrl: `Observation/OBS-${row.id}-egfr`, resource: fhirObservation(row) });
    }
    if (requested.includes("MedicationRequest")) {
      const medIds = JSON.parse(String(row.medications_json || "[]")) as string[];
      const medNames: Record<string, string> = {};
      if (medIds.length > 0) {
        const drugs = db
          .prepare(
            `SELECT id, name_zh FROM drugs WHERE id IN (${medIds.map(() => "?").join(",")})`,
          )
          .all(...medIds) as Record<string, unknown>[];
        for (const d of drugs) {
          medNames[String(d.id)] = String(d.name_zh);
        }
      }
      for (const mId of medIds) {
        entry.push({
          fullUrl: `MedicationRequest/MED-${row.id}-${mId}`,
          resource: fhirMedicationRequest(row, mId, medNames[mId] || mId),
        });
      }
    }
    if (requested.includes("DiagnosticReport")) {
      entry.push({ fullUrl: `DiagnosticReport/DIAG-${row.id}`, resource: fhirDiagnosticReport(row) });
    }

    const bundle = {
      resourceType: "Bundle",
      id: `FHIR-BUNDLE-${patientId}-${Date.now()}`,
      type: "collection",
      timestamp: new Date().toISOString(),
      entry,
    };

    return NextResponse.json({ ok: true, bundle, count: entry.length });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "FHIR error" },
      { status: 500 },
    );
  }
}
