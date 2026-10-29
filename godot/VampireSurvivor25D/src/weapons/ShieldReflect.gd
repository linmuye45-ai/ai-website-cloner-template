extends "res://src/weapons/WeaponBase.gd"
## ShieldReflect.gd
## 护盾反弹 - 短暂无敌并击退/反弹近身敌人
## 2.5D：半透明护罩 + 冲击波

var shield_duration: float = 1.2
var shield_radius: float = 85.0
var is_shield_active: bool = false
var _shield_node: Node2D = null
var _shield_time_left: float = 0.0

func _ready():
	weapon_id = "shield"
	super._ready()
	shield_duration = float(weapon_config.get("duration", 1.2))
	shield_radius = float(weapon_config.get("radius", 85))
	base_cooldown = float(weapon_config.get("base_cooldown", 5.0))

func attack():
	if is_shield_active:
		return
	_activate_shield()

func _activate_shield():
	is_shield_active = true
	_shield_time_left = shield_duration + (current_level - 1) * 0.15
	_spawn_shield_visual()
	# 击退范围内敌人
	_knockback_enemies()
	EventBus.weapon_fired.emit(weapon_id, owner_player.global_position if owner_player else global_position)
	EventBus.sfx_requested.emit("explosion", global_position)
	EventBus.screen_shake_requested.emit(4.0, 0.2)

func _spawn_shield_visual():
	if not owner_player:
		return
	var shield = Node2D.new()
	shield.name = "ShieldVisual"
	shield.global_position = owner_player.global_position
	get_tree().current_scene.add_child(shield)
	_shield_node = shield
	
	var circle = Sprite2D.new()
	var img = Image.create(180,180,false,Image.FORMAT_RGBA8)
	img.fill(Color(0,0,0,0))
	var center = Vector2(90,90)
	for y in range(180):
		for x in range(180):
			var d = Vector2(x,y).distance_to(center)
			if d <= shield_radius and d >= shield_radius - 12:
				# 外环
				var a = 0.8
				img.set_pixel(x,y, Color(0.4,0.8,1.0,a))
			elif d < shield_radius - 12 and d > shield_radius - 18:
				img.set_pixel(x,y, Color(0.6,0.9,1.0,0.3))
	circle.texture = ImageTexture.create_from_image(img)
	circle.centered = true
	circle.z_index = 5
	shield.add_child(circle)
	
	# 内发光
	var glow = Sprite2D.new()
	var g_img = Image.create(160,160,false,Image.FORMAT_RGBA8)
	g_img.fill(Color(0.3,0.7,1.0,0.15))
	glow.texture = ImageTexture.create_from_image(g_img)
	glow.centered = true
	glow.z_index = 4
	shield.add_child(glow)
	
	# 脉冲动画
	var tween = shield.create_tween()
	tween.set_loops(3)
	tween.tween_property(circle, "scale", Vector2(1.08,1.08), 0.2)
	tween.tween_property(circle, "scale", Vector2(1.0,1.0), 0.2)

func _knockback_enemies():
	if not owner_player:
		return
	var pos = owner_player.global_position
	var radius = shield_radius + 10
	var dmg = get_damage()
	var enemies = get_tree().get_nodes_in_group("enemy")
	for e in enemies:
		if not is_instance_valid(e): continue
		if e.has_method("is_dead") and e.is_dead(): continue
		var dist_sq = pos.distance_squared_to(e.global_position)
		if dist_sq <= radius * radius:
			if e.has_method("take_damage"):
				e.take_damage(dmg)
				EventBus.damage_number_requested.emit(e.global_position, dmg, false, Color("#7DD3FC"))
			# 击退
			if e.has_method("knockback"):
				var dir = (e.global_position - pos).normalized()
				e.knockback(dir * 350, 0.25)
			elif e is CharacterBody2D:
				var dir = (e.global_position - pos).normalized()
				e.velocity += dir * 400

func _process(delta):
	super._process(delta)
	if not is_shield_active:
		return
	_shield_time_left -= delta
	if _shield_node and is_instance_valid(_shield_node) and owner_player:
		_shield_node.global_position = owner_player.global_position
		# 闪烁淡出
		if _shield_time_left < 0.3:
			_shield_node.modulate.a = _shield_time_left / 0.3
	if _shield_time_left <= 0:
		_deactivate_shield()

func _deactivate_shield():
	is_shield_active = false
	if _shield_node and is_instance_valid(_shield_node):
		var n = _shield_node
		var tween = n.create_tween()
		tween.tween_property(n, "scale", Vector2(1.4,1.4), 0.2)
		tween.parallel().tween_property(n, "modulate:a", 0.0, 0.2)
		tween.tween_callback(func(): if is_instance_valid(n): n.queue_free())
	_shield_node = null

## 供 Player 调用：是否处于护盾保护
func is_protecting() -> bool:
	return is_shield_active

func level_up(new_level: int):
	super.level_up(new_level)
	shield_duration = float(weapon_config.get("duration", 1.2)) + (new_level - 1) * 0.15
	shield_radius = float(weapon_config.get("radius", 85)) + (new_level - 1) * 6
