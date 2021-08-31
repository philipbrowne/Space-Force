class WinGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinGameScene', active: false });
  }

  preload() {
    this.load.spritesheet(
      'win-game-sheet',
      '../../assets/hero/hero-win/hero-win-280px.png',
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
      .text(960, 900, 'Click to Restart', {
        fontSize: 80,
        fill: '#FFFF00',
      })
      .setOrigin(0.5);
    restartButton.setInteractive();
    restartButton.on('pointerdown', this.restart);
    this.gameScene = game.scene.scenes[0];
    this.endTime = this.gameScene.totalTime;
    const timePlayedText = this.add
      .text(960, 750, `You finished in the game in ${this.endTime}`, {
        fontSize: 60,
        fill: '#00FFFF',
      })
      .setOrigin(0.5);
  }
  restart() {
    this.gameScene = game.scene.scenes[0];
    this.hud = game.scene.scenes[1];
    this.winGame = game.scene.scenes[3];
    this.hud.scene.start();
    this.hud.gameTime.destroy();
    this.hud.gameTime = this.hud.time.addEvent({
      delay: 6000000,
      callback: this.onClockEvent,
      callbackScope: this,
      repeat: 1,
    });
    this.gameScene.scene.start();
    this.winGame.scene.stop();
  }
  update() {}
}
