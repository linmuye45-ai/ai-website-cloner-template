"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Copy, Download, KeyRound, Upload } from "lucide-react";
import { formatMoney } from "@/lib/global-markets";
import { issueSignedLicense } from "@/lib/crypto-license";
import { UI_COPY } from "@/lib/i18n-ui";
import type {
  GatewayConfig,
  LocaleCode,
  WhiteLabelConfig,
} from "@/types/platform";

interface EnterpriseConsoleViewProps {
  brand: WhiteLabelConfig;
  onUpdateBrand: (next: WhiteLabelConfig) => void;
  gateway: GatewayConfig;
  onUpdateGateway: (next: GatewayConfig) => void;
  onDownloadStandalone: () => void;
  onExportWorkspaceJson: () => void;
  onImportWorkspaceJson: (raw: string) => boolean;
  onOpenCashier: (mode?: "c_end" | "b_end" | "redeem") => void;
}

export function EnterpriseConsoleView({
  brand,
  onUpdateBrand,
  gateway,
  onUpdateGateway,
  onDownloadStandalone,
  onExportWorkspaceJson,
  onImportWorkspaceJson,
  onOpenCashier,
}: EnterpriseConsoleViewProps) {
  const t = UI_COPY[brand.locale].enterprise;

  const [pricingModel, setPricingModel] = useState<"outcome" | "flat">(
    "outcome"
  );
  const [studentsCount, setStudentsCount] = useState<number>(200);
  const [taCount, setTaCount] = useState<number>(3);
  const [taCost, setTaCost] = useState<number>(brand.defaultTaMonthlyCost);
  const [upsellFee, setUpsellFee] = useState<number>(brand.defaultUpsellTicket);

  const [subTab, setSubTab] = useState<"oem" | "keys" | "deploy">("oem");
  const [savedConfig, setSavedConfig] = useState<boolean>(false);

  // License generator
  const [tier, setTier] = useState<"SCHOLAR" | "OEM" | "PARTNER">("OEM");
  const [regionCode, setRegionCode] = useState<LocaleCode>(brand.locale);
  const [orgSeed, setOrgSeed] = useState<string>("ACADEMY");
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const payrollSaved = Math.round(taCount * taCost * 12 * 0.7);
  const upsellRevenue = Math.round(studentsCount * 0.3 * upsellFee);

  const outcomeUnitPrice =
    brand.locale === "zh"
      ? 160
      : brand.locale === "ja"
      ? 2600
      : brand.locale === "es"
      ? 18
      : 22;

  const platformAnnualCost =
    pricingModel === "flat"
      ? brand.orgWhitelabelPrice +
        studentsCount * brand.monthlyTokenCostPerStudent * 12
      : Math.round(studentsCount * 6 * outcomeUnitPrice);

  const netOperatingGain = payrollSaved + upsellRevenue - platformAnnualCost;
  const paybackSeats = Math.max(
    1,
    Math.ceil(brand.orgWhitelabelPrice / Math.max(1, upsellFee))
  );

  const mintedKey = useMemo(
    () => issueSignedLicense(tier, regionCode, orgSeed),
    [tier, regionCode, orgSeed]
  );

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(mintedKey);
    setCopiedKey(true);
    window.setTimeout(() => setCopiedKey(false), 1800);
  };

  const handleSaveConfig = () => {
    setSavedConfig(true);
    window.setTimeout(() => setSavedConfig(false), 1800);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onImportWorkspaceJson(reader.result);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="surface-elevated divide-y divide-border overflow-hidden rounded-xl border border-border">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div>
          <h1 className="text-base font-semibold text-foreground">{t.title}</h1>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onOpenCashier("b_end")}
            className="rounded-md bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-opacity duration-100 hover:opacity-90"
          >
            {t.generateProposalBtn}
          </button>
          <button
            type="button"
            onClick={() => onOpenCashier("redeem")}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            {t.verifyKeyBtn}
          </button>
        </div>
      </div>

      {/* Section 1: Outcome-Based vs Annual OEM Unit Economics Simulator */}
      <section className="space-y-4 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-foreground">
            {t.pricingModelLabel}
          </span>
          <div className="inline-flex rounded-md border border-border bg-muted/30 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setPricingModel("outcome")}
              className={`rounded-sm px-2.5 py-1 text-[11px] font-medium transition-colors duration-100 ${
                pricingModel === "outcome"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.outcomeMode}
            </button>
            <button
              type="button"
              onClick={() => setPricingModel("flat")}
              className={`rounded-sm px-2.5 py-1 text-[11px] font-medium transition-colors duration-100 ${
                pricingModel === "flat"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.annualSeatMode}
            </button>
          </div>
        </div>

        <div className="grid divide-y divide-border rounded-md border border-border lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          {/* Sliders */}
          <div className="grid gap-4 p-5 text-xs sm:grid-cols-2 lg:col-span-7">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.studentsSlider}</span>
                <span className="font-mono font-semibold tabular-nums text-foreground">
                  {studentsCount}
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={1200}
                step={10}
                value={studentsCount}
                onChange={(e) => setStudentsCount(Number(e.target.value))}
                aria-label={t.studentsSlider}
                className="w-full accent-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.taCountSlider}</span>
                <span className="font-mono font-semibold tabular-nums text-foreground">
                  {taCount}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={taCount}
                onChange={(e) => setTaCount(Number(e.target.value))}
                aria-label={t.taCountSlider}
                className="w-full accent-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.taCostSlider}</span>
                <span className="font-mono font-semibold tabular-nums text-foreground">
                  {formatMoney(taCost, brand.locale)}
                </span>
              </div>
              <input
                type="range"
                min={Math.round(brand.defaultTaMonthlyCost * 0.5)}
                max={Math.round(brand.defaultTaMonthlyCost * 2)}
                step={Math.max(50, Math.round(brand.defaultTaMonthlyCost * 0.1))}
                value={taCost}
                onChange={(e) => setTaCost(Number(e.target.value))}
                aria-label={t.taCostSlider}
                className="w-full accent-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.upsellSlider}</span>
                <span className="font-mono font-semibold tabular-nums text-foreground">
                  {formatMoney(upsellFee, brand.locale)}
                </span>
              </div>
              <input
                type="range"
                min={Math.round(brand.defaultUpsellTicket * 0.5)}
                max={Math.round(brand.defaultUpsellTicket * 2.5)}
                step={Math.max(20, Math.round(brand.defaultUpsellTicket * 0.1))}
                value={upsellFee}
                onChange={(e) => setUpsellFee(Number(e.target.value))}
                aria-label={t.upsellSlider}
                className="w-full accent-foreground"
              />
            </div>
          </div>

          {/* Operating Ledger */}
          <div className="flex flex-col justify-between bg-muted/15 p-5 text-xs lg:col-span-5">
            <dl className="space-y-2 border-b border-border pb-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">{t.linePayroll}</dt>
                <dd className="font-mono font-medium tabular-nums text-foreground">
                  +{formatMoney(payrollSaved, brand.locale)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">{t.lineUpsell}</dt>
                <dd className="font-mono font-medium tabular-nums text-foreground">
                  +{formatMoney(upsellRevenue, brand.locale)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">{t.linePlatformFee}</dt>
                <dd className="font-mono tabular-nums text-muted-foreground">
                  -{formatMoney(platformAnnualCost, brand.locale)}
                </dd>
              </div>
            </dl>

            <div className="pt-3">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-foreground">
                  {t.netImpactLabel}
                </span>
                <span className="font-mono text-xl font-semibold tabular-nums text-brand">
                  {formatMoney(netOperatingGain, brand.locale)}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {t.paybackPrefix}
                <strong className="font-mono font-semibold text-foreground">
                  {paybackSeats}
                </strong>
                {t.paybackSuffix}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: OEM Identity / License Signer / Edge Delivery Sub-Tabs */}
      <section className="px-6 py-5 space-y-4">
        <div className="flex items-center gap-5 border-b border-border text-xs">
          {(
            [
              { id: "oem", label: t.tabOem },
              { id: "keys", label: t.tabKeys },
              { id: "deploy", label: t.tabDeployment },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubTab(item.id)}
              className={`border-b-2 pb-2.5 font-medium transition-colors duration-100 ${
                subTab === item.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {subTab === "oem" && (
          <div className="grid gap-6 pt-1 lg:grid-cols-12">
            <div className="grid gap-3 text-xs sm:grid-cols-2 lg:col-span-6">
              <div>
                <label
                  htmlFor="ent-brand-input"
                  className="mb-1 block text-[11px] text-muted-foreground"
                >
                  {t.brandNameLabel}
                </label>
                <input
                  id="ent-brand-input"
                  type="text"
                  value={brand.brandName}
                  onChange={(e) =>
                    onUpdateBrand({ ...brand, brandName: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-foreground focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="ent-domain-input"
                  className="mb-1 block text-[11px] text-muted-foreground"
                >
                  {t.domainLabel}
                </label>
                <input
                  id="ent-domain-input"
                  type="text"
                  value={brand.customDomain}
                  onChange={(e) =>
                    onUpdateBrand({ ...brand, customDomain: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 font-mono text-xs text-foreground focus:border-foreground focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="ent-tutor-input"
                  className="mb-1 block text-[11px] text-muted-foreground"
                >
                  {t.tutorNameLabel}
                </label>
                <input
                  id="ent-tutor-input"
                  type="text"
                  value={brand.tutorName}
                  onChange={(e) =>
                    onUpdateBrand({ ...brand, tutorName: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-foreground focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="ent-fee-input"
                  className="mb-1 block text-[11px] text-muted-foreground"
                >
                  {t.annualFeeLabel} ({brand.currencyCode})
                </label>
                <input
                  id="ent-fee-input"
                  type="number"
                  value={brand.orgWhitelabelPrice}
                  onChange={(e) =>
                    onUpdateBrand({
                      ...brand,
                      orgWhitelabelPrice: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 font-mono text-xs text-foreground focus:border-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-md border border-border bg-muted/15 p-4 text-xs lg:col-span-6">
              <div>
                <div className="font-semibold text-foreground">
                  {t.gatewayTitle}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {t.gatewaySub}
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <input
                  type="url"
                  value={gateway.baseUrl}
                  onChange={(e) =>
                    onUpdateGateway({ ...gateway, baseUrl: e.target.value })
                  }
                  placeholder="https://api.openai.com/v1"
                  aria-label="Gateway base URL"
                  className="rounded-md border border-input bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                />
                <input
                  type="text"
                  value={gateway.modelName}
                  onChange={(e) =>
                    onUpdateGateway({ ...gateway, modelName: e.target.value })
                  }
                  placeholder="gpt-4o-mini"
                  aria-label="Model name"
                  className="rounded-md border border-input bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  value={gateway.apiKey}
                  onChange={(e) =>
                    onUpdateGateway({ ...gateway, apiKey: e.target.value })
                  }
                  placeholder="sk-..."
                  aria-label="API Key"
                  className="min-w-0 flex-1 rounded-md border border-input bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background"
                >
                  {savedConfig ? t.savedConfigBtn : t.saveConfigBtn}
                </button>
              </div>
            </div>
          </div>
        )}

        {subTab === "keys" && (
          <div className="max-w-xl space-y-3 pt-1 text-xs">
            <div className="grid gap-2 sm:grid-cols-3">
              <select
                value={tier}
                onChange={(e) =>
                  setTier(e.target.value as "SCHOLAR" | "OEM" | "PARTNER")
                }
                aria-label="License tier"
                className="rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
              >
                <option value="OEM">OEM Enterprise (200)</option>
                <option value="PARTNER">Channel Partner</option>
                <option value="SCHOLAR">Individual Seat</option>
              </select>

              <select
                value={regionCode}
                onChange={(e) => setRegionCode(e.target.value as LocaleCode)}
                aria-label="Region"
                className="rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
              >
                <option value="zh">CN · CNY</option>
                <option value="en">US · USD</option>
                <option value="ja">JP · JPY</option>
                <option value="es">EU · EUR</option>
              </select>

              <input
                type="text"
                value={orgSeed}
                onChange={(e) => setOrgSeed(e.target.value)}
                aria-label="Seed"
                className="rounded-md border border-input bg-background px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-4 py-2.5 font-mono text-xs">
              <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                <KeyRound className="h-3.5 w-3.5 text-brand" strokeWidth={1.5} />
                <span>{mintedKey}</span>
              </span>
              <button
                type="button"
                onClick={handleCopyKey}
                className="inline-flex items-center gap-1 font-sans text-xs font-medium text-brand hover:underline"
              >
                {copiedKey ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{t.issueKeyBtn}</span>
              </button>
            </div>
          </div>
        )}

        {subTab === "deploy" && (
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
            <button
              type="button"
              onClick={onDownloadStandalone}
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-2 text-xs font-medium text-background"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>{t.downloadHtmlBtn}</span>
            </button>

            <button
              type="button"
              onClick={onExportWorkspaceJson}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>JSON Snapshot</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
            >
              <Upload className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>Restore JSON</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              className="hidden"
            />

            <code className="rounded-md border border-border bg-muted/30 px-3 py-1.5 font-mono text-xs text-muted-foreground">
              $ npm run build:static
            </code>
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
