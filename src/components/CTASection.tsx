"use client";

import React from "react";
import { ArrowRight, Mail, PhoneForwarded } from "lucide-react";
import { useI18n } from "@/context/i18n-context";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: {
      "zh-CN": "准备开始",
      "zh-TW": "準備開始",
      en: "Get Started",
      ja: "導入を開始する",
    },
    title: {
      "zh-CN": "不卖软件。交付临床结果。",
      "zh-TW": "不賣軟體。交付臨床結果。",
      en: "Not selling software. Delivering clinical outcomes.",
      ja: "ソフトウェアは売らない。臨床アウトカムを提供する。",
    },
    sub: {
      "zh-CN": "预约一次 30 分钟演示，在您的试点科室体验真实的临床工作流。无需全院合同，无需公有云。",
      "zh-TW": "預約一次 30 分鐘演示，在您的試點科室體驗真實的臨床工作流。無需全院合同，無需公有雲。",
      en: "Book a 30-minute demo. Experience real clinical workflow in your pilot department. No enterprise-wide contract. No public cloud.",
      ja: "30分間のデモを予約。パイロット科室で実際の臨床ワークフローを体験。院全体契約不要。パブリッククラウド不要。",
    },
    demoBtn: { "zh-CN": "预约 30 分钟演示", "zh-TW": "預約 30 分鐘演示", en: "Book a 30-Minute Demo", ja: "30分間のデモを予約" },
    safetyBtn: { "zh-CN": "查看非诊断边界声明", "zh-TW": "查看非診斷邊界聲明", en: "Non-Diagnostic Boundary Statement", ja: "非診断境界声明を表示" },
    contactLabel: { "zh-CN": "联系", "zh-TW": "聯絡", en: "Contact", ja: "お問い合わせ" },
    contactMail: { "zh-CN": "clinical-ops@zhongjing.internal", "zh-TW": "clinical-ops@zhongjing.internal", en: "clinical-ops@zhongjing.internal", ja: "clinical-ops@zhongjing.internal" },
    contactTel: { "zh-CN": "+86 21 5555 0100", "zh-TW": "+86 21 5555 0100", en: "+86 21 5555 0100", ja: "+86 21 5555 0100" },
    note: {
      "zh-CN": "本系统为临床决策支持工具，不承担诊断或治疗决策责任，最终临床决策权归执业医师所有。",
      "zh-TW": "本系統為臨床決策支援工具，不承擔診斷或治療決策責任，最終臨床決策權歸執業醫師所有。",
      en: "This system is a clinical decision support tool and does not assume diagnosis or treatment decision responsibility. Final clinical decision authority rests with the licensed physician.",
      ja: "本システムは臨床意思決定支援ツールであり、診断や治療の意思決定責任は負いません。最終的な臨床意思決定権は免許を持つ医師に帰属します。",
    },
  };
  return map[key][l] || key;
}

export function CTASection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";

  const get = (key: string) => T(key, l);

  return (
    <section id="cta" className="bg-zj-bg border-b border-zj-border/30 py-24 lg:py-32 relative overflow-hidden reveal">
      {/* Decorative glow */}
      <div className="geom-circle w-[900px] h-[900px] bg-zj-cobalt-soft/40 top-[-10%] left[-10%] rounded-full blur-[140px]" />
      <div className="geom-circle w-[700px] h-[700px] bg-zj-clinical-teal-soft/40 bottom[-10%] right[-10%] rounded-full blur-[120px]" />

      <div className="relative section-container">
        <div className="max-w-3xl mx-auto text-center">
          <span className="eyebrow text-zj-clinical-green mb-8 block tracking-[0.18em]">
            {get("eyebrow")}
          </span>

          <h2 className="font-serif-editorial text-[34px] sm:text-[48px] lg:text-[64px] xl:text-[80px] leading-[1.05] tracking-[-0.03em] text-zj-ink font-normal mb-8">
            {get("title")}
          </h2>

          <p className="max-w-[52ch] mx-auto text-[17px] sm:text-[20px] leading-[1.9] text-zj-ink-soft mb-12">
            {get("sub")}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button
              type="button"
              className="btn-base btn-primary inline-flex items-center gap-2 min-w-[280px] justify-center"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("zj-open-demo"));
              }}
            >
              {get("demoBtn")}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              className="btn-base btn-ghost inline-flex items-center gap-2 min-w-[280px] justify-center"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("zj-open-safety"));
              }}
            >
              {get("safetyBtn")}
            </button>
          </div>

          <div className="mt-16 pt-10 border-t border-zj-border/30">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-[13px] text-zj-muted/80">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zj-cobalt/60" />
                <span>{get("contactLabel")}</span>
                <a
                  href={`mailto:${get("contactMail")}`}
                  className="text-zj-cobalt hover:underline underline-offset-2"
                >
                  {get("contactMail")}
                </a>
              </div>
              <span className="w-px h-4 bg-zj-muted/30" />
              <div className="flex items-center gap-2">
                <PhoneForwarded className="w-3.5 h-3.5 text-zj-cobalt/60" />
                <span>{get("contactTel")}</span>
              </div>
            </div>

            <p className="mt-8 text-[11px] leading-[1.6] text-zj-muted/50 max-w-[48ch] mx-auto">
              {get("note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
