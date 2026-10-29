extends "res://src/weapons/WeaponBase.gd"
## LightningChain.gd
## 闪电链 - 在敌人间跳跃，造成递减伤害
## 视觉为折线 + 电火花粒子

var chain_count: int = 3
var chain_range: float = 180.0

func _ready():
	weapon_id = "lightning_chain"
	super._ready()
	chain_count = int(weapon_config.get("chain_count", 3))
	chain_range = float(weapon_config.get("chain_range", 180))

func attack():
	var first = find_nearest_enemy(700)
	if not first:
		return
	var hit_list: Array = [first]
	var current = first
	# 跳跃逻辑
	for i in range(chain_count - 1):
		var next_enemy = null
		var best_dist = chain_range
		var candidates = get_tree().get_nodes_in_group("enemy")
		for e in candidates:
			if not is_instance_valid(e) or not e.visible: continue
			if e in hit_list: continue
			if e.has_method("is_dead") and e.is_dead(): continue
			var d = current.global_position.distance_to(e.global_position)
			if d < best_dist:
				best_dist = d
				next_enemy = e
		if next_enemy:
			hit_list.append(next_enemy)
			current = next_enemy
		else:
			break
	# 造成伤害（递减 15% 每次跳跃）
	for idx in range(hit_list.size()):
		var enemy = hit_list[idx]
		var dmg = get_damage() * pow(0.85, idx)
		if enemy.has_method("take_damage"):
			enemy.take_damage(dmg)
		var is_crit = randf() < 0.12
		if is_crit: dmg *= 1.8
		EventBus.damage_number_requested.emit(enemy.global_position, dmg, is_crit, Color("#60A5FA"))
	# 视觉：闪电链
	_draw_lightning(hit_list)
	
	EventBus.weapon_fired.emit(weapon_id, owner_player.global_position if owner_player else global_position)
	EventBus.sfx_requested.emit("lightning", global_position)
	EventBus.screen_shake_requested.emit(2.0, 0.08)

func get_damage() -> float:
	var d = super.get_damage()
	# 闪电链等级加成更高
	return d

func level_up(new_level: int):
	super.level_up(new_level)
	# 每2级 +1 跳跃
	chain_count = int(weapon_config.get("chain_count", 3)) + (new_level - 1) / 2
	chain_range += 10 * (new_level - 1)

func _draw_lightning(hit_list: Array):
	if hit_list.size() < 1:
		return
	var line = Line2D.new()
	line.width = 4
	line.default_color = Color("#93C5FD")
	line.joint_mode = Line2D.LINE_JOINT_ROUND
	line.begin_cap_mode = Line2D.LINE_CAP_ROUND
	line.end_cap_mode = Line2D.LINE_CAP_ROUND
	# 渐变
	var grad = Gradient.new()
	grad.add_point(0.0, Color("#EFF6FF"))
	grad.add_point(0.5, Color("#60A5FA"))
	grad.add_point(1.0, Color("#1E40AF"))
	line.gradient = grad
	# 起点：玩家
	var start = owner_player.global_position if owner_player else global_position
	line.add_point(start)
	for e in hit_list:
		line.add_point(e.global_position)
	get_tree().current_scene.add_child(line)
	# 发光
	line.z_index = 10
	# 闪烁动画
	var tween = line.create_tween()
	tween.tween_property(line, "modulate:a", 0.0, 0.18)
	tween.tween_callback(func(): line.queue_free())
	# 每个命中点加电火花
	for e in hit_list:
		_spawn_spark(e.global_position)

func _spawn_spark(pos: Vector2):
	var spark = GPUParticles2D.new()
	spark.global_position = pos
	spark.emitting = true
	spark.amount = 12
	spark.lifetime = 0.25
	spark.one_shot = true
	var mat = ParticleProcessMaterial.new()
	mat.direction = Vector3(0,-1,0)
	mat.spread = 180
	mat.initial_velocity_min = 80
	mat.initial_velocity_max = 150
	mat.gravity = Vector3(0, 200, 0)
	spark.process_material = mat
	var img = Image.create(4,4,false,Image.FORMAT_RGBA8)
	img.fill(Color("#BFDBFE"))
	spark.texture = ImageTexture.create_from_image(img)
	get_tree().current_scene.add_child(spark)
	# 自动清理
	await spark.get_tree().create_timer(0.5).timeout
	if is_instance_valid(spark):
		spark.queue_free()

## 进化：雷暴
var _storm_timer: float = 0.0
func _process(delta):
	super._process(delta)
	if weapon_id != "thunder_storm":
		return
	_storm_timer -= delta
	if _storm_timer <= 0:
		_storm_timer = 1.2
		_thunder_tick()

func _thunder_tick():
	# 随机在附近敌人头顶落雷
	var enemies = find_nearest_enemies(4, 800)
	for e in enemies:
		var dmg = get_damage() * 1.5
		if e.has_method("take_damage"):
			e.take_damage(dmg)
		EventBus.damage_number_requested.emit(e.global_position, dmg, false, Color("#FDE68A"))
		_spawn_thunder_fx(e.global_position)

func _spawn_thunder_fx(pos: Vector2):
	var beam = Line2D.new()
	beam.width = 6
	beam.default_color = Color("#FEF08A")
	beam.add_point(pos + Vector2(0, -400))
	beam.add_point(pos)
	get_tree().current_scene.add_child(beam)
	beam.z_index = 12
	var tween = beam.create_tween()
	tween.tween_property(beam, "modulate:a", 0.0, 0.2)
	tween.tween_callback(func(): beam.queue_free())
	EventBus.screen_shake_requested.emit(3.0, 0.15)

func evolve_to_storm():
	weapon_id = "thunder_storm"
	chain_count = 6
	base_damage = 50
	print("[LightningChain] 进化为雷暴!")
