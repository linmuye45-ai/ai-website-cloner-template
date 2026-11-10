"use client";

import React, { useCallback, useState } from "react";
import { Calculator, FileText, Hospital } from "lucide-react";
import { useI18n } from "@/context/i18n-context";

type IcdOption = {
  code: string;
  nameZh: string;
  nameEn: string;
  drgWeight: number;
};

const ICD_OPTIONS: IcdOption[] = [
  {
    code: "I25.103",
    nameZh: "冠状动脉粥样硬化性心脏病（PCI支架置入术后状态 Z95.5）",
    nameEn: "Coronary atherosclerosis post-PCI DES (Z95.5)",
    drgWeight: 1.84,
  },
  {
    code: "I50.900x018",
    nameZh: "慢性射血分数降低型心力衰竭 (HFrEF)",
    nameEn: "Heart failure with reduced ejection fraction (HFrEF)",
    drgWeight: 1.46,
  },
  {
    code: "J44.100",
    nameZh: "慢性阻塞性肺疾病伴急性加重风险 (AECOPD)",
    nameEn: "COPD with acute exacerbation risk",
    drgWeight: 1.38,
  },
  {
    code: "E11.200x002",
    nameZh: "2型糖尿病伴糖尿病肾病 (DKD G3-G4期)",
    nameEn: "Type 2 diabetes mellitus with diabetic kidney disease",
    drgWeight: 1.25,
  },
  {
    code: "I48.900",
    nameZh: "非瓣膜性心房颤动（长期抗凝管理 Z79.01）",
    nameEn: "Non-valvular atrial fibrillation on anticoagulation",
    drgWeight: 1.19,
  },
  {
    code: "D70.x00",
    nameZh: "抗肿瘤化疗后粒细胞缺乏症（伴发热预警）",
    nameEn: "Chemotherapy-induced neutropenia / FN screening",
    drgWeight: 1.92,
  },
  {
    code: "C34.900",
    nameZh: "EGFR突变型非小细胞肺癌（靶向治疗随访）",
    nameEn: "EGFR-mutant NSCLC on targeted therapy",
    drgWeight: 1.65,
  },
  {
    code: "E87.500",
    nameZh: "高钾血症（药物相关性电解质监测）",
    nameEn: "Hyperkalemia",
    drgWeight: 1.12,
  },
];

const TIER_OPTIONS = [
  { id: "clinic", labelZh: "医院/门诊", labelEn: "Clinic / Outpatient" },
  { id: "tier-1", labelZh: "一级医院 / 社区卫生中心", labelEn: "Primary / Community" },
  { id: "tier-2", labelZh: "二级医院", labelEn: "Secondary Hospital" },
  { id: "tier-3a", labelZh: "三级甲等医院", labelEn: "Tertiary Grade A" },
  { id: "tier-3b", labelZh: "三级乙等医院", labelEn: "Tertiary Grade B" },
];

export function DrgDipCalculatorSection() {
  const { locale } = useI18n();
  const isEn = locale === "en";

  const [icdCode, setIcdCode] = useState<string>("I25.103");
  const [age, setAge] = useState<number>(68);
  const [days, setDays] = useState<number>(9);
  const [tier, setTier] = useState<string>("tier-3a");

  const [result, setResult] = useState<{
    drg_group: string;
    icd10: { code: string; name_zh: string; name_en: string; drg_weight: number };
    typical_stay_days: number;
    excess_days: number;
    age_factor: number;
    base_points: number;
    tier: string;
    payments: { gross_cny: number; insurance_cny: number; patient_cny: number };
    breakdown_zh: string[];
    breakdown_en: string[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const selectedIcd = ICD_OPTIONS.find((o) => o.code === icdCode);

  const calculate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clinical/drg-dip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          icd10_code: icdCode,
          age,
          discharge_days: days,
          hospital_tier: tier,
        }),
      });
      const data = await res.json();
      if (data.ok) setResult(data);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }, [icdCode, age, days, tier]);

  const cny = (v: number) => `¥${v.toLocaleString()}`;

  return (
    <section
      id="drg-dip"
      className="bg-zj-white border-b border-zj-border py-20 lg:py-28 scroll-mt-20"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-5 h-px bg-zj-cobalt" />
            <span className="text-[12.5px] font-medium tracking-wide text-zj-cobalt">
              {isEn ? "DRG / DIP Reimbursement Calculator" : "DRG/DIP 医保付费测算器"}
            </span>
          </div>
          <h2 className="font-serif-editorial text-[28px] sm:text-[36px] lg:text-[40px] leading-[1.2] tracking-[-0.02em] text-zj-ink font-normal">
            {isEn
              ? "Case-Based DRG & DIP Payment Simulation"
              : "以病例为基础的 DRG/DIP 付费模拟"}
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.75] text-zj-slate">
            {isEn
              ? "Select an ICD-10 diagnosis, patient age, length of stay, and hospital tier to estimate insurance payment and patient co-pay under China's DRG/DIP framework. Powered by real ZhongJing SQLite clinical data."
              : "选择 ICD-10 诊断、患者年龄、住院天数与医院等级，按中国 DRG/DIP 框架估算医保支付与患者自付。基于真实中净 SQLite 临床数据。"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Inputs */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-zj-white border border-zj-border-strong rounded-[4px]">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-zj-cobalt" />
              <span className="text-[13px] font-semibold text-zj-ink">
                {isEn ? "Patient & Case Parameters" : "患者与病例参数"}
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[12.5px] font-medium text-zj-ink mb-2">
                  {isEn
                    ? "ICD-10 Principal Diagnosis"
                    : "ICD-10 主诊断"}
                </label>
                <select
                  value={icdCode}
                  onChange={(e) => setIcdCode(e.target.value)}
                  className="w-full px-3 py-2.5 text-[12.5px] border border-zj-border-strong rounded-[3px] bg-zj-white focus:border-zj-cobalt focus:outline-none"
                >
                  {ICD_OPTIONS.map((o) => (
                    <option key={o.code} value={o.code}>
                      {o.code} — {isEn ? o.nameEn : o.nameZh}
                    </option>
                  ))}
                </select>
                {selectedIcd && (
                  <p className="mt-1.5 text-[11px] text-zj-muted font-mono-hud">
                    {isEn
                      ? `DRG weight: ${selectedIcd.drgWeight.toFixed(2)}`
                      : `DRG 病组权重：${selectedIcd.drgWeight.toFixed(2)}`}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <label className="text-[12.5px] font-medium text-zj-ink">
                    {isEn ? "Patient Age" : "患者年龄"}
                  </label>
                  <span className="font-mono-hud text-[14px] font-semibold text-zj-cobalt">
                    {age} {isEn ? "y/o" : "岁"}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={120}
                  step={1}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-zj-cobalt cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <label className="text-[12.5px] font-medium text-zj-ink">
                    {isEn ? "Length of Stay (days)" : "住院天数"}
                  </label>
                  <span className="font-mono-hud text-[14px] font-semibold text-zj-cobalt">
                    {days} {isEn ? "days" : "天"}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={60}
                  step={1}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full accent-zj-cobalt cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-zj-ink mb-2">
                  {isEn ? "Hospital Tier" : "医院等级"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TIER_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTier(t.id)}
                      className={`text-left px-3 py-2 text-[11.5px] rounded-[3px] border transition-colors cursor-pointer ${
                        tier === t.id
                          ? "bg-zj-cobalt text-white border-zj-cobalt font-medium"
                          : "bg-zj-white text-zj-slate border-zj-border hover:border-zj-cobalt"
                      }`}
                    >
                      {isEn ? t.labelEn : t.labelZh}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={calculate}
                className="w-full py-3 px-4 text-[13px] font-medium text-white bg-zj-cobalt hover:bg-zj-blue rounded-[3px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4 mr-2" />
                {loading
                  ? isEn
                    ? "Calculating..."
                    : "计算中..."
                  : isEn
                    ? "Calculate DRG / DIP Payment"
                    : "计算 DRG/DIP 付费"}
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-7 bg-zj-mist border-t lg:border-t-0 lg:border-l border-zj-border-strong p-6 sm:p-8 lg:p-10 flex flex-col justify-between rounded-[4px]">
            {!result ? (
              <div className="flex flex-col items-center justify-center text-center h-full py-20">
                <Hospital className="w-12 h-12 text-zj-muted mb-4" />
                <p className="text-[14px] text-zj-slate">
                  {isEn
                    ? "Select parameters and calculate to see payment estimate"
                    : "选择参数并计算，查看付费估算"}
                </p>
              </div>
            ) : (
              <dl className="divide-y divide-zj-border space-y-4">
                <div className="flex items-baseline justify-between gap-4 pt-2">
                  <dt className="text-[13px] text-zj-slate">
                    {isEn ? "DRG Group" : "DRG 病组"}
                  </dt>
                  <dd className="font-mono-hud text-[20px] font-semibold text-zj-cobalt">
                    {result.drg_group}
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[13px] text-zj-slate">
                    {isEn
                      ? "ICD-10 Diagnosis"
                      : "ICD-10 诊断"}
                  </dt>
                  <dd className="text-[13px] font-medium text-zj-ink max-w-[200px] truncate">
                    {isEn ? result.icd10.name_en : result.icd10.name_zh}
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[13px] text-zj-slate">
                    {isEn ? "Typical Stay (days)" : "典型住院天数"}
                  </dt>
                  <dd className="font-mono-hud text-[16px] font-semibold text-zj-ink">
                    {result.typical_stay_days} days
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[13px] text-zj-slate">
                    {isEn
                      ? "Excess Bed-Days"
                      : "超额床日"}
                  </dt>
                  <dd className="font-mono-hud text-[16px] font-semibold text-zj-amber">
                    {result.excess_days}
                  </dd>
                </div>

                <div className="pt-4 border-t border-zj-border">
                  <dt className="text-[12.5px] font-medium text-zj-slate mb-2">
                    {isEn ? "Payment Breakdown (CNY)" : "付费明细（人民币）"}
                  </dt>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[12.5px]">
                      <span className="text-zj-slate">
                        {isEn ? "Base DRG Payment" : "基础 DRG 付费"}
                      </span>
                      <span className="font-mono-hud text-zj-ink">
                        {cny(result.payments.gross_cny - result.payments.patient_cny - result.payments.insurance_cny + result.payments.insurance_cny)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[12.5px]">
                      <span className="text-zj-safe">
                        {isEn ? "Insurance Payment" : "医保支付"}
                      </span>
                      <span className="font-mono-hud text-zj-safe">
                        {cny(result.payments.insurance_cny)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[12.5px]">
                      <span className="text-zj-amber">
                        {isEn ? "Patient Co-pay (~10%)" : "患者自付（约10%）"}
                      </span>
                      <span className="font-mono-hud text-zj-amber">
                        {cny(result.payments.patient_cny)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[13px] font-semibold text-zj-ink border-t border-zj-border pt-2">
                      <span>{isEn ? "Gross Payment" : "总付费"}</span>
                      <span className="font-mono-hud text-zj-cobalt">
                        {cny(result.payments.gross_cny)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <dt className="text-[12px] font-medium text-zj-slate mb-2">
                    {isEn ? "Line-Item Rationale" : "付费依据明细"}
                  </dt>
                  <ul className="space-y-1.5 text-[12px] text-zj-slate">
                    {(isEn ? result.breakdown_en : result.breakdown_zh).map(
                      (b: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zj-cobalt shrink-0 mt-1" />
                          <span>{b}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
