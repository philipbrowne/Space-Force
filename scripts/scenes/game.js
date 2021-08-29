class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {}

  preload() {
    this.load.tilemapTiledJSON('tileset', 'assets/tilemaps/tilemap.json');
    this.load.spritesheet('tile-sheet', 'assets/tilesets/tileset.png', {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 2,
    });
    this.load.image('background', 'assets/backgrounds/mars.png');

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
    this.load.spritesheet(
      'hero-hurt-sheet',
      'assets/hero/hero-hurt/hero-hurt-140px.png',
      {
        frameWidth: 125,
        frameHeight: 140,
      }
    );
  }

  create(data) {
    this.aKey = this.input.keyboard.addKey('A');
    this.dKey = this.input.keyboard.addKey('D');
    this.wKey = this.input.keyboard.addKey('W');
    let bg = this.add.image(0, 0, 'background');
    bg.setScrollFactor(0.2);
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
      key: 'hero-hurt',
      frames: this.anims.generateFrameNumbers('hero-hurt-sheet'),
      frameRate: 10,
      repeat: 0,
    });

    this.gameHealth = 100;

    this.addMap();
    this.addHero();

    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.mainCam = this.cameras.cameras[0];
  }

  addHero() {
    this.hero = new Hero(this, this.startCoords.x, this.startCoords.y);
    this.cameras.main.startFollow(this.hero);
    const groundPhysics = this.physics.add.collider(
      this.hero,
      this.map.getLayer('Ground').tilemapLayer
    );
    // Triggers hurt method when hero collides with any obstacle object
    const obstaclePhysics = this.physics.add.overlap(
      this.hero,
      this.obstacles,
      () => {
        this.hero.hurt();
      }
    );

    const healer1Physics = this.physics.add.overlap(
      this.hero,
      this.healer1,
      () => {
        this.gameHealth += 50;
        this.healer1obj.destroy();
      }
    );

    const healer2Physics = this.physics.add.overlap(
      this.hero,
      this.healer2,
      () => {
        this.gameHealth += 50;
        this.healer2obj.destroy();
      }
    );

    const healer3Physics = this.physics.add.overlap(
      this.hero,
      this.healer3,
      () => {
        this.gameHealth += 50;
        this.healer3obj.destroy();
      }
    );
    const healer4Physics = this.physics.add.overlap(
      this.hero,
      this.healer4,
      () => {
        this.gameHealth += 50;
        this.healer4obj.destroy();
      }
    );

    // Triggered by hurt event emission - removes colliders from the current hero instance before respawning a new one. Deducts 25 points from gameHealth
    this.hero.on('hurt', () => {
      this.gameHealth -= 25;
      groundPhysics.destroy();
      obstaclePhysics.destroy();
      healer1Physics.destroy();
      healer2Physics.destroy();
      healer3Physics.destroy();
      healer4Physics.destroy();
      // Currently has hero fall off map when hurt
      this.hero.body.setCollideWorldBounds(false);
      // Stops camera from following current hero instance when hurt
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
    this.map = this.make.tilemap({ key: 'tileset' });
    const groundTiles = this.map.addTilesetImage('tileset', 'tile-sheet');
    const groundLayer = this.map.createStaticLayer('Ground', groundTiles);
    groundLayer.setCollision(_.range(1, 9), true);
    groundLayer.setCollision(_.range(10, 26), true);
    groundLayer.setCollision(_.range(31, 37), true);
    groundLayer.setCollision(_.range(38, 52), true);
    groundLayer.setCollision(_.range(59, 61), true);
    groundLayer.setCollision(_.range(63, 65), true);
    groundLayer.setCollision(_.range(67, 80), true);
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.physics.world.setBoundsCollision(true, true, false, true);
    this.obstacles = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    this.healer1 = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    this.healer2 = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    this.healer3 = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    this.healer4 = this.physics.add.group({
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
          'tile-sheet',
          object.gid - 1
        );
        obstacle.setOrigin(0, 1);
        obstacle.setSize(object.width - 6, object.height - 13);
        obstacle.setOffset(3, 13);
      }
      if (object.name === 'Heal1') {
        this.healer1obj = this.healer1.create(
          object.x,
          object.y,
          'tile-sheet',
          object.gid - 1
        );
        this.healer1obj.setOrigin(0, 1);
        this.healer1obj.setSize(object.width - 6, object.height - 13);
        this.healer1obj.setOffset(3, 13);
        this.healer1.id = object.gid - 1;
      }
      if (object.name === 'Heal2') {
        this.healer2obj = this.healer2.create(
          object.x,
          object.y,
          'tile-sheet',
          object.gid - 1
        );
        this.healer2obj.setOrigin(0, 1);
        this.healer2obj.setSize(object.width - 6, object.height - 13);
        this.healer2obj.setOffset(3, 13);
        this.healer2.id = object.gid - 1;
      }
      if (object.name === 'Heal3') {
        this.healer3obj = this.healer3.create(
          object.x,
          object.y,
          'tile-sheet',
          object.gid - 1
        );
        this.healer3obj.setOrigin(0, 1);
        this.healer3obj.setSize(object.width - 6, object.height - 13);
        this.healer3obj.setOffset(3, 13);
        this.healer3.id = object.gid - 1;
      }
      if (object.name === 'Heal4') {
        this.healer4obj = this.healer4.create(
          object.x,
          object.y,
          'tile-sheet',
          object.gid - 1
        );
        this.healer4obj.setOrigin(0, 1);
        this.healer4obj.setSize(object.width - 6, object.height - 13);
        this.healer4obj.setOffset(3, 13);
        this.healer4.id = object.gid - 1;
      }
    });
  }
  // Returns current position of hero on map
  getHeroPosition() {
    return {
      x: this.hero.getBounds().x,
      y: this.hero.getBounds().y,
    };
  }

  endGame() {
    const hud = game.scene.scenes[1];
    hud.scene.stop();
    const gameOverScene = game.scene.scenes[2];
    const gameScene = game.scene.scenes[0];
    gameScene.scene.stop();
    game.scene.start(gameOverScene);
  }

  update(time, delta) {
    this.hud = game.scene.scenes[1];
    if (this.gameHealth > 100) {
      this.gameHealth = 100;
    }
    if (this.hud) {
      this.hud.setMeterPercentage(this.gameHealth / 100);
    }
    if (this.gameHealth === 0) {
      setTimeout(this.endGame, 1500);
    }
    const bottomOfView = this.cameras.main.getWorldPoint(
      0,
      this.cameras.main.height
    ).y;
    // Destroy instance of hero and start new one when hurt and once the hero has fallen off map
    if (this.hero.isHurt() && this.hero.getBounds().top > bottomOfView + 100) {
      this.hero.destroy();
      this.addHero();
    }
  }
}
