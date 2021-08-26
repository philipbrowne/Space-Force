const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#001111',
  scale: {
    width: 800,
    height: 600,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 750 },
      debug: false,
      debugShowVelocity: true,
      debugShowBody: true,
      debugShowStaticBody: true,
    },
  },
};

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }
  preload() {
    this.load.tilemapTiledJSON(
      'space-station-2',
      'assets/tilemaps/tile-day-4.json'
    );
    this.load.spritesheet(
      'space-station-sheet',
      'assets/tilesets/space-station-2.png',
      { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 2 }
    );
    this.load.spritesheet(
      'gamepad-sheet',
      'assets/gamepad/gamepad_spritesheet.png',
      { frameWidth: 100, frameHeight: 100 }
    );
    this.load.image(
      'space-mountain-sheet',
      'assets/backgrounds/space-mountain.png'
    );
    this.load.spritesheet('hero-run-sheet', 'assets/astronaut/hero-run-4.png', {
      frameWidth: 54,
      frameHeight: 70,
    });
    this.load.spritesheet('hero-jump-sheet', 'assets/astronaut/hero-jump.png', {
      frameWidth: 42,
      frameHeight: 70,
    });
    this.load.spritesheet(
      'hero-stand-sheet',
      'assets/astronaut/hero-stand.png',
      {
        frameWidth: 27,
        frameHeight: 70,
      }
    );
    this.load.spritesheet(
      'hero-fall-sheet',
      'assets/astronaut/hero-falling.png',
      {
        frameWidth: 42,
        frameHeight: 70,
      }
    );
    this.load.spritesheet(
      'hero-death-sheet',
      'assets/astronaut/hero-dying.png',
      { frameWidth: 63, frameHeight: 70 }
    );
  }

  create(data) {
    this.anims.create({
      key: 'hero-running',
      frames: this.anims.generateFrameNumbers('hero-run-sheet'),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'hero-jumping',
      frames: this.anims.generateFrameNumbers('hero-jump-sheet'),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'hero-doubleJumping',
      frames: this.anims.generateFrameNumbers('hero-jump-sheet'),
      frameRate: 30,
      repeat: 0,
    });
    this.anims.create({
      key: 'hero-standing',
      frames: this.anims.generateFrameNumbers('hero-stand-sheet'),
    });

    this.anims.create({
      key: 'hero-falling',
      frames: this.anims.generateFrameNumbers('hero-fall-sheet'),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'hero-dead',
      frames: this.anims.generateFrameNumbers('hero-death-sheet'),
      framerate: 1,
      repeat: 0,
    });
    this.addMap();
    this.addHero();

    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    // this.gamepad = this.game.plugins.add('Phaser.Plugin.VirtualGamepad');
    // this.gamepad = this.game.plugins.add('Phaser.Plugin.VirtualGamepad');

    // // Add a joystick to the game (only one is allowed right now)
    // this.joystick = this.gamepad.addJoystick(100, 420, 1.2, 'gamepad');

    // // Add a button to the game (only one is allowed right now)
    // this.button = this.gamepad.addButton(400, 420, 1.0, 'gamepad');
  }
  addHero() {
    this.hero = new Hero(this, this.startCoords.x, this.startCoords.y);
    this.cameras.main.startFollow(this.hero);
    const groundCollider = this.physics.add.collider(
      this.hero,
      this.map.getLayer('Ground').tilemapLayer
    );
    const spikeCollider = this.physics.add.overlap(
      this.hero,
      this.spikes,
      () => {
        this.hero.kill();
      }
    );
    const poisonCollider = this.physics.add.overlap(
      this.hero,
      this.poison,
      () => {
        this.hero.kill();
      }
    );
    this.hero.on('died', () => {
      groundCollider.destroy();
      spikeCollider.destroy();
      poisonCollider.destroy();
      this.hero.body.setCollideWorldBounds(false);
      this.cameras.main.stopFollow();
    });
  }

  addMap() {
    this.map = this.make.tilemap({
      key: 'space-station-2',
    });
    const groundTiles = this.map.addTilesetImage(
      'space-station-2',
      'space-station-sheet'
    );
    const backgroundTiles = this.map.addTilesetImage(
      'space-mountain',
      'space-mountain-sheet'
    );
    const backgroundLayer = this.map.createStaticLayer(
      'Background',
      backgroundTiles
    );
    backgroundLayer.setScrollFactor(0.1);
    const groundLayer = this.map.createStaticLayer('Ground', groundTiles);
    groundLayer.setCollision(_.range(3, 12), true);
    groundLayer.setCollision(_.range(14, 35), true);
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.physics.world.setBoundsCollision(true, true, false, true);
    // shows orange debug layer over tiles;
    // const debugGraphics = this.add.graphics();
    // groundLayer.renderDebug(debugGraphics);

    this.spikes = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    this.poison = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });

    this.map.getObjectLayer('Objects').objects.forEach((object) => {
      if (object.name === 'Start Location') {
        this.startCoords = { x: object.x, y: object.y };
      }
      if (object.type === 'Spike') {
        const spike = this.spikes.create(
          object.x,
          object.y,
          'space-station-sheet',
          object.gid - 1
        );
        spike.setOrigin(0, 1);
        spike.setSize(object.width - 2, object.height - 8);
        spike.setOffset(3, 8);
      }
      if (object.type === 'Poison') {
        const poisonTile = this.poison.create(
          object.x,
          object.y,
          'space-station-sheet',
          object.gid - 1
        );
        poisonTile.setOrigin(0, 1);
        poisonTile.setSize(object.width - 2, object.height - 10);
        poisonTile.setOffset(2, 10);
      }
    });
  }
  update(time, delta) {
    const bottomView = this.cameras.main.getWorldPoint(
      0,
      this.cameras.main.height
    ).y;
    if (this.hero.isDead() && this.hero.getBounds().top > bottomView + 150) {
      this.hero.destroy();
      this.addHero();
    }
  }
}

const game = new Phaser.Game(
  Object.assign(config, {
    scene: [Game],
  })
);
