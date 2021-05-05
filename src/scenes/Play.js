class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('background', 'Background.png');
        this.load.image('sea', 'EW_Sea.png');
        this.load.image('city', 'EW_City.png');
        this.load.image('HBoverlay', 'HBoverlay.png');
        this.load.image('HB1', 'HB1.png');
        this.load.image('HB2', 'HB2.png');
        this.load.image('HB3', 'HB3.png');
        this.load.image('HB4', 'HB4.png');
        this.load.image('enemy', 'enemy.png');
        this.load.image('player', 'Player.png');
        this.load.image('cross', 'Crosswalk.png');
        this.load.image('super_enemy', 'Super_Enemy.png');
        this.load.spritesheet('speedLines', 'SpeedLines.png', {frameWidth: 960, frameHeight: 720, startFrame: 0, endFrame: 2});
        this.load.atlas('steps', 'Player_Steps.png', 'Player_Steps.json');
        this.load.atlas('enemy_walk', 'Enemy_Walk.png', 'Enemy_Walk.json');
        this.load.atlas('player_up', 'Player_Up.png', 'Player_Up.json');
        this.load.atlas('player_down', 'Player_Down.png', 'Player_Down.json');
        this.load.audio('soundtrack', 'soundtrack.mp3');

        //Load Audio
        this.load.audio('dmg', '/SFX/dmg.wav');
        this.load.audio('EE', '/SFX/EE.mp3');
        this.load.audio('ER', '/SFX/ER.mp3');
        this.load.audio('AH', '/SFX/AH.mp3');
        this.load.audio('high1', '/SFX/high1.mp3');
        this.load.audio('high2', '/SFX/high2.mp3');
        this.load.audio('high3', '/SFX/high3.mp3');
        this.load.audio('high4', '/SFX/high4.mp3');
        this.load.audio('low1', '/SFX/low1.mp3');
        this.load.audio('low2', '/SFX/low2.mp3');
        this.load.audio('low3', '/SFX/low3.mp3');
        this.load.audio('low4', '/SFX/low4.mp3');
        this.load.audio('left1', '/SFX/left1.mp3');
        this.load.audio('left2', '/SFX/left2.mp3');
        this.load.audio('left3', '/SFX/left3.mp3');
        this.load.audio('left4', '/SFX/left4.mp3');
        this.load.audio('right1', '/SFX/right1.mp3');
        this.load.audio('right2', '/SFX/right2.mp3');
        this.load.audio('right3', '/SFX/right3.mp3');
        this.load.audio('right4', '/SFX/right4.mp3');
    }

    moveForward() {
        this.bg.tilePositionX += 16;
        this.crosswalk.x -= 15;
        this.crosswalk.y += 5.5;
        this.stepsTraveled += 1;
        for(let enemy of this.enemies.getChildren()) {
            enemy.x -= 15;
            enemy.y += 5.5;
        }
        for(let superEnemy of this.superEnemies.getChildren()) {
            superEnemy.x -= 15;
            superEnemy.y += 5.5;
        }

    }

    doStrafe(direction) {
            if(direction == 'left' && this.player.y > this.swLeftBorder) {
                this.player.y -= this.strafeDistance;
                this.player.x -= this.strafeDistance;
            } else if(direction == 'right' && this.player.y < this.swRightBorder) {
                this.player.y += this.strafeDistance;
                this.player.x += this.strafeDistance;
            }
            this.movedLeft = false;
            this.movedRight = false;
    }


    doTrip(fastOrRepeat) {
        this.sound.play('dmg', {
            volume: 0.7,
        });
        if(fastOrRepeat == 'fast') {
            console.log('you walked too fast, and you tripped');
        } else if(fastOrRepeat == 'repeat') {
            console.log('you forgot how to walk, and you tripped');
        }


        this.player.angle = 90; //Make player 'trip'
        this.player.x += 180; //Correct x, y after rotation
        this.player.y += 80;
        this.player.setOffset(-100,10); //Correct hitbox
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
        let spawnLayer;
        let top, bottom, left, right = false;

        //Set x and y for either top or bottom spawn
        if(rndTopBottom == 0){
            swOffsetY = this.enemyInitBottomY;
            swOffsetX = this.enemyInitBottomX;
            bottom = true;
        } else if(rndTopBottom == 1) {
            swOffsetY = this.enemyInitTopY;
            swOffsetX = this.enemyInitTopX;
            top = true;
        }

        //Set x for either left or right spawn
        if(rndLeftRight == 0) { 
            swOffsetX += 50;
            left = true;
        } else if(rndLeftRight == 1) {
            swOffsetX += 280;
            right = true;
        }

        //Randomizes whether enemy is a SuperEnemy or not
        let newEnemy;
        if (Math.random() < .75){
            //Create new enemy, add them to the enemies group, and play walking animation
            newEnemy = new Enemy(this, swOffsetX, swOffsetY, 'enemy').setOrigin(0,0);
            this.enemies.add(newEnemy);
            newEnemy.play('enemyWalk');
        }
        else{
            newEnemy = new SuperEnemy(this,swOffsetX, swOffsetY, 'Super_Enemy').setOrigin(0,0);
            this.superEnemies.add(newEnemy);
            newEnemy.play('super_walk');
        }

        if(top){
            if(left) {
                spawnLayer = this.enemyLayerTopLeft;
            } else {
                spawnLayer = this.enemyLayerTopRight;
            }
        } else {
            if(left) {
                spawnLayer = this.enemyLayerBottomLeft;
            } else {
                spawnLayer = this.enemyLayerBottomRight;
            }
        }
        spawnLayer.add(newEnemy);

    }

    enemyCollide(player, enemy) {  
        if(!this.justCollided){
            //Play Sound
            this.playEnemySound();
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
                let sorry = this.add.text(this.player.x, this.player.y-25, this.sorryText, { fontFamily: 'Helvetica', fontSize: '20px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'left' }).setOrigin(0.5,0);
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
        if(value > 0) {
            this.cameras.main.shake(200);
        }

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

    playFootstep(leftOrRight) {
        let leftSteps = ['left1', 'left2', 'left3', 'left4'];
        let rightSteps = ['right1', 'right2', 'right3', 'right4'];
        let footstep;
        if(leftOrRight == 'left') {
            footstep = leftSteps[Math.floor(Math.random()*leftSteps.length)];
        } else {
            footstep = rightSteps[Math.floor(Math.random()*rightSteps.length)];
        }
        this.sound.play(footstep, {
            volume: 0.6,
            rate: 2,
        });
    }

    playEnemySound() {
        let voiceArray = ['EE', 'ER', 'AH', 'high1', 'high2', 'high3', 'high4', 'low1', 'low2', 'low3', 'low4'];
        let enemySound = voiceArray[Math.floor(Math.random()*voiceArray.length)];
        this.sound.play(enemySound, {
            volume: 0.7,
        });
    }

    doGameOver() {
        this.gameOver = true;
        for(let enemy of this.enemies.getChildren()) {
            enemy.stop();
        }
        for(let superEnemy of this.superEnemies.getChildren()) {
            superEnemy.stop();
        }
        // this.add.text(game.config.width / 3, game.config.height / 2, 'GAMEOVER', { fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'right' });
        // this.add.text((game.config.width / 5) * 2, (game.config.height / 7) * 4, 'press R to restart', { fontFamily: 'Helvetica', fontSize: '30px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'right' });
        
        //Make gameOverText visible
        this.gameOverText.alpha = 1;
        this.rToRestartText.alpha = 1;

        //Stop soundtrack from playing
        this.soundtrack.stop();

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
        this.strafeDistance = 20; //How far to strafe when player presses keyLEFT, or keyRIGHT //was 8 before
        this.moveDistance = 16; //How far to mave when player takes a step
        this.maxEnemies = 5;
        this.enemySpawnTime = 2000; //How many ms to spawn an enemy
        this.directionTimer = 1000; //How many ms to change enemy direction

        //Initialize location variables
        this.playerInitX = game.config.width / 2; //Initial Player x, y
        this.playerInitY = ((game.config.height / 4) * 2) + 30;
        this.swLeftBorder = this.playerInitY - 40; //sidewalk borders
        this.swRightBorder = this.playerInitY + 20;
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

        //Add music to the scene
        this.soundtrack = this.sound.add('soundtrack', {
            volume: 0.3,
            //rate: 0.9,
            loop: true,
        });
        this.soundtrack.play();
        

        //Reset rate when scene resets
        this.soundtrack.setRate(0.9);

        //Create string arrays for speech bubbles
        this.sorryArray = ['SORRY', 'omg I\'m so sorry', 'sorry', 'oops! sorry', 'oh no! sorry', 'I\'m stupid', 'oh god why me', 'please no']; //feel free to add more phrases
        this.sorryText = this.sorryArray[Math.floor(Math.random()*this.sorryArray.length)];

        //Add background
        this.bg = this.add.tileSprite(-375, 90, game.config.width*2, game.config.height*2, 'background').setOrigin(0,0); //replace
        this.bg.angle = -20;

        //create transition rectangle
        this.rectangle = this.add.rectangle(0,0, game.config.width, game.config.height, 0xf8f8ff).setOrigin(0,0);
        this.rectangle.alpha = 0;


        //Create crosswalk
        this.crosswalk = this.add.tileSprite(275, 201, 247, 368, 'cross').setOrigin(0,0);
        this.crosswalk.angle = 6.5;

        //Add health bar
        this.hb1 = this.add.tileSprite(20, 20, 240, 51, 'HB1').setOrigin(0,0);
        this.hb2 = this.add.tileSprite(20, 20, 240, 51, 'HB2').setOrigin(0,0);
        this.hb3 = this.add.tileSprite(20, 20, 240, 51, 'HB3').setOrigin(0,0);
        this.hb4 = this.add.tileSprite(20, 20, 240, 51, 'HB4').setOrigin(0,0);
        this.hbOverlay = this.add.tileSprite(20, 20, 240, 51, 'HBoverlay').setOrigin(0,0);

        //Add gameOverText
        this.gameOverText = this.add.text(game.config.width / 3, game.config.height / 2, 'GAMEOVER', { fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#FFFFFF00', color: '#000000', stroke: '#FFFFFF', strokeThickness: 3, align: 'right' });
        this.rToRestartText = this.add.text((game.config.width / 5) * 2, (game.config.height / 7) * 4, 'press R to restart', { fontFamily: 'Helvetica', fontSize: '30px', backgroundColor: '#FFFFFF00', color: '#000000', stroke: '#FFFFFF', strokeThickness: 3, align: 'right' });
        this.gameOverText.alpha = 0;
        this.rToRestartText.alpha = 0;

        //Add distance travelled
        let distanceTextConfig = { fontFamily: 'Helvetica', fontSize: '28px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'center' };
        this.distanceTravelledText = this.add.text(this.distanceTextX, this.distanceTextY, 'Distance Travelled:', distanceTextConfig);
        this.distanceSteps = this.add.text(this.distanceTextX, this.distanceTextY + 35, this.stepsTraveled + ' steps', distanceTextConfig);

        //Create character
        this.player = this.physics.add.sprite(this.playerInitX, this.playerInitY, 'player').setOrigin(0,0);
        this.player.setBodySize(this.player.width, this.player.height/6, true);
        this.player.setOffset(0, 130);

        //Create Animations
        this.anims.create({
            key: 'speedLines',
            frames: this.anims.generateFrameNumbers('speedLines', { start: 0, end: 2, first: 0}),
            frameRate: 6,
            repeat: -1
        })
        this.speedLines = this.add.sprite(0,0,'speedLines').setOrigin(0,0);
        this.speedLines.play('speedLines');
        this.speedLines.alpha = 0;

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
                prefix: 'Enemy_Walk',
                suffix: '.png'
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'super_walk',
            frames: this.anims.generateFrameNames('enemy_walk', {
                start: 1,
                end: 10,
                zeroPad: 2,
                prefix: 'super_',
                suffix: '.png'
            }),
            frameRate: 13,
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

        this.anims.create({
            key: 'crossDown',
            frames: this.anims.generateFrameNames('player_down', {
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
        this.playerLayer = this.add.layer();
        this.playerLayer.add([this.player]);
        this.enemyLayerTopLeft = this.add.layer();
        this.enemyLayerTopRight = this.add.layer();
        this.enemyLayerBottomLeft = this.add.layer();
        this.enemyLayerBottomRight = this.add.layer();

        this.enemyLayerTopLeft.setDepth(1);
        this.enemyLayerTopRight.setDepth(2);
        this.enemyLayerBottomLeft.setDepth(3);
        this.playerLayer.setDepth(4);
        this.enemyLayerBottomRight.setDepth(5);

        this.UILayer = this.add.layer();
        this.UILayer.add([this.gameOverText, this.rToRestartText, this.distanceTravelledText, this.distanceSteps, this.hb1, this.hb2, this.hb3, this.hb4, this.hbOverlay]);
        this.UILayer.setDepth(6);

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
        this.physics.add.overlap(this.player, this.superEnemies, this.enemyCollide, null, this);
    }

    update() {
        this.frameCounter++;

        //While gameOver = false
        if(!this.gameOver) {

            //Transition between backgrounds by fading to white
            if(this.stepsTraveled >= 15 && this.stepsTraveled <= 20){
                this.rectangle.alpha = (this.stepsTraveled - 15) / 5;
            }
            else if(this.stepsTraveled <= 25 && this.stepsTraveled >= 20) {
                this.rectangle.alpha = (this.stepsTraveled - 25) * -1 / 5;
            }
            else if(this.stepsTraveled >= 45 && this.stepsTraveled <= 50){
                this.rectangle.alpha = (this.stepsTraveled - 45) / 5;
            }
            else if(this.stepsTraveled <= 55 && this.stepsTraveled >= 50) {
                this.rectangle.alpha = (this.stepsTraveled - 55) * -1 / 5;
            }

            //Change backgrounds
            if(this.stepsTraveled > 20) {
                this.bg.setTexture('city');
            }
            if(this.stepsTraveled > 50) {
                this.bg.setTexture('sea');
            }

            // Speedlines logic
            // this.speedLines = this.add.sprite(0,0,'speedLines').setOrigin(0,0);
            // this.speedLines.alpha = 0;
            let vel = Math.abs((this.lastLeftStep - this.lastRightStep));
            if(vel <= this.tripSpeed * 2.5 && this.lastLeftStep != 0 && !this.justTripped) {
                if(vel > this.tripSpeed && vel <= this.tripSpeed + 3) {
                    this.speedLines.alpha = 1;
                } else if(vel > this.tripSpeed + 3 && vel <= this.tripSpeed + 6) {
                    this.speedLines.alpha = 0.75;
                } else if(vel > this.tripSpeed + 6 && vel <= this.tripSpeed + 9) {
                    this.speedLines.alpha = 0.5;
                } else if(vel > this.tripSpeed + 9 && vel <= this.tripSpeed + 12) {
                    this.speedLines.alpha = 0.25;
                } else {
                    this.speedLines.alpha = 0.1;
                }
                //this.speedLines.play('speedLines');
                //this.speedLines.alpha = Math.abs(((this.lastLeftStep-this.lastRightStep) / 0.3) / 100);
            } /*else {*/
                //this.speedLines.alpha = 0;
                //this.speedLines.destroy(); 
            // }
            this.time.delayedCall(1000, () => {
                this.speedLines.alpha = 0;
            });

            //Handle layers to make it seem 3D
            if(this.onTopSW) {
                this.enemyLayerTopLeft.setDepth(1);
                this.playerLayer.setDepth(2);
                this.enemyLayerTopRight.setDepth(3);
                this.enemyLayerBottomLeft.setDepth(4);
                this.enemyLayerBottomRight.setDepth(5);
            } else if(this.onBottomSW) {
                this.enemyLayerTopLeft.setDepth(1);
                this.enemyLayerTopRight.setDepth(2);
                this.enemyLayerBottomLeft.setDepth(3);
                this.playerLayer.setDepth(4);
                this.enemyLayerBottomRight.setDepth(5);
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
                    this.playFootstep('left');
                    this.movedLeft = true;
                    this.movedRight = false;
                } else if(this.movedLeft && Phaser.Input.Keyboard.JustDown(keyA)) { //Double A press causes trip
                    this.doTrip('repeat');
                    this.justTripped = true;
                    this.takeDmg(1);
                }

                //Right step check
                if(!this.movedRight && Phaser.Input.Keyboard.JustDown(keyD)) {
                    this.lastRightStep = this.frameCounter;
                    this.player.play('playerRight');
                    this.playFootstep('right');
                    this.moveForward();
                    this.movedRight = true;
                    this.movedLeft = false;
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
                this.player.setOffset(0, 130); //Correct hitbox

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
                this.onBottomSW && 
                Phaser.Input.Keyboard.JustDown(keyUP)) {

                //^walk across (still buggy) or v teleport
                    this.player.setOffset(0,2 * game.config.height);
                    this.player.play('crossUp');
                    this.player.on('animationcomplete', () => {
                        this.player.setOffset(0, 130);
                    });
                    this.player.y -= 320;
                    this.swLeftBorder = 20;
                    this.swRightBorder = 75;
                    this.onBottomSW = false;
                    this.onTopSW = true;
                    this.movedLeft = false;
                    this.movedRight = false;
            } 
            if (this.crosswalk.x + this.crosswalk.width/2 > this.player.x &&
                this.crosswalk.x - this.crosswalk.width/2 < this.player.x &&
                Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                
            //^walk across (still buggy) or v teleport
                this.player.y -= 320;
                this.player.setOffset(0,2 * game.config.height);
                this.player.play('crossDown');
                this.player.on('animationcomplete', () => {
                    this.player.setOffset(0, 130);
                    this.player.y += 320;
                });
                this.player.x = this.playerInitX
                this.swLeftBorder = this.playerInitY - 30; //sidewalk borders
                this.swRightBorder = this.playerInitY + 25;
                this.onBottomSW = true;
                this.onTopSW = false;
                this.movedLeft = false;
                this.movedRight = false;
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
            this.takeDmg(-1);
        }

        //Press ESC to return to Menu
        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.soundtrack.stop();
            this.scene.start("menuScene");
        }
    }
}