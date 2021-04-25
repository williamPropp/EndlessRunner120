class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");

    }

    create() {

        let tutorialSmallConfig = { fontFamily: 'Helvetica', fontSize: '25px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'right' };
        this.add.text(5, 10, 'Press F to play', tutorialSmallConfig);
        this.add.text(5, 45, 'Press R to Return to Menu', tutorialSmallConfig);
        let tutorialBigConfig = { fontFamily: 'Helvetica', fontSize: '32px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'center' };
        this.add.text(game.config.width/2, game.config.height/4, 'Press A to step with you left foot', tutorialBigConfig).setOrigin(0.5,0);
        this.add.text(game.config.width/2, game.config.height/4 + 50, 'Press D to step with you right foot', tutorialBigConfig).setOrigin(0.5,0);
        this.add.text(game.config.width/2, game.config.height/4 + 100, 'Press SPACEBAR to get up if you trip', tutorialBigConfig).setOrigin(0.5,0);
        this.add.text(game.config.width/2, game.config.height/4 + 150, 'Don\'t bump into ppl by using the LEFT and RIGHT arrow keys', tutorialBigConfig).setOrigin(0.5,0);
        this.add.text(game.config.width/2, game.config.height/4 + 200, 'Cross the street using UP and DOWN arrow keys', tutorialBigConfig).setOrigin(0.5,0);


        //Define keys
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        //Start game when F is pressed
        if(this.keyF.isDown) {
            this.scene.start("playScene");
        }

        //Return to Menu when R is pressed
        if(this.keyR.isDown) {
            this.scene.start("menuScene");
        }


    }

}