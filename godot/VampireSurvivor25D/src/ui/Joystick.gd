extends Control
## Joystick.gd
## 虚拟摇杆 - 小米平板8/手机触屏专用
## 左下角固定摇杆，支持多指触控、平滑回中、外环限制

signal joystick_vector_changed(vec: Vector2)

@onready var bg: TextureRect = $BG
@onready var knob: TextureRect = $BG/Knob

var radius: float = 65.0
var knob_radius: float = 32.0
var deadzone: float = 0.12

var _touch_index: int = -1
var _center: Vector2 = Vector2.ZERO
var _current_vector: Vector2 = Vector2.ZERO
var _is_active: bool = false

# 可调：是否固定位置（false则跟随首次触摸点）
@export var fixed_position: bool = true
@export var auto_hide_on_desktop: bool = true

func _ready():
	# 计算中心
	await get_tree().process_frame
	_center = bg.global_position + bg.size * 0.5
	# 桌面端自动隐藏（鼠标模式也可用，但默认隐藏）
	if auto_hide_on_desktop and not OS.has_feature("mobile") and not DisplayServer.is_touchscreen_available():
		# 保留可见，但半透明提示 - 小米平板会显示
		modulate.a = 0.85
	else:
		modulate.a = 0.92
	
	# 创建占位纹理（程序化）
	_create_placeholder_textures()
	print("[Joystick] 虚拟摇杆就绪 - 适配平板触屏")

func _create_placeholder_textures():
	# 如果已有纹理则跳过
	if bg and not bg.texture:
		var img = Image.create(130,130,false,Image.FORMAT_RGBA8)
		img.fill(Color(0,0,0,0))
		var c = Vector2(65,65)
		for y in range(130):
			for x in range(130):
				var d = Vector2(x,y).distance_to(c)
				if d <= 64:
					var t = d/64.0
					var a = 0.18
					if d > 58:
						a = 0.35  # 外环
					elif d < 30:
						a = 0.08
					img.set_pixel(x,y, Color(1,1,1,a * (1.0 - t*0.1)))
		bg.texture = ImageTexture.create_from_image(img)
		bg.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		bg.custom_minimum_size = Vector2(130,130)
	
	if knob and not knob.texture:
		var img2 = Image.create(64,64,false,Image.FORMAT_RGBA8)
		img2.fill(Color(0,0,0,0))
		var c2 = Vector2(32,32)
		for y in range(64):
			for x in range(64):
				var d = Vector2(x,y).distance_to(c2)
				if d <= 30:
					var a = 0.85 if d < 24 else 0.5
					# 紫色渐变
					var col = Color("#7C3AED") if d < 24 else Color("#A78BFA")
					col.a = a
					img2.set_pixel(x,y,col)
		knob.texture = ImageTexture.create_from_image(img2)
		knob.custom_minimum_size = Vector2(64,64)

func _input(event):
	# 触屏事件
	if event is InputEventScreenTouch:
		if event.pressed:
			# 检查是否在摇杆区域（扩大判定）
			var rect = Rect2(bg.global_position - Vector2(30,30), bg.size + Vector2(60,60))
			if rect.has_point(event.position) and _touch_index == -1:
				_touch_index = event.index
				_is_active = true
				_update_vector(event.position)
				# 震动反馈（小米平板支持）
				if OS.has_feature("mobile"):
					Input.vibrate_handheld(20)
				get_viewport().set_input_as_handled()
		else:
			if event.index == _touch_index:
				_touch_index = -1
				_is_active = false
				_reset_knob()
				get_viewport().set_input_as_handled()
	
	elif event is InputEventScreenDrag:
		if event.index == _touch_index:
			_update_vector(event.position)
			get_viewport().set_input_as_handled()

func _update_vector(pos: Vector2):
	var delta = pos - _center
	var dist = delta.length()
	var vec = Vector2.ZERO
	if dist > radius:
		delta = delta.normalized() * radius
		vec = delta.normalized()
	else:
		vec = delta / radius if radius > 0 else Vector2.ZERO
	
	# 死区
	if vec.length() < deadzone:
		vec = Vector2.ZERO
	
	_current_vector = vec
	# 更新摇杆位置
	if knob:
		knob.position = delta - knob.size * 0.5 + bg.size * 0.5
	
	joystick_vector_changed.emit(_current_vector)
	# 同时模拟 InputAction，供 Player 读取
	# 通过 Engine 直接设置虚拟输入
	Input.action_press("move_left", -vec.x if vec.x < 0 else 0)
	Input.action_press("move_right", vec.x if vec.x > 0 else 0)
	Input.action_press("move_up", -vec.y if vec.y < 0 else 0)
	Input.action_press("move_down", vec.y if vec.y > 0 else 0)

func _reset_knob():
	_current_vector = Vector2.ZERO
	if knob:
		var tween = create_tween()
		tween.tween_property(knob, "position", (bg.size - knob.size) * 0.5, 0.12).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	joystick_vector_changed.emit(Vector2.ZERO)
	# 释放输入
	Input.action_release("move_left")
	Input.action_release("move_right")
	Input.action_release("move_up")
	Input.action_release("move_down")

## 供 Player.gd 直接读取
func get_vector() -> Vector2:
	return _current_vector

func is_active() -> bool:
	return _is_active
