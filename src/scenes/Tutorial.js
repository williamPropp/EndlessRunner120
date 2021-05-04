class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");

    }

    preload(){
        this.load.path = './assets/';
        this.load.image('player', 'Player.png');
        this.load.image('cross', 'Crosswalk.png');
        this.load.atlas('steps', 'Player_Steps.png', 'Player_Steps.json');
        this.load.audio('beep', 'buttonPress.wav');
        this.load.audio('soundtrackTutorial', 'soundtrackTutorial.wav')
    }

    create() {
        // OG bg
        // let r1 = this.add.rectangle(0, 0, game.config.width*2, 170, 0x6666ff);

        this.r0 = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x1c3344).setOrigin(0,0);
        this.r10 = this.add.rectangle(game.config.width - 420, 0, game.config.width, game.config.height, 0x218e84).setOrigin(0,0);
        this.r10.angle = 20;
        this.r1 = this.add.rectangle(0, 0, game.config.width - 420, game.config.height, 0x1baca1).setOrigin(0,0);
        this.r20 = this.add.rectangle(game.config.width - 250, 85, game.config.width, game.config.height, 0xce815b).setOrigin(0,0);
        this.r20.angle = 19;
        this.r2 = this.add.rectangle(0, 85, game.config.width - 250, game.config.height, 0xf4a779).setOrigin(0,0);
        this.r30 = this.add.rectangle(game.config.width - 210, 265, game.config.width, game.config.height, 0xc94843).setOrigin(0,0);
        this.r30.angle = 18
        this.r3 = this.add.rectangle(0, 265, game.config.width - 210, game.config.height, 0xf36e63).setOrigin(0,0);
        this.r40 = this.add.rectangle(game.config.width - 70, 365, game.config.width, game.config.height, 0x1e3635).setOrigin(0,0);
        this.r40.angle = 17;
        this.r4 = this.add.rectangle(0, 365, game.config.width - 70, game.config.height, 0x3b5858).setOrigin(0,0);
        this.r5 = this.add.rectangle(0, 545, game.config.width, game.config.height, 0x6dac77).setOrigin(0,0);

        this.player1 = this.add.sprite(10, 100, 'player').setOrigin(0,0);
        this.player2 = this.add.sprite(100, 100, 'player').setOrigin(0,0);
        this.player3 = this.add.sprite(160, 290, 'player').setOrigin(0,0);
        this.player4 = this.add.sprite(10, 380, 'player').setOrigin(0,0);
        this.crosswalk = this.add.sprite(20, 580, 'cross').setOrigin(0,0);
        this.crosswalk.setScale(.3);

        //Play music
        this.soundtrackTutorial = this.sound.add('soundtrackTutorial', {
            volume: 0.3,
            //rate: 0.9,
            loop: true,
        });
        this.soundtrackTutorial.play();

        this.anims.create({
            key: 'playerLeft',
            frames: this.anims.generateFrameNames('steps', {
                start: 1,
                end: 3,
                zeroPad: 1,
                prefix: 'Player_Left0',
                suffix: '.png'
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'playerRight',
            frames: this.anims.generateFrameNames('steps', {
                start: 1,
                end: 3,
                zeroPad: 1,
                prefix: 'Player_Right0',
                suffix: '.png'
            }),
            frameRate: 8,
            repeat: -1
        });
        this.player1.play('playerLeft');
        this.player2.play('playerRight');
        this.player3.angle = 90;

        //Add beep sound to the scene
        this.beep = this.sound.add('beep', {
            volume: 0.8,
            loop: false,
        });

        let tutorialSmallConfig = { fontFamily: 'Helvetica', fontSize: '25px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'right' };
        this.add.text(5, 10, 'Press F to play', tutorialSmallConfig);
        this.add.text(5, 45, 'Press ESC to Return to Menu', tutorialSmallConfig);
        let tutorialBigConfig = { fontFamily: 'Helvetica', fontSize: '32px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'center' };
        this.add.text(game.config.width/2 - 40, game.config.height/4 - 40, 'Press A to step with your left foot', tutorialBigConfig).setOrigin(0.5,0);
        this.add.text(game.config.width/2 - 35, game.config.height/4 + 10, 'Press D to step with your right foot', tutorialBigConfig).setOrigin(0.5,0);
        this.add.text(game.config.width/2 - 20, game.config.height/4 + 120, 'Press SPACEBAR to get up if you trip', tutorialBigConfig).setOrigin(0.5,0);
        this.add.text(game.config.width/2 + 20, game.config.height/4 + 250, 'Avoid ppl by using the LEFT and RIGHT arrow keys', tutorialBigConfig).setOrigin(0.5,0);
        this.add.text(game.config.width/2, game.config.height/4 + 430, 'Cross the street using UP and DOWN arrow keys', tutorialBigConfig).setOrigin(0.5,0);


        //Define keys
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        //Starting conditions for this.player4
        this.moved = false; 
        this.pos = 0;
        this.dir = "right";
    }

    update() {
        //Start game when F is pressed
        if(this.keyF.isDown) {
            this.beep.play();
            this.scene.start("playScene");
        }

        //Return to Menu when R is pressed
        if(this.keyESC.isDown) {
            this.beep.play();
            this.scene.start("menuScene");
        }

        //Moves this.player4 left and right
        if(!this.moved){
            if(this.pos == 0){
                this.player4.x += 10;
                this.pos = 1;
                this.dir = "right";
                this.moved = true;

            }
            else if(this.pos == 1 && this.dir == "right"){
                this.player4.x += 10;
                this.pos = 2;
                this.dir == "left";
                this.moved = true;
            }
            else if(this.pos == 1 && this.dir == "left"){
                this.player4.x -= 10;
                this.pos = 0;
                this.dir == "right";
                this.moved = true;
            }
            else{
                this.player4.x -= 10;
                this.pos = 1;
                this.dir == "left";
                this.moved = true;
            }
            this.clock = this.time.delayedCall(500, () => {
                this.moved = false;
            }, null, this); 
        }


    }

}