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
        this.load.image('enemy', 'enemy.png');
        this.load.image('player', 'Player.png');
        this.load.image('cross', 'Crosswalk.png');
        //this.load.image('speechBubble', 'Speech_Bubble.png');
        this.load.atlas('steps', 'Player_Steps.png', 'Player_Steps.json');
        this.load.atlas('enemy_walk', 'Enemy_Walk.png', 'Enemy_Walk.json');
        this.load.atlas('player_up', 'Player_Up.png', 'Player_Up.json');
    }

    moveForward() {
        this.bg.tilePositionX += 16;
        this.crosswalk.x -= 15;
        this.crosswalk.y += 5.5;
        this.stepsTraveled += 1;
        // for(let enemy of this.enemies.getChildren()) {
        //     enemy.x -= 15;
        //     enemy.x += 5.5;
        // }
        //console.log(this.crosswalk.y - this.player.y)
    }

    doStrafe(direction) {
            if(direction == 'left' && this.player.y > this.swLeftBorder) {
                this.player.y -= this.strafeDistance;
                this.player.x -= this.strafeDistance;
                //console.log('you strafed left');
            } else if(direction == 'right' && this.player.y < this.swRightBorder) {
                this.player.y += this.strafeDistance;
                this.player.x += this.strafeDistance;
                //console.log('you strafed right');
            }
            this.movedLeft = false;
            this.movedRight = false;
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
        
        //Randomize enemySpawnTime
        this.enemySpawnTime = 2000 + Math.floor(Math.random() * 2000);

        //50-50 chance of enemy spawning on top or bottom sidewalk
        let rndTopBottom = Math.floor(Math.random() * 2);

        //50-50 chance whether the enemy is on the left or right side of the sidewalk
        let rndLeftRight = Math.floor(Math.random() * 2);

        //let bubble = this.add.sprite(150, 100, this.x-120, this.y-80, 'speechBubble')

        let swOffsetX;
        let swOffsetY;
        let consoleTopBottom;
        let consoleLeftRight;


        //Set x and y for either top or bottom spawn
        if(rndTopBottom == 0){
            swOffsetY = this.enemyInitBottomY;
            swOffsetX = this.enemyInitBottomX;
            consoleTopBottom = 'enemy spawned on bottom sidewalk, ';
        } else if(rndTopBottom == 1) {
            swOffsetY = this.enemyInitTopY;
            swOffsetX = this.enemyInitTopX;
            consoleTopBottom = 'enemy spawned on top sidewalk, ';
        }

        //Set x for either left or right spawn
        if(rndLeftRight == 0) { 
            swOffsetX += 50;
            consoleLeftRight = 'left side';
        } else if(rndLeftRight == 1) {
            swOffsetX += 280;
            consoleLeftRight = 'right side';
        }

        //Randomizes whether enemy is a SuperEnemy or not
        let rand = Math.random();
        console.log("rand is" + rand);
        if (rand < .75){
            //Create new enemy, add them to the enemies group, and play walking animation
            let newEnemy = new Enemy(this, swOffsetX, swOffsetY, 'enemy').setOrigin(0,0);
            this.enemies.add(newEnemy);
            this.enemyLayer.add(newEnemy);
            newEnemy.play('enemyWalk');
            console.log(consoleTopBottom + consoleLeftRight);
        }
        else{
            let newEnemy = new SuperEnemy(this,swOffsetX, swOffsetY, 'enemy').setOrigin(0,0);
            this.superEnemies.add(newEnemy);
            this.enemyLayer.add(newEnemy);
            newEnemy.play('enemyWalk');
            console.log(consoleTopBottom + consoleLeftRight);
            console.log("SuperEnemy spawned")
        }


    }

    enemyCollide(player, enemy) {  
        if(!this.justCollided){
            if(this.enemies.contains(enemy)) {
                this.takeDmg(1);
            }
            else{
                this.takeDmg(2);
            }
            
            enemy.displayInsult();
            this.time.delayedCall(1500, () => {
                if(!this.gameOver) {
                    this.justCollided = false;
                    enemy.destroyInsult();
                }

                this.sorryText = this.sorryArray[Math.floor(Math.random()*this.sorryArray.length)];
                let sorry = this.add.text(this.playerInitX, this.playerInitY-40, this.sorryText, { fontFamily: 'Helvetica', fontSize: '20px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'left' }).setOrigin(0.5,0);
                this.time.delayedCall(1500, () => {
                    sorry.destroy();
                });
            });
        } 
        this.justCollided = true;
    }

    //Pass takeDmg value n, where n = the amount of health to be removed from the player's health
    takeDmg(value) {
        this.playerHealth -= value;
        this.cameras.main.shake(200);
        console.log('you took ' + value + ' damage, now playerHealth = ' + this.playerHealth);

        //Initialize array of hb sprites
        let hbArray = [this.hb1, this.hb2, this.hb3, this.hb4];

        if(this.playerHealth < 1) {
            this.doGameOver();
            for(let hbAll of hbArray) { //When gameOver triggers, make all hbSprites invisible
                hbAll.alpha = 0;
            }
        } else if(this.playerHealth <= this.playerHealthMax) { //When regular damage is taken, reset all hbSprites visibility
            for(let hbAll of hbArray) {
                hbAll.alpha = 1;
            }
            hbArray.splice(this.playerHealth - 1, 1); //Remove the correct sprite from the array
            for(let hbRemove of hbArray) { //Make all remaining hb  in the array invisible
                hbRemove.alpha = 0;
            }
        } else if(this.playerHealth > this.playerHealthMax) {
            this.playerHealth = this.playerHealthMax;
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
        this.maxEnemies = 5;
        this.enemySpawnTime = 2000; //How many ms to spawn an enemy
        this.directionTimer = 1000; //How many ms to change enemy direction

        //Initialize location variables
        this.playerInitX = game.config.width / 2; //Initial Player x, y
        this.playerInitY = ((game.config.height / 4) * 2) + 30;
        this.swLeftBorder = this.playerInitY - 40; //sidewalk borders
        this.swRightBorder = this.playerInitY + 20;
        // this.swLeftTop = game.config.width - 120;
        // this.swLeftBottom = game.config.width + 290;
        this.enemyInitTopX = game.config.width - 120;
        this.enemyInitBottomX = game.config.width + 290;
        this.enemyInitTopY = -150;
        this.enemyInitBottomY = 50;
        
        //Initialize UI coordinate variables
        this.distanceTextX = game.config.width - (game.config.width / 3);
        this.distanceTextY = game.config.height / 32;

        //Add boolean flags
        this.gameOver = false;
        this.movedLeft = false;
        this.movedRight = false;
        this.justTripped = false;
        this.justCollided = false;
        this.spawnedEnemy = false;
        this.onTopSW = false;
        this.onBottomSW = true;

        //Create string arrays for speech bubbles
        // this.enemyInsults = ['HEY, watch it buddy!', 'BRO?!', 'seriously...', '*hard sigh*', '&%$#%$#!!!']; //feel free to add more phrases
        this.sorryArray = ['SORRY', 'omg I\'m so sorry', 'sorry', 'oops! sorry', 'oh no! sorry', 'I\'m stupid', 'oh god why me', 'please no']; //feel free to add more phrases
        this.sorryText = this.sorryArray[Math.floor(Math.random()*this.sorryArray.length)];
        //this.doIKnowThatGuy = ['Wait, oh no, do I know him from somewhere?', 'shoot, is that Jerry??']; //This is for super enemy if we add them

        //Create Speech text config
        this.speechTextConfig = { fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'right' }

        //Add background
        this.bg = this.add.tileSprite(-375, 90, game.config.width*2, game.config.height*2, 'background').setOrigin(0,0);
        this.bg.angle = -20;

        //Create crosswalk
        this.crosswalk = this.add.tileSprite(275, 201, 247, 368, 'cross').setOrigin(0,0);
        this.crosswalk.angle = 6.5;

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
        this.player = this.physics.add.sprite(this.playerInitX, this.playerInitY, 'player').setOrigin(0,0);
        this.player.setBodySize(this.player.width, this.player.height/4, true);
        this.player.setOffset(0, 110);

        //Create Animations
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
            repeat: 0
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
            repeat: 0
        });

        this.anims.create({
            key: 'enemyWalk',
            frames: this.anims.generateFrameNames('enemy_walk', {
                start: 1,
                end: 10,
                zeroPad: 2,
                prefix: 'Enemy_Walk0',
                suffix: '.png'
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'crossUp',
            frames: this.anims.generateFrameNames('player_up', {
                start: 1,
                end: 12,
                zeroPad: 2,
                prefix: 'Player_Cross_',
                suffix: '.png'
            }),
            frameRate: 8,
            repeat: 0
        });

        //Create enemy group
        this.enemies = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: null,
            defaultFrame: null,
            active: true,
            maxSize: this.maxEnemies,
            runChildUpdate: false,
            createCallback: null,
            removeCallback: null,
            createMultipleCallback: null
        });

        //Create super enemy group
        this.superEnemies = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: null,
            defaultFrame: null,
            active: true,
            maxSize: this.maxEnemies,
            runChildUpdate: false,
            createCallback: null,
            removeCallback: null,
            createMultipleCallback: null
        });

        //Spawn first enemy
        this.time.delayedCall(this.enemySpawnTime, () => {
            this.spawnEnemy();
            this.spawnedEnemy = false;
        });
        
        //Create Layers
        // this.playerLayer = this.add.layer(this, [this.player]);
        // this.enemyLayer = this.add.layer(this, this.enemies.getChildren());

        // this.playerLayer = new Layer(this, [this.player]);
        // this.enemyLayer = new Layer(this, this.enemies.getChildren());

        this.playerLayer = this.add.layer();
        this.playerLayer.add([this.player]);
        this.enemyLayer = this.add.layer();

        // const enemyLayer = this.add.layer();
        // enemyLayer.add(this.enemies.getChildren());

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
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);


        //Create overlap physics between player and enemies
        this.physics.add.overlap(this.player, this.enemies, this.enemyCollide, null, this);
    }

    update() {
        this.frameCounter++;

        //While gameOver = false
        if(!this.gameOver) {

            //Handle layers to make it seem 3D
            if(this.onTopSW) {
                if(this.player.x > game.config.width/2 - 30) {
                    this.enemyLayer.setDepth(1);
                    this.playerLayer.setDepth(2);
                } else {
                    this.enemyLayer.setDepth(2);
                    this.playerLayer.setDepth(1);
                }
            } else if(this.onBottomSW) {
                if(this.player.x > game.config.width/2) {
                    this.enemyLayer.setDepth(1);
                    this.playerLayer.setDepth(2);
                } else {
                    this.enemyLayer.setDepth(2);
                    this.playerLayer.setDepth(1);
                }
            }

            //Update enemy group movement and spawn more enemies every x milliseconds, where x = this.enemySpawnTime
            for(let enemy of this.enemies.getChildren()) {
                enemy.update();

                //If enemies leave screen, they are destroyed
                if(enemy.x < -1 * (enemy.width)) {
                    this.enemies.remove(enemy); //Remove them from the group
                    enemy.destroy(); //Then destroy them
                }

                //Only spawn an enemy if there are les enemies than the max
                if(this.enemies.getLength() < this.maxEnemies && !this.spawnedEnemy) {
                    this.spawnedEnemy = true;
                    this.time.delayedCall(this.enemySpawnTime, () => {
                        this.spawnEnemy();
                        this.spawnedEnemy = false;
                    });
                }
                
            }

            //Update super enemy group movement and spawn more enemies every x milliseconds, where x = this.enemySpawnTime
            for(let enemy of this.superEnemies.getChildren()) {
                enemy.update();

                //If enemies leave screen, they are destroyed
                if(enemy.x < -1 * (enemy.width)) {
                    this.superEnemies.remove(enemy); //Remove them from the group
                    enemy.destroy(); //Then destroy them
                }

                //Only spawn an enemy if there are les enemies than the max
                if(this.superEnemies.getLength() < this.maxEnemies && !this.spawnedEnemy) {
                    this.spawnedEnemy = true;
                    this.time.delayedCall(this.enemySpawnTime, () => {
                        this.spawnEnemy();
                        this.spawnedEnemy = false;
                    });
                }
                
            }

            //Only allow steps when you haven't tripped
            if(!this.justTripped) {

                //Left step check
                if(!this.movedLeft && Phaser.Input.Keyboard.JustDown(keyA)) {
                    this.lastLeftStep = this.frameCounter;
                    this.player.play('playerLeft');
                    this.moveForward();
                    this.movedLeft = true;
                    this.movedRight = false;
                    //this.player.setFrame(2); //play left leg frame
                    //console.log('left step');
                } else if(this.movedLeft && Phaser.Input.Keyboard.JustDown(keyA)) { //Double A press causes trip
                    this.doTrip('repeat');
                    this.justTripped = true;
                    this.takeDmg(1);
                }

                //Right step check
                if(!this.movedRight && Phaser.Input.Keyboard.JustDown(keyD)) {
                    this.lastRightStep = this.frameCounter;
                    this.player.play('playerRight');
                    this.moveForward();
                    this.movedRight = true;
                    this.movedLeft = false;
                    //this.player.setFrame(1); //play right leg frame
                    //console.log('right step');
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
            if (this.crosswalk.x + this.crosswalk.width/2 > this.player.x &&
                this.crosswalk.x - this.crosswalk.width/2 < this.player.x &&
                this.player.y >= 350 && 
                Phaser.Input.Keyboard.JustDown(keyUP)) {
                    // this.swLeftBorder = 100;
                    // this.swRightBorder = this.playerInitY + 20;
                    // this.swRightBorder = 155;
                //^walk across (still buggy) or v teleport
                    this.player.play('crossUp');
                    this.player.y -= 320;
                    this.swLeftBorder = 20;
                    this.swRightBorder = 75;
                    this.onBottomSW = false;
                    this.onTopSW = true;
            } 
            if (this.crosswalk.x + this.crosswalk.width/2 > this.player.x &&
                this.crosswalk.x - this.crosswalk.width/2 < this.player.x &&
                Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                    // this.swLeftBorder = this.playerInitY - 40; //sidewalk borders
                    // this.swRightBorder = this.playerInitY + 20;
            //^walk across (still buggy) or v teleport
                this.player.x = this.playerInitX
                this.player.y = this.playerInitY + 20
                this.swLeftBorder = this.playerInitY - 30; //sidewalk borders
                this.swRightBorder = this.playerInitY + 25;
                this.onBottomSW = false;
                this.onTopSW = true;
            }
       
            //reset crosswalk
            if(this.crosswalk.x <= -660){
                this.crosswalk.x = 995;
                this.crosswalk.y = -60;
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

        //Press E to spawn enemy
        if(Phaser.Input.Keyboard.JustDown(keyE)) {
            this.spawnEnemy();
        }

        //Press Z to subtract 1 from playerHealth
        if(Phaser.Input.Keyboard.JustDown(keyZ)) {
            this.takeDmg(1);
            //console.log('playerHealth = ' + this.playerHealth);
        }

        //Press X to add 1 to playerHealth
        if(Phaser.Input.Keyboard.JustDown(keyX)) {
            this.playerHealth++;
            //console.log('playerHealth = ' + this.playerHealth);
        }

        //Press ESC to return to Menu
        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.start("menuScene");
        }
    }
}





//POLLING BASED VERSION OF ENEMY COLLISION DETECTION

//Test if 2 sprite objects are colliding with eachother, returns boolean
// collisionTest(obj1, obj2) {
//     //Uncomment this console.log() to see live updates of enemy x, y and area
//     //console.log('player x,y,area: x=' + obj1.x + ', y=' + obj1.y + ', area = ' + (obj1.width * obj1.height) + '\n enemy x,y,area: x=' + obj2.x + ', y=' + obj2.y + ', area = ' + (obj2.width * obj2.height));    
//     if((obj1.x <= (obj2.x + obj2.width)) && (obj1.x >= obj2.x) && (obj1.y <= obj2.y + obj2.height) && (obj1.y >= obj2.y)) {
//         //console.log('collision triggered');
//         return true;
//     } else {
//         return false;
//     }
// }

//Run this every frame in update()
// if(this.collisionTest(this.player,enemy) && !this.justCollided){
//     console.log('collision triggered')
//     this.takeDmg(1);
//     this.justCollided = true;
//     this.time.delayedCall(this.enemySpawnTime, () => {
//         this.justCollided = false;
//     });
// }




// More efficient enemySpawn() maybe
// let swOffsetX;
// let swOffsetY;
// let consoleTopBottom;
// let consoleLeftRight;

// if(rndTopBottom == 0){
//     swOffsetY = this.enemyInitBottomY;
//     swOffsetX = this.enemyInitBottomX;
//     consoleTopBottom = 'enemy spawned on bottom sidewalk, ';
// } else if(rndTopBottom == 1) {
//     swOffsetY = this.enemyInitTopY;
//     swOffsetX = this.enemyInitTopX;
//     consoleTopBottom = 'enemy spawned on top sidewalk, ';
// }

// if(rndLeftRight == 0) { 
//     swOffsetX += 50;
//     consoleTopBottom = 'left side';
// } else if(rndLeftRight == 1) {
//     swOffsetX += 283;
//     consoleTopBottom = 'right side';
// }

// let newEnemy = new Enemy(this, swOffsetX, swOffsetY, 'enemy').setOrigin(0,0);
// this.enemies.add(newEnemy);
// newEnemy.play('enemyWalk');
// console.log(consoleTopBottom + consoleLeftRight);