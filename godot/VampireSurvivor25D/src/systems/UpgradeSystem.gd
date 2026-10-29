extends Node
## UpgradeSystem.gd
## 升级系统 - 3选1随机、进化检测、叠加逻辑
## 数据驱动：所有选项来自 ConfigManager

# 玩家已拥有的武器/被动 等级记录
var owned: Dictionary = {}  # id -> level
# 武器进化已触发记录
var evolved: Dictionary = {}  # old_id -> new_id

# 升级选项池缓存
var _all_upgrades: Array = []

func _ready():
	EventBus.player_level_up.connect(_on_player_level_up)
	# 初始化拥有：默认给一个魔法飞弹
	owned["magic_missile"] = 1
	print("[UpgradeSystem] 升级系统就绪，已拥有: %s" % str(owned.keys()))

## 玩家升级时触发，生成3选1
func _on_player_level_up(_new_level: int):
	var options = generate_options(3)
	if options.is_empty():
		print("[UpgradeSystem] 无可用升级选项")
		EventBus.upgrade_options_ready.emit([])
		return
	EventBus.upgrade_options_ready.emit(options)
	print("[UpgradeSystem] 生成 %d 个升级选项" % options.size())

## 生成随机选项
func generate_options(count: int = 3) -> Array:
	var pool = _build_available_pool()
	if pool.is_empty():
		return []
	pool.shuffle()
	var result = []
	# 去重、过滤
	for item in pool:
		if result.size() >= count:
			break
		# 检查是否已在结果中
		var duplicate = false
		for r in result:
			if r["id"] == item["id"]:
				duplicate = true
				break
		if not duplicate:
			result.append(item)
	# 如果不足3个，用被动补齐
	while result.size() < count and pool.size() > result.size():
		for item in pool:
			var exists = false
			for r in result:
				if r["id"] == item["id"]:
					exists = true
					break
			if not exists:
				result.append(item)
				break
			if result.size() >= count:
				break
		break
	return result

## 构建可用池：已解锁 + 未满级 + 满足前置
func _build_available_pool() -> Array:
	var pool: Array = []
	# 已拥有的可升级
	for owned_id in owned.keys():
		var cur_lv = owned[owned_id]
		var cfg = ConfigManager.get_weapon(owned_id)
		if cfg.is_empty():
			continue
		var max_lv = cfg.get("max_level", 5)
		if cur_lv < max_lv:
			# 生成升级选项（下一级预览）
			var opt = cfg.duplicate(true)
			opt["current_level"] = cur_lv
			opt["next_level"] = cur_lv + 1
			opt["is_new"] = false
			pool.append(opt)
	
	# 未拥有的新武器/被动（从解锁列表中选）
	for id in SaveManager.save_data["unlocked_weapons"]:
		if owned.has(id):
			continue
		var cfg = ConfigManager.get_weapon(id)
		if cfg.is_empty():
			continue
		var opt = cfg.duplicate(true)
		opt["current_level"] = 0
		opt["next_level"] = 1
		opt["is_new"] = true
		pool.append(opt)
	
	# 被动池（始终可用）
	var passive_ids = ["speed","attack_speed","max_hp","pickup_range","damage_up"]
	for pid in passive_ids:
		if owned.has(pid):
			var cur = owned[pid]
			var cfg = ConfigManager.get_weapon(pid)
			if cur >= cfg.get("max_level", 5):
				continue
			# 已在前面加入，这里跳过（避免重复）
			continue
		else:
			var cfg = ConfigManager.get_weapon(pid)
			var opt = cfg.duplicate(true)
			opt["current_level"] = 0
			opt["next_level"] = 1
			opt["is_new"] = true
			pool.append(opt)
	
	# 过滤满级
	pool = pool.filter(func(x): return x["next_level"] <= x.get("max_level", 99))
	return pool

## 玩家选择某升级
func apply_upgrade(upgrade_id: String):
	var cfg = ConfigManager.get_weapon(upgrade_id)
	if cfg.is_empty():
		push_warning("[UpgradeSystem] 未知升级: %s" % upgrade_id)
		return
	
	var prev_lv = owned.get(upgrade_id, 0)
	var new_lv = prev_lv + 1
	owned[upgrade_id] = new_lv
	
	print("[UpgradeSystem] 应用升级 %s Lv%d -> Lv%d" % [upgrade_id, prev_lv, new_lv])
	EventBus.upgrade_selected.emit(upgrade_id)
	EventBus.weapon_upgraded.emit(upgrade_id, new_lv)
	
	# 检查进化
	_check_evolution(upgrade_id)
	
	# 应用被动数值
	if cfg.get("type") == "passive":
		var stat = cfg.get("stat", "")
		var val = cfg.get("value", 0)
		if GameManager.player and GameManager.player.stats:
			GameManager.player.stats.apply_passive(stat, val)
		# 额外：如果玩家有对应方法也调用
		AudioManager.play_sfx("pickup")
	else:
		# 主动武器：通知 WeaponManager
		var wm = null
		if GameManager.player:
			wm = GameManager.player.get_node_or_null("WeaponManager")
		if wm and wm.has_method("upgrade_weapon"):
			wm.upgrade_weapon(upgrade_id, new_lv)
		AudioManager.play_sfx("levelup")

## 检查进化条件（如 魔法飞弹Lv5 + 速度Lv3 => mega_missile）
func _check_evolution(changed_id: String):
	# 遍历所有武器的进化需求
	for wid in ConfigManager.weapons.keys():
		var cfg = ConfigManager.weapons[wid]
		if not cfg.has("evolution"):
			continue
		if evolved.has(wid):
			continue
		# 检查是否已拥有且满足等级
		var evo_id = cfg["evolution"]
		var evo_req = cfg.get("evolution_req", [])
		if evo_req.is_empty():
			continue
		var all_met = true
		for req in evo_req:
			# req 格式 "id_lvN" 例如 "magic_missile_lv5"
			var parts = req.split("_lv")
			if parts.size() == 2:
				var rid = parts[0]
				var need_lv = int(parts[1])
				var cur_lv = owned.get(rid, 0)
				if cur_lv < need_lv:
					all_met = false
					break
			else:
				# 简单形式
				if not owned.has(req):
					all_met = false
					break
		if all_met:
			# 触发进化
			_trigger_evolution(wid, evo_id)

func _trigger_evolution(from_id: String, to_id: String):
	print("[UpgradeSystem] 进化触发! %s -> %s" % [from_id, to_id])
	evolved[from_id] = to_id
	EventBus.weapon_evolved.emit(from_id, to_id)
	EventBus.evolution_triggered.emit(from_id, to_id)
	# 替换武器
	var wm = null
	if GameManager.player:
		wm = GameManager.player.get_node_or_null("WeaponManager")
	if wm and wm.has_method("evolve_weapon"):
		wm.evolve_weapon(from_id, to_id)
	# 特效
	EventBus.screen_shake_requested.emit(10.0, 0.6)
	AudioManager.play_sfx("levelup")

## 获取当前拥有列表（用于 HUD 显示）
func get_owned_list() -> Dictionary:
	return owned.duplicate()

func get_weapon_level(id: String) -> int:
	return owned.get(id, 0)

## 调试：直接满级
func max_all():
	for id in ConfigManager.weapons.keys():
		owned[id] = ConfigManager.weapons[id].get("max_level", 5)
	print("[UpgradeSystem] 已满级所有武器 (Debug)")

## 重置（新局）
func reset():
	owned.clear()
	evolved.clear()
	owned["magic_missile"] = 1
	print("[UpgradeSystem] 升级系统重置")
