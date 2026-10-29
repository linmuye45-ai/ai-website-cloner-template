extends Node
## EventBus.gd
## 全局事件总线 - 解耦 UI、战斗、升级、存档等系统
## 使用信号实现发布-订阅模式，避免直接引用
## 中文注释覆盖所有关键流程

# ─── 玩家相关 ───
signal player_moved(pos: Vector2)
signal player_damaged(amount: float, remaining_hp: float)
signal player_healed(amount: float, new_hp: float)
signal player_died
signal player_level_up(new_level: int)
signal exp_gained(amount: int, total_exp: int)
signal exp_pickup_collected(value: int, pos: Vector2)

# ─── 敌人相关 ───
signal enemy_spawned(enemy: Node)
signal enemy_died(enemy: Node, pos: Vector2, is_elite: bool, is_boss: bool)
signal enemy_damaged(enemy: Node, damage: float)
signal boss_spawned(boss: Node)
signal boss_defeated

# ─── 武器/技能 ───
signal weapon_fired(weapon_id: String, pos: Vector2)
signal weapon_upgraded(weapon_id: String, new_level: int)
signal weapon_evolved(old_id: String, new_id: String)
signal damage_dealt(target: Node, amount: float, is_crit: bool, pos: Vector2)

# ─── 升级/进化 ───
signal upgrade_options_ready(options: Array)  # 3选1选项生成完毕
signal upgrade_selected(upgrade_id: String)
signal evolution_triggered(from_id: String, to_id: String)

# ─── 游戏流程 ───
signal game_started
signal game_paused(is_paused: bool)
signal game_resumed
signal game_over(kill_count: int, survived_time: float, level: int)
signal game_victory
signal stage_changed(stage: int, stage_name: String)
signal screen_shake_requested(intensity: float, duration: float)

# ─── 存档/设置 ───
signal save_requested
signal settings_changed(key: String, value: Variant)

# ─── UI ───
signal hud_update_requested
signal damage_number_requested(pos: Vector2, amount: float, is_crit: bool, color: Color)
signal pickup_feedback(pos: Vector2, type: String)

# ─── 音频 ───
signal sfx_requested(name: String, pos: Vector2)
signal bgm_requested(name: String)

func _ready():
	# 打印事件总线就绪，便于调试
	print("[EventBus] 事件总线已初始化")
