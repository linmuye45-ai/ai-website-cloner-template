extends CanvasLayer
## PauseMenu.gd
## 暂停菜单 - ESC 触发，继续/设置/返回主菜单

@onready var panel: PanelContainer = $Panel
@onready var resume_button: Button = $Panel/VBox/ResumeButton
@onready var settings_button: Button = $Panel/VBox/SettingsButton
@onready var menu_button: Button = $Panel/VBox/MenuButton

func _ready():
	visible = false
	process_mode = Node.PROCESS_MODE_ALWAYS
	if resume_button:
		resume_button.pressed.connect(_on_resume)
	if settings_button:
		settings_button.pressed.connect(_on_settings)
	if menu_button:
		menu_button.pressed.connect(_on_menu)
	print("[PauseMenu] 暂停菜单就绪")

func _input(event):
	if event.is_action_pressed("pause"):
		if GameManager.current_state == GameManager.GameState.PLAYING:
			pause()
		elif GameManager.current_state == GameManager.GameState.PAUSED:
			resume()
		get_viewport().set_input_as_handled()

func pause():
	visible = true
	GameManager.pause_game()
	if resume_button:
		resume_button.grab_focus()

func resume():
	visible = false
	GameManager.resume_game()

func _on_resume():
	resume()

func _on_settings():
	# 打开设置界面
	var settings = get_tree().get_first_node_in_group("settings_screen")
	if settings and settings.has_method("open"):
		settings.open()
	else:
		# 尝试查找 SettingsScreen 节点
		var s = get_node_or_null("../SettingsScreen")
		if s:
			s.visible = true
			get_tree().paused = true

func _on_menu():
	visible = false
	GameManager.return_to_menu()
