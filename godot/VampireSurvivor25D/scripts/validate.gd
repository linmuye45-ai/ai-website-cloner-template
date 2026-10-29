extends MainLoop
# 轻量验证脚本 - 检查所有关键脚本能否加载
func _initialize():
    print("=== VampireSurvivor25D 验证开始 ===")
    var scripts = [
        "res://src/autoload/EventBus.gd",
        "res://src/autoload/ConfigManager.gd",
        "res://src/autoload/SaveManager.gd",
        "res://src/autoload/PoolManager.gd",
        "res://src/autoload/AudioManager.gd",
        "res://src/autoload/GameManager.gd",
        "res://src/player/Player.gd",
        "res://src/enemy/Enemy.gd",
        "res://src/weapons/WeaponBase.gd",
        "res://src/weapons/MagicMissile.gd",
        "res://src/weapons/HolyRing.gd",
        "res://src/weapons/LightningChain.gd",
        "res://src/weapons/FlameZone.gd",
        "res://src/weapons/ShieldReflect.gd",
        "res://src/systems/UpgradeSystem.gd",
    ]
    var ok = true
    for path in scripts:
        if not ResourceLoader.exists(path):
            print("缺失: %s" % path)
            ok = false
        else:
            var s = load(path)
            if s == null:
                print("加载失败: %s" % path)
                ok = false
            else:
                print("OK: %s" % path)
    if ok:
        print("=== 验证通过 ===")
    else:
        print("=== 验证失败 ===")
    return true

func _process(_delta):
    return true
