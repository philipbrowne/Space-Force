const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#8B2403',
  scale: {
    width: 1200,
    height: 800,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: false,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 700 },
      debug: false,
      debugShowVelocity: true,
      debugShowBody: true,
      debugShowStaticBody: true,
    },
  },
};
