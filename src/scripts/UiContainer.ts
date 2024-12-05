import Phaser from 'phaser';
import { Scene, GameObjects, Types } from 'phaser';
import { Globals, ResultData, currentGameData, initData } from './Globals';
import { TextLabel } from './TextLabel';
import { gameConfig } from './appconfig';
import SoundManager from './SoundManager';
import MainScene from '../view/MainScene';

// Define UiContainer as a Phaser Scene class
export class UiContainer extends Phaser.GameObjects.Container {
    SoundManager!: SoundManager
    spinBtn!: Phaser.GameObjects.Sprite;
    maxbetBtn!: Phaser.GameObjects.Sprite;
    autoBetBtn!: Phaser.GameObjects.Sprite;
    freeSpinBgImg!: Phaser.GameObjects.Sprite
    fireAnimation: Phaser.GameObjects.Sprite[] = [];
    CurrentBetText!: TextLabel;
    currentWiningText!: TextLabel;
    currentBalanceText!: TextLabel;
    CurrentLineText!: TextLabel;
    freeSpinText!: TextLabel;
    pBtn!: Phaser.GameObjects.Sprite;
    mBtn!: Phaser.GameObjects.Sprite
    private isAutoSpinning: boolean = false; // Flag to track if auto-spin is active
    mainScene!: Phaser.Scene
    fireSprite1!: Phaser.GameObjects.Sprite
    fireSprite2!: Phaser.GameObjects.Sprite
    betButtonDisable!: Phaser.GameObjects.Container
    newBetPanelText!: TextLabel
    exitBtn!: Phaser.GameObjects.Sprite

    constructor(scene: Scene, spinCallBack: () => void, soundManager: SoundManager) {
        super(scene);
        scene.add.existing(this); 
        // Initialize UI elements
        this.maxBetInit();
        this.spinBtnInit(spinCallBack);
        this.autoSpinBtnInit(spinCallBack);
        this.lineBtnInit();
        this.winBtnInit();
        this.balanceBtnInit();
        this.totalBet();
        this.BetBtnInit();
        // this.freeSpininit();
        this.vaseInit();
        this.SoundManager = soundManager
    }

    /**
     * @method lineBtnInit Shows the number of lines for example 1 to 20
     */
    lineBtnInit() { 
        const container = this.scene.add.container(gameConfig.scale.width/8, gameConfig.scale.height - 70);
        const lineText = new TextLabel(this.scene, -20, -70, "LINES", 30, "#632e2e");
        const linePanel = this.scene.add.sprite(0, 0, "lines").setDepth(0);
        linePanel.setOrigin(0.5);
        linePanel.setPosition(gameConfig.scale.width/9, gameConfig.scale.height - 70);
        container.add(lineText);
        this.CurrentLineText = new TextLabel(this.scene, -20, -18, "20", 40, "#ffffff");
        //Line Count
        container.add(this.CurrentLineText).setDepth(1)
    }

    /**
     * @method winBtnInit add sprite and text
     * @description add the sprite/Placeholder and text for winning amount 
     */
    winBtnInit() {
        const winPanel = this.scene.add.sprite(0, 0, 'winPanel');
        winPanel.setOrigin(0.5);
        winPanel.setPosition(gameConfig.scale.width / 1.12, this.spinBtn.y);
        const winPanelText = new TextLabel(this.scene, 0, -70, "YOUR WON", 30, "#632e2e");
        const container = this.scene.add.container(gameConfig.scale.width / 1.12, this.spinBtn.y)
        container.add(winPanelText);
        const currentWining: any = ResultData.playerData.currentWining;
        this.currentWiningText = new TextLabel(this.scene, 0, -15, currentWining, 40, "#FFFFFF");
        const winPanelChild = this.scene.add.container(winPanel.x, winPanel.y)
        winPanelChild.add(this.currentWiningText);
    }
    totalBet(){
        const totalBetContainer = this.scene.add.container(gameConfig.scale.width/1.35, this.spinBtn.y)
        const totalBetPanelSprite = this.scene.add.sprite(0, 0, 'winPanel');
        const balancePanelText = new TextLabel(this.scene, 0, -70, "TOTAL BET", 30, "#632e2e");
        this.newBetPanelText = new TextLabel(this.scene, 0, -18, ((initData.gameData.Bets[currentGameData.currentBetIndex]) * 20).toString(), 40, "#FFFFFF").setDepth(6);
        totalBetContainer.add([totalBetPanelSprite, this.newBetPanelText, balancePanelText]);

    }
    /** 
     * @method balanceBtnInit Remaning balance after bet (total)
     * @description added the sprite/placeholder and Text for Total Balance 
     */
    balanceBtnInit() {
        const balancePanel = this.scene.add.sprite(0, 0, 'newBalancePanel').setOrigin(0.5);
        balancePanel.setOrigin(0.5);
        balancePanel.setPosition(gameConfig.scale.width/2, gameConfig.scale.height * 0.14);
        const container = this.scene.add.container(balancePanel.x, balancePanel.y);
        currentGameData.currentBalance = initData.playerData.Balance;
        this.currentBalanceText = new TextLabel(this.scene, 0, 0, currentGameData.currentBalance.toFixed(2), 40, "#ffffff");
        container.add(this.currentBalanceText);
    }
    /**
     * @method vaseInit add the vase Sprite
     * @description this method adds the vase sprite on left and right of thre frame and create the fireanimation on respective both vase 1 and vase 2 but hide them initially
     */
    vaseInit() {
        const vase1 = this.scene.add.sprite(0, 0, 'fireVase');
        vase1.setOrigin(0.5);
        vase1.setPosition(vase1.width * 1.70, gameConfig.scale.height - vase1.height * 1.80);
        // const fire1 = this.addFire(this.scene, vase1.x, vase1.y - vase1.height);
        const fireFrames = [];
        for(let i = 0; i<=22; i++){
            fireFrames.push({ key: `fire_${i}` });
        }
        this.scene.anims.create({
            key: 'fireAnimation',
            frames: fireFrames,
            frameRate: 12,
            repeat: -1 // Loop the animation
        });

        this.fireSprite1 = this.scene.add.sprite(vase1.x, vase1.y - vase1.height, 'fire_1');
        this.fireSprite1.setVisible(false); // Hide the sprite initially
    
        const vase2 = this.scene.add.sprite(0, 0, 'fireVase');
        vase2.setOrigin(0.5);
        vase2.setPosition(gameConfig.scale.width - vase2.width * 1.70, gameConfig.scale.height - vase2.height * 1.80);
        // const fire2 = this.addFire(this.scene, vase2.x, vase2.y - vase2.height);
        this.fireSprite2 = this.scene.add.sprite(vase2.x, vase2.y - vase2.height, 'fire_1');
        this.fireSprite2.setVisible(false); // Hide the sprite initially
    
        this.add(vase1);
        this.add(vase2);
    }
    /**
     * @method maxBetBtn used to increase the bet amount to maximum
     * @description this method is used to add a spirte button and the button will be used to increase the betamount to maximun example on this we have twenty lines and max bet is 1 so the max bet value will be 1X20 = 20
     */
    maxBetInit() {
        this.maxbetBtn =  new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'maxBetBtn');
        this.maxbetBtn = this.createButton('maxBetBtn', gameConfig.scale.width / 2 - this.maxbetBtn.width / 1.7, gameConfig.scale.height - this.maxbetBtn.height / 2, () => {
            
            this.scene.tweens.add({
                targets: this.maxbetBtn,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100,
                onComplete: ()=>{
                    this.maxbetBtn.setTexture("maxBetBtOnPressed")
                    this.maxbetBtn.disableInteractive()
                    currentGameData.currentBetIndex = initData.gameData.Bets[initData.gameData.Bets.length - 1];
                    this.CurrentBetText.updateLabelText((currentGameData.currentBetIndex*20).toString());
                    this.scene.tweens.add({
                        targets: this.maxbetBtn,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 100,
                        onComplete: ()=>{
                            this.maxbetBtn.setTexture("maxBetBtn");
                            this.maxbetBtn.setInteractive({ useHandCursor: true, pixelPerfect: true })
                        }
                    })
                    
                }
            })
        
        }).setDepth(0);      
    }


    /**
     * @method autoSpinBtnInit 
     * @param spinCallBack 
     * @description crete and auto spin button and on that spin button click it change the sprite and called a recursive function and update the balance accroding to that
     */
    autoSpinBtnInit(spinCallBack: () => void) {
        this.autoBetBtn = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "autoSpin");
        this.autoBetBtn = this.createButton(
            'autoSpin',
            gameConfig.scale.width / 2 + this.autoBetBtn.width / 1.7,
            gameConfig.scale.height - this.autoBetBtn.height / 2,
            () => {
                this.scene.tweens.add({
                    targets: this.autoBetBtn,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 100,
                    onComplete: () =>{
                        this.isAutoSpinning = !this.isAutoSpinning; // Toggle auto-spin state
                        if (this.isAutoSpinning && currentGameData.currentBalance > 0) {
                            Globals.Socket?.sendMessage("SPIN", {
                                currentBet: currentGameData.currentBetIndex,
                                currentLines : initData.gameData.Lines.length
                            });
                            currentGameData.currentBalance -= initData.gameData.Bets[currentGameData.currentBetIndex];
                            this.autoSpinRec(true)
                            spinCallBack(); // Callback to indicate the spin has started
                            // Start the spin recursion
                            this.startSpinRecursion(spinCallBack);
                        } else {
                            // Stop the spin if auto-spin is turned off
                            this.autoSpinRec(false);
                        }
                        this.scene.tweens.add({
                            targets: this.autoBetBtn,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 100,
                            onComplete: () => {
                                // this.spinBtn.setTexture('spinBtn');
                            }
                        });
                    }
                })
            }
        ).setDepth(0);
    }

    /**
     * @method spinBtnInit Spin the reel
     * @description this method is used for creating and spin button and on button click the a SPIn emit will be triggered to socket and will deduct the amout according to the bet
     */
    spinBtnInit(spinCallBack: () => void) {
        this.spinBtn = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "spinBtn");
        this.spinBtn = this.createButton('spinBtn', gameConfig.scale.width / 2, gameConfig.scale.height - this.spinBtn.height / 2, () => {
            if(ResultData.playerData.Balance < initData.gameData.Bets[currentGameData.currentBetIndex]){
                this.lowBalancePopup();
                return
            }
            // checking if autoSpining is working or not if it is auto Spining then stop it
            this.startFireAnimation();
            if(this.isAutoSpinning){
                this.autoBetBtn.emit('pointerdown'); // Simulate the pointerdown event
                this.autoBetBtn.emit('pointerup'); // Simulate the pointerup event (if needed)
                return;
            }
           // tween added to scale transition
            this.scene.tweens.add({
                targets: this.spinBtn,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100,
                onComplete: () => {
                    // Send message and update the balance
                    Globals.Socket?.sendMessage("SPIN", { currentBet: currentGameData.currentBetIndex, currentLines: initData.gameData.Lines.length, spins: 1 });
                    currentGameData.currentBalance -= initData.gameData.Bets[currentGameData.currentBetIndex];
                    this.currentBalanceText.updateLabelText(currentGameData.currentBalance.toFixed(2));
                    // Trigger the spin callback
                    this.onSpin(true);
                    spinCallBack();
    
                    // Scale back to original size 
                    this.scene.tweens.add({
                        targets: this.spinBtn,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 100,
                        onComplete: () => {
                            
                        }
                    });
                    // 
                }
            });
        }).setDepth(1);
   
    }

    /**
     * @method startFireAnimation used to show and play fireAnimation on both vase1 and vase2
     */
    startFireAnimation() {
        this.fireSprite1.setVisible(true);
        this.fireSprite1.play('fireAnimation');
        this.fireSprite2.setVisible(true);
        this.fireSprite2.play('fireAnimation');
    }
    /**
     * @method stopFireAnimation used to stop both animation
     */
    stopFireAnimation() {
        this.fireSprite1.stop();
        this.fireSprite1.setVisible(false);
        this.fireSprite2.stop();
        this.fireSprite2.setVisible(false);
    }
    
    /**
     * @method BetBtnInit 
     * @description this method is used to create the bet Button which will show the totla bet which is placed and also the plus and minus button to increase and decrese the bet value
     */
    BetBtnInit() {
        const container = this.scene.add.container(gameConfig.scale.width / 3.8, gameConfig.scale.height - 70);
        this.betButtonDisable = container
        // Bet panel text
        const betPanelText = new TextLabel(this.scene, 0, -70, "LINE BET", 30, "#632e2e").setDepth(2);
        container.add(betPanelText);
     
        // Plus button
        this.pBtn = this.createButton('pBtn', 90, 0, () => {
            this.pBtn.setTexture('pBtnH');
            this.pBtn.disableInteractive();
            if (!currentGameData.isMoving) {
                currentGameData.currentBetIndex++;
                if (currentGameData.currentBetIndex >= initData.gameData.Bets.length) {
                    currentGameData.currentBetIndex = 0;
                }
                const betAmount = initData.gameData.Bets[currentGameData.currentBetIndex];
                const updatedBetAmount = (betAmount * initData.gameData.Lines.length).toString();
                this.CurrentBetText.updateLabelText(betAmount);
                this.newBetPanelText.updateLabelText(updatedBetAmount)
            }
            this.scene.time.delayedCall(200, () => {
                this.pBtn.setTexture('pBtn');
                this.pBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            });
        }).setDepth(0);
        container.add(this.pBtn);
    
        // Minus button
        this.mBtn = this.createButton('mBtn', -90, 0, () => {
            this.mBtn.setTexture('mBtnH');
            this.mBtn.disableInteractive();
            if (!currentGameData.isMoving) {
                currentGameData.currentBetIndex--;
                if (currentGameData.currentBetIndex < 0) {
                    currentGameData.currentBetIndex = 0;
                }
                this.CurrentBetText.updateLabelText(initData.gameData.Bets[currentGameData.currentBetIndex]);
                let updatedBet = (initData.gameData.Bets[currentGameData.currentBetIndex] * initData.gameData.Lines.length).toString();
                this.newBetPanelText.updateLabelText(updatedBet)
            }
            this.scene.time.delayedCall(200, () => {
                this.mBtn.setTexture('mBtn');
                this.mBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            });
        }).setDepth(0);
        container.add(this.mBtn);
        const betPanel = this.scene.add.sprite(0, 0, 'BetPanel').setOrigin(0.5).setDepth(4);
        container.add(betPanel);
        
        this.CurrentBetText = new TextLabel(this.scene, 0, -18, initData.gameData.Bets[currentGameData.currentBetIndex], 40, "#FFFFFF").setDepth(6);
        let updatedBet = (initData.gameData.Bets[currentGameData.currentBetIndex] * initData.gameData.Lines.length).toString();
        this.newBetPanelText.updateLabelText(updatedBet)
        container.add(this.CurrentBetText);
    
    }

    /**
     * @method freeSpininit 
     * @description this method is used for showing the number of freeSpin value at the top of reels
     */
    freeSpininit(freeSpinNumber: number){
        if(freeSpinNumber >= 1){
            const freeSpinContainer = this.scene.add.container(gameConfig.scale.width/2, gameConfig.scale.height*0.15);
            const freeSpinBg = this.scene.add.sprite(freeSpinContainer.x, freeSpinContainer.y, "balancePanel");
            const freeSpinCount = new TextLabel(this.scene, freeSpinBg.x, freeSpinBg.y - 17, "Free Spin : ", 35, "#ffffff");
            this.freeSpinText = new TextLabel(this.scene, freeSpinBg.x + 90, freeSpinBg.y - 17, freeSpinNumber.toString(), 35, "#ffffff")
            this.freeSpinBgImg = freeSpinBg
        }else{
       
        }
    }
    /**
     * @method startSpinRecursion
     * @param spinCallBack 
     */
    startSpinRecursion(spinCallBack: () => void) {
        if (this.isAutoSpinning && currentGameData.currentBalance > 0) {
            this.startFireAnimation();
            // Delay before the next spin
            const delay = currentGameData.isMoving && (ResultData.gameData.symbolsToEmit.length > 0) ? 3000 : 5000;
            this.scene.time.delayedCall(delay, () => {
                if (this.isAutoSpinning && currentGameData.currentBalance >= 0) {
                    Globals.Socket?.sendMessage("SPIN", {
                        currentBet: currentGameData.currentBetIndex,
                        currentLines : initData.gameData.Lines.length
                    });
                    currentGameData.currentBalance -= initData.gameData.Bets[currentGameData.currentBetIndex];
                    this.currentBalanceText.updateLabelText(currentGameData.currentBalance.toFixed(2));
                    spinCallBack();
                    // Call the spin recursively
                    this.spinRecursively(spinCallBack);
                }
            });
        }
    }

    spinRecursively(spinCallBack: () => void) {
        if (this.isAutoSpinning) {
            // Perform the spin
            this.autoSpinRec(true);
            if (currentGameData.currentBalance < initData.gameData.Bets[currentGameData.currentBetIndex]) {
                // Stop the spin when a winning condition is met or balance is insufficient
                this.autoSpinRec(false);
                spinCallBack();
            } else {
                // Continue spinning if no winning condition is met and balance is sufficient
                this.startSpinRecursion(spinCallBack);
            }
        }
    }
    
    createButton(key: string, x: number, y: number, callback: () => void): Phaser.GameObjects.Sprite {
        const button = this.scene.add.sprite(x, y, key).setInteractive({ useHandCursor: true, pixelPerfect: true });
        button.on('pointerdown', callback);
        return button;
    }
   
    autoSpinRec(spin: boolean){
        if(spin){
            this.spinBtn.setTexture("spinBtnOnPressed");
            this.autoBetBtn.setTexture("autoSpinOnPressed");
            this.maxbetBtn.disableInteractive();
            this.pBtn.disableInteractive();
            this.mBtn.disableInteractive();
        }else{
            this.spinBtn.setTexture("spinBtn");
            this.autoBetBtn.setTexture("autoSpin");
            this.maxbetBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            this.pBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            this.mBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
        }        
    }

    onSpin(spin: boolean) {
        // Handle spin functionality
        if(this.isAutoSpinning){
            return
        }
        if(spin){
            this.spinBtn.disableInteractive();
            this.spinBtn.setTexture("spinBtnOnPressed");
            this.autoBetBtn.setTexture("autoSpinOnPressed");
            this.autoBetBtn.disableInteractive();
            this.maxbetBtn.disableInteractive();
            this.pBtn.disableInteractive();
            this.mBtn.disableInteractive();
            
        }else{
            this.spinBtn.setTexture("spinBtn");
            this.spinBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            this.autoBetBtn.setTexture("autoSpin");
            this.autoBetBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            this.maxbetBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            this.pBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            this.mBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
        }        
    }

    lowBalancePopup(){
        // Create a semi-transparent background for the popup
        const blurGraphic = this.scene.add.graphics().setDepth(1); // Set depth lower than popup elements
        blurGraphic.fillStyle(0x000000, 0.5); // Black with 50% opacity
        blurGraphic.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height); // Cover entire screen
    
        // Create a container for the popup
        const popupContainer = this.scene.add.container(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2
        ).setDepth(1); // Set depth higher than blurGraphic
    
        // Popup background image
        const popupBg = this.scene.add.image(0, 0, 'logoutPop').setDepth(10);
        popupBg.setOrigin(0.5);
        popupBg.setDisplaySize(900, 671); // Set the size for your popup background
        popupBg.setAlpha(1); // Set background transparency
   
        this.exitBtn = this.createButton('exitButton', 420, -310, () => { 
            popupContainer.destroy();
            blurGraphic.destroy(); // Destroy blurGraphic when popup is closed
            this.bnuttonMusic("buttonpressed");
        })
        this.exitBtn.setScale(0.6)
        // Add text to the popup
        const popupText = this.scene.add.text(0, 0, "Your account balance is running low. Please add funds to keep continue.", {color:"#632e2e", fontSize: "40px", fontFamily: 'Digra', align:"center",wordWrap: { width: 600, useAdvancedWrap: true }}).setOrigin(0.5);
      
      
        // Add all elements to popupContainer
        popupContainer.add([popupBg, popupText,this.exitBtn]);
        // Add popupContainer to the scene
        this.scene.add.existing(popupContainer);  
    }
    bnuttonMusic(key: string){
        this.SoundManager.playSound(key)
    }
}
