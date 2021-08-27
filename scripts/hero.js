class Hero extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero-run-sheet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.anims.play('hero-running');
    this.body.setCollideWorldBounds(true);
    this.body.setCollideWorldBounds(true);
    this.body.setSize(65, 140);
    this.dirKeys = scene.cursorKeys;
    this.aKey = scene.aKey;
    this.dKey = scene.dKey;
    this.wKey = scene.wKey;
  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.dirKeys.left.isDown || this.aKey.isDown) {
      this.body.setVelocityX(-250);
      this.setFlipX(true);
      this.body.offset.x = 25;
    } else if (this.dirKeys.right.isDown || this.dKey.isDown) {
      this.body.setVelocityX(250);
      this.setFlipX(false);
      this.body.offset.x = 20;
    } else {
      this.body.setVelocityX(0);
    }
  }
}
