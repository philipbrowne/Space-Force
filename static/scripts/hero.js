class Hero extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero-run-sheet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.anims.play('hero-still');
    this.body.setCollideWorldBounds(true);
    // Default Collision rectangle for Hero Sprite
    this.body.setSize(65, 130);
    // Maximum Velocity for Horizontal and Vertical movement
    this.body.setMaxVelocity(350, 500);
    // Sets the hero's horizontal drag in pixels per second squared
    this.body.setDragX(700);
    this.setOrigin(0.5, 1);
    this.dirKeys = scene.cursorKeys;
    this.aKey = scene.aKey;
    this.dKey = scene.dKey;
    this.wKey = scene.wKey;
    this.spaceKey = scene.cursorKeys.space;
    this.input = {};
    this.jumpSound = scene.jumpSound;
    this.hurtSound = scene.hurtSound;
    this.healthPackSound = scene.healthPackSound;
    this.winSound = scene.winSound;
    // Movement state machine
    this.movement();
    // Animation state machine
    this.animations();
    this.jumpKey();
  }

  //   https://github.com/jakesgordon/javascript-state-machine
  //   states of movement for hero character
  movement() {
    this.moveState = new StateMachine({
      // Initializes in standing movement state
      init: 'standing',
      // Valid movement states to transition to and from
      transitions: [
        { name: 'jump', from: 'standing', to: 'jumping' },
        { name: 'fall', from: 'standing', to: 'falling' },
        { name: 'land', from: ['jumping', 'falling'], to: 'standing' },
        { name: 'hurt', from: ['standing', 'falling', 'jumping'], to: 'hurt' },
        {
          name: 'win',
          from: ['standing', 'falling', 'jumping'],
          to: 'winning',
        },
      ],
      // Movement side effects for jump and death
      methods: {
        onJump: () => {
          // Sets Vertical Upward Velocity to 400 pixels per second before going downward with in-game gravity
          this.body.setVelocityY(-400);
        },
        onHurt: () => {
          // Stops horizontal movement and sets Upward Velocity to 300 pixels per second before going downward with in-game gravity
          this.body.setVelocity(0, -300);
          // Stops all acceleration
          this.body.setAcceleration(0);
        },
        onWin: () => {
          // Stops horizontal movement and sets Upward Velocity to 200 pixels per second before going downward with in-game gravity - brief victory animation before going to winGame scene
          this.body.setVelocity(0, -200);
          // Stops all acceleration
          this.body.setAcceleration(0);
        },
      },
    });
    //   Establishing logic for each movement transition
    this.movePredicates = {
      jump: () => {
        // Any of the jump inputs being pressed
        return this.input.pressedJump;
      },
      fall: () => {
        // Hero's body being off the in-game floor
        return !this.body.onFloor();
      },
      land: () => {
        // Hero's body returning to the in-game floor
        return this.body.onFloor();
      },
    };
  }

  // states of animation for hero character
  animations() {
    this.animationState = new StateMachine({
      init: 'still',
      // Valid animation states to transition to and from
      transitions: [
        { name: 'still', from: ['falling', 'running'], to: 'still' },
        { name: 'run', from: ['still', 'falling'], to: 'running' },
        { name: 'jump', from: ['still', 'running'], to: 'jumping' },
        { name: 'fall', from: ['still', 'running', 'jumping'], to: 'falling' },
        { name: 'hurt', from: '*', to: 'hurt' },
        {
          name: 'win',
          from: ['falling', 'running', 'still', 'jumping'],
          to: 'winning',
        },
      ],
      methods: {
        onEnterState: (lifecycle) => {
          // plays animation from game.js file
          this.anims.play(`hero-${lifecycle.to}`);
        },
      },
    });
    //   Establishing logic for each animation transition
    this.animationPredicates = {
      // On Ground and not moving
      still: () => {
        return this.body.onFloor() && this.body.velocity.x === 0;
      },
      // On ground and moving - also determines whether to flip sprite based on whether velocity of X is Positive or Negative
      run: () => {
        return (
          this.body.onFloor() &&
          Math.sign(this.body.velocity.x) === (this.flipX ? -1 : 1) &&
          this.body.velocity.x !== 0
        );
      },
      //  If player is off the ground and going upward
      jump: () => {
        return this.body.velocity.y < 0;
      },
      // If player is off the ground an going downward
      fall: () => {
        return this.body.velocity.y > 0;
      },
    };
  }
  // Jump Inputs via Key or Clicking/Touching Jump Button on Screen
  jumpKey() {
    if (
      Phaser.Input.Keyboard.JustDown(this.dirKeys.up) ||
      Phaser.Input.Keyboard.JustDown(this.wKey) ||
      Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
      this.jumpTouch
    ) {
      return true;
    }
  }

  // Changes Movement and Animation State to Hurt
  hurt() {
    // Determines if movement transition is valid based on this.movement() and emits 'hurt' event to trigger game callbacks
    if (this.moveState.can('hurt')) {
      this.moveState.hurt();
      this.animationState.hurt();
      this.hurtSound.play();
      this.emit('hurt');
    }
  }

  // Triggers Win Event
  win() {
    if (this.moveState.can('win')) {
      this.moveState.win();
      this.animationState.win();
      this.emit('win');
    }
  }

  // Creates a check for movement conditionals below
  isHurt() {
    return this.moveState.is('hurt');
  }

  // Creates a check for whether character has won to prepare transition to winGame scene
  isWinning() {
    return this.moveState.is('winning');
  }

  preUpdate(time, delta) {
    if (game.scene.keys.HudScene) {
      this.hud = game.scene.keys.HudScene;
    }
    // Input logic for on-screen buttons - left arrow, right arrow, and up arrow
    // Input Logic for Left On-Screen Button
    if (this.hud.leftButton) {
      this.hud.leftButton.on('pointerdown', () => {
        this.leftTouch = true;
      });
      this.hud.leftButton.on('pointerup', () => {
        this.leftTouch = false;
      });
    }
    // Input Logic for Right On-Screen Button
    if (this.hud.rightButton) {
      this.hud.rightButton.on('pointerdown', () => {
        this.rightTouch = true;
      });

      this.hud.rightButton.on('pointerup', () => {
        this.rightTouch = false;
      });
    }
    // Input Logic for Up On-Screen Button
    if (this.hud.upButton) {
      this.hud.upButton.on('pointerdown', () => {
        this.jumpTouch = true;
      });
      this.hud.upButton.on('pointerup', () => {
        this.jumpTouch = false;
      });
    }
    super.preUpdate(time, delta);
    this.input.pressedJump = this.jumpKey();
    // Movement logic for directional movement
    if (
      // If the hero is neither currently hurt nor in transition to winGame
      !this.isHurt() &&
      !this.isWinning() &&
      // If any of left-movement inputs have been pressed
      (this.dirKeys.left.isDown || this.aKey.isDown || this.leftTouch)
    ) {
      // Sets left acceleration to 1500 pixels per second squared
      this.body.setAccelerationX(-1500);
      // Flips sprite the opposite direction to face left instead of the default
      this.setFlipX(true);
      // Manipulates collision square accordingly to accurately represent where sprite is on screen
      this.body.offset.x = 25;
    } else if (
      // If the hero is neither currently hurt nor in transition to winGame
      !this.isHurt() &&
      !this.isWinning() &&
      // If any of right-movement inputs have been pressed
      (this.dirKeys.right.isDown || this.dKey.isDown || this.rightTouch)
    ) {
      // Sets right acceleration to 1500 pixels per second squared
      this.body.setAccelerationX(1500);
      // Remove flip of body and returns it to the default facing right
      this.setFlipX(false);
      // Manipulates collision square accordingly to accurately represent where sprite is on screen
      this.body.offset.x = 20;
    } else {
      // Stops all acceleration in either direction
      this.body.setAccelerationX(0);
    }
    // If jump input has been pressed and character is currently on the floor, making jump valid
    if (this.input.pressedJump && this.body.onFloor()) {
      // Sets Upward Vertical velocity to 400 pixels per second
      this.body.setVelocityY(-400);
      this.jumpSound.play();
    }
    // Determining which movement state is currently valid
    for (let transition of this.moveState.transitions()) {
      if (
        transition in this.movePredicates &&
        this.movePredicates[transition]()
      ) {
        this.moveState[transition]();
        break;
      }
    }
    // Determining which animation state is currently valid
    for (let transition of this.animationState.transitions()) {
      if (
        transition in this.animationPredicates &&
        this.animationPredicates[transition]()
      ) {
        this.animationState[transition]();
        break;
      }
    }
    // Establishing correct collision box size based on animation state
    if (this.animationState.is('still')) {
      this.body.setSize(50, 140);
    } else if (this.animationState.is('running')) {
      this.body.setSize(65, 140);
    } else if (this.animationState.is('jumping')) {
      this.body.setSize(70, 140);
    } else if (this.animationState.is('falling')) {
      this.body.setSize(70, 140);
    }
  }
}
