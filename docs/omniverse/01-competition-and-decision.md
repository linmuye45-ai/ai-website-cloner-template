# 全球竞争情报与战略决策（研究截止 2026-10-14）

> 用户要求 2026-11-10，但系统日期为 2026-10-14；未来信息不纳入。资料检索而非付费数据库尽调。事实、企业自报和假设分开。数字为特定期间，不可直接互换。多数竞品未公开的成立年份、创始人、融资、付费率、留存、成本、失败率和收入均为**未知**，不能由用户数或融资推断。产品和价格可能变化，签约前核验。

## 0. 当前代码尽调

- 真实功能：Next.js 16 / React 19 / TypeScript / Tailwind；Discover 视觉展示；Studio 仅浏览器 localStorage 文字草稿、删除/JSON 下载；Play 原创 Canvas 流星单人游戏；Strategy 滑杆算术。图片为生成的概念图。
- 未上线功能：本次提交的新多人房间需独立常驻 Node 服务，GitHub Pages 仅静态托管；本机和沙盒预览可运行，公共持久多人服务**未部署**。上线状态以部署记录为准。
- 视觉概念：精选世界卡片 2/3 并非实际游戏；没有社区分发。旧版 Aetheria 模拟 Agent、虚构指标及收入预测不可当作真实能力。
- 未开发：AI 生成、账号、数据库、支付、正式社交/匹配、审核、可靠持久化、云联机、创作者收益、真实用户和收入统计。
- 部署：`.github/workflows/deploy-pages.yml` 在指定分支推送后用 Next 静态导出并发布 gh-pages；静态站无法执行 WebSocket 后端。旧版本在 site/ 子目录。临时预览不等于持久后端。
- **品牌风险：** NVIDIA 已使用 NVIDIA Omniverse 且称其为商标/注册商标（[NVIDIA 2025 新闻稿](https://investor.nvidia.com/news/press-release-details/2025/NVIDIA-Expands-Omniverse-With-Generative-Physical-AI/default.aspx)）。是否侵权需要司法辖区、类别、检索和律师意见；不作法律结论。正式商业化前重新命名并完成商标检索，本报告称项目代号 OMNIVERSE。

## 1. 方法及实测边界

此环境能读取公开网页及源码、运行本仓库，但没有用于真实竞品的交互式浏览器、账号或支付授权，网络出口也有限。**8 家 A–J 深度实测目前完成 0/8**，不是“8 家测试成功”。Google Playground、Unity Spark、Astrocade、Rosebud、Bitmagic、Teleplay、SeaVerse、Ludo.ai 均为公开资料调查，注册、生成、计时、失败率、多人连通、付款与手机实机均未亲测；不得据此宣称质量或胜率。统一手工协议见 `04-execution.md`。官方自报只证明其说法；第三方报道多复述公告，不一定独立核实。下面“未知”含未能独立核实。部分搜索抓取可能显示发布日期晚于基准，均不作为本次证据。

## 2. 竞争矩阵：28 个对象（信息为已知能力/定位，不是实测评分）

图例：D=直接威胁；P=潜在威胁；T=技术替代/合作；F=流量入口；X=失败案例。速度、质量、失败率、多人稳定性、留存、付费转化，无统一可比实测，一律未知。涉及 AI 的功能为对应方描述，不代表已核验。

| 对象 | 类别与定位 | 创作/玩法/多人/分发与商业模式 | 作战卡：强项 → 可切入口；反击及防御 | 证据 |
|---|---|---|---|---|
| Google Playground | D；Google 实验性文字造游戏 | 官方称创作、分享、多人与排行榜；18+；收费细节待核。速度/成功率未知 | Google 流量+模型强；不要比通用生成；试跨渠道品牌活动可控模板。Google 可免费复制；积累客户工作流及长期服务 | [Google 10/7](https://blog.google/innovation-and-ai/technology/ai/playground-experimental-gaming-platform/)；[Unity 10/7](https://unity.com/news/google-and-unity-partner-on-new-ai-gaming-platform-for-the-next-era-of-interactive-entertainment) |
| Unity Spark | D/P；Unity+Google 浏览器创作 | 官方称测试中、封测将来；高品质 3D 是产品目标而非已验证性能；定价未知 | 资产商店/引擎强；不要争画质；先单类短局、交付与组织工作流；对手可捆绑，靠交付记录和关系防守 | [Unity](https://unity.com/blog/why-we-built-unity-spark) |
| Roblox Build / Assistant / Cube | D/F；Roblox 创作生态 | Studio 需安装；可多人、发布、Robux 与 DevEx；Cube 是生成工具，不等于完整游戏生成 | 强：玩家/创作者/经济。弱点假说：安装、学习与生态内分发门槛；用免安装活动切入。可被对方 Web 化复制，依赖品牌定制与跨平台内容管理 | [安装](https://en.help.roblox.com/hc/en-us/articles/204473560-How-to-Install-and-Play-Roblox)；[DevEx](https://en.help.roblox.com/hc/en-us/articles/203314100-Developer-Exchange-DevEx-) |
| Astrocade | D；AI 社交小游戏 | 公司自报文字创作及游戏社区；$56M 是融资非收入；玩家口径需核；多人/失败率未知 | 强：分发和资本；不要拼信息流；切邀请制有组织活动；可能免费跟进，沉淀可导出项目、组织工作流 | [PocketGamer](https://www.pocketgamer.biz/astrocade-raises-56m-to-expand-ai-powered-games-creation-platform/)；[公司公告转述](https://explainx.ai/blog/astrocade-56m-funding-sequoia-sea-ai-game-creation-2026) |
| Rosebud AI | D；提示词生成浏览器游戏 | 官方称 2D/3D、分享和迭代；商业使用需符合套餐；多人与失败率未知；第三方 2026-10-13 称 $15 起，套餐变化需官网复核 | 快速生成及现有用户；不要承诺功能更全；切双人短局可测试和高可靠性。可复制，靠交付/客户工作流 | [官方](https://lab.rosebud.ai/3d-game-maker)；[第三方](https://www.aimiracle.ai/ai-tool-review/rosebud-ai-review) |
| Arcade | 未能唯一确认；D 待定 | 同名产品众多，无法确定用户所指公司、链接、功能或价格 | 禁止合并同名产品数据；获确切 URL 后手测 | 未确认 |
| Teleplay | D；结构化工具调用生成 2D | 官网自称引擎工具调用、自动机器人测试、需登录生成；多人未知 | DSL+测试不是我们的独创；避免仅以此为护城河；尝试组织活动和多人。可复制，积累被许可的玩法验证数据 | [官网](https://www.teleplay.ai/) |
| Bitmagic | D；AI 3D 游戏 | 官网称 Creator 免费起步、Pro GDK 含托管多人；实际价格/可用性未知 | 已宣传多人和 3D；不要说我们首创；专攻 2D 快速品牌活动、可导出配置；对方可降价，以客户交付体验防御 | [官网](https://bitmagic.ai/pro/) |
| SeaVerse | D；生成/分享/Remix | 官网自报 2D/3D；Google Play 列开发者 SUNRISEAI；实际生成质量和多人未知 | 创作+社区；聚焦线下活动到网页的组织场景；可复制，需要客户关系 | [官网](https://seaverse.ai/ai-game-maker)；[Google Play](https://play.google.com/store/apps/details?id=ai.seaverse.app&hl=en) |
| Ludo.ai | P/T；研发情报、创意及资产 | 产品定位偏工具，而不是已证实的多人分发；第三方称 Indie $15/月按年，变价待核 | 别比素材套件宽度；对接或竞逐活动配置；可与我们合作 | [第三方对比](https://www.taskade.com/blog/ai-game-generators) |
| Summer Engine | D；AI 辅助引擎项目 | 第三方称导出 Godot 项目；付费和实操待核 | 出口能力强；不要比全引擎；做轻量多人活动，开放项目配置 | [第三方](https://www.taskade.com/blog/ai-game-generators) |
| GDevelop | T/D；可视化 2D/3D 制作 | 开源核心+云服务，页面称可视化及 AI；分发另行核验 | 工具深、可合作而非敌人；切非专业活动负责人；许可证逐项审查 | [GDevelop](https://gdevelop.io/) |
| Fortnite UEFN | D/F；多人 3D UGC | 官方参与度分成与岛内交易；V-Bucks 份额不等于实际消费占比 | 3D/分发强；不要正面比大作；浏览器轻活动；Epic 可以增强网页触达，建立自有客户资产 | [Epic 分成](https://www.fortnite.com/news/fortnite-developers-will-soon-be-able-to-sell-in-game-items)；[平台](https://www.fortnite.com/developer/platform-and-economy) |
| Minecraft Marketplace | P/F；微软内容商店 | 地图/皮肤/内容分发和伙伴机制；多人依平台；分成与人数未知 | 品牌和用户强；勿正面沙盒；做无需安装的活动体验；可能加网页入口 | [官网](https://www.minecraft.net/en-us/marketplace) |
| Rec Room | P；社交 UGC | 公司自报 2025 Q3 创作者收入超 $1M，不是公司收入；多人社交 | 已有社交社区；切短局免下载；可推轻量 Web，验证组织交付 | [官方](https://blog.recroom.com/posts/2025/9/24/a-1m-quarter-for-rr-creators) |
| Core Games | P；UGC 游戏 | 3D 生态；当前运营、价格及用户未知 | 不判断停运；大型世界非首战；追踪 | [Core](https://www.coregames.com/) |
| Unity | T；通用游戏引擎 | 2D/3D，Web 构建及许可依版本与合同 | 成熟引擎；可合作，不打引擎战 | [Unity](https://unity.com/) |
| Unreal Engine | T；3D 引擎 | 高保真、不同平台；许可需查 | 高画质强，Web/MVP 成本高；不打画质战 | [Unreal](https://www.unrealengine.com/) |
| Godot | T；MIT 引擎 | 2D/3D、Web 导出限制依版本 | 自托管/可携带强；作扩展方案；不复制其引擎 | [官网](https://godotengine.org/) |
| Phaser | T；Web 2D 框架 | JS/TS、Canvas/WebGL；多人需另接 | 适合 Web；早期实验可用 Canvas 降依赖；增长后评估 | [Poki 比较](https://developers.poki.com/guide/web-engine) |
| PixiJS | T；2D 渲染库 | 负责渲染而非完整游戏服务 | 强渲染；引入后仍需规则/网络；非竞品平台 | [Poki](https://developers.poki.com/guide/web-engine) |
| PlayCanvas | T；浏览器 3D | MIT 引擎，云编辑器另有条款 | 潜在 3D 升级合作，非第一版必需 | [官方](https://playcanvas.com/products/engine) |
| Construct | T/D；低代码 | 可视化 Web 游戏创作，授权及多人以官方合同为准 | 上手工具强；做可邀请的特定活动而不是全面比编辑器 | [官网](https://www.construct.net/) |
| GameMaker | T；2D 游戏工具 | 引擎/发布，授权和价格依官方为准 | 专业开发者工具，不正面竞逐；可引流或合作 | [官网](https://gamemaker.io/) |
| Buildbox | T/D；可视化游戏制作 | 可视化，AI 功能及价格需手测核对 | 快速创作；聚焦实时活动运维与分享链路 | [官网](https://www.buildbox.com/) |
| YouTube / TikTok | F；内容分发/替代注意力 | 创作者自带流量；不是同义的游戏生成器 | 合作渠道同时是流量对手；不依赖单平台、沉淀自有列表及回访 | [YouTube Playables](https://www.youtube.com/gaming/playables) |
| Character.AI / World Labs | P；角色社交 / 世界生成 | 吸引相同创作者注意力；视频/世界并不等于有规则多人游戏 | AI 内容可替代部分玩法；聚焦朋友共同参与与结果分享 | [Character.AI](https://character.ai/)；[World Labs](https://www.worldlabs.ai/) |
| Crayta | X；关闭的 UGC 平台 | 官方团队表示增长不够及 Stadia 关闭；玩家失去访问原作品 | 教训：不要假设创作等于留存；有退出/数据导出和多渠道分发 | [Game Developer](https://www.gamedeveloper.com/business/crayta-to-shut-down-after-launch-platform-stadia-bites-the-dust)；[BeyondGames](https://www.beyondgames.biz/31574/meta-is-shutting-down-crayta-less-than-2-years-after-the-acquisition/) |

重要计量对照：Roblox 2025 报告收入 $4.891B，bookings $6.788B，净亏损 $1.072B；平均 DAU 127M、平均每日独立付费约 1.8M、创作者所得 $1.503B。它们口径/期间不同；DAU 不是注册数、bookings 不是收入、创作者所得不是公司利润。[10-K 转载](https://www.stocktitan.net/sec-filings/RBLX/10-k-roblox-corp-files-annual-report-7d51454cd829.html)；[GamesIndustry 独立报道](https://www.gamesindustry.biz/roblox-reports-significant-growth-for-2025-hitting-49bn-in-revenue)。Roblox 规模说明需求，并不证明 UGC 平台一定高利润。

## 3. 三个可验证切口（均是假设，不是已证明市场空白）

1. **社群/品牌短局互动活动（主推）**：主持人快速配置 2–4 人 30 秒竞速，发链接，结束后再赛；先卖活动配置、品牌定制和托管支持。付费人群：社区运营者、活动代理和品牌，不把普通玩家当付费前提。优势是假设能解决“参与率、组织、品牌安全与快速交付”；必须做 20 次客户访谈、10 次活动、3 笔真实付费验证。竞争：Google/Bitmagic/专业互动活动供应商，不能称空白已证实。
2. 创作者给粉丝玩的可 Remix 小游戏：传播环可能更强、付费不确定；先验证自发邀请和复玩，不能把一次游戏等于留存。
3. 游戏工作室广告试玩模板：潜在客单更高，但需要广告网络格式认证、归因、合同与销售能力；先以手工交付测试，不假装拥有交易所。

## 4. 五方向加权决策（主观先验，1–5，分数不是事实；越高越好）

权重：可在 60 日验证付费 25%，研发可行 20%，资本效率 15%，自然分发 15%，复购/网络效应 15%，长期扩展 10%。表中每项从左到右按上述顺序；总分为加权和，满分 5。

| 方向 | 六项分数 | 加权总分 | 判断 |
|---|---|---:|---|
| 社群/品牌短局活动工具 + 代配置 | 4,4,4,3,3,3 | 3.60 | 主战略；手工销售较快，但规模化需产品化 |
| 粉丝多人派对游戏创作 | 2,3,3,5,4,5 | 3.40 | 未来扩展；内容质量和增长风险高 |
| 游戏广告试玩模板交付 | 4,3,4,2,3,3 | 3.25 | 低成本备用；需要资质与客户关系 |
| 通用 AI 游戏生成器/商店 | 2,2,2,3,4,5 | 2.75 | 巨头正面战，暂不做 |
| 持续演化 AI 世界 | 1,1,1,3,3,5 | 2.00 | 推理与安全成本过高 |
| 开放创作者 Agent/API | 2,3,3,2,3,4 | 2.70 | 待真实客户和 API 使用证据后再评估 |

复算例：首行 4×.25+4×.20+4×.15+3×.15+3×.15+3×.10=3.60。每项均为团队判断，访谈后重算。半年税后 1 亿并非此模式合理基准；优先真实收入、复购、成本与留存而非估值。

## 5. 竞争结论

继续，但作为可证伪创业实验，不继续宣传“已是平台”。最优先对标 Google Playground、Astrocade、Bitmagic，不宣称可击败他们。我们凭短局特定场景、快速邀请、可控规则和活动服务尝试差异化；现尚无证据证明领先。别人复制功能时，长期防御只能来自被授权的优质模板/玩法测试数据、信任、客户关系、跨渠道活动集成与低成本运维；都需要真实使用数据建立。网络效应假说为：组织者创建→玩家加入→结果分享→部分玩家下一次组织→模板 Remix；先用匿名漏斗测，不应当成已经形成的护城河。
