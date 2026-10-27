import { Reveal } from "./reveal";
import { SectionHead } from "./sections";

const LESSONS = [
  {
    tag: "FLEXPORT 尸检",
    tone: "rose" as const,
    title: "数字化 ≠ 护城河",
    body: "用十年证明:在毛利被压扁的层里,股权帝国在数学上不成立。运价差 ≈ 10% 毛利,「盈利」靠卖 Convoy($16M→$250M),估值 $8B → 二级市场 ~$2.5B。2026 年 6 月创始人公开承认 \"was lying to myself\"。→ Landed 的戒律:不做货代、不碰运价差、不垫库存。价值只从责任(6–10%)+ 金融(利差)收。",
  },
  {
    tag: "INDIAMART 漏点",
    tone: "gold" as const,
    title: "发现层天生会漏,交易层才锁得住",
    body: "60% 印度 B2B 份额的「安静垄断」,却连续两季付费供应商净减少——用户找到线索就离场,运输和支付都发生在平台外。→ Landed 的位置钉死在交易层:验货放款、账期、赔付、多国对冲,绕过我的代价高于 6%。2026 年 6 月 IndiaMART 自己也新设了 Finance 公司——所有人都在冲向金融层,但只有我们有履约数据。",
  },
];

const ENGINES = [
  {
    n: "01",
    k: "数据资产工程",
    mech: "每单 11 列 = 数据采集器:HTS 归类、验货、清关、交期、不良率、付款行为。拒贷 41% 是信息问题,真实坏账 <0.2%——谁有履约数据,谁就把被拒的 41% 变成最好的资产。",
    metric: "健康度:结构化订单数 · 坏账 <1%",
  },
  {
    n: "02",
    k: "责任锁定工程",
    mech: "绕过 Landed = 失去验货放款、账期、赔付、对冲。买方寻源协议 + 工厂框架协议(保证金换优先响应)+ 跳单监测。",
    metric: "健康度:复购 GMV >60%→75% · 跳单 <5%",
  },
  {
    n: "03",
    k: "标准占领工程",
    mech: "让到岸表成为行业格式——像 Stripe 的发票。模板开源给竞争对手用:格式占心智,数据留在我家。每张 PDF 带署名与校验链接,每份表是一张广告。",
    metric: "健康度:「到岸成本」= 品牌词",
  },
  {
    n: "04",
    k: "密度工程",
    mech: "B2B 网络效应是局部的:IndiaMART 的 60% 是一个密度市场。先深后宽——同一时间最多 1 条做深走廊 + 1 条试点。密度 = 响应速度 = 买家感知质量 = 工厂竞标密度。",
    metric: "健康度:每询价 ≥5 份合格报价",
  },
  {
    n: "05",
    k: "资本工程",
    mech: "债务即壁垒:没有账面的对手给不了 Net-60。坏账 <1% → 便宜资金 → 低利率 → 更多买家 → 更多数据。资本不是融资新闻,是产品功能。",
    metric: "健康度:资金成本逐年降 · 账期渗透 >30%",
  },
  {
    n: "06",
    k: "判例库工程",
    mech: "HTS 归类案例库 + Prop 65/CPSC/UFLPA 判例库。合规是 Flexport 海关毛利 +99% YoY 的原因,是小贸易商做不起、巨头不愿弯腰的层。",
    metric: "健康度:海关一次通过率逐季升",
  },
];

const DEFENSE = [
  {
    who: "阿里(最危险)",
    attack: "给 Accio 加买家侧工具 / 免费到岸计算",
    hold: "它向工厂收费——买方责任产品会蚕食自己的收入(创新者的窘境);Trade Assurance 已是它的责任上限",
  },
  {
    who: "Cavela / 寻源新创",
    attack: "13 人做「找」· 20 万供应商 · 省 35%",
    hold: "没有交易层、金融层、数据年限;「不做从报价到付款的全链」(Didero 创始人语)。可收编",
  },
  {
    who: "Flexport",
    attack: "BlackRock $250M 向金融下探",
    hold: "10% 毛利基因养不起 SME 赔付;客户是 $5M–50M 进口商而非长尾。比坏账记录",
  },
  {
    who: "OpenAI / 通用代理",
    attack: "比价 + 代购入口",
    hold: "代理不会为「货到且合格」负责(责任 = 资产负债表 + 保险生意)。主动开放 API 收编流量",
  },
];

export function Moat() {
  return (
    <section id="moat" className="relative border-t border-line">
      <div className="mx-auto max-w-[1240px] px-6 py-28 lg:px-10 lg:py-36">
        <Reveal>
          <SectionHead
            eyebrow="THE MOAT · 护城河的工程学 · 第六轮"
            title={
              <>
                护城河不是宣称,
                <br />
                是工程。
              </>
            }
            sub="AI 降低了「建」的成本,没有降低「信任」的成本。唯四不能被提示词生成的东西:网络、账面、数据、信任。以下六条工程,每条有第一天就要做的决策和可测量的健康度——目标是龙头老大:不是赢者通吃,是这个行业的默认选项。"
          />
        </Reveal>

        {/* two lessons */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {LESSONS.map((l, i) => (
            <Reveal key={l.tag} delay={i * 100}>
              <div
                className={`h-full rounded-2xl border p-8 ${
                  l.tone === "rose"
                    ? "border-rose/25 bg-rose/[0.05]"
                    : "border-gold/25 bg-gold/[0.05]"
                }`}
              >
                <div
                  className={`label-mono ${l.tone === "rose" ? "text-rose" : "text-gold"}`}
                >
                  {l.tag}
                </div>
                <h3 className="mt-3.5 text-[19px] font-semibold tracking-tight">
                  {l.title}
                </h3>
                <p className="mt-3.5 text-[13px] leading-[1.95] text-muted-ink">
                  {l.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* six engines */}
        <div className="mt-16">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold/60" />
              <p className="label-mono text-gold">SIX ENGINES · 六条护城河工程</p>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {ENGINES.map((e, i) => (
              <Reveal key={e.n} delay={i * 70}>
                <div className="h-full bg-ink-2/80 p-7 transition-colors hover:bg-panel">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[12px] tracking-[0.22em] text-gold">
                      {e.n}
                    </span>
                    <h4 className="text-[17px] font-semibold tracking-tight">
                      {e.k}
                    </h4>
                  </div>
                  <p className="mt-3.5 text-[12.5px] leading-[1.95] text-muted-ink">
                    {e.mech}
                  </p>
                  <div className="mt-4 font-mono text-[11px] text-sea">
                    {e.metric}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* defense map */}
        <div className="mt-16">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-sea/60" />
              <p className="label-mono text-sea">DEFENSE MAP · 防御地图</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-line">
              {DEFENSE.map((d) => (
                <div
                  key={d.who}
                  className="grid gap-2 border-b border-line bg-ink-2/50 px-7 py-5 last:border-0 hover:bg-panel/50 lg:grid-cols-[180px_1fr_1.4fr] lg:gap-6"
                >
                  <div className="text-[13.5px] font-medium text-paper">
                    {d.who}
                  </div>
                  <div className="text-[12px] leading-[1.8] text-rose/80">
                    进攻:{d.attack}
                  </div>
                  <div className="text-[12px] leading-[1.8] text-muted-ink">
                    挡法:{d.hold}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 text-[12.5px] leading-[1.9] text-muted-ink/80">
              <span className="text-gold">止损线(写死,防叙事漂移):</span>
              第 40 月在 2 条走廊做不到第一联想前二 → 承认利基、停止平台叙事;坏账连续两季 &gt;2% → 账期冻结;跳单率 &gt;10% → 重建责任价值主张。龙头从密度里长出来,不从广度里长出来。
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
