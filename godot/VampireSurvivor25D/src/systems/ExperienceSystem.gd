extends Node
## ExperienceSystem.gd
## 经验系统 - 等级、经验宝石掉落倍率、磁吸逻辑
## 配合 PlayerStats 工作

# 经验宝石数值表
const GEM_VALUES := {
	"tiny": 5,
	"small": 10,
	"medium": 25,
	"large": 50,
	"epic": 100,
}

func get_gem_value(type: String) -> int:
	return GEM_VALUES.get(type, 5)

## 根据敌人强度决定掉落宝石类型
func get_gem_type_for_enemy(is_elite: bool, is_boss: bool, hp: float) -> String:
	if is_boss:
		return "epic"
	if is_elite:
		return "large"
	if hp > 60:
		return "medium"
	if hp > 30:
		return "small"
	return "tiny"

## 计算升级所需经验（与 PlayerStats 保持一致）
static func exp_needed(level: int) -> int:
	return 20 + 10 * (level - 1) + 2 * (level - 1) * (level - 1)
