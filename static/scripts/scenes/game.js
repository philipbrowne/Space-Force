class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {}

  preload() {
    this.username = username;
    this.timesPlayed = timesPlayed;
    if (bestTime) {
      this.bestTime = bestTime;
    }
    this.personalBest = personalBest;
    this.totalCompletions = totalCompletions;
    // Preloading Spritesheets for map - assets sourced from publicly available materials on https://itch.io/game-assets/ - some tiles also created by Emma Pines-Schwartz
    this.load.tilemapTiledJSON(
      'tileset',
      '/static/assets/tilemaps/tilemap.json'
    );
    this.load.spritesheet('tile-sheet', '../../assets/tilesets/tileset.png', {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 2,
    });
    // Background Created by Emma Pines-Schwartz
    this.load.image('background', '../../assets/backgrounds/mars2.png');

    // Spritesheets for Hero Character - purchased by developer and sourced here: https://graphicriver.net/item/space-wars-character-sprites/11906902
    this.load.spritesheet(
      'hero-run-sheet',
      '../../assets/hero/hero-run/hero-run-140px.png',
      {
        frameWidth: 108,
        frameHeight: 140,
      }
    );
    this.load.spritesheet(
      'hero-jump-sheet',
      '../../assets/hero/hero-jump/hero-jump-140px.png',
      {
        frameWidth: 84,
        frameHeight: 140,
      }
    );
    this.load.spritesheet(
      'hero-fall-sheet',
      '../../assets/hero/hero-fall/hero-fall-140px.png',
      {
        frameWidth: 84,
        frameHeight: 140,
      }
    );
    this.load.spritesheet(
      'hero-still-sheet',
      '../../assets/hero/hero-still/hero-still-140px.png',
      {
        frameWidth: 54,
        frameHeight: 140,
      }
    );
    this.load.spritesheet(
      'hero-hurt-sheet',
      '../../assets/hero/hero-hurt/hero-hurt-140px.png',
      {
        frameWidth: 125,
        frameHeight: 140,
      }
    );
    this.load.spritesheet(
      'hero-win-sheet',
      '../../assets/hero/hero-win/hero-win-140px.png',
      {
        frameWidth: 85,
        frameHeight: 140,
      }
    );
    // Fonts sourced from Google Fonts
    this.load.bitmapFont(
      'Roboto',
      '../../assets/fonts/Roboto.png',
      '../../assets/fonts/Roboto.xml'
    );
    this.load.bitmapFont(
      'Black-Ops-One',
      '../../assets/fonts/BlackOpsOne.png',
      '../../assets/fonts/BlackOpsOne.xml'
    );
  }

  create(data) {
    // Starting Coordinates for Player at Beginning of Map - updated when player reaches new check points via health packs
    // this.startCoords = {
    //   x: 112,
    //   y: 3135,
    // };
    this.startCoords = {
      x: 7351,
      y: 181,
    };
    // Referencing hud.js scene
    this.hud = game.scene.scenes[1];
    // Additional inputs for directional movement
    this.aKey = this.input.keyboard.addKey('A');
    this.dKey = this.input.keyboard.addKey('D');
    this.wKey = this.input.keyboard.addKey('W');
    // Cursor Keys for Directional Movement
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    // On-Screen background
    let bg = this.add.image(0, 0, 'background').setOrigin(0);
    bg.setScrollFactor(0.2);
    // Animation sheets for Hero based on Spritesheets above
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
    this.anims.create({
      key: 'hero-winning',
      frames: this.anims.generateFrameNumbers('hero-win-sheet'),
      frameRate: 10,
      repeat: -1,
    });
    // Health for hero - I have used it as a game instance variable rather than a hero instance variable because there are new instances of the hero every time he is hurt
    this.gameHealth = 100;
    // Generates the map
    this.addMap();
    // Creates a new instance of the Hero class
    this.addHero();
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.mainCam = this.cameras.cameras[0];
    // On-Screen Messages using bitmapText
    this.welcomeText1 = this.add.bitmapText(
      32,
      2920,
      'Black-Ops-One',
      'Welcome to Mars!',
      45,
      0
    );
    this.welcomeText2 = this.add.bitmapText(
      256,
      3000,
      'Roboto',
      'To Move Left - Press A, Left, or click the Left Arrow Button on the screen',
      30,
      0
    );
    this.welcomeText3 = this.add.bitmapText(
      256,
      3040,
      'Roboto',
      'To Move Right - Press D, Right, or click the Right Arrow Button on the screen',
      30,
      0
    );
    this.welcomeText4 = this.add.bitmapText(
      558,
      3080,
      'Roboto',
      'To Jump - Press W, Space, Up, or click the Up Arrow Button on the screen',
      30,
      0
    );
    this.welcomeText5 = this.add.bitmapText(
      820,
      3120,
      'Roboto',
      'Beware of Spikes, Lava, Poison, and other Obstacles',
      30,
      0
    );
    this.welcomeText6 = this.add.bitmapText(
      1050,
      3170,
      'Black-Ops-One',
      'Good Luck!',
      45,
      0
    );
    this.welcomeText7 = this.add.bitmapText(
      6100,
      2650,
      'Roboto',
      'Health packs will restore 50% of your health and provide a checkpoint to save your current progress in this game!',
      24,
      0
    );

    this.cp1Text = this.add.bitmapText(
      7310,
      2527,
      'Black-Ops-One',
      'Checkpoint 1 of 4',
      24,
      0
    );
    this.cp2Text = this.add.bitmapText(
      64,
      1760,
      'Black-Ops-One',
      'Checkpoint 2 of 4 - Halfway done!',
      24,
      0
    );
    this.cp3Text = this.add.bitmapText(
      7380,
      1056,
      'Black-Ops-One',
      'Checkpoint 3 of 4',
      24,
      0
    );
    this.cp4Text = this.add.bitmapText(
      96,
      608,
      'Black-Ops-One',
      'Checkpoint 4 of 4 - Almost there!',
      24,
      0
    );
    this.endText = this.add.bitmapText(
      7200,
      40,
      'Roboto',
      "Congratulations! Here's your star!",
      24,
      0
    );
    // Logic for toggling Touch Buttons, displayed in HUD and can also be controlled with TAB key
    if (this.hud.toggleButton) {
      this.hud.toggleButton.on('pointerdown', () => {
        if (
          this.hud.leftButton.visible &&
          this.hud.rightButton.visible &&
          this.hud.upButton.visible
        ) {
          this.hud.hideTouchButtons();
        } else {
          this.hud.showTouchButtons();
        }
      });
    }
    this.tabKey = this.input.keyboard.addKey('TAB', true);
  }
  // Method creates new instance of Hero at the provided startCoords
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
    // Each Healer object triggers 50% health recovery and a new startCoords object that functions as an in-game check-point
    const healer1Physics = this.physics.add.overlap(
      this.hero,
      this.healer1,
      () => {
        this.gameHealth += 50;
        this.healer1obj.destroy();
        this.startCoords = { x: 7440, y: 2655 };
      }
    );

    const healer2Physics = this.physics.add.overlap(
      this.hero,
      this.healer2,
      () => {
        this.gameHealth += 50;
        this.healer2obj.destroy();
        this.startCoords = { x: 80, y: 1855 };
      }
    );

    const healer3Physics = this.physics.add.overlap(
      this.hero,
      this.healer3,
      () => {
        this.gameHealth += 50;
        this.healer3obj.destroy();
        this.startCoords = { x: 7392, y: 1311 };
      }
    );
    const healer4Physics = this.physics.add.overlap(
      this.hero,
      this.healer4,
      () => {
        this.gameHealth += 50;
        this.healer4obj.destroy();
        this.startCoords = { x: 560, y: 865 };
      }
    );
    // The Star, located at the top of the level, triggers a transition to winGame scene
    const starPhysics = this.physics.add.overlap(this.hero, this.star, () => {
      this.starObj.destroy();
      this.hero.win();
      setTimeout(this.winGame.bind(this), 2500);
    });

    // Triggered by hurt event emission - removes colliders from the current hero instance and destroying the current hero instance, before creating a new one. Deducts 25 points from gameHealth
    this.hero.on('hurt', () => {
      this.gameHealth -= 25;
      groundPhysics.destroy();
      obstaclePhysics.destroy();
      healer1Physics.destroy();
      healer2Physics.destroy();
      healer3Physics.destroy();
      healer4Physics.destroy();
      starPhysics.destroy();
      // Currently has hero fall off map when hurt
      this.hero.body.setCollideWorldBounds(false);
      // Stops camera from following current hero instance when hurt
      this.cameras.main.stopFollow();
    });
  }
  // Can be used in debugging to locate a specific object in relation to the camera
  getRelativePositionToCanvas(gameObject, camera) {
    return {
      x: (gameObj.x - camera.worldView.x) * camera.zoom,
      y: (gameObj.y - camera.worldView.y) * camera.zoom,
    };
  }
  // Generates the in-game map/level
  addMap() {
    this.map = this.make.tilemap({ key: 'tileset' });
    const groundTiles = this.map.addTilesetImage('tileset', 'tile-sheet');
    const groundLayer = this.map.createStaticLayer('Ground', groundTiles);
    // References tiles on Tileset that are collidable with Hero and can be contacted with no damage to hero
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
    // Obstacle objects generated via tileset JSON, created using Tiled Open Source Application: https://www.mapeditor.org/
    this.obstacles = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    // Healer Objects representing Health Packs on level
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
    // Star object representing Star object at top of level
    this.star = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    // Iterates through Objects from Tileset and determines how to handle each
    this.map.getObjectLayer('Objects').objects.forEach((object) => {
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
      if (object.name === 'End') {
        this.starObj = this.star.create(
          object.x,
          object.y,
          'tile-sheet',
          object.gid - 1
        );
        this.starObj.setOrigin(0, 1);
        this.starObj.setSize(object.width - 6, object.height - 13);
        this.starObj.setOffset(3, 13);
        this.starObj.id = object.gid - 1;
      }
    });
  }
  // Returns current position of hero on map, can be used for debugging purposes
  getHeroPosition() {
    return {
      x: this.hero.getBounds().x,
      y: this.hero.getBounds().y,
    };
  }
  // Triggers transition to gameOver scene, ending current game
  gameOver() {
    const hud = game.scene.scenes[1];
    const gameOverScene = game.scene.scenes[2];
    const gameScene = game.scene.scenes[0];
    hud.gameTime.destroy();
    hud.scene.stop();
    gameScene.scene.stop();
    game.scene.start(gameOverScene);
  }

  async sendGameScore() {
    this.totalTime = this.hud.currTime;
    this.timeNum = this.hud.timeNum;
    const res = await axios.get(`/users/${this.username}/details`);
    this.userData = res.data;
    this.totalCompletions = this.userData.total_completions;
    this.totalCompletions++;
    if (!this.bestTime) {
      this.bestTime = this.timeNum;
      this.personalBest = this.totalTime;
    }
    if (this.timeNum < this.bestTime) {
      this.bestTime = this.timeNum;
      this.personalBest = this.totalTime;
    }
    await axios.post('/wingame', {
      best_time: this.bestTime,
      personal_best: this.personalBest,
      total_completions: this.totalCompletions,
      completion_time: this.timeNum,
      print_time: this.totalTime,
    });
  }

  // Triggers transition to winGame scene, ending current game
  winGame() {
    const hud = game.scene.scenes[1];
    const winGameScene = game.scene.scenes[3];
    const gameScene = game.scene.scenes[0];
    this.sendGameScore();
    hud.gameTime.destroy();
    hud.scene.stop();
    gameScene.scene.stop();
    game.scene.start(winGameScene);
  }

  update(time, delta) {
    if (this.hud) {
      // Triggers toggle of on-screen inputs for Left/Right/Up - default is ON
      if (Phaser.Input.Keyboard.JustDown(this.tabKey)) {
        if (
          this.hud.leftButton.visible &&
          this.hud.rightButton.visible &&
          this.hud.upButton.visible
        ) {
          this.hud.hideTouchButtons();
        } else {
          this.hud.showTouchButtons();
        }
      }
    }
    // In place to keep in-game health from going above 100
    if (this.gameHealth > 100) {
      this.gameHealth = 100;
    }
    // Constantly updating HUD healthbar to represent current gameHealth
    if (this.hud) {
      this.hud.setMeterPercentage(this.gameHealth / 100);
    }
    // Referencing Timer created by HUD
    this.totalTime = this.hud.currTime;
    this.timeNum = this.hud.timeNum;
    // Triggers gameOver transition if gameHealth reaches zero
    if (this.gameHealth === 0) {
      setTimeout(this.gameOver, 1500);
    }
    // Bottom view of camera, making a smooth transition when hero is hurt and keeping camera from following hero beyond the point where he is off the map
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
