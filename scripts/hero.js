class Hero extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero-run-sheet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.anims.play('hero-running');
    this.body.setCollideWorldBounds(true);
    this.body.setCollideWorldBounds(true);
    this.body.setSize(65, 140);
    this.body.setMaxVelocity(350, 500);
    this.body.setDragX(700);
    this.dirKeys = scene.cursorKeys;
    this.aKey = scene.aKey;
    this.dKey = scene.dKey;
    this.wKey = scene.wKey;
    this.spaceKey = scene.cursorKeys.space;
  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.dirKeys.left.isDown || this.aKey.isDown) {
      this.body.setAccelerationX(-1500);
      this.setFlipX(true);
      this.body.offset.x = 25;
    } else if (this.dirKeys.right.isDown || this.dKey.isDown) {
      this.body.setAccelerationX(1500);
      this.setFlipX(false);
      this.body.offset.x = 20;
    } else {
      this.body.setAccelerationX(0);
    }
    const pressedUp = Phaser.Input.Keyboard.JustDown(this.dirKeys.up);
    const pressedW = Phaser.Input.Keyboard.JustDown(this.wKey);
    const pressedSpace = Phaser.Input.Keyboard.JustDown(this.spaceKey);
    if ((pressedUp || pressedW || pressedSpace) && this.body.onFloor()) {
      this.body.setVelocityY(-400);
    }
  }
}
