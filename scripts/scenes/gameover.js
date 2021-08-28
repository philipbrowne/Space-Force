class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene', active: false });
  }

  preload() {}
  create() {
    var text = this.add
      .text(600, 400, 'GAME OVER', {
        fontSize: 200,
        color: '#FFFFFF',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    const restartButton = this.add
      .text(600, 600, 'Click to Restart', {
        fontSize: 80,
        fill: '#0f0',
      })
      .setOrigin(0.5);
    restartButton.setInteractive();
    restartButton.on('pointerdown', this.restart);
  }
  restart() {
    console.log(game.scene.scenes);
    const gameScene = game.scene.scenes[0];
    const hud = game.scene.scenes[1];
    const gameOverScene = game.scene.scenes[2];
    hud.scene.start();
    gameScene.scene.start();
    gameOverScene.scene.stop();
  }
  update() {}
}
