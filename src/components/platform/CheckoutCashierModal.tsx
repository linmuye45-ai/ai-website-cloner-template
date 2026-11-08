"use client";

import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  Lock,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { redeemClientLicense } from "@/lib/crypto-license";
import { GLOBAL_MARKETS } from "@/lib/global-markets";
import type { LocaleCode, WhiteLabelConfig } from "@/types/platform";

interface CheckoutCashierModalProps {
  open: boolean;
  initialMode: "c_end" | "b_end" | "redeem";
  brand: WhiteLabelConfig;
  onClose: () => void;
  onActivatedLicense: (badgeText: string) => void;
}

type ConsumerPlanId = "sprint_30d" | "annual_black" | "bounty_pro";

const COPY: Record<
  LocaleCode,
  {
    headerTitle: string;
    tabC: string;
    tabKey: string;
    tabB: string;
    sprintName: string;
    sprintPrice: string;
    sprintSub: string;
    annualName: string;
    annualTag: string;
    annualSub: string;
    bountyName: string;
    bountyPrice: string;
    bountySub: string;
    payMethodLabel: string;
    payMethods: [string, string, string];
    instantPayBtn: string;
    guaranteeNote: string;
    keyLabel: string;
    keyBtn: string;
    sampleKeysLabel: string;
    orgNameLabel: string;
    seedPlan: string;
    flagshipPlan: string;
    copyProposalBtn: string;
    copiedText: string;
    unlockedBadgeName: string;
  }
> = {
  zh: {
    headerTitle: "选择学习卡方案或验证卡密",
    tabC: "个人学习卡",
    tabKey: "卡密激活",
    tabB: "机构白标合作",
    sprintName: "30 天考前冲刺卡",
    sprintPrice: "¥68",
    sprintSub: "开放全部真题扣分点改写、30 天练习室追问与考前模拟卷",
    annualName: "全年全科通卡",
    annualTag: "常用方案 · 7 天无理由全退",
    annualSub: "365 天不限科目批改、手写步骤验算与圆桌音频精讲",
    bountyName: "全年通卡 + 远程审校资格",
    bountyPrice: "¥899",
    bountySub: "包含阶段学习跟进，满 15 次闭卷达标后对接 ¥650–¥1,000/h 审校项目",
    payMethodLabel: "选择支付方式",
    payMethods: ["微信支付", "支付宝", "Apple Pay / 银联"],
    instantPayBtn: "确认开通所选方案",
    guaranteeNote: "7 天内不满意可在账户内一键原路退全款，不绑自动续费",
    keyLabel: "输入学习卡密或体验码",
    keyBtn: "验证并开通",
    sampleKeysLabel: "点击下方体验码可直接测试解锁效果：",
    orgNameLabel: "签约学校 / 工作室名称",
    seedPlan: "100 席标准机构版",
    flagshipPlan: "200 席独立域名白标版",
    copyProposalBtn: "复制机构合作报价单",
    copiedText: "报价单已复制",
    unlockedBadgeName: "全年通卡",
  },
  en: {
    headerTitle: "Unlock Full Examiner Redlines & 24/7 Coaching",
    tabC: "Individual Pass",
    tabKey: "Redeem Access Code",
    tabB: "School / OEM",
    sprintName: "30-Day Exam Sprint Pass",
    sprintPrice: "$19",
    sprintSub: "Unlock all hidden score-leak rewrites + 30d unlimited Socratic coaching",
    annualName: "Annual All-Access Black Card",
    annualTag: "Most Popular · 7-Day Full Refund",
    annualSub: "365 days unlimited redline grading + step verifier + dual-host podcasts",
    bountyName: "Scholar Bounty Pro",
    bountyPrice: "$349",
    bountySub: "Includes weekly check-ins + $85–$140/hr AI fellowship access at 15 Stars",
    payMethodLabel: "Express Checkout Method",
    payMethods: ["Apple Pay", "Credit / Debit Card", "PayPal"],
    instantPayBtn: "Complete & Unlock All Score Boosts Now",
    guaranteeNote: "100% instant refund within 7 days · Cancel anytime in 1 click",
    keyLabel: "Enter Scholarship or Academy Access Key",
    keyBtn: "Verify & Unlock Instantly",
    sampleKeysLabel: "Tap a demo key below to test full Pro unlocking immediately:",
    orgNameLabel: "Academy / Institution Name",
    seedPlan: "100-Seat Cohort License",
    flagshipPlan: "200-Seat White-Label OEM",
    copyProposalBtn: "Copy Commercial Proposal",
    copiedText: "Proposal Copied",
    unlockedBadgeName: "Black Card",
  },
  ja: {
    headerTitle: "赤ペン添削の全文解放 ＆ 合格パス登録",
    tabC: "個人合格パス",
    tabKey: "コード引き換え",
    tabB: "塾・法人契約",
    sprintName: "直前30日 集中突破パス",
    sprintPrice: "¥2,480",
    sprintSub: "全減点箇所の満点書き換え解放 ＋ 30日間無制限1対1指導",
    annualName: "年間オールアクセス黒カード",
    annualTag: "人気No.1 · 7日間全額返金保証",
    annualSub: "365日全コース記述添削し放題 ＋ 手書き途中式検証 ＋ 音声解説",
    bountyName: "スカラー報酬パス Pro",
    bountyPrice: "¥49,800",
    bountySub: "週次コーチ管理 ＋ 15スター達成で時給13,000円〜のAI評価案件推薦",
    payMethodLabel: "お支払い方法",
    payMethods: ["PayPay / LINE Pay", "Apple Pay", "クレジットカード"],
    instantPayBtn: "今すぐ有効化して全添削を表示する",
    guaranteeNote: "7日以内ならワンクリックで全額返金 · 自動更新の縛りなし",
    keyLabel: "受講コードまたは体験キーを入力",
    keyBtn: "認証して今すぐ解放",
    sampleKeysLabel: "テスト用コードで即時アンロックを体験できます：",
    orgNameLabel: "導入塾・機関名",
    seedPlan: "100席パイロット契約",
    flagshipPlan: "200席独自ブランドOEM契約",
    copyProposalBtn: "法人見積書をコピー",
    copiedText: "コピー完了",
    unlockedBadgeName: "黒カード有効",
  },
  es: {
    headerTitle: "Desbloquea Todas las Correcciones y Tutoría 24/7",
    tabC: "Pase Individual",
    tabKey: "Canjear Código",
    tabB: "Academias OEM",
    sprintName: "Sprint Intensivo 30 Días",
    sprintPrice: "€15",
    sprintSub: "Desbloquea todas las reescrituras + 30 días de tutor socrático ilimitado",
    annualName: "Tarjeta Negra Anual Total",
    annualTag: "Más Elegido · 7 Días Garantía Total",
    annualSub: "365 días de corrección ilimitada + pizarra manuscrita + podcasts",
    bountyName: "Pase Beca Experto Pro",
    bountyPrice: "€279",
    bountySub: "Seguimiento semanal + proyectos IA de €85–€130/h al lograr 15 Estrellas",
    payMethodLabel: "Método de Pago Rápido",
    payMethods: ["Apple Pay / Google Pay", "Tarjeta Bancaria", "Bizum / PayPal"],
    instantPayBtn: "Activar Pase y Desbloquear Todo Ahora",
    guaranteeNote: "Reembolso íntegro en 7 días con un solo clic · Sin permanencia",
    keyLabel: "Introduce tu Código de Acceso o Beca",
    keyBtn: "Verificar y Desbloquear",
    sampleKeysLabel: "Prueba el desbloqueo inmediato con estas claves de demostración:",
    orgNameLabel: "Nombre de la Academia",
    seedPlan: "Licencia Cohorte 100 Plazas",
    flagshipPlan: "Marca Blanca OEM 200 Plazas",
    copyProposalBtn: "Copiar Propuesta Comercial",
    copiedText: "Copiado",
    unlockedBadgeName: "Pase Negro",
  },
};

export function CheckoutCashierModal({
  open,
  initialMode,
  brand,
  onClose,
  onActivatedLicense,
}: CheckoutCashierModalProps) {
  const [mode, setMode] = useState<"c_end" | "b_end" | "redeem">(initialMode);
  const [selectedPlan, setSelectedPlan] =
    useState<ConsumerPlanId>("annual_black");
  const [selectedPayIdx, setSelectedPayIdx] = useState<number>(0);
  const [orgPlan, setOrgPlan] = useState<"seed" | "flagship">("seed");
  const [clientOrgInput, setClientOrgInput] = useState(brand.brandName);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [redeemInput, setRedeemInput] = useState("DSG-VIP-GLOBAL-2026");
  const [redeemStatus, setRedeemStatus] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const t = COPY[brand.locale];
  const market = GLOBAL_MARKETS[brand.locale];
  const b2bAmount =
    orgPlan === "seed" ? brand.orgSeedPrice : brand.orgWhitelabelPrice;

  const handleExpressUnlock = () => {
    onActivatedLicense(t.unlockedBadgeName);
  };

  const handleVerifyKey = () => {
    const res = redeemClientLicense(redeemInput, brand);
    setRedeemStatus({ ok: res.ok, msg: res.message });
    if (res.ok) {
      setTimeout(() => {
        onActivatedLicense(res.record?.tierLabel ?? t.unlockedBadgeName);
      }, 400);
    }
  };

  const handleCopyProposal = async () => {
    const quoteText = `${clientOrgInput} — ${
      orgPlan === "seed" ? t.seedPlan : t.flagshipPlan
    } (${brand.currencySymbol}${b2bAmount.toLocaleString()}/yr) · ${
      market.paymentRails
    }`;
    try {
      await navigator.clipboard.writeText(quoteText);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 1800);
    } catch {
      setCopiedQuote(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.headerTitle}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="overlay-shadow w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand" />
            <h2 className="text-[15px] font-semibold text-foreground">
              {t.headerTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Clean 3-Mode Pill Bar */}
        <div className="flex border-b border-border bg-muted/45 px-6 pt-2.5 gap-5">
          {(
            [
              { id: "c_end", label: t.tabC },
              { id: "redeem", label: t.tabKey },
              { id: "b_end", label: t.tabB },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={`border-b-2 pb-2.5 text-xs font-semibold transition-colors ${
                mode === tab.id
                  ? "border-brand text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {mode === "c_end" && (
            <>
              {/* 3 Tactile Selectable Plan Rows */}
              <div className="space-y-2.5">
                {/* Sprint 30d */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("sprint_30d")}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all ${
                    selectedPlan === "sprint_30d"
                      ? "border-brand bg-brand-soft/45 ring-1 ring-brand"
                      : "border-border bg-background hover:border-foreground/30"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">
                      {t.sprintName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t.sprintSub}
                    </p>
                  </div>
                  <div className="shrink-0 font-mono text-xl font-bold tabular-nums text-foreground">
                    {t.sprintPrice}
                  </div>
                </button>

                {/* Annual Black Card */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("annual_black")}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all ${
                    selectedPlan === "annual_black"
                      ? "border-brand bg-brand-soft/45 ring-1 ring-brand"
                      : "border-border bg-background hover:border-foreground/30"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {t.annualName}
                      </span>
                      <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                        {t.annualTag}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t.annualSub}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-xl font-bold tabular-nums text-brand">
                      {brand.currencySymbol}
                      {brand.studentAnnualPrice.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-muted-foreground">/ yr</div>
                  </div>
                </button>

                {/* Bounty Pro */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("bounty_pro")}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all ${
                    selectedPlan === "bounty_pro"
                      ? "border-brand bg-brand-soft/45 ring-1 ring-brand"
                      : "border-border bg-background hover:border-foreground/30"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">
                      {t.bountyName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t.bountySub}
                    </p>
                  </div>
                  <div className="shrink-0 font-mono text-xl font-bold tabular-nums text-foreground">
                    {t.bountyPrice}
                  </div>
                </button>
              </div>

              {/* Express Payment Selector */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  {t.payMethodLabel}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {t.payMethods.map((pm, idx) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setSelectedPayIdx(idx)}
                      className={`rounded-lg border py-2 text-xs font-semibold ${
                        selectedPayIdx === idx
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background text-foreground hover:bg-secondary"
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Express Unlock CTA */}
              <button
                type="button"
                onClick={handleExpressUnlock}
                className="btn-tactile-brand flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold"
              >
                <Zap className="h-4 w-4" />
                <span>{t.instantPayBtn}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" />
                <span>{t.guaranteeNote}</span>
              </div>
            </>
          )}

          {mode === "redeem" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-foreground">
                  {t.keyLabel}
                </label>
                <input
                  type="text"
                  value={redeemInput}
                  onChange={(e) => setRedeemInput(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 font-mono text-sm text-foreground focus:border-brand focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyKey}
                className="btn-tactile-brand flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>{t.keyBtn}</span>
              </button>

              {redeemStatus && (
                <div
                  className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                    redeemStatus.ok
                      ? "bg-brand-soft text-brand"
                      : "bg-deduct-soft text-deduct"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{redeemStatus.msg}</span>
                </div>
              )}

              <div className="rounded-xl border border-border bg-secondary/50 p-3.5 space-y-2">
                <div className="text-[11px] text-muted-foreground">
                  {t.sampleKeysLabel}
                </div>
                <div className="flex flex-wrap gap-2">
                  {["DSG-VIP-GLOBAL-2026", "DS-ORG-2026-7788"].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setRedeemInput(k)}
                      className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs font-semibold text-foreground hover:border-brand"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === "b_end" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  {t.orgNameLabel}
                </label>
                <input
                  type="text"
                  value={clientOrgInput}
                  onChange={(e) => setClientOrgInput(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrgPlan("seed")}
                  className={`rounded-xl border p-4 text-left ${
                    orgPlan === "seed"
                      ? "border-brand bg-brand-soft/40 ring-1 ring-brand"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="text-xs font-semibold text-foreground">
                    {t.seedPlan}
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-foreground">
                    {brand.currencySymbol}
                    {brand.orgSeedPrice.toLocaleString()}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setOrgPlan("flagship")}
                  className={`rounded-xl border p-4 text-left ${
                    orgPlan === "flagship"
                      ? "border-brand bg-brand-soft/40 ring-1 ring-brand"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="text-xs font-semibold text-foreground">
                    {t.flagshipPlan}
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-brand">
                    {brand.currencySymbol}
                    {brand.orgWhitelabelPrice.toLocaleString()}
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyProposal}
                className="btn-lovable-dark flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-semibold"
              >
                {copiedQuote ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>{t.copiedText}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>{t.copyProposalBtn}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
