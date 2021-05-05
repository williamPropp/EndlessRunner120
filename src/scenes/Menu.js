class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");

    }

    preload() {

        //Load all assets
        this.load.path = './assets/';
        this.load.image('menuScreen', 'Menu.png');
        this.load.audio('soundtrackMenu', 'soundtrackMenu.mp3');
        this.load.audio('beep', 'buttonPress.wav');

    }

    create() {

        //Creat title screen
        this.add.tileSprite(0, 0, game.config.width, game.config.height, 'menuScreen').setOrigin(0, 0);

        //Add music to the scene
        this.soundtrackMenu = this.sound.add('soundtrackMenu', {
            volume: 0.3,
            //rate: 0.9,
            loop: true,
        });
        this.soundtrackMenu.play();

        //Add beep sound to the scene
        this.beep = this.sound.add('beep', {
            volume: 0.8,
            loop: false,
        });

        //Reset rate when scene resets
        this.soundtrackMenu.setRate(0.9);

        //Define keys
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    }

    update() {

        //Start game when F is pressed
        if(this.keyF.isDown) {
            this.soundtrackMenu.stop();
            this.beep.play();
            this.scene.start("playScene");

        }

        //Show tutorial when R is pressed
        if(this.keyR.isDown) {
            this.soundtrackMenu.stop();
            this.beep.play();
            this.scene.start("tutorialScene");
        }
    }
}