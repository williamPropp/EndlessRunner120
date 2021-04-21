let config = {
    type: Phaser.Canvas,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);
