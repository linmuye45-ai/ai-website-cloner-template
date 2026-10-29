extends CanvasLayer
## HUD.gd
## 游戏内 HUD - 血条、经验条、计时、击杀、等级、技能图标
## 中文注释覆盖

@onready var hp_bar: ProgressBar = $TopBar/HBox/HPBar
@onready var hp_label: Label = $TopBar/HBox/HPLabel
@onready var exp_bar: ProgressBar = $TopBar/ExpBar
@onready var level_label: Label = $TopBar/LevelLabel
@onready var time_label: Label = $TopBar/TimeLabel
@onready var kill_label: Label = $TopBar/KillLabel
@onready var stage_label: Label = $TopBar/StageLabel
@onready var weapon_container: HBoxContainer = $BottomBar/WeaponContainer
@onready var damage_ticker: Label = $DamageTicker

var _player_stats = null

func _ready():
	EventBus.hud_update_requested.connect(_update_hud)
	EventBus.player_damaged.connect(func(_a,_hp): _update_hp())
	EventBus.player_healed.connect(func(_a,_hp): _update_hp())
	EventBus.exp_gained.connect(func(_a,_t): _update_exp())
	EventBus.stage_changed.connect(_on_stage_changed)
	EventBus.player_level_up.connect(func(lv): _on_level_up(lv))
	
	# 等待玩家
	await get_tree().process_frame
	if GameManager.player and GameManager.player.stats:
		_player_stats = GameManager.player.stats
		_player_stats.hp_changed.connect(func(_h,_m): _update_hp())
		_player_stats.exp_changed.connect(func(_c,_r): _update_exp())
	_update_hud()
	print("[HUD] HUD 已初始化")

func _process(_delta):
	if GameManager.is_game_active:
		if time_label:
			time_label.text = GameManager.get_time_string()
		if kill_label:
			kill_label.text = "击杀: %d" % GameManager.kill_count

func _update_hud():
	_update_hp()
	_update_exp()
	_update_weapons()
	if time_label:
		time_label.text = GameManager.get_time_string()
	if kill_label:
		kill_label.text = "击杀: %d" % GameManager.kill_count

func _update_hp():
	if not hp_bar or not _player_stats:
		if GameManager.player:
			_player_stats = GameManager.player.stats
		if not _player_stats:
			return
	var pct = _player_stats.hp / _player_stats.max_hp * 100
	hp_bar.value = pct
	if hp_label:
		hp_label.text = "HP %d/%d" % [int(_player_stats.hp), int(_player_stats.max_hp)]
	# 低血量闪红
	if pct < 25:
		hp_bar.modulate = Color("#FF4444")
	elif pct < 50:
		hp_bar.modulate = Color("#FBBF24")
	else:
		hp_bar.modulate = Color.WHITE

func _update_exp():
	if not exp_bar or not _player_stats:
		return
	var pct = float(_player_stats.exp) / float(_player_stats.exp_to_next) * 100
	exp_bar.value = pct
	if level_label:
		level_label.text = "Lv.%d" % _player_stats.level

func _update_weapons():
	if not weapon_container:
		return
	# 清理旧
	for c in weapon_container.get_children():
		c.queue_free()
	var owned = {}
	# 从 UpgradeSystem 获取
	var upgrade_sys = get_node_or_null("/root/GameManager")
	# 直接从 GameManager.player.WeaponManager 获取
	var wm = null
	if GameManager.player:
		wm = GameManager.player.get_node_or_null("WeaponManager")
	if wm and wm.has_method("get_equipped_info"):
		var list = wm.get_equipped_info()
		for w in list:
			var btn = Label.new()
			btn.text = "%s Lv%d" % [w["name"], w["level"]]
			btn.add_theme_font_size_override("font_size", 11)
			btn.add_theme_color_override("font_color", Color("#E5E7EB"))
			btn.add_theme_color_override("font_outline_color", Color(0,0,0,0.8))
			btn.add_theme_constant_override("outline_size", 2)
			var bg = ColorRect.new()
			bg.color = Color(0.15,0.12,0.3,0.7)
			bg.size = Vector2(90, 24)
			bg.add_child(btn)
			btn.position = Vector2(6, 4)
			weapon_container.add_child(bg)
	# 额外显示被动
	await get_tree().process_frame

func _on_stage_changed(stage: int, stage_name: String):
	if stage_label:
		stage_label.text = "阶段 %d: %s" % [stage, stage_name]
		stage_label.modulate = Color("#FBBF24")
		var tween = create_tween()
		tween.tween_property(stage_label, "scale", Vector2(1.2,1.2), 0.15)
		tween.tween_property(stage_label, "scale", Vector2.ONE, 0.15)
		tween.tween_callback(func(): if is_instance_valid(stage_label): stage_label.modulate = Color.WHITE).set_delay(1.5)

func _on_level_up(new_level: int):
	if level_label:
		level_label.modulate = Color("#4ADE80")
		var tween = create_tween()
		tween.tween_property(level_label, "scale", Vector2(1.4,1.4), 0.2)
		tween.tween_property(level_label, "scale", Vector2.ONE, 0.2)
		tween.tween_callback(func(): if is_instance_valid(level_label): level_label.modulate = Color.WHITE)
