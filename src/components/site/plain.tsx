import { Reveal } from "./reveal";

const CARDS = [
  {
    k: "这是什么生意",
    t: "「一句话下单,48 小时给一张全包比价单」",
    d: "小卖家想进口货物,只需要说一句话。48 小时后收到一张单子(到岸表):5 家核实过的工厂比价,从工厂到仓库每个货品的全部费用算清(像装修队的全包报价单)。挑一家,确认,钱托管在中间,我们盯生产、验货、清关、送货。货合格才放款,出事我们赔。收 6% 服务费,明码标价。",
  },
  {
    k: "为什么是现在",
    t: "美国税改,几十万小卖家一夜之间需要帮手",
    d: "2025 年美国取消了「800 美元以下包裹免税」,小卖家突然都要报关、算税——这些以前是大公司才养得起的专家活。同时 AI 第一次能干跑腿砍价的活:用微信跟义乌工厂砍价,用英文跟美国卖家解释。而阿里赚的是工厂的钱,买家这一边没人站——位置是空的。",
  },
  {
    k: "怎么不被抢走",
    t: "攒成绩单、锁住客户、立规矩、打透一个圈子",
    d: "每一单都记「成绩单」(货准时吗、质量好吗、钱还得快吗)——到放贷那步,它就是敢借钱的底气,银行花十年也买不到。出事赔付 + 验货放款 + 赊账,让客户离不开。比价单格式公开给大家用(立行规)。先打透「美国宠物碗圈」再开下一个:在一个小圈子里当第一,比十个圈子里当第五值钱一百倍。",
  },
];

const GLOSSARY = [
  { j: "到岸表", p: "全包比价单:从工厂到你仓库,每件货最后花多少钱" },
  { j: "护城河", p: "别人抢不走你生意的原因" },
  { j: "复购 GMV", p: "老客户回头带来的流水——人留不留得住" },
  { j: "信贷账面", p: "放出去还没收回的借款总额(放贷业务的规模)" },
  { j: "创新者的窘境", p: "大公司不敢革自己的命,新生意轮到小公司做" },
  { j: "托管", p: "钱先放中间方,事办妥才放款(像支付宝)" },
];

export function Plain() {
  return (
    <section id="plain" className="relative border-t border-line bg-ink-2/60">
      <div className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-24">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-mint/60" />
            <p className="label-mono text-mint">PLAIN VERSION · 60 秒看懂 · 白话版</p>
          </div>
          <h2 className="mt-6 max-w-[30ch] text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold leading-[1.25] tracking-[-0.02em]">
            不讲行话。三张卡讲完这套战略。
          </h2>
          <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.9] text-muted-ink">
            这一页是给不搞商业和科技的朋友写的。行话对照表在下面;想看带数据和出处的严谨版,往下滚动,或读档案库里的
            <span className="text-paper"> plain-language.md</span>(白话全文)。
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.k} delay={i * 90}>
              <div className="h-full rounded-2xl border border-line bg-panel/40 p-8">
                <div className="label-mono text-mint">{c.k}</div>
                <h3 className="mt-3.5 text-[18px] font-semibold leading-snug tracking-tight text-paper">
                  {c.t}
                </h3>
                <p className="mt-4 text-[13.5px] leading-[2] text-muted-ink">
                  {c.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <div className="mt-8 rounded-2xl border border-line bg-ink-2/70 p-8">
            <div className="label-mono text-gold">行话小抄 · 以后看到这些词不用查</div>
            <div className="mt-5 grid gap-x-10 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {GLOSSARY.map((g) => (
                <div key={g.j} className="flex items-baseline gap-3">
                  <span className="shrink-0 rounded-md bg-gold/15 px-2.5 py-1 font-mono text-[11.5px] text-gold-2">
                    {g.j}
                  </span>
                  <span className="text-[12.5px] leading-[1.7] text-muted-ink">
                    {g.p}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[12px] text-muted-ink/80">
              完整对照表(20+ 个词)见档案库
              <span className="text-paper"> docs/strategy/plain-language.md</span> 第七节。
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
