// import Phaser from "phaser";
// import { initData } from "./Globals";
// import { gameConfig } from "./appconfig";

// let xOffset = 0.5;
// let yOffset = 0.5;

// export class LineGenerator extends Phaser.GameObjects.Container {
//     lineArr: Lines[] = [];

//     constructor(scene: Phaser.Scene, yOf: number, xOf: number) {
//         super(scene);
//         xOffset = xOf;
//         yOffset = yOf;
        
//         // Create lines based on initData
//         for (let i = 0; i < initData.gameData.Lines.length; i++) {
//             let line = new Lines(scene, i);
//             line.setPosition(-xOffset, -yOffset);
//             this.add(line);
//             this.lineArr.push(line);
//         }
//         this.setPosition(gameConfig.scale.width / 3.6, gameConfig.scale.height/2);
//         this.setScale(0.9, 0.8);
//         // Add this Container to the scene
//         scene.add.existing(this);
//     }

//     showLines(lines: number[]) {

//         lines.forEach(lineIndex => {
//             if (lineIndex >= 0 && lineIndex < this.lineArr.length) {
//                 this.lineArr[lineIndex].showLine();
//             }
//         });
//     } 

//     hideLines() {
//         this.lineArr.forEach(line => line.hideLine());
//     }
// }

// export class Lines extends Phaser.GameObjects.Graphics {
//     constructor(scene: Phaser.Scene, index: number) {
//         super(scene);

//         let lastPosX = xOffset;
//         let lastPosY = yOffset * initData.gameData.Lines[index][0];

//         this.visible = false;
//         const yLineOffset = 48;

//         // Set the initial position of the line
//         this.setPosition(-xOffset * 5, yOffset * initData.gameData.Lines[index][0] - yLineOffset);

//         // Draw the line
//         this.lineStyle(10, 0xFFEA31, 1);
//         this.beginPath();
//         this.moveTo(lastPosX, lastPosY - yLineOffset);

//         for (let i = 1; i < initData.gameData.Lines[index].length; i++) {
//             this.lineTo(lastPosX + xOffset * i, yOffset * initData.gameData.Lines[index][i] - yLineOffset);          
//             lastPosY = yOffset * initData.gameData.Lines[index][i] - yLineOffset;
            
//         }
//         this.strokePath();
//         // Add this Graphics object to the scene
//         scene.add.existing(this);
//     }

//     showLine() {
//         this.setVisible(true);
//     }

//     hideLine() {
//         this.setVisible(false);
//     }
// }

import Phaser from "phaser";
import { initData } from "./Globals";
import { gameConfig } from "./appconfig";

let xOffset = 0.5;
let yOffset = 0.5;

export class LineGenerator extends Phaser.GameObjects.Container {
    lineArr: Lines[] = [];
    numberArr: Phaser.GameObjects.Text[] = [];

    constructor(scene: Phaser.Scene, yOf: number, xOf: number) {
        super(scene);
        xOffset = xOf;
        yOffset = yOf;

        // Create lines based on initData
        for (let i = 0; i < initData.gameData.Lines.length; i++) {
            let line = new Lines(scene, i);
            this.add(line);
            this.lineArr.push(line);
        }
        this.setPosition(gameConfig.scale.width / 4.1, gameConfig.scale.height/2.9);
        // Add this Container to the scene
        scene.add.existing(this);
    }


    showLines(lines: number[]) {
        // console.log(lines, "lines");
        
        lines.forEach(lineIndex => {
            if (lineIndex >= 0 && lineIndex < this.lineArr.length) {
                // console.log(this.lineArr[lineIndex], "this.lineArr[lineIndex]");
                this.lineArr[lineIndex].showLine();
            }
        });
    }

    hideLines() {
        this.lineArr.forEach(line => line.hideLine());
    }
}

export class Lines extends Phaser.GameObjects.Container {
    lineSprites: Phaser.GameObjects.Sprite[] = [];

    constructor(scene: Phaser.Scene, index: number) {
        super(scene);

        const yLineOffset = 80;
        const points = initData.gameData.Lines[index];

        // Create line sprites between points
        for (let i = 0; i < points.length - 1; i++) {
            const startX = i * xOffset ;
            const startY = yOffset * points[i] - yLineOffset;
            const endX = (i + 1) * xOffset;
            const endY = yOffset * points[i + 1] - yLineOffset;

            const distance = Phaser.Math.Distance.Between(startX, startY, endX, endY);
            const angle = Phaser.Math.Angle.Between(startX, startY, endX, endY);
             
            const lineSprite = this.createLineSprite(scene, startX, startY, distance, angle);
            this.lineSprites.push(lineSprite);
            this.add(lineSprite);
        }

        // Initialize all line sprites to be invisible
        this.hideLine();

        // Add this Container to the scene
        scene.add.existing(this);
    }

    createLineSprite(scene: Phaser.Scene, startX: number, startY: number, distance: number, angle: number): Phaser.GameObjects.Sprite {
        // Assuming 'lineSegment' is the key of your preloaded sprite
        const lineSprite = scene.add.sprite(startX, startY, 'winLine');

        // Adjust the size of the sprite to match the distance between points
        lineSprite.setDisplaySize(distance, lineSprite.height + 5); 

        // Set the rotation of the sprite to match the angle between points
        lineSprite.setRotation(angle);

        lineSprite.setOrigin(0, 0.5); // Set origin to the left center so it stretches correctly
        
        // Initialize sprite as invisible
        lineSprite.setVisible(false);
        
        return lineSprite;
    }

    showLine() {

        this.lineSprites.forEach(sprite => sprite.setVisible(true));
    }

    hideLine() {
        this.lineSprites.forEach(sprite => sprite.setVisible(false));
    }
}
