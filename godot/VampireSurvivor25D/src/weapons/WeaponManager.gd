extends Node
## WeaponManager.gd
## 武器管理器 - 挂在 Player 下，管理所有主动武器的生命周期、升级、进化
## 数据驱动：根据 ConfigManager 配置动态挂载武器脚本

# 已装备武器 id -> 武器节点
var equipped: Dictionary = {}

# 武器脚本映射
const WEAPON_SCRIPTS := {
	"magic_missile": "res://src/weapons/MagicMissile.gd",
	"mega_missile": "res://src/weapons/MagicMissile.gd",
	"holy_ring": "res://src/weapons/HolyRing.gd",
	"holy_nova": "res://src/weapons/HolyRing.gd",
	"lightning_chain": "res://src/weapons/LightningChain.gd",
	"thunder_storm": "res://src/weapons/LightningChain.gd",
	"flame_zone": "res://src/weapons/FlameZone.gd",
	"shield": "res://src/weapons/ShieldReflect.gd",
}

func _ready():
	# 监听升级系统（若没有 UpgradeSystem 单例，则直接通过 EventBus）
	EventBus.weapon_upgraded.connect(_on_weapon_upgraded)
	EventBus.weapon_evolved.connect(_on_weapon_evolved)
	# 初始武器：魔法飞弹
	await get_tree().process_frame
	equip_weapon("magic_missile")
	print("[WeaponManager] 初始化完成")

## 装备武器（新建节点）
func equip_weapon(weapon_id: String):
	if equipped.has(weapon_id):
		print("[WeaponManager] 已装备 %s" % weapon_id)
		return
	var script_path = WEAPON_SCRIPTS.get(weapon_id, "")
	var weapon_node: Node
	if script_path != "" and ResourceLoader.exists(script_path):
		weapon_node = Node2D.new()
		weapon_node.set_script(load(script_path))
		weapon_node.name = weapon_id
		# 设置ID后ready会自动加载配置
		weapon_node.set("weapon_id", weapon_id)
		add_child(weapon_node)
	else:
		# 占位：通用武器
		weapon_node = Node2D.new()
		weapon_node.set_script(load("res://src/weapons/WeaponBase.gd"))
		weapon_node.name = weapon_id
		weapon_node.set("weapon_id", weapon_id)
		add_child(weapon_node)
	equipped[weapon_id] = weapon_node
	print("[WeaponManager] 装备武器: %s" % weapon_id)
	EventBus.sfx_requested.emit("pickup", global_position)

## 升级武器
func upgrade_weapon(weapon_id: String, new_level: int):
	if not equipped.has(weapon_id):
		# 未装备 -> 装备
		equip_weapon(weapon_id)
		# 如果是1级刚装备，不需要再升级
		if new_level == 1:
			return
	# 已装备 -> 升级
	var node = equipped.get(weapon_id)
	if node and node.has_method("level_up"):
		node.level_up(new_level)
		print("[WeaponManager] 武器 %s 升至 Lv%d" % [weapon_id, new_level])

## 进化武器（替换ID）
func evolve_weapon(from_id: String, to_id: String):
	var old_node = equipped.get(from_id)
	if old_node == null:
		# 若未装备旧武器，直接装备新
		equip_weapon(to_id)
		return
	# 保留等级
	var old_level = 1
	if old_node.has_method("get") and "current_level" in old_node:
		old_level = old_node.current_level
	# 移除旧
	equipped.erase(from_id)
	old_node.queue_free()
	await get_tree().process_frame
	# 装备新并设置等级
	equip_weapon(to_id)
	var new_node = equipped.get(to_id)
	if new_node:
		if new_node.has_method("level_up"):
			new_node.level_up(old_level)
		# 特殊进化方法
		if new_node.has_method("evolve_to_mega"):
			new_node.evolve_to_mega()
		elif new_node.has_method("evolve_to_nova"):
			new_node.evolve_to_nova()
		elif new_node.has_method("evolve_to_storm"):
			new_node.evolve_to_storm()
	print("[WeaponManager] 进化完成 %s -> %s" % [from_id, to_id])

func _on_weapon_upgraded(weapon_id: String, new_level: int):
	# 若是被动则不处理（被动由 PlayerStats 处理）
	var cfg = ConfigManager.get_weapon(weapon_id)
	if cfg.get("type") == "passive":
		return
	# 已在 UpgradeSystem.apply_upgrade 中调用过 upgrade_weapon，这里只做容错
	if not equipped.has(weapon_id):
		equip_weapon(weapon_id)

func _on_weapon_evolved(from_id: String, to_id: String):
	# UpgradeSystem 已调用 evolve_weapon，这里备份
	pass

## 获取所有武器等级（供 HUD 显示）
func get_equipped_info() -> Array:
	var arr: Array = []
	for id in equipped.keys():
		var node = equipped[id]
		var lv = 1
		if node and "current_level" in node:
			lv = node.current_level
		arr.append({"id": id, "level": lv, "name": ConfigManager.get_weapon(id).get("name", id)})
	return arr

## 供护盾检测
func has_shield_protection() -> bool:
	var shield = equipped.get("shield")
	if shield and shield.has_method("is_protecting"):
		return shield.is_protecting()
	return false
