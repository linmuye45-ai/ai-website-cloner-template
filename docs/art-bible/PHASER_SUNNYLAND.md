# Sunny Land · Phaser 3 改造说明

用户 directive：放弃手绘像素资产的品质天花板，改用成熟免费引擎 + CC0 现成项目完成
四项打磨（手感 / 游戏流 / 音频 / 内容）。本文档记录落地架构与后续路线。

## 技术选型

- 引擎：Phaser 3.90（npm，MIT），Arcade 物理，Scale.FIT 480×270 像素画布。
- 资产：WispSnow/SunnyLand（CC0-1.0，`public/vendor/sunnyland/LICENSE`），
  含 foxy/frog/opossum/eagle 动画表、575 格 tileset、双层视差、道具/FX、
  UI kit、2 首循环 BGM、7 个音效、Tiled 地图。
- 自研 Ember Trail 引擎保留在 `/game`，新版在 `/play`，互不影响。

## 目录约定

| 路径 | 职责 |
| --- | --- |
| `src/phaser-game/BootScene.ts` | 全部资产加载、动画注册（帧数据严格按上游 actor.tsj） |
| `src/phaser-game/PlayScene.ts` | 单关卡玩法：瓦片碰撞、敌人 AI、拾取、镜头、果汁、音频总线 |
| `src/phaser-game/save.ts` | localStorage 存档：解锁/最佳成绩/音频设置 |
| `src/phaser-game/createGame.ts` | Phaser.Game 工厂（仅客户端动态 import） |
| `src/components/PhaserGame.tsx` | 状态机：boot → 菜单 → 关卡 → 结算；HUD/触屏/覆盖层 |
| `src/components/GameMenu.tsx` | 标题界面、选关卡片、静音与音量设置 |
| `scripts/vendor/prepare-sunnyland.mjs` | 内嵌外部 tsj、改写 web 路径、输出合并后地图 JSON |
| `scripts/vendor/build-level3.mjs` | level3 remix：复用 level2 地形 + 重排对象 + 加盖实心平台 |
| `scripts/game/phaser-smoke.cjs` | 地图契约/资产/帧尺寸无头校验（`npm run test:phaser`） |

## 四项打磨交付状态

1. **手感/Juice**：挤压拉伸、落地/奔跑尘屑粒子、踩头 70ms 顿帧、
   镜头震动与受击闪红、土狼时间 90ms、跳跃缓冲 110ms、可变跳高、无敌闪烁。
2. **游戏流**：标题菜单、三关选关（锁定/最佳成绩）、localStorage 存档、
   静音+音量设置、胜利/死亡覆盖层、下一关/重玩/回菜单闭环。
3. **音频**：两首 BGM（level3 使用 hurry_up_and_run）、7 个 SFX、
   全局音量/静音同步到 Phaser registry。
4. **内容**：3 个关卡（上游 level1/level2 + 原创 remix level3）、
   3 种敌人 archetype（负鼠巡逻/青蛙跳跃/老鹰正弦飞行）、宝石与樱桃、出口门。

## 后续路线（未做）

- level0 上游只有背景层，无玩法数据；如需第四关可仿照 build-level3 扩展。
- 菜单目前是 DOM 覆盖层；可进一步用 SunnyLand UI 按钮三态图替换样式。
- 无浏览器环境，Phaser 运行时仅经数据契约冒烟 + 生产构建验证，
  真机手感参数（加速度/跳跃曲线）建议人工微调。
- 可接 Tiled 直接产出更多地图，管线已支持：放入 tmj 后在 prepare 脚本注册即可。
