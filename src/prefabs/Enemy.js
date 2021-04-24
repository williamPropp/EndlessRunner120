class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //Add object to existing scene
        scene.add.existing(this);
        this.movementSpeed = 1;
        this.setScale(.3);
    }

    update() {
        this.x -= this.movementSpeed*2.6;
        this.y += this.movementSpeed;
    }
}