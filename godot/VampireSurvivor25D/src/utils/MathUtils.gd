extends RefCounted
class_name MathUtils
## MathUtils.gd
## 数学工具集 - 圆形碰撞、随机点、插值等

## 圆形碰撞检测（避免逐像素碰撞）
static func circle_overlap(pos1: Vector2, r1: float, pos2: Vector2, r2: float) -> bool:
	return pos1.distance_squared_to(pos2) <= (r1 + r2) * (r1 + r2)

## 在圆环内随机点（用于刷怪）
static func random_point_in_ring(center: Vector2, min_r: float, max_r: float, rng: RandomNumberGenerator = null) -> Vector2:
	if rng == null:
		rng = RandomNumberGenerator.new()
		rng.randomize()
	var angle = rng.randf_range(0, TAU)
	var radius = rng.randf_range(min_r, max_r)
	return center + Vector2(cos(angle), sin(angle)) * radius

## 在玩家周围刷怪位置（避开屏幕内）
static func get_spawn_position(player_pos: Vector2, viewport_size: Vector2, margin: float = 100) -> Vector2:
	var rng = RandomNumberGenerator.new()
	rng.randomize()
	var max_dim = max(viewport_size.x, viewport_size.y)
	# 在屏幕外环形区域生成
	var dist = rng.randf_range(max_dim * 0.65, max_dim * 0.85)
	var angle = rng.randf()
	# 稍微偏向玩家移动方向的对侧（增加压迫感）目前随机
	return player_pos + Vector2(cos(angle * TAU), sin(angle * TAU)) * dist

## 平滑阻尼
static func smooth_damp(current: Vector2, target: Vector2, velocity: Vector2, smooth_time: float, delta: float) -> Dictionary:
	var omega = 2.0 / smooth_time
	var x = omega * delta
	var exp = 1.0 / (1.0 + x + 0.48 * x * x + 0.235 * x * x * x)
	var change = current - target
	var temp = (velocity + omega * change) * delta
	velocity = (velocity - omega * temp) * exp
	var result = target + (change + temp) * exp
	return {"position": result, "velocity": velocity}

## 获取最近敌人
static func find_nearest_enemy(from_pos: Vector2, enemies: Array, max_range: float = 9999) -> Node:
	var nearest = null
	var nearest_dist = max_range
	for e in enemies:
		if not is_instance_valid(e) or not e.visible:
			continue
		# 敌人死亡隐藏的不算
		if e.has_method("is_dead") and e.is_dead():
			continue
		var d = from_pos.distance_squared_to(e.global_position)
		if d < nearest_dist * nearest_dist:
			nearest_dist = sqrt(d)
			nearest = e
	return nearest

## 伤害计算（含暴击、增伤）
static func calculate_damage(base: float, damage_mult: float, crit_chance: float = 0.0, crit_mult: float = 2.0, rng: RandomNumberGenerator = null) -> Dictionary:
	if rng == null:
		rng = RandomNumberGenerator.new()
		rng.randomize()
	var is_crit = rng.randf() < crit_chance
	var dmg = base * damage_mult
	if is_crit:
		dmg *= crit_mult
	return {"damage": dmg, "is_crit": is_crit}
