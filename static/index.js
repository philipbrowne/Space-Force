let game = new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene, HudScene, GameOverScene, WinGameScene],
  })
);

async function sendGameScore() {
  this.totalCompletions = totalCompletions++;
  await axios.post('/wingame', {
    best_time: bestTime,
    personal_best: personalBest,
    total_completions: totalCompletions,
  });
}
