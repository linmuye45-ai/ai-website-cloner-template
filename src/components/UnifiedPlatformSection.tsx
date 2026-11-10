"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, FileAudio } from "lucide-react";
import { useI18n } from "@/context/i18n-context";

export function UnifiedPlatformSection() {
  const { locale, t, openDemoModal } = useI18n();
  const [activeTabId, setActiveTabId] = useState<
    "command" | "orchestration" | "vault" | "spaces"
  >("command");

  const activeTab =
    t.platform.tabs.find((tab) => tab.id === activeTabId) ?? t.platform.tabs[0];

  const sampleRows = {
    command:
      locale === "en"
        ? [
            { ward: "Cardiology Ward 3A", rate: "98.4%", handoff: "1.4s", status: "Normal" },
            { ward: "Pulmonary & Critical Care", rate: "96.9%", handoff: "1.6s", status: "2 Escalated" },
            { ward: "Digestive Endoscopy Day Unit", rate: "99.1%", handoff: "1.5s", status: "Normal" },
          ]
        : locale === "ja"
          ? [
              { ward: "循環器内科 3A病棟", rate: "98.4%", handoff: "1.4s", status: "正常稼働" },
              { ward: "呼吸器内科・重症病棟", rate: "96.9%", handoff: "1.6s", status: "看護師転送 2件" },
              { ward: "消化器内視鏡日帰り枠", rate: "99.1%", handoff: "1.5s", status: "正常稼働" },
            ]
          : locale === "zh-TW"
            ? [
                { ward: "心臟內科一病區", rate: "98.4%", handoff: "1.4s", status: "達標" },
                { ward: "呼吸與危重症二病區", rate: "96.9%", handoff: "1.6s", status: "已轉接 2 例" },
                { ward: "消化內視鏡日間中心", rate: "99.1%", handoff: "1.5s", status: "達標" },
              ]
            : [
                { ward: "心血管内科一病区", rate: "98.4%", handoff: "1.4s", status: "质控达标" },
                { ward: "呼吸与危重症二病区", rate: "96.9%", handoff: "1.6s", status: "已转接护师 2 例" },
                { ward: "消化内镜日间手术中心", rate: "99.1%", handoff: "1.5s", status: "质控达标" },
              ],
    orchestration:
      locale === "en"
        ? [
            { ward: "09:00 Post-PCI Day-14 Cohort (48 pts)", rate: "FHIR Synced", handoff: "K+ / DAPT", status: "Running" },
            { ward: "10:30 Colonoscopy Prep Check (112 pts)", rate: "FHIR Synced", handoff: "Split-Dose", status: "Scheduled" },
            { ward: "14:30 AECOPD Discharge Day-7 (34 pts)", rate: "FHIR Synced", handoff: "SpO2 Redline", status: "Scheduled" },
          ]
        : locale === "ja"
          ? [
              { ward: "09:00 PCI術後14日目フォロー (48名)", rate: "FHIR同期済", handoff: "抗血小板薬確認", status: "架電中" },
              { ward: "10:30 大腸内視鏡下剤案内 (112名)", rate: "FHIR同期済", handoff: "前処置確認", status: "予約済" },
              { ward: "14:30 COPD退院7日目経過確認 (34名)", rate: "FHIR同期済", handoff: "SpO2閾値監視", status: "予約済" },
            ]
          : locale === "zh-TW"
            ? [
                { ward: "09:00 支架術後第14天隨訪組 (48人)", rate: "HIS 已同步", handoff: "雙抗依從核對", status: "執行中" },
                { ward: "10:30 無痛腸鏡清腸準備組 (112人)", rate: "HIS 已同步", handoff: "分次服藥指導", status: "待外呼" },
                { ward: "14:30 慢阻肺出院第7天組 (34人)", rate: "HIS 已同步", handoff: "血氧紅線監測", status: "待外呼" },
              ]
            : [
                { ward: "09:00 冠脉支架术后第14天队列 (48人)", rate: "HIS 已同步", handoff: "双抗依从核对", status: "外呼中" },
                { ward: "10:30 无痛肠镜分次清肠指导组 (112人)", rate: "HIS 已同步", handoff: "复方聚乙二醇", status: "已排程" },
                { ward: "14:30 慢阻肺出院第7天随访组 (34人)", rate: "HIS 已同步", handoff: "血氧红线监测", status: "已排程" },
              ],
    vault:
      locale === "en"
        ? [
            { ward: "Query: eGFR < 45 & SGLT2i Adherence", rate: "1,428 Charts", handoff: "00:42 Audio", status: "Verified" },
            { ward: "Query: Post-PCI Bruising / Epistaxis", rate: "312 Charts", handoff: "01:15 Audio", status: "Verified" },
            { ward: "Query: Discharge Day-7 Dyspnea Probe", rate: "689 Charts", handoff: "00:58 Audio", status: "Verified" },
          ]
        : locale === "ja"
          ? [
              { ward: "検索：eGFR < 45 かつ SGLT2阻害薬継続", rate: "1,428 症例", handoff: "音声 00:42", status: "根拠紐付済" },
              { ward: "検索：PCI後皮下出血・鼻出血申告", rate: "312 症例", handoff: "音声 01:15", status: "根拠紐付済" },
              { ward: "検索：退院7日目労作時息切れ聴取", rate: "689 症例", handoff: "音声 00:58", status: "根拠紐付済" },
            ]
          : locale === "zh-TW"
            ? [
                { ward: "檢索：eGFR < 45 且合併 SGLT2i 順從性", rate: "1,428 份病歷", handoff: "原聲 00:42", status: "已綁定" },
                { ward: "檢索：抗凝術後牙齦出血或皮下瘀斑", rate: "312 份病歷", handoff: "原聲 01:15", status: "已綁定" },
                { ward: "檢索：出院第7天活動後氣促追問紀錄", rate: "689 份病歷", handoff: "原聲 00:58", status: "已綁定" },
              ]
            : [
                { ward: "检索：eGFR < 45 合并 SGLT2i 服药依从队列", rate: "1,428 份病历", handoff: "原声 00:42", status: "时间戳已绑定" },
                { ward: "检索：双抗术后牙龈出血或皮下瘀斑主诉", rate: "312 份病历", handoff: "原声 01:15", status: "时间戳已绑定" },
                { ward: "检索：出院第7天上楼气促追问阳性记录", rate: "689 份病历", handoff: "原声 00:58", status: "时间戳已绑定" },
              ],
    spaces:
      locale === "en"
        ? [
            { ward: "Tertiary Heart Center → Community GP", rate: "SOAP Scoped", handoff: "PIPL Logged", status: "Active" },
            { ward: "Stroke Unit → Rehabilitation Hospital", rate: "PT/OT Scoped", handoff: "PIPL Logged", status: "Active" },
            { ward: "Sponsor GVP Team → Site PI Desk", rate: "De-Identified", handoff: "E2B(R3)", status: "Audited" },
          ]
        : locale === "ja"
          ? [
              { ward: "基幹循環器センター → 地域かかりつけ医", rate: "要約のみ開示", handoff: "PIPL監査済", status: "連携中" },
              { ward: "脳卒中ユニット → 回復期リハビリ病棟", rate: "リハ計画共有", handoff: "PIPL監査済", status: "連携中" },
              { ward: "治験GVP安全部門 → 実施施設責任医師", rate: "匿名化済", handoff: "E2B(R3)", status: "監査記録済" },
            ]
          : locale === "zh-TW"
            ? [
                { ward: "醫學中心心內科 → 社區家庭醫師", rate: "字段脫敏授權", handoff: "審計留痕", status: "協同中" },
                { ward: "腦卒中中心 → 二級康復醫院", rate: "復健摘要共享", handoff: "審計留痕", status: "協同中" },
                { ward: "新藥 GVP 團隊 → 臨床試驗中心 PI", rate: "受試者去識別", handoff: "E2B(R3)", status: "合規" },
              ]
            : [
                { ward: "三甲牵头心内科 → 街道社区家庭医生", rate: "最小字段授权", handoff: "逐笔留痕", status: "协同中" },
                { ward: "综合卒中中心 → 二级康复专科医院", rate: "康复病摘共享", handoff: "逐笔留痕", status: "协同中" },
                { ward: "创新药 GVP 专员 → 临床研究中心 PI", rate: "受试者去标识", handoff: "E2B(R3)", status: "已审计" },
              ],
  }[activeTabId];

  return (
    <section
      id="platform"
      className="bg-zj-white border-b border-zj-border py-20 lg:py-28 scroll-mt-20"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-5 h-px bg-zj-cobalt" />
            <span className="text-[12.5px] font-medium tracking-wide text-zj-cobalt">
              {t.platform.eyebrow}
            </span>
          </div>
          <h2 className="font-serif-editorial text-[28px] sm:text-[36px] lg:text-[40px] leading-[1.2] tracking-[-0.02em] text-zj-ink font-normal">
            {t.platform.title}
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.75] text-zj-slate">
            {t.platform.subtitle}
          </p>
        </div>

        {/* Upper Asymmetric Institutional Deployment Split (7 Cols Hospital Architecture / 5 Cols CRO & GVP Spec) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-zj-border mb-16">
          <div className="lg:col-span-7 bg-zj-white grid grid-cols-1 sm:grid-cols-12">
            <div className="sm:col-span-5 relative min-h-[224px] bg-zj-surface overflow-hidden">
              <Image
                src="/images/solution-hospital-care.jpg"
                alt={t.platform.cardHospitalTitle}
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-cover"
              />
            </div>
            <div className="sm:col-span-7 p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <div className="font-mono-hud text-[11px] text-zj-cobalt">
                  HIS · EMR · HL7 FHIR R4
                </div>
                <h3 className="mt-2 text-[19px] font-semibold text-zj-ink">
                  {t.platform.cardHospitalTitle}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-zj-slate">
                  {t.platform.cardHospitalDesc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zj-border">
                <button
                  type="button"
                  onClick={() => openDemoModal(t.platform.cardHospitalTitle)}
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-zj-cobalt hover:text-zj-blue cursor-pointer"
                >
                  {t.platform.cardHospitalCta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-zj-mist p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-zj-border flex flex-col justify-between">
            <div>
              <div className="font-mono-hud text-[11px] text-zj-teal">
                ICH-GCP · MedDRA v27 · NMPA GVP
              </div>
              <h3 className="mt-2 text-[19px] font-semibold text-zj-ink">
                {t.platform.cardPharmaTitle}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-zj-slate">
                {t.platform.cardPharmaDesc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zj-border flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => openDemoModal(t.platform.cardPharmaTitle)}
                className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-zj-cobalt hover:text-zj-blue cursor-pointer"
              >
                {t.platform.cardPharmaCta}
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="font-mono-hud text-[11px] text-zj-muted">
                21 CFR Part 11 Ready
              </span>
            </div>
          </div>
        </div>

        {/* Lower Clinical Workstation Interactive Sheet */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-zj-ink">
              {t.platform.workspaceTitle}
            </h3>
          </div>

          <div className="border border-zj-border-strong rounded-[4px] overflow-hidden bg-zj-white">
            {/* Workstation Tabs */}
            <div
              role="tablist"
              aria-label={t.platform.workspaceTitle}
              className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zj-border border-b border-zj-border"
            >
              {t.platform.tabs.map((tab) => {
                const active = tab.id === activeTab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`text-left px-5 py-3.5 transition-colors cursor-pointer ${
                      active
                        ? "bg-zj-cobalt-soft border-b-2 border-b-zj-cobalt"
                        : "bg-zj-white hover:bg-zj-mist"
                    }`}
                  >
                    <div className="font-mono-hud text-[11px] text-zj-muted">
                      {tab.code}
                    </div>
                    <div
                      className={`mt-0.5 text-[14px] font-semibold ${
                        active ? "text-zj-cobalt" : "text-zj-ink"
                      }`}
                    >
                      {tab.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Workstation Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col justify-between">
                <div>
                  <div className="font-mono-hud text-[11.5px] text-zj-cobalt">
                    {activeTab.code}
                  </div>
                  <h4 className="mt-2 font-serif-editorial text-[24px] sm:text-[28px] leading-[1.25] text-zj-ink font-normal">
                    {activeTab.headline}
                  </h4>
                  <p className="mt-3 text-[14.5px] leading-[1.75] text-zj-slate">
                    {activeTab.desc}
                  </p>

                  <ul className="mt-6 space-y-3 pt-5 border-t border-zj-border">
                    {activeTab.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-[13.5px] text-zj-ink leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-zj-safe shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right 6 Cols: Metrics + Live Clinical Workstation Ledger Preview */}
              <div className="lg:col-span-6 bg-zj-mist border-t lg:border-t-0 lg:border-l border-zj-border flex flex-col justify-between">
                {/* 3 Key Operational Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zj-border border-b border-zj-border">
                  {activeTab.metrics.map((m) => (
                    <div key={m.k} className="bg-zj-white p-4">
                      <div className="text-[11.5px] text-zj-muted leading-snug">
                        {m.k}
                      </div>
                      <div className="mt-1.5 font-mono-hud text-[19px] font-semibold text-zj-cobalt">
                        {m.v}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Workstation Table Snapshot */}
                <div className="p-5 lg:p-6">
                  <div className="bg-zj-white border border-zj-border rounded-[3px] overflow-hidden">
                    <div className="px-4 py-2.5 bg-zj-surface/70 border-b border-zj-border flex items-center justify-between text-[11.5px] text-zj-slate font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <FileAudio className="w-3.5 h-3.5 text-zj-cobalt" />
                        {activeTab.label}
                      </span>
                      <span className="font-mono-hud text-[11px] text-zj-muted">
                        Intranet Live View
                      </span>
                    </div>
                    <div className="divide-y divide-zj-border">
                      {sampleRows.map((row) => (
                        <div
                          key={row.ward}
                          className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-[12.5px]"
                        >
                          <span className="font-medium text-zj-ink">
                            {row.ward}
                          </span>
                          <div className="flex items-center gap-3 font-mono-hud text-[11.5px]">
                            <span className="text-zj-slate">{row.rate}</span>
                            <span className="text-zj-muted">{row.handoff}</span>
                            <span className="px-1.5 py-0.5 rounded-[2px] bg-zj-mint-soft text-zj-safe font-sans font-medium">
                              {row.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
