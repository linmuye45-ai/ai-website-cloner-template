extends "res://src/weapons/WeaponBase.gd"
## HolyRing.gd
## 旋转圣环 - 环绕玩家的持续伤害光环
## 等级提升：数量、半径、伤害

var rings: Array = []  # 存储环节点
var base_radius: float = 85.0
var base_count: int = 2
var rotation_speed: float = 3.0

func _ready():
	weapon_id = "holy_ring"
	super._ready()
	base_radius = float(weapon_config.get("radius", 90))
	base_count = int(weapon_config.get("count", 2))
	_spawn_rings()

func _spawn_rings():
	# 清理旧
	for r in rings:
		if is_instance_valid(r):
			r.queue_free()
	rings.clear()
	
	var count = get_ring_count()
	for i in range(count):
		var ring = Area2D.new()
		ring.name = "HolyRing_%d" % i
		ring.monitoring = true
		ring.monitorable = true
		ring.add_to_group("player_projectile")
		ring.set_meta("damage", get_damage())
		# 碰撞（圆形）
		var col = CollisionShape2D.new()
		var shape = CircleShape2D.new()
		shape.radius = 18
		col.shape = shape
		ring.add_child(col)
		# 视觉
		var sprite = Sprite2D.new()
		var img = Image.create(32,32,false,Image.FORMAT_RGBA8)
		img.fill(Color("#FFD700"))
		# 空心
		for y in range(32):
			for x in range(32):
				var d = Vector2(x-16,y-16).length()
				if d > 14 or d < 8:
					img.set_pixel(x,y,Color(0,0,0,0))
				else:
					img.set_pixel(x,y,Color("#FFF7B0") if d < 11 else Color("#F59E0B"))
		sprite.texture = ImageTexture.create_from_image(img)
		sprite.centered = true
		ring.add_child(sprite)
		# 光晕粒子
		var particles = GPUParticles2D.new()
		particles.emitting = true
		particles.amount = 4
		particles.lifetime = 0.6
		var mat = ParticleProcessMaterial.new()
		mat.direction = Vector3(0,-1,0)
		mat.spread = 15
		mat.initial_velocity_min = 10
		mat.initial_velocity_max = 20
		particles.process_material = mat
		var pimg = Image.create(4,4,false,Image.FORMAT_RGBA8)
		pimg.fill(Color("#FEF08A"))
		particles.texture = ImageTexture.create_from_image(pimg)
		ring.add_child(particles)
		
		add_child(ring)
		rings.append(ring)
		# 伤害tick：进入即伤害，持续每0.4秒再伤
		ring.area_entered.connect(_on_ring_hit.bind(ring))
		ring.body_entered.connect(_on_ring_hit_body.bind(ring))
	
	print("[HolyRing] 生成 %d 个圣环" % count)

func get_ring_count() -> int:
	# 每2级 +1 环
	var extra = (current_level - 1) / 2
	var c = base_count + extra
	if weapon_id == "holy_nova":
		c += 2
	return c

func get_ring_radius() -> float:
	var r = base_radius + (current_level - 1) * 8
	if weapon_id == "holy_nova":
		r += 40
	return r

func _process(delta):
	super._process(delta)
	if not owner_player:
		return
	# 旋转圣环
	var t = Time.get_ticks_msec() * 0.001 * rotation_speed
	var count = rings.size()
	if count == 0:
		return
	var radius = get_ring_radius()
	for i in range(count):
		var ring = rings[i]
		if not is_instance_valid(ring):
			continue
		var angle = t + TAU * float(i) / float(count)
		var offset = Vector2(cos(angle), sin(angle)) * radius
		ring.global_position = owner_player.global_position + offset
		ring.rotation = angle + PI/2
		# 更新伤害
		ring.set_meta("damage", get_damage())
		ring.set_meta("weapon_id", weapon_id)

func _on_ring_hit(area: Area2D, ring: Area2D):
	if area.is_in_group("enemy"):
		if area.has_method("take_damage"):
			var dmg = ring.get_meta("damage") if ring.has_meta("damage") else get_damage()
			area.take_damage(dmg)
			EventBus.damage_number_requested.emit(area.global_position, dmg, false, Color("#FDE68A"))

func _on_ring_hit_body(body: Node, ring: Area2D):
	if body.is_in_group("enemy"):
		if body.has_method("take_damage"):
			var dmg = ring.get_meta("damage") if ring.has_meta("damage") else get_damage()
			body.take_damage(dmg)
			EventBus.damage_number_requested.emit(body.global_position, dmg, false, Color("#FDE68A"))

func attack():
	# 圣环是持续伤害，attack 每0.3秒脉冲一次额外伤害
	deal_area_damage(owner_player.global_position if owner_player else global_position, get_ring_radius() + 20, get_damage() * 0.35, Color("#FEF08A"))

func level_up(new_level: int):
	super.level_up(new_level)
	# 数量变化需重建
	var expected = get_ring_count()
	if expected != rings.size():
		_spawn_rings()

## 进化：圣光新星 - 周期性全屏爆发
var _nova_timer: float = 3.0
func _physics_process(delta):
	if weapon_id != "holy_nova":
		return
	if not GameManager.is_playing():
		return
	_nova_timer -= delta
	if _nova_timer <= 0:
		_nova_timer = 3.0
		_trigger_nova()

func _trigger_nova():
	if not owner_player:
		return
	var pos = owner_player.global_position
	var radius = 240
	deal_area_damage(pos, radius, get_damage() * 2.5, Color("#FFFFFF"))
	# 特效
	var fx = Node2D.new()
	fx.global_position = pos
	get_tree().current_scene.add_child(fx)
	var circle = Sprite2D.new()
	var img = Image.create(512,512,false,Image.FORMAT_RGBA8)
	img.fill(Color(0,0,0,0))
	for y in range(512):
		for x in range(512):
			var d = Vector2(x-256,y-256).length()
			if d <= 250:
				var a = 0.4 * (1.0 - d/250)
				img.set_pixel(x,y, Color(1,1,0.6,a))
	circle.texture = ImageTexture.create_from_image(img)
	circle.centered = true
	fx.add_child(circle)
	var tween = fx.create_tween()
	tween.tween_property(circle, "scale", Vector2(1.5,1.5), 0.4)
	tween.parallel().tween_property(circle, "modulate:a", 0.0, 0.4)
	tween.tween_callback(func(): fx.queue_free())
	EventBus.screen_shake_requested.emit(6.0, 0.3)
	EventBus.sfx_requested.emit("explosion", pos)

func evolve_to_nova():
	weapon_id = "holy_nova"
	base_damage = 40
	_spawn_rings()
	print("[HolyRing] 进化为圣光新星!")
