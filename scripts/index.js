let game = new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene, HudScene, GameOverScene, WinGameScene],
  })
);
