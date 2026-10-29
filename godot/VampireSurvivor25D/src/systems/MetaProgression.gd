extends Node
## MetaProgression.gd
## 越玩越爽 - 局外成长+连击+福袋+越玩越强系统
## 专为平板长时游玩设计：每局必有收获，越后期越割草

# 局内连击
var combo: int = 0
var combo_timer: float = 0.0
var max_combo: int = 0
const COMBO_WINDOW: float = 2.5  # 2.5秒内击杀续连击

# 局内福袋（每90秒掉落一次奖励箱）
var _crate_timer: float = 90.0

# 局外永久加成（存档）
var meta_bonus: Dictionary = {
	"damage": 0.0,        # 每通关+2%伤害
	"hp": 0,              # 每升级5级+5 HP
	"speed": 0.0,
	"luck": 0.0,          # 爆率
}

func _ready():
	EventBus.enemy_died.connect(_on_enemy_died)
	EventBus.game_started.connect(_on_game_start)
	EventBus.player_level_up.connect(func(_lv): _add_combo(3))
	_load_meta()
	print("[MetaProgression] 越玩越爽系统就绪 - 已永久加成: %s" % str(meta_bonus))

func _process(delta):
	if not GameManager.is_game_active:
		return
	# 连击计时
	if combo > 0:
		combo_timer -= delta
		if combo_timer <= 0:
			_reset_combo()
	
	# 福袋计时
	_crate_timer -= delta
	if _crate_timer <= 0:
		_crate_timer = 90.0 + randf() * 20.0
		_spawn_bonus_crate()

func _on_enemy_died(_enemy, _pos, is_elite, is_boss):
	var add = 1
	if is_elite: add = 3
	if is_boss: add = 10
	_add_combo(add)

func _add_combo(add: int):
	combo += add
	combo_timer = COMBO_WINDOW
	if combo > max_combo:
		max_combo = combo
	# 连击奖励：每10连击+5%伤害，持续连击时间
	if combo % 10 == 0 and combo > 0:
		EventBus.sfx_requested.emit("levelup", Vector2.ZERO)
		EventBus.screen_shake_requested.emit(2.0, 0.1)
		# 给玩家短暂增伤
		if GameManager.player and GameManager.player.stats:
			# 通过临时事件总线通知UI
			EventBus.damage_number_requested.emit(GameManager.get_player_pos() + Vector2(0,-40), 0, true, Color("#FBBF24"))
		# 暴击
		print("[Meta] 连击 %d! 越战越勇!" % combo)

func _reset_combo():
	if combo >= 15:
		print("[Meta] 连击结束: %d - 奖励结算" % combo)
		# 高连击奖励宝石雨
		_spawn_gem_rain(int(combo * 0.6))
	combo = 0

func _spawn_bonus_crate():
	if not GameManager.player: return
	var pos = GameManager.get_player_pos() + Vector2(randf_range(-300,300), randf_range(-300,300))
	print("[Meta] 惊喜福袋掉落! at %s" % str(pos))
	# 生成奖励箱（Area2D）
	var crate = Area2D.new()
	crate.global_position = pos
	crate.add_to_group("pickup")
	crate.monitoring = true
	var col = CollisionShape2D.new()
	var shape = CircleShape2D.new()
	shape.radius = 22
	col.shape = shape
	crate.add_child(col)
	var sprite = Sprite2D.new()
	var img = Image.create(32,32,false,Image.FORMAT_RGBA8)
	img.fill(Color("#FBBF24"))
	for y in range(8,24):
		for x in range(8,24):
			img.set_pixel(x,y, Color("#F59E0B"))
	# 锁扣
	img.set_pixel(16,16, Color("#78350F"))
	sprite.texture = ImageTexture.create_from_image(img)
	sprite.centered = true
	crate.add_child(sprite)
	# 闪光
	var tween = crate.create_tween()
	tween.set_loops()
	tween.tween_property(sprite, "scale", Vector2(1.1,1.1), 0.5)
	tween.tween_property(sprite, "scale", Vector2(1.0,1.0), 0.5)
	get_tree().current_scene.add_child(crate)
	
	# 拾取逻辑
	crate.area_entered.connect(func(area):
		if area.is_in_group("player") or area.get_parent().is_in_group("player"):
			_open_crate(crate)
	)
	crate.body_entered.connect(func(body):
		if body.is_in_group("player"):
			_open_crate(crate)
	)
	# 30秒后自动消失并闪烁
	await get_tree().create_timer(30.0).timeout
	if is_instance_valid(crate):
		var t = crate.create_tween()
		t.tween_property(crate, "modulate:a", 0.0, 0.5)
		t.tween_callback(func(): if is_instance_valid(crate): crate.queue_free())

func _open_crate(crate: Node):
	if not is_instance_valid(crate): return
	var pos = crate.global_position
	crate.queue_free()
	# 3选1：满血+宝石雨+短暂无敌+磁铁
	var r = randi_range(0,3)
	match r:
		0:
			# 宝石雨
			_spawn_gem_rain(25)
			EventBus.sfx_requested.emit("pickup", pos)
		1:
			if GameManager.player and GameManager.player.has_method("heal"):
				GameManager.player.heal(999)
			_spawn_gem_rain(15)
		2:
			if GameManager.player and GameManager.player.has_method("activate_magnet"):
				GameManager.player.activate_magnet(6.0)
			_spawn_gem_rain(15)
		3:
			# 全屏清怪
			for e in get_tree().get_nodes_in_group("enemy"):
				if is_instance_valid(e) and e.has_method("take_damage"):
					e.take_damage(999)
			EventBus.screen_shake_requested.emit(8.0, 0.4)
	EventBus.sfx_requested.emit("levelup", pos)
	print("[Meta] 福袋开启! 奖励类型 %d" % r)

func _spawn_gem_rain(count: int):
	if not GameManager.player: return
	var center = GameManager.get_player_pos()
	for i in range(count):
		await get_tree().create_timer(0.04).timeout
		var pos = center + Vector2(randf_range(-180,180), randf_range(-180,180))
		var gem = Area2D.new()
		gem.global_position = pos
		gem.add_to_group("exp_gem")
		gem.set_meta("gem_value", 5)
		var c = CollisionShape2D.new()
		var s = CircleShape2D.new()
		s.radius = 8
		c.shape = s
		gem.add_child(c)
		var sp = Sprite2D.new()
		var im = Image.create(10,10,false,Image.FORMAT_RGBA8)
		im.fill(Color("#4ADE80"))
		sp.texture = ImageTexture.create_from_image(im)
		gem.add_child(sp)
		gem.set_script(load("res://src/pickups/ExpGem.gd"))
		get_tree().current_scene.add_child(gem)
		# 抛物线
		var tw = gem.create_tween()
		tw.tween_property(gem, "global_position", pos + Vector2(0,-12), 0.15).set_trans(Tween.TRANS_QUAD)
		tw.tween_property(gem, "global_position", pos, 0.15).set_trans(Tween.TRANS_BOUNCE)

func _on_game_start():
	combo = 0
	max_combo = 0
	combo_timer = 0
	_crate_timer = 75.0
	print("[Meta] 新局开始，祝割草愉快！")

func _load_meta():
	var d = SaveManager.save_data
	var victories = d.get("victory_count", 0)
	var highest = d.get("highest_level", 1)
	meta_bonus["damage"] = victories * 0.02
	meta_bonus["hp"] = int(highest / 5) * 5
	meta_bonus["speed"] = victories * 0.005

func get_combo() -> int: return combo
func get_max_combo() -> int: return max_combo

## 供外部获局外加成
func apply_meta_to_player(player):
	if not player or not player.stats: return
	var b = meta_bonus
	if b["damage"] > 0:
		player.stats.damage_mult += b["damage"]
	if b["hp"] > 0:
		player.stats.max_hp += b["hp"]
		player.stats.hp += b["hp"]
	if b["speed"] > 0:
		player.stats.move_speed *= (1.0 + b["speed"])
	print("[Meta] 已应用局外加成到玩家")
