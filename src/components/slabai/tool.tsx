"use client";

import { useRef, useState } from "react";
import {
  PRESETS,
  PROFIT_SCENARIOS,
  calculateYear3AndTotal,
  generateSlabReport,
  type CollectibleId,
  type ConditionLevel,
  type ScenarioKey,
  type SlabReport,
} from "@/lib/slabai";

function CollectibleArtwork({ id }: { id: CollectibleId }) {
  if (id === "pikachu") {
    return (
      <svg viewBox="0 0 240 320" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="vg-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
        </defs>
        <rect width="240" height="320" rx="14" fill="#FDE047" />
        <rect x="10" y="10" width="220" height="300" rx="10" fill="url(#vg-bg)" />
        {/* 星空漩涡 */}
        <path
          d="M25 60 Q90 20 150 65 T215 55"
          stroke="#Fef08a"
          strokeWidth="4"
          strokeDasharray="8 5"
          fill="none"
          opacity="0.75"
        />
        <path
          d="M20 95 Q85 65 145 100 T220 90"
          stroke="#93C5FD"
          strokeWidth="3"
          strokeDasharray="6 4"
          fill="none"
          opacity="0.7"
        />
        {/* 灰毡帽 */}
        <ellipse cx="120" cy="128" rx="64" ry="22" fill="#9CA3AF" stroke="#4B5563" strokeWidth="3" />
        <path d="M75 125 Q120 72 165 125 Z" fill="#D1D5DB" stroke="#4B5563" strokeWidth="3" />
        {/* 耳朵 */}
        <path d="M74 115 L44 62 L68 58 L92 102 Z" fill="#FACC15" stroke="#1E293B" strokeWidth="2.5" />
        <path d="M44 62 L58 76 L68 58 Z" fill="#1E293B" />
        <path d="M166 115 L196 62 L172 58 L148 102 Z" fill="#FACC15" stroke="#1E293B" strokeWidth="2.5" />
        <path d="M196 62 L182 76 L172 58 Z" fill="#1E293B" />
        {/* 脸 */}
        <circle cx="120" cy="172" r="46" fill="#FACC15" stroke="#1E293B" strokeWidth="3" />
        <circle cx="102" cy="164" r="5.5" fill="#1E293B" />
        <circle cx="138" cy="164" r="5.5" fill="#1E293B" />
        <circle cx="100" cy="162" r="2" fill="#FFF" />
        <circle cx="136" cy="162" r="2" fill="#FFF" />
        <circle cx="84" cy="182" r="9" fill="#EF4444" />
        <circle cx="156" cy="182" r="9" fill="#EF4444" />
        <path d="M112 178 Q120 185 128 178" stroke="#1E293B" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        {/* 蓝外套 */}
        <path d="M70 265 Q80 212 120 212 Q160 212 170 265 Z" fill="#1D4ED8" stroke="#1E293B" strokeWidth="3" />
        <rect x="22" y="268" width="196" height="30" rx="6" fill="#090B0E" opacity="0.82" />
        <text x="120" y="287" textAnchor="middle" fill="#FDE047" fontSize="11" fontWeight="bold" fontFamily="monospace">
          PIKACHU · VAN GOGH SVP-085
        </text>
      </svg>
    );
  }
  if (id === "luffy") {
    return (
      <svg viewBox="0 0 240 320" className="h-full w-full" aria-hidden>
        <rect width="240" height="320" rx="14" fill="#F43F5E" />
        <rect x="9" y="9" width="222" height="302" rx="10" fill="#FAF5FF" />
        {/* 漫画分镜背景 */}
        <line x1="10" y1="90" x2="230" y2="70" stroke="#CBD5E1" strokeWidth="2" />
        <line x1="10" y1="205" x2="230" y2="225" stroke="#CBD5E1" strokeWidth="2" />
        <circle cx="120" cy="150" r="76" fill="#F3E8FF" stroke="#A855F7" strokeWidth="2.5" strokeDasharray="5 4" />
        {/* 尼卡云雾光环 */}
        <path
          d="M55 155 Q42 110 82 95 Q120 65 158 95 Q198 110 185 155"
          fill="none"
          stroke="#C084FC"
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* 白色觉醒头发 */}
        <path
          d="M78 128 Q68 85 98 98 Q118 68 136 96 Q168 82 162 128 Z"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="3"
        />
        <circle cx="120" cy="152" r="36" fill="#FDE68A" stroke="#1E293B" strokeWidth="3" />
        <circle cx="106" cy="145" r="5" fill="#E11D48" />
        <circle cx="134" cy="145" r="5" fill="#E11D48" />
        <path d="M98 162 Q120 180 142 162 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
        <rect x="20" y="268" width="200" height="30" rx="6" fill="#18181B" />
        <text x="120" y="287" textAnchor="middle" fill="#FDA4AF" fontSize="11" fontWeight="bold" fontFamily="monospace">
          GEAR 5 LUFFY · OP05-119 SEC
        </text>
      </svg>
    );
  }
  if (id === "labubu") {
    return (
      <svg viewBox="0 0 240 320" className="h-full w-full" aria-hidden>
        <rect width="240" height="320" rx="14" fill="#10B981" />
        <rect x="9" y="9" width="222" height="302" rx="10" fill="#0F172A" />
        <circle cx="120" cy="160" r="82" fill="#064E3B" opacity="0.55" />
        {/* 兔耳 */}
        <ellipse cx="92" cy="82" rx="18" ry="44" transform="rotate(-10 92 82)" fill="#A78BFA" stroke="#F8FAFC" strokeWidth="2.5" />
        <ellipse cx="92" cy="84" rx="9" ry="28" transform="rotate(-10 92 84)" fill="#F472B6" />
        <ellipse cx="148" cy="82" rx="18" ry="44" transform="rotate(10 148 82)" fill="#A78BFA" stroke="#F8FAFC" strokeWidth="2.5" />
        <ellipse cx="148" cy="84" rx="9" ry="28" transform="rotate(10 148 84)" fill="#F472B6" />
        {/* 毛绒圆头 */}
        <ellipse cx="120" cy="165" rx="60" ry="52" fill="#A78BFA" stroke="#F8FAFC" strokeWidth="3" />
        <ellipse cx="120" cy="170" rx="44" ry="36" fill="#FDE68A" />
        <circle cx="101" cy="160" r="7" fill="#0F172A" />
        <circle cx="139" cy="160" r="7" fill="#0F172A" />
        <circle cx="99" cy="158" r="2.2" fill="#FFF" />
        <circle cx="137" cy="158" r="2.2" fill="#FFF" />
        {/* 标志性9颗锯齿笑牙 */}
        <path
          d="M90 182 Q120 198 150 182"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="2.5"
        />
        <path d="M98 184 L103 190 L108 185 L114 191 L120 185 L126 191 L132 185 L137 190 L142 184" fill="none" stroke="#0F172A" strokeWidth="2" />
        <rect x="20" y="268" width="200" height="30" rx="6" fill="#065F46" />
        <text x="120" y="287" textAnchor="middle" fill="#A7F3D0" fontSize="11" fontWeight="bold" fontFamily="monospace">
          LABUBU SECRET · BIG INTO ENERGY
        </text>
      </svg>
    );
  }
  if (id === "pony") {
    return (
      <svg viewBox="0 0 240 320" className="h-full w-full" aria-hidden>
        <rect width="240" height="320" rx="14" fill="#EC4899" />
        <rect x="9" y="9" width="222" height="302" rx="10" fill="#090B0E" />
        <circle cx="120" cy="152" r="74" fill="#831843" opacity="0.55" />
        <circle cx="120" cy="152" r="62" fill="none" stroke="#F472B6" strokeWidth="2.5" strokeDasharray="6 4" />
        <path d="M72 135 Q95 75 142 102 Q175 118 158 165 Q132 208 88 188 Z" fill="#F472B6" stroke="#Fef08a" strokeWidth="2.5" />
        <circle cx="112" cy="142" r="7" fill="#38BDF8" />
        <circle cx="110" cy="140" r="2.5" fill="#FFF" />
        <path d="M84 98 Q120 65 156 105" stroke="#EC4899" strokeWidth="10" fill="none" strokeLinecap="round" />
        <rect x="20" y="268" width="200" height="30" rx="6" fill="#500724" />
        <text x="120" y="287" textAnchor="middle" fill="#FBCFE8" fontSize="11" fontWeight="bold" fontFamily="monospace">
          KAYOU MLP · BLACK BACK CR-08
        </text>
      </svg>
    );
  }
  if (id === "wemby") {
    return (
      <svg viewBox="0 0 240 320" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="prizm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="35%" stopColor="#38BDF8" />
            <stop offset="70%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#FACC15" />
          </linearGradient>
        </defs>
        <rect width="240" height="320" rx="14" fill="url(#prizm)" />
        <rect x="11" y="11" width="218" height="298" rx="10" fill="#0F172A" />
        <polygon points="120,38 202,155 120,252 38,155" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" />
        <circle cx="120" cy="115" r="26" fill="#D97706" />
        <path d="M78 232 L95 148 L145 148 L162 232 Z" fill="#F8FAFC" />
        <text x="120" y="198" textAnchor="middle" fill="#0F172A" fontSize="28" fontWeight="bold" fontFamily="monospace">
          1
        </text>
        <rect x="20" y="268" width="200" height="30" rx="6" fill="#0284C7" />
        <text x="120" y="287" textAnchor="middle" fill="#F0F9FF" fontSize="11" fontWeight="bold" fontFamily="monospace">
          PRIZM SILVER RC · WEMBANYAMA
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 240 320" className="h-full w-full" aria-hidden>
      <rect width="240" height="320" rx="14" fill="#A855F7" />
      <rect x="9" y="9" width="222" height="302" rx="10" fill="#1E1B4B" />
      <circle cx="120" cy="150" r="76" fill="#C084FC" stroke="#FDE047" strokeWidth="4" />
      <circle cx="120" cy="150" r="66" fill="#312E81" stroke="#E9D5FF" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="120" cy="142" r="32" fill="#FDE68A" />
      <path d="M88 128 Q120 96 152 128" fill="#78350F" />
      <circle cx="108" cy="142" r="4" fill="#1E1B4B" />
      <circle cx="132" cy="142" r="4" fill="#1E1B4B" />
      <rect x="20" y="268" width="200" height="30" rx="6" fill="#4C1D95" />
      <text x="120" y="287" textAnchor="middle" fill="#F3E8FF" fontSize="11" fontWeight="bold" fontFamily="monospace">
        JUMP SHOP 1ST ED · HOLO BADGE
      </text>
    </svg>
  );
}

export function SlabAITool() {
  const [presetId, setPresetId] = useState<CollectibleId>("pikachu");
  const currentPreset =
    PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];

  const [customName, setCustomName] = useState("");
  const [buyPrice, setBuyPrice] = useState<string>(
    String(PRESETS[0].defaultBuyPrice)
  );
  const [condition, setCondition] = useState<ConditionLevel>("mint");
  const [ownerTag, setOwnerTag] = useState("SHENZHEN-VIP");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState<SlabReport>(() =>
    generateSlabReport({
      presetId: "pikachu",
      customName: "",
      buyPrice: PRESETS[0].defaultBuyPrice,
      condition: "mint",
      ownerTag: "SHENZHEN-VIP",
    })
  );
  const [actionReceipt, setActionReceipt] = useState<{
    type: "buyback" | "vault";
    title: string;
    amountRMB: number;
    detail: string;
    platformEarn: string;
  } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  function selectPreset(id: CollectibleId) {
    const found = PRESETS.find((p) => p.id === id) ?? PRESETS[0];
    setPresetId(id);
    setCustomName("");
    setBuyPrice(String(found.defaultBuyPrice));
    setActionReceipt(null);
    setReport(
      generateSlabReport({
        presetId: id,
        customName: "",
        buyPrice: found.defaultBuyPrice,
        condition,
        ownerTag,
      })
    );
  }

  function handleUpload(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoDataUrl(String(reader.result));
    };
    reader.readAsDataURL(file);
  }

  function runOpticalScan() {
    setScanning(true);
    setActionReceipt(null);
    setTimeout(() => {
      const next = generateSlabReport({
        presetId,
        customName,
        buyPrice: Number(buyPrice) || currentPreset.defaultBuyPrice,
        condition,
        ownerTag,
      });
      setReport(next);
      setScanning(false);
      setTimeout(() => {
        document
          .getElementById("slab-card")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
    }, 650);
  }

  return (
    <div className="w-full space-y-12">
      {/* ── 输入与微距扫描控制台 ── */}
      <div className="no-print rounded-3xl border border-[#263040] bg-[#11161F] p-6 shadow-[0_28px_80px_-24px_rgba(0,0,0,0.75)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#E5B84B] uppercase">
              STEP 1 · 选择热门藏品或上传实拍图（零成本病毒钩子）
            </span>
            <h3 className="mt-1 text-[18px] font-bold text-[#F5F3EE]">
              手机对准抽屉里的卡牌 / Labubu / 谷子，3 秒测出全球最高变现价
            </h3>
          </div>
          <span className="rounded-full border border-[#10B981]/40 bg-[#10B981]/10 px-3 py-1 text-[11px] font-semibold text-[#34D399]">
            单次视觉推理成本 &lt; ¥0.01 · 无大模型算力税
          </span>
        </div>

        {/* 6大预设芯片 */}
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((item) => {
            const active = item.id === presetId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectPreset(item.id)}
                className={`group rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-[#E5B84B] bg-[#1A2230] shadow-[0_12px_30px_-12px_rgba(229,184,75,0.4)]"
                    : "border-[#222B38] bg-[#0C1017] hover:border-[#3B495E]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-[#1F2937] px-2 py-0.5 text-[10.5px] font-semibold text-[#94A3B8]">
                    {item.category}
                  </span>
                  <span
                    className="text-[10.5px] font-bold"
                    style={{ color: item.accent }}
                  >
                    {item.badgeText}
                  </span>
                </div>
                <div className="mt-2 text-[14px] font-bold text-[#F5F3EE] group-hover:text-[#E5B84B]">
                  {item.title}
                </div>
                <div className="mt-1 flex items-center justify-between text-[11.5px] text-[#64748B]">
                  <span className="font-mono">{item.code}</span>
                  <span>
                    国内裸价 ¥{item.rawPriceCN.toLocaleString()} → 美盘金砖 ¥
                    {item.slabPriceUS.toLocaleString()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 参数调节栏 */}
        <div className="mt-6 grid gap-4 border-t border-[#1F2937] pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="text-[12px] font-medium text-[#94A3B8]">
              自定义藏品名称（可选）
            </span>
            <input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={currentPreset.title}
              className="mt-1.5 w-full rounded-xl border border-[#283244] bg-[#090C12] px-3.5 py-2.5 text-[13.5px] font-semibold text-[#F5F3EE] outline-none focus:border-[#E5B84B]"
            />
          </label>

          <label className="block">
            <span className="text-[12px] font-medium text-[#94A3B8]">
              你的入手原价（¥ RMB）
            </span>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#283244] bg-[#090C12] px-3.5 py-2.5 font-mono text-[14px] font-bold text-[#E5B84B] outline-none focus:border-[#E5B84B]"
            />
          </label>

          <div className="block">
            <span className="text-[12px] font-medium text-[#94A3B8]">
              肉眼表面成色自评
            </span>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: "mint", label: "拆包即入套" },
                  { id: "light", label: "极微白点" },
                  { id: "played", label: "轻度把玩" },
                ] as const
              ).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCondition(c.id)}
                  className={`rounded-xl border py-2.5 text-[12px] font-bold transition-all ${
                    condition === c.id
                      ? "border-[#E5B84B] bg-[#E5B84B]/15 text-[#E5B84B]"
                      : "border-[#283244] bg-[#090C12] text-[#94A3B8]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="block">
            <span className="text-[12px] font-medium text-[#94A3B8]">
              上传实拍微距图（浏览器本地处理）
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#3B495E] bg-[#090C12] px-3 py-2.5 text-[12.5px] font-semibold text-[#CBD5E1] hover:border-[#E5B84B] hover:text-[#E5B84B]"
            >
              {photoDataUrl ? "✅ 已载入实拍图（点此重选）" : "📷 上传藏品照片（或用默认图）"}
            </button>
          </div>
        </div>

        {/* 触发扫描按钮 */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-[#1F2937] pt-6 sm:flex-row">
          <div className="text-[12px] text-[#94A3B8]">
            💡 <strong className="text-[#F5F3EE]">为什么这步能零成本爆火？</strong>{" "}
            玩家扫出「美盘溢价 +45%」后截图晒小红书/抖音/TikTok，带来 70% 自然流量。
          </div>
          <button
            type="button"
            onClick={runOpticalScan}
            disabled={scanning}
            className="w-full rounded-full bg-gradient-to-r from-[#E5B84B] to-[#C89628] px-8 py-3.5 text-[14.5px] font-extrabold text-[#090B0E] shadow-[0_14px_34px_-10px_rgba(229,184,75,0.65)] transition-transform hover:scale-[1.02] disabled:opacity-60 sm:w-auto"
          >
            {scanning
              ? "🔬 40x 光学微距光谱扫描与全球比价中…"
              : "⚡ 立即执行 3 秒 AI 光谱闪鉴 + 跨国查价"}
          </button>
        </div>
      </div>

      {/* ── 生成结果：SlabAI 黑金 NFC 评级封装卡 + 全球套利与秒回购终端 ── */}
      <div
        id="slab-card"
        className="rounded-3xl border-2 border-[#E5B84B]/60 bg-gradient-to-b from-[#131924] to-[#0B0E14] p-6 shadow-[0_32px_90px_-20px_rgba(229,184,75,0.28)] sm:p-9"
      >
        {/* 顶部黑金铭牌 */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#263142] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5B84B] bg-[#E5B84B]/15 font-mono text-[15px] font-black text-[#E5B84B]">
              NFC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] font-bold tracking-[0.18em] text-[#E5B84B]">
                  {report.certNumber}
                </span>
                <span className="rounded bg-[#10B981]/15 px-2 py-0.5 text-[10.5px] font-bold text-[#34D399]">
                  {report.authResult}
                </span>
              </div>
              <div className="mt-1 text-[19px] font-extrabold text-[#F5F3EE]">
                {report.displayName}
              </div>
            </div>
          </div>

          {/* 评级大分数 */}
          <div className="flex items-center gap-3 rounded-2xl border border-[#E5B84B] bg-[#090C12] px-5 py-2.5">
            <div className="text-right">
              <div className="text-[10px] font-bold tracking-[0.18em] text-[#E5B84B]">
                {report.gradeTier}
              </div>
              <div className="text-[12px] font-semibold text-[#CBD5E1]">
                {report.gradeLabel}
              </div>
            </div>
            <div className="font-mono text-[34px] font-black leading-none text-[#E5B84B]">
              {report.gradeScore.toFixed(1)}
            </div>
          </div>
        </div>

        {/* 主体两栏：左侧亚克力金砖与四维微距，右侧全球四盘实时价差与一键变现 */}
        <div className="mt-7 grid gap-8 lg:grid-cols-12">
          {/* 左栏 (5 cols)：实体金砖预览 + 四维评分 */}
          <div className="space-y-5 lg:col-span-5">
            <div className="mx-auto max-w-[260px] rounded-2xl border-2 border-[#3A4659] bg-[#080A0F] p-3.5 shadow-inner">
              <div className="mb-2.5 flex items-center justify-between rounded-lg border border-[#E5B84B]/40 bg-[#141B26] px-3 py-1.5">
                <span className="font-mono text-[10px] font-bold text-[#E5B84B]">
                  SLAB-AI OPTICAL VAULT
                </span>
                <span className="font-mono text-[12px] font-black text-[#F5F3EE]">
                  {report.gradeTier}
                </span>
              </div>
              <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#222B38] bg-[#0D1118]">
                {photoDataUrl ? (
                  <img
                    src={photoDataUrl}
                    alt={report.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <CollectibleArtwork id={report.preset.id} />
                )}
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                <span>POP 9.5+: {report.preset.popCount.toLocaleString()}</span>
                <span>{report.c2paHash}</span>
              </div>
            </div>

            {/* 四维微距子评分 */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { k: "居中度 Centering", v: report.subgrades.centering },
                { k: "四角磨损 Corners", v: report.subgrades.corners },
                { k: "切边平整 Edges", v: report.subgrades.edges },
                { k: "表面与防伪光谱", v: report.subgrades.surface },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-xl border border-[#222C3C] bg-[#0D121B] p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#94A3B8]">
                      {s.k}
                    </span>
                    <span className="font-mono text-[14px] font-black text-[#E5B84B]">
                      {s.v.score.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] leading-snug text-[#CBD5E1]">
                    {s.v.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右栏 (7 cols)：裸卡vs金砖溢价 + 全球四大市场实时套利雷达 + 1秒变现按钮 */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-7">
            {/* 溢价暴击横幅 */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-[#263142] bg-[#0D121B] p-4">
              <div>
                <div className="text-[11px] text-[#94A3B8]">国内裸卡/散货均价</div>
                <div className="mt-1 font-mono text-[20px] font-bold text-[#CBD5E1]">
                  ¥{report.rawValueCN.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#94A3B8]">
                  封装后国内金砖价（+{report.slabPremiumPct}%）
                </div>
                <div className="mt-1 font-mono text-[20px] font-bold text-[#E5B84B]">
                  ¥{report.slabValueCN.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#34D399]">
                  全球最高溢价盘（{report.bestMarket.region}）
                </div>
                <div className="mt-1 font-mono text-[22px] font-black text-[#34D399]">
                  ¥{report.bestMarket.priceRMB.toLocaleString()}
                </div>
              </div>
            </div>

            {/* 全球四大市场实时比价表 */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-bold tracking-[0.16em] text-[#E5B84B] uppercase">
                  GLOBAL ARBITRAGE RADAR · 全球四仓实时行情比价
                </span>
                <span className="text-[11px] text-[#94A3B8]">
                  数据同步：PSA / Courtyard / Whatnot / SNKRDUNK / 千岛
                </span>
              </div>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {report.markets.map((m) => (
                  <div
                    key={m.region}
                    className={`rounded-2xl border p-3.5 ${
                      m.isBest
                        ? "border-[#10B981] bg-[#10B981]/10"
                        : "border-[#222C3C] bg-[#0D121B]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[#F5F3EE]">
                        {m.flag} {m.region}
                      </span>
                      {m.isBest ? (
                        <span className="rounded-full bg-[#10B981] px-2.5 py-0.5 text-[10px] font-extrabold text-[#06281E]">
                          最高溢价 +{m.diffPct}%
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-[#94A3B8]">
                          {m.diffPct >= 0 ? `+${m.diffPct}%` : `${m.diffPct}%`}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-[#94A3B8]">
                      对标平台：{m.platform}
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="font-mono text-[20px] font-black text-[#F5F3EE]">
                        ¥{m.priceRMB.toLocaleString()}
                      </span>
                      <span className="font-mono text-[11.5px] text-[#94A3B8]">
                        ({m.localText})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 两个核心印钞动作按钮（玩家端极爽体验 = 平台端高毛利抽成） */}
            <div className="no-print space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setActionReceipt({
                      type: "buyback",
                      title: "⚡ 88% 算法做市秒回购已锁定",
                      amountRMB: report.instantBuybackRMB,
                      detail: `无需等待买家！顺丰入深圳前海保税仓核验通过即刻打款 ¥${report.instantBuybackRMB.toLocaleString()}。`,
                      platformEarn: `平台随手挂入「金库交易大厅」按公允价卖出，实物躺在货架上 0 运费净赚 ¥${report.platformUnitEconomics.singleBuybackSpread.toLocaleString()}（12% 做市差价）！`,
                    })
                  }
                  className="rounded-2xl border-2 border-[#E5B84B] bg-[#E5B84B] px-4 py-3.5 text-left text-[#090B0E] transition-transform hover:scale-[1.01]"
                >
                  <div className="text-[11px] font-extrabold uppercase opacity-80">
                    动作 A · 不想等买家？1 秒现金到账
                  </div>
                  <div className="mt-0.5 text-[16px] font-black">
                    ⚡ 88% 公允价秒回购：拿 ¥
                    {report.instantBuybackRMB.toLocaleString()}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActionReceipt({
                      type: "vault",
                      title: "🏦 保税金库跨国套利仓单已生成",
                      amountRMB: report.crossBorderNetRMB,
                      detail: `藏品入深圳保税仓后生成数字孪生仓单，直通「${report.bestMarket.region}」美元买家盘，比国内直卖多赚 +¥${report.extraGainVsDomestic.toLocaleString()}！`,
                      platformEarn: `平台收取 ¥49 金砖封装费 + ¥${report.platformUnitEconomics.crossBorderFee.toLocaleString()}（15% 跨境清结算差价）；此后该藏品在金库内每年平均换手 ${report.platformUnitEconomics.annualVaultTurnoverCount} 次，单件一年为平台贡献纯毛利 ¥${report.platformUnitEconomics.annualPlatformGrossFromOneItem.toLocaleString()}！`,
                    })
                  }
                  className="rounded-2xl border-2 border-[#10B981] bg-[#10B981]/15 px-4 py-3.5 text-left text-[#F5F3EE] transition-transform hover:scale-[1.01]"
                >
                  <div className="text-[11px] font-bold text-[#34D399] uppercase">
                    动作 B · 顺丰入保税金库 · 卖给美国高价盘
                  </div>
                  <div className="mt-0.5 text-[16px] font-black text-[#34D399]">
                    🏦 跨国挂牌净到手：¥
                    {report.crossBorderNetRMB.toLocaleString()}
                  </div>
                </button>
              </div>

              {/* 交互反馈回执：直接拆解「玩家赚多少 + 平台在这一单怎么赚大钱」 */}
              {actionReceipt && (
                <div className="rounded-2xl border border-[#E5B84B] bg-[#1A2232] p-4 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#E5B84B]">
                      {actionReceipt.title}
                    </span>
                    <span className="font-mono text-[16px] font-black text-[#34D399]">
                      预计落袋 ¥{actionReceipt.amountRMB.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[#CBD5E1]">{actionReceipt.detail}</p>
                  <div className="mt-2.5 rounded-xl bg-[#090C12] p-3 text-[12px] text-[#E5B84B]">
                    💰 <strong>【投资人视角 · 平台印钞拆解】</strong>{" "}
                    {actionReceipt.platformEarn}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-[12px] text-[#94A3B8]">
                  相比你入手价（¥{Number(buyPrice || 0).toLocaleString()}
                  ），扣除 ¥49 封装费后你净赚：
                  <strong className="ml-1 font-mono text-[14px] text-[#34D399]">
                    {report.userNetProfitVsBuy >= 0 ? "+" : ""}¥
                    {report.userNetProfitVsBuy.toLocaleString()}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-full border border-[#3B495E] px-4 py-1.5 text-[12px] font-semibold text-[#CBD5E1] hover:border-[#E5B84B] hover:text-[#E5B84B]"
                >
                  🖨 打印 / 截图晒「资产暴击卡」
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 底部合规与单品年化贡献条 */}
        <div className="mt-7 flex flex-col justify-between gap-2 border-t border-[#222C3C] pt-4 text-[11px] text-[#64748B] sm:flex-row">
          <span>
            ★ 单件金库模型：该藏品入库后年均零物流换手{" "}
            <strong className="text-[#E5B84B]">
              {report.platformUnitEconomics.annualVaultTurnoverCount} 次
            </strong>
            ，12 个月累计为平台贡献纯毛利{" "}
            <strong className="text-[#34D399]">
              ¥
              {report.platformUnitEconomics.annualPlatformGrossFromOneItem.toLocaleString()}
            </strong>
          </span>
          <span>
            合规标识：AI 辅助微距光学评级（GB 45438-2025）· 100% 明牌实物仓单 ·
            严禁暗箱概率福袋
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 交互式「三年税后净利润十位数（≥10亿）沙盘推演器」
 */
export function ThreeYearProfitSimulator() {
  const [selectedKey, setSelectedKey] = useState<ScenarioKey>("bull");
  const currentScenario =
    PROFIT_SCENARIOS.find((s) => s.key === selectedKey) ?? PROFIT_SCENARIOS[2];

  const [slabsMillion, setSlabsMillion] = useState(
    currentScenario.y3SlabsMillion
  );
  const [vaultStockBillion, setVaultStockBillion] = useState(
    currentScenario.y3VaultStockBillion
  );
  const [turnoverVelocity, setTurnoverVelocity] = useState(
    currentScenario.y3TurnoverVelocity
  );
  const [coBrandedBillion, setCoBrandedBillion] = useState(
    currentScenario.coBrandedDropBillion
  );

  function pickScenario(k: ScenarioKey) {
    const sc = PROFIT_SCENARIOS.find((s) => s.key === k) ?? PROFIT_SCENARIOS[2];
    setSelectedKey(k);
    setSlabsMillion(sc.y3SlabsMillion);
    setVaultStockBillion(sc.y3VaultStockBillion);
    setTurnoverVelocity(sc.y3TurnoverVelocity);
    setCoBrandedBillion(sc.coBrandedDropBillion);
  }

  const calc = calculateYear3AndTotal({
    slabsMillion,
    vaultStockBillion,
    turnoverVelocity,
    takeRatePct: currentScenario.blendedTakeRatePct,
    proSubsWan: currentScenario.y3ProSubsWan,
    coBrandedBillion,
    y1NetYi: currentScenario.y1NetProfitYi,
    y2NetYi: currentScenario.y2NetProfitYi,
  });

  return (
    <div className="rounded-3xl border border-[#283344] bg-[#11161F] p-6 shadow-[0_28px_80px_-24px_rgba(0,0,0,0.75)] sm:p-9">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold tracking-[0.22em] text-[#E5B84B] uppercase">
            10-DIGIT NET PROFIT ENGINE · 三年十位数（≥10亿）税后净利推演沙盘
          </span>
          <h3 className="mt-1 text-[22px] font-extrabold text-[#F5F3EE]">
            别听故事，自己拨动滑块算账：三年怎么赚到 10 位数以上税后净利
          </h3>
        </div>
        <span
          className={`rounded-full px-4 py-1.5 text-[12px] font-extrabold ${
            calc.isTenDigitRMB
              ? "bg-[#10B981]/20 text-[#34D399] border border-[#10B981]"
              : "bg-[#F43F5E]/20 text-[#FB7185] border border-[#F43F5E]"
          }`}
        >
          {calc.isTenDigitRMB
            ? "✅ 已过十位数门槛（≥ ¥1,000,000,000）"
            : "⚠️ 9 位数（未满 10 亿，请调高换手率或开启跨国盘）"}
        </span>
      </div>

      {/* 4 档情景一键切换 */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PROFIT_SCENARIOS.map((sc) => {
          const active = sc.key === selectedKey;
          return (
            <button
              key={sc.key}
              type="button"
              onClick={() => pickScenario(sc.key)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-[#E5B84B] bg-[#1A2232] shadow-[0_12px_28px_-12px_rgba(229,184,75,0.45)]"
                  : "border-[#222C3C] bg-[#0B0E14] hover:border-[#3A485E]"
              }`}
            >
              <div className="text-[12px] font-extrabold text-[#E5B84B]">
                {sc.badge}
              </div>
              <div className="mt-1 text-[14.5px] font-bold text-[#F5F3EE]">
                {sc.name}
              </div>
              <div className="mt-1.5 text-[11.5px] leading-relaxed text-[#94A3B8]">
                {sc.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* 4 个核心驱动滑块 */}
      <div className="mt-7 grid gap-5 rounded-2xl border border-[#222C3C] bg-[#0B0E14] p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex justify-between text-[12px]">
            <span className="text-[#94A3B8]">① 第3年 AI 封装量</span>
            <span className="font-mono font-bold text-[#E5B84B]">
              {slabsMillion} 百万件/年
            </span>
          </div>
          <input
            type="range"
            min={3}
            max={40}
            step={1}
            value={slabsMillion}
            onChange={(e) => setSlabsMillion(Number(e.target.value))}
            className="mt-2 w-full accent-[#E5B84B]"
          />
          <div className="mt-1 text-[10.5px] text-[#64748B]">
            参照：PSA 单年人工评 ~18 百万件
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[12px]">
            <span className="text-[#94A3B8]">② 金库沉淀实物总货值</span>
            <span className="font-mono font-bold text-[#E5B84B]">
              ¥{vaultStockBillion} 亿
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            step={0.5}
            value={vaultStockBillion}
            onChange={(e) => setVaultStockBillion(Number(e.target.value))}
            className="mt-2 w-full accent-[#E5B84B]"
          />
          <div className="mt-1 text-[10.5px] text-[#64748B]">
            参照：仅占泡泡玛特+卡游年产值的 5%
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[12px]">
            <span className="text-[#94A3B8]">③ 金库年均零物流换手</span>
            <span className="font-mono font-bold text-[#34D399]">
              {turnoverVelocity} 次/年
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={14}
            step={1}
            value={turnoverVelocity}
            onChange={(e) => setTurnoverVelocity(Number(e.target.value))}
            className="mt-2 w-full accent-[#10B981]"
          />
          <div className="mt-1 text-[10.5px] text-[#64748B]">
            核心乘数：实物不动，88%秒回购无限转手
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[12px]">
            <span className="text-[#94A3B8]">④ 自营金库联名首发额</span>
            <span className="font-mono font-bold text-[#F472B6]">
              ¥{coBrandedBillion} 亿
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={60}
            step={5}
            value={coBrandedBillion}
            onChange={(e) => setCoBrandedBillion(Number(e.target.value))}
            className="mt-2 w-full accent-[#EC4899]"
          />
          <div className="mt-1 text-[10.5px] text-[#64748B]">
            第二曲线：参考卡游 44% 净利率自营发行
          </div>
        </div>
      </div>

      {/* 实时算出的十位数大账本 */}
      <div className="mt-7 grid gap-4 lg:grid-cols-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-7">
          <div className="rounded-2xl border border-[#222C3C] bg-[#0D121B] p-4">
            <div className="text-[11px] text-[#94A3B8]">第3年金库总流水 (GMV)</div>
            <div className="mt-1.5 font-mono text-[22px] font-black text-[#F5F3EE]">
              ¥{calc.vaultGmvYi} 亿
            </div>
            <div className="mt-1 text-[10.5px] text-[#64748B]">
              货值 ¥{vaultStockBillion}亿 × {turnoverVelocity}次换手
            </div>
          </div>

          <div className="rounded-2xl border border-[#222C3C] bg-[#0D121B] p-4">
            <div className="text-[11px] text-[#94A3B8]">第3年平台总营收</div>
            <div className="mt-1.5 font-mono text-[22px] font-black text-[#E5B84B]">
              ¥{calc.totalRevYi} 亿
            </div>
            <div className="mt-1 text-[10.5px] text-[#64748B]">
              评级¥{calc.gradingRevYi}亿 + 做市¥{calc.vaultRevYi}亿
              {calc.ipRevYi > 0 ? ` + 自营¥${calc.ipRevYi}亿` : ""}
            </div>
          </div>

          <div className="rounded-2xl border border-[#222C3C] bg-[#0D121B] p-4">
            <div className="text-[11px] text-[#94A3B8]">第3年单年税后净利</div>
            <div className="mt-1.5 font-mono text-[22px] font-black text-[#34D399]">
              ¥{calc.y3AfterTaxYi} 亿
            </div>
            <div className="mt-1 text-[10.5px] text-[#64748B]">
              税后净利率 {calc.netMarginPct}%（对标泡泡玛特 35%）
            </div>
          </div>

          <div className="rounded-2xl border border-[#222C3C] bg-[#0D121B] p-4">
            <div className="text-[11px] text-[#94A3B8]">第1+第2年已入袋净利</div>
            <div className="mt-1.5 font-mono text-[22px] font-black text-[#CBD5E1]">
              ¥{(currentScenario.y1NetProfitYi + currentScenario.y2NetProfitYi).toFixed(2)} 亿
            </div>
            <div className="mt-1 text-[10.5px] text-[#64748B]">
              Y1 ¥{currentScenario.y1NetProfitYi}亿 + Y2 ¥
              {currentScenario.y2NetProfitYi}亿
            </div>
          </div>
        </div>

        {/* 右侧：三年累计税后净利润（精确到个位数的 10 位数展示） */}
        <div className="flex flex-col justify-center rounded-2xl border-2 border-[#E5B84B] bg-gradient-to-br from-[#1C2434] to-[#0D1119] p-5 lg:col-span-5">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold tracking-[0.14em] text-[#E5B84B] uppercase">
              三年累计税后净利润（扣除全部成本与税费）
            </span>
            <span className="rounded bg-[#E5B84B]/20 px-2 py-0.5 font-mono text-[11px] font-bold text-[#E5B84B]">
              {String(calc.exactRMB).length} 位数
            </span>
          </div>
          <div className="mt-2 font-mono text-[clamp(1.65rem,3vw,2.35rem)] font-black tracking-tight text-[#34D399]">
            ¥{calc.exactRMB.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center justify-between text-[12px] text-[#CBD5E1]">
            <span>
              即人民币 <strong className="text-[#F5F3EE]">{calc.threeYearCumulativeYi} 亿元</strong>
            </span>
            <span className="font-mono text-[#94A3B8]">
              ≈ ${calc.exactUSD.toLocaleString()} USD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
