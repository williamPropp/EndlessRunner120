class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('background', 'tempBG.png');
    }

    create() {

        //Initialize variables
        this.frameCounter = 0;
        this.lastLeftStep = 0;
        this.lastRightStep = 0;
        this.tripSpeed = 10;

        //Add boolean flags
        this.movedLeft = false;
        this.movedRight = false;
        this.justTripped = false;

        //Add background
        this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0,0);

        //Define keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update() {

        this.frameCounter++;

        //Left step check
        if(!this.movedLeft && Phaser.Input.Keyboard.JustDown(keyD) && !this.justTripped) {
            this.lastLeftStep = this.frameCounter;
            this.bg.tilePositionX += 32;
            this.bg.tilePositionY -= 32;
            this.movedLeft = true;
            this.movedRight = false;
        }

        //Right step check
        if(!this.movedRight && Phaser.Input.Keyboard.JustDown(keyA) && !this.justTripped) {
            this.lastRightStep = this.frameCounter;
            this.bg.tilePositionY -= 32;
            this.bg.tilePositionX += 32;
            this.movedRight = true;
            this.movedLeft = false;
        }

        //Get up after tripping by pressing SPACE
        if(this.justTripped && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.bg.tilePositionY -= 32;
            this.bg.tilePositionX += 32;
            this.lastLeftStep += this.tripSpeed + 1;
            this.justTripped = false;
        }

        //Speed Check
        if(Math.abs(this.lastRightStep - this.lastLeftStep) != 0 && Math.abs(this.lastRightStep - this.lastLeftStep) < this.tripSpeed && !this.justTripped) {
            console.log('you walked too fast, and you tripped dummy');
            this.justTripped = true;
        }

    }
}