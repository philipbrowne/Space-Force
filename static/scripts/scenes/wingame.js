// End of Game (win)  UI when Player has found star at top of level
class WinGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinGameScene', active: false });
  }

  preload() {
    this.username = username;
    this.load.spritesheet(
      'win-game-sheet',
      '../../assets/hero/hero-win/hero-win-280px.png',
      {
        frameWidth: 170,
        frameHeight: 280,
      }
    );
    this.userData;
  }
  create() {
    this.anims.create({
      key: 'win-game',
      frames: this.anims.generateFrameNumbers('win-game-sheet'),
      frameRate: 10,
      repeat: -1,
    });
    this.add.sprite(960, 150, 'win-game-sheet').play('win-game');
    var text = this.add
      .text(960, 350, 'Congratulations, you won!', {
        fontSize: 100,
        color: '#FFFFFF',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.gameScene = game.scene.scenes[0];
    this.endTime = this.gameScene.totalTime;
    const restartButton = this.add
      .text(960, 750, 'Click to Restart', {
        fontSize: 80,
        fill: '#FFFF00',
      })
      .setOrigin(0.5);
    restartButton.setInteractive();
    restartButton.on('pointerdown', this.restart);
    this.getUserDetails();
    const timePlayedText = this.add
      .text(960, 550, `You finished in the game in ${this.endTime}`, {
        fontSize: 60,
        fill: '#00FFFF',
      })
      .setOrigin(0.5);
  }

  async getUserDetails() {
    const res = await axios.get(`/users/${this.username}/details`);
    this.userData = res.data;
    const userText = this.add
      .text(960, 900, `USERNAME: ${this.userData.username}`, {
        fontSize: 20,
        fill: '#00FFFF',
      })
      .setOrigin(0.5);
  }
  // Triggers transition to new Game
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
