class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene', active: false });
  }

  preload() {
    this.load.spritesheet(
      'game-over-sheet',
      'assets/hero/hero-hurt/hero-hurt-280px.png',
      {
        frameWidth: 250,
        frameHeight: 280,
      }
    );
  }
  create() {
    var text = this.add
      .text(600, 500, 'GAME OVER', {
        fontSize: 200,
        color: '#FFFFFF',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    const restartButton = this.add
      .text(600, 650, 'Click to Restart', {
        fontSize: 80,
        fill: '#FFFF00',
      })
      .setOrigin(0.5);
    this.anims.create({
      key: 'game-over',
      frames: this.anims.generateFrameNumbers('game-over-sheet'),
      frameRate: 6,
      repeat: -1,
    });
    this.add.sprite(600, 200, 'game-over-sheet').play('game-over');
    restartButton.setInteractive();
    restartButton.on('pointerdown', this.restart);
  }
  restart() {
    const gameScene = game.scene.scenes[0];
    const hud = game.scene.scenes[1];
    const gameOverScene = game.scene.scenes[2];
    hud.scene.start();
    gameScene.scene.start();
    gameOverScene.scene.stop();
  }
  update() {}
}
