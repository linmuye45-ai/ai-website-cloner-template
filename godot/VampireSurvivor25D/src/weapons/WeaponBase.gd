extends Node2D
## WeaponBase.gd
## 武器基类 - 所有主动武器继承此类
## 提供冷却、等级、数据驱动等通用逻辑

var weapon_id: String = ""
var weapon_config: Dictionary = {}
var current_level: int = 1
var base_cooldown: float = 1.0
var base_damage: float = 10.0
var attack_timer: float = 0.0

# 归属玩家
var owner_player: Node = null

func _ready():
	owner_player = get_parent()
	# 如果父级是 WeaponManager，则再往上找
	if owner_player and owner_player.name == "WeaponManager":
		owner_player = owner_player.get_parent()
	setup_from_config()

## 从配置初始化
func setup_from_config():
	if weapon_id == "":
		return
	weapon_config = ConfigManager.get_weapon(weapon_id)
	if weapon_config.is_empty():
		push_warning("[WeaponBase] 找不到武器配置: %s" % weapon_id)
		return
	base_damage = float(weapon_config.get("base_damage", 10))
	base_cooldown = float(weapon_config.get("base_cooldown", 1.0))
	current_level = 1
	print("[WeaponBase] %s 初始化 - 伤害:%.1f 冷却:%.2f" % [weapon_id, base_damage, base_cooldown])

func _process(delta):
	if not GameManager.is_playing():
		return
	if weapon_config.is_empty():
		return
	attack_timer -= delta
	if attack_timer <= 0:
		attack_timer = get_cooldown()
		attack()

## 获取实际冷却（受玩家攻速、等级影响）
func get_cooldown() -> float:
	var cd = base_cooldown
	# 等级降低冷却（每级 -5%）
	cd *= pow(0.95, current_level - 1)
	# 玩家攻速
	if owner_player and owner_player.stats:
		cd = owner_player.stats.get_cooldown(cd)
	return max(0.08, cd)

## 获取实际伤害（受玩家增伤、等级影响）
func get_damage() -> float:
	var dmg = base_damage
	# 等级提升伤害（每级 +15%）
	dmg *= pow(1.15, current_level - 1)
	if owner_player and owner_player.stats:
		dmg = owner_player.stats.get_damage(dmg)
	return dmg

## 攻击（子类重写）
func attack():
	pass

## 升级
func level_up(new_level: int):
	current_level = new_level
	print("[WeaponBase] %s 升级到 Lv%d" % [weapon_id, current_level])
	# 可触发视觉反馈
	EventBus.sfx_requested.emit("levelup", global_position)

## 获取武器描述（用于 UI）
func get_description() -> String:
	return weapon_config.get("desc", "")

## 工具：寻找最近敌人
func find_nearest_enemy(max_range: float = 600) -> Node:
	if not owner_player:
		return null
	var enemies = get_tree().get_nodes_in_group("enemy")
	var nearest = null
	var best_dist = max_range
	for e in enemies:
		if not is_instance_valid(e) or not e.visible: continue
		if e.has_method("is_dead") and e.is_dead(): continue
		var d = owner_player.global_position.distance_to(e.global_position)
		if d < best_dist:
			best_dist = d
			nearest = e
	return nearest

func find_nearest_enemies(count: int, max_range: float = 700) -> Array:
	if not owner_player:
		return []
	var enemies = get_tree().get_nodes_in_group("enemy")
	var valid: Array = []
	for e in enemies:
		if not is_instance_valid(e) or not e.visible: continue
		if e.has_method("is_dead") and e.is_dead(): continue
		var d = owner_player.global_position.distance_to(e.global_position)
		if d <= max_range:
			valid.append({"enemy": e, "dist": d})
	valid.sort_custom(func(a,b): return a["dist"] < b["dist"])
	var result: Array = []
	for i in range(min(count, valid.size())):
		result.append(valid[i]["enemy"])
	return result

## 创建抛射物（通过对象池或直接实例化）
func spawn_projectile(scene_path: String, pos: Vector2, dir: Vector2) -> Node:
	var proj = null
	# 尝试从池获取
	if PoolManager.pools.has("projectile"):
		proj = PoolManager.get_object("projectile")
		if proj:
			proj.global_position = pos
			# 重置抛射物数据由子类设置
	else:
		# 备用：直接创建 Area2D
		proj = Area2D.new()
		proj.name = "Projectile"
		get_tree().current_scene.add_child(proj)
	return proj

## 造成范围伤害（圆形）
func deal_area_damage(center: Vector2, radius: float, damage: float, color: Color = Color.WHITE):
	var enemies = get_tree().get_nodes_in_group("enemy")
	for e in enemies:
		if not is_instance_valid(e): continue
		if e.has_method("is_dead") and e.is_dead(): continue
		if center.distance_squared_to(e.global_position) <= radius * radius:
			if e.has_method("take_damage"):
				var is_crit = randf() < 0.08
				var final_dmg = damage * (1.8 if is_crit else 1.0)
				e.take_damage(final_dmg)
				EventBus.damage_dealt.emit(e, final_dmg, is_crit, e.global_position)
				EventBus.damage_number_requested.emit(e.global_position, final_dmg, is_crit, color)
