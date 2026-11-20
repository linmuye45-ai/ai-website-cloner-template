-- Migration 001: Initial clinical schema
-- Creates all core tables for the ZhongJing Clinical AI OS

CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS drugs (
  id TEXT PRIMARY KEY,
  rxnorm_cui TEXT NOT NULL,
  who_inn TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  brand_zh TEXT NOT NULL,
  drug_class_zh TEXT NOT NULL,
  drug_class_en TEXT NOT NULL,
  nrdl_status TEXT NOT NULL,
  high_alert INTEGER NOT NULL DEFAULT 0,
  aliases TEXT NOT NULL,
  cessation_risk_zh TEXT NOT NULL,
  cessation_risk_en TEXT NOT NULL,
  monitoring_zh TEXT NOT NULL,
  monitoring_en TEXT NOT NULL,
  authority_ref TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS renal_dosing_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  drug_id TEXT NOT NULL REFERENCES drugs(id),
  egfr_min REAL NOT NULL,
  egfr_max REAL NOT NULL,
  k_max REAL,
  action_level TEXT NOT NULL,
  rule_zh TEXT NOT NULL,
  rule_en TEXT NOT NULL,
  citation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS drug_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  drug_a TEXT NOT NULL REFERENCES drugs(id),
  drug_b TEXT NOT NULL REFERENCES drugs(id),
  severity TEXT NOT NULL,
  mechanism_zh TEXT NOT NULL,
  mechanism_en TEXT NOT NULL,
  action_zh TEXT NOT NULL,
  action_en TEXT NOT NULL,
  citation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS critical_thresholds (
  id TEXT PRIMARY KEY,
  loinc_code TEXT NOT NULL,
  metric_key TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  unit TEXT NOT NULL,
  operator TEXT NOT NULL,
  critical_val REAL NOT NULL,
  severity TEXT NOT NULL,
  sbar_zh TEXT NOT NULL,
  sbar_en TEXT NOT NULL,
  source_ref TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ctcae_criteria (
  id TEXT PRIMARY KEY,
  meddra_code TEXT NOT NULL,
  term_zh TEXT NOT NULL,
  term_en TEXT NOT NULL,
  soc_zh TEXT NOT NULL,
  grade1_zh TEXT NOT NULL,
  grade2_zh TEXT NOT NULL,
  grade3_zh TEXT NOT NULL,
  grade4_zh TEXT NOT NULL,
  escalation_rule_zh TEXT NOT NULL,
  escalation_rule_en TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS icd10_codes (
  code TEXT PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  keywords TEXT NOT NULL,
  drg_weight REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS clinical_guidelines (
  id TEXT PRIMARY KEY,
  society TEXT NOT NULL,
  pub_year INTEGER NOT NULL,
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  pmid_or_doi TEXT NOT NULL,
  tags TEXT NOT NULL,
  summary_zh TEXT NOT NULL,
  summary_en TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  mrn TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  age INTEGER NOT NULL,
  sex TEXT NOT NULL,
  ward_zh TEXT NOT NULL,
  ward_en TEXT NOT NULL,
  diagnosis_zh TEXT NOT NULL,
  diagnosis_en TEXT NOT NULL,
  icd10_code TEXT NOT NULL,
  discharge_days INTEGER NOT NULL,
  egfr REAL NOT NULL,
  potassium REAL NOT NULL,
  spo2 REAL NOT NULL,
  hba1c REAL,
  anc REAL,
  medications_json TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS encounters (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  subjective TEXT NOT NULL,
  objective TEXT NOT NULL,
  assessment TEXT NOT NULL,
  plan TEXT NOT NULL,
  icd10_codes_json TEXT NOT NULL,
  evidence_links_json TEXT NOT NULL,
  fhir_bundle_json TEXT NOT NULL,
  signed_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sbar_escalations (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  trigger_code TEXT NOT NULL,
  severity TEXT NOT NULL,
  situation TEXT NOT NULL,
  background TEXT NOT NULL,
  assessment TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  handoff_ms INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hospital_tiers (
  id TEXT PRIMARY KEY,
  tier TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT NOT NULL,
  description_en TEXT NOT NULL,
  deployment_mode TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS compliance_redlines (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  rule_zh TEXT NOT NULL,
  rule_en TEXT NOT NULL,
  penalty_zh TEXT NOT NULL,
  penalty_en TEXT NOT NULL
);

INSERT OR IGNORE INTO schema_migrations (version, applied_at) VALUES (1, datetime('now'));
