import * as Phaser from 'phaser';
import { FOXY_BODY, MAX_HP, type HudState } from './frameConfig';
import { ASSET_BASE } from './assets';

type EnemyKind = 'frog' | 'opossum' | 'eagle';

type Enemy = Phaser.Physics.Arcade.Sprite & {
  kind: EnemyKind;
  originX: number;
  originY: number;
  dir: number;
  timer: number;
  hopping: boolean;
};

const VIEW_W = 480;
const VIEW_H = 270;
const MOVE_SPEED = 235;
const GROUND_ACCEL = 2000;
const AIR_ACCEL = 1300;
const DRAG = 2200;
const JUMP_V = 560;
const GRAVITY = 1900;
const COYOTE_MS = 90;
const BUFFER_MS = 110;
const STOMP_BOUNCE = 430;

/**
 * One complete platformer level built on the SunnyLand CC0 pack:
 * tilemap collision, three enemy archetypes, pickups, parallax,
 * squash-and-stretch, particles, hit-stop, camera shake/flash and
 * a full audio bus. Emits HUD state on the Game event emitter.
 */
export class PlayScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private enemies!: Phaser.Physics.Arcade.Group;
  private pickups!: Phaser.Physics.Arcade.StaticGroup;
  private solidLayer!: Phaser.Tilemaps.TilemapLayer;
  private door!: Phaser.Physics.Arcade.Image;
  private dust!: Phaser.GameObjects.Particles.ParticleEmitter;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private pad = { left: false, right: false, jump: false };
  private hp = MAX_HP;
  private gems = 0;
  private gemTotal = 0;
  private fruits = 0;
  private status: HudState['status'] = 'play';
  private coyote = 0;
  private jumpBuffer = 0;
  private wasAir = false;
  private runDustCd = 0;
  private invincibleUntil = 0;
  private spawnX = 0;
  private spawnY = 0;
  private music?: Phaser.Sound.BaseSound;

  constructor() {
    super('Play');
  }

  /** Called by the React wrapper for on-screen touch controls. */
  setVirtualInput(key: 'left' | 'right' | 'jump', down: boolean): void {
    this.pad[key] = down;
    if (key === 'jump' && down) this.jumpBuffer = this.time.now + BUFFER_MS;
  }

  create(): void {
    const data = (this.scene.settings.data ?? {}) as {
      mapKey?: string;
      musicKey?: string;
    };
    const mapKey = data.mapKey ?? 'level1';
    const musicKey = data.musicKey ?? 'music';
    // Clone the cached map JSON and prefix baked absolute image paths so the
    // same map files work at site root and under the GitHub Pages subpath.
    // Injecting into the tilemap cache is Phaser's supported way to build a
    // map from an in-memory Tiled document.
    const mapData = structuredClone(
      this.cache.json.get(`map-${mapKey}`) as Record<string, unknown>,
    ) as {
      tilesets: { image: string }[];
      layers: { type: string; image?: string }[];
    };
    for (const ts of mapData.tilesets) ts.image = `${ASSET_BASE}${ts.image}`;
    for (const layer of mapData.layers) {
      if (layer.type === 'imagelayer' && layer.image) {
        layer.image = `${ASSET_BASE}${layer.image}`;
      }
    }
    const runtimeKey = `tilemap-${mapKey}`;
    if (this.cache.tilemap.has(runtimeKey)) this.cache.tilemap.remove(runtimeKey);
    this.cache.tilemap.add(runtimeKey, {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: mapData,
    });
    const map = this.make.tilemap({ key: runtimeKey });
    const tileset = map.addTilesetImage('tileset', 'tileset', 16, 16, 0, 0, 1)!;
    const worldW = map.widthInPixels;
    const worldH = map.heightInPixels;

    // Parallax sky layers from the pack's image layers.
    this.add
      .tileSprite(0, 0, worldW, VIEW_H, 'back')
      .setOrigin(0, 0)
      .setScrollFactor(0.15);
    this.add
      .tileSprite(0, 0, worldW, VIEW_H, 'middle')
      .setOrigin(0, 0)
      .setScrollFactor(0.45);

    // level2/level3 have no decorative 'back' tile layer — tolerate its absence.
    map.createLayer('back', tileset, 0, 0);
    this.solidLayer = map.createLayer('main', tileset, 0, 0)!;
    this.solidLayer.setCollisionByProperty({ solid: true });

    this.physics.world.setBounds(0, 0, worldW, worldH + 64);
    this.cameras.main.setBounds(0, 0, worldW, worldH);

    // Player from the object layer.
    const objects = map.getObjectLayer('object')!.objects;
    const spawn = objects.find((o) => o.name === 'player')!;
    this.spawnX = spawn.x! + 16;
    this.spawnY = spawn.y! - 8;
    this.player = this.physics.add.sprite(this.spawnX, this.spawnY, 'foxy');
    this.player.setCollideWorldBounds(true);
    this.player.body!.setSize(FOXY_BODY.width, FOXY_BODY.height);
    (this.player.body as Phaser.Physics.Arcade.Body).setOffset(
      FOXY_BODY.offsetX,
      FOXY_BODY.offsetY,
    );
    this.player.setMaxVelocity(MOVE_SPEED, 1200);

    this.enemies = this.physics.add.group();
    for (const o of objects) {
      if (o.name === 'frog' || o.name === 'opossum' || o.name === 'eagle') {
        this.spawnEnemy(o.name, o.x! + 16, o.y! + 16);
      }
    }

    // Pickups.
    this.pickups = this.physics.add.staticGroup();
    for (const o of objects) {
      if (o.name === 'gem' || o.name === 'fruit') {
        const key = o.name === 'gem' ? 'gem' : 'cherry';
        const s = this.pickups.create(o.x! + 8, o.y! + 8, key, 0) as Phaser.Physics.Arcade.Sprite;
        s.play(key === 'gem' ? 'gem-idle' : 'cherry-idle');
        s.setData('kind', o.name);
        if (o.name === 'gem') this.gemTotal += 1;
      }
    }

    // Goal door: level1 names it "level2", later maps use "win".
    const goal = objects.find((o) => o.name === 'level2' || o.name === 'win');
    if (goal) {
      this.door = this.physics.add.staticImage(goal.x! + 11, goal.y! + 16, 'door');
      this.physics.add.overlap(this.player, this.door, () => this.winLevel());
    }

    this.physics.add.collider(this.player, this.solidLayer);
    this.physics.add.collider(this.enemies, this.solidLayer);
    this.physics.add.overlap(this.player, this.enemies, (_p, e) =>
      this.hitEnemy(e as Enemy),
    );
    this.physics.add.overlap(this.player, this.pickups, (_p, pu) =>
      this.collect(pu as Phaser.Physics.Arcade.Sprite),
    );

    // Dust particle system.
    this.dust = this.add.particles(0, 0, 'pixel', {
      lifespan: 340,
      speed: { min: 24, max: 72 },
      scale: { start: 1.6, end: 0 },
      alpha: { start: 0.55, end: 0 },
      tint: 0xe8d6a8,
      emitting: false,
    });
    this.dust.setDepth(5);
    this.player.setDepth(6);

    // Camera feel.
    this.cameras.main.startFollow(this.player, true, 0.14, 0.16);
    this.cameras.main.setDeadzone(110, 70);

    // Input.
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.jumpKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.input.keyboard!.on('keydown-SPACE', () => {
      this.jumpBuffer = this.time.now + BUFFER_MS;
    });
    this.input.keyboard!.on('keydown-UP', () => {
      this.jumpBuffer = this.time.now + BUFFER_MS;
    });
    this.input.keyboard!.on('keydown-W', () => {
      this.jumpBuffer = this.time.now + BUFFER_MS;
    });

    // Audio bus (volume/mute come from persisted settings via the registry).
    const volume = (this.registry.get('volume') as number | undefined) ?? 1;
    this.sound.volume = volume;
    this.sound.mute = (this.registry.get('muted') as boolean | undefined) ?? false;
    this.music = this.sound.add(musicKey, { loop: true, volume: 0.3 });
    this.music.play();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.sound.stopAll());

    this.emitHud();
  }

  private spawnEnemy(kind: EnemyKind, x: number, y: number): void {
    const e = this.enemies.create(x, y, kind) as Enemy;
    e.kind = kind;
    e.originX = x;
    e.originY = y;
    e.dir = -1;
    e.timer = 0;
    e.hopping = false;
    e.setFlipX(true);
    if (kind === 'frog') {
      e.play('frog-idle');
      e.body!.setSize(26, 19).setOffset(4, 8);
    } else if (kind === 'opossum') {
      e.play('opossum-walk');
      e.body!.setSize(28, 22).setOffset(1, 4);
      e.setVelocityX(-55);
    } else {
      e.play('eagle-fly');
      const eb = e.body as Phaser.Physics.Arcade.Body;
      eb.setAllowGravity(false);
      eb.setImmovable(true);
    }
  }

  update(_t: number, deltaMs: number): void {
    if (this.status !== 'play') return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const pad = this.gamepadState();
    const left = this.cursors.left.isDown || this.pad.left || pad.left;
    const right = this.cursors.right.isDown || this.pad.right || pad.right;
    const jumpHeld =
      this.jumpKey.isDown ||
      this.cursors.up.isDown ||
      this.pad.jump ||
      pad.jump;

    // Horizontal movement with ground/air accel and drag.
    const accel = body.blocked.down ? GROUND_ACCEL : AIR_ACCEL;
    if (left && !right) {
      body.setAccelerationX(-accel);
      this.player.setFlipX(true);
    } else if (right && !left) {
      body.setAccelerationX(accel);
      this.player.setFlipX(false);
    } else {
      body.setAccelerationX(0);
      body.setDragX(DRAG);
    }

    // Coyote time + jump buffer + variable jump height.
    if (body.blocked.down) this.coyote = this.time.now + COYOTE_MS;
    if (this.jumpBuffer > this.time.now && this.coyote > this.time.now) {
      this.player.setVelocityY(-JUMP_V);
      this.jumpBuffer = 0;
      this.coyote = 0;
      this.squash(0.82, 1.18);
      this.sound.play('jump', { volume: 0.5 });
      this.burstDust(6);
    }
    if (!jumpHeld && body.velocity.y < -180) body.setVelocityY(-180);

    // Landing detection: squash + dust.
    if (this.wasAir && body.blocked.down) {
      this.squash(1.2, 0.8);
      this.burstDust(7);
    }
    this.wasAir = !body.blocked.down;

    // Running dust trail.
    this.runDustCd -= deltaMs;
    if (body.blocked.down && Math.abs(body.velocity.x) > 140 && this.runDustCd <= 0) {
      this.burstDust(2);
      this.runDustCd = 130;
    }

    this.animatePlayer(body);
    this.updateEnemies(deltaMs);

    // Fell into a pit.
    if (this.player.y > this.physics.world.bounds.height) this.hurt(true);
  }

  private gamepadState(): { left: boolean; right: boolean; jump: boolean } {
    const gp = this.input.gamepad?.getPad(0);
    if (!gp) return { left: false, right: false, jump: false };
    const ax = gp.axes[0]?.getValue() ?? 0;
    return {
      left: gp.left || ax < -0.35,
      right: gp.right || ax > 0.35,
      jump: gp.A || gp.B || gp.X,
    };
  }

  private animatePlayer(body: Phaser.Physics.Arcade.Body): void {
    if (this.time.now < this.invincibleUntil) {
      this.player.setAlpha(Math.sin(this.time.now / 60) > 0 ? 0.35 : 1);
    } else {
      this.player.setAlpha(1);
    }
    if (!body.blocked.down) {
      this.player.play(body.velocity.y < 0 ? 'foxy-jump' : 'foxy-fall', true);
    } else if (Math.abs(body.velocity.x) > 24) {
      this.player.play('foxy-walk', true);
    } else {
      this.player.play('foxy-idle', true);
    }
  }

  private updateEnemies(deltaMs: number): void {
    this.enemies.children.iterate((c) => {
      const e = c as Enemy;
      if (!e?.active) return true;
      if (e.kind === 'opossum') {
        const blocked = (e.body as Phaser.Physics.Arcade.Body).blocked;
        if (blocked.left || blocked.right || Math.abs(e.x - e.originX) > 100) {
          e.dir *= -1;
          e.setVelocityX(e.dir * 55);
          e.setFlipX(e.dir > 0);
        }
      } else if (e.kind === 'frog') {
        e.timer += deltaMs;
        const b = e.body as Phaser.Physics.Arcade.Body;
        if (b.blocked.down) {
          if (e.hopping) {
            e.hopping = false;
            e.play('frog-idle');
          }
          if (e.timer > 1500) {
            e.timer = 0;
            e.hopping = true;
            const dx = this.player.x - e.x;
            e.dir = Math.abs(dx) < 240 ? Math.sign(dx) || 1 : Phaser.Math.RND.pick([-1, 1]);
            e.setVelocityX(e.dir * 95);
            e.setVelocityY(-390);
            e.play('frog-jump');
            this.sound.play('frogQuak', { volume: 0.45 });
          }
        } else if (e.hopping) {
          e.play('frog-fall', true);
        }
        e.setFlipX(e.dir > 0);
      } else {
        // Eagle: sine patrol, no gravity.
        const t = this.time.now / 1000;
        e.x = e.originX + Math.sin(t * 1.1 + e.originX) * 78;
        e.y = e.originY + Math.cos(t * 2.3 + e.originX) * 13;
        e.setFlipX(Math.cos(t * 1.1 + e.originX) > 0);
      }
      return true;
    });
  }

  private hitEnemy(e: Enemy): void {
    if (!e?.active || this.status !== 'play') return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const stomping = body.velocity.y > 60 && this.player.y < e.y - 6;
    if (stomping) {
      // Hit-stop + shake + death FX.
      this.physics.pause();
      this.time.delayedCall(70, () => this.physics.resume());
      this.cameras.main.shake(90, 0.006);
      const fx = this.add.sprite(e.x, e.y, 'enemyDeath').play('enemy-death');
      fx.once('animationcomplete', () => fx.destroy());
      this.sound.play('stomp', { volume: 0.6 });
      e.disableBody(true, true);
      this.player.setVelocityY(-STOMP_BOUNCE);
      this.squash(0.85, 1.15);
    } else {
      this.hurt(false, e.x);
    }
  }

  private collect(s: Phaser.Physics.Arcade.Sprite): void {
    if (!s.active) return;
    const kind = s.getData('kind') as 'gem' | 'fruit';
    const fx = this.add.sprite(s.x, s.y, 'itemFx').play('item-fx');
    fx.once('animationcomplete', () => fx.destroy());
    this.tweens.add({
      targets: s,
      scale: 1.7,
      alpha: 0,
      duration: 180,
      onComplete: () => s.destroy(),
    });
    (s.body as Phaser.Physics.Arcade.StaticBody).enable = false;
    this.sound.play('pickup', { volume: 0.5 });
    if (kind === 'gem') this.gems += 1;
    else this.fruits += 1;
    this.emitHud();
  }

  private hurt(pit: boolean, sourceX?: number): void {
    if (this.time.now < this.invincibleUntil && !pit) return;
    this.hp -= 1;
    this.sound.play('hurt', { volume: 0.55 });
    this.cameras.main.flash(90, 255, 60, 60);
    this.cameras.main.shake(120, 0.01);
    this.invincibleUntil = this.time.now + 1300;
    if (this.hp <= 0) {
      this.status = 'dead';
      this.sound.play('dead', { volume: 0.6 });
      this.player.play('foxy-hurt');
      this.player.setCollideWorldBounds(false);
      this.player.setVelocity(0, -300);
      this.emitHud();
      this.time.delayedCall(1100, () => this.scene.restart());
      return;
    }
    if (!pit) {
      const dir = this.player.x < (sourceX ?? 0) ? -1 : 1;
      this.player.setVelocity(dir * 220, -260);
    } else {
      // Respawn at the map's start point after a pit fall.
      this.player.setPosition(this.spawnX, this.spawnY);
      this.player.setVelocity(0, 0);
    }
    this.emitHud();
  }

  private winLevel(): void {
    if (this.status !== 'play') return;
    this.status = 'win';
    this.sound.play('click', { volume: 0.6 });
    this.cameras.main.flash(160, 255, 240, 190);
    this.player.setAcceleration(0, 0);
    this.player.setVelocity(0, 0);
    this.tweens.add({ targets: this.player, scaleY: 1.15, yoyo: true, duration: 160 });
    this.game.events.emit('level-complete', {
      mapKey: (this.scene.settings.data as { mapKey?: string })?.mapKey ?? 'level1',
      gems: this.gems,
      gemTotal: this.gemTotal,
      fruits: this.fruits,
    });
    this.emitHud();
  }

  private squash(x: number, y: number): void {
    this.tweens.killTweensOf(this.player);
    this.player.setScale(1, 1);
    this.tweens.add({
      targets: this.player,
      scaleX: x,
      scaleY: y,
      duration: 70,
      yoyo: true,
      onComplete: () => this.player.setScale(1, 1),
    });
  }

  private burstDust(count: number): void {
    this.dust.emitParticleAt(
      this.player.x,
      this.player.y + this.player.displayHeight / 2 - 3,
      count,
    );
  }

  private emitHud(): void {
    const state: HudState = {
      hp: this.hp,
      maxHp: MAX_HP,
      gems: this.gems,
      gemTotal: this.gemTotal,
      fruits: this.fruits,
      status: this.status,
    };
    this.game.events.emit('hud', state);
  }
}

export const PHASER_VIEW = { width: VIEW_W, height: VIEW_H, gravity: GRAVITY };
