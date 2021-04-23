class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('background', 'EW_street-01.png'); //'tempBG.png');
    }

    moveForward() {
        this.bg.tilePositionX += 16;
    }

    doTrip(tooFast, repeat) {
        if(tooFast) {
            console.log('you walked too fast, and you tripped dummy');
        }
        if(repeat) {
            console.log('you forgot how to walk, and you tripped dummy');
        }
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
        this.bg = this.add.tileSprite(-375, 200, game.config.width*2, game.config.height*2, 'background').setOrigin(0,0);
        this.bg.angle = -20;


        //Define keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {

        this.frameCounter++;

        //Left step check
        if(!this.movedLeft && Phaser.Input.Keyboard.JustDown(keyA) && !this.justTripped) {
            this.lastLeftStep = this.frameCounter;
            this.moveForward();
            this.movedLeft = true;
            this.movedRight = false;
            console.log('left step');
        } else if(this.movedLeft && Phaser.Input.Keyboard.JustDown(keyA) && !this.justTripped) {
            this.doTrip(false, true);
            this.justTripped = true;
        }

        //Right step check
        if(!this.movedRight && Phaser.Input.Keyboard.JustDown(keyD) && !this.justTripped) {
            this.lastRightStep = this.frameCounter;
            this.moveForward();
            this.movedRight = true;
            this.movedLeft = false;
            console.log('right step');
        } else if(this.movedRight && Phaser.Input.Keyboard.JustDown(keyD) && !this.justTripped) {
            this.doTrip(false, true);
            this.justTripped = true;
        }

        //Get up after tripping by pressing SPACE
        if(this.justTripped && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.moveForward();
            this.lastLeftStep += this.tripSpeed + 1;
            this.justTripped = false;
            this.movedRight = false;
            this.movedLeft = false;
        }

        //Speed Check
        if(Math.abs(this.lastRightStep - this.lastLeftStep) != 0 && Math.abs(this.lastRightStep - this.lastLeftStep) < this.tripSpeed && !this.justTripped) {
            this.doTrip(true, false);
            this.justTripped = true;
        }

    }
}