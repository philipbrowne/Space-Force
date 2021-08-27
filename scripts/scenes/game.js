class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {}

  preload() {
    this.load.spritesheet(
      'hero-run-sheet',
      'assets/hero/hero-run/hero-run-140px.png',
      {
        frameWidth: 108,
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
      frameRate: 50,
      repeat: -1,
    });
    this.hero = new Hero(this, 250, 160);
    const platform = this.add.rectangle(220, 540, 260, 10, 0x4bcb7c);
    this.physics.add.existing(platform, true);
    this.physics.add.collider(this.hero, platform);
  }

  update(time, delta) {}
}
