import { Scene, GameObjects, Scale } from 'phaser';
import { Slots } from '../scripts/Slots';
import { UiContainer } from '../scripts/UiContainer';
import { LineGenerator } from '../scripts/Lines';
import { UiPopups } from '../scripts/UiPopup';
import { Globals, ResultData, currentGameData } from '../scripts/Globals';
import SoundManager from '../scripts/SoundManager';

export default class MainScene extends Scene {
    Background!: Phaser.GameObjects.Sprite
    slot!: Slots;
    balanceText!: Phaser.GameObjects.Sprite
    slotFrame!: Phaser.GameObjects.Sprite;
    lineGenerator!: LineGenerator;
    uiContainer!: UiContainer;
    uiPopups!: UiPopups;
    soundManager!: SoundManager
    private mainContainer!: Phaser.GameObjects.Container;
    fireSprite!: Phaser.GameObjects.Sprite;

    constructor() {
        super({ key: 'MainScene' });
    }
    /**
     * @method create method used to create scene and add graphics respective to the x and y coordinates
     */
    create() {
        // Set up the background
        const { width, height } = this.cameras.main;

        this.soundManager = new SoundManager(this)
        // Initialize main container
        this.mainContainer = this.add.container();
        this.Background = new Phaser.GameObjects.Sprite(this, width/2, height/2, "Background")
        this.balanceText = this.add.sprite(width/2, height * 0.06, "balanceText").setOrigin(0.5)
        this.mainContainer.add([this.Background])

        // Set up the slot frame
        this.slotFrame = new Phaser.GameObjects.Sprite(this, width / 2, height / 2, 'frame').setOrigin(0.5)
        this.mainContainer.add(this.slotFrame);
        // Initialize UI Container
        this.uiContainer = new UiContainer(this, () => this.onSpinCallBack(), this.soundManager);
        this.mainContainer.add(this.uiContainer);
        
        // Initialize Slots
        this.slot = new Slots(this, this.uiContainer,() => this.onResultCallBack(), this.soundManager);
        this.mainContainer.add(this.slot);

        // Initialize payLines
        this.lineGenerator = new LineGenerator(this, this.slot.slotSymbols[0][0].symbol.height, this.slot.slotSymbols[0][0].symbol.width);
        this.mainContainer.add(this.lineGenerator);

        // Initialize UI Popups
        this.uiPopups = new UiPopups(this, this.uiContainer);
        this.mainContainer.add(this.uiPopups)

        // for Mobile fullScreen onclick
        // if (this.sys.game.device.os.android) {
        //     // Add event listener for click or touch to trigger fullscreen
        //     this.input.on('pointerdown', async () => {
        //         if (!this.scale.isFullscreen) {
        //             try {
        //                 await this.scale.startFullscreen();
        //             } catch (error) {
        //                 console.error('Failed to enter fullscreen mode:', error);
        //             }
        //         }
        //     });
        // }    
    }

    update(time: number, delta: number) {
        // this.slot.update(time, delta);
    }

    /**
     * @method onResultCallBack Change Sprite and Lines
     * @description update the spirte of Spin Button after reel spin and emit Lines number to show the line after wiining
     */
    onResultCallBack() {
        this.uiContainer.onSpin(false);
        this.lineGenerator.showLines(ResultData.gameData.linesToEmit);
    }

    /**
     * @method onSpinCallBack Move reel
     * @description on spin button click moves the reel on Seen and hide the lines if there are any
     */
    onSpinCallBack() {
        this.slot.moveReel();
        this.lineGenerator.hideLines();
    }

    /**
     * @method recievedMessage called from MyEmitter
     * @param msgType ResultData
     * @param msgParams any
     * @description this method is used to update the value of textlabels like Balance, winAmount freeSpin which we are reciving after every spin
     */
    recievedMessage(msgType: string, msgParams: any) {
        if (msgType === 'ResultData') {
            this.time.delayedCall(1000, () => {
                this.uiContainer.currentWiningText.updateLabelText(ResultData.playerData.currentWining.toString());
                currentGameData.currentBalance = ResultData.playerData.Balance;
                this.uiContainer.currentBalanceText.updateLabelText(currentGameData.currentBalance.toFixed(2));
                const freeSpinCount = ResultData.gameData.freeSpins?.count;
                // Check if freeSpinCount is greater than 1
                if (freeSpinCount >= 1) {
                    this.uiContainer.freeSpininit(freeSpinCount)
                    // Update the label text
                    this.uiContainer.freeSpinText.updateLabelText(freeSpinCount.toString());
                    // Define the tween animation for Scaling
                    this.tweens.add({
                        targets: this.uiContainer.freeSpinText,
                        scaleX: 1.3, 
                        scaleY: 1.3, 
                        duration: 800, // Duration of the scale effect
                        yoyo: true, 
                        repeat: -1, 
                        ease: 'Sine.easeInOut' // Easing function
                    });
                } else {
                    // If count is 1 or less, ensure text is scaled normally
                    this.uiContainer.freeSpininit(freeSpinCount)
                }
               
            });
            setTimeout(() => {
                this.slot.stopTween();
            }, 1000);
        }
    }
}
