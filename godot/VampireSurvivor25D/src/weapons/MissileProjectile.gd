extends Area2D
## MissileProjectile.gd
## 飞弹抛射物逻辑 - 追踪、碰撞、爆炸

var data: Dictionary = {}
var is_mega: bool = false
var _life_timer: float = 0.0

func setup(missile_data: Dictionary, mega: bool = false):
	data = missile_data
	is_mega = mega
	_life_timer = data.get("life", 2.0)
	monitoring = true
	# 碰撞检测
	area_entered.connect(_on_area_entered)
	body_entered.connect(_on_body_entered)
	# 监听帧
	set_physics_process(true)

func _physics_process(delta):
	_life_timer -= delta
	if _life_timer <= 0:
		_explode()
		return
	
	var target = data.get("target", null)
	var dir: Vector2 = data.get("dir", Vector2.RIGHT)
	var speed: float = data.get("speed", 500.0)
	var homing: float = data.get("homing", 0.1)
	
	# 追踪逻辑：向目标插值方向
	if target and is_instance_valid(target) and target.visible:
		if target.has_method("is_dead") and target.is_dead():
			# 目标已死，不再追踪
			pass
		else:
			var to_target = (target.global_position - global_position).normalized()
			dir = dir.lerp(to_target, homing).normalized()
			data["dir"] = dir
	# 移动
	global_position += dir * speed * delta
	rotation = dir.angle()
	
	# 超界自动回收
	if global_position.length() > 3000:
		queue_free()

func _on_area_entered(area: Area2D):
	if area.is_in_group("enemy"):
		if area.has_method("take_damage"):
			area.take_damage(data.get("damage", 12))
			var is_crit = randf() < 0.07
			var dmg = data.get("damage", 12)
			if is_crit: dmg *= 1.8
			EventBus.damage_number_requested.emit(area.global_position, dmg, is_crit, Color("#38BDF8"))
		_explode()

func _on_body_entered(body: Node):
	if body.is_in_group("enemy"):
		if body.has_method("take_damage"):
			body.take_damage(data.get("damage", 12))
		_explode()

func _explode():
	# 爆炸范围
	var radius = 40.0 if not is_mega else 90.0
	var dmg = data.get("damage", 12) * (0.6 if not is_mega else 1.0)
	# 额外范围伤害（mega 全屏震动）
	_create_explosion_effect()
	var enemies = get_tree().get_nodes_in_group("enemy")
	for e in enemies:
		if not is_instance_valid(e): continue
		if global_position.distance_squared_to(e.global_position) <= radius * radius:
			# 已直接命中的不再重复（简单距离判断已包含）
			if e.has_method("take_damage"):
				e.take_damage(dmg * 0.5)
	if is_mega:
		EventBus.screen_shake_requested.emit(5.0, 0.2)
	queue_free()

func _create_explosion_effect():
	# 简易爆炸特效：扩散圆
	var fx = Node2D.new()
	fx.global_position = global_position
	get_tree().current_scene.add_child(fx)
	var circle = Sprite2D.new()
	var img = Image.create(64,64,false,Image.FORMAT_RGBA8)
	img.fill(Color(0,0,0,0))
	var center = Vector2(32,32)
	for y in range(64):
		for x in range(64):
			var d = Vector2(x,y).distance_to(center)
			if d <= 30:
				var a = 0.6 * (1.0 - d/30.0)
				var c = Color("#FDE68A") if not is_mega else Color("#F472B6")
				c.a = a
				img.set_pixel(x,y,c)
	circle.texture = ImageTexture.create_from_image(img)
	circle.centered = true
	fx.add_child(circle)
	var tween = fx.create_tween()
	tween.set_parallel(true)
	tween.tween_property(circle, "scale", Vector2(1.8, 1.8), 0.25)
	tween.tween_property(circle, "modulate:a", 0.0, 0.25)
	tween.tween_callback(func(): fx.queue_free()).set_delay(0.3)
