extends Node
## VFXManager.gd
## 特效管理器 - 粒子、光效、伤害数字、拾取反馈

var damage_number_scene: PackedScene = null
var hit_effect_scene: PackedScene = null

func _ready():
	EventBus.damage_number_requested.connect(_on_damage_number)
	EventBus.pickup_feedback.connect(_on_pickup_feedback)
	EventBus.enemy_died.connect(_on_enemy_died_fx)
	print("[VFXManager] 特效管理器就绪")

func _on_damage_number(pos: Vector2, amount: float, is_crit: bool, color: Color):
	if not SaveManager.get_setting("show_damage_numbers"):
		if not is_crit:
			# 非暴击可略过，减少刷屏
			if randf() < 0.5:
				return
	spawn_damage_number(pos, amount, is_crit, color)

func spawn_damage_number(pos: Vector2, amount: float, is_crit: bool, color: Color):
	var label = Label.new()
	label.text = "%d" % int(amount)
	if is_crit:
		label.text += "!"
	label.add_theme_font_size_override("font_size", 16 if not is_crit else 22)
	label.add_theme_color_override("font_color", color)
	label.add_theme_color_override("font_outline_color", Color(0,0,0,0.8))
	label.add_theme_constant_override("outline_size", 3)
	label.position = pos + Vector2(randf_range(-8,8), -16)
	label.z_index = 20
	get_tree().current_scene.add_child(label)
	
	var tween = label.create_tween()
	tween.set_parallel(true)
	var end_y = label.position.y - (30 if not is_crit else 40)
	tween.tween_property(label, "position:y", end_y, 0.5).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(label, "modulate:a", 0.0, 0.5).set_delay(0.2)
	if is_crit:
		label.scale = Vector2(1.3, 1.3)
		tween.tween_property(label, "scale", Vector2.ONE, 0.2)
	tween.tween_callback(func(): if is_instance_valid(label): label.queue_free())

func _on_pickup_feedback(pos: Vector2, _type: String):
	# 拾取光环
	var ring = Node2D.new()
	ring.global_position = pos
	get_tree().current_scene.add_child(ring)
	var sprite = Sprite2D.new()
	var img = Image.create(24,24,false,Image.FORMAT_RGBA8)
	img.fill(Color(0,0,0,0))
	for y in range(24):
		for x in range(24):
			var d = Vector2(x-12,y-12).length()
			if d <= 12 and d >= 10:
				img.set_pixel(x,y, Color(1,1,1,0.6))
	sprite.texture = ImageTexture.create_from_image(img)
	sprite.centered = true
	ring.add_child(sprite)
	var tween = ring.create_tween()
	tween.parallel().tween_property(sprite, "scale", Vector2(1.6,1.6), 0.25)
	tween.parallel().tween_property(sprite, "modulate:a", 0.0, 0.25)
	tween.tween_callback(func(): if is_instance_valid(ring): ring.queue_free())

func _on_enemy_died_fx(_enemy, pos: Vector2, is_elite: bool, is_boss: bool):
	# 精英/Boss死亡额外特效
	if is_elite or is_boss:
		var flash = ColorRect.new()
		flash.color = Color(1,0.9,0.4,0.18)
		flash.size = get_viewport().get_visible_rect().size if get_viewport() else Vector2(1280,720)
		flash.position = Vector2.ZERO
		flash.mouse_filter = Control.MOUSE_FILTER_IGNORE
		get_tree().current_scene.add_child(flash)
		flash.z_index = 15
		var tween = flash.create_tween()
		tween.tween_property(flash, "color:a", 0.0, 0.25)
		tween.tween_callback(func(): if is_instance_valid(flash): flash.queue_free())
		# 冲击波
		var wave = Sprite2D.new()
		wave.global_position = pos
		var img = Image.create(128,128,false,Image.FORMAT_RGBA8)
		img.fill(Color(0,0,0,0))
		for y in range(128):
			for x in range(128):
				var d = Vector2(x-64,y-64).length()
				if d <= 60 and d >= 55:
					img.set_pixel(x,y, Color(1,1,1,0.5))
		wave.texture = ImageTexture.create_from_image(img)
		wave.centered = true
		wave.z_index = 9
		get_tree().current_scene.add_child(wave)
		var tween2 = wave.create_tween()
		tween2.parallel().tween_property(wave, "scale", Vector2(3,3), 0.4)
		tween2.parallel().tween_property(wave, "modulate:a", 0.0, 0.4)
		tween2.tween_callback(func(): if is_instance_valid(wave): wave.queue_free())

func spawn_hit_effect(pos: Vector2, color: Color = Color.WHITE):
	var fx = Node2D.new()
	fx.global_position = pos
	get_tree().current_scene.add_child(fx)
	var sprite = Sprite2D.new()
	var img = Image.create(16,16,false,Image.FORMAT_RGBA8)
	img.fill(color)
	sprite.texture = ImageTexture.create_from_image(img)
	sprite.centered = true
	fx.add_child(sprite)
	var tween = fx.create_tween()
	tween.parallel().tween_property(sprite, "scale", Vector2(2,2), 0.15)
	tween.parallel().tween_property(sprite, "modulate:a", 0.0, 0.15)
	tween.tween_callback(func(): if is_instance_valid(fx): fx.queue_free())
