import Phaser from "phaser";
import { initData } from "./Globals";
import { gameConfig } from "./appconfig";

let xOffset = 0.5;
let yOffset = 0.5;

export class LineGenerator extends Phaser.GameObjects.Container {
    lineArr: Lines[] = [];

    constructor(scene: Phaser.Scene, yOf: number, xOf: number) {
        super(scene);
        xOffset = xOf;
        yOffset = yOf;
        console.log("lines", xOffset, yOffset, this.scene);
        
        // Create lines based on initData
        for (let i = 0; i < initData.gameData.Lines.length; i++) {
            let line = new Lines(scene, i);
            line.setPosition(-xOffset, -yOffset);
            this.add(line);
            this.lineArr.push(line);
        }
        this.setPosition(gameConfig.scale.width / 3.6, gameConfig.scale.height/2);
        this.setScale(0.9, 0.8);
        // Add this Container to the scene
        scene.add.existing(this);
    }

    showLines(lines: number[]) {

        lines.forEach(lineIndex => {
            if (lineIndex >= 0 && lineIndex < this.lineArr.length) {
                this.lineArr[lineIndex].showLine();
            }
        });
    } 

    hideLines() {
        this.lineArr.forEach(line => line.hideLine());
    }
}

export class Lines extends Phaser.GameObjects.Graphics {
    constructor(scene: Phaser.Scene, index: number) {
        super(scene);

        let lastPosX = xOffset;
        let lastPosY = yOffset * initData.gameData.Lines[index][0];

        this.visible = false;
        const yLineOffset = 48;

        // Set the initial position of the line
        this.setPosition(-xOffset * 5, yOffset * initData.gameData.Lines[index][0] - yLineOffset);

        // Draw the line
        this.lineStyle(10, 0xFFEA31, 1);
        this.beginPath();
        this.moveTo(lastPosX, lastPosY - yLineOffset);

        for (let i = 1; i < initData.gameData.Lines[index].length; i++) {
            this.lineTo(lastPosX + xOffset * i, yOffset * initData.gameData.Lines[index][i] - yLineOffset);          
            lastPosY = yOffset * initData.gameData.Lines[index][i] - yLineOffset;
            
        }
        this.strokePath();
        // Add this Graphics object to the scene
        scene.add.existing(this);
    }

    showLine() {
        this.setVisible(true);
    }

    hideLine() {
        this.setVisible(false);
    }
}
