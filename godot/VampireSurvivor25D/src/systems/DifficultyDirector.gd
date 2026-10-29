extends Node
## DifficultyDirector.gd
## 难度导演 - 根据时间动态调整刷怪、属性、阶段事件
## 中文注释

var stage_announce_timer: float = 0.0

func _ready():
	EventBus.stage_changed.connect(_on_stage_changed)
	print("[DifficultyDirector] 导演就绪")

func _on_stage_changed(stage: int, stage_name: String):
	# 阶段公告 + 全屏闪
	print("[Director] 阶段 %d: %s" % [stage, stage_name])
	# 可触发精英波
	if stage >= 3:
		_spawn_elite_wave()
	if stage >= 5:
		_spawn_boss_wave()

func _spawn_elite_wave():
	await get_tree().create_timer(1.0).timeout
	var spawner = get_tree().get_first_node_in_group("spawner")
	# 直接刷 6 个精英
	var enemy_spawner = get_node_or_null("../Spawner")
	if enemy_spawner and enemy_spawner.has_method("spawn_wave"):
		for i in range(4):
			enemy_spawner._spawn_one("skeleton", true, false)
			await get_tree().create_timer(0.15).timeout

func _spawn_boss_wave():
	await get_tree().create_timer(2.0).timeout
	var enemy_spawner = get_node_or_null("../Spawner")
	if enemy_spawner:
		enemy_spawner._spawn_one("boss_vampire", false, true)
