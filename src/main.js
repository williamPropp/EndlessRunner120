// Left, Right: and Endless Walker
// Collaborators: Ivan Garcia-Sanchez, Jesus Picos, William Propp
// Date Completed: 5/3/2021
// Creative Tilt: 


let config = {
    type: Phaser.Canvas,
    width: 960,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [Menu, Tutorial, Play]
}

let game = new Phaser.Game(config);

let keyF, keyA, keyD, keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE, keyG, keyR, keyX, keyZ, keyE, keyESC;
