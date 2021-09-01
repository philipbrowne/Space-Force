// Game Over UI when Player has reached zero health
class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene', active: false });
  }

  preload() {
    this.username = username;
    this.load.spritesheet(
      'game-over-sheet',
      '../../assets/hero/hero-hurt/hero-hurt-280px.png',
      {
        frameWidth: 250,
        frameHeight: 280,
      }
    );
    this.timeText = this.add.text(890, 20, 'USERNAME', {
      fontSize: 35,
      fill: '#000000',
    });
  }

  create() {
    alert(this.username);
    const gameoverText = this.add
      .text(960, 530, 'GAME OVER', {
        fontSize: 300,
        color: '#FFFFFF',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    const restartButton = this.add
      .text(960, 800, 'Click Here to Restart', {
        fontSize: 120,
        fill: '#FFFF00',
      })
      .setOrigin(0.5);

    this.anims.create({
      key: 'game-over',
      frames: this.anims.generateFrameNumbers('game-over-sheet'),
      frameRate: 6,
      repeat: -1,
    });
    this.add.sprite(960, 250, 'game-over-sheet').play('game-over');
    restartButton.setInteractive();
    restartButton.on('pointerdown', this.restart);
    this.gameScene = game.scene.scenes[0];
    this.endTime = this.gameScene.totalTime;
    const timePlayedText = this.add
      .text(960, 1000, `You survived for ${this.endTime}`, {
        fontSize: 50,
        fill: '#00FFFF',
      })
      .setOrigin(0.5);
  }
  // Triggers transition to new Game
  restart() {
    this.hud = game.scene.scenes[1];
    this.gameScene = game.scene.scenes[0];
    this.gameOverScene = game.scene.scenes[2];
    this.hud.gameTime.destroy();
    this.hud.gameTime = this.hud.time.addEvent({
      delay: 6000000,
      callback: this.onClockEvent,
      callbackScope: this,
      repeat: 1,
    });
    this.hud.scene.start();
    this.gameScene.scene.start();
    this.gameOverScene.scene.stop();
  }
  update() {}
}
