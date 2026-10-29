extends RefCounted
## ObjectPool.gd
## 通用对象池（非 autoload 版本，供局部使用）
## 中文注释

var pool: Array = []
var scene: PackedScene
var parent: Node
var pool_name: String

func _init(p_scene: PackedScene, p_parent: Node, initial_size: int, p_name: String = "Pool"):
	scene = p_scene
	parent = p_parent
	pool_name = p_name
	for i in range(initial_size):
		var inst = scene.instantiate()
		inst.visible = false
		inst.process_mode = Node.PROCESS_MODE_DISABLED
		parent.add_child(inst)
		pool.append(inst)

func get_object() -> Node:
	for inst in pool:
		if not inst.visible:
			inst.visible = true
			inst.process_mode = Node.PROCESS_MODE_INHERIT
			if inst.has_method("pool_reset"):
				inst.pool_reset()
			return inst
	# 扩容
	var inst = scene.instantiate()
	inst.visible = true
	parent.add_child(inst)
	pool.append(inst)
	return inst

func return_object(obj: Node):
	obj.visible = false
	obj.process_mode = Node.PROCESS_MODE_DISABLED
	if obj.has_method("pool_on_return"):
		obj.pool_on_return()
