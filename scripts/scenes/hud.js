class HudScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HudScene', active: true });
  }
  preload() {
    // HealthBar assets and code courtesy of https://blog.ourcade.co/posts/2020/animated-health-bar-phaser-3/
    this.load.image(
      'left-cap',
      '../../assets/healthbar/barHorizontal_green_left.png'
    );
    this.load.image(
      'middle',
      '../../assets/healthbar/barHorizontal_green_mid.png'
    );
    this.load.image(
      'right-cap',
      '../../assets/healthbar/barHorizontal_green_right.png'
    );

    this.load.image(
      'left-cap-shadow',
      '../../assets/healthbar/barHorizontal_shadow_left.png'
    );
    this.load.image(
      'middle-shadow',
      '../../assets/healthbar/barHorizontal_shadow_mid.png'
    );
    this.load.image(
      'right-cap-shadow',
      '../../assets/healthbar/barHorizontal_shadow_right.png'
    );
    // Arrow Buttons courtesy of https://publicdomainvectors.org/en/open-source-clipart-icons
    this.load.image('left-button', '../../assets/gamepad/left-arrow-orig.png');
    this.load.image(
      'right-button',
      '../../assets/gamepad/right-arrow-orig.png'
    );
    this.load.image('up-button', '../../assets/gamepad/up-arrow-orig.png');
    this.load.image(
      'empty-button',
      '../../assets/buttons/greenbutton-260x65.png'
    );
    this.load.image(
      'time-button',
      '../../assets/buttons/blue-button-210x63.png'
    );
  }
  init() {
    this.fullWidth = 300;
  }
  create() {
    // Adding pointer allowing multiple touch inputs simultaneously for mobile use
    game.input.addPointer();
    // Directional Buttons
    this.leftButton = this.add.image(240, 820, 'left-button');
    this.rightButton = this.add.image(750, 820, 'right-button');
    this.upButton = this.add.image(1650, 820, 'up-button');
    // Allows toggle of display of on-screen Arrow Buttons - default is ON
    this.toggleButton = this.add.image(130, 75, 'empty-button');
    this.toggleButtonText = this.add
      .text(130, 75, 'Toggle Touch Buttons', {
        fontSize: 18,
        fill: '#000000',
      })
      .setOrigin(0.5);
    this.toggleButton.alpha = 0.7;
    this.toggleButtonText.alpha = 1;
    // Provides translucency to Touch Input Buttons to improve visibility of in-game level and user experience
    this.leftButton.alpha = 0.17;
    this.rightButton.alpha = 0.17;
    this.upButton.alpha = 0.17;
    // Creates new in-game timer
    this.gameTime = this.time.addEvent({
      delay: 6000000,
      callback: this.onClockEvent,
      callbackScope: this,
      repeat: 1,
    });
    this.currTime;
    // Allows touch/click input with on-screen input buttons
    this.leftButton.setInteractive();
    this.rightButton.setInteractive();
    this.upButton.setInteractive();
    this.toggleButton.setInteractive();
    this.toggleButtonText.setInteractive();
    const y = 24;
    const x = 10;
    // background shadow - source of code is from https://blog.ourcade.co/posts/2020/animated-health-bar-phaser-3/
    const leftShadowCap = this.add
      .image(x, y, 'left-cap-shadow')
      .setOrigin(0, 0.5);

    const middleShaddowCap = this.add
      .image(leftShadowCap.x + leftShadowCap.width, y, 'middle-shadow')
      .setOrigin(0, 0.5);
    middleShaddowCap.displayWidth = this.fullWidth;

    this.add
      .image(
        middleShaddowCap.x + middleShaddowCap.displayWidth,
        y,
        'right-cap-shadow'
      )
      .setOrigin(0, 0.5);
    // health bar
    this.leftCap = this.add.image(x, y, 'left-cap').setOrigin(0, 0.5);

    this.middle = this.add
      .image(this.leftCap.x + this.leftCap.width, y, 'middle')
      .setOrigin(0, 0.5);

    this.rightCap = this.add
      .image(this.middle.x + this.middle.displayWidth, y, 'right-cap')
      .setOrigin(0, 0.5);

    this.setMeterPercentage(1);
    // In Game Timer - Source for Timer Method: https://www.html5gamedevs.com/topic/1870-in-game-timer/
    this.timeButton = this.add.image(972, 35, 'time-button');
    this.timeText = this.add.text(890, 20, '', {
      fontSize: 35,
      fill: '#000000',
    });
    this.timeButton.alpha = 0.6;
    this.timeText.alpha = 1;
  }
  // Updates Health Bar based on a percentage value - we are using gameHealth from game.js in conjunction with this UI element
  setMeterPercentage(percent = 1, duration = 1000) {
    const width = this.fullWidth * percent;
    this.tweens.add({
      targets: this.middle,
      displayWidth: width,
      duration,
      ease: Phaser.Math.Easing.Sine.Out,
      onUpdate: () => {
        this.rightCap.x = this.middle.x + this.middle.displayWidth;

        this.leftCap.visible = this.middle.displayWidth > 0;
        this.middle.visible = this.middle.displayWidth > 0;
        this.rightCap.visible = this.middle.displayWidth > 0;
      },
    });
  }
  // Removes On-Screen Arrow Inputs from Visibility
  hideTouchButtons() {
    this.leftButton.visible = false;
    this.leftButton.disableInteractive();
    this.rightButton.visible = false;
    this.rightButton.disableInteractive();
    this.upButton.visible = false;
    this.upButton.disableInteractive();
    this.toggleButtonText.setText('Show Touch Buttons');
  }
  // Returns On-Screen Arrow Inputs to Visibility
  showTouchButtons() {
    this.leftButton.visible = true;
    this.leftButton.setInteractive();
    this.rightButton.visible = true;
    this.rightButton.setInteractive();
    this.upButton.visible = true;
    this.upButton.setInteractive();
    this.toggleButtonText.setText('Hide Touch Buttons');
  }
  // Source for Timer Method: https://www.html5gamedevs.com/topic/1870-in-game-timer/
  updateTimer() {
    // Time Elapsed in MS
    this.timeElapsed = this.gameTime.elapsed;
    this.minutes = Math.floor(this.timeElapsed / 60000) % 60;
    this.seconds = Math.floor(this.timeElapsed / 1000) % 60;
    this.milliseconds = Math.floor(this.timeElapsed) % 100; //If any of the digits becomes a single digit number, pad it with a zero
    if (this.milliseconds < 10) this.milliseconds = '0' + this.milliseconds;
    if (this.seconds < 10) this.seconds = '0' + this.seconds;
    if (this.minutes < 10) this.minutes = '0' + this.minutes;
    this.currTime = this.minutes + ':' + this.seconds + ':' + this.milliseconds;
    // Updates on-screen text for time ellapsed in current game
    this.timeText.setText(this.currTime);
  }

  update() {
    // Updates Timer and on-screen text for timer
    this.updateTimer();
  }
}
