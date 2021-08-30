class WinGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinGameScene', active: false });
  }

  preload() {
    this.load.spritesheet(
      'win-game-sheet',
      'assets/hero/hero-win/hero-win-280px.png',
      {
        frameWidth: 170,
        frameHeight: 280,
      }
    );
  }
  create() {
    this.anims.create({
      key: 'win-game',
      frames: this.anims.generateFrameNumbers('win-game-sheet'),
      frameRate: 10,
      repeat: -1,
    });
    this.add.sprite(960, 350, 'win-game-sheet').play('win-game');
    var text = this.add
      .text(960, 600, 'Congratulations, you won!', {
        fontSize: 100,
        color: '#FFFFFF',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    const restartButton = this.add
      .text(960, 800, 'Click to Restart', {
        fontSize: 80,
        fill: '#FFFF00',
      })
      .setOrigin(0.5);
    restartButton.setInteractive();
    restartButton.on('pointerdown', this.restart);
  }
  restart() {
    const gameScene = game.scene.scenes[0];
    const hud = game.scene.scenes[1];
    const winGame = game.scene.scenes[3];
    hud.scene.start();
    gameScene.scene.start();
    winGame.scene.stop();
  }
  update() {}
}
