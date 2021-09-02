// End of Game (win)  UI when Player has found star at top of level
class WinGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinGameScene', active: false });
  }

  preload() {
    this.username = username;
    this.load.spritesheet(
      'win-game-sheet',
      '../../assets/hero/hero-win-game/hero-win-280px.png',
      {
        frameWidth: 170,
        frameHeight: 280,
      }
    );
    this.userData;
    this.gameScene = game.scene.keys.GameScene;
  }
  create() {
    if (this.gameScene.isGameWon) {
      this.anims.create({
        key: 'win-game',
        frames: this.anims.generateFrameNumbers('win-game-sheet'),
        frameRate: 10,
        repeat: -1,
      });
      this.add.sprite(960, 150, 'win-game-sheet').play('win-game');
      const congratsText = this.add
        .text(960, 350, 'Congratulations, you won!', {
          fontSize: 100,
          color: '#FFFFFF',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      this.gameScene = game.scene.keys.GameScene;
      this.endTime = this.gameScene.winTime;
      const restartButton = this.add
        .text(960, 750, 'Click to Restart', {
          fontSize: 80,
          fill: '#FFFF00',
        })
        .setOrigin(0.5);
      restartButton.setInteractive();
      restartButton.on('pointerdown', this.restart);
      this.newRecordText = this.add
        .text(960, 6000, '', {
          fontSize: 25,
          fill: '#FFFFFF',
        })
        .setOrigin(0.5);

      this.getUserDetails();
      const timePlayedText = this.add
        .text(960, 550, `You finished in the game in ${this.endTime}`, {
          fontSize: 60,
          fill: '#00FFFF',
        })
        .setOrigin(0.5);
    }
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
    const timesCompleted = this.add
      .text(960, 950, `TOTAL COMPLETIONS: ${this.userData.total_completions}`, {
        fontSize: 20,
        fill: '#00FFFF',
      })
      .setOrigin(0.5);
    const personalBest = this.add
      .text(
        960,
        1000,
        `FASTEST COMPLETION TIME: ${this.userData.personal_best}`,
        {
          fontSize: 20,
          fill: '#00FFFF',
        }
      )
      .setOrigin(0.5);
  }
  // Triggers transition to new Game
  restart() {
    this.gameScene = game.scene.keys.GameScene;
    this.hud = game.scene.keys.HudScene;
    this.winGame = game.scene.keys.WinGameScene;
    this.hud.scene.start();
    this.hud.gameTime.destroy();
    this.hud.gameTime = this.hud.time.addEvent({
      delay: 6000000,
      callback: this.onClockEvent,
      callbackScope: this,
      repeat: 1,
    });
    this.gameScene.scene.start();
    this.gameScene.isGameWon = false;
    this.winGame.scene.stop();
  }
  update() {}
}
