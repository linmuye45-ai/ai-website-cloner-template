extends Control
## MainMenu.gd
## 主菜单 - 开始游戏、设置、退出、展示最高纪录

@onready var title_label: Label = $Center/Panel/VBox/Title
@onready var subtitle_label: Label = $Center/Panel/VBox/Subtitle
@onready var play_button: Button = $Center/Panel/VBox/PlayButton
@onready var settings_button: Button = $Center/Panel/VBox/SettingsButton
@onready var quit_button: Button = $Center/Panel/VBox/QuitButton
@onready var stats_label: Label = $Center/Panel/VBox/Stats

var _bg_time: float = 0.0

func _ready():
	# 绑定按钮
	if play_button:
		play_button.pressed.connect(_on_play_pressed)
		play_button.grab_focus()
	if settings_button:
		settings_button.pressed.connect(_on_settings_pressed)
	if quit_button:
		quit_button.pressed.connect(_on_quit_pressed)
	
	_update_stats()
	# 背景动画
	_create_bg_particles()
	print("[MainMenu] 主菜单已加载")

func _update_stats():
	if not stats_label:
		return
	var data = SaveManager.save_data
	var txt = "最高等级: %d | 通关次数: %d | 总击杀: %d | 最长存活: %s" % [
		data.get("highest_level", 1),
		data.get("victory_count", 0),
		data.get("total_kills", 0),
		_format_time(data.get("best_time", 0))
	]
	stats_label.text = txt

func _format_time(seconds: float) -> String:
	var m = int(seconds) / 60
	var s = int(seconds) % 60
	return "%02d:%02d" % [m,s]

func _on_play_pressed():
	print("[MainMenu] 开始游戏")
	AudioManager.play_sfx("pickup")
	# 切换到游戏场景
	get_tree().change_scene_to_file("res://scenes/main/Game.tscn")

func _on_settings_pressed():
	var settings = $SettingsPanel
	if settings:
		settings.visible = not settings.visible
	else:
		print("[MainMenu] 设置面板不存在，尝试加载")
		# 动态加载设置界面
		var settings_scene = load("res://scenes/ui/Settings.tscn") if ResourceLoader.exists("res://scenes/ui/Settings.tscn") else null
		if settings_scene:
			var panel = settings_scene.instantiate()
			add_child(panel)

func _on_quit_pressed():
	get_tree().quit()

func _create_bg_particles():
	# 简单星空背景（用 ColorRect + shader 占位）
	var bg = $Background if has_node("Background") else null
	if bg:
		# 循环变色
		pass

func _process(delta):
	_bg_time += delta
	# 标题微浮动
	if title_label:
		title_label.position.y = sin(_bg_time * 1.2) * 3
