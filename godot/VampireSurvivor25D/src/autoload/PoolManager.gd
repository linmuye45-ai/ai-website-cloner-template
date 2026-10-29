extends Node
## PoolManager.gd
## 对象池管理器 - 管理敌人、子弹、掉落物、特效的复用
## 同屏 300+ 敌人保持流畅的关键

# 池字典: 池名 -> { scene: PackedScene, instances: Array, active: Array }
var pools: Dictionary = {}
var pool_parents: Dictionary = {}

# 预烘焙的场景缓存
var scene_cache: Dictionary = {}

func _ready():
	print("[PoolManager] 对象池就绪")

## 注册一个池
func register_pool(pool_name: String, scene_path: String, initial_size: int = 20, pool_parent: Node = null):
	if pools.has(pool_name):
		return
	var scene: PackedScene
	if scene_cache.has(scene_path):
		scene = scene_cache[scene_path]
	else:
		if ResourceLoader.exists(scene_path):
			scene = load(scene_path) as PackedScene
			scene_cache[scene_path] = scene
		else:
			# 如果场景还没创建，用占位节点代替（程序化生成）
			print("[PoolManager] 场景不存在，使用占位: %s" % scene_path)
			scene = null
	
	var parent = pool_parent
	if parent == null:
		parent = Node.new()
		parent.name = "Pool_%s" % pool_name
		add_child(parent)
	pool_parents[pool_name] = parent
	
	pools[pool_name] = {
		"scene": scene,
		"scene_path": scene_path,
		"instances": [],
		"parent": parent,
	}
	# 预创建
	for i in range(initial_size):
		var inst = _create_instance(pool_name)
		if inst:
			inst.visible = false
			inst.process_mode = Node.PROCESS_MODE_DISABLED

func _create_instance(pool_name: String):
	var pool = pools.get(pool_name)
	if pool == null:
		return null
	var inst: Node
	if pool["scene"] != null:
		inst = pool["scene"].instantiate()
	else:
		# 占位：根据池名创建不同类型
		inst = _create_placeholder(pool_name)
	if inst == null:
		return null
	pool["instances"].append(inst)
	pool["parent"].add_child(inst)
	# 给实例标记所属池
	inst.set_meta("pool_name", pool_name)
	return inst

func _create_placeholder(pool_name: String) -> Node:
	# 根据池名返回基础节点，实际逻辑由各自脚本的 setup 填充
	match pool_name:
		"enemy":
			var e = CharacterBody2D.new()
			e.name = "EnemyPlaceholder"
			return e
		"projectile":
			var p = Area2D.new()
			p.name = "ProjectilePlaceholder"
			return p
		"exp_gem":
			var g = Area2D.new()
			g.name = "GemPlaceholder"
			return g
		"damage_number":
			var d = Node2D.new()
			d.name = "DamageNumberPlaceholder"
			return d
		"hit_effect":
			var h = Node2D.new()
			h.name = "HitEffectPlaceholder"
			return h
		_:
			var n = Node2D.new()
			n.name = "GenericPlaceholder"
			return n

## 从池获取对象（核心方法）
func get_object(pool_name: String) -> Node:
	var pool = pools.get(pool_name)
	if pool == null:
		push_warning("[PoolManager] 池不存在: %s" % pool_name)
		return null
	# 找一个未激活的
	for inst in pool["instances"]:
		if not inst.visible or inst.process_mode == Node.PROCESS_MODE_DISABLED:
			inst.visible = true
			inst.process_mode = Node.PROCESS_MODE_INHERIT
			# 重置
			if inst.has_method("pool_reset"):
				inst.pool_reset()
			return inst
	# 没有可用 -> 扩容
	var inst = _create_instance(pool_name)
	if inst:
		inst.visible = true
		inst.process_mode = Node.PROCESS_MODE_INHERIT
		if inst.has_method("pool_reset"):
			inst.pool_reset()
		print("[PoolManager] 池扩容 %s -> %d" % [pool_name, pool["instances"].size()])
		return inst
	return null

## 回收对象
func return_object(obj: Node):
	if obj == null or not is_instance_valid(obj):
		return
	if not obj.has_meta("pool_name"):
		# 非池对象直接释放
		obj.queue_free()
		return
	obj.visible = false
	obj.process_mode = Node.PROCESS_MODE_DISABLED
	if obj.has_method("pool_on_return"):
		obj.pool_on_return()
	# 移回池父节点
	var pool_name = obj.get_meta("pool_name") as String
	var parent = pool_parents.get(pool_name)
	if parent and obj.get_parent() != parent:
		var old_parent = obj.get_parent()
		if old_parent:
			old_parent.remove_child(obj)
		parent.add_child(obj)

## 获取活跃数量（用于调试/限流）
func get_active_count(pool_name: String) -> int:
	var pool = pools.get(pool_name)
	if pool == null:
		return 0
	var cnt = 0
	for inst in pool["instances"]:
		if inst.visible and inst.process_mode != Node.PROCESS_MODE_DISABLED:
			cnt += 1
	return cnt

func get_total_count(pool_name: String) -> int:
	var pool = pools.get(pool_name)
	if pool == null:
		return 0
	return pool["instances"].size()

## 清空所有池（关卡切换时）
func clear_all():
	for pool_name in pools.keys():
		var pool = pools[pool_name]
		for inst in pool["instances"]:
			if is_instance_valid(inst):
				inst.queue_free()
		pool["instances"].clear()
	print("[PoolManager] 所有池已清空")
