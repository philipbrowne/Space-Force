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
    const pf = this.add.rectangle(533, 745, 300, 20, 0x4bcb7c);
    this.physics.add.existing(pf, true);
    const pf2 = this.add.rectangle(660, 670, 300, 20, 0x4bcb7c);
    this.physics.add.existing(pf2, true);
    const pf3 = this.add.rectangle(850, 750, 200, 20, 0x4bcb7c);
    this.physics.add.existing(pf3, true);
    this.physics.add.collider(this.hero, pf);
    this.physics.add.collider(this.hero, pf2);
    this.physics.add.collider(this.hero, pf3);
  }

  update(time, delta) {}
}
