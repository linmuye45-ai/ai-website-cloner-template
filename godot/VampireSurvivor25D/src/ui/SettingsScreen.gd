extends CanvasLayer
## SettingsScreen.gd
## 设置界面 - 音量、画面、操作
## 中文注释

@onready var master_slider: HSlider = $Panel/VBox/MasterVolume
@onready var bgm_slider: HSlider = $Panel/VBox/BGMVolume
@onready var sfx_slider: HSlider = $Panel/VBox/SFXVolume
@onready var shake_check: CheckButton = $Panel/VBox/ScreenShake
@onready var damage_check: CheckButton = $Panel/VBox/DamageNumbers
@onready var back_button: Button = $Panel/VBox/BackButton
@onready var unlock_all_button: Button = $Panel/VBox/UnlockAllButton

func _ready():
	visible = false
	process_mode = Node.PROCESS_MODE_ALWAYS
	# 设置初始值
	if master_slider:
		master_slider.value = SaveManager.get_setting("master_volume") if SaveManager.get_setting("master_volume") != null else 0.8
		master_slider.value_changed.connect(func(v): AudioManager.set_master_volume(v))
	if bgm_slider:
		bgm_slider.value = SaveManager.get_setting("bgm_volume") if SaveManager.get_setting("bgm_volume") != null else 0.7
		bgm_slider.value_changed.connect(func(v): AudioManager.set_bgm_volume(v))
	if sfx_slider:
		sfx_slider.value = SaveManager.get_setting("sfx_volume") if SaveManager.get_setting("sfx_volume") != null else 0.8
		sfx_slider.value_changed.connect(func(v): AudioManager.set_sfx_volume(v))
	if shake_check:
		shake_check.button_pressed = SaveManager.get_setting("screen_shake") if SaveManager.get_setting("screen_shake") != null else true
		shake_check.toggled.connect(func(pressed): SaveManager.set_setting("screen_shake", pressed))
	if damage_check:
		damage_check.button_pressed = SaveManager.get_setting("show_damage_numbers") if SaveManager.get_setting("show_damage_numbers") != null else true
		damage_check.toggled.connect(func(pressed): SaveManager.set_setting("show_damage_numbers", pressed))
	if back_button:
		back_button.pressed.connect(func(): visible = false; get_tree().paused = false)
	if unlock_all_button:
		unlock_all_button.pressed.connect(func():
			SaveManager.unlock_all_for_debug()
			AudioManager.play_sfx("levelup")
		)
	EventBus.settings_changed.connect(func(_k,_v): pass)

func open():
	visible = true
	get_tree().paused = true

func close():
	visible = false
	get_tree().paused = false

func _input(event):
	if event.is_action_pressed("pause") and visible:
		close()
