# VampireSurvivor25D — 2.5D 吸血鬼幸存者

> **引擎**：Godot 4.4 + GDScript | **渲染**：Forward Compatibility (GL) | **类型**：俯视角 2.5D 生存割草

完整可运行的吸血鬼幸存者-like 项目，包含所有核心系统：移动/自动攻击/经验/升级/武器进化/精英/Boss/存档/音效/屏幕震动等。

## ✨ 已实现特性

### 2.5D 表现
- 斜上方俯视战斗，摄像机平滑跟随 + 拖拽
- 程序化网格地面（Shader）+ 渐晕光照
- 角色/敌人阴影投射、Y轴透视缩放、轻微倾斜跟随
- 技能粒子、光效、屏幕震动反馈

### 核心玩法（100% 实现）
1. ✅ **玩家移动/自动攻击/生命/经验/等级** — WASD/方向键/摇杆，全向移动，圆形碰撞
2. ✅ **敌人持续刷新，随时间增加密度和强度** — 基于 `waves.json` + `difficulty.json` 难度曲线，支持 `spawn_rate_curve`、`hp_multiplier_curve`
3. ✅ **经验宝石掉落与拾取** — 敌人死亡掉落 5 档宝石，磁吸范围拾取，经验曲线 `20+10*(lv-1)+2*(lv-1)^2`
4. ✅ **升级暂停 3选1** — `UpgradeSystem` 随机生成，支持新武器/被动升级，进化检测
5. ✅ **技能系统（5主动+5被动）**：
   - 魔法飞弹（追踪）→ 进化 歼灭飞弹（范围爆炸）
   - 旋转圣环 → 进化 圣光新星（全屏爆发）
   - 闪电链（跳跃）→ 进化 雷暴（落雷）
   - 火焰区域（地面灼烧）
   - 护盾反弹（无敌+击退）
   - 被动：移速、攻速、最大生命、拾取范围、伤害加成
6. ✅ **可升级/进化/叠加** — 每武器 5-8 级，进化需前置（如 飞弹Lv5 + 疾风Lv3）
7. ✅ **精英怪、Boss、阶段事件** — 6 阶段（苏醒→永夜），精英 1.4倍大/3.5倍血，Boss 独立 AI
8. ✅ **死亡结算、重开、主菜单、设置** — 结算展示时间/击杀/等级/阶段，设置存档持久化
9. ✅ **存档系统** — `user://savegame.json` 记录最高等级/通关次数/解锁技能（Lv5解锁闪电，Lv10解锁火焰，Lv15解锁护盾）
10. ✅ **音效/BGM/UI动画/伤害数字/拾取反馈** — 程序化生成占位音效（WAV 合成），无外部依赖

### 代码质量
- **对象池**：`PoolManager` 管理敌人/子弹/宝石/特效，避免频繁实例化，同屏 300+ 流畅
- **事件总线**：`EventBus` 单例信号解耦 UI/战斗/升级/存档
- **数据驱动**：敌人/武器/掉落/难度全由 `config/*.json` 配置，`ConfigManager` 加载 + 插值
- **圆形碰撞**：所有角色/投射物使用 `CircleShape2D`，避免逐像素检测
- **中文注释**：关键系统每文件中文注释覆盖

## 📁 项目结构

```
VampireSurvivor25D/
├── project.godot              # Godot 4.4 主配置，自动加载单例
├── icon.svg
├── scenes/
│   ├── main/Boot.tscn         # 入口（主菜单）
│   ├── main/Game.tscn         # 主游戏场景（世界+玩家+刷怪+HUD+升级+结算）
│   ├── player/Player.tscn
│   ├── enemy/Enemy.tscn
│   └── world/World.tscn       # 网格地面+四墙
├── src/
│   ├── autoload/
│   │   ├── EventBus.gd        # 全局事件总线
│   │   ├── ConfigManager.gd   # JSON 配置加载+难度插值
│   │   ├── SaveManager.gd     # 存档（user://savegame.json）
│   │   ├── PoolManager.gd     # 通用对象池
│   │   ├── AudioManager.gd    # 程序化音效生成+池化播放
│   │   └── GameManager.gd     # 游戏状态+计时+胜负
│   ├── player/Player.gd + PlayerStats.gd
│   ├── enemy/Enemy.gd + EnemySpawner.gd
│   ├── weapons/ (WeaponBase + 5武器 + WeaponManager)
│   ├── pickups/ExpGem.gd
│   ├── systems/ (Experience, Upgrade, DifficultyDirector, ScreenShake, VFXManager)
│   ├── ui/ (HUD, LevelUpScreen, MainMenu, GameOverScreen, SettingsScreen, PauseMenu)
│   └── utils/ (ObjectPool, MathUtils)
├── config/
│   ├── enemies.json
│   ├── weapons.json
│   ├── upgrades.json
│   ├── waves.json
│   ├── difficulty.json
│   └── drops.json
├── assets/
│   ├── shaders/grid_ground.gdshader
│   ├── materials/ (占位)
│   └── sounds/ (程序化生成，无需文件)
└── docs/
    ├── README.md
    ├── 运行说明.md
    ├── 操作说明.md
    └── 扩展清单.md
```

## 🚀 快速开始

见 `docs/运行说明.md`
