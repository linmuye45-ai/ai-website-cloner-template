extends Area2D
## ExpGem.gd
## 经验宝石 - 可被拾取、磁吸、合并
## 2.5D：漂浮动画 + 拾取拖尾

var gem_value: int = 5
var gem_type: String = "tiny"

# 磁吸参数
var _is_collected: bool = false
var _attract_speed: float = 0.0
var _bob_offset: float = 0.0
var _life_time: float = 0.0

# 目标玩家
var _target_player: Node = null

func _ready():
	add_to_group("exp_gem")
	monitoring = true
	monitorable = true
	_bob_offset = randf() * TAU
	# 自动超时：30秒后闪烁消失（防止堆积）
	
func setup(value: int, type: String):
	gem_value = value
	gem_type = type
	set_meta("gem_value", value)
	set_meta("gem_type", type)

func _process(delta):
	_life_time += delta
	if _is_collected:
		return
	# 漂浮
	if get_child_count() > 0:
		var sprite = get_child(0) as Node2D
		if sprite:
			sprite.position.y = sin(_life_time * 3.0 + _bob_offset) * 2.0
	
	# 磁吸检测：玩家拾取范围内自动吸引
	var player = GameManager.player
	if not player or not is_instance_valid(player):
		return
	var dist = global_position.distance_to(player.global_position)
	var pickup_range = 120.0
	if player.stats:
		pickup_range = player.stats.pickup_range
	# 磁铁激活时范围翻倍
	if player.has_method("is_magnet_active") and player.is_magnet_active():
		pickup_range *= 2.5
	
	if dist <= pickup_range:
		# 开始吸引
		_attract_speed = lerp(_attract_speed, 800.0, delta * 4.0)
		var dir = (player.global_position - global_position).normalized()
		global_position += dir * _attract_speed * delta
		# 加速
		if dist < 25:
			collect(player)
	# 超时清理
	if _life_time > 30:
		# 闪烁
		visible = int(_life_time * 8) % 2 == 0
		if _life_time > 33:
			queue_free()

func collect(player: Node):
	if _is_collected:
		return
	_is_collected = true
	# 给予经验
	if player.has_method("add_exp"):
		player.add_exp(gem_value)
	# 拾取反馈
	EventBus.pickup_feedback.emit(global_position, gem_type)
	# 粒子
	_spawn_pickup_fx()
	# 回池或销毁
	if has_meta("pool_name"):
		PoolManager.return_object(self)
	else:
		queue_free()

func _spawn_pickup_fx():
	# 简单上升文字
	var fx = Node2D.new()
	fx.global_position = global_position
	get_tree().current_scene.add_child(fx)
	var label = Label.new()
	label.text = "+%d" % gem_value
	label.add_theme_font_size_override("font_size", 12)
	label.add_theme_color_override("font_color", Color("#A7F3D0"))
	label.position = Vector2(-12, -12)
	fx.add_child(label)
	var tween = fx.create_tween()
	tween.set_parallel(true)
	tween.tween_property(fx, "position:y", fx.position.y - 20, 0.5)
	tween.tween_property(label, "modulate:a", 0.0, 0.5)
	tween.tween_callback(func(): if is_instance_valid(fx): fx.queue_free()).set_delay(0.6)

func pool_reset():
	_is_collected = false
	_attract_speed = 0.0
	_life_time = 0.0
	visible = true
	process_mode = Node.PROCESS_MODE_INHERIT

func pool_on_return():
	visible = false
