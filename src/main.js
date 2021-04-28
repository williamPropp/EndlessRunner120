let config = {
    type: Phaser.Canvas,
    width: 960,
    height: 720,
    scene: [Menu, Tutorial, Play]
}

let game = new Phaser.Game(config);

let keyF, keyA, keyD, keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE, keyG, keyR, keyX, keyZ, keyE;
