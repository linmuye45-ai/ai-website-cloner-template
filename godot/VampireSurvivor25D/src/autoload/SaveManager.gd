extends Node
## SaveManager.gd
## 存档系统 - 记录最高等级、通关次数、解锁技能、设置等
## 使用 user:// 存档，兼容多平台

const SAVE_PATH := "user://savegame.json"

# 存档数据结构
var save_data: Dictionary = {
	"highest_level": 1,
	"total_kills": 0,
	"play_count": 0,
	"victory_count": 0,
	"total_playtime": 0.0,
	"unlocked_weapons": ["magic_missile", "holy_ring"],  # 初始解锁
	"best_time": 0.0,
	"settings": {
		"master_volume": 0.8,
		"bgm_volume": 0.7,
		"sfx_volume": 0.8,
		"screen_shake": true,
		"show_damage_numbers": true,
		"vsync": true,
	},
	"achievements": {}
}

func _ready():
	load_game()

## 保存到磁盘
func save_game():
	var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		push_error("[SaveManager] 无法写入存档: %s" % SAVE_PATH)
		return
	var json_str = JSON.stringify(save_data, "\t")
	file.store_string(json_str)
	print("[SaveManager] 存档已保存")

## 读取存档
func load_game():
	if not FileAccess.file_exists(SAVE_PATH):
		print("[SaveManager] 无存档，使用默认数据")
		return
	var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		push_warning("[SaveManager] 无法读取存档")
		return
	var text = file.get_as_text()
	var json = JSON.new()
	if json.parse(text) != OK:
		push_error("[SaveManager] 存档解析失败")
		return
	var loaded = json.data
	# 合并，防止新字段缺失
	for k in loaded.keys():
		save_data[k] = loaded[k]
	print("[SaveManager] 存档已加载 - 最高等级:%d 通关:%d" % [save_data["highest_level"], save_data["victory_count"]])

## 结算时调用
func record_game_result(level: int, kills: int, survived_time: float, is_victory: bool):
	save_data["play_count"] += 1
	save_data["total_kills"] += kills
	save_data["total_playtime"] += survived_time
	if level > save_data["highest_level"]:
		save_data["highest_level"] = level
	if survived_time > save_data["best_time"]:
		save_data["best_time"] = survived_time
	if is_victory:
		save_data["victory_count"] += 1
	# 解锁判定：等级达到 5 解锁闪电，10 解锁火焰，15 解锁护盾
	if level >= 5 and not "lightning_chain" in save_data["unlocked_weapons"]:
		save_data["unlocked_weapons"].append("lightning_chain")
		print("[SaveManager] 解锁新武器: 闪电链")
	if level >= 10 and not "flame_zone" in save_data["unlocked_weapons"]:
		save_data["unlocked_weapons"].append("flame_zone")
		print("[SaveManager] 解锁新武器: 火焰区域")
	if level >= 15 and not "shield" in save_data["unlocked_weapons"]:
		save_data["unlocked_weapons"].append("shield")
		print("[SaveManager] 解锁新武器: 护盾反弹")
	save_game()

## 设置存取
func get_setting(key: String):
	return save_data["settings"].get(key, null)

func set_setting(key: String, value):
	save_data["settings"][key] = value
	save_game()
	EventBus.settings_changed.emit(key, value)

func is_weapon_unlocked(id: String) -> bool:
	# 被动技能默认全解锁
	var w = ConfigManager.weapons.get(id, {})
	if w.get("type", "") == "passive":
		return true
	return id in save_data["unlocked_weapons"]

func unlock_all_for_debug():
	for id in ConfigManager.weapons.keys():
		if not id in save_data["unlocked_weapons"]:
			save_data["unlocked_weapons"].append(id)
	save_game()
	print("[SaveManager] 已解锁全部武器 (Debug)")
