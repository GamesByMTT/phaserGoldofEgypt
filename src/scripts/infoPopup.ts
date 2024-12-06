import Phaser, { Scene } from "phaser";
import { Globals, initData, ResultData } from "./Globals";
import { gameConfig } from "./appconfig";

export default class InfoScene extends Scene{
    pageviewContainer!: Phaser.GameObjects.Container;
    popupBackground!: Phaser.GameObjects.Sprite
    SceneBg!: Phaser.GameObjects.Sprite
    Symbol1!: Phaser.GameObjects.Sprite
    leftArrow!: Phaser.GameObjects.Sprite
    rightArrow!: Phaser.GameObjects.Sprite
    infoCross!: Phaser.GameObjects.Sprite
    currentPageIndex: number = 0;
    pages: Phaser.GameObjects.Container[] = [];
    constructor(){
        super({key: 'InfoScene'})
    }
    create(){
        const {width, height} =  this.cameras.main
        this.SceneBg = new Phaser.GameObjects.Sprite(this, width / 2, height / 2, 'Background')
        .setDisplaySize(width, height)
        .setDepth(11)
        .setInteractive();
        this.SceneBg.on('pointerdown', (pointer:Phaser.Input.Pointer)=>{
            pointer.event.stopPropagation();
        })
        this.pageviewContainer = this.add.container();
        this.popupBackground = new Phaser.GameObjects.Sprite(this, gameConfig.scale.width/2, gameConfig.scale.height/2, "infoPopupBg")
        const inputOverlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7)
            .setOrigin(0, 0)
            .setDepth(16)
            .setInteractive();
    
        inputOverlay.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            pointer.event.stopPropagation();
        });
        this.pageviewContainer.add([inputOverlay, this.popupBackground])
        this.leftArrow = new Phaser.GameObjects.Sprite(this, gameConfig.scale.width * 0.155, gameConfig.scale.height * 0.75, "leftArrow").setInteractive();
        this.rightArrow = new Phaser.GameObjects.Sprite(this, gameConfig.scale.width * 0.845, gameConfig.scale.height * 0.75, "rightArrow").setInteractive();
        this.infoCross = new Phaser.GameObjects.Sprite(this, gameConfig.scale.width * 0.82, gameConfig.scale.height * 0.15, "exitButton").setInteractive()
        this.infoCross.on('pointerdown', ()=>{
            if(Globals.SceneHandler?.getScene("InfoScene")){
                Globals.SceneHandler.removeScene("InfoScene")
            }
        });
        this.leftArrow.on('pointerdown', ()=>{
            this.goToPreviousPage();
        })
        this.rightArrow.on('pointerdown', ()=>{
            this.goToNextPage()
        })
        this.pageviewContainer.add([this.leftArrow, this.rightArrow, this.infoCross])
        this.pages = []
        this.createPages()

    }
    createPages() {
        // Create pages and add content
        this.pages[1] = this.add.container(0, 0);
        
        const Heading = this.add.text(960, 280, "Minor Symbols", {fontFamily:"Sava", color:"#632e2e", fontSize:"50px"}).setOrigin(0.5)

        const symbol0 = this.add.sprite(550, 450, "slots0_0").setOrigin(0.5).setScale(0.7)
        const symbol1 = this.add.sprite(930, 450, "slots1_0").setOrigin(0.5).setScale(0.7);
        const symbol2 = this.add.sprite(1300, 450, "slots2_0").setOrigin(0.5).setScale(0.7);
        const symbol3 = this.add.sprite(740, 680, "slots3_0").setOrigin(0.5).setScale(0.7)
        const symbol4 = this.add.sprite(1185, 680, "slots4_0").setOrigin(0.5).setScale(0.7)
     
        const infoIcons = [
            { x: 650, y: 470 }, // Position for infoIcon2
            { x: 1030, y: 470 }, // Position for infoIcon3
            { x: 1400, y: 470 }, //
            { x: 840, y: 700 }, //
            { x: 1285, y: 700 }, //
        ]

         initData.UIData.symbols.forEach((symbol, symbolIndex) => {
            // Get the corresponding infoIcon position
            const iconPosition = infoIcons[symbolIndex];

            if (!iconPosition) return; // Avoid undefined positions

            // Loop through each multiplier in the current symbol
            
            symbol.multiplier.forEach((multiplierValueArray, multiplierIndex, array) => {
                if (Array.isArray(multiplierValueArray)) {
                    const multiplierValue = multiplierValueArray[0];
                    if (multiplierValue > 0) {  // Skip the loop iteration if multiplierValue is 0
                        const prefix = (5 - multiplierIndex) + "x"; // No need for an array lookup
                        let text = `${prefix} - ${multiplierValue} \n`;            
                        // Create the text object
                        const textObject = this.add.text(
                            iconPosition.x, // X position (you might want to offset this)
                            iconPosition.y + multiplierIndex * 50, // Y position (spacing between lines)
                            text,
                            { fontFamily: "Sava", fontSize: '30px', color: '#632e2e' } // Customize text style
                        );
                        // Optionally adjust the position further based on requirements
                        textObject.setLineSpacing(100)
                        textObject.setOrigin(0, 0.5); // Center the text if needed
                        this.pages[1].add(textObject);
                    }
                }
            });
        });

        this.pages[1].add([Heading, symbol0, symbol1, symbol2, symbol3, symbol4])
        this.pageviewContainer.add(this.pages[1]);

        this.pages[2] = this.add.container(0, 0);  // Position off-screen initially
        const specialHeading = this.add.text(this.scale.width/2, 280, "Major Symbols", {fontFamily:"Sava", color: "#632e2e", fontSize: "50px"}).setOrigin(0.5)
      
        
        const symbol5 = this.add.sprite(550, 450, "slots5_0").setOrigin(0.5).setScale(0.7)
        const symbol6 = this.add.sprite(930, 450, "slots6_0").setOrigin(0.5).setScale(0.7);
        const symbol7 = this.add.sprite(1300, 450, "slots7_0").setOrigin(0.5).setScale(0.7);
        const symbol8 = this.add.sprite(740, 680, "slots8_0").setOrigin(0.5).setScale(0.7)
        const symbol9 = this.add.sprite(1185, 680, "slots9_0").setOrigin(0.5).setScale(0.7)
        const infoIconsTwo = [
            { x: 650, y: 470 }, // Position for infoIcon2
            { x: 1030, y: 470 }, // Position for infoIcon3
            { x: 1400, y: 470 }, //
            { x: 840, y: 700 }, //
            { x: 1285, y: 700 }, //
        ]

        initData.UIData.symbols.slice(5, 11).forEach((newsymbol, adjustedIndex) => {
            const newIconPosition = infoIconsTwo[adjustedIndex];
            if (!newIconPosition || !newsymbol) return; // Skip this iteration, don't exit the function
            newsymbol.multiplier.forEach((newmultiplierValueArray, newmultiplierIndex) => {
                if (Array.isArray(newmultiplierValueArray)) {
                    const newMultiplierValue = newmultiplierValueArray[0];
                    
                    if (newMultiplierValue > 0) {
                        const newprefix = (5 - newmultiplierIndex) + "x";
                        let newtext = `${newprefix} - ${newMultiplierValue} \n`;            
                        
                        const newTextObject = this.add.text(
                            newIconPosition.x,
                            newIconPosition.y + newmultiplierIndex * 50,
                            newtext,
                            { fontFamily: "Sava", fontSize: '30px', color: '#632e2e' }
                        );
                        
                        newTextObject.setLineSpacing(100);
                        newTextObject.setOrigin(0, 0.5);
                        this.pages[2].add(newTextObject);
                    }
                }
            });
        });
       
        this.pages[2].add([specialHeading, symbol5, symbol6, symbol7, symbol8, symbol9]);
        this.pageviewContainer.add(this.pages[2]);
       

        this.pages[3] = this.add.container(0, 0);  // Position off-screen initially
        
        const payTableImage = this.add.text(gameConfig.scale.width/2, 280, "Special Symbols", {fontFamily:"Sava", color: "#632e2e", fontSize: "50px"}).setOrigin(0.5)
        const symbol10 = this.add.sprite(500, 450, "slots10_0").setOrigin(0.5).setScale(0.7)
        const symbol10Description = this.add.text(1100, 450, initData.UIData.symbols[10].description, {fontFamily:"Sava", color: "#632e2e", fontSize: "30px", wordWrap:{ width: 1100, useAdvancedWrap: true }}).setOrigin(0.5)
        const symbol11 = this.add.sprite(500, 700, "slots11_0").setOrigin(0.5).setScale(0.7)
        const symbol11Description = this.add.text(1100, 700, initData.UIData.symbols[11].description, {fontFamily:"Sava", color: "#632e2e", fontSize: "30px", wordWrap:{ width: 1000, useAdvancedWrap: true }}).setOrigin(0.5)
        
        this.pages[3].add([ payTableImage, symbol10, symbol10Description, symbol11, symbol11Description]);
        this.pageviewContainer.add(this.pages[3]);

        this.pages[4] = this.add.container(0, 0);

        const freeSpinHeading = this.add.text(this.scale.width/2, 280, "Special Symbols", {fontFamily:"Sava", color: "#632e2e", fontSize: "50px"}).setOrigin(0.5)
        const symbol12 = this.add.sprite(500, 450, "slots12_0").setOrigin(0.5).setScale(0.7)
        const symbol12Description = this.add.text(1100, 450, initData.UIData.symbols[12].description, {fontFamily:"Sava", color: "#632e2e", fontSize: "30px", wordWrap:{ width: 1100, useAdvancedWrap: true }}).setOrigin(0.5)
        const symbol13 = this.add.sprite(500, 700, "slots13_0").setOrigin(0.5).setScale(0.7)
        const symbol13Description = this.add.text(1100, 700, initData.UIData.symbols[13].description, {fontFamily:"Sava", color: "#632e2e", fontSize: "30px", wordWrap:{ width: 1000, useAdvancedWrap: true }}).setOrigin(0.5)
        
        this.pages[4].add([freeSpinHeading, symbol12, symbol13, symbol12Description, symbol13Description])

        this.pages[5] = this.add.container(0, 0);
        const rulesHeading = this.add.text(this.scale.width/2, 320, "Rules", {fontFamily:"Sava", fontSize: "50px", color: "#632e2e"}).setOrigin(0.5);
        const rulesDescription = this.add.text(this.scale.width/2, 570, `- Place your bet. \n- Press the spin button to start the game. \n- You can also use max bet button to maximise the bet. \n- Press the auto spin button to turn auto spin game mode`, {fontFamily:"Sava", color: "#632e2e", fontSize: "40px", wordWrap:{ width: 1100, useAdvancedWrap: true }}).setOrigin(0.5)
        
        this.pages[5].add([rulesHeading, rulesDescription])

        this.pages = [this.pages[1], this.pages[2], this.pages[3], this.pages[4], this.pages[5]];
        this.currentPageIndex = 0;
        
        // Set initial visibility 
        this.pages.forEach((page, index) => {
            page.setVisible(index === this.currentPageIndex);
        });
    }

    goToNextPage() {
        if (this.currentPageIndex < this.pages.length - 1) {
            this.pages[this.currentPageIndex].setVisible(false);
            this.currentPageIndex++;
            this.pages[this.currentPageIndex].setVisible(true);
        }
    }

    goToPreviousPage() {
        if (this.currentPageIndex > 0) {
            this.pages[this.currentPageIndex].setVisible(false);
            this.currentPageIndex--;
            this.pages[this.currentPageIndex].setVisible(true);
        }
    }
}