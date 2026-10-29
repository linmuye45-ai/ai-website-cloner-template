extends RefCounted
class_name PlayerStats
## PlayerStats.gd
## 玩家属性数据 - 支持被动叠加、武器进化等数值系统

# 基础属性
var max_hp: float = 100.0
var hp: float = 100.0
var move_speed: float = 220.0
var damage_mult: float = 1.0
var attack_speed_mult: float = 1.0   # 冷却倍率，越小越快
var pickup_range: float = 120.0
var armor: float = 0.0
var crit_chance: float = 0.05
var crit_mult: float = 1.8
var exp_mult: float = 1.0

# 经验/等级
var level: int = 1
var exp: int = 0
var exp_to_next: int = 20
var total_exp_collected: int = 0

# 受击无敌相关
var invincible_time: float = 0.4
var _invincible_remaining: float = 0.0

# 信号（通过 EventBus 转发，这里仅内部）
signal hp_changed(new_hp: float, max_hp: float)
signal level_up(new_level: int)
signal exp_changed(current: int, required: int)

func _init():
	hp = max_hp
	_recalc_exp_curve()

func _recalc_exp_curve():
	# 经验曲线：20 + 10*(level-1) + 2*(level-1)^2
	exp_to_next = 20 + 10 * (level - 1) + 2 * (level - 1) * (level - 1)
	# 后期平缓
	if level > 20:
		exp_to_next = int(exp_to_next * 0.85)

## 受到伤害，返回是否死亡
func take_damage(amount: float) -> bool:
	if _invincible_remaining > 0:
		return false
	# 护甲减伤
	var final_damage = max(1.0, amount - armor)
	hp -= final_damage
	_invincible_remaining = invincible_time
	hp_changed.emit(hp, max_hp)
	EventBus.player_damaged.emit(final_damage, hp)
	if hp <= 0:
		hp = 0
		return true
	return false

func heal(amount: float):
	hp = min(max_hp, hp + amount)
	hp_changed.emit(hp, max_hp)
	EventBus.player_healed.emit(amount, hp)

func update(delta: float):
	if _invincible_remaining > 0:
		_invincible_remaining -= delta

func is_invincible() -> bool:
	return _invincible_remaining > 0

## 获得经验，返回是否升级（可能多级）
func add_exp(amount: int) -> bool:
	var actual = int(amount * exp_mult)
	exp += actual
	total_exp_collected += actual
	exp_changed.emit(exp, exp_to_next)
	EventBus.exp_gained.emit(actual, exp)
	var leveled = false
	while exp >= exp_to_next:
		exp -= exp_to_next
		level += 1
		_recalc_exp_curve()
		leveled = true
		level_up.emit(level)
		EventBus.player_level_up.emit(level)
		exp_changed.emit(exp, exp_to_next)
	return leveled

## 被动升级应用
func apply_passive(stat: String, value: float):
	match stat:
		"move_speed":
			move_speed *= (1.0 + value)
		"attack_speed":
			# 攻击速度提升 = 冷却降低
			attack_speed_mult *= (1.0 - value)
			attack_speed_mult = max(0.3, attack_speed_mult)
		"max_hp":
			max_hp += value
			hp += value  # 同时回满新增部分
			hp_changed.emit(hp, max_hp)
		"pickup_range":
			pickup_range *= (1.0 + value)
		"damage":
			damage_mult *= (1.0 + value)
		"armor":
			armor += value
		"crit_chance":
			crit_chance += value
		"exp_gain":
			exp_mult += value

## 获取攻击冷却（受攻速影响）
func get_cooldown(base: float) -> float:
	return base * attack_speed_mult

func get_damage(base: float) -> float:
	return base * damage_mult

## 重置（重开一局）
func reset():
	max_hp = 100.0
	hp = max_hp
	move_speed = 220.0
	damage_mult = 1.0
	attack_speed_mult = 1.0
	pickup_range = 120.0
	armor = 0.0
	crit_chance = 0.05
	level = 1
	exp = 0
	total_exp_collected = 0
	_recalc_exp_curve()
	hp_changed.emit(hp, max_hp)
	exp_changed.emit(exp, exp_to_next)
