class Hero extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero-run-sheet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.anims.play('hero-still');
    this.body.setCollideWorldBounds(true);
    this.body.setSize(65, 130);
    this.body.setMaxVelocity(350, 500);
    this.body.setDragX(700);
    this.setOrigin(0.5, 1);
    this.dirKeys = scene.cursorKeys;
    this.aKey = scene.aKey;
    this.dKey = scene.dKey;
    this.wKey = scene.wKey;
    this.spaceKey = scene.cursorKeys.space;
    var hx = this.color === 'blue' ? 110 : -40;
    this.input = {};
    this.movement();
    this.animations();
    this.jumpKey();
    this.health;
  }

  //   https://github.com/jakesgordon/javascript-state-machine
  //   states of movement for hero character
  movement() {
    this.moveState = new StateMachine({
      init: 'standing',
      // Valid movement states to transition to and from
      transitions: [
        { name: 'jump', from: 'standing', to: 'jumping' },
        { name: 'fall', from: 'standing', to: 'falling' },
        { name: 'land', from: ['jumping', 'falling'], to: 'standing' },
        { name: 'die', from: ['standing', 'falling', 'jumping'], to: 'dead' },
      ],
      // Movement side effects for jump and death
      methods: {
        onJump: () => {
          this.body.setVelocityY(-400);
        },
        onDie: () => {
          this.body.setVelocity(0, -300);
          this.body.setAcceleration(0);
        },
      },
    });
    //   Establishing logic for each movement transition
    this.movePredicates = {
      jump: () => {
        return this.input.pressedJump;
      },
      fall: () => {
        return !this.body.onFloor();
      },
      land: () => {
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
        { name: 'die', from: '*', to: 'dead' },
      ],
      methods: {
        onEnterState: (lifecycle) => {
          // plays animation from game.js file
          this.anims.play(`hero-${lifecycle.to}`);
          // Prints current animation state in console for debugging purposes
          console.log(lifecycle);
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
  // Jump Inputs - more can be added in future
  jumpKey() {
    if (
      Phaser.Input.Keyboard.JustDown(this.dirKeys.up) ||
      Phaser.Input.Keyboard.JustDown(this.wKey) ||
      Phaser.Input.Keyboard.JustDown(this.spaceKey)
    ) {
      return true;
    }
  }

  // Changes Movement and Animation State to Dead
  kill() {
    // Determines if movement transition is valid based on this.movement() and emits 'died' event to trigger game callbacks
    if (this.moveState.can('die')) {
      this.moveState.die();
      this.animationState.die();
      this.emit('died');
    }
    this.health -= 0.2;
  }

  // Creates a check for movement conditionals below
  isDead() {
    return this.moveState.is('dead');
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.input.pressedJump = this.jumpKey();
    if (!this.isDead() && (this.dirKeys.left.isDown || this.aKey.isDown)) {
      this.body.setAccelerationX(-1500);
      this.setFlipX(true);
      this.body.offset.x = 25;
    } else if (
      !this.isDead() &&
      (this.dirKeys.right.isDown || this.dKey.isDown)
    ) {
      this.body.setAccelerationX(1500);
      this.setFlipX(false);
      this.body.offset.x = 20;
    } else {
      this.body.setAccelerationX(0);
    }
    if (this.input.pressedJump && this.body.onFloor()) {
      this.body.setVelocityY(-400);
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
