extends Node
## ScreenShake.gd
## 屏幕震动系统 - 监听 EventBus，提供镜头震动
## 2.5D 表现：摄像机 offset 抖动 + 色差

var camera: Camera2D = null
var _shake_intensity: float = 0.0
var _shake_duration: float = 0.0
var _shake_timer: float = 0.0
var _base_offset: Vector2 = Vector2.ZERO
var _rng: RandomNumberGenerator = RandomNumberGenerator.new()

func _ready():
	_rng.randomize()
	EventBus.screen_shake_requested.connect(_on_shake_requested)
	# 尝试自动查找 Camera2D
	await get_tree().process_frame
	_find_camera()

func _find_camera():
	camera = get_viewport().get_camera_2d()
	if camera == null:
		# 遍历查找
		for n in get_tree().get_nodes_in_group("main_camera"):
			if n is Camera2D:
				camera = n
				break
	if camera:
		_base_offset = camera.offset
		print("[ScreenShake] 已绑定摄像机: %s" % camera.name)

func _process(delta):
	if not camera or not is_instance_valid(camera):
		_find_camera()
		return
	if _shake_timer > 0:
		_shake_timer -= delta
		var intensity = _shake_intensity * (_shake_timer / _shake_duration)
		if not SaveManager.get_setting("screen_shake"):
			intensity *= 0.3
		var offset = Vector2(_rng.randf_range(-1,1), _rng.randf_range(-1,1)).normalized() * intensity
		camera.offset = _base_offset + offset
		# 震动时轻微缩放
		camera.zoom = Vector2.ONE * (1.0 + intensity * 0.002)
		if _shake_timer <= 0:
			camera.offset = _base_offset
			camera.zoom = Vector2.ONE
	else:
		camera.offset = _base_offset

func _on_shake_requested(intensity: float, duration: float):
	_shake_intensity = max(_shake_intensity, intensity)
	_shake_duration = max(_shake_duration, duration)
	_shake_timer = _shake_duration
	if camera == null:
		_find_camera()

## 供外部直接调用
func shake(intensity: float, duration: float):
	_on_shake_requested(intensity, duration)
