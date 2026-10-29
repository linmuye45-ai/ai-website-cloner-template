extends "res://src/weapons/WeaponBase.gd"
## FlameZone.gd
## 火焰区域 - 在地面生成持续灼烧区域
## 2.5D 表现：地面圆形火焰 + 上升烟雾粒子

var zone_duration: float = 3.0
var zone_radius: float = 110.0
var tick_interval: float = 0.3

var _active_zones: Array = []  # { pos, remaining, tick_timer, node }

func _ready():
	weapon_id = "flame_zone"
	super._ready()
	zone_duration = float(weapon_config.get("duration", 3.0))
	zone_radius = float(weapon_config.get("radius", 110))

func attack():
	# 在最近敌人位置或玩家前方生成火焰
	var target = find_nearest_enemy(600)
	var pos: Vector2
	if target:
		pos = target.global_position
	else:
		pos = (owner_player.global_position + owner_player.get_facing() * 120) if owner_player else global_position
	_spawn_zone(pos)

func _spawn_zone(pos: Vector2):
	var zone = Area2D.new()
	zone.name = "FlameZone"
	zone.global_position = pos
	zone.monitoring = true
	zone.monitorable = true
	zone.add_to_group("player_projectile")
	# 碰撞
	var col = CollisionShape2D.new()
	var shape = CircleShape2D.new()
	shape.radius = zone_radius
	col.shape = shape
	zone.add_child(col)
	
	# 视觉：地面火焰
	var vis = Node2D.new()
	vis.name = "Visual"
	zone.add_child(vis)
	var ground_circle = Sprite2D.new()
	var img = Image.create(int(zone_radius*2), int(zone_radius*2), false, Image.FORMAT_RGBA8)
	img.fill(Color(0,0,0,0))
	var c = Vector2(zone_radius, zone_radius)
	for y in range(int(zone_radius*2)):
		for x in range(int(zone_radius*2)):
			var d = Vector2(x,y).distance_to(c)
			if d <= zone_radius:
				var t = d / zone_radius
				var colr: Color
				if t < 0.3:
					colr = Color("#FEF08A")
				elif t < 0.6:
					colr = Color("#F97316")
				else:
					colr = Color("#DC2626")
				colr.a = 0.55 * (1.0 - t*0.5)
				img.set_pixel(x,y,colr)
	ground_circle.texture = ImageTexture.create_from_image(img)
	ground_circle.centered = true
	ground_circle.z_index = -1
	vis.add_child(ground_circle)
	
	# 火焰粒子
	var particles = GPUParticles2D.new()
	particles.emitting = true
	particles.amount = 24
	particles.lifetime = 0.8
	var mat = ParticleProcessMaterial.new()
	mat.direction = Vector3(0,-1,0)
	mat.spread = 25
	mat.initial_velocity_min = 40
	mat.initial_velocity_max = 80
	mat.gravity = Vector3(0,0,0)
	mat.scale_min = 0.8
	mat.scale_max = 1.5
	particles.process_material = mat
	var pimg = Image.create(6,6,false,Image.FORMAT_RGBA8)
	pimg.fill(Color("#FACC15"))
	particles.texture = ImageTexture.create_from_image(pimg)
	vis.add_child(particles)
	
	# 烟雾粒子
	var smoke = GPUParticles2D.new()
	smoke.emitting = true
	smoke.amount = 12
	smoke.lifetime = 1.2
	var mat2 = ParticleProcessMaterial.new()
	mat2.direction = Vector3(0,-1,0)
	mat2.spread = 15
	mat2.initial_velocity_min = 20
	mat2.initial_velocity_max = 40
	smoke.process_material = mat2
	var s_img = Image.create(8,8,false,Image.FORMAT_RGBA8)
	s_img.fill(Color(0.5,0.5,0.5,0.4))
	smoke.texture = ImageTexture.create_from_image(s_img)
	vis.add_child(smoke)
	
	get_tree().current_scene.add_child(zone)
	
	var zone_data = {
		"node": zone,
		"remaining": zone_duration + (current_level - 1) * 0.3,
		"tick_timer": 0.0,
		"ground": ground_circle,
		"pos": pos,
	}
	_active_zones.append(zone_data)
	
	# 出场动画：缩放
	ground_circle.scale = Vector2.ZERO
	var tween = zone.create_tween()
	tween.tween_property(ground_circle, "scale", Vector2.ONE, 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	
	EventBus.weapon_fired.emit(weapon_id, pos)
	EventBus.sfx_requested.emit("flame", pos)

func _process(delta):
	super._process(delta)
	# 更新活跃区域
	for i in range(_active_zones.size() - 1, -1, -1):
		var z = _active_zones[i]
		z["remaining"] -= delta
		z["tick_timer"] -= delta
		if z["tick_timer"] <= 0:
			z["tick_timer"] = tick_interval
			_tick_zone(z)
		# 淡出
		if z["remaining"] <= 0.5:
			if is_instance_valid(z["ground"]):
				z["ground"].modulate.a = z["remaining"] / 0.5
		if z["remaining"] <= 0:
			_remove_zone(i)

func _tick_zone(zone_data: Dictionary):
	var pos = zone_data["pos"] as Vector2
	var radius = zone_radius + (current_level - 1) * 10
	var dmg = get_damage() * 0.6
	var enemies = get_tree().get_nodes_in_group("enemy")
	for e in enemies:
		if not is_instance_valid(e): continue
		if e.has_method("is_dead") and e.is_dead(): continue
		if pos.distance_squared_to(e.global_position) <= radius * radius:
			if e.has_method("take_damage"):
				e.take_damage(dmg)
			# 火焰颜色伤害数字
			if randf() < 0.4: # 减少刷屏
				EventBus.damage_number_requested.emit(e.global_position, dmg, false, Color("#FB923C"))

func _remove_zone(index: int):
	var z = _active_zones[index]
	if is_instance_valid(z["node"]):
		var node = z["node"] as Node2D
		# 淡出动画
		var tween = node.create_tween()
		tween.tween_property(node, "modulate:a", 0.0, 0.3)
		tween.tween_callback(func(): if is_instance_valid(node): node.queue_free())
	_active_zones.remove_at(index)

func level_up(new_level: int):
	super.level_up(new_level)
	zone_radius = float(weapon_config.get("radius", 110)) + (new_level - 1) * 10
	tick_interval = max(0.12, 0.3 - (new_level - 1) * 0.02)

func _exit_tree():
	for z in _active_zones:
		if is_instance_valid(z["node"]):
			z["node"].queue_free()
	_active_zones.clear()
