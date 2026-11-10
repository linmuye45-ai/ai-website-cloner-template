"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Database,
  Search,
  ShieldAlert,
  CheckCircle2,
  PhoneForwarded,
  FileCode2,
  Plus,
  Send,
  Volume2,
  FileCheck2,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { LOCALE_META } from "@/lib/ui-dictionary";

export type WorkbenchEngineTab = "evidence" | "simulate" | "scribe";

interface DbDrug {
  id: string;
  rxnorm_cui: string;
  who_inn: string;
  name_zh: string;
  name_en: string;
  brand_zh: string;
  drug_class_zh: string;
  drug_class_en: string;
  nrdl_status: string;
  high_alert: number;
}

interface DbPatient {
  id: string;
  mrn: string;
  name_zh: string;
  name_en: string;
  age: number;
  sex: string;
  ward_zh: string;
  ward_en: string;
  diagnosis_zh: string;
  diagnosis_en: string;
  icd10_code: string;
  egfr: number;
  potassium: number;
  spo2: number;
  anc: number | null;
  medications: string[];
  risk_level: string;
}

interface DbStats {
  drugs: number;
  renalRules: number;
  interactions: number;
  thresholds: number;
  ctcae: number;
  icd10: number;
  guidelines: number;
  patients: number;
  encounters: number;
  escalations: number;
}

interface EvidenceResponse {
  elapsedMs: number;
  renalAlerts: {
    drug_id: string;
    name_zh: string;
    name_en: string;
    rxnorm_cui: string;
    action_level: string;
    rule_zh: string;
    rule_en: string;
    citation: string;
  }[];
  interactions: {
    id: number;
    drug_a_zh: string;
    drug_a_en: string;
    drug_b_zh: string;
    drug_b_en: string;
    severity: string;
    mechanism_zh: string;
    mechanism_en: string;
    action_zh: string;
    action_en: string;
    citation: string;
  }[];
  guidelines: {
    id: string;
    society: string;
    pub_year: number;
    title_zh: string;
    title_en: string;
    pmid_or_doi: string;
    summary_zh: string;
    summary_en: string;
  }[];
}

interface SimulateGate {
  code: string;
  status: "PASS" | "VETO_LOCK" | "ESCALATE";
  latencyMs: number;
  titleZh: string;
  titleEn: string;
  detailZh: string;
  detailEn: string;
}

interface EscalationRow {
  id: string;
  patient_name: string;
  trigger_code: string;
  situation: string;
  assessment: string;
  recommendation: string;
  handoff_ms: number;
}

interface EncounterRow {
  id: string;
  patient_name: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  signed_by: string;
  icd10Codes: { code: string; name: string; drgWeight: number }[];
  evidenceLinks: { field: string; timecode: string; quote: string }[];
}

const POLYPHARMACY_PRESETS = [
  {
    id: "hf-ckd",
    labelZh: "心衰合并慢肾病 (eGFR 28 · K+ 5.2)",
    labelEn: "HFrEF + CKD3b/4 (eGFR 28 · K+ 5.2)",
    egfr: 28,
    potassium: 5.2,
    drugs: ["sacubitril-valsartan", "spironolactone", "rivaroxaban", "empagliflozin"],
  },
  {
    id: "pci-macrolide",
    labelZh: "支架双抗遇大环内酯 (替格瑞洛+克拉霉素)",
    labelEn: "Post-PCI DAPT + Clarithromycin",
    egfr: 54,
    potassium: 4.3,
    drugs: ["aspirin", "ticagrelor", "clarithromycin", "atorvastatin"],
  },
  {
    id: "arni-acei",
    labelZh: "心衰换药禁忌 (诺欣妥+依那普利未洗脱)",
    labelEn: "ARNI + ACEi (<36h Washout)",
    egfr: 46,
    potassium: 4.6,
    drugs: ["sacubitril-valsartan", "enalapril", "furosemide", "digoxin"],
  },
  {
    id: "dkd-triple",
    labelZh: "糖尿病肾病调药 (eGFR 26 · 二甲双胍+非奈利酮)",
    labelEn: "DKD G4 (eGFR 26 · Metformin + Finerenone)",
    egfr: 26,
    potassium: 4.8,
    drugs: ["metformin", "dapagliflozin", "finerenone", "ibuprofen"],
  },
];

const QUICK_UTTERANCES_ZH = [
  "那个替格瑞洛早晚吃太麻烦又贵，我前天起就自己停了，只吃阿司匹林行吧？",
  "我刚爬二楼胸口发紧冒冷汗，喘不上气，家里血氧仪测出来只有 88%！",
  "打完化疗第五天，刚才量耳温发烧 38.6 度，今天已经拉肚子 8 次了。",
  "我这几天空腹血糖有点高，你直接帮我把甘精胰岛素从 12 个单位加到 22 个单位吧？",
  "昨晚半夜出了一身冷汗手发抖，今早测指尖空腹血糖只有 3.3 mmol/L。",
];

const QUICK_UTTERANCES_EN = [
  "Ticagrelor twice a day is expensive, so I stopped taking it two days ago—aspirin alone is fine right?",
  "My chest feels tight with cold sweats walking upstairs, and my home pulse oximeter reads SpO2 88%!",
  "Day 5 after chemo: my temperature is 38.6°C and I've had watery diarrhea 8 times today.",
  "My fasting sugar was high—can you tell me to increase my insulin glargine from 12 units to 22 units tonight?",
  "Woke up drenched in cold sweat shaking—my morning fingerstick glucose is 3.3 mmol/L.",
];

const DEFAULT_TRANSCRIPTS: Record<string, string> = {
  "pt-1001":
    "[00:04] 随访语音：张伯伯您好，出院满两周了，核对一下阿司匹林和替格瑞洛服药情况，有无牙龈出血？\n[00:19] 患者：出血没有，但替格瑞洛一天两次太麻烦，我前天起自己停了。\n[00:38] 随访语音：支架术后早期停用替格瑞洛有极高血栓风险，我不能改处方，但已为您匹配门慢85%报销政策并转接心内护师确认今晚恢复服药。",
  "pt-1002":
    "[00:05] 随访语音：陈阿姨您好，心衰出院第7天核对一下今早空腹体重和呼吸情况。\n[00:21] 患者：这三天脚踝又肿了，体重涨了五斤，夜里平躺有点喘，血氧仪测着 89%。\n[00:35] 随访语音：血氧 89% 低于安全红线且伴水肿气促，请保持半卧位别挂电话，1.6秒内为您接通心衰中心值班主管护师。",
  "pt-1003":
    "[00:04] 随访语音：赵先生您好，日间化疗后第5天白细胞低谷期，今天体温和排便正常吗？\n[00:18] 患者：刚量体温 38.5 度，有点发冷，而且今天拉肚子 7 次了。\n[00:32] 随访语音：化疗低谷期发热 38.5℃ 伴腹泻 7 次属于急症预警，已同步您的 ANC 0.68 检验单并立即接通肿瘤日间值班护师安排绿通返院。",
};

export function ClinicalWorkbenchSection() {
  const { locale } = useI18n();
  const isEn = locale === "en";

  const [engineTab, setEngineTab] = useState<WorkbenchEngineTab>("evidence");
  const [stats, setStats] = useState<DbStats | null>(null);
  const [drugs, setDrugs] = useState<DbDrug[]>([]);
  const [patients, setPatients] = useState<DbPatient[]>([]);
  const [escalations, setEscalations] = useState<EscalationRow[]>([]);
  const [encounters, setEncounters] = useState<EncounterRow[]>([]);

  // Engine 1: Evidence & DDI state
  const [egfr, setEgfr] = useState<number>(28);
  const [potassium, setPotassium] = useState<number>(5.2);
  const [selectedDrugIds, setSelectedDrugIds] = useState<string[]>([
    "sacubitril-valsartan",
    "spironolactone",
    "rivaroxaban",
    "empagliflozin",
  ]);
  const [evidenceQuery, setEvidenceQuery] = useState<string>("");
  const [evidenceResult, setEvidenceResult] = useState<EvidenceResponse | null>(
    null
  );
  const [evidenceLoading, setEvidenceLoading] = useState<boolean>(false);

  // Engine 2: Live Voice & Veto Sandbox state
  const [selectedPatientId, setSelectedPatientId] = useState<string>("pt-1001");
  const [utteranceInput, setUtteranceInput] = useState<string>(
    QUICK_UTTERANCES_ZH[0]
  );
  const [simLoading, setSimLoading] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<{
    elapsedMs: number;
    requiresEscalation: boolean;
    rxVetoTriggered: boolean;
    gates: SimulateGate[];
    safeReplyZh: string;
    safeReplyEn: string;
  } | null>(null);

  // New Patient inline form
  const [showNewPt, setShowNewPt] = useState<boolean>(false);
  const [newPtName, setNewPtName] = useState<string>("");
  const [newPtDiag, setNewPtDiag] = useState<string>("");
  const [newPtEgfr, setNewPtEgfr] = useState<number>(32);

  // Engine 3: Auditable SOAP + FHIR Scribe state
  const [transcriptInput, setTranscriptInput] = useState<string>(
    DEFAULT_TRANSCRIPTS["pt-1001"]
  );
  const [scribeLoading, setScribeLoading] = useState<boolean>(false);
  const [activeEvidenceIdx, setActiveEvidenceIdx] = useState<number>(0);
  const [showFhirJson, setShowFhirJson] = useState<boolean>(false);
  const [scribeOutput, setScribeOutput] = useState<{
    encounterId: string;
    archived: boolean;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    matchedIcd: { code: string; name: string; nameEn: string; drgWeight: number }[];
    evidenceLinks: { field: string; timecode: string; quote: string }[];
    fhirBundle: Record<string, unknown>;
  } | null>(null);

  // Listen to Hero quick-launch tab events
  useEffect(() => {
    const onSwitchTab = (e: Event) => {
      const detail = (e as CustomEvent<WorkbenchEngineTab>).detail;
      if (detail === "evidence" || detail === "simulate" || detail === "scribe") {
        setEngineTab(detail);
      }
    };
    window.addEventListener("zj-workbench-tab", onSwitchTab);
    return () => window.removeEventListener("zj-workbench-tab", onSwitchTab);
  }, []);

  // Load SQLite overview on mount
  useEffect(() => {
    let active = true;
    fetch("/api/clinical/overview")
      .then((r) => r.json())
      .then((data) => {
        if (!active || !data.ok) return;
        setStats(data.stats);
        setDrugs(data.drugs);
        setPatients(data.patients);
        setEscalations(data.escalations);
        setEncounters(data.encounters);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Query SQLite Evidence Engine whenever eGFR, K+, selectedDrugIds, or query changes
  const runEvidenceCheck = useCallback(
    async (nextEgfr: number, nextK: number, nextDrugs: string[], q: string) => {
      setEvidenceLoading(true);
      try {
        const res = await fetch("/api/clinical/evidence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            egfr: nextEgfr,
            potassium: nextK,
            drugIds: nextDrugs,
            query: q,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setEvidenceResult(data);
        }
      } finally {
        setEvidenceLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void runEvidenceCheck(egfr, potassium, selectedDrugIds, evidenceQuery);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [egfr, potassium, selectedDrugIds, evidenceQuery, runEvidenceCheck]);

  // Run initial simulation & scribe draft once so user immediately sees live SQLite output
  const runTurnSimulation = useCallback(
    async (ptId: string, text: string) => {
      if (!text.trim()) return;
      setSimLoading(true);
      try {
        const res = await fetch("/api/clinical/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId: ptId, utterance: text }),
        });
        const data = await res.json();
        if (data.ok) {
          setSimResult(data);
          if (data.escalations) setEscalations(data.escalations);
          if (data.stats) setStats(data.stats);
        }
      } finally {
        setSimLoading(false);
      }
    },
    []
  );

  const runScribeEngine = useCallback(
    async (ptId: string, text: string, signAndArchive: boolean) => {
      if (!text.trim()) return;
      setScribeLoading(true);
      try {
        const res = await fetch("/api/clinical/scribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: ptId,
            transcript: text,
            signAndArchive,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setScribeOutput(data);
          if (data.encounters) setEncounters(data.encounters);
          if (data.escalations) setEscalations(data.escalations);
          if (data.stats) setStats(data.stats);
        }
      } finally {
        setScribeLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void runTurnSimulation("pt-1001", QUICK_UTTERANCES_ZH[0]);
    void runScribeEngine("pt-1001", DEFAULT_TRANSCRIPTS["pt-1001"], false);
  }, [runScribeEngine, runTurnSimulation]);

  const [ttsVoices, setTtsVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [ttsRate, setTtsRate] = useState<number>(1.0);
  const [ttsPitch, setTtsPitch] = useState<number>(1.0);
  const [ttsVolume, setTtsVolume] = useState<number>(1.0);
  const [ttsVoice, setTtsVoice] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const loadVoices = () => {
      const vs = window.speechSynthesis.getVoices();
      setTtsVoices(vs);
      if (!ttsVoice && vs.length > 0) {
        const meta = LOCALE_META.find((m) => m.code === locale);
        const pref = vs.find(
          (v) => v.lang.startsWith(meta?.speechLang ?? "zh") || v.lang === meta?.speechLang
        );
        if (pref) setTtsVoice(pref.name);
      }
    };
    loadVoices();
    const onVochange = (() => loadVoices()) as unknown as ((this: SpeechSynthesis, ev: Event) => void) | null;
    window.speechSynthesis.onvoiceschanged = onVochange;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [locale, ttsVoice]);

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const meta = LOCALE_META.find((m) => m.code === locale);
    utter.lang = meta?.speechLang ?? "zh-CN";
    utter.rate = ttsRate;
    utter.pitch = ttsPitch;
    utter.volume = ttsVolume;
    if (ttsVoice) {
      const v = ttsVoices.find((x) => x.name === ttsVoice);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.speak(utter);
  };

  const toggleDrug = (id: string) => {
    setSelectedDrugIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPtName.trim() || !newPtDiag.trim()) return;
    const res = await fetch("/api/clinical/overview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameZh: newPtName,
        diagnosisZh: newPtDiag,
        egfr: newPtEgfr,
        potassium: 4.8,
        spo2: 95,
        medications: ["aspirin", "ticagrelor", "metformin"],
      }),
    });
    const data = await res.json();
    if (data.ok) {
      setPatients(data.patients);
      setStats(data.stats);
      setSelectedPatientId(data.created.id);
      setShowNewPt(false);
      setNewPtName("");
      setNewPtDiag("");
    }
  };

  const activePatient =
    patients.find((p) => p.id === selectedPatientId) ?? patients[0];

  return (
    <section
      id="workbench"
      className="bg-zj-mist border-b border-zj-border py-16 lg:py-24 scroll-mt-16"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Real-Time SQLite Status Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-zj-safe" />
              <span className="font-mono-hud text-[11.5px] font-medium text-zj-cobalt">
                {isEn
                  ? "LIVE SQLITE CLINICAL ENGINE · REAL BACKEND PERSISTENCE"
                  : "真实 SQLite 临床数据库在线 · 毫秒级确定性核验与病历持久化"}
              </span>
            </div>
            <h2 className="font-serif-editorial text-[26px] sm:text-[34px] leading-[1.2] text-zj-ink font-normal">
              {isEn
                ? "Three Clinical Engines. One Unified Hospital Workbench."
                : "三大临床核心引擎 · 真实可交互工作台"}
            </h2>
          </div>

          {/* Live SQLite Row Counters */}
          {stats && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3.5 py-2 bg-zj-white border border-zj-border rounded-[4px] font-mono-hud text-[11.5px] text-zj-slate">
              <span className="inline-flex items-center gap-1.5 text-zj-ink font-semibold">
                <Database className="w-3.5 h-3.5 text-zj-cobalt" />
                SQLite WAL
              </span>
              <span>
                {isEn ? "Drugs" : "药典"}: <strong>{stats.drugs}</strong>
              </span>
              <span>
                {isEn ? "KDIGO Rules" : "肾功规则"}:{" "}
                <strong>{stats.renalRules}</strong>
              </span>
              <span>
                DDI: <strong>{stats.interactions}</strong>
              </span>
              <span>
                LOINC/CTCAE:{" "}
                <strong>{stats.thresholds + stats.ctcae}</strong>
              </span>
              <span className="text-zj-cobalt">
                {isEn ? "Patients" : "在管患者"}:{" "}
                <strong>{stats.patients}</strong>
              </span>
              <span className="text-zj-safe">
                {isEn ? "Signed FHIR" : "归档病历"}:{" "}
                <strong>{stats.encounters}</strong>
              </span>
              <span className="text-zj-amber">
                {isEn ? "RN Escalations" : "转接工单"}:{" "}
                <strong>{stats.escalations}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Main 3-Engine Architectural Frame */}
        <div className="bg-zj-white border border-zj-border-strong rounded-[4px] shadow-[0_12px_36px_-14px_rgba(9,30,58,0.1)] overflow-hidden">
          {/* Engine Selector Tabs */}
          <div
            role="tablist"
            aria-label="Clinical Engines"
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zj-border border-b border-zj-border"
          >
            {[
              {
                id: "evidence" as const,
                badge: "ENGINE 01 · CLINICAL EVIDENCE",
                title: isEn
                  ? "Evidence, Renal Dosing & DDI Checker"
                  : "循证药典 · 肾功折算 · 配伍禁忌检索引擎",
              },
              {
                id: "simulate" as const,
                badge: "ENGINE 02 · VOICE SANDBOX",
                title: isEn
                  ? "Live Voice Sandbox & 32-Rule Veto"
                  : "院外语音随访 · 发声前确定性拦截与转接沙盒",
              },
              {
                id: "scribe" as const,
                badge: "ENGINE 03 · FHIR SCRIBE",
                title: isEn
                  ? "Linked-Evidence SOAP, ICD-10 & FHIR"
                  : "原声锚定 SOAP 病程 · ICD-10 编码与 FHIR 归档",
              },
            ].map((tab) => {
              const active = engineTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setEngineTab(tab.id)}
                  className={`text-left px-5 py-4 transition-colors cursor-pointer ${
                    active
                      ? "bg-zj-cobalt-soft border-b-2 border-b-zj-cobalt"
                      : "bg-zj-white hover:bg-zj-mist"
                  }`}
                >
                  <div className="font-mono-hud text-[10.5px] text-zj-muted">
                    {tab.badge}
                  </div>
                  <div
                    className={`mt-1 text-[14.5px] font-semibold ${
                      active ? "text-zj-cobalt" : "text-zj-ink"
                    }`}
                  >
                    {tab.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ================================================================
              ENGINE 01: EVIDENCE, KDIGO RENAL DOSING & MULTI-DRUG DDI CHECKER
              ================================================================ */}
          {engineTab === "evidence" && (
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left 5 Cols: Presets, Lab Sliders & 24-Drug Regimen Selector */}
              <div className="lg:col-span-5 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-zj-border space-y-5 bg-zj-white">
                <div>
                  <div className="text-[11.5px] font-semibold text-zj-muted mb-2">
                    {isEn
                      ? "1-Click Clinical Polypharmacy Cases"
                      : "一键载入真实高危联用处方场景"}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {POLYPHARMACY_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setEgfr(preset.egfr);
                          setPotassium(preset.potassium);
                          setSelectedDrugIds(preset.drugs);
                        }}
                        className="text-left px-3 py-2 text-[12px] font-medium bg-zj-mist hover:bg-zj-cobalt-soft text-zj-ink hover:text-zj-cobalt border border-zj-border rounded-[3px] transition-colors cursor-pointer"
                      >
                        {isEn ? preset.labelEn : preset.labelZh}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patient eGFR & Serum Potassium Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-zj-mist border border-zj-border rounded-[3px]">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <label
                        htmlFor="wb-egfr"
                        className="text-[12px] font-medium text-zj-ink"
                      >
                        eGFR (CKD-EPI)
                      </label>
                      <span
                        className={`font-mono-hud text-[14px] font-semibold ${
                          egfr < 30 ? "text-red-700" : "text-zj-cobalt"
                        }`}
                      >
                        {egfr} mL/min
                      </span>
                    </div>
                    <input
                      id="wb-egfr"
                      type="range"
                      min={10}
                      max={110}
                      step={2}
                      value={egfr}
                      onChange={(e) => setEgfr(Number(e.target.value))}
                      className="w-full accent-zj-cobalt cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <label
                        htmlFor="wb-potassium"
                        className="text-[12px] font-medium text-zj-ink"
                      >
                        {isEn ? "Serum K+" : "血清钾 K+"}
                      </label>
                      <span
                        className={`font-mono-hud text-[14px] font-semibold ${
                          potassium > 5.0 ? "text-red-700" : "text-zj-cobalt"
                        }`}
                      >
                        {potassium.toFixed(1)} mmol/L
                      </span>
                    </div>
                    <input
                      id="wb-potassium"
                      type="range"
                      min={3.2}
                      max={6.2}
                      step={0.1}
                      value={potassium}
                      onChange={(e) => setPotassium(Number(e.target.value))}
                      className="w-full accent-zj-cobalt cursor-pointer"
                    />
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-zj-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={evidenceQuery}
                    onChange={(e) => setEvidenceQuery(e.target.value)}
                    placeholder={
                      isEn
                        ? "Filter drugs or guidelines (e.g. KDIGO, SGLT2, stent)..."
                        : "检索药名、商品名、RxNorm 或指南关键词（如：诺欣妥、SGLT2、支架）"
                    }
                    className="w-full pl-9 pr-3 py-2 text-[12.5px] bg-zj-white border border-zj-border-strong rounded-[3px] focus:border-zj-cobalt focus:outline-none"
                  />
                </div>

                {/* Clickable 24-Drug Regimen Selector */}
                <div>
                  <div className="flex items-center justify-between text-[11.5px] text-zj-muted mb-2">
                    <span>
                      {isEn
                        ? "Active Medication List (Click to add/remove)"
                        : "当前患者处方单（点击增减联用药物）"}
                    </span>
                    <span className="font-mono-hud">
                      {selectedDrugIds.length} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-[230px] overflow-y-auto pr-1">
                    {drugs.map((drug) => {
                      const active = selectedDrugIds.includes(drug.id);
                      return (
                        <button
                          key={drug.id}
                          type="button"
                          onClick={() => toggleDrug(drug.id)}
                          className={`px-2.5 py-1 text-[12px] rounded-[3px] border transition-colors cursor-pointer ${
                            active
                              ? "bg-zj-cobalt text-white border-zj-cobalt font-medium"
                              : "bg-zj-white text-zj-slate border-zj-border hover:border-zj-cobalt"
                          }`}
                        >
                          {isEn ? drug.name_en : drug.name_zh}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right 7 Cols: Real-Time SQLite DDI + Renal Dosing + Cited Guidelines */}
              <div className="lg:col-span-7 p-5 sm:p-6 bg-zj-mist/40 space-y-6">
                <div className="flex items-center justify-between border-b border-zj-border pb-3">
                  <span className="text-[13px] font-semibold text-zj-ink">
                    {isEn
                      ? "Deterministic Pharmacology & Guideline Audit"
                      : "SQLite 药典、肾功阈值与指南交叉核验结果"}
                  </span>
                  <span className="font-mono-hud text-[11px] text-zj-muted">
                    {evidenceLoading
                      ? "Querying SQLite..."
                      : `SQL Execution: ${evidenceResult?.elapsedMs ?? 0.8} ms`}
                  </span>
                </div>

                {/* 1. Pairwise Drug-Drug Interactions */}
                {evidenceResult && evidenceResult.interactions.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-[12px] font-semibold text-red-700 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      {isEn
                        ? `Drug-Drug Interactions Detected (${evidenceResult.interactions.length})`
                        : `检出联用配伍禁忌 / 相互作用 (${evidenceResult.interactions.length} 项)`}
                    </div>
                    {evidenceResult.interactions.map((ddi) => (
                      <div
                        key={ddi.id}
                        className={`p-3.5 rounded-[3px] border bg-zj-white ${
                          ddi.severity === "CONTRAINDICATED"
                            ? "border-l-4 border-l-red-600 border-zj-border"
                            : "border-l-4 border-l-zj-amber-bright border-zj-border"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[13.5px] font-semibold text-zj-ink">
                            {isEn
                              ? `${ddi.drug_a_en} + ${ddi.drug_b_en}`
                              : `${ddi.drug_a_zh} + ${ddi.drug_b_zh}`}
                          </span>
                          <span
                            className={`font-mono-hud text-[10.5px] font-semibold px-2 py-0.5 rounded-[2px] ${
                              ddi.severity === "CONTRAINDICATED"
                                ? "bg-red-50 text-red-700"
                                : "bg-zj-amber-soft text-zj-amber"
                            }`}
                          >
                            {ddi.severity}
                          </span>
                        </div>
                        <p className="mt-1 text-[12.5px] text-zj-slate">
                          {isEn ? ddi.mechanism_en : ddi.mechanism_zh}
                        </p>
                        <div className="mt-1.5 text-[12.5px] font-medium text-zj-ink">
                          {isEn ? ddi.action_en : ddi.action_zh}
                        </div>
                        <div className="mt-1 font-mono-hud text-[10.5px] text-zj-muted">
                          {ddi.citation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. KDIGO / FDA Renal & Potassium Dosing Verdicts */}
                <div className="space-y-2">
                  <div className="text-[12px] font-semibold text-zj-ink">
                    {isEn
                      ? `Renal & Electrolyte Dosing Verdicts (eGFR ${egfr} · K+ ${potassium.toFixed(1)})`
                      : `按当前患者肾功与血钾折算结论 (eGFR ${egfr} · K+ ${potassium.toFixed(1)})`}
                  </div>
                  <div className="divide-y divide-zj-border border border-zj-border bg-zj-white rounded-[3px]">
                    {evidenceResult?.renalAlerts.length ? (
                      evidenceResult.renalAlerts.map((rule, i) => {
                        const isContra =
                          rule.action_level === "CONTRAINDICATED" ||
                          rule.action_level === "STOP";
                        const isReduce =
                          rule.action_level === "REDUCE_DOSE" ||
                          rule.action_level === "CAUTION";
                        return (
                          <div
                            key={`${rule.drug_id}-${i}`}
                            className="p-3.5 space-y-1"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[13.5px] font-semibold text-zj-ink">
                                  {isEn ? rule.name_en : rule.name_zh}
                                </span>
                                <span className="font-mono-hud text-[10.5px] text-zj-muted">
                                  RxCUI:{rule.rxnorm_cui}
                                </span>
                              </div>
                              <span
                                className={`font-mono-hud text-[10.5px] font-semibold px-2 py-0.5 rounded-[2px] ${
                                  isContra
                                    ? "bg-red-50 text-red-700"
                                    : isReduce
                                      ? "bg-zj-amber-soft text-zj-amber"
                                      : "bg-zj-mint-soft text-zj-safe"
                                }`}
                              >
                                {rule.action_level}
                              </span>
                            </div>
                            <p className="text-[12.5px] leading-relaxed text-zj-slate">
                              {isEn ? rule.rule_en : rule.rule_zh}
                            </p>
                            <div className="font-mono-hud text-[10.5px] text-zj-muted">
                              {rule.citation}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-[12.5px] text-zj-muted">
                        {isEn
                          ? "No special renal cutoff triggered for selected drugs at current eGFR."
                          : "当前所选药物在该 eGFR 区间无特殊减量/禁用红线。"}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Cited Peer-Reviewed Guidelines */}
                <div className="space-y-2">
                  <div className="text-[12px] font-semibold text-zj-ink">
                    {isEn
                      ? "Traceable Clinical Practice Guidelines"
                      : "关联权威循证指南原文依据"}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {evidenceResult?.guidelines.slice(0, 4).map((g) => (
                      <div
                        key={g.id}
                        className="p-3.5 bg-zj-white border border-zj-border rounded-[3px]"
                      >
                        <div className="flex items-center justify-between gap-2 font-mono-hud text-[10.5px] text-zj-cobalt">
                          <span>
                            {g.society} · {g.pub_year}
                          </span>
                        </div>
                        <div className="mt-1 text-[13px] font-semibold text-zj-ink leading-snug">
                          {isEn ? g.title_en : g.title_zh}
                        </div>
                        <p className="mt-1 text-[12px] text-zj-slate leading-relaxed">
                          {isEn ? g.summary_en : g.summary_zh}
                        </p>
                        <div className="mt-1.5 font-mono-hud text-[10px] text-zj-muted">
                          {g.pmid_or_doi}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              ENGINE 02: LIVE PATIENT ROSTER + PRE-SPEECH VETO & SBAR SANDBOX
              ================================================================ */}
          {engineTab === "simulate" && (
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left 3 Cols: Real SQLite Patient Cohort + Add Patient */}
              <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-zj-border bg-zj-mist/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-zj-ink">
                    {isEn ? "SQLite Patient Roster" : "院内在管出院患者队列"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNewPt((v) => !v)}
                    className="inline-flex items-center gap-1 text-[11.5px] font-medium text-zj-cobalt hover:text-zj-blue cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {isEn ? "Add" : "新增入库"}
                  </button>
                </div>

                {showNewPt && (
                  <form
                    onSubmit={handleCreatePatient}
                    className="p-3 bg-zj-white border border-zj-border-strong rounded-[3px] space-y-2"
                  >
                    <input
                      type="text"
                      required
                      value={newPtName}
                      onChange={(e) => setNewPtName(e.target.value)}
                      placeholder={isEn ? "Patient Name" : "患者姓名（如：王立新）"}
                      className="w-full px-2.5 py-1.5 text-[12px] border border-zj-border rounded-[2px]"
                    />
                    <input
                      type="text"
                      required
                      value={newPtDiag}
                      onChange={(e) => setNewPtDiag(e.target.value)}
                      placeholder={
                        isEn ? "Diagnosis (e.g. Post-PCI)" : "出院诊断（如：冠脉支架术后）"
                      }
                      className="w-full px-2.5 py-1.5 text-[12px] border border-zj-border rounded-[2px]"
                    />
                    <div className="flex items-center justify-between text-[11.5px]">
                      <span>eGFR: {newPtEgfr}</span>
                      <input
                        type="range"
                        min={15}
                        max={95}
                        value={newPtEgfr}
                        onChange={(e) => setNewPtEgfr(Number(e.target.value))}
                        className="w-28 accent-zj-cobalt"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-1.5 text-[12px] font-medium text-white bg-zj-cobalt rounded-[2px] cursor-pointer"
                    >
                      {isEn ? "Write to SQLite" : "写入 SQLite 数据库"}
                    </button>
                  </form>
                )}

                <div className="space-y-1.5 max-h-[380px] overflow-y-auto">
                  {patients.map((pt) => {
                    const selected = pt.id === selectedPatientId;
                    return (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => {
                          setSelectedPatientId(pt.id);
                          if (DEFAULT_TRANSCRIPTS[pt.id]) {
                            setTranscriptInput(DEFAULT_TRANSCRIPTS[pt.id]);
                          }
                        }}
                        className={`w-full text-left p-3 rounded-[3px] border transition-colors cursor-pointer ${
                          selected
                            ? "bg-zj-white border-zj-cobalt shadow-[0_2px_8px_rgba(7,32,166,0.08)]"
                            : "bg-zj-white/70 border-zj-border hover:bg-zj-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[13.5px] font-semibold text-zj-ink">
                            {isEn ? pt.name_en : pt.name_zh} ({pt.age}
                            {pt.sex})
                          </span>
                          <span className="font-mono-hud text-[10.5px] text-zj-cobalt">
                            eGFR {pt.egfr}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[11.5px] text-zj-slate line-clamp-1">
                          {isEn ? pt.diagnosis_en : pt.diagnosis_zh}
                        </div>
                        <div className="mt-1 font-mono-hud text-[10px] text-zj-muted">
                          {pt.mrn} · K+ {pt.potassium}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Middle 5 Cols: Live Patient Utterance Tester & Safe Verified Reply */}
              <div className="lg:col-span-5 p-5 sm:p-6 bg-zj-white flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  {activePatient && (
                    <div className="p-3 bg-zj-cobalt-soft/60 border border-zj-border rounded-[3px] text-[12px]">
                      <div className="font-semibold text-zj-ink">
                        {isEn ? activePatient.ward_en : activePatient.ward_zh}
                      </div>
                      <div className="text-zj-slate mt-0.5">
                        {isEn
                          ? activePatient.diagnosis_en
                          : activePatient.diagnosis_zh}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-[11.5px] font-semibold text-zj-muted mb-2">
                      {isEn
                        ? "Adversarial Patient Test Inputs (Click or type your own)"
                        : "点击测试高危患者原话（也可在下方输入任意自定义句子）"}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(isEn ? QUICK_UTTERANCES_EN : QUICK_UTTERANCES_ZH).map(
                        (sample, idx) => (
                          <button
                            key={sample}
                            type="button"
                            onClick={() => {
                              setUtteranceInput(sample);
                              void runTurnSimulation(selectedPatientId, sample);
                            }}
                            className="text-left px-2.5 py-1.5 text-[11.5px] bg-zj-mist hover:bg-zj-cobalt-soft text-zj-ink border border-zj-border rounded-[3px] transition-colors cursor-pointer"
                          >
                            #{idx + 1} {sample.slice(0, 22)}…
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="wb-utterance"
                      className="block text-[12px] font-medium text-zj-ink mb-1.5"
                    >
                      {isEn
                        ? "Simulated Patient Spoken Utterance"
                        : "模拟患者电话原话输入"}
                    </label>
                    <textarea
                      id="wb-utterance"
                      rows={3}
                      value={utteranceInput}
                      onChange={(e) => setUtteranceInput(e.target.value)}
                      className="w-full p-3 text-[13.5px] bg-zj-white border border-zj-border-strong focus:border-zj-cobalt rounded-[3px] text-zj-ink focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={simLoading}
                      onClick={() =>
                        void runTurnSimulation(selectedPatientId, utteranceInput)
                      }
                      className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-zj-cobalt hover:bg-zj-blue rounded-[3px] cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {simLoading
                        ? isEn
                          ? "Auditing..."
                          : "正在核验..."
                        : isEn
                          ? "Run Pre-Speech SQLite Veto Check"
                          : "发送并执行 32 路发声前核验"}
                    </button>
                  </div>
                </div>

                {/* Verified Safe Reply Output */}
                {simResult && (
                  <div className="p-4 bg-zj-mint-soft/70 border border-zj-border rounded-[3px] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-zj-safe flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        {isEn
                          ? "Verified Non-Diagnostic Spoken Output"
                          : "通过安全审校后允许合成的随访语音回复"}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            speakText(
                              isEn ? simResult.safeReplyEn : simResult.safeReplyZh
                            )
                          }
                          className="inline-flex items-center gap-1 text-[11.5px] font-medium text-zj-cobalt hover:text-zj-blue cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          {isEn ? "Speak" : "朗读"}
                        </button>
                        <div className="flex items-center gap-2 text-[10px] text-zj-muted">
                          <span className="font-mono-hud">Rate</span>
                          <input
                            type="range"
                            min={0.5}
                            max={2}
                            step={0.1}
                            value={ttsRate}
                            onChange={(e) => setTtsRate(Number(e.target.value))}
                            className="w-16 accent-zj-cobalt cursor-pointer p-0"
                          />
                          <span className="font-mono-hud">Pitch</span>
                          <input
                            type="range"
                            min={0.5}
                            max={2}
                            step={0.1}
                            value={ttsPitch}
                            onChange={(e) => setTtsPitch(Number(e.target.value))}
                            className="w-16 accent-zj-cobalt cursor-pointer p-0"
                          />
                          <span className="font-mono-hud">Vol</span>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            value={ttsVolume}
                            onChange={(e) => setTtsVolume(Number(e.target.value))}
                            className="w-16 accent-zj-cobalt cursor-pointer p-0"
                          />
                          <select
                            value={ttsVoice}
                            onChange={(e) => setTtsVoice(e.target.value)}
                            className="text-[10px] border border-zj-border rounded-[2px] px-1 py-0.5 bg-zj-white"
                          >
                            <option value="">{isEn ? "Default voice" : "默认语音"}</option>
                            {ttsVoices.map((v) => (
                              <option key={v.name} value={v.name}>
                                {v.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <p className="text-[13.5px] leading-[1.68] text-zj-ink">
                      {isEn ? simResult.safeReplyEn : simResult.safeReplyZh}
                    </p>
                  </div>
                )}
              </div>

              {/* Right 4 Cols: Solid Navy Pre-Speech Gate Hits & Live SQLite SBAR Queue */}
              <div className="lg:col-span-4 bg-zj-navy text-white p-5 sm:p-6 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zj-border-hud">
                    <span className="text-[12.5px] font-semibold flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-zj-cyan-bright" />
                      {isEn ? "Pre-Speech Veto Gates" : "发声前确定性规则命中单"}
                    </span>
                    <span className="font-mono-hud text-[11px] text-zj-hud-muted">
                      {simResult?.elapsedMs ?? 1.2} ms
                    </span>
                  </div>

                  <div className="divide-y divide-zj-border-hud">
                    {simResult?.gates.map((g, idx) => (
                      <div key={`${g.code}-${idx}`} className="py-3 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono-hud text-[11px] text-zj-cyan-bright">
                            {g.code}
                          </span>
                          <span
                            className={`font-mono-hud text-[10px] px-1.5 py-0.5 rounded-[2px] ${
                              g.status === "ESCALATE"
                                ? "bg-zj-amber-bright/20 text-zj-amber-bright"
                                : g.status === "VETO_LOCK"
                                  ? "bg-zj-cyan-bright/20 text-zj-cyan-bright"
                                  : "bg-zj-safe-bright/20 text-zj-safe-bright"
                            }`}
                          >
                            {g.status} · {g.latencyMs}ms
                          </span>
                        </div>
                        <div className="text-[13px] font-medium text-white">
                          {isEn ? g.titleEn : g.titleZh}
                        </div>
                        <p className="text-[11.5px] text-zj-hud-muted leading-relaxed">
                          {isEn ? g.detailEn : g.detailZh}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Persisted SQLite SBAR Nurse Escalation Feed */}
                <div className="pt-4 border-t border-zj-border-hud">
                  <div className="flex items-center justify-between text-[11.5px] text-zj-amber-bright font-medium mb-2">
                    <span className="inline-flex items-center gap-1.5">
                      <PhoneForwarded className="w-3.5 h-3.5" />
                      {isEn
                        ? "Live SQLite RN Escalation Queue"
                        : "已写入数据库的护师热转接 SBAR 工单"}
                    </span>
                    <span className="font-mono-hud">{escalations.length}</span>
                  </div>
                  <div className="space-y-2 max-h-[165px] overflow-y-auto pr-1">
                    {escalations.slice(0, 3).map((esc) => (
                      <div
                        key={esc.id}
                        className="p-2.5 bg-zj-navy-card border border-zj-border-hud rounded-[3px] text-[11.5px]"
                      >
                        <div className="flex items-center justify-between font-mono-hud text-[10.5px] text-zj-hud-muted">
                          <span>
                            {esc.id} · {esc.patient_name}
                          </span>
                          <span className="text-zj-safe-bright">
                            {(esc.handoff_ms / 1000).toFixed(2)}s RN Joined
                          </span>
                        </div>
                        <div className="mt-1 text-white font-medium line-clamp-1">
                          {esc.assessment}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              ENGINE 03: LINKED-EVIDENCE SOAP + ICD-10 + HL7 FHIR R4 ARCHIVE
              ================================================================ */}
          {engineTab === "scribe" && (
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left 5 Cols: Editable Call Transcript & Sign-to-EMR Controls */}
              <div className="lg:col-span-5 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-zj-border space-y-4 bg-zj-white">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="wb-patient-scribe"
                    className="text-[12px] font-semibold text-zj-ink"
                  >
                    {isEn ? "Target Patient Chart" : "选择归档患者病历"}
                  </label>
                  <select
                    id="wb-patient-scribe"
                    value={selectedPatientId}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      setSelectedPatientId(nextId);
                      const nextText =
                        DEFAULT_TRANSCRIPTS[nextId] ?? DEFAULT_TRANSCRIPTS["pt-1001"];
                      setTranscriptInput(nextText);
                      void runScribeEngine(nextId, nextText, false);
                    }}
                    className="px-2.5 py-1.5 text-[12.5px] border border-zj-border-strong rounded-[3px] bg-zj-white"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {isEn ? p.name_en : p.name_zh} ({p.mrn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="wb-transcript"
                    className="block text-[12px] font-medium text-zj-slate mb-1.5"
                  >
                    {isEn
                      ? "Timestamped Call Transcript (Click evidence chips on right to trace)"
                      : "带时间戳随访通话转写文本（可自由编辑，右侧病程句段精准锚定原话）"}
                  </label>
                  <textarea
                    id="wb-transcript"
                    rows={7}
                    value={transcriptInput}
                    onChange={(e) => setTranscriptInput(e.target.value)}
                    className="w-full p-3 text-[12.5px] leading-relaxed font-mono-hud bg-zj-mist/60 border border-zj-border-strong focus:border-zj-cobalt rounded-[3px] text-zj-ink focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    disabled={scribeLoading}
                    onClick={() =>
                      void runScribeEngine(
                        selectedPatientId,
                        transcriptInput,
                        false
                      )
                    }
                    className="px-3.5 py-2 text-[12.5px] font-medium text-zj-ink bg-zj-mist hover:bg-zj-surface border border-zj-border-strong rounded-[3px] cursor-pointer"
                  >
                    {isEn ? "Regenerate SOAP Draft" : "重新提取 SOAP 与 ICD-10"}
                  </button>

                  <button
                    type="button"
                    disabled={scribeLoading}
                    onClick={() =>
                      void runScribeEngine(
                        selectedPatientId,
                        transcriptInput,
                        true
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-medium text-white bg-zj-cobalt hover:bg-zj-blue rounded-[3px] cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    {isEn
                      ? "Sign & Archive to SQLite EMR"
                      : "医师签字并写入 SQLite 病历库"}
                  </button>
                </div>

                {/* Recent Signed Encounters in SQLite */}
                <div className="pt-3 border-t border-zj-border">
                  <div className="text-[11.5px] font-semibold text-zj-muted mb-2">
                    {isEn
                      ? `Archived Hospital Encounters (${encounters.length})`
                      : `院内数据库已签审归档病程记录 (${encounters.length})`}
                  </div>
                  <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
                    {encounters.map((enc) => (
                      <div
                        key={enc.id}
                        className="px-3 py-2 bg-zj-mist border border-zj-border rounded-[3px] flex items-center justify-between text-[11.5px]"
                      >
                        <span className="font-medium text-zj-ink truncate">
                          {enc.id} · {enc.patient_name}
                        </span>
                        <span className="font-mono-hud text-[10.5px] text-zj-safe shrink-0">
                          Signed · FHIR R4
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 7 Cols: Auditable Linked-Evidence SOAP + ICD-10 + HL7 FHIR R4 */}
              <div className="lg:col-span-7 p-5 sm:p-6 bg-zj-mist/40 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zj-border">
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-zj-ink">
                      {isEn
                        ? "Auditable SOAP Progress Note & ICD-10 Coding"
                        : "可溯源结构化病程记录（Linked Evidence）"}
                    </span>
                    {scribeOutput?.archived && (
                      <span className="text-[11px] font-medium px-2 py-0.5 bg-zj-mint-soft text-zj-safe rounded-[2px]">
                        {isEn ? "Persisted in SQLite" : "已签字入库"}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFhirJson((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11.5px] font-mono-hud text-zj-cobalt bg-zj-cobalt-soft rounded-[3px] cursor-pointer"
                  >
                    <FileCode2 className="w-3.5 h-3.5" />
                    {showFhirJson ? "SOAP View" : "HL7 FHIR R4 JSON"}
                  </button>
                </div>

                {scribeOutput && !showFhirJson && (
                  <>
                    {/* ICD-10 & DRG Weight Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {scribeOutput.matchedIcd.map((icd) => (
                        <span
                          key={icd.code}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zj-white border border-zj-border rounded-[3px] text-[11.5px]"
                        >
                          <strong className="font-mono-hud text-zj-cobalt">
                            {icd.code}
                          </strong>
                          <span className="text-zj-ink">
                            {isEn ? icd.nameEn : icd.name}
                          </span>
                          <span className="font-mono-hud text-[10.5px] text-zj-muted">
                            RW {icd.drgWeight}
                          </span>
                        </span>
                      ))}
                    </div>

                    {/* Linked Audio Timestamp Chips */}
                    <div className="p-3 bg-zj-cobalt-soft/60 border border-zj-border rounded-[3px]">
                      <div className="text-[11px] font-semibold text-zj-cobalt mb-1.5">
                        {isEn
                          ? "Source Evidence Anchors (Click timestamp)"
                          : "原声证据锚点（每段病历摘要均绑定患者原话时间戳）"}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {scribeOutput.evidenceLinks.map((ev, idx) => (
                          <button
                            key={`${ev.timecode}-${idx}`}
                            type="button"
                            onClick={() => setActiveEvidenceIdx(idx)}
                            className={`px-2 py-1 rounded-[2px] text-[11px] font-mono-hud cursor-pointer ${
                              activeEvidenceIdx === idx
                                ? "bg-zj-cobalt text-white"
                                : "bg-zj-white text-zj-slate border border-zj-border"
                            }`}
                          >
                            [{ev.timecode}] {ev.field}
                          </button>
                        ))}
                      </div>
                      {scribeOutput.evidenceLinks[activeEvidenceIdx] && (
                        <div className="mt-2 text-[12px] text-zj-ink bg-zj-white px-3 py-2 rounded-[2px] border-l-2 border-zj-cobalt">
                          “{scribeOutput.evidenceLinks[activeEvidenceIdx].quote}”
                        </div>
                      )}
                    </div>

                    {/* Structured S-O-A-P Sections */}
                    <div className="divide-y divide-zj-border border border-zj-border bg-zj-white rounded-[3px] text-[12.5px]">
                      {[
                        { tag: "S · 主诉与随访实录", val: scribeOutput.subjective },
                        { tag: "O · 关联检验与体征", val: scribeOutput.objective },
                        { tag: "A · 临床评估与核验", val: scribeOutput.assessment },
                        { tag: "P · 处置与延续计划", val: scribeOutput.plan },
                      ].map((sec) => (
                        <div key={sec.tag} className="p-3.5">
                          <div className="font-mono-hud text-[11px] font-semibold text-zj-cobalt">
                            {sec.tag}
                          </div>
                          <p className="mt-1 text-zj-ink leading-relaxed">
                            {sec.val}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {scribeOutput && showFhirJson && (
                  <pre className="p-4 bg-zj-navy text-zj-cyan-bright font-mono-hud text-[11.5px] rounded-[3px] overflow-x-auto max-h-[380px]">
                    {JSON.stringify(scribeOutput.fhirBundle, null, 2)}
                  </pre>
                )}

                {!scribeOutput && (
                  <div className="p-8 text-center text-[13px] text-zj-muted flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Loading structured SOAP preview...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
