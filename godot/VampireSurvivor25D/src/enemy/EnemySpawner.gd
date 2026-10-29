extends Node
## EnemySpawner.gd
## 敌人刷新器 - 随时间增加密度和强度，支持阶段事件、精英、Boss
## 性能：使用对象池 + 视口外刷新 + 限流

@export var spawn_interval: float = 0.9
@export var max_enemies: int = 300

var _timer: float = 0.0
var _rng: RandomNumberGenerator = RandomNumberGenerator.new()

# 刷新点缓存
var _viewport_size: Vector2 = Vector2(1280,720)

func _ready():
	_rng.randomize()
	_viewport_size = get_viewport().get_visible_rect().size if get_viewport() else Vector2(1280,720)
	# 尝试注册池
	PoolManager.register_pool("enemy", "res://scenes/enemy/Enemy.tscn", 80, self)
	# 连接阶段变化
	EventBus.stage_changed.connect(_on_stage_changed)
	print("[EnemySpawner] 刷新器就绪 - max:%d interval:%.2f" % [max_enemies, spawn_interval])

func _process(delta):
	if not GameManager.is_playing():
		return
	_timer -= delta
	if _timer <= 0:
		_timer = get_spawn_interval()
		_try_spawn()

func get_spawn_interval() -> float:
	# 随时间递减，最低 0.18
	var base = ConfigManager.get_difficulty_multiplier("spawn_rate_curve", GameManager.game_time)
	# spawn_rate_curve 返回的是倍率，0.9->0.25，实际间隔 = base * 0.9
	var interval = base * 0.9
	# 根据阶段微调
	return max(0.15, interval)

func _try_spawn():
	var player_pos = GameManager.get_player_pos()
	if player_pos == Vector2.ZERO:
		return
	# 检查当前敌人数量（限流）
	var current_count = get_tree().get_nodes_in_group("enemy").size()
	if current_count >= ConfigManager.get_max_enemies():
		return
	# 每次生成数量随时间增加
	var per_spawn = ConfigManager.get_enemies_per_spawn(GameManager.game_time)
	# 阶段精英/Boss概率
	var wave = ConfigManager.get_current_wave(GameManager.game_time)
	
	for i in range(per_spawn):
		if get_tree().get_nodes_in_group("enemy").size() >= ConfigManager.get_max_enemies():
			break
		var enemy_type = _pick_enemy_type(wave)
		var is_elite = false
		var is_boss = false
		# 精英判定
		if wave.get("elite", false) and _rng.randf() < 0.06:
			is_elite = true
		# Boss：每到 boss 关卡，每 45 秒刷一个小 Boss
		if wave.get("boss", false) and _rng.randf() < 0.015:
			is_boss = true
			enemy_type = "boss_vampire"
			is_elite = false
		
		_spawn_one(enemy_type, is_elite, is_boss)

func _pick_enemy_type(wave: Dictionary) -> String:
	var types = wave.get("enemy_types", ["slime"])
	if types.is_empty():
		types = ["slime"]
	return types[_rng.randi_range(0, types.size()-1)]

func _spawn_one(type_id: String, is_elite: bool, is_boss: bool):
	var player_pos = GameManager.get_player_pos()
	# 在屏幕外环形位置生成
	var spawn_pos = _get_spawn_position(player_pos)
	
	var enemy: Node = null
	# 尝试从池获取
	if PoolManager.pools.has("enemy"):
		enemy = PoolManager.get_object("enemy")
	if enemy == null:
		# 备用直接创建
		enemy = preload("res://scenes/enemy/Enemy.tscn").instantiate() if ResourceLoader.exists("res://scenes/enemy/Enemy.tscn") else CharacterBody2D.new()
		enemy.add_to_group("enemy")
		get_tree().current_scene.add_child(enemy)
	
	enemy.global_position = spawn_pos
	if not enemy.is_inside_tree():
		get_tree().current_scene.add_child(enemy)
	
	# 初始化敌人
	if enemy.has_method("setup"):
		enemy.setup(type_id, is_elite, is_boss)
	else:
		# 占位：手动设置
		enemy.set_meta("enemy_id", type_id)
	
	# Boss 特效
	if is_boss:
		EventBus.boss_spawned.emit(enemy)
		EventBus.screen_shake_requested.emit(6.0, 0.4)
		# 全屏提示（由 UI 监听 boss_spawned）
		print("[Spawner] Boss 生成: %s at %s" % [type_id, str(spawn_pos)])

func _get_spawn_position(player_pos: Vector2) -> Vector2:
	# 在视口外 100~300 像素环形
	var viewport = _viewport_size
	var max_dim = max(viewport.x, viewport.y)
	var dist = _rng.randf_range(max_dim * 0.55, max_dim * 0.85)
	var angle = _rng.randf_range(0, TAU)
	var pos = player_pos + Vector2(cos(angle), sin(angle)) * dist
	# 限制在世界边界
	pos.x = clamp(pos.x, -1950, 1950)
	pos.y = clamp(pos.y, -1950, 1950)
	return pos

func _on_stage_changed(stage: int, name: String):
	print("[Spawner] 阶段 %d %s - 刷新间隔加速" % [stage, name])
	# 阶段提升时立刻刷一波，增加紧张感
	for i in range(6):
		var wave = ConfigManager.get_current_wave(GameManager.game_time)
		_spawn_one(_pick_enemy_type(wave), false, false)

## 供外部手动刷一波（如技能）
func spawn_wave(count: int, type_id: String = "slime"):
	for i in range(count):
		_spawn_one(type_id, false, false)

## 清理所有敌人
func clear_all():
	for e in get_tree().get_nodes_in_group("enemy"):
		if is_instance_valid(e):
			if e.has_method("die"):
				e.die()
			else:
				e.queue_free()
