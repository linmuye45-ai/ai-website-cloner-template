"use client";

import React from "react";
import { useI18n } from "@/context/i18n-context";
import { PARTNER_INSTITUTIONS } from "@/lib/constellation-and-content";

export function TrustLedgerSection() {
  const { locale, t } = useI18n();

  return (
    <section className="bg-zj-mist border-b border-zj-border py-14 lg:py-16">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
          <h2 className="text-[13px] font-semibold tracking-wide text-zj-slate">
            {t.ledger.partnerHeading}
          </h2>
          <span className="font-mono-hud text-[11.5px] text-zj-muted">
            12 Representative Clinical Centers · Multi-Region Deployment
          </span>
        </div>

        {/* Continuous 1px Swiss Typographic Directory — Zero Repeating Stock Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-zj-border border border-zj-border">
          {PARTNER_INSTITUTIONS.map((inst) => (
            <div
              key={inst.code}
              className="bg-zj-white px-5 py-4 flex flex-col justify-between hover:bg-zj-mist/60 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 text-[11px] text-zj-muted">
                <span>{inst.sector[locale]}</span>
                <span className="font-mono-hud">{inst.code}</span>
              </div>
              <div className="mt-2 text-[14.5px] font-medium text-zj-ink tracking-tight">
                {inst.name[locale]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
