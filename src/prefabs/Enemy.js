class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //Add object to existing scene
        scene.add.existing(this);
        this.movementSpeed = 1;
        this.changeDir = false;
        this.goingLeft = false;
        this.goingRight = false;
    }

    update() {
        this.x -= this.movementSpeed*2.75;
        this.y += this.movementSpeed;

        let rndPath = Math.floor(Math.random() * 2);
        if(rndPath == 1) {
            this.x += this.movementSpeed*2.75;
            this.y += this.movementSpeed;
        } else if(rndPath == 0) {
            this.x -= this.movementSpeed*2.75;
            this.y -= this.movementSpeed;
        }

        // if(this.goingLeft) {
        //     this.x -= this.movementSpeed*2.75;
        //     this.y -= this.movementSpeed;
        //     if(this.x < game.config.width + 290) {
        //         this.goingRight = false;
        //     }
        // } else if(this.goingRight) {
        //     this.x += this.movementSpeed*2.75;
        //     this.y += this.movementSpeed;
        //     if(this.x < game.config.width + 290) {
        //         this.goingRight = false;
        //     }
        // }

        // if(this.ChangeDir) {
        //     this.changeDir = false;
        //     if(this.goingLeft) {
        //         this.x += this.movementSpeed*2.75;
        //         this.y += this.movementSpeed;
        //         if(this.x <= ) {
        //             this.goingLeft = false;
        //         }
        //     } else if(this.goingRight) {
        //         this.goingRight = false;
        //         this.x -= this.movementSpeed*2.75;
        //         this.y -= this.movementSpeed;
        //         if(this.x >= swBorder) {
        //             this.goingLeft = false;
        //         }
        //     }
        //}
    }

    switchDirection() {
        this.changeDir = true;
    }
}