extends Node
## AudioManager.gd
## 音频管理器 - BGM 交叉淡入淡出、SFX 池、音量控制
## 占位音效由程序化生成，无需外部资源

var bgm_player: AudioStreamPlayer
var bgm_player2: AudioStreamPlayer
var sfx_players: Array[AudioStreamPlayer] = []
var sfx_index: int = 0
const SFX_POOL_SIZE := 12

# 音量
var master_vol: float = 0.8
var bgm_vol: float = 0.7
var sfx_vol: float = 0.8

# 占位音效缓存（用 AudioStreamGenerator 生成）
var placeholder_streams: Dictionary = {}

func _ready():
	# BGM 播放器
	bgm_player = AudioStreamPlayer.new()
	bgm_player.name = "BGM1"
	bgm_player.bus = "Music"
	add_child(bgm_player)
	bgm_player2 = AudioStreamPlayer.new()
	bgm_player2.name = "BGM2"
	bgm_player2.bus = "Music"
	add_child(bgm_player2)
	
	# SFX 池
	for i in range(SFX_POOL_SIZE):
		var p = AudioStreamPlayer.new()
		p.name = "SFX_%d" % i
		p.bus = "SFX"
		add_child(p)
		sfx_players.append(p)
	
	# 读取设置
	if SaveManager:
		master_vol = SaveManager.get_setting("master_volume")
		if master_vol == null: master_vol = 0.8
		bgm_vol = SaveManager.get_setting("bgm_volume")
		if bgm_vol == null: bgm_vol = 0.7
		sfx_vol = SaveManager.get_setting("sfx_volume")
		if sfx_vol == null: sfx_vol = 0.8
	_apply_volumes()
	
	# 监听事件
	EventBus.sfx_requested.connect(play_sfx)
	EventBus.bgm_requested.connect(play_bgm)
	# 监听武器/伤害事件自动播放
	EventBus.weapon_fired.connect(func(_id, _pos): play_sfx("shoot"))
	EventBus.enemy_died.connect(func(_e,_pos,_elite,_boss): play_sfx("hit"))
	EventBus.exp_pickup_collected.connect(func(_v,_p): play_sfx("pickup"))
	EventBus.player_level_up.connect(func(_l): play_sfx("levelup"))
	
	_generate_placeholder_sounds()
	print("[AudioManager] 音频管理器就绪")

func _generate_placeholder_sounds():
	# 使用 AudioStreamWAV 程序化生成简易占位音效
	# 为了不依赖外部 wav 文件，我们生成几段正弦波
	placeholder_streams["shoot"] = _make_beep(880, 0.08, 0.3)
	placeholder_streams["hit"] = _make_beep(220, 0.12, 0.4)
	placeholder_streams["pickup"] = _make_beep(1200, 0.06, 0.25)
	placeholder_streams["levelup"] = _make_chord([523,659,784], 0.5)
	placeholder_streams["hurt"] = _make_beep(150, 0.2, 0.5)
	placeholder_streams["dead"] = _make_beep(80, 0.8, 0.6)
	placeholder_streams["explosion"] = _make_noise(0.4, 0.5)
	placeholder_streams["lightning"] = _make_beep(2000, 0.15, 0.4)
	placeholder_streams["flame"] = _make_noise(0.3, 0.3)
	placeholder_streams["boss"] = _make_beep(60, 1.0, 0.8)

## 生成单音
func _make_beep(freq: float, duration: float, vol: float) -> AudioStreamWAV:
	var sample_rate = 22050
	var num_samples = int(sample_rate * duration)
	var data = PackedVector2Array()
	# Godot 4 AudioStreamWAV 需要原始 PCM 数据
	var stream = AudioStreamWAV.new()
	stream.mix_rate = sample_rate
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.stereo = false
	# 生成 PCM
	var pcm = PackedByteArray()
	pcm.resize(num_samples * 2)
	for i in range(num_samples):
		var t = float(i) / sample_rate
		var envelope = 1.0 - (float(i) / num_samples) * 0.5 # 简单衰减
		var sample = sin(TAU * freq * t) * vol * envelope
		# 淡出
		if i > num_samples * 0.8:
			sample *= 1.0 - (float(i - num_samples * 0.8) / (num_samples * 0.2))
		var int_sample = int(clamp(sample, -1.0, 1.0) * 32767)
		pcm[i*2] = int_sample & 0xFF
		pcm[i*2+1] = (int_sample >> 8) & 0xFF
	stream.data = pcm
	return stream

func _make_chord(freqs: Array, duration: float) -> AudioStreamWAV:
	var sample_rate = 22050
	var num_samples = int(sample_rate * duration)
	var stream = AudioStreamWAV.new()
	stream.mix_rate = sample_rate
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.stereo = false
	var pcm = PackedByteArray()
	pcm.resize(num_samples * 2)
	for i in range(num_samples):
		var t = float(i) / sample_rate
		var sample = 0.0
		for f in freqs:
			sample += sin(TAU * f * t) * 0.2
		var envelope = 1.0
		if i < num_samples * 0.1:
			envelope = float(i) / (num_samples * 0.1)
		elif i > num_samples * 0.7:
			envelope = 1.0 - (float(i - num_samples * 0.7) / (num_samples * 0.3))
		sample *= envelope
		var int_sample = int(clamp(sample, -1.0, 1.0) * 32767)
		pcm[i*2] = int_sample & 0xFF
		pcm[i*2+1] = (int_sample >> 8) & 0xFF
	stream.data = pcm
	return stream

func _make_noise(duration: float, vol: float) -> AudioStreamWAV:
	var sample_rate = 22050
	var num_samples = int(sample_rate * duration)
	var stream = AudioStreamWAV.new()
	stream.mix_rate = sample_rate
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.stereo = false
	var pcm = PackedByteArray()
	pcm.resize(num_samples * 2)
	var rng = RandomNumberGenerator.new()
	for i in range(num_samples):
		var t = float(i) / num_samples
		var sample = rng.randf_range(-1, 1) * vol * (1.0 - t*0.7)
		var int_sample = int(clamp(sample, -1.0, 1.0) * 32767)
		pcm[i*2] = int_sample & 0xFF
		pcm[i*2+1] = (int_sample >> 8) & 0xFF
	stream.data = pcm
	return stream

func play_sfx(name: String, _pos: Vector2 = Vector2.ZERO):
	var stream = placeholder_streams.get(name)
	if stream == null:
		# 尝试模糊匹配
		if placeholder_streams.has("hit"):
			stream = placeholder_streams["hit"]
		else:
			return
	var player = sfx_players[sfx_index]
	sfx_index = (sfx_index + 1) % SFX_POOL_SIZE
	player.stream = stream
	player.volume_db = linear_to_db(sfx_vol * master_vol)
	player.play()

func play_bgm(name: String):
	# 占位 BGM - 用持续音调模拟
	var stream = placeholder_streams.get(name)
	if stream == null:
		stream = _make_chord([110,138,165], 8.0)
		placeholder_streams[name] = stream
	# 简单切换
	if bgm_player.playing:
		# 交叉淡入淡出
		var tween = create_tween()
		tween.tween_property(bgm_player, "volume_db", -80, 0.5)
		tween.tween_callback(func():
			bgm_player.stop()
			bgm_player.stream = stream
			bgm_player.volume_db = linear_to_db(bgm_vol * master_vol)
			bgm_player.play()
			var t2 = create_tween()
			t2.tween_property(bgm_player, "volume_db", linear_to_db(bgm_vol * master_vol), 0.5)
		)
	else:
		bgm_player.stream = stream
		bgm_player.volume_db = linear_to_db(bgm_vol * master_vol)
		bgm_player.play()

func stop_bgm():
	if bgm_player.playing:
		var tween = create_tween()
		tween.tween_property(bgm_player, "volume_db", -80, 0.5)
		tween.tween_callback(func(): bgm_player.stop())

func _apply_volumes():
	var mv_db = linear_to_db(master_vol)
	AudioServer.set_bus_volume_db(AudioServer.get_bus_index("Master"), mv_db)
	# Music 和 SFX bus 如果不存在则忽略
	for bus_name in ["Music", "SFX"]:
		var idx = AudioServer.get_bus_index(bus_name)
		if idx != -1:
			var vol = 0.0
			if bus_name == "Music": vol = bgm_vol
			else: vol = sfx_vol
			AudioServer.set_bus_volume_db(idx, linear_to_db(vol))

func set_master_volume(v: float):
	master_vol = clamp(v, 0, 1)
	_apply_volumes()
	SaveManager.set_setting("master_volume", master_vol)

func set_bgm_volume(v: float):
	bgm_vol = clamp(v, 0, 1)
	if bgm_player.playing:
		bgm_player.volume_db = linear_to_db(bgm_vol * master_vol)
	SaveManager.set_setting("bgm_volume", bgm_vol)

func set_sfx_volume(v: float):
	sfx_vol = clamp(v, 0, 1)
	SaveManager.set_setting("sfx_volume", sfx_vol)
