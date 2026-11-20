"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import {
  EXECUTIVE_TESTIMONIALS,
  RESEARCH_PAPERS,
} from "@/lib/constellation-and-content";
import type { ResearchPaperItem } from "@/types/zhongjing";

export function ResearchAndTestimonialsSection() {
  const { locale, t, openDemoModal } = useI18n();
  const [category, setCategory] = useState<
    "all" | ResearchPaperItem["category"]
  >("all");
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaperItem | null>(
    null
  );

  const leadVoice = EXECUTIVE_TESTIMONIALS[0];
  const secondaryVoices = EXECUTIVE_TESTIMONIALS.slice(1);

  const filteredPapers =
    category === "all"
      ? RESEARCH_PAPERS
      : RESEARCH_PAPERS.filter((p) => p.category === category);

  const filterTabs: {
    id: "all" | ResearchPaperItem["category"];
    label: string;
  }[] = [
    { id: "all", label: t.researchVoices.filterAll },
    { id: "safety", label: t.researchVoices.filterSafety },
    { id: "speech", label: t.researchVoices.filterSpeech },
    { id: "inference", label: t.researchVoices.filterInference },
    { id: "benchmarks", label: t.researchVoices.filterBenchmarks },
  ];

  return (
    <section
      id="research"
      className="bg-zj-white border-b border-zj-border py-20 lg:py-28 scroll-mt-20"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Part 1: Magazine Editorial Clinical Field Notes (1 Featured + 2 Secondary) */}
        <div>
          <div className="max-w-3xl mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-5 h-px bg-zj-cobalt" />
              <span className="text-[12.5px] font-medium tracking-wide text-zj-cobalt">
                {t.researchVoices.voicesEyebrow}
              </span>
            </div>
            <h2 className="font-serif-editorial text-[28px] sm:text-[36px] leading-[1.2] tracking-[-0.02em] text-zj-ink font-normal">
              {t.researchVoices.voicesTitle}
            </h2>
          </div>

          <div className="border border-zj-border">
            {/* Lead Horizontal Editorial Feature */}
            {leadVoice && (
              <article className="grid grid-cols-1 lg:grid-cols-12 bg-zj-mist/60 border-b border-zj-border">
                <div className="lg:col-span-4 p-6 sm:p-8 flex items-center gap-5 lg:border-r lg:border-zj-border bg-zj-white">
                  <Image
                    src={leadVoice.image}
                    alt={leadVoice.name[locale]}
                    width={96}
                    height={96}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[4px] object-cover border border-zj-border shrink-0"
                  />
                  <div>
                    <div className="text-[16px] font-semibold text-zj-ink">
                      {leadVoice.name[locale]}
                    </div>
                    <div className="mt-1 text-[12.5px] text-zj-slate leading-snug">
                      {leadVoice.role[locale]}
                    </div>
                    <div className="mt-1 text-[12px] font-medium text-zj-cobalt">
                      {leadVoice.institution[locale]}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <blockquote className="font-serif-editorial text-[20px] sm:text-[23px] leading-[1.55] text-zj-ink">
                    {leadVoice.quote[locale]}
                  </blockquote>
                  <div className="mt-5 pt-4 border-t border-zj-border flex items-center justify-between text-[12.5px]">
                    <span className="font-medium text-zj-safe">
                      {leadVoice.impactStat[locale]}
                    </span>
                    <span className="font-mono-hud text-[11px] text-zj-muted">
                      Verified Clinical Deployment Record
                    </span>
                  </div>
                </div>
              </article>
            )}

            {/* Two Secondary Columns Connected by 1px Hairline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zj-border">
              {secondaryVoices.map((voice) => (
                <article
                  key={voice.id}
                  className="bg-zj-white p-6 sm:p-8 flex flex-col justify-between"
                >
                  <blockquote className="text-[14.5px] leading-[1.78] text-zj-ink">
                    {voice.quote[locale]}
                  </blockquote>

                  <div className="mt-6 pt-5 border-t border-zj-border flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <Image
                        src={voice.image}
                        alt={voice.name[locale]}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-[4px] object-cover border border-zj-border shrink-0"
                      />
                      <div>
                        <div className="text-[14px] font-semibold text-zj-ink">
                          {voice.name[locale]}
                        </div>
                        <div className="text-[12px] text-zj-slate">
                          {voice.institution[locale]}
                        </div>
                      </div>
                    </div>

                    <span className="text-[12px] font-medium text-zj-safe bg-zj-mint-soft px-2.5 py-1 rounded-[3px] shrink-0">
                      {voice.impactStat[locale]}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Part 2: Academic Journal Publication Index */}
        <div className="mt-20 lg:mt-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-5 h-px bg-zj-cobalt" />
                <span className="text-[12.5px] font-medium tracking-wide text-zj-cobalt">
                  {t.researchVoices.researchEyebrow}
                </span>
              </div>
              <h3 className="font-serif-editorial text-[26px] sm:text-[32px] leading-[1.22] text-zj-ink font-normal">
                {t.researchVoices.researchTitle}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {filterTabs.map((tab) => {
                const active = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategory(tab.id)}
                    className={`px-3 py-1.5 text-[12.5px] font-medium rounded-[3px] border transition-colors cursor-pointer ${
                      active
                        ? "bg-zj-cobalt text-white border-zj-cobalt"
                        : "bg-zj-white text-zj-slate border-zj-border hover:text-zj-ink"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compact Horizontal Journal Index Rows (Abstract on Click) */}
          <div className="divide-y divide-zj-border border-y border-zj-border">
            {filteredPapers.map((paper) => (
              <article
                key={paper.id}
                onClick={() => setSelectedPaper(paper)}
                className="py-4 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center hover:bg-zj-mist/50 px-2 sm:px-4 transition-colors cursor-pointer"
              >
                <div className="lg:col-span-2 font-mono-hud text-[12px] text-zj-muted">
                  {paper.date}
                </div>

                <div className="lg:col-span-7">
                  <h4 className="text-[15.5px] font-semibold text-zj-ink leading-snug">
                    {paper.title[locale]}
                  </h4>
                  <div className="mt-1 text-[12px] text-zj-muted">
                    {paper.clinicalPartner[locale]}
                  </div>
                </div>

                <div className="lg:col-span-3 flex items-center lg:justify-end gap-3">
                  <span className="font-mono-hud text-[11.5px] font-medium text-zj-cobalt bg-zj-cobalt-soft px-2.5 py-1 rounded-[3px]">
                    {paper.metricBadge[locale]}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPaper(paper);
                    }}
                    className="inline-flex items-center gap-1 text-[12.5px] font-medium text-zj-cobalt hover:text-zj-blue cursor-pointer shrink-0"
                  >
                    {t.researchVoices.readPaper}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Report Abstract Modal */}
      {selectedPaper && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="paper-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zj-ink/45 backdrop-blur-[2px]"
        >
          <div
            className="fixed inset-0"
            onClick={() => setSelectedPaper(null)}
          />
          <div className="relative z-10 w-full max-w-xl bg-zj-white border border-zj-border-strong rounded-[4px] p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(9,30,58,0.25)]">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-zj-border">
              <div className="font-mono-hud text-[11.5px] text-zj-muted">
                {selectedPaper.date} · {selectedPaper.code}
              </div>
              <button
                type="button"
                onClick={() => setSelectedPaper(null)}
                aria-label={t.modals.closeBtn}
                className="text-zj-muted hover:text-zj-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h4
              id="paper-modal-title"
              className="mt-4 text-[19px] font-semibold text-zj-ink leading-snug"
            >
              {selectedPaper.title[locale]}
            </h4>
            <div className="mt-2 text-[12.5px] font-medium text-zj-cobalt">
              {selectedPaper.clinicalPartner[locale]}
            </div>
            <p className="mt-4 text-[14px] leading-[1.78] text-zj-slate">
              {selectedPaper.abstract[locale]}
            </p>

            <div className="mt-6 pt-4 border-t border-zj-border flex items-center justify-between gap-3">
              <span className="font-mono-hud text-[12px] text-zj-safe font-medium">
                {selectedPaper.metricBadge[locale]}
              </span>
              <button
                type="button"
                onClick={() => {
                  const title = selectedPaper.title[locale];
                  setSelectedPaper(null);
                  openDemoModal(title);
                }}
                className="px-4 py-2 text-[13px] font-medium text-white bg-zj-cobalt hover:bg-zj-blue rounded-[4px] cursor-pointer"
              >
                {t.nav.requestDemo}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
