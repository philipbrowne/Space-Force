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
  }
  update() {}
}
