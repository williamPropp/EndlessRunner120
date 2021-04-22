class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");

    }

    preload() {

        //Load all assets
        this.load.path = './assets/';
        this.load.image('menuScreen', 'tempMenu.png');

    }

    create() {

        //Creat title screen
        this.add.tileSprite(0, 0, game.config.width, game.config.height, 'menuScreen').setOrigin(0, 0);

        //Define keys
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    }

    update() {

        //Start game when F is pressed
        if(this.keyF.isDown) {
            this.scene.start("playScene");
        }

    }
}