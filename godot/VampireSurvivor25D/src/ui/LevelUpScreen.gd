extends CanvasLayer
## LevelUpScreen.gd
## 升级 3选1 界面 - 暂停游戏，展示随机技能选项
## 2.5D 风格：卡牌翻转动效

@onready var title_label: Label = $Panel/VBox/Title
@onready var cards_container: HBoxContainer = $Panel/VBox/Cards
@onready var hint_label: Label = $Panel/VBox/Hint

var current_options: Array = []
var _is_showing: bool = false

func _ready():
	visible = false
	process_mode = Node.PROCESS_MODE_ALWAYS  # 暂停时仍可操作
	EventBus.upgrade_options_ready.connect(_on_options_ready)
	EventBus.player_level_up.connect(func(_lv): pass) # 由 GameManager 触发暂停后，此脚本显示
	print("[LevelUpScreen] 升级界面就绪")

func _on_options_ready(options: Array):
	current_options = options
	if options.is_empty():
		# 无选项直接继续
		GameManager.hide_level_up()
		return
	show_screen(options)

func show_screen(options: Array):
	if _is_showing:
		return
	_is_showing = true
	visible = true
	# 确保在暂停状态
	get_tree().paused = true
	_build_cards(options)
	# 入场动画
	var panel = $Panel
	panel.scale = Vector2(0.8, 0.8)
	panel.modulate.a = 0.0
	var tween = create_tween()
	tween.set_pause_mode(Tween.TWEEN_PAUSE_PROCESS)
	tween.tween_property(panel, "scale", Vector2.ONE, 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.parallel().tween_property(panel, "modulate:a", 1.0, 0.2)
	# 分别动画卡牌
	for i in range(cards_container.get_child_count()):
		var card = cards_container.get_child(i)
		card.scale = Vector2.ZERO
		var t = create_tween()
		t.set_pause_mode(Tween.TWEEN_PAUSE_PROCESS)
		t.tween_property(card, "scale", Vector2.ONE, 0.3).set_delay(0.15 + i*0.08).set_trans(Tween.TRANS_BACK)
	# 音效
	AudioManager.play_sfx("levelup")

func _build_cards(options: Array):
	# 清理旧卡牌
	for c in cards_container.get_children():
		c.queue_free()
	
	for i in range(options.size()):
		var opt = options[i]
		var card = _create_card(opt, i)
		cards_container.add_child(card)

func _create_card(opt: Dictionary, index: int) -> Control:
	var card = PanelContainer.new()
	card.custom_minimum_size = Vector2(200, 260)
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.15, 0.12, 0.28, 0.95)
	style.corner_radius_top_left = 12
	style.corner_radius_top_right = 12
	style.corner_radius_bottom_left = 12
	style.corner_radius_bottom_right = 12
	style.border_color = Color(0.55, 0.45, 0.85, 1.0)
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.shadow_color = Color(0,0,0,0.4)
	style.shadow_size = 8
	card.add_theme_stylebox_override("panel", style)
	
	var vbox = VBoxContainer.new()
	vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	card.add_child(vbox)
	
	# 图标（占位色块）
	var icon = ColorRect.new()
	icon.custom_minimum_size = Vector2(64,64)
	var type = opt.get("type", "active")
	match type:
		"active": icon.color = Color("#7C3AED")
		"passive": icon.color = Color("#059669")
		"evolved": icon.color = Color("#DC2626")
		_: icon.color = Color("#4B5563")
	# 图标内部文字首字母
	var icon_label = Label.new()
	icon_label.text = opt.get("name", "?").substr(0,1)
	icon_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	icon_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	icon_label.add_theme_font_size_override("font_size", 32)
	icon.add_child(icon_label)
	icon_label.size = icon.custom_minimum_size
	icon_label.position = Vector2.ZERO
	vbox.add_child(icon)
	
	# 名称
	var name_label = Label.new()
	name_label.text = opt.get("name", "未知")
	name_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	name_label.add_theme_font_size_override("font_size", 16)
	name_label.add_theme_color_override("font_color", Color("#FDE68A"))
	vbox.add_child(name_label)
	
	# 等级
	var lv_label = Label.new()
	var cur = opt.get("current_level", 0)
	var nxt = opt.get("next_level", 1)
	var is_new = opt.get("is_new", false)
	if is_new:
		lv_label.text = "新获得!"
		lv_label.add_theme_color_override("font_color", Color("#4ADE80"))
	else:
		lv_label.text = "Lv%d → Lv%d" % [cur, nxt]
		lv_label.add_theme_color_override("font_color", Color("#93C5FD"))
	lv_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lv_label.add_theme_font_size_override("font_size", 12)
	vbox.add_child(lv_label)
	
	# 描述
	var desc = Label.new()
	desc.text = opt.get("desc", "")
	desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD
	desc.custom_minimum_size = Vector2(180, 40)
	desc.add_theme_font_size_override("font_size", 11)
	desc.add_theme_color_override("font_color", Color("#D1D5DB"))
	vbox.add_child(desc)
	
	# 选择按钮
	var btn = Button.new()
	btn.text = "选择"
	btn.custom_minimum_size = Vector2(120, 32)
	btn.pressed.connect(_on_card_selected.bind(opt["id"]))
	# 样式
	var btn_style = StyleBoxFlat.new()
	btn_style.bg_color = Color("#7C3AED")
	btn_style.corner_radius_top_left = 8
	btn_style.corner_radius_top_right = 8
	btn_style.corner_radius_bottom_left = 8
	btn_style.corner_radius_bottom_right = 8
	btn.add_theme_stylebox_override("normal", btn_style)
	var hover_style = btn_style.duplicate()
	hover_style.bg_color = Color("#8B5CF6")
	btn.add_theme_stylebox_override("hover", hover_style)
	vbox.add_child(btn)
	
	# 悬停放大
	card.mouse_entered.connect(func():
		var t = create_tween()
		t.set_pause_mode(Tween.TWEEN_PAUSE_PROCESS)
		t.tween_property(card, "scale", Vector2(1.05,1.05), 0.15)
	)
	card.mouse_exited.connect(func():
		var t = create_tween()
		t.set_pause_mode(Tween.TWEEN_PAUSE_PROCESS)
		t.tween_property(card, "scale", Vector2.ONE, 0.15)
	)
	
	# 键盘快捷键 1/2/3
	card.gui_input.connect(func(event):
		if event is InputEventKey and event.pressed:
			if event.keycode == KEY_1 + index:
				_on_card_selected(opt["id"])
	)
	
	return card

func _on_card_selected(upgrade_id: String):
	print("[LevelUpScreen] 选择升级: %s" % upgrade_id)
	# 应用升级
	var upgrade_sys = get_tree().get_nodes_in_group("upgrade_system")
	if upgrade_sys.size() > 0 and upgrade_sys[0].has_method("apply_upgrade"):
		upgrade_sys[0].apply_upgrade(upgrade_id)
	else:
		# 直接尝试通过节点路径
		var us = get_node_or_null("/root/UpgradeSystem")
		if us and us.has_method("apply_upgrade"):
			us.apply_upgrade(upgrade_id)
		else:
			# 备用：广播事件，WeaponManager 监听
			EventBus.upgrade_selected.emit(upgrade_id)
			EventBus.weapon_upgraded.emit(upgrade_id, 1)
			# 被动则直接给玩家
			var cfg = ConfigManager.get_weapon(upgrade_id)
			if cfg.get("type") == "passive":
				if GameManager.player and GameManager.player.stats:
					GameManager.player.stats.apply_passive(cfg.get("stat",""), cfg.get("value",0))
			else:
				var wm = GameManager.player.get_node_or_null("WeaponManager") if GameManager.player else null
				if wm and wm.has_method("upgrade_weapon"):
					var owned_lv = 1
					if us and us.has_method("get_weapon_level"):
						owned_lv = us.get_weapon_level(upgrade_id) + 1
					wm.upgrade_weapon(upgrade_id, owned_lv)
	
	AudioManager.play_sfx("pickup")
	_hide_screen()

func _hide_screen():
	var panel = $Panel
	var tween = create_tween()
	tween.set_pause_mode(Tween.TWEEN_PAUSE_PROCESS)
	tween.tween_property(panel, "scale", Vector2(0.9,0.9), 0.15)
	tween.parallel().tween_property(panel, "modulate:a", 0.0, 0.15)
	tween.tween_callback(func():
		visible = false
		_is_showing = false
		GameManager.hide_level_up()
	)

func _input(event):
	if not visible:
		return
	if event is InputEventKey and event.pressed:
		if event.keycode >= KEY_1 and event.keycode <= KEY_3:
			var idx = event.keycode - KEY_1
			if idx < current_options.size():
				_on_card_selected(current_options[idx]["id"])
				get_viewport().set_input_as_handled()
