class HudScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HudScene', active: true });
  }
  preload() {
    // HealthBar courtesy of https://blog.ourcade.co/posts/2020/animated-health-bar-phaser-3/
    this.load.image(
      'left-cap',
      'assets/healthbar/barHorizontal_green_left.png'
    );
    this.load.image('middle', 'assets/healthbar/barHorizontal_green_mid.png');
    this.load.image(
      'right-cap',
      'assets/healthbar/barHorizontal_green_right.png'
    );

    this.load.image(
      'left-cap-shadow',
      'assets/healthbar/barHorizontal_shadow_left.png'
    );
    this.load.image(
      'middle-shadow',
      'assets/healthbar/barHorizontal_shadow_mid.png'
    );
    this.load.image(
      'right-cap-shadow',
      'assets/healthbar/barHorizontal_shadow_right.png'
    );
    this.load.image('left-button', 'assets/gamepad/left-arrow-orig.png');
    this.load.image('right-button', 'assets/gamepad/right-arrow-orig.png');
    this.load.image('up-button', 'assets/gamepad/up-arrow-orig.png');
  }
  init() {
    this.fullWidth = 300;
  }
  create() {
    game.input.addPointer();
    this.leftButton = this.add.image(240, 820, 'left-button');
    this.rightButton = this.add.image(750, 820, 'right-button');
    this.upButton = this.add.image(1650, 820, 'up-button');
    this.leftButton.alpha = 0.17;
    this.rightButton.alpha = 0.17;
    this.upButton.alpha = 0.17;

    this.leftButton.setInteractive();
    this.rightButton.setInteractive();
    this.upButton.setInteractive();
    const y = 24;
    const x = 10;
    // background shadow
    const leftShadowCap = this.add
      .image(x, y, 'left-cap-shadow')
      .setOrigin(0, 0.5);

    const middleShaddowCap = this.add
      .image(leftShadowCap.x + leftShadowCap.width, y, 'middle-shadow')
      .setOrigin(0, 0.5);
    middleShaddowCap.displayWidth = this.fullWidth;

    this.add
      .image(
        middleShaddowCap.x + middleShaddowCap.displayWidth,
        y,
        'right-cap-shadow'
      )
      .setOrigin(0, 0.5);
    // health bar
    this.leftCap = this.add.image(x, y, 'left-cap').setOrigin(0, 0.5);

    this.middle = this.add
      .image(this.leftCap.x + this.leftCap.width, y, 'middle')
      .setOrigin(0, 0.5);

    this.rightCap = this.add
      .image(this.middle.x + this.middle.displayWidth, y, 'right-cap')
      .setOrigin(0, 0.5);

    this.setMeterPercentage(1);
  }
  setMeterPercentage(percent = 1, duration = 1000) {
    const width = this.fullWidth * percent;

    this.tweens.add({
      targets: this.middle,
      displayWidth: width,
      duration,
      ease: Phaser.Math.Easing.Sine.Out,
      onUpdate: () => {
        this.rightCap.x = this.middle.x + this.middle.displayWidth;

        this.leftCap.visible = this.middle.displayWidth > 0;
        this.middle.visible = this.middle.displayWidth > 0;
        this.rightCap.visible = this.middle.displayWidth > 0;
      },
    });
  }
  update() {}
}
