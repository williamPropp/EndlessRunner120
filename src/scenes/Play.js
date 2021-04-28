class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('background', 'Background.png');
        this.load.image('HBoverlay', 'HBoverlay.png');
        this.load.image('HB1', 'HB1.png');
        this.load.image('HB2', 'HB2.png');
        this.load.image('HB3', 'HB3.png');
        this.load.image('HB4', 'HB4.png');
        //this.load.image('enemy', 'person.jpg');
        this.load.image('enemy', 'enemy.png');
        this.load.image('player', 'Player.png');
        this.load.image('cross', 'EW_Crosswalk.png');
        //this.load.spritesheet('playerLeftStep', 'assets/playerAtlas.png', {frameWidth: 55, frameHeight: 150, startFrame: 0, endFrame: 3});
    }

    moveForward() {
        this.bg.tilePositionX += 16;
        this.crosswalk.x -= 15;
        this.crosswalk.y += 5.5;
        this.stepsTraveled += 1;
        //this.person.x -= 15;
        //this.person.y += 5.5;
        for(let enemy of this.enemies.getChildren()) {
            enemy.x -= 15;
            enemy.x += 5.5;
        }
        console.log(this.crosswalk.y - this.player.y)
    }

    doStrafe(direction) {
            if(direction == 'left' && this.player.y > this.swLeftBorder) {
                this.player.y -= this.strafeDistance;
                this.player.x -= this.strafeDistance;
                console.log('you strafed left');
            } else if(direction == 'right' && this.player.y < this.swRightBorder) {
                this.player.y += this.strafeDistance;
                this.player.x += this.strafeDistance;
                console.log('you strafed right');
            }
    }


    doTrip(fastOrRepeat) {
        if(fastOrRepeat == 'fast') {
            console.log('you walked too fast, and you tripped');
        } else if(fastOrRepeat == 'repeat') {
            console.log('you forgot how to walk, and you tripped');
        }

        this.player.angle = 90; //Make player 'trip'
        this.player.x += 180; //Correct x, y after rotation
        this.player.y += 80;
    }

    //Spawn enemy on either side of the street
    spawnEnemy() {
        let rnd = Math.floor(Math.random() * 2);
        if(rnd == 0){
            console.log('enemy spawned on right sidewalk');
            let rndX = Math.floor(Math.random() * 283);
            let newEnemyRight = new Enemy(this, game.config.width + 290 + rndX, 50, 'enemy').setOrigin(0,0);
            this.enemies.add(newEnemyRight);
            //return new Enemy(this, game.config.width, 0 , 'enemy').setOrigin(0,0);
        } else if(rnd == 1){
            console.log('enemy spawned on left sidewalk');
            let rndX = Math.floor(Math.random() * 284);
            let newEnemyLeft = new Enemy(this, game.config.width - 120 + rndX, -150 , 'enemy').setOrigin(0,0);
            this.enemies.add(newEnemyLeft);
            //return new Enemy(this, game.config.width - 200, 0 , 'enemy').setOrigin(0,0);
        }
    }

    //Test if 2 sprite objects are colliding with eachother, returns boolean
    collisionTest(obj1, obj2) {
        // if((obj1.x <= (obj2.x + obj2.width)) &&
        //   (obj1.x >= obj2.x) && 
        //   ((obj1.y + ((obj1.height / 3) * 2)) <= (obj2.y + obj2.height)) &&  
        //   (obj1.y + obj1.height >= obj2.y + ((obj2.height / 3) * 2))) {
        //     return true;
        // } else {
        //     return false;
        // }
        console.log('player x,y,area: x=' + obj1.x + ', y=' + obj1.y + ', area = ' + (obj1.width * obj1.height) + '\n enemy x,y,area: x=' + obj1.x + ', y=' + obj1.y + ', area = ' + (obj1.width * obj1.height));    
        if((obj1.x <= (obj2.x + obj2.width)) && (obj1.x >= obj2.x) && (obj1.y <= obj2.y + obj2.height) && (obj1.y >= obj2.y)) {
            return true;
        } else {
            return false;
        }
    }

    //Pass takeDmg value n, where n = the amount of health to be removed from the player's health
    takeDmg(value) {
        this.playerHealth -= value;
        console.log('you took ' + value + ' damage, now playerHealth = ' + this.playerHealth);

        //Initialize array of hb sprites
        let hbArray = [this.hb1, this.hb2, this.hb3, this.hb4];

        if(this.playerHealth < 1) {
            this.doGameOver();
            for(let hbAll of hbArray) { //When gameOver triggers, make all hbSprites invisible
                hbAll.alpha = 0;
            }
        } else if(this.playerHealth < 5) { //When regular damage is taken, reset all hbSprites visibility
            for(let hbAll of hbArray) {
                hbAll.alpha = 1;
            }
            hbArray.splice(this.playerHealth - 1, 1); //Remove the correct sprite from the array
            for(let hbRemove of hbArray) { //Make all remaining hb  in the array invisible
                hbRemove.alpha = 0;
            }
        }
    }

    doGameOver() {
        this.gameOver = true;
        this.add.text(game.config.width / 3, game.config.height / 2, 'GAMEOVER', { fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'right' });
        this.add.text((game.config.width / 5) * 2, (game.config.height / 7) * 4, 'press R to restart', { fontFamily: 'Helvetica', fontSize: '30px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'right' });
    }

    create() {

        //Initialize data variables
        this.playerHealthMax = 4;
        this.playerHealth = this.playerHealthMax;
        this.frameCounter = 0;
        this.lastLeftStep = 0; //Frame # when you last took a step
        this.lastRightStep = 0;
        this.tripSpeed = 10; //Minimum frames inbetween steps that causes trip
        this.stepsTraveled = 0;
        this.strafeDistance = 8; //How far to strafe when player presses keyLEFT, or keyRIGHT
        this.moveDistance = 16; //How far to mave when player takes a step

        //Initialize location variables
        this.playerInitX = game.config.width / 2; //Initial Player x, y
        this.playerInitY = ((game.config.height / 4) * 2) + 30;
        this.swLeftBorder = this.playerInitY - 40; //sidewalk borders
        this.swRightBorder = this.playerInitY + 20;
        this.enemyInitX = game.config.width;
        this.enemyInitY = 0;

        
        //Initialize UI coordinate variables
        this.distanceTextX = game.config.width - (game.config.width / 3);
        this.distanceTextY = game.config.height / 32;

        //Add boolean flags
        this.gameOver = false;
        this.movedLeft = false;
        this.movedRight = false;
        this.justTripped = false;
        this.justCollided = false;

        //Add background
        this.bg = this.add.tileSprite(-375, 90, game.config.width*2, game.config.height*2, 'background').setOrigin(0,0);
        this.bg.angle = -20;

        //Create crosswalk
        this.crosswalk = this.add.tileSprite(220, 165, 222, 795, 'cross').setOrigin(0,0);
        this.crosswalk.angle = -57;

        //Add health bar
        this.hb1 = this.add.tileSprite(20, 20, 240, 51, 'HB1').setOrigin(0,0);
        this.hb2 = this.add.tileSprite(20, 20, 240, 51, 'HB2').setOrigin(0,0);
        this.hb3 = this.add.tileSprite(20, 20, 240, 51, 'HB3').setOrigin(0,0);
        this.hb4 = this.add.tileSprite(20, 20, 240, 51, 'HB4').setOrigin(0,0);
        this.hbOverlay = this.add.tileSprite(20, 20, 240, 51, 'HBoverlay').setOrigin(0,0);

        //Add distance travelled
        let distanceTextConfig = { fontFamily: 'Helvetica', fontSize: '28px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'center' };
        this.distanceTravelledText = this.add.text(this.distanceTextX, this.distanceTextY, 'Distance Travelled:', distanceTextConfig);
        this.distanceSteps = this.add.text(this.distanceTextX, this.distanceTextY + 35, this.stepsTraveled + ' steps', distanceTextConfig);

        //Create character
        //this.anims.create({ key: 'playerAtlas', frames: this.anims.generateFrameNumbers('playerAtlas', { start: 0, end: 0, first: 0}), frameRate: 15 });
        this.player = this.add.sprite(this.playerInitX, this.playerInitY, 'player').setOrigin(0,0);

        //Create enemy group
        this.enemies = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: null,
            defaultFrame: null,
            active: true,
            maxSize: -1, //max group size might be useful
            runChildUpdate: false,
            createCallback: null,
            removeCallback: null,
            createMultipleCallback: null
        });

        //Create one enemy
        //this.person = new Enemy(this, game.config.width / 2, 0, 'enemy').setOrigin(0,0);
         
        //Define keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update() {

        this.frameCounter++;

        //While gameOver = false
        if(!this.gameOver) {

            //Update enemy movement
            //this.person.update();

            //Update enemy group movement and test collision
            for(let enemy of this.enemies.getChildren()) {
                enemy.update();
                if(this.collisionTest(this.player,enemy) && !this.justCollided){
                    console.log('collision triggered')
                    this.takeDmg(1);
                    this.justCollided = true;
                }
                
            }

            //Only allow steps when you haven't tripped
            if(!this.justTripped) {

                //Left step check
                if(!this.movedLeft && Phaser.Input.Keyboard.JustDown(keyA)) {
                    this.lastLeftStep = this.frameCounter;
                    this.moveForward();
                    this.movedLeft = true;
                    this.movedRight = false;
                    //this.player.setFrame(2); //play left leg frame
                    console.log('left step');
                } else if(this.movedLeft && Phaser.Input.Keyboard.JustDown(keyA)) { //Double A press causes trip
                    this.doTrip('repeat');
                    this.justTripped = true;
                    this.takeDmg(1);
                }

                //Right step check
                if(!this.movedRight && Phaser.Input.Keyboard.JustDown(keyD)) {
                    this.lastRightStep = this.frameCounter;
                    this.moveForward();
                    this.movedRight = true;
                    this.movedLeft = false;
                    //this.player.setFrame(1); //play right leg frame
                    console.log('right step');
                } else if(this.movedRight && Phaser.Input.Keyboard.JustDown(keyD)) { //Double D press causes trip
                    this.doTrip('repeat');
                    this.justTripped = true;
                    this.takeDmg(1);
                }

                //Speed Check
                if(Math.abs(this.lastRightStep - this.lastLeftStep) != 0 && Math.abs(this.lastRightStep - this.lastLeftStep) < this.tripSpeed && !this.justTripped) {
                    this.doTrip('fast');
                    this.takeDmg(1);
                    this.justTripped = true;
                }

                //Strafe Left
                if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                    this.doStrafe('left');
                }

                //Strafe Right
                if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
                    this.doStrafe('right');
                }

                //Reset enemy position if they exit the screen
                // if(this.person.x + this.person.width < 1) {
                //     this.person.x = this.enemyInitX;
                //     this.person.y = this.enemyInitY;
                // }

            }

            //Get up after tripping by pressing SPACE
            if(this.justTripped && Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.player.angle = 0;
                this.player.x -= 180; //Correct x, y after rotation
                this.player.y -= 80;

                this.moveForward();
                this.lastLeftStep = 0;
                this.lastRightStep = this.tripSpeed * 2;
                this.justTripped = false;
                this.movedRight = false;
                this.movedLeft = false;
            }

            //Crosswalk logic
            if (this.crosswalk.y + this.player.y > 630 &&
                690 > this.crosswalk.y + this.player.y &&
                this.player.y >= 350 && 
                Phaser.Input.Keyboard.JustDown(keyUP)) {
                    // this.swLeftBorder = 100;
                    // this.swRightBorder = this.playerInitY + 20;
                    // this.swRightBorder = 155;
                //^walk across (still buggy) or v teleport
                    this.player.y -= 285;
                    this.player.x -= 200;
                    this.swLeftBorder = 80;
                    this.swRightBorder = 130;
            } 
            if (this.player.x < 441 &&
                this.player.x > 184 &&
                this.crosswalk.y - this.player.y > 67 &&
                this.crosswalk.y - this.player.y < 145 &&
                Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                    // this.swLeftBorder = this.playerInitY - 40; //sidewalk borders
                    // this.swRightBorder = this.playerInitY + 20;
            //^walk across (still buggy) or v teleport
                this.player.x = this.playerInitX
                this.player.y = this.playerInitY + 20
                this.swLeftBorder = this.playerInitY - 30; //sidewalk borders
                this.swRightBorder = this.playerInitY + 25;
            }
       
            //reset crosswalk
            if(this.crosswalk.x <= -660){
                this.crosswalk.x = 740;
                this.crosswalk.y = -25;
            }

            //Update score
            this.distanceSteps.setText(this.stepsTraveled + ' steps');

            }
        
        //Press R to restart, once you get a gameOver
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }


        
        //CHEAT CODES:

        //Press G to trigger gameOver
        if(Phaser.Input.Keyboard.JustDown(keyG)) {
            this.doGameOver();
        }

        //Press X to spawn enemy
        if(Phaser.Input.Keyboard.JustDown(keyX)) {
            this.spawnEnemy();
            this.justCollided = false;
        }

        //Press Z to subtract 1 from playerHealth
        if(Phaser.Input.Keyboard.JustDown(keyZ)) {
            this.takeDmg(1);
            console.log('playerHealth = ' + this.playerHealth);
        }
    }
}