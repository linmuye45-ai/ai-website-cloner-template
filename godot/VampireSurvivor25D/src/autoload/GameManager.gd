extends Node
## GameManager.gd
## 全局游戏管理器 - 负责游戏状态、计时、暂停、难度调度、胜负判定

enum GameState { MENU, PLAYING, PAUSED, LEVEL_UP, GAME_OVER, VICTORY }

var current_state: GameState = GameState.MENU

# 运行时数据
var game_time: float = 0.0          # 本局已进行时间
var kill_count: int = 0
var player_level: int = 1
var is_game_active: bool = false
var current_stage: int = 1

# 玩家引用
var player: Node = null

# 计时器
var _stage_check_timer: float = 0.0

# 胜利条件：存活 360 秒（6分钟）或击败最终 Boss
const VICTORY_TIME := 360.0

func _ready():
	process_mode = Node.PROCESS_MODE_ALWAYS  # 暂停时仍需处理
	EventBus.enemy_died.connect(_on_enemy_died)
	EventBus.player_died.connect(_on_player_died)
	EventBus.player_level_up.connect(_on_player_level_up)
	EventBus.game_started.connect(start_game)
	print("[GameManager] 游戏管理器就绪")

func _process(delta):
	if not is_game_active:
		return
	if current_state == GameState.PLAYING:
		game_time += delta
		_check_stage_change()
		_check_victory()
		# 更新难度
		if Engine.get_frames_drawn() % 60 == 0:
			EventBus.hud_update_requested.emit()

func start_game():
	print("[GameManager] 游戏开始!")
	current_state = GameState.PLAYING
	game_time = 0.0
	kill_count = 0
	player_level = 1
	is_game_active = true
	current_stage = 1
	get_tree().paused = false
	EventBus.bgm_requested.emit("battle")
	# 重置时间缩放
	Engine.time_scale = 1.0

func pause_game():
	if current_state != GameState.PLAYING:
		return
	current_state = GameState.PAUSED
	get_tree().paused = true
	EventBus.game_paused.emit(true)
	print("[GameManager] 游戏暂停")

func resume_game():
	if current_state not in [GameState.PAUSED, GameState.LEVEL_UP]:
		return
	current_state = GameState.PLAYING
	get_tree().paused = false
	EventBus.game_resumed.emit()
	EventBus.game_paused.emit(false)
	print("[GameManager] 游戏恢复")

func show_level_up():
	current_state = GameState.LEVEL_UP
	get_tree().paused = true
	EventBus.game_paused.emit(true)
	# 慢动作效果（暂停前短暂）
	Engine.time_scale = 1.0

func hide_level_up():
	current_state = GameState.PLAYING
	get_tree().paused = false
	EventBus.game_paused.emit(false)
	Engine.time_scale = 1.0

func game_over():
	if current_state == GameState.GAME_OVER:
		return
	current_state = GameState.GAME_OVER
	is_game_active = false
	get_tree().paused = true
	AudioManager.play_sfx("dead")
	AudioManager.stop_bgm()
	print("[GameManager] 游戏结束 - 存活:%.1fs 击杀:%d 等级:%d" % [game_time, kill_count, player_level])
	EventBus.game_over.emit(kill_count, game_time, player_level)
	# 存档
	SaveManager.record_game_result(player_level, kill_count, game_time, false)

func victory():
	if current_state == GameState.VICTORY:
		return
	current_state = GameState.VICTORY
	is_game_active = false
	get_tree().paused = true
	EventBus.game_victory.emit()
	SaveManager.record_game_result(player_level, kill_count, game_time, true)
	print("[GameManager] 胜利!")

func restart_game():
	get_tree().paused = false
	Engine.time_scale = 1.0
	PoolManager.clear_all()
	get_tree().reload_current_scene()
	await get_tree().process_frame
	start_game()

func return_to_menu():
	get_tree().paused = false
	Engine.time_scale = 1.0
	is_game_active = false
	current_state = GameState.MENU
	PoolManager.clear_all()
	get_tree().change_scene_to_file("res://scenes/main/Boot.tscn")

func _check_stage_change():
	var wave = ConfigManager.get_current_wave(game_time)
	var stage = wave.get("stage", 1)
	if stage != current_stage:
		current_stage = stage
		var stage_name = wave.get("name", "未知")
		print("[GameManager] 进入阶段 %d: %s" % [stage, stage_name])
		EventBus.stage_changed.emit(stage, stage_name)
		# Boss 关卡
		if wave.get("boss", false):
			_spawn_boss_event()

func _spawn_boss_event():
	print("[GameManager] Boss 即将出现!")
	EventBus.screen_shake_requested.emit(8.0, 0.5)
	AudioManager.play_sfx("boss")

func _check_victory():
	if game_time >= VICTORY_TIME:
		victory()

func _on_enemy_died(_enemy, _pos, _is_elite, is_boss):
	kill_count += 1
	if is_boss:
		# 击杀 Boss 全屏清怪 + 大量经验
		EventBus.screen_shake_requested.emit(12.0, 0.8)
		# 检查是否所有 Boss 关卡都过了，提前胜利
		if current_stage >= 5:
			# 延迟胜利，给玩家爽感
			await get_tree().create_timer(1.5, true, false, true).timeout
			victory()

func _on_player_died():
	game_over()

func _on_player_level_up(new_level: int):
	player_level = new_level

## 工具：获取格式化时间字符串 MM:SS
func get_time_string() -> String:
	var m = int(game_time) / 60
	var s = int(game_time) % 60
	return "%02d:%02d" % [m, s]

## 是否处于游戏中
func is_playing() -> bool:
	return current_state == GameState.PLAYING

## 注册玩家引用
func register_player(p: Node):
	player = p
	print("[GameManager] 玩家已注册: %s" % p.name)

func get_player_pos() -> Vector2:
	if player and is_instance_valid(player):
		return player.global_position
	return Vector2.ZERO

## 屏幕震动
func shake_screen(intensity: float, duration: float):
	EventBus.screen_shake_requested.emit(intensity, duration)
