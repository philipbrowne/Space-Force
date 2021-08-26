class Hero extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero-run-sheet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.anims.play('hero-standing');
    this.setOrigin(0.5, 0.5);
    this.body.setCollideWorldBounds(true);
    this.body.setSize(27, 70);
    this.body.setMaxVelocity(300, 600);
    this.body.setDragX(600);
    this.keys = scene.cursorKeys;
    this.input = {};
    this.setupAnimations();
    this.setupMovement();
  }

  setupAnimations() {
    this.animState = new StateMachine({
      init: 'standing',
      transitions: [
        {
          name: 'stand',
          from: ['falling', 'running'],
          to: 'standing',
        },
        {
          name: 'run',
          from: ['falling', 'standing'],
          to: 'running',
        },

        {
          name: 'jump',
          from: ['standing', 'running'],
          to: 'jumping',
        },
        {
          name: 'doubleJump',
          from: ['jumping', 'falling'],
          to: 'doubleJumping',
        },
        {
          name: 'fall',
          from: ['standing', 'running', 'jumping', 'doubleJumping'],
          to: 'falling',
        },
        {
          name: 'die',
          from: ['standing', 'running', 'jumping', 'doubleJumping', 'falling'],
          to: 'dead',
        },
      ],
      methods: {
        onEnterState: (lifecycle) => {
          this.anims.play('hero-' + lifecycle.to);
          console.log(lifecycle);
        },
      },
    });
    this.animPredicates = {
      stand: () => {
        return this.body.onFloor() && this.body.velocity.x === 0;
      },
      run: () => {
        return (
          this.body.onFloor() &&
          Math.sign(this.body.velocity.x) === (this.flipX ? -1 : 1)
        );
      },
      jump: () => {
        return this.body.velocity.y < 0;
      },
      doubleJump: () => {
        return this.body.velocity.y < 0 && this.moveState.is('doubleJumping');
      },
      fall: () => {
        return this.body.velocity.y > 0;
      },
    };
  }
  setupMovement() {
    this.moveState = new StateMachine({
      init: 'standing',
      transitions: [
        { name: 'jump', from: 'standing', to: 'jumping' },
        { name: 'doubleJump', from: 'jumping', to: 'doubleJumping' },
        { name: 'fall', from: 'standing', to: 'falling' },
        {
          name: 'land',
          from: ['jumping', 'doubleJumping', 'falling'],
          to: 'standing',
        },
        {
          name: 'die',
          from: ['standing', 'jumping', 'doubleJumping', 'falling'],
          to: 'dead',
        },
      ],
      methods: {
        onEnterState: (lifecycle) => {
          this.anims.play('hero-' + lifecycle.to);
          console.log(lifecycle);
        },
        onJump: () => {
          this.body.setVelocityY(-370);
        },
        onDoubleJump: () => {
          this.body.setVelocityY(-200);
        },
        onDie: () => {
          this.body.setVelocity(0, -600);
          this.body.setAcceleration(0);
        },
      },
    });
    this.movePredicates = {
      jump: () => {
        return this.input.pressJump;
      },
      doubleJump: () => {
        return this.input.pressJump;
      },
      fall: () => {
        return !this.body.onFloor();
      },
      land: () => {
        return this.body.onFloor();
      },
    };
  }

  isDead() {
    return this.moveState.is('dead');
  }

  kill() {
    if (this.moveState.can('die')) {
      this.moveState.die();
      this.animState.die();
      this.emit('died');
    }
  }
  // preUpdate(time, delta) {
  //   super.preUpdate(time, delta);
  //   this.input.pressJump =
  //     !this.isDead() && Phaser.Input.Keyboard.JustDown(this.keys.up);
  //   if (!this.isDead() && this.keys.left.isDown) {
  //     this.body.setAccelerationX(-800);
  //     this.setFlipX(true);
  //     this.body.offset.x = 16;
  //   } else if (!this.isDead() && this.keys.right.isDown) {
  //     this.body.setAccelerationX(800);
  //     this.setFlipX(false);
  //     this.body.offset.x = 0;
  //   } else {
  //     this.body.setAccelerationX(0);
  //     this.body.offset.x = -2;
  //   }
  //   if (this.moveState.is('jumping') || this.moveState.is('doubleJumping')) {
  //     if (!this.keys.up.isDown && this.body.velocity.y < -120) {
  //       this.body.setVelocityY(-120);
  //     }
  //   }

  //   for (const t of this.moveState.transitions()) {
  //     if (t in this.movePredicates && this.movePredicates[t]()) {
  //       this.moveState[t]();
  //       break;
  //     }
  //   }
  //   for (const t of this.animState.transitions()) {
  //     if (t in this.animPredicates && this.animPredicates[t]()) {
  //       this.animState[t]();
  //       break;
  //     }
  //   }
  // }
}
