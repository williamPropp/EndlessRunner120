class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //Add object to existing scene
        scene.add.existing(this);

        //Enemy Speed (divided by 5 to slow them down a bit)
        this.mvmtX = 15 / 5;
        this.mvmtY = 5.5 / 5;

        this.enemyInsult = scene.add.text(this.x-120, this.y-80, this.genInsult(), this.insultTextConfig);
        this.enemyInsult.alpha = 0;

        this.insultDisplayed = false;
    }

    preload() {
        this.load.path = './assets/';
        this.load.image('speechBubble', 'speechBubble.png')
    }

    genInsult() {
        let insults = ['HEY, watch it buddy!', 'BRO?!', 'seriously...', '*hard sigh*', '&%$#%$#!!!']; //feel free to add more phrases
        let rndInsult = Math.floor(Math.random()*insults.length);
        return rndInsult;
    }

    displayInsult() {
        this.speechBubble = this.add.sprite(/*sizeX, sizeY, */this.x-120, this.y-80, 'speechBubble');
        this.enemyInsult.alpha = 1;
        this.insultDisplayed = true;
        this.time.delayedCall(2000, () => {
            this.speechBubble.alpha = 0;
            this.enemyInsult.alpha = 0;
        });
    }

    update() {
        //Move Enemy
        this.x -= this.mvmtX;
        this.y += this.mvmtY;

        //Move Insult text
        this.enemyInsult.x -= this.mvmtX;
        this.enemyInsult.y += this.mvmtY;

        if(this.insultDisplayed) {
            this.speechBubble.x -= this.mvmtX;
            this.speechBubble.y += this.mvmtY;
        }

    }
}