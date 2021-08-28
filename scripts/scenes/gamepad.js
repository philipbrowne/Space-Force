class GamePadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GamePadScene', active: false });
  }

  preload() {
    this.load.image('left-button', 'assets/gamepad/left-arrow.png');
    this.load.image('right-button', 'assets/gamepad/right-arrow.png');
  }

  create() {
    let leftButton = this.add.image(100, 720, 'left-button');
    let rightButton = this.add.image(200, 720, 'right-button');
    leftButton.on('pointerdown', () => {
      Phaser.LEFT;
    });
    rightButton.on('pointerdown', () => {
      Phaser.RIGHT;
    });
  }

  update() {}
}
