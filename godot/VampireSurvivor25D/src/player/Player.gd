extends CharacterBody2D
## Player.gd
## 玩家主体 - 移动、受击、经验拾取、武器管理
## 2.5D表现：阴影、高度差、轻微透视缩放

@onready var sprite: Sprite2D = $Sprite
@onready var shadow: Sprite2D = $Shadow
@onready var hurt_flash: Timer = $HurtFlashTimer
@onready var pickup_area: Area2D = $PickupArea
@onready var hurtbox: Area2D = $Hurtbox
@onready var weapon_manager: Node = $WeaponManager
@onready var collision_shape: CollisionShape2D = $CollisionShape2D

var stats: PlayerStats
var move_input: Vector2 = Vector2.ZERO
var facing_dir: Vector2 = Vector2.RIGHT

# 移动平滑
var _velocity_smoothing: Vector2 = Vector2.ZERO

# 无敌闪烁
var _flash_tween: Tween

# 经验吸引
var _magnet_active: bool = false
var _magnet_timer: float = 0.0

func _ready():
	stats = PlayerStats.new()
	GameManager.register_player(self)
	
	# 初始化拾取范围
	var pickup_shape = pickup_area.get_node_or_null("CollisionShape2D")
	if pickup_shape and pickup_shape.shape is CircleShape2D:
		pickup_shape.shape.radius = stats.pickup_range
	
	# 连接信号
	if hurtbox:
		hurtbox.area_entered.connect(_on_hurtbox_entered)
		hurtbox.body_entered.connect(_on_hurtbox_body_entered)
	if pickup_area:
		pickup_area.area_entered.connect(_on_pickup_entered)
	
	# 监听被动变化更新拾取范围
	# 每帧在 _process 中同步
	
	# 生成占位外观（若 Sprite 无纹理则程序化创建）
	_create_placeholder_visual()
	
	print("[Player] 玩家初始化完成 - HP:%.0f 速度:%.0f" % [stats.max_hp, stats.move_speed])

func _create_placeholder_visual():
	# 如果没有贴图，用代码生成纯色占位
	if sprite and not sprite.texture:
		var img = Image.create(48, 64, false, Image.FORMAT_RGBA8)
		img.fill(Color("#7C3AED"))
		# 简单高光
		for y in range(10, 22):
			for x in range(14, 34):
				img.set_pixel(x, y, Color("#A78BFA"))
		# 眼睛
		img.set_pixel(16, 16, Color("#1F1140"))
		img.set_pixel(17, 16, Color("#1F1140"))
		img.set_pixel(30, 16, Color("#1F1140"))
		img.set_pixel(31, 16, Color("#1F1140"))
		var tex = ImageTexture.create_from_image(img)
		sprite.texture = tex
		sprite.centered = true
	
	if shadow and not shadow.texture:
		var img2 = Image.create(40, 16, false, Image.FORMAT_RGBA8)
		img2.fill(Color(0,0,0,0))
		# 椭圆阴影
		for y in range(16):
			for x in range(40):
				var dx = (x - 20) / 20.0
				var dy = (y - 8) / 8.0
				if dx*dx + dy*dy <= 1.0:
					var a = 0.35 * (1.0 - (dx*dx + dy*dy) * 0.5)
					img2.set_pixel(x, y, Color(0,0,0,a))
		shadow.texture = ImageTexture.create_from_image(img2)
		shadow.position = Vector2(0, 18)
		shadow.z_index = -1

func _process(delta):
	# 无敌时间更新
	stats.update(delta)
	
	# 磁铁计时
	if _magnet_active:
		_magnet_timer -= delta
		if _magnet_timer <= 0:
			_magnet_active = false
	
	# 同步拾取范围（可能因升级变化）
	var pickup_shape = pickup_area.get_node_or_null("CollisionShape2D")
	if pickup_shape and pickup_shape.shape is CircleShape2D:
		pickup_shape.shape.radius = stats.pickup_range
	
	# 无敌闪烁
	if stats.is_invincible():
		sprite.modulate.a = 0.5 + 0.5 * sin(Time.get_ticks_msec() * 0.02)
	else:
		sprite.modulate.a = 1.0
	
	# 2.5D 高度差：根据 y 位置微缩放（远处略小）
	var y_factor = clamp((global_position.y + 2000) / 4000.0, 0.85, 1.05)
	sprite.scale = Vector2.ONE * y_factor
	# 轻微倾斜：移动时 sprite 偏移
	if velocity.length() > 10:
		sprite.position.x = lerp(sprite.position.x, velocity.normalized().x * 2.0, delta * 8)
		sprite.position.y = lerp(sprite.position.y, velocity.normalized().y * 1.0, delta * 8)
	else:
		sprite.position = sprite.position.lerp(Vector2.ZERO, delta * 6)
	
	# 阴影跟随
	if shadow:
		shadow.global_position = global_position + Vector2(4, 14)
		shadow.scale = Vector2.ONE * y_factor * 0.9

func _physics_process(_delta):
	if GameManager.current_state != GameManager.GameState.PLAYING:
		velocity = Vector2.ZERO
		return
	
	# 输入
	move_input = Vector2.ZERO
	move_input.x = Input.get_action_strength("move_right") - Input.get_action_strength("move_left")
	move_input.y = Input.get_action_strength("move_down") - Input.get_action_strength("move_up")
	if move_input.length() > 1:
		move_input = move_input.normalized()
	
	# WASD+摇杆已处理，额外支持鼠标？不需要
	
	if move_input.length() > 0.1:
		facing_dir = move_input.normalized()
		EventBus.player_moved.emit(global_position)
	
	# 移动（圆形碰撞，CharacterBody2D 自带）
	velocity = move_input * stats.move_speed
	move_and_slide()
	
	# 边界限制（世界 4000x4000）
	global_position.x = clamp(global_position.x, -2000, 2000)
	global_position.y = clamp(global_position.y, -2000, 2000)
	
	# 翻转
	if facing_dir.x < -0.1:
		sprite.flip_h = true
	elif facing_dir.x > 0.1:
		sprite.flip_h = false

func take_damage(amount: float):
	var died = stats.take_damage(amount)
	_flash_hurt()
	GameManager.shake_screen(4.0, 0.15)
	AudioManager.play_sfx("hurt", global_position)
	# 伤害数字（给自己）
	EventBus.damage_number_requested.emit(global_position + Vector2(0,-20), amount, false, Color("#FF4444"))
	if died:
		die()

func _flash_hurt():
	if _flash_tween and _flash_tween.is_valid():
		_flash_tween.kill()
	sprite.modulate = Color("#FF5555")
	_flash_tween = create_tween()
	_flash_tween.tween_property(sprite, "modulate", Color.WHITE, 0.15)

func heal(amount: float):
	stats.heal(amount)
	EventBus.damage_number_requested.emit(global_position + Vector2(0,-25), amount, false, Color("#4ADE80"))

func die():
	print("[Player] 玩家死亡!")
	visible = false
	process_mode = Node.PROCESS_MODE_DISABLED
	EventBus.player_died.emit()

func add_exp(amount: int):
	var leveled = stats.add_exp(amount)
	EventBus.exp_pickup_collected.emit(amount, global_position)
	if leveled:
		# 稍微延迟让拾取反馈播完
		await get_tree().create_timer(0.05).timeout
		GameManager.show_level_up()

func activate_magnet(duration: float = 5.0):
	_magnet_active = true
	_magnet_timer = duration
	# 吸引范围内所有宝石
	print("[Player] 磁铁激活 %.1fs" % duration)

func is_magnet_active() -> bool:
	return _magnet_active

func get_facing() -> Vector2:
	return facing_dir

func _on_hurtbox_entered(area: Area2D):
	# 敌人子弹或敌人触碰
	if area.is_in_group("enemy_bullet") or area.is_in_group("enemy"):
		var dmg = area.get_meta("damage") if area.has_meta("damage") else 10.0
		take_damage(dmg)

func _on_hurtbox_body_entered(body: Node):
	if body.is_in_group("enemy"):
		var dmg = 10.0
		if body.has_method("get_damage"):
			dmg = body.get_damage()
		elif body.has_meta("damage"):
			dmg = body.get_meta("damage")
		take_damage(dmg)

func _on_pickup_entered(area: Area2D):
	if area.is_in_group("exp_gem"):
		if area.has_method("collect"):
			area.collect(self)
	elif area.is_in_group("health_pickup"):
		heal(20)
		if area.has_method("pool_return"):
			area.pool_return()
		else:
			area.queue_free()
	elif area.is_in_group("magnet"):
		activate_magnet(4.0)
		if area.has_method("pool_return"):
			area.pool_return()
		else:
			area.queue_free()

## 供外部获取状态
func get_hp_percent() -> float:
	return stats.hp / stats.max_hp

func get_level() -> int:
	return stats.level

## 对象池重置
func pool_reset():
	visible = true
	process_mode = Node.PROCESS_MODE_INHERIT
	stats.reset()
	velocity = Vector2.ZERO
