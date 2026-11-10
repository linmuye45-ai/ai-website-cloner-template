"use client";

import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { LOCALE_META } from "@/lib/ui-dictionary";
import { SOVEREIGN_NODES } from "@/lib/clinical-calls-and-agents";
import { COMPLIANCE_BADGES } from "@/lib/constellation-and-content";
import { ZhongJingLogoMark } from "./icons";

export function ComplianceAndFooter() {
  const {
    locale,
    setLocale,
    t,
    sovereignNode,
    setSovereignNode,
    openDemoModal,
    openSafetyModal,
  } = useI18n();

  return (
    <footer>
      {/* Flush 4x2 1px Regulatory & Security Governance Matrix */}
      <section className="bg-zj-mist border-b border-zj-border py-20 lg:py-24">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-5 h-px bg-zj-cobalt" />
              <span className="text-[12.5px] font-medium tracking-wide text-zj-cobalt">
                {t.complianceFooter.eyebrow}
              </span>
            </div>
            <h2 className="font-serif-editorial text-[28px] sm:text-[36px] leading-[1.2] tracking-[-0.02em] text-zj-ink font-normal">
              {t.complianceFooter.title}
            </h2>
            <p className="mt-4 text-[15px] leading-[1.75] text-zj-slate">
              {t.complianceFooter.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zj-border border border-zj-border">
            {COMPLIANCE_BADGES.map((badge) => (
              <div
                key={badge.id}
                className="bg-zj-white p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-hud text-[11px] text-zj-cobalt font-medium">
                      {badge.code}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-zj-safe shrink-0" />
                  </div>
                  <h3 className="mt-2 text-[14.5px] font-semibold text-zj-ink">
                    {badge.title[locale]}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-zj-border flex items-center justify-between text-[11.5px]">
                  <span className="text-zj-muted">{badge.scope[locale]}</span>
                  <button
                    type="button"
                    onClick={openSafetyModal}
                    className="text-zj-cobalt hover:text-zj-blue font-medium cursor-pointer"
                  >
                    {t.complianceFooter.detailsLink}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solid Deep Clinical Navy Closing & Institutional Footer */}
      <div className="bg-zj-navy text-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Calm Executive Department Pilot Banner */}
          <div className="py-16 lg:py-20 border-b border-zj-border-hud flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-serif-editorial text-[28px] sm:text-[36px] leading-[1.2] text-white font-normal">
                {t.complianceFooter.ctaBannerTitle}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.75] text-zj-hud-muted">
                {t.complianceFooter.ctaBannerSub}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 shrink-0">
              <button
                type="button"
                onClick={() => openDemoModal()}
                className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium text-zj-navy bg-white hover:bg-zj-mist rounded-[4px] transition-colors cursor-pointer"
              >
                {t.nav.requestDemo}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={openSafetyModal}
                className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium text-white border border-zj-border-hud hover:bg-zj-navy-card rounded-[4px] transition-colors cursor-pointer"
              >
                {t.hero.nonDiagLink}
              </button>
            </div>
          </div>

          {/* Institutional Footer Directory */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-zj-border-hud">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <ZhongJingLogoMark className="w-7 h-7" />
                <span className="text-[17px] font-semibold text-white">
                  {t.brandName}
                </span>
              </div>
              <p className="mt-3 text-[13.5px] text-zj-hud-muted max-w-sm leading-relaxed">
                {t.complianceFooter.footerTagline}
              </p>

              {/* Sovereign Intranet Quick Switch */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {SOVEREIGN_NODES.map((node) => {
                  const active = node.id === sovereignNode;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSovereignNode(node.id)}
                      className={`px-2.5 py-1 text-[11px] font-mono-hud rounded-[3px] border transition-colors cursor-pointer ${
                        active
                          ? "bg-zj-navy-elevated border-zj-cyan-bright/50 text-white"
                          : "bg-zj-navy-card border-zj-border-hud text-zj-hud-muted hover:text-white"
                      }`}
                    >
                      {node.code} ({node.latency})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-4 grid grid-cols-2 gap-6 text-[13px]">
              <div className="space-y-2.5">
                <div className="text-[11.5px] font-semibold text-white/70">
                  {t.nav.platform}
                </div>
                <ul className="space-y-2 text-zj-hud-muted">
                  <li>
                    <a href="#workbench" className="hover:text-white">
                      {t.nav.platform}
                    </a>
                  </li>
                  <li>
                    <a href="#standards" className="hover:text-white">
                      {t.nav.standards}
                    </a>
                  </li>
                  <li>
                    <a href="#agents" className="hover:text-white">
                      {t.nav.agents}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <div className="text-[11.5px] font-semibold text-white/70">
                  {t.nav.safety}
                </div>
                <ul className="space-y-2 text-zj-hud-muted">
                  <li>
                    <a href="#safety" className="hover:text-white">
                      {t.nav.safety}
                    </a>
                  </li>
                  <li>
                    <a href="#roi" className="hover:text-white">
                      {t.nav.roi}
                    </a>
                  </li>
                  <li>
                    <a href="#research" className="hover:text-white">
                      {t.nav.research}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col md:items-end justify-between gap-4">
              <div className="inline-flex items-center border border-zj-border-hud rounded-[4px] bg-zj-navy-card p-0.5">
                {LOCALE_META.map((item) => {
                  const active = item.code === locale;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setLocale(item.code)}
                      className={`px-2.5 py-1 text-[11.5px] rounded-[3px] transition-colors cursor-pointer ${
                        active
                          ? "bg-zj-navy-elevated text-white font-medium"
                          : "text-zj-hud-muted hover:text-white"
                      }`}
                    >
                      {item.shortLabel}
                    </button>
                  );
                })}
              </div>
              <div className="font-mono-hud text-[11px] text-zj-hud-muted">
                HL7 FHIR R4 · PIPL · SM4
              </div>
            </div>
          </div>

          {/* Copyright & Subtle Solid Architectural Wordmark */}
          <div className="py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px] text-zj-hud-muted">
            <p>{t.complianceFooter.copyright}</p>
            <span className="font-serif-editorial text-[22px] tracking-widest text-white/15 select-none">
              ZHONGJING CLINICAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
