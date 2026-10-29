extends "res://src/weapons/WeaponBase.gd"
## MagicMissile.gd
## 魔法飞弹 - 向最近敌人发射追踪飞弹
## 自带轻微追踪，命中后小范围爆炸（进化后大范围）

# 抛射物场景路径（若无则程序化）
var projectile_scene_path: String = "res://scenes/weapons/MagicMissileProjectile.tscn"

func _ready():
	weapon_id = "magic_missile"
	super._ready()
	# 如果进化形态覆盖，切换参数
	if weapon_id == "mega_missile":
		base_damage = 35
		base_cooldown = 0.5

func attack():
	var targets = find_nearest_enemies(max(1, current_level / 2 + 1), 650)
	if targets.is_empty():
		return
	var count = 1
	# 等级提升弹道数：Lv3=2, Lv5=3
	if current_level >= 5:
		count = 3
	elif current_level >= 3:
		count = 2
	# 进化后更多
	if weapon_id == "mega_missile":
		count = 3
	
	for i in range(min(count, targets.size())):
		var target = targets[i]
		_fire_at(target)

func _fire_at(target: Node):
	var start_pos = owner_player.global_position
	var dir = (target.global_position - start_pos).normalized()
	# 创建飞弹（Area2D + Sprite + Collision）
	var missile = Area2D.new()
	missile.name = "MagicMissile"
	missile.global_position = start_pos
	missile.set_meta("damage", get_damage())
	missile.set_meta("weapon_id", weapon_id)
	missile.add_to_group("player_projectile")
	missile.monitoring = true
	missile.monitorable = true
	
	# 碰撞形状（圆形，避免像素碰撞）
	var col = CollisionShape2D.new()
	var shape = CircleShape2D.new()
	shape.radius = 10
	col.shape = shape
	missile.add_child(col)
	
	# 视觉：小圆 + 拖尾
	var vis = Node2D.new()
	vis.name = "Visual"
	missile.add_child(vis)
	var sprite = Sprite2D.new()
	var img = Image.create(16, 16, false, Image.FORMAT_RGBA8)
	var col_hex = "#38BDF8" if weapon_id == "magic_missile" else "#F472B6"
	img.fill(Color(col_hex))
	# 中心亮点
	for y in range(5,11):
		for x in range(5,11):
			img.set_pixel(x,y, Color("#FFFFFF"))
	sprite.texture = ImageTexture.create_from_image(img)
	sprite.centered = true
	vis.add_child(sprite)
	
	# 拖尾粒子（简易）
	var trail = GPUParticles2D.new()
	trail.emitting = true
	trail.amount = 8
	trail.lifetime = 0.3
	trail.process_material = _create_trail_material()
	# 占位纹理
	var p_img = Image.create(4,4,false,Image.FORMAT_RGBA8)
	p_img.fill(Color(col_hex))
	trail.texture = ImageTexture.create_from_image(p_img)
	vis.add_child(trail)
	
	get_tree().current_scene.add_child(missile)
	
	# 运动参数
	var speed = 520.0
	if weapon_id == "mega_missile":
		speed = 600.0
	speed *= (1.0 + (current_level - 1) * 0.03)
	var missile_data = {
		"dir": dir,
		"speed": speed,
		"target": target,
		"life": 2.0,
		"homing": 0.12,  # 追踪强度
		"damage": get_damage(),
	}
	missile.set_meta("missile_data", missile_data)
	
	# 用 tween/物理驱动
	missile.set_script(load("res://src/weapons/MissileProjectile.gd"))
	if missile.has_method("setup"):
		missile.setup(missile_data, weapon_id == "mega_missile")
	else:
		# 备用：用自定义处理
		_attach_missile_logic(missile, missile_data)
	
	EventBus.weapon_fired.emit(weapon_id, start_pos)
	EventBus.sfx_requested.emit("shoot", start_pos)

func _create_trail_material() -> ParticleProcessMaterial:
	var mat = ParticleProcessMaterial.new()
	mat.direction = Vector3(0,0,0)
	mat.spread = 20
	mat.initial_velocity_min = 10
	mat.initial_velocity_max = 25
	mat.gravity = Vector3(0, 98, 0)
	mat.scale_min = 0.5
	mat.scale_max = 1.2
	return mat

func _attach_missile_logic(missile: Area2D, data: Dictionary):
	# 如果没有独立脚本，用计时器驱动移动（简化）
	missile.body_entered.connect(func(_b): pass)

# 进化切换
func evolve_to_mega():
	weapon_id = "mega_missile"
	setup_from_config()
	base_damage = 35
	base_cooldown = 0.5
	print("[MagicMissile] 已进化为歼灭飞弹!")
