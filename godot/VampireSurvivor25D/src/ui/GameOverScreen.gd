extends CanvasLayer
## GameOverScreen.gd
## 死亡结算界面 - 展示本局数据、最高纪录、重新开始、返回菜单

@onready var title_label: Label = $Panel/VBox/Title
@onready var time_label: Label = $Panel/VBox/TimeLabel
@onready var kill_label: Label = $Panel/VBox/KillLabel
@onready var level_label: Label = $Panel/VBox/LevelLabel
@onready var stage_label: Label = $Panel/VBox/StageLabel
@onready var best_label: Label = $Panel/VBox/BestLabel
@onready var restart_button: Button = $Panel/VBox/RestartButton
@onready var menu_button: Button = $Panel/VBox/MenuButton

func _ready():
	visible = false
	process_mode = Node.PROCESS_MODE_ALWAYS
	EventBus.game_over.connect(_on_game_over)
	EventBus.game_victory.connect(_on_victory)
	if restart_button:
		restart_button.pressed.connect(_on_restart)
	if menu_button:
		menu_button.pressed.connect(_on_menu)
	print("[GameOverScreen] 结算界面就绪")

func _on_game_over(kill_count: int, survived_time: float, level: int):
	visible = true
	get_tree().paused = true
	if title_label:
		title_label.text = "游戏结束"
		title_label.add_theme_color_override("font_color", Color("#F87171"))
	_update_labels(kill_count, survived_time, level, false)
	_play_anim()
	AudioManager.play_sfx("dead")
	AudioManager.stop_bgm()

func _on_victory():
	visible = true
	get_tree().paused = true
	if title_label:
		title_label.text = "胜利!"
		title_label.add_theme_color_override("font_color", Color("#4ADE80"))
	_update_labels(GameManager.kill_count, GameManager.game_time, GameManager.player_level, true)
	_play_anim()
	AudioManager.play_sfx("levelup")

func _update_labels(kills: int, time: float, level: int, is_victory: bool):
	if time_label:
		var m = int(time) / 60
		var s = int(time) % 60
		time_label.text = "存活时间: %02d:%02d" % [m,s]
	if kill_label:
		kill_label.text = "击杀敌人: %d" % kills
	if level_label:
		level_label.text = "达到等级: %d" % level
	if stage_label:
		stage_label.text = "到达阶段: %d (%s)" % [GameManager.current_stage, ConfigManager.get_current_wave(time).get("name","")]
	if best_label:
		var data = SaveManager.save_data
		best_label.text = "历史最高: Lv.%d | 最长 %s | 通关 %d 次" % [data["highest_level"], _format_time(data["best_time"]), data["victory_count"]]
		if is_victory:
			best_label.text += "\n★ 解锁新技能! 继续挑战更高难度"
	if restart_button:
		restart_button.grab_focus()

func _format_time(t: float) -> String:
	var m = int(t)/60
	var s = int(t)%60
	return "%02d:%02d" % [m,s]

func _play_anim():
	var panel = $Panel
	panel.scale = Vector2(0.7, 0.7)
	panel.modulate.a = 0
	var tween = create_tween()
	tween.set_pause_mode(Tween.TWEEN_PAUSE_PROCESS)
	tween.tween_property(panel, "scale", Vector2.ONE, 0.35).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.parallel().tween_property(panel, "modulate:a", 1.0, 0.3)

func _on_restart():
	print("[GameOver] 重新开始")
	visible = false
	get_tree().paused = false
	GameManager.restart_game()

func _on_menu():
	print("[GameOver] 返回菜单")
	visible = false
	get_tree().paused = false
	GameManager.return_to_menu()

func _input(event):
	if not visible:
		return
	if event.is_action_pressed("confirm"):
		_on_restart()
