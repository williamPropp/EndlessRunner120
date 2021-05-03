class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");

    }

    preload(){
        this.load.path = './assets/';
        this.load.image('player', 'Player.png');
        this.load.image('cross', 'Crosswalk.png');
        this.load.atlas('steps', 'Player_Steps.png', 'Player_Steps.json');
    }

    create() {
        let r1 = this.add.rectangle(0, 0, game.config.width*2, 170, 0x6666ff);

        this.player1 = this.add.sprite(10, 100, 'player').setOrigin(0,0);
        this.player2 = this.add.sprite(100, 100, 'player').setOrigin(0,0);
        this.player3 = this.add.sprite(160, 290, 'player').setOrigin(0,0);
        this.player4 = this.add.sprite(10, 380, 'player').setOrigin(0,0);
        this.crosswalk = this.add.sprite(10, 560, 'cross').setOrigin(0,0);
        this.crosswalk.setScale(.3);

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

        let tutorialSmallConfig = { fontFamily: 'Helvetica', fontSize: '25px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'right' };
        this.add.text(5, 10, 'Press F to play', tutorialSmallConfig);
        this.add.text(5, 45, 'Press ESC to Return to Menu', tutorialSmallConfig);
        let tutorialBigConfig = { fontFamily: 'Helvetica', fontSize: '32px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'center' };
        this.add.text(game.config.width/2 - 40, game.config.height/4 - 40, 'Press A to step with your left foot', tutorialBigConfig).setOrigin(0.5,0);
        this.add.text(game.config.width/2 - 35, game.config.height/4 + 10, 'Press D to step with your right foot', tutorialBigConfig).setOrigin(0.5,0);
        this.add.text(game.config.width/2 - 20, game.config.height/4 + 120, 'Press SPACEBAR to get up if you trip', tutorialBigConfig).setOrigin(0.5,0);
        this.add.text(game.config.width/2 + 20, game.config.height/4 + 240, 'Avoid ppl by using the LEFT and RIGHT arrow keys', tutorialBigConfig).setOrigin(0.5,0);
        this.add.text(game.config.width/2, game.config.height/4 + 400, 'Cross the street using UP and DOWN arrow keys', tutorialBigConfig).setOrigin(0.5,0);


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
            this.scene.start("playScene");
        }

        //Return to Menu when R is pressed
        if(this.keyESC.isDown) {
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