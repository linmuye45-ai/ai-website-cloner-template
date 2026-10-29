extends CharacterBody2D
## Enemy.gd
## 敌人主体 - 追踪玩家、受伤、死亡掉落、精英/Boss变体
## 性能优化：圆形碰撞、分离行为、对象池友好

@onready var sprite: Sprite2D = $Sprite
@onready var shadow: Sprite2D = $Shadow
@onready var collision_shape: CollisionShape2D = $CollisionShape2D
@onready var hit_flash_timer: Timer = $HitFlashTimer

var enemy_id: String = "slime"
var config: Dictionary = {}

# 属性
var max_hp: float = 20
var hp: float = 20
var damage: float = 8
var move_speed: float = 45
var xp_value: int = 5
var is_elite: bool = false
var is_boss: bool = false

# 状态
var _is_dead: bool = false
var _knockback_vel: Vector2 = Vector2.ZERO
var _knockback_time: float = 0.0
var _hit_tween: Tween

# 视觉
var _base_scale: Vector2 = Vector2.ONE
var _base_color: Color = Color.WHITE

func _ready():
	add_to_group("enemy")
	# 如果未设置 id，随机一个
	if config.is_empty():
		setup("slime")
	# 监听玩家位置：不需要每帧寻路，简单朝玩家移动
	_create_visual()
	_update_collision()

func setup(id: String, elite: bool = false, boss: bool = false):
	enemy_id = id
	is_elite = elite
	is_boss = boss
	config = ConfigManager.get_enemy(enemy_id)
	if config.is_empty():
		config = ConfigManager.get_enemy("slime")
	
	# 基础属性
	max_hp = float(config.get("hp", 20))
	damage = float(config.get("damage", 8))
	move_speed = float(config.get("speed", 45))
	xp_value = int(config.get("xp_value", 5))
	
	# 难度倍率
	var diff_hp = ConfigManager.get_difficulty_multiplier("hp_multiplier_curve", GameManager.game_time)
	var diff_speed = ConfigManager.get_difficulty_multiplier("speed_multiplier_curve", GameManager.game_time)
	max_hp *= diff_hp
	damage *= (1.0 + (diff_hp - 1.0) * 0.3)
	move_speed *= diff_speed
	
	# 精英加成
	if is_elite:
		max_hp *= 3.5
		damage *= 1.6
		move_speed *= 1.15
		xp_value = int(xp_value * 4)
		scale = Vector2.ONE * 1.4
	elif is_boss:
		max_hp *= 6.0
		damage *= 2.0
		move_speed *= 0.95
		scale = Vector2.ONE * 1.8
	else:
		scale = Vector2.ONE * float(config.get("scale", 1.0))
	
	hp = max_hp
	_base_scale = scale
	
	var color_str = config.get("color", "#4ADE80")
	_base_color = Color(color_str)
	
	_is_dead = false
	_knockback_vel = Vector2.ZERO
	_knockback_time = 0.0
	visible = true
	process_mode = Node.PROCESS_MODE_INHERIT
	
	# 名称用于调试
	name = "%s_%d" % [enemy_id, get_instance_id() % 1000]

func _create_visual():
	# 若 Sprite 无纹理，程序化生成占位几何体
	if sprite and not sprite.texture:
		var size = 32
		if is_boss:
			size = 56
		elif is_elite:
			size = 42
		var img = Image.create(size, size, false, Image.FORMAT_RGBA8)
		img.fill(Color(0,0,0,0))
		var center = Vector2(size/2, size/2)
		var radius = size/2 - 2
		for y in range(size):
			for x in range(size):
				var d = Vector2(x,y).distance_to(center)
				if d <= radius:
					# 渐变
					var t = d / radius
					var c = _base_color
					# 边缘深色
					if t > 0.85:
						c = _base_color.darkened(0.3)
					elif t < 0.3:
						c = _base_color.lightened(0.2)
					# 精英加金色描边
					if is_elite and t > 0.88:
						c = Color("#FBBF24")
					elif is_boss and t > 0.88:
						c = Color("#DC2626")
					img.set_pixel(x,y,c)
		# 眼睛
		if size >= 32:
			var eye_y = int(size/2 - 4)
			var eye_x1 = int(size/2 - 6)
			var eye_x2 = int(size/2 + 4)
			img.set_pixel(eye_x1, eye_y, Color("#1F1140"))
			img.set_pixel(eye_x1+1, eye_y, Color("#1F1140"))
			img.set_pixel(eye_x2, eye_y, Color("#1F1140"))
			img.set_pixel(eye_x2+1, eye_y, Color("#1F1140"))
			# 瞳孔反光
			img.set_pixel(eye_x1, eye_y, Color.WHITE)
			img.set_pixel(eye_x2, eye_y, Color.WHITE)
		sprite.texture = ImageTexture.create_from_image(img)
		sprite.centered = true
	
	if shadow and not shadow.texture:
		var img2 = Image.create(32, 12, false, Image.FORMAT_RGBA8)
		img2.fill(Color(0,0,0,0))
		for y in range(12):
			for x in range(32):
				var dx = (x - 16)/16.0
				var dy = (y - 6)/6.0
				if dx*dx + dy*dy <= 1.0:
					img2.set_pixel(x,y, Color(0,0,0,0.35 * (1.0 - (dx*dx+dy*dy)*0.5)))
		shadow.texture = ImageTexture.create_from_image(img2)
		shadow.position = Vector2(0, 12)
		shadow.z_index = -1
		shadow.scale = Vector2(1.2, 0.9)

func _update_collision():
	if collision_shape and collision_shape.shape is CircleShape2D:
		var r = 14.0
		if is_boss: r = 24
		elif is_elite: r = 20
		collision_shape.shape.radius = r * scale.x

func _physics_process(delta):
	if _is_dead:
		return
	if not GameManager.is_playing():
		return
	if not GameManager.player or not is_instance_valid(GameManager.player):
		return
	
	# 击退处理
	if _knockback_time > 0:
		_knockback_time -= delta
		velocity = _knockback_vel
		move_and_slide()
		return
	
	var player_pos = GameManager.get_player_pos()
	var dir = (player_pos - global_position).normalized()
	
	# 速度
	var speed = move_speed
	# Boss 稍微智能：保持一点距离？
	# 简单分离：避免扎堆（轻量）
	_apply_separation(delta)
	
	velocity = dir * speed + _separation_force
	# 将速度限制
	if velocity.length() > speed * 1.3:
		velocity = velocity.normalized() * speed * 1.3
	
	move_and_slide()
	
	# 2.5D 透视：Y 越小越远，scale 略小
	var y_factor = clamp((global_position.y + 2000)/4000.0, 0.9, 1.08)
	sprite.scale = Vector2.ONE * y_factor
	if is_elite or is_boss:
		sprite.scale *= 1.1
	# 面朝方向
	if velocity.x < -5:
		sprite.flip_h = true
	elif velocity.x > 5:
		sprite.flip_h = false
	
	# 阴影跟随
	if shadow:
		shadow.global_position = global_position + Vector2(3, 10)

# 分离力
var _separation_force: Vector2 = Vector2.ZERO
func _apply_separation(_delta):
	_separation_force = Vector2.ZERO
	# 为性能，每3帧计算一次分离
	if Engine.get_frames_drawn() % 3 != 0:
		return
	var neighbors = get_tree().get_nodes_in_group("enemy")
	var count = 0
	for other in neighbors:
		if other == self: continue
		if not is_instance_valid(other): continue
		var dist_sq = global_position.distance_squared_to(other.global_position)
		var min_dist = 28.0 * scale.x
		if dist_sq < min_dist * min_dist and dist_sq > 1:
			var away = (global_position - other.global_position).normalized()
			var strength = (min_dist - sqrt(dist_sq)) / min_dist
			_separation_force += away * strength * 60.0
			count += 1
			if count > 4: # 限制避免过重
				break

func take_damage(amount: float):
	if _is_dead:
		return
	hp -= amount
	EventBus.enemy_damaged.emit(self, amount)
	_flash_hit()
	# 血条或受击效果：缩放
	if sprite:
		if _hit_tween and _hit_tween.is_valid():
			_hit_tween.kill()
		sprite.scale = _base_scale * 0.85
		_hit_tween = create_tween()
		_hit_tween.tween_property(sprite, "scale", _base_scale, 0.12).set_trans(Tween.TRANS_BACK)
	
	if hp <= 0:
		die()

func _flash_hit():
	if not sprite:
		return
	var orig = sprite.modulate
	sprite.modulate = Color("#FFFFFF")
	await get_tree().create_timer(0.05).timeout
	if is_instance_valid(sprite):
		sprite.modulate = orig

func die():
	if _is_dead:
		return
	_is_dead = true
	# 掉落经验
	_spawn_exp_gem()
	# 死亡特效
	_spawn_death_fx()
	EventBus.enemy_died.emit(self, global_position, is_elite, is_boss)
	# 回池或释放
	visible = false
	process_mode = Node.PROCESS_MODE_DISABLED
	# 延迟回池，避免信号期间修改
	await get_tree().process_frame
	if has_meta("pool_name"):
		PoolManager.return_object(self)
	else:
		queue_free()

func _spawn_exp_gem():
	var gem_type = "tiny"
	if is_boss:
		gem_type = "epic"
	elif is_elite:
		gem_type = "large"
	elif max_hp > 70:
		gem_type = "medium"
	elif max_hp > 30:
		gem_type = "small"
	
	# 直接创建经验宝石（Area2D）
	var gem = Area2D.new()
	gem.global_position = global_position + Vector2(randf_range(-6,6), randf_range(-6,6))
	gem.add_to_group("exp_gem")
	gem.monitoring = true
	gem.monitorable = true
	gem.set_meta("gem_value", xp_value)
	gem.set_meta("gem_type", gem_type)
	
	var col = CollisionShape2D.new()
	var shape = CircleShape2D.new()
	shape.radius = 8
	col.shape = shape
	gem.add_child(col)
	
	var img_size = 14
	var col_map = {"tiny": "#4ADE80", "small": "#22D3EE", "medium": "#A78BFA", "large": "#F59E0B", "epic": "#F43F5E"}
	var gem_color = col_map.get(gem_type, "#4ADE80")
	var sprite2 = Sprite2D.new()
	var img = Image.create(img_size, img_size, false, Image.FORMAT_RGBA8)
	img.fill(Color(gem_color))
	# 菱形
	for y in range(img_size):
		for x in range(img_size):
			var dx = abs(x - img_size/2)
			var dy = abs(y - img_size/2)
			if dx + dy > img_size/2:
				img.set_pixel(x,y, Color(0,0,0,0))
	# 高光
	img.set_pixel(img_size/2, 3, Color.WHITE)
	sprite2.texture = ImageTexture.create_from_image(img)
	sprite2.centered = true
	gem.add_child(sprite2)
	
	# 漂浮动画
	var tween = gem.create_tween()
	tween.set_loops()
	tween.tween_property(sprite2, "position:y", -3, 0.4).set_trans(Tween.TRANS_SINE)
	tween.tween_property(sprite2, "position:y", 0, 0.4).set_trans(Tween.TRANS_SINE)
	
	# 脚本：跟随玩家 + 拾取
	gem.set_script(load("res://src/pickups/ExpGem.gd"))
	if gem.has_method("setup"):
		gem.setup(xp_value, gem_type)
	
	get_tree().current_scene.add_child(gem)

func _spawn_death_fx():
	var fx = Node2D.new()
	fx.global_position = global_position
	get_tree().current_scene.add_child(fx)
	var particles = GPUParticles2D.new()
	particles.emitting = true
	particles.amount = 10 if not is_boss else 30
	particles.lifetime = 0.4
	particles.one_shot = true
	var mat = ParticleProcessMaterial.new()
	mat.direction = Vector3(0,-1,0)
	mat.spread = 180
	mat.initial_velocity_min = 50
	mat.initial_velocity_max = 120
	mat.gravity = Vector3(0, 300, 0)
	mat.scale_min = 1.0
	mat.scale_max = 1.8
	particles.process_material = mat
	var img = Image.create(6,6,false,Image.FORMAT_RGBA8)
	img.fill(_base_color)
	particles.texture = ImageTexture.create_from_image(img)
	fx.add_child(particles)
	# 自动清理
	await get_tree().create_timer(0.6).timeout
	if is_instance_valid(fx):
		fx.queue_free()

func get_damage() -> float:
	return damage

func knockback(force: Vector2, duration: float):
	_knockback_vel = force
	_knockback_time = duration

func is_dead() -> bool:
	return _is_dead

func pool_reset():
	_is_dead = false
	hp = max_hp
	visible = true
	process_mode = Node.PROCESS_MODE_INHERIT
	scale = _base_scale if _base_scale != Vector2.ZERO else Vector2.ONE
	if sprite:
		sprite.modulate = Color.WHITE
		sprite.scale = Vector2.ONE

func pool_on_return():
	visible = false
	process_mode = Node.PROCESS_MODE_DISABLED
