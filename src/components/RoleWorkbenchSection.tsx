"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  PhoneForwarded,
  Wallet,
  Headphones,
  User,
  Users,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/context/i18n-context";

type Role = "physician" | "nurseDirector" | "hospitalBuyer" | "patientCaregiver";

const ROLES: { id: Role; icon: React.ElementType; keyZh: string; keyEn: string }[] = [
  { id: "physician", icon: Stethoscope, keyZh: "rolePhysician", keyEn: "rolePhysician" },
  { id: "nurseDirector", icon: Users, keyZh: "roleNurseDirector", keyEn: "roleNurseDirector" },
  { id: "hospitalBuyer", icon: Wallet, keyZh: "roleHospitalBuyer", keyEn: "roleHospitalBuyer" },
  { id: "patientCaregiver", icon: Headphones, keyZh: "rolePatientCaregiver", keyEn: "rolePatientCaregiver" },
];

export function RoleWorkbenchSection() {
  const { locale, t } = useI18n();
  const isZh = locale.startsWith("zh");
  const rw = t.roleWorkbench;

  const [role, setRole] = useState<Role>("physician");
  const [activeTab, setActiveTab] = useState<string>("");

  const roleCfg = ROLES.find((x) => x.id === role)!;
  const label = isZh ? roleCfg.keyZh : roleCfg.keyEn;
  const descMap: Record<Role, string> = {
    physician: isZh ? rw.descPhysician : t.roleWorkbench.descPhysician,
    nurseDirector: isZh ? rw.descNurseDirector : t.roleWorkbench.descNurseDirector,
    hospitalBuyer: isZh ? rw.descHospitalBuyer : t.roleWorkbench.descHospitalBuyer,
    patientCaregiver: isZh ? rw.descPatientCaregiver : t.roleWorkbench.descPatientCaregiver,
  };

  const tabs =
    role === "physician"
      ? [{ id: "evidence", label: rw.tabEvidence }]
      : role === "nurseDirector"
        ? [
            { id: "roster", label: rw.tabRoster },
            { id: "escalation", label: rw.tabEscalation },
          ]
        : role === "hospitalBuyer"
          ? [{ id: "drgDip", label: rw.tabDrgDip }]
          : [
              { id: "followup", label: rw.tabFollowup },
              { id: "adherence", label: rw.tabAdherence },
            ];

  return (
    <section
      id="role-workbench"
      className="bg-zj-white border-b border-zj-border py-20 lg:py-28 scroll-mt-20"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-zj-cobalt" />
            <span className="text-[12.5px] font-medium tracking-wide text-zj-cobalt">
              {rw.eyebrow}
            </span>
          </div>
          <h2 className="font-serif-editorial text-[28px] sm:text-[36px] lg:text-[40px] leading-[1.2] tracking-[-0.02em] text-zj-ink font-normal">
            {rw.title}
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.75] text-zj-slate">{rw.subtitle}</p>
        </div>

        {/* Role Picker */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <span className="text-[11.5px] font-semibold text-zj-muted">
            {rw.currentRole}:
          </span>
          {ROLES.map((r) => {
            const active = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-[13px] rounded-[4px] border transition-all cursor-pointer ${
                  active
                    ? "bg-zj-cobalt text-white border-zj-cobalt shadow-[0_8px_24px_-8px_rgba(7,32,166,0.25)]"
                    : "bg-zj-white text-zj-slate border-zj-border hover:border-zj-cobalt hover:text-zj-cobalt"
                }`}
              >
                <r.icon className={`w-4 h-4 ${active ? "text-white" : "text-zj-slate"}`} />
                {t.roleWorkbench[label as keyof typeof t.roleWorkbench]}
              </button>
            );
          })}
        </div>

        {/* Role Card: badge + description */}
        <div className="flex items-start gap-6 mb-10">
          <div className="flex-shrink-0 w-14 h-14 rounded-[4px] bg-zj-cobalt-soft flex items-center justify-center">
            <roleCfg.icon className="w-7 h-7 text-zj-cobalt" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-zj-cobalt mb-1">
              {t.roleWorkbench[label as keyof typeof t.roleWorkbench]}
            </div>
            <p className="text-[14.5px] leading-relaxed text-zj-ink">
              {descMap[role]}
            </p>
          </div>
        </div>

        {/* Tab Strip */}
        <div
          role="tablist"
          aria-label={rw.btnSwitchRole}
          className="flex gap-px border-b border-zj-border mb-8"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id || (activeTab === "" && tab.id === tabs[0]?.id);
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3.5 text-[13px] font-medium border-b-2 transition-colors cursor-pointer ${
                  active
                    ? "border-zj-cobalt text-zj-cobalt"
                    : "border-transparent text-zj-slate hover:text-zj-cobalt hover:bg-zj-mist"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================
            PHYSICIAN: Evidence Formulary
            ======================================================== */}
        {role === "physician" && activeTab === "evidence" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 p-4 bg-zj-white border border-zj-border rounded-[4px]">
              <div className="text-[11.5px] font-semibold text-zj-muted mb-3">
                {isZh ? "选择联用药物" : "Select Medications"}
              </div>
              <div className="space-y-1.5">
                {[
                  { id: "sacubitril-valsartan", name: "诺欣妥 / Sacubitril-Valsartan" },
                  { id: "spironolactone", name: "螺内酯 / Spironolactone" },
                  { id: "rivaroxaban", name: "利伐沙班 / Rivaroxaban" },
                  { id: "empagliflozin", name: "达格列净 / Empagliflozin" },
                  { id: "clarithromycin", name: "克拉霉素 / Clarithromycin" },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className="w-full text-left px-3 py-2 text-[12.5px] rounded-[3px] border border-zj-border bg-zj-white text-zj-ink hover:bg-zj-cobalt-soft hover:text-zj-cobalt cursor-pointer transition-colors"
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8 bg-zj-mist/40 p-6 rounded-[4px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-semibold text-zj-ink">
                  {isZh ? "肾功与配伍核验结果" : "Renal & DDI Check Results"}
                </span>
                <span className="font-mono-hud text-[11px] text-zj-muted">~0.8 ms</span>
              </div>
              <div className="p-4 bg-zj-white border border-zj-border rounded-[3px]">
                <p className="text-[13.5px] text-zj-slate">
                  {isZh
                    ? "未检出禁忌级配伍。建议按 KDIGO 2024 与 NRDL 指南执行，最终剂量由主治医师确认。"
                    : "No contraindicated DDI detected. Follow KDIGO 2024 & NRDL guidelines; final dose confirmed by attending physician."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            NURSE DIRECTOR: Roster + SBAR Escalation
            ======================================================== */}
        {role === "nurseDirector" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Roster */}
            {activeTab === "roster" && (
              <div className="lg:col-span-6">
                <div className="bg-zj-white border border-zj-border rounded-[4px] overflow-hidden">
                  <div className="px-5 py-4 border-b border-zj-border bg-zj-mist">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-zj-cobalt" />
                        <span className="font-semibold text-zj-ink text-[13px]">
                          {isZh ? "出院在管患者队列" : "Discharged Patient Roster"}
                        </span>
                      </div>
                      <span className="font-mono-hud text-[11px] text-zj-muted">8 patients</span>
                    </div>
                  </div>
                  <div className="divide-y divide-zj-border">
                    {[
                      {
                        name: "张建国",
                        id: "pt-1001",
                        ward: "心内科",
                        egfr: 36,
                        risk: "MODERATE",
                        meds: "阿司匹林 + 替格瑞洛",
                      },
                      {
                        name: "陈秀兰",
                        id: "pt-1002",
                        ward: "心衰中心",
                        egfr: 28,
                        risk: "HIGH",
                        meds: "诺欣妥 + 螺内酯 + 利伐沙班",
                      },
                    ].map((p) => (
                      <div key={p.id} className="px-5 py-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[13.5px] font-medium text-zj-ink">
                            {p.name} ({p.id})
                          </span>
                          <span
                            className={`text-[10px] font-mono-hud px-2 py-0.5 rounded-full ${
                              p.risk === "HIGH"
                                ? "bg-red-50 text-red-700 border border-red-100"
                                : "bg-zj-mint-soft text-zj-safe border border-zj-mint"
                            }`}
                          >
                            {p.risk}
                          </span>
                        </div>
                        <div className="text-[11.5px] text-zj-muted mb-2">
                          {p.ward} · eGFR {p.egfr} · {p.meds}
                        </div>
                        <button
                          type="button"
                          className="text-[11.5px] text-zj-cobalt font-medium hover:underline cursor-pointer"
                        >
                          {isZh ? "查看随访记录" : "View Follow-up"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SBAR Escalation */}
            {activeTab === "escalation" && (
              <div className="lg:col-span-6 bg-zj-navy text-white p-6 rounded-[4px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PhoneForwarded className="w-4 h-4 text-zj-cyan-bright" />
                    <span className="font-semibold text-zj-ink text-[13px]">
                      {isZh ? "SBAR 护士转接工单" : "SBAR RN Escalation Queue"}
                    </span>
                  </div>
                  <span className="font-mono-hud text-[11px] text-zj-hud-muted">1 pending</span>
                </div>
                <div className="p-4 bg-zj-navy-card border border-zj-border-hud rounded-[3px]">
                  <div className="flex items-center justify-between text-[11px] text-zj-hud-muted font-mono-hud mb-2">
                    <span>SBAR-2026-0891 · 陈秀兰</span>
                    <span className="text-zj-safe-bright">1.58s RN Joined</span>
                  </div>
                  <div className="text-[13px] font-medium text-white mb-2">
                    {isZh
                      ? "eGFR 28 + K+ 5.2，继续螺内酯存在致死性高钾血症风险"
                      : "eGFR 28 + K+ 5.2, continued spironolactone risks fatal hyperkalemia"}
                  </div>
                  <button
                    type="button"
                    className="mt-4 w-full py-2 px-4 text-[12px] font-medium text-white bg-zj-cyan-bright rounded-[3px] hover:bg-zj-cyan cursor-pointer"
                  >
                    {isZh ? "立即接通当值护师" : "Connect Charge Nurse Now"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            HOSPITAL BUYER: DRG/DIP
            ======================================================== */}
        {role === "hospitalBuyer" && activeTab === "drgDip" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 p-4 bg-zj-white border border-zj-border rounded-[4px]">
              <div className="text-[11.5px] font-semibold text-zj-muted mb-3">
                {isZh ? "DRG/DIP 付费模拟" : "DRG/DIP Payment Simulation"}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-zj-ink mb-1.5">
                    {isZh ? "ICD-10 主诊断" : "Principal ICD-10"}
                  </label>
                  <select
                    defaultValue="I25.103"
                    className="w-full px-3 py-2 text-[12.5px] border border-zj-border-strong rounded-[3px] bg-zj-white focus:border-zj-cobalt focus:outline-none"
                  >
                    <option>I25.103 — PCI 支架术后 (RW 1.84)</option>
                    <option>I50.900x018 — HFrEF (RW 1.46)</option>
                    <option>C34.900 — EGFR-mutant NSCLC (RW 1.65)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-zj-ink mb-1.5">
                    {isZh ? "住院天数" : "Length of Stay"}
                  </label>
                  <input
                    type="number"
                    defaultValue="9"
                    className="w-full px-3 py-2 text-[12.5px] border border-zj-border-strong rounded-[3px] bg-zj-white focus:border-zj-cobalt focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="w-full py-3 text-[13px] font-medium text-white bg-zj-cobalt rounded-[3px] cursor-pointer"
                >
                  {isZh ? "计算付费" : "Calculate Payment"}
                </button>
              </div>
            </div>
            <div className="lg:col-span-7 bg-zj-mist/40 p-6 rounded-[4px]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { v: "¥6,882", l: isZh ? "基础 DRG 付费" : "Base DRG Payment" },
                  { v: "¥6,194", l: isZh ? "医保支付" : "Insurance Payment" },
                  { v: "¥688", l: isZh ? "患者自付" : "Patient Co-pay" },
                ].map((c) => (
                  <div
                    key={c.l}
                    className="p-4 bg-zj-white border border-zj-border rounded-[3px]"
                  >
                    <div className="text-[11px] text-zj-muted font-mono-hud">{c.l}</div>
                    <div className="text-[20px] font-semibold text-zj-cobalt mt-1">{c.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            PATIENT / CAREGIVER: Follow-up + Adherence
            ======================================================== */}
        {role === "patientCaregiver" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Follow-up */}
            {activeTab === "followup" && (
              <div className="lg:col-span-6 bg-zj-mist/40 p-6 rounded-[4px]">
                <div className="flex items-center gap-2 mb-4">
                  <Headphones className="w-4 h-4 text-zj-cobalt" />
                  <span className="font-semibold text-zj-ink text-[13px]">
                    {isZh ? "院外随访语音" : "Post-Discharge Voice Follow-up"}
                  </span>
                </div>
                <div className="p-4 bg-zj-white border border-zj-border rounded-[3px]">
                  <p className="text-[13.5px] text-zj-slate mb-4">
                    {isZh
                      ? "您好张先生，这是您出院后第 14 天随访。替格瑞洛已恢复服药，下周四复诊。如有胸闷、气促，请立即拨打随访专线。"
                      : "Hello Mr. Zhang, this is your day-14 post-discharge follow-up. Ticagrelor has been resumed. Follow-up next Thursday. Call the follow-up line immediately for chest tightness or dyspnea."}
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-zj-cobalt bg-zj-cobalt-soft rounded-[3px] cursor-pointer"
                  >
                    <VolumeIcon className="w-4 h-4" />
                    {isZh ? "再次播放" : "Replay"}
                  </button>
                </div>
              </div>
            )}

            {/* Adherence */}
            {activeTab === "adherence" && (
              <div className="lg:col-span-6 bg-zj-white border border-zj-border rounded-[4px] overflow-hidden">
                <div className="px-5 py-4 border-b border-zj-border bg-zj-mist">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-zj-safe" />
                      <span className="font-semibold text-zj-ink text-[13px]">
                        {isZh ? "用药依从看板" : "Medication Adherence"}
                      </span>
                    </div>
                    <span className="font-mono-hud text-[11px] text-zj-muted">94%</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-3">
                    {[
                      { med: "阿司匹林 100mg", time: "早 8:00", taken: true },
                      { med: "替格瑞洛 90mg", time: "早 8:00 / 晚 8:00", taken: true },
                      { med: "阿托伐他汀 20mg", time: "晚 20:00", taken: false },
                    ].map((m) => (
                      <div key={m.med} className="flex items-center justify-between p-3 border-b border-zj-border">
                        <div>
                          <div className="text-[13px] font-medium text-zj-ink">{m.med}</div>
                          <div className="text-[11px] text-zj-muted">{m.time}</div>
                        </div>
                        <span
                          className={`text-[11px] font-mono-hud px-2 py-0.5 rounded-full ${
                              m.taken
                                ? "bg-zj-mint-soft text-zj-safe border border-zj-mint"
                                : "bg-zj-mist text-zj-muted border border-zj-border"
                            }`}
                        >
                          {m.taken ? (isZh ? "已服用" : "Taken") : (isZh ? "待服用" : "Pending")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M2 10V13h2.828l3.414 3.414A1 1 0 0 0 9 16h3a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H9a1 1 0 0 0-.707.293L5.243 9.243H2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11.5" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M15.5 10c0 1.38-1.12 2.5-2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
