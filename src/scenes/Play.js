class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('background', 'EW_bg_flipped.png');
        this.load.image('HBoverlay', 'HBoverlay.png');
        this.load.image('HB1', 'HB1.png');
        this.load.image('HB2', 'HB2.png');
        this.load.image('HB3', 'HB3.png');
        this.load.image('HB4', 'HB4.png');
        this.load.image('enemy', 'person.jpg');
    }

    moveForward() {
        this.bg.tilePositionX += 16;
        this.stepsTravelled += 1;
        console.log(this.stepsTravelled);
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

        //Initialize data variables
        this.playerHealth = 4;
        this.frameCounter = 0;
        this.lastLeftStep = 0;
        this.lastRightStep = 0;
        this.tripSpeed = 10;
        this.stepsTravelled = 0;
        
        //Initialize UI coordinate variables
        this.distanceTextX = game.config.width - (game.config.width / 3);
        this.distanceTextY = game.config.height / 32;

        //Add boolean flags
        this.gameOver = false;
        this.movedLeft = false;
        this.movedRight = false;
        this.justTripped = false;

        //Add background
        this.bg = this.add.tileSprite(-375, 200, game.config.width*2, game.config.height*2, 'background').setOrigin(0,0);
        this.bg.angle = -20;

        //Add health bar
        this.hb1 = this.add.tileSprite(20, 20, 240, 51, 'HB1').setOrigin(0,0);
        this.hb2 = this.add.tileSprite(20, 20, 240, 51, 'HB2').setOrigin(0,0);
        this.hb3 = this.add.tileSprite(20, 20, 240, 51, 'HB3').setOrigin(0,0);
        this.hb4 = this.add.tileSprite(20, 20, 240, 51, 'HB4').setOrigin(0,0);
        this.hbOverlay = this.add.tileSprite(20, 20, 240, 51, 'HBoverlay').setOrigin(0,0);

        //Add distance travelled
        let distanceTextConfig = { fontFamily: 'Helvetica', fontSize: '28px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'right' };
        this.distanceTravelledText = this.add.text(this.distanceTextX, this.distanceTextY, 'Distance Travelled:', distanceTextConfig);
        this.distanceSteps = this.add.text(this.distanceTextX, this.distanceTextY + 35, this.stepsTravelled + ' steps', distanceTextConfig);

        //Create enemy
        this.person = new Enemy(this, game.config.width , game.config.height , 'enemy').setOrigin(0,0);
         
        //Define keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {

        this.frameCounter++;

        //Update enemy movement
        this.person.update();

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

        //Update score
        this.distanceSteps.setText(this.stepsTravelled + ' steps');

    }
}