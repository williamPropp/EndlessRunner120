// Left, Right: an Endless Walker
// Collaborators: Ivan Garcia-Sanchez, Jesus Picos, William Propp
// Date Completed: 5/3/2021
/* Creative Tilt: For technicality, we implemented Phaser's layer system. It was important 
to us that our game be isometric, but implementing this was a lot harder than we initially 
anticipated. Characters would render over eachother in awkward ways, and the movement was 
difficult to get right, but luckily we overcame this challenge by using layers. For style, 
we turned the endless runner, which is notorious for its increasing speed, into an endless 
walker with a speed cap. In order to emphasize the need to be conscious of your movement, 
we implemented a left and right step mechanic instead of traditional forward involuntary 
moment. This gives the player the agency to move as they wish around the sidewalks and 
crosswalk but also directly links the embarrassment of messing up to the player's input. 
We're particularly proud of the music and art we were able to make, and feel it's very 
consistent with our intended aesthetic.*/


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

let keyF, keyA, keyD, keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE, keyG, keyR, keyX, keyZ, keyC, keyE, keyESC;
