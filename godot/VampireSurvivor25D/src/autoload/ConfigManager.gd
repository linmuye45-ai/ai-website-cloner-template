extends Node
## ConfigManager.gd
## 配置管理器 - 数据驱动核心，所有敌人、武器、掉落、难度曲线均由 JSON 配置

# 配置数据缓存
var enemies: Dictionary = {}        # 敌人配置表 id -> data
var weapons: Dictionary = {}        # 武器配置表 id -> data
var upgrades: Dictionary = {}       # 升级选项表
var waves: Array = []               # 波次/阶段事件表
var difficulty: Dictionary = {}     # 难度曲线
var drop_table: Dictionary = {}     # 掉落表

# 是否已加载完成
var is_loaded: bool = false

func _ready():
	load_all_configs()

## 加载全部配置
func load_all_configs():
	print("[ConfigManager] 开始加载配置...")
	_load_json("res://config/enemies.json", "_on_enemies_loaded")
	_load_json("res://config/weapons.json", "_on_weapons_loaded")
	_load_json("res://config/upgrades.json", "_on_upgrades_loaded")
	_load_json("res://config/waves.json", "_on_waves_loaded")
	_load_json("res://config/difficulty.json", "_on_difficulty_loaded")
	# 如果某个文件缺失，使用内置默认配置
	_ensure_defaults()

func _load_json(path: String, callback: String):
	if not FileAccess.file_exists(path):
		print("[ConfigManager] 配置文件不存在，使用默认: %s" % path)
		return
	var file = FileAccess.open(path, FileAccess.READ)
	if file == null:
		push_warning("[ConfigManager] 无法打开: %s" % path)
		return
	var text = file.get_as_text()
	var json = JSON.new()
	var err = json.parse(text)
	if err != OK:
		push_error("[ConfigManager] JSON解析失败 %s: %s" % [path, json.get_error_message()])
		return
	var data = json.data
	call(callback, data)

func _on_enemies_loaded(data):
	if data is Array:
		for e in data:
			enemies[e["id"]] = e
	elif data is Dictionary:
		if data.has("enemies"):
			for e in data["enemies"]:
				enemies[e["id"]] = e
		else:
			enemies = data
	print("[ConfigManager] 敌人配置: %d 条" % enemies.size())

func _on_weapons_loaded(data):
	if data is Array:
		for w in data:
			weapons[w["id"]] = w
	elif data is Dictionary:
		if data.has("weapons"):
			for w in data["weapons"]:
				weapons[w["id"]] = w
		else:
			weapons = data
	print("[ConfigManager] 武器配置: %d 条" % weapons.size())

func _on_upgrades_loaded(data):
	if data is Array:
		for u in data:
			upgrades[u["id"]] = u
	elif data is Dictionary:
		if data.has("upgrades"):
			for u in data["upgrades"]:
				upgrades[u["id"]] = u
		else:
			upgrades = data
	print("[ConfigManager] 升级配置: %d 条" % upgrades.size())

func _on_waves_loaded(data):
	if data is Array:
		waves = data
	elif data is Dictionary and data.has("waves"):
		waves = data["waves"]
	print("[ConfigManager] 波次配置: %d 条" % waves.size())

func _on_difficulty_loaded(data):
	if data is Dictionary:
		difficulty = data
	print("[ConfigManager] 难度配置已加载")

## 如果配置文件缺失，使用代码内置默认配置，保证开箱即玩
func _ensure_defaults():
	if enemies.is_empty():
		enemies = {
			"slime": {"id":"slime","name":"史莱姆","hp":20,"damage":8,"speed":45,"xp_value":5,"scale":1.0,"color":"#4ADE80","elite_chance":0.02},
			"bat": {"id":"bat","name":"蝙蝠","hp":12,"damage":6,"speed":85,"xp_value":4,"scale":0.8,"color":"#A78BFA","elite_chance":0.03},
			"skeleton": {"id":"skeleton","name":"骷髅","hp":35,"damage":12,"speed":55,"xp_value":8,"scale":1.1,"color":"#E5E7EB","elite_chance":0.025},
			"golem": {"id":"golem","name":"石像鬼","hp":80,"damage":20,"speed":30,"xp_value":15,"scale":1.4,"color":"#9CA3AF","elite_chance":0.05},
			"elite_slime": {"id":"elite_slime","name":"精英史莱姆","hp":120,"damage":18,"speed":50,"xp_value":25,"scale":1.6,"color":"#F59E0B","elite_chance":0.0},
			"boss_vampire": {"id":"boss_vampire","name":"吸血鬼领主","hp":800,"damage":30,"speed":60,"xp_value":100,"scale":2.2,"color":"#DC2626","elite_chance":0.0},
		}
	if weapons.is_empty():
		weapons = {
			"magic_missile": {"id":"magic_missile","name":"魔法飞弹","desc":"向最近敌人发射追踪飞弹","type":"active","base_damage":12,"base_cooldown":0.6,"projectile_speed":500,"count":1,"max_level":8,"evolution":"mega_missile","evolution_req":["magic_missile_lv5","speed_lv3"]},
			"holy_ring": {"id":"holy_ring","name":"圣环","desc":"环绕自身的旋转圣光","type":"active","base_damage":14,"base_cooldown":0.4,"count":2,"radius":90,"max_level":8,"evolution":"holy_nova"},
			"lightning_chain": {"id":"lightning_chain","name":"闪电链","desc":"在敌人间跳跃的闪电","type":"active","base_damage":18,"base_cooldown":1.2,"chain_count":3,"chain_range":180,"max_level":6,"evolution":"thunder_storm"},
			"flame_zone": {"id":"flame_zone","name":"火焰区域","desc":"在地面生成持续灼烧区域","type":"active","base_damage":8,"base_cooldown":2.0,"duration":3.0,"radius":110,"max_level":6},
			"shield": {"id":"shield","name":"护盾反弹","desc":"短暂无敌并反弹近身敌人","type":"active","base_damage":20,"base_cooldown":5.0,"duration":1.2,"radius":85,"max_level":6},
			# 被动
			"speed": {"id":"speed","name":"疾风之靴","desc":"+12%移动速度","type":"passive","stat":"move_speed","value":0.12,"max_level":5},
			"attack_speed": {"id":"attack_speed","name":"急速施法","desc":"-10%武器冷却","type":"passive","stat":"attack_speed","value":0.10,"max_level":5},
			"max_hp": {"id":"max_hp","name":"生命精华","desc":"+20最大生命","type":"passive","stat":"max_hp","value":20,"max_level":5},
			"pickup_range": {"id":"pickup_range","name":"磁力光环","desc":"+25%拾取范围","type":"passive","stat":"pickup_range","value":0.25,"max_level":5},
			"damage_up": {"id":"damage_up","name":"毁灭之力","desc":"+15%伤害","type":"passive","stat":"damage","value":0.15,"max_level":5},
			# 进化形态
			"mega_missile": {"id":"mega_missile","name":"歼灭飞弹","desc":"超大范围爆炸飞弹","type":"evolved","base_damage":35,"base_cooldown":0.5,"projectile_speed":600,"count":3},
			"holy_nova": {"id":"holy_nova","name":"圣光新星","desc":"全屏圣光爆发","type":"evolved","base_damage":40,"base_cooldown":1.0,"radius":220},
			"thunder_storm": {"id":"thunder_storm","name":"雷暴","desc":"召唤追踪落雷","type":"evolved","base_damage":50,"base_cooldown":0.8,"chain_count":6},
		}
	if upgrades.is_empty():
		# 升级选项就是所有武器的集合
		upgrades = weapons.duplicate()
	if waves.is_empty():
		waves = [
			{"time":0,"stage":1,"name":"苏醒","bg_color":"#0B1020","spawn_rate":0.9,"enemy_types":["slime","bat"],"elite":false,"boss":false},
			{"time":60,"stage":2,"name":"潮汐","bg_color":"#1A0F2B","spawn_rate":0.6,"enemy_types":["slime","bat","skeleton"],"elite":true,"boss":false},
			{"time":120,"stage":3,"name":"围猎","bg_color":"#2A0A1A","spawn_rate":0.4,"enemy_types":["bat","skeleton","golem"],"elite":true,"boss":false},
			{"time":180,"stage":4,"name":"深渊","bg_color":"#1A1F0A","spawn_rate":0.3,"enemy_types":["skeleton","golem"],"elite":true,"boss":false},
			{"time":240,"stage":5,"name":"领主降临","bg_color":"#3A0A0A","spawn_rate":0.35,"enemy_types":["golem"],"elite":true,"boss":true},
			{"time":300,"stage":6,"name":"永夜","bg_color":"#000000","spawn_rate":0.2,"enemy_types":["slime","bat","skeleton","golem"],"elite":true,"boss":true},
		]
	if difficulty.is_empty():
		difficulty = {
			"spawn_rate_curve": [[0,1.0],[60,0.75],[120,0.55],[180,0.40],[240,0.30],[300,0.25]],
			"hp_multiplier_curve": [[0,1.0],[60,1.2],[120,1.6],[180,2.0],[240,2.8],[300,3.5]],
			"speed_multiplier_curve": [[0,1.0],[120,1.1],[240,1.2]],
			"max_enemies": 350,
			"enemies_per_spawn": [[0,1],[30,2],[90,3],[150,4],[210,5]],
		}
	is_loaded = true

## 获取敌人配置，带容错
func get_enemy(id: String) -> Dictionary:
	return enemies.get(id, enemies.get("slime", {}))

func get_weapon(id: String) -> Dictionary:
	return weapons.get(id, {})

func get_upgrade_pool() -> Array:
	var pool: Array = []
	for key in upgrades.keys():
		pool.append(upgrades[key])
	return pool

## 根据时间获取当前波次
func get_current_wave(time: float) -> Dictionary:
	var cur = waves[0] if waves.size() > 0 else {}
	for w in waves:
		if time >= w["time"]:
			cur = w
	return cur

## 插值获取难度倍率
func get_difficulty_multiplier(curve_name: String, time: float) -> float:
	var curve = difficulty.get(curve_name, [])
	if curve.is_empty():
		return 1.0
	var result = curve[0][1] as float
	for i in range(curve.size()):
		var t = curve[i][0] as float
		var v = curve[i][1] as float
		if time >= t:
			result = v
		else:
			# 线性插值
			if i > 0:
				var pt = curve[i-1][0] as float
				var pv = curve[i-1][1] as float
				var f = (time - pt) / (t - pt)
				result = lerp(pv, v, f)
			break
	return result

func get_enemies_per_spawn(time: float) -> int:
	var curve = difficulty.get("enemies_per_spawn", [[0,1]])
	var result = 1
	for p in curve:
		if time >= p[0]:
			result = int(p[1])
	return result

func get_max_enemies() -> int:
	return int(difficulty.get("max_enemies", 350))
