"use client";

import React, { useEffect, useState } from "react";
import { X, CheckCircle2, ShieldCheck } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import type { UiDictionary } from "@/lib/ui-dictionary";

function DemoModalContent({
  initialScenario,
  onClose,
  t,
}: {
  initialScenario: string;
  onClose: () => void;
  t: UiDictionary;
}) {
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");
  const [contact, setContact] = useState("");
  const [scenario, setScenario] = useState(initialScenario);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="p-6 sm:p-8 text-center space-y-4">
        <CheckCircle2 className="w-10 h-10 text-zj-safe mx-auto" />
        <h4 className="text-[18px] font-semibold text-zj-ink">
          {t.modals.submittedTitle}
        </h4>
        <p className="text-[13.5px] text-zj-slate leading-relaxed">
          {t.modals.submittedDesc}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 px-5 py-2.5 text-[13.5px] font-medium text-white bg-zj-cobalt hover:bg-zj-blue rounded-[4px] cursor-pointer"
        >
          {t.modals.closeBtn}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="p-6 space-y-4"
    >
      <div>
        <label
          htmlFor="demo-org"
          className="block text-[12.5px] font-medium text-zj-ink mb-1"
        >
          {t.modals.orgLabel}
        </label>
        <input
          id="demo-org"
          type="text"
          required
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          placeholder={t.modals.orgPlaceholder}
          className="w-full px-3.5 py-2.5 text-[13.5px] bg-zj-white border border-zj-border-strong focus:border-zj-cobalt rounded-[4px] text-zj-ink focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="demo-role"
          className="block text-[12.5px] font-medium text-zj-ink mb-1"
        >
          {t.modals.roleLabel}
        </label>
        <input
          id="demo-role"
          type="text"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder={t.modals.rolePlaceholder}
          className="w-full px-3.5 py-2.5 text-[13.5px] bg-zj-white border border-zj-border-strong focus:border-zj-cobalt rounded-[4px] text-zj-ink focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="demo-contact"
          className="block text-[12.5px] font-medium text-zj-ink mb-1"
        >
          {t.modals.phoneLabel}
        </label>
        <input
          id="demo-contact"
          type="text"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={t.modals.phonePlaceholder}
          className="w-full px-3.5 py-2.5 text-[13.5px] bg-zj-white border border-zj-border-strong focus:border-zj-cobalt rounded-[4px] text-zj-ink focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="demo-scenario"
          className="block text-[12.5px] font-medium text-zj-ink mb-1"
        >
          {t.modals.scenarioLabel}
        </label>
        <input
          id="demo-scenario"
          type="text"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          className="w-full px-3.5 py-2.5 text-[13.5px] bg-zj-mist border border-zj-border focus:border-zj-cobalt rounded-[4px] text-zj-ink focus:outline-none"
        />
      </div>

      <div className="pt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-[13.5px] font-medium text-zj-slate hover:text-zj-ink border border-zj-border rounded-[4px] cursor-pointer"
        >
          {t.modals.closeBtn}
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-[13.5px] font-medium text-white bg-zj-cobalt hover:bg-zj-blue rounded-[4px] cursor-pointer"
        >
          {t.modals.submitBtn}
        </button>
      </div>
    </form>
  );
}

export function ModalsHud() {
  const {
    demoOpen,
    demoPresetContext,
    closeDemoModal,
    safetyOpen,
    closeSafetyModal,
    t,
  } = useI18n();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (demoOpen) closeDemoModal();
        if (safetyOpen) closeSafetyModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeDemoModal, closeSafetyModal, demoOpen, safetyOpen]);

  if (!demoOpen && !safetyOpen) return null;

  return (
    <>
      {demoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zj-ink/45 backdrop-blur-[2px]"
        >
          <div className="fixed inset-0" onClick={closeDemoModal} />
          <div className="relative z-10 w-full max-w-lg bg-zj-white border border-zj-border-strong rounded-[4px] shadow-[0_24px_60px_-15px_rgba(9,30,58,0.25)] overflow-hidden">
            <div className="px-6 py-5 bg-zj-mist border-b border-zj-border flex items-start justify-between gap-4">
              <div>
                <h3
                  id="demo-modal-title"
                  className="text-[18px] font-semibold text-zj-ink"
                >
                  {t.modals.demoTitle}
                </h3>
                <p className="mt-1 text-[13px] text-zj-slate leading-relaxed">
                  {t.modals.demoSub}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDemoModal}
                aria-label={t.modals.closeBtn}
                className="p-1 text-zj-muted hover:text-zj-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DemoModalContent
              key={demoPresetContext || "default"}
              initialScenario={demoPresetContext || ""}
              onClose={closeDemoModal}
              t={t}
            />
          </div>
        </div>
      )}

      {safetyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="safety-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zj-ink/45 backdrop-blur-[2px]"
        >
          <div className="fixed inset-0" onClick={closeSafetyModal} />
          <div className="relative z-10 w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-zj-white border border-zj-border-strong rounded-[4px] shadow-[0_24px_60px_-15px_rgba(9,30,58,0.25)]">
            <div className="px-6 py-5 bg-zj-mist border-b border-zj-border flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-zj-safe shrink-0 mt-0.5" />
                <div>
                  <h3
                    id="safety-modal-title"
                    className="text-[18px] font-semibold text-zj-ink"
                  >
                    {t.modals.safetyTitle}
                  </h3>
                  <p className="mt-1 text-[13px] text-zj-slate">
                    {t.modals.safetySub}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeSafetyModal}
                aria-label={t.modals.closeBtn}
                className="p-1 text-zj-muted hover:text-zj-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-zj-border">
              {t.modals.safetyPillars.map((pillar) => (
                <div key={pillar.title} className="px-6 py-4">
                  <h4 className="text-[14.5px] font-semibold text-zj-ink">
                    {pillar.title}
                  </h4>
                  <p className="mt-1.5 text-[13.5px] leading-[1.7] text-zj-slate">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-zj-mist border-t border-zj-border flex justify-end">
              <button
                type="button"
                onClick={closeSafetyModal}
                className="px-5 py-2 text-[13.5px] font-medium text-white bg-zj-cobalt hover:bg-zj-blue rounded-[4px] cursor-pointer"
              >
                {t.modals.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
