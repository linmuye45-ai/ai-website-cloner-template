"use client";

import React from "react";
import { X } from "@phosphor-icons/react";
import type { LocaleCode } from "@/types/platform";

export type LegalDocTab = "privacy" | "terms" | "opensource";
interface LegalComplianceModalProps { open: boolean; initialTab: LegalDocTab; locale: LocaleCode; onClose: () => void; }

export function LegalComplianceModal({ open, initialTab, locale, onClose }: LegalComplianceModalProps) {
  if (!open) return null;
  const zh = locale === "zh";
  const content = {
    privacy: zh ? "这是产品演示，正式隐私政策尚未制定。请勿输入敏感个人信息。使用外部模型服务时，输入内容可能发送给所配置的服务提供商。" : "This is a prototype and a formal privacy policy is not yet available. Do not enter sensitive personal information. External model services may receive submitted content.",
    terms: zh ? "这是产品原型，支付、退款和正式服务条款尚未接入或确定。页面中的价格仅用于方案演示。" : "This is a prototype. Payment, refunds, and formal service terms are not yet available. Prices are illustrative.",
    opensource: zh ? "产品设计参考 DeepTutor、OpenMAIC、open-notebook 和 FSRS。参考不等于已集成；实际使用或分发第三方代码时，需核实并遵守各项目的许可要求。" : "The design references DeepTutor, OpenMAIC, open-notebook and FSRS. References do not imply integration. Verify and comply with the applicable licenses before using or distributing third-party code."
  };
  return <div role="dialog" aria-modal="true" aria-label={zh ? "说明" : "Information"} className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" onClick={onClose}>
    <div className="w-full max-w-xl rounded-2xl border border-border bg-background p-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between gap-4"><h2 className="heading-5">{initialTab === "privacy" ? (zh ? "隐私说明" : "Privacy") : initialTab === "terms" ? (zh ? "服务说明" : "Terms") : (zh ? "开源参考" : "Open source")}</h2><button onClick={onClose} aria-label={zh ? "关闭" : "Close"} className="rounded-lg p-2 focus-visible:ring-2 focus-visible:ring-ring"><X size={20} /></button></div>
      <p className="body-3 mt-5 text-muted-foreground">{content[initialTab]}</p>
    </div>
  </div>;
}
