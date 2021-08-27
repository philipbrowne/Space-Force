class Hero extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero-run-sheet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.anims.play('hero-running');
    this.body.setCollideWorldBounds(true);
    this.body.setCollideWorldBounds(true);
    this.body.setSize(65, 140);
    this.body.setMaxVelocity(350, 500);
    this.body.setDragX(700);
    this.dirKeys = scene.cursorKeys;
    this.aKey = scene.aKey;
    this.dKey = scene.dKey;
    this.wKey = scene.wKey;
    this.spaceKey = scene.cursorKeys.space;
    this.input = {};
    this.movement();
    this.jumpKey();
  }

  //   https://github.com/jakesgordon/javascript-state-machine
  //   states of movement for hero character
  movement() {
    this.moveState = new StateMachine({
      init: 'standing',
      transitions: [
        { name: 'jump', from: 'standing', to: 'jumping' },
        { name: 'fall', from: 'standing', to: 'falling' },
        { name: 'land', from: ['jumping', 'falling'], to: 'standing' },
      ],
      methods: {
        onEnterState: (lifecycle) => {
          console.log(lifecycle);
        },
        onJump: () => {
          this.body.setVelocityY(-400);
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

  jumpKey() {
    if (
      Phaser.Input.Keyboard.JustDown(this.dirKeys.up) ||
      Phaser.Input.Keyboard.JustDown(this.wKey) ||
      Phaser.Input.Keyboard.JustDown(this.spaceKey)
    ) {
      return true;
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.input.pressedJump = this.jumpKey();
    if (this.dirKeys.left.isDown || this.aKey.isDown) {
      this.body.setAccelerationX(-1500);
      this.setFlipX(true);
      this.body.offset.x = 25;
    } else if (this.dirKeys.right.isDown || this.dKey.isDown) {
      this.body.setAccelerationX(1500);
      this.setFlipX(false);
      this.body.offset.x = 20;
    } else {
      this.body.setAccelerationX(0);
    }
    if (this.input.didJump && this.body.onFloor()) {
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
  }
}
