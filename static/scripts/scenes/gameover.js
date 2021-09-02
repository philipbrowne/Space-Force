// Game Over UI when Player has reached zero health
class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene', active: true });
  }

  preload() {
    this.username = username;
    this.load.spritesheet(
      'game-over-sheet',
      '../../assets/hero/hero-game-over/hero-hurt-280px.png',
      {
        frameWidth: 250,
        frameHeight: 280,
      }
    );
    this.load.spritesheet(
      'game-over-sprite',
      '../../assets/hero/hero-game-over/hero-hurt-280px.png',
      {
        frameWidth: 250,
        frameHeight: 280,
      }
    );
    this.timeText = this.add.text(890, 20, 'USERNAME', {
      fontSize: 35,
      fill: '#000000',
    });
    this.gameScene = game.scene.keys.GameScene;
  }

  create() {
    if (this.gameScene.isGameOver) {
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
      if (this.gameScene.isGameOver) {
        const gameOverSprite = this.add.sprite(960, 250, 'game-over-sprite');
        this.anims.create({
          key: 'game-over',
          frames: this.anims.generateFrameNumbers('game-over-sheet'),
          frameRate: 6,
          repeat: -1,
        });
        gameOverSprite.play('game-over');
      }
      restartButton.setInteractive();
      restartButton.on('pointerdown', this.restart);
      this.gameScene = game.scene.keys.GameScene;
      this.endTime = this.gameScene.totalTime;
      this.timePlayedText = this.add
        .text(960, 1000, ``, {
          fontSize: 50,
          fill: '#00FFFF',
        })
        .setOrigin(0.5);
    }
  }
  // Triggers transition to new Game
  restart() {
    this.hud = game.scene.keys.HudScene;
    this.gameScene = game.scene.keys.GameScene;
    this.gameOverScene = game.scene.keys.GameOverScene;
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
    this.gameScene.isGameOver = false;
  }
  update() {
    if (this.timePlayedText) {
      this.timePlayedText.setText(`You survived for ${this.endTime}`);
    }
  }
}
