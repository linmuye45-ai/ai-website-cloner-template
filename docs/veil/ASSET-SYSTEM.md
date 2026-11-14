# 蚀日残响：写实素材试验

用户明确要求不用低多边形卡通风格。本版本已撤下 KayKit、Kenney 的卡通模型，改用更偏写实的素材；不代表已达到 3A 质量。

- 环境：Poly Haven 的 Rock Moss Set 01（Kless Gyzen，CC0，实物扫描），使用固定版本第三方网页优化 GLB，含纹理。每章摆放 8 组，属于重复实例，不是 24 个不同素材。详见 `PolyHaven-SOURCE.md`。
- 敌人：MakeHuman 系统 CC0 资产生成的人体、外套、裤子、靴子，来源 `kblood/CharacterCreator` 固定 commit `852e48f316b90a0937234886630e4fb4cdfd1f78` 的 `output/`。项目的源码为 GPL，但作者对这些生成的 GLB 明确标注 CC0（见 `MakeHuman-LICENSE-NOTES.md`）。动画为其程序生成的动作，暂用行走、待机等，**没有真正的刀剑攻击动作**；服装是现代长外套，暂不是幻想盔甲。
- 石面贴图为本次 AI 生成；远景仍是 2D 背景图，不是真正可探索的远景。遗迹、任务物件和部分障碍仍是简单程序化几何体，有待换成写实模型。

`public/models/veil/catalog.json` 保存五个当前使用的 GLB 文件、来源、许可及 SHA-256；`node scripts/build-veil-asset-catalog.mjs` 可重建，`node --test tests/veil-assets.test.mjs` 核验。**并未研究或导入一万个素材**，也不是完整 50 个场景、4–6 小时游戏。本次是方向修正，不是最终交付。
