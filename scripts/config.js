const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#001111',
  scale: {
    width: 1600,
    height: 1200,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: false,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 750 },
      debug: true,
      debugShowVelocity: true,
      debugShowBody: true,
      debugShowStaticBody: true,
    },
  },
};
