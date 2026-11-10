"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  X,
  FileText,
  ArrowUpRight,
  RotateCcw,
  Check,
} from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import {
  CLINICAL_AGENTS,
  GOAL_OPTIONS,
  SPECIALTY_OPTIONS,
} from "@/lib/clinical-calls-and-agents";
import type { AgentSector, ClinicalAgentItem } from "@/types/zhongjing";

export function AgentExplorerSection() {
  const { locale, t, openDemoModal } = useI18n();

  const [sector, setSector] = useState<AgentSector>("all");
  const [specialty, setSpecialty] = useState<string>("all");
  const [goal, setGoal] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedAgent, setSelectedAgent] = useState<ClinicalAgentItem | null>(
    null
  );

  const filteredAgents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CLINICAL_AGENTS.filter((agent) => {
      if (sector !== "all" && agent.sector !== sector) return false;
      if (specialty !== "all" && agent.specialtyKey !== specialty) return false;
      if (goal !== "all" && agent.goalKey !== goal) return false;
      if (!q) return true;
      const haystack = [
        agent.code,
        agent.title[locale],
        agent.summary[locale],
        agent.kpiHighlight[locale],
        agent.emrProtocol,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [goal, locale, query, sector, specialty]);

  const hasActiveFilters =
    sector !== "all" ||
    specialty !== "all" ||
    goal !== "all" ||
    query.trim().length > 0;

  const resetAll = () => {
    setSector("all");
    setSpecialty("all");
    setGoal("all");
    setQuery("");
  };

  const sectorLabels: { id: AgentSector; label: string }[] = [
    { id: "all", label: t.explorer.sectorAll },
    { id: "provider", label: t.explorer.sectorProvider },
    { id: "payor", label: t.explorer.sectorPayor },
    { id: "pharma", label: t.explorer.sectorPharma },
  ];

  const getSpecialtyLabel = (key: string) =>
    SPECIALTY_OPTIONS.find((s) => s.key === key)?.label[locale] ?? key;

  return (
    <section
      id="agents"
      className="bg-zj-white border-b border-zj-border py-20 lg:py-28 scroll-mt-20"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-5 h-px bg-zj-cobalt" />
            <span className="text-[12.5px] font-medium tracking-wide text-zj-cobalt">
              {t.explorer.eyebrow}
            </span>
          </div>
          <h2 className="font-serif-editorial text-[28px] sm:text-[36px] lg:text-[40px] leading-[1.2] tracking-[-0.02em] text-zj-ink font-normal">
            {t.explorer.title}
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.75] text-zj-slate">
            {t.explorer.subtitle}
          </p>
        </div>

        {/* Asymmetric 3-Col Filter Index + 9-Col Clinical Protocol Directory Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left 3 Columns: Clinical Taxonomy Rail */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zj-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.explorer.searchPlaceholder}
                aria-label={t.explorer.searchPlaceholder}
                className="w-full pl-9 pr-8 py-2.5 text-[13px] bg-zj-mist border border-zj-border focus:border-zj-cobalt focus:bg-zj-white rounded-[4px] text-zj-ink placeholder:text-zj-muted focus:outline-none transition-colors"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zj-muted hover:text-zj-ink cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Institution Type List */}
            <div>
              <div className="text-[11.5px] font-semibold text-zj-muted pb-2 border-b border-zj-border">
                {t.explorer.sectorAll}
              </div>
              <div className="divide-y divide-zj-border/70">
                {sectorLabels.map((item) => {
                  const active = sector === item.id;
                  const count =
                    item.id === "all"
                      ? CLINICAL_AGENTS.length
                      : CLINICAL_AGENTS.filter((a) => a.sector === item.id)
                          .length;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSector(item.id)}
                      className={`w-full flex items-center justify-between py-2.5 text-[13px] transition-colors cursor-pointer ${
                        active
                          ? "text-zj-cobalt font-semibold"
                          : "text-zj-slate hover:text-zj-ink"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="font-mono-hud text-[11px] text-zj-muted">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specialty Select & Goal Select */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="specialty-select"
                  className="block text-[11.5px] font-semibold text-zj-muted mb-1.5"
                >
                  {SPECIALTY_OPTIONS[0].label[locale]}
                </label>
                <select
                  id="specialty-select"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] bg-zj-white border border-zj-border-strong rounded-[4px] text-zj-ink focus:border-zj-cobalt focus:outline-none"
                >
                  {SPECIALTY_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label[locale]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="goal-select"
                  className="block text-[11.5px] font-semibold text-zj-muted mb-1.5"
                >
                  {GOAL_OPTIONS[0].label[locale]}
                </label>
                <select
                  id="goal-select"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] bg-zj-white border border-zj-border-strong rounded-[4px] text-zj-ink focus:border-zj-cobalt focus:outline-none"
                >
                  {GOAL_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label[locale]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-zj-cobalt hover:text-zj-blue cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.explorer.resetFilters}
              </button>
            )}
          </aside>

          {/* Right 9 Columns: Continuous 1px Hairline Protocol Ledger */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between pb-3 border-b border-zj-border text-[12.5px] text-zj-slate">
              <span>
                <strong className="font-mono-hud text-zj-ink font-semibold">
                  {filteredAgents.length}
                </strong>{" "}
                {t.explorer.activeCountSuffix}
              </span>
              <span className="hidden sm:inline font-mono-hud text-[11px] text-zj-muted">
                HL7 FHIR R4 · SOP v2026.4
              </span>
            </div>

            {filteredAgents.length === 0 ? (
              <div className="py-16 text-center border-b border-zj-border bg-zj-mist/50">
                <p className="text-[14px] text-zj-slate">
                  {t.explorer.resetFilters}
                </p>
                <button
                  type="button"
                  onClick={resetAll}
                  className="mt-3 px-4 py-2 text-[13px] font-medium text-white bg-zj-cobalt rounded-[4px] cursor-pointer"
                >
                  {t.explorer.resetFilters}
                </button>
              </div>
            ) : (
              <>
                <div className="divide-y divide-zj-border border-b border-zj-border">
                  {(hasActiveFilters || expanded
                    ? filteredAgents
                    : filteredAgents.slice(0, 5)
                  ).map((agent) => (
                    <article
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent)}
                      className="py-4 px-2 sm:px-4 hover:bg-zj-mist/70 transition-colors grid grid-cols-1 md:grid-cols-12 gap-3 items-center cursor-pointer"
                    >
                      {/* Protocol Meta & Title (7 cols) — Crisp 1-line row */}
                      <div className="md:col-span-7">
                        <div className="flex flex-wrap items-center gap-2 text-[11.5px]">
                          <span className="font-mono-hud text-zj-muted">
                            {agent.code}
                          </span>
                          <span className="text-zj-border-strong">·</span>
                          <span className="font-medium text-zj-cobalt">
                            {getSpecialtyLabel(agent.specialtyKey)}
                          </span>
                          <span className="text-zj-border-strong">·</span>
                          <span className="font-mono-hud text-zj-muted">
                            {agent.avgCallDuration}
                          </span>
                        </div>

                        <h3 className="mt-1 text-[15.5px] font-semibold text-zj-ink tracking-tight">
                          {agent.title[locale]}
                        </h3>
                      </div>

                      {/* Clinical Impact & SOP Trigger (5 cols) */}
                      <div className="md:col-span-5 flex flex-wrap items-center md:justify-end gap-3">
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zj-safe bg-zj-mint-soft px-2.5 py-1 rounded-[3px]">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>{agent.kpiHighlight[locale]}</span>
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAgent(agent);
                          }}
                          className="inline-flex items-center gap-1 text-[12.5px] font-medium text-zj-cobalt hover:text-zj-blue cursor-pointer shrink-0"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {t.explorer.inspectSop}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                {!hasActiveFilters && filteredAgents.length > 5 && (
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      className="text-[13px] font-medium text-zj-cobalt hover:text-zj-blue cursor-pointer"
                    >
                      {expanded ? t.explorer.collapseBtn : t.explorer.showAllBtn}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Clinical SOP Sheet Modal */}
      {selectedAgent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sop-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zj-ink/45 backdrop-blur-[2px]"
        >
          <div
            className="fixed inset-0"
            onClick={() => setSelectedAgent(null)}
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-zj-white border border-zj-border-strong rounded-[4px] shadow-[0_24px_60px_-15px_rgba(9,30,58,0.25)]">
            <div className="px-6 py-5 bg-zj-mist border-b border-zj-border flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11.5px] text-zj-muted font-mono-hud">
                  <span>{selectedAgent.code}</span>
                  <span>·</span>
                  <span>{selectedAgent.emrProtocol}</span>
                </div>
                <h3
                  id="sop-modal-title"
                  className="mt-1 text-[19px] font-semibold text-zj-ink"
                >
                  {selectedAgent.title[locale]}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAgent(null)}
                aria-label={t.modals.closeBtn}
                className="p-1.5 text-zj-muted hover:text-zj-ink rounded-[4px] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-[14px] leading-[1.7] text-zj-slate">
                {selectedAgent.summary[locale]}
              </p>

              {/* Metadata Strip */}
              <div className="grid grid-cols-3 gap-px bg-zj-border border border-zj-border text-left">
                <div className="bg-zj-white p-3">
                  <div className="text-[11px] text-zj-muted">
                    {SPECIALTY_OPTIONS[0].label[locale]}
                  </div>
                  <div className="mt-0.5 text-[13px] font-semibold text-zj-ink">
                    {getSpecialtyLabel(selectedAgent.specialtyKey)}
                  </div>
                </div>
                <div className="bg-zj-white p-3">
                  <div className="text-[11px] text-zj-muted">Verifiers</div>
                  <div className="mt-0.5 font-mono-hud text-[13px] font-semibold text-zj-cobalt">
                    {selectedAgent.activeSupervisors} / 32
                  </div>
                </div>
                <div className="bg-zj-white p-3">
                  <div className="text-[11px] text-zj-muted">Duration</div>
                  <div className="mt-0.5 font-mono-hud text-[13px] font-semibold text-zj-ink">
                    {selectedAgent.avgCallDuration}
                  </div>
                </div>
              </div>

              {/* Opening Script */}
              <div>
                <h4 className="text-[12.5px] font-semibold text-zj-slate mb-2">
                  {t.explorer.drawerOpeningTitle}
                </h4>
                <blockquote className="p-4 bg-zj-mist border-l-2 border-zj-cobalt text-[13.5px] leading-[1.7] text-zj-ink">
                  “{selectedAgent.sampleOpening[locale]}”
                </blockquote>
              </div>

              {/* SOP Steps */}
              <div>
                <h4 className="text-[12.5px] font-semibold text-zj-slate mb-2.5">
                  {t.explorer.drawerSopTitle}
                </h4>
                <ol className="divide-y divide-zj-border border border-zj-border">
                  {selectedAgent.sopSteps[locale].map((step, index) => (
                    <li
                      key={step}
                      className="px-4 py-3 flex items-start gap-3 text-[13.5px] text-zj-ink bg-zj-white"
                    >
                      <span className="font-mono-hud text-[11.5px] text-zj-cobalt font-semibold pt-0.5">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAgent(null)}
                  className="px-4 py-2.5 text-[13.5px] font-medium text-zj-slate hover:text-zj-ink border border-zj-border rounded-[4px] cursor-pointer"
                >
                  {t.modals.closeBtn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const contextTitle = selectedAgent.title[locale];
                    setSelectedAgent(null);
                    openDemoModal(contextTitle);
                  }}
                  className="px-5 py-2.5 text-[13.5px] font-medium text-white bg-zj-cobalt hover:bg-zj-blue rounded-[4px] cursor-pointer"
                >
                  {t.explorer.drawerDeployCta}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
