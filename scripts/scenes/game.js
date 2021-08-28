class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {}

  preload() {
    this.load.tilemapTiledJSON(
      'space-station',
      'assets/tilemaps/tile-day-10.json'
    );
    this.load.spritesheet(
      'space-station-sheet',
      'assets/tilesets/space-station.png',
      { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 2 }
    );
    this.load.spritesheet(
      'hero-run-sheet',
      'assets/hero/hero-run/hero-run-140px.png',
      {
        frameWidth: 108,
        frameHeight: 140,
      }
    );
    this.load.image('background', 'assets/backgrounds/mars3.png');
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
    this.load.spritesheet(
      'hero-die-sheet',
      'assets/hero/hero-die/hero-die-140px.png',
      {
        frameWidth: 125,
        frameHeight: 140,
      }
    );
  }

  create(data) {
    let bg = this.add.image(0, 0, 'background');
    bg.setScrollFactor(0.2);
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
    this.anims.create({
      key: 'hero-dead',
      frames: this.anims.generateFrameNumbers('hero-die-sheet'),
      frameRate: 10,
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
    this.cameras.main.startFollow(this.hero);
    this.mainCam = this.cameras.cameras[0];
  }

  addHero() {
    this.hero = new Hero(this, this.startCoords.x, this.startCoords.y);
    const groundPhysics = this.physics.add.collider(
      this.hero,
      this.map.getLayer('Ground').tilemapLayer
    );
    // Triggers kill method when hero collides with any obstacle object
    const obstaclePhysics = this.physics.add.overlap(
      this.hero,
      this.obstacles,
      () => {
        this.hero.kill();
      }
    );
    // Triggered by kill event emission - removes colliders from this game.  Could be changed later with multiple lives, or health bar
    this.hero.on('died', () => {
      groundPhysics.destroy();
      obstaclePhysics.destroy();
      // Currently has hero fall off map upon death
      this.hero.body.setCollideWorldBounds(false);
      // Stops camera from following hero upon death
      this.cameras.main.stopFollow();
    });
  }

  getRelativePositionToCanvas(gameObject, camera) {
    return {
      x: (gameObj.x - camera.worldView.x) * camera.zoom,
      y: (gameObj.y - camera.worldView.y) * camera.zoom,
    };
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
    const groundPhysics = this.physics.world.setBoundsCollision(
      true,
      true,
      false,
      true
    );
    this.obstacles = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    this.map.getObjectLayer('Objects').objects.forEach((object) => {
      if (object.name === 'Start') {
        this.startCoords = { x: object.x, y: object.y };
      }
      if (object.type === 'Obstacle') {
        const obstacle = this.obstacles.create(
          object.x,
          object.y,
          'space-station-sheet',
          object.gid - 1
        );
        obstacle.setOrigin(0, 1);
        obstacle.setSize(object.width - 6, object.height - 13);
        obstacle.setOffset(3, 13);
      }
    });
  }

  update(time, delta) {}
}

class HealthBar {
  constructor(
    scene,
    x,
    y,
    width,
    height,
    corFill,
    corUnfill,
    value,
    singleDecreaseValue
  ) {
    this.minValue = 0;
    this.maxValue = value;
    this.corUnifll = corUnfill;
    this.corFill = corFill;
    this.arc1 = scene.add.arc(x, y, height, 270, 90, true, corFill, 1);
    this.rectangles = new Array(this.rectangleNo);
    var valueToAdd = width / this.rectangleNo;
    for (let i = 0; i <= 17; i++) {
      this.rectangles[i] = scene.add.rectangle(
        x + valueToAdd * i,
        y,
        width / this.rectangleNo,
        height * 2,
        corFill,
        1
      );
    }
    this.arc2 = scene.add.arc(x + width, y, height, 270, 90, false, corFill, 1);
    this.text = scene.add.text(x + width / 4, y + height * 2, '100/100', {
      fontFamily: 'Arial',
      fontSize: 25,
      color: 0xffffff,
    });

    this.arc1.scrollFactor = 0;
  }
}
