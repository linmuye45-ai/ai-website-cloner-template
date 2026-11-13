# 蚀日残响 · 3D 素材清单与授权

## 实际状态
本次导入并校验 **227 个 GLB 文件**：KayKit 地牢包 203 个、KayKit 骷髅角色 4 个、Kenney 自然包精选 20 个。文件数不是独立设计数：颜色、模型变体可能重复。当前三个场景合计摆放 63 个场景道具实例，并按敌人类型加载 3 种角色；并非 227 个模型都出现在游戏里，更不是已经引用或集成 10,000 个素材。

## 来源与许可
- KayKit Dungeon Remastered，Kay Lousberg：CC0-1.0；作者原仓库 `KayKit-Game-Assets/KayKit-Dungeon-Remastered-1.0`，固定 commit `b0ca9bd96a8072ab36a3a5464f00ed1e06a16d07`。原作者许可在 `KayKit-Dungeon-LICENSE.txt`。
- KayKit Character Pack Skeletons，Kay Lousberg：CC0-1.0；作者原仓库 `KayKit-Game-Assets/KayKit-Character-Pack-Skeletons-1.0`，固定 commit `15b62b9bad122f72926c10fb14d622c73819fa54`。原作者许可在 `KayKit-Skeletons-LICENSE.txt`。为控制体积，每个角色保留 6 个动画，去掉其他 89 个动作；网格与贴图保留。
- Kenney Nature Kit 2.1，Kenney：CC0-1.0；原始来源 https://kenney.nl/assets/nature-kit ，使用 `RezLala/Render3DLibrary` 镜像 commit `be6a028ef6a948ce67f636c5c5ddd79a733418ef` 的 20 个 GLB；镜像说明曾删除空辅助节点链接，几何不变。原作者许可在 `Kenney-Nature-LICENSE.txt`。

这些素材是风格化、低多边形资产，并非写实 3A 扫描资产。感谢两位创作者，CC0 不要求署名，但我们主动保留署名。

## 系统与再生产
- `public/models/veil/catalog.json` 对每个导入文件记录固定来源、作者、许可、路径、文件大小、SHA-256、当前用途；不要把单个文件或一个模型的多个格式/摆放实例混算成多个独立作品。
- `src/lib/veil-asset-layout.mjs` 是场景摆放与角色映射；3D 文件按需、从本站加载，不依赖第三方 CDN。加载失败会保留程序化后备场景和角色。
- 调整资产后运行 `node scripts/build-veil-asset-catalog.mjs`，再运行 `node --test tests/veil-assets.test.mjs`。测试检查许可文件、哈希、GLB 格式、内嵌资源、引用与布局边界。
- 面向 10,000+ 素材，应分批索引、去重、人工审核每个资产及商业许可、记录版本和来源，并按场景筛选加载；不可一次把数万个模型塞进网页。当前只完成了一个可扩展起点，未完成万件素材的检索、授权审核、风格统一或集成，也不能据此承诺游戏品质或销量。

## 尚未完成
没有 50 个可玩场景、4–6 小时剧情、完整动画/配音/任务系统；没有实机性能预算验证、系统性美术验收或商业发行准备。
