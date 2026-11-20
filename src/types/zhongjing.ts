export type Locale = "zh-CN" | "zh-TW" | "en" | "ja";

export type SovereignNodeId = "CN-BJ" | "CN-SH" | "CN-GBA";

export interface SovereignNode {
  id: SovereignNodeId;
  code: string;
  latency: string;
  label: Record<Locale, string>;
  complianceTag: Record<Locale, string>;
}

export interface CallCheckpoint {
  atIndex: number;
  supervisorCode: string;
  status: "PASS" | "PROBE" | "ESCALATE";
  latencyMs: number;
  label: Record<Locale, string>;
  detail: Record<Locale, string>;
}

export interface CallUtterance {
  speaker: "agent" | "patient" | "nurse";
  timecode: string;
  text: Record<Locale, string>;
}

export interface ClinicalCallScenario {
  id: "persuasion" | "escalation" | "empathy" | "memory";
  code: string;
  dimension: Record<Locale, string>;
  title: Record<Locale, string>;
  hospitalContext: Record<Locale, string>;
  patientProfile: Record<Locale, string>;
  durationLabel: string;
  pitchHz: number;
  utterances: CallUtterance[];
  checkpoints: CallCheckpoint[];
  outcomeMetric: Record<Locale, string>;
}

export type AgentSector = "all" | "provider" | "payor" | "pharma";

export interface ClinicalAgentItem {
  id: string;
  code: string;
  sector: Exclude<AgentSector, "all">;
  specialtyKey: string;
  goalKey: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  kpiHighlight: Record<Locale, string>;
  emrProtocol: string;
  activeSupervisors: number;
  avgCallDuration: string;
  sopSteps: Record<Locale, string[]>;
  sampleOpening: Record<Locale, string>;
}

export interface ConstellationSupervisorNode {
  id: string;
  code: string;
  angleDeg: number;
  orbitRadius: number;
  paramsLabel: string;
  latencyMs: number;
  passRate: string;
  name: Record<Locale, string>;
  role: Record<Locale, string>;
  deterministicRule: Record<Locale, string>;
}

export interface ZiWeiModelTier {
  id: "ultra" | "pro" | "flash" | "nano";
  badge: string;
  name: Record<Locale, string>;
  tagline: Record<Locale, string>;
  creditsPerHr: string;
  priceDisplay: Record<Locale, string>;
  priceUnit: Record<Locale, string>;
  latencySla: string;
  supervisorsActive: string;
  workloads: Record<Locale, string[]>;
  highlighted?: boolean;
}

export interface SafetyBenchmarkItem {
  id: string;
  modelName: Record<Locale, string>;
  paramsTag: string;
  correctAdvicePct: number;
  benignDeviationPct: number;
  minorHarmPct: number;
  severeHarmPct: number;
  isFlagship?: boolean;
  isHumanBaseline?: boolean;
}

export interface ResearchPaperItem {
  id: string;
  date: string;
  category: "safety" | "speech" | "inference" | "benchmarks";
  code: string;
  title: Record<Locale, string>;
  abstract: Record<Locale, string>;
  clinicalPartner: Record<Locale, string>;
  metricBadge: Record<Locale, string>;
}

export interface ExecutiveTestimonial {
  id: string;
  image: string;
  quote: Record<Locale, string>;
  name: Record<Locale, string>;
  role: Record<Locale, string>;
  institution: Record<Locale, string>;
  impactStat: Record<Locale, string>;
}

export interface ComplianceBadgeItem {
  id: string;
  code: string;
  title: Record<Locale, string>;
  authority: Record<Locale, string>;
  scope: Record<Locale, string>;
}
