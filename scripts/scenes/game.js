class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {}

  preload() {
    this.load.tilemapTiledJSON(
      'space-station',
      'assets/tilemaps/tile-day-8.json'
    );
    this.load.image('space-station-sheet', 'assets/tilesets/space-station.png');
    this.load.spritesheet(
      'hero-run-sheet',
      'assets/hero/hero-run/hero-run-140px.png',
      {
        frameWidth: 108,
        frameHeight: 140,
      }
    );
    this.load.spritesheet(
      'hero-jump-sheet',
      'assets/hero/hero-jump/hero-jump-140px.png',
      {
        frameWidth: 84,
        frameHeight: 140,
      }
    );
    this.load.spritesheet(
      'hero-fall-sheet',
      'assets/hero/hero-fall/hero-fall-140px.png',
      {
        frameWidth: 84,
        frameHeight: 140,
      }
    );
    this.load.spritesheet(
      'hero-still-sheet',
      'assets/hero/hero-still/hero-still-140px.png',
      {
        frameWidth: 54,
        frameHeight: 140,
      }
    );
  }

  create(data) {
    this.aKey = this.input.keyboard.addKey('A');
    this.dKey = this.input.keyboard.addKey('D');
    this.wKey = this.input.keyboard.addKey('W');
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.anims.create({
      key: 'hero-running',
      frames: this.anims.generateFrameNumbers('hero-run-sheet'),
      frameRate: 40,
      repeat: -1,
    });
    this.anims.create({
      key: 'hero-jumping',
      frames: this.anims.generateFrameNumbers('hero-jump-sheet'),
      frameRate: 20,
      repeat: 0,
    });
    this.anims.create({
      key: 'hero-falling',
      frames: this.anims.generateFrameNumbers('hero-fall-sheet'),
      frameRate: 5,
      repeat: 0,
    });
    this.anims.create({
      key: 'hero-still',
      frames: this.anims.generateFrameNumbers('hero-still-sheet'),
    });
    this.addMap();
    this.addHero();

    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.cameras.main.startFollow(this.hero);
  }

  addHero() {
    this.hero = new Hero(this, this.startCoords.x, this.startCoords.y);
    this.physics.add.collider(
      this.hero,
      this.map.getLayer('Ground').tilemapLayer
    );
  }

  addMap() {
    this.map = this.make.tilemap({ key: 'space-station' });
    const groundTiles = this.map.addTilesetImage(
      'space-station',
      'space-station-sheet'
    );
    const groundLayer = this.map.createStaticLayer('Ground', groundTiles);
    groundLayer.setCollision([5, 6, 7, 8], true);
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.physics.world.setBoundsCollision(true, true, false, true);
    this.map.getObjectLayer('Objects').objects.forEach((object) => {
      if (object.name === 'Start') {
        this.startCoords = { x: object.x, y: object.y };
      }
    });
  }
  update(time, delta) {}
}
