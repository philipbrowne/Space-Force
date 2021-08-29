class WinGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinGameScene', active: false });
  }

  preload() {}
  create() {
    var text = this.add
      .text(600, 400, 'Congratulations, you won!', {
        fontSize: 100,
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
    const gameScene = game.scene.scenes[0];
    const hud = game.scene.scenes[1];
    const winGame = game.scene.scenes[3];
    hud.scene.start();
    gameScene.scene.start();
    winGame.scene.stop();
  }
  update() {}
}
