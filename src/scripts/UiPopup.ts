import Phaser from "phaser";
import { Globals, TextStyle } from "./Globals";
import { gameConfig } from "./appconfig";
import { TextLabel } from "./TextLabel";
import { UiContainer } from "./UiContainer";
import InfoScene from "./infoPopup";
import SoundManager from "./SoundManager";
import { currentGameData } from "./Globals";

export class UiPopups extends Phaser.GameObjects.Container {
    SoundManager: SoundManager;
    UiContainer: UiContainer
    menuBtn!: InteractiveBtn;
    settingBtn!: InteractiveBtn;
    rulesBtn!: InteractiveBtn;
    infoBtn!: InteractiveBtn;
    exitBtn!: InteractiveBtn
    yesBtn!: InteractiveBtn;
    noBtn!: InteractiveBtn
    isOpen: boolean = false;
    isExitOpen: boolean = false;
    settingClose!: InteractiveBtn;
    onButton!: InteractiveBtn;
    offButton!:InteractiveBtn;
    toggleBar!: InteractiveBtn;
    soundEnabled: boolean = true; // Track sound state
    musicEnabled: boolean = true; // Track sound state
    constructor(scene: Phaser.Scene, uiContainer: UiContainer, soundManager: SoundManager) {
        super(scene);
        this.setPosition(0, 0);
        this.ruleBtnInit();
        this.settingBtnInit();
        // this.infoBtnInit();
        this.menuBtnInit();
        this.exitButton();
        this.UiContainer = uiContainer
        this.SoundManager = soundManager
        scene.add.existing(this);
    }

    menuBtnInit() {
        const menuBtnTextures = [
            this.scene.textures.get('MenuBtn'),
            this.scene.textures.get('MenuBtnH')
        ];
        this.menuBtn = new InteractiveBtn(this.scene, menuBtnTextures, () => {
            this.openPopUp();
            this.buttonMusic("buttonpressed");
        }, 0, true);
        this.menuBtn.setPosition(this.menuBtn.width, this.menuBtn.height * 0.7 );
        this.add(this.menuBtn);
    }
    exitButton(){
        const exitButtonSprites = [
            this.scene.textures.get('exitButton'),
            this.scene.textures.get('exitButtonPressed')
        ];
        this.exitBtn = new InteractiveBtn(this.scene, exitButtonSprites, ()=>{
            this.buttonMusic("buttonpressed");
            this.openLogoutPopup();
        }, 0, true, );
        this.exitBtn.setPosition(gameConfig.scale.width - this.exitBtn.width, this.exitBtn.height * 0.7)
        this.add(this.exitBtn)
    }
    
    settingBtnInit() {
        const settingBtnSprites = [
            this.scene.textures.get('settingBtn'),
            this.scene.textures.get('settingBtnH')
        ];
        this.settingBtn = new InteractiveBtn(this.scene, settingBtnSprites, () => {
            // setting Button
            this.buttonMusic("buttonpressed");
            this.openSettingPopup();
        }, 1, false); // Adjusted the position index
        this.settingBtn.setPosition(this.settingBtn.width, this.settingBtn.height * 0.7);
        this.add(this.settingBtn);
    }

    ruleBtnInit() {
        const rulesBtnSprites = [
            this.scene.textures.get('rulesBtn'),
            this.scene.textures.get('rulesBtnH')
        ];
        this.rulesBtn = new InteractiveBtn(this.scene, rulesBtnSprites, () => {
            // rules button
            this.buttonMusic("buttonpressed");
            this.openPage()
        }, 2, false); // Adjusted the position index
        this.rulesBtn.setPosition(this.rulesBtn.width, this.rulesBtn.height * 0.7);
        this.add(this.rulesBtn);
    }

    openPage() {
        Globals.SceneHandler?.addScene("InfoScene", InfoScene, true)
    }

    openPopUp() {
        // Toggle the isOpen boolean
        this.isOpen = !this.isOpen;
        this.menuBtn.setInteractive(false);
        if (this.isOpen) {
            this.tweenToPosition(this.rulesBtn, 2);
            // this.tweenToPosition(this.infoBtn, 2);
            this.tweenToPosition(this.settingBtn, 1);
        } else {
            this.tweenBack(this.rulesBtn);
            // this.tweenBack(this.infoBtn);
            this.tweenBack(this.settingBtn);
        }
    }

    tweenToPosition(button: InteractiveBtn, index: number) {
        const targetY = button.height/1.3 + index * this.menuBtn.height; // Calculate the Y position with spacing
        button.setVisible(true);
        this.scene.tweens.add({
            targets: button,
            y: targetY,
            duration: 300,
            ease: 'Elastic',
            easeParams: [1, 0.9],
            onComplete: () => {
                button.setInteractive(true);
                this.menuBtn.setInteractive(true);
            }
        });
    }
    tweenBack(button: InteractiveBtn) {
        button.setInteractive(false);
        this.scene.tweens.add({
            targets: button,
            y: button.height,
            duration: 100,
            ease: 'Elastic',
            easeParams: [1, 0.9],
            onComplete: () => {
                button.setVisible(false);
                this.menuBtn.setInteractive(true);
            }
        });
    }
    /**
     * @method openLogoutPopup
     * @description creating an container for exitPopup 
     */
    openLogoutPopup() {
        // Create a semi-transparent background for the popup
        const blurGraphic = this.scene.add.graphics().setDepth(1); // Set depth lower than popup elements
        blurGraphic.fillStyle(0x000000, 0.5); // Black with 50% opacity
        blurGraphic.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height); // Cover entire screen
        
        this.UiContainer.onSpin(true);
        // Create a container for the popup
        const popupContainer = this.scene.add.container(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2
        ).setDepth(1); // Set depth higher than blurGraphic
    
        // Popup background image
        const popupBg = this.scene.add.image(0, 0, 'popupBgimg').setDepth(10);
        popupBg.setOrigin(0.5);
        // popupBg.setDisplaySize(683, 787); // Set the size for your popup background
        popupBg.setAlpha(1); // Set background transparency
        this.exitBtn.disableInteractive();

        const popupHeading = new TextLabel(this.scene, 0, -300, "QUIT GAME", 40, "#632e2e")
        // Add text to the popup
        const popupText = new TextLabel(this.scene, 0, -55, "DO YOU REALLY \n WANT TO QUIT?", 40, "#632e2e");
        // Yes and No buttons
        const yesButton = [
            this.scene.textures.get("yesButton"),
            this.scene.textures.get("yesButtonHover")
        ];
        this.yesBtn = new InteractiveBtn(this.scene, yesButton, () => {
            this.buttonMusic("buttonpressed");
            this.UiContainer.onSpin(false);
            Globals.Socket?.socket.emit("EXIT", {});
            window.parent.postMessage("onExit", "*");
            popupContainer.destroy();
            blurGraphic.destroy(); // Destroy blurGraphic when popup is closed
        }, 0, true);
    
        const noButton = [
            this.scene.textures.get("noButton"),
            this.scene.textures.get("noButtonHover")
        ];

        this.noBtn = new InteractiveBtn(this.scene, noButton, () => {
            this.buttonMusic("buttonpressed");
            this.UiContainer.onSpin(false);
            this.exitBtn.setInteractive()
            this.exitBtn.setTexture("exitButtonPressed");
            popupContainer.destroy();
            blurGraphic.destroy(); // Destroy blurGraphic when popup is closed
        }, 0, true);
       
        this.yesBtn.setPosition(-130, 80).setScale(0.7);
        this.noBtn.setPosition(130, 80).setScale(0.7);
        // Button labels
        // Add all elements to popupContainer
        popupContainer.add([popupBg, popupHeading, popupText, this.yesBtn, this.noBtn]);
        // Add popupContainer to the scene
        this.scene.add.existing(popupContainer);       
    }
    
    buttonInteraction(press: boolean){
        if(press){
            this.menuBtn.disableInteractive();
            this.settingBtn.disableInteractive()
            this.rulesBtn.disableInteractive();
            this.menuBtn.disableInteractive();
        }
    }

    openSettingPopup() {
        const settingblurGraphic = this.scene.add.graphics().setDepth(1); // Set depth lower than popup elements
        settingblurGraphic.fillStyle(0x000000, 0.5); // Black with 50% opacity
        settingblurGraphic.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height); // Cover entire screen

        const infopopupContainer = this.scene.add.container(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2
        ).setDepth(1);
        
        let soundOn = this.SoundManager.getMasterVolume() > 0;
        let musicOn = this.SoundManager.getSoundVolume("backgroundMusic") > 0;

        const popupBg = this.scene.add.image(0, 0, 'settingPopup').setDepth(9);
        const soundsImage = this.scene.add.text(-50, -140, 'Sound', {fontFamily: "Sava", fontSize: "40px", color: "#632e2e"}).setDepth(10);
        const musicImage = this.scene.add.text(-50, 50, 'Music', {fontFamily: "Sava", fontSize:"40px", color: "#632e2e"}).setDepth(10);

        const toggleBarSprite = [
            this.scene.textures.get('toggleBar'),
            this.scene.textures.get('toggleBar')
        ];
       
        const soundToggleButton =  currentGameData.soundMode ? 'onButton' : 'offButton'
        let onOff : any
        if(!currentGameData.soundMode){
            onOff = this.scene.add.image(-35, -50, soundToggleButton);
        }else{
            onOff = this.scene.add.image(30, -50, soundToggleButton);
        }
        onOff.setInteractive()
        onOff.on('pointerdown', () => {
            // this.toggleSound(onOff);
            soundOn = !soundOn;
            this.adjustSoundVolume(onOff); // Assuming 1 is full volume
            onOff.setTexture(soundOn ? 'onButton' : 'offButton');
        })

        const toggleMusicBar = this.scene.add.image(0, 140, "toggleBar")
        const musicToggleButton = currentGameData.musicMode ? 'onButton' : 'offButton'
        let offMusic: any

        if(!currentGameData.musicMode){
            offMusic = this.scene.add.image(-35, 140, musicToggleButton);
        }else{
            offMusic = this.scene.add.image(30, 140, musicToggleButton);
        }
        // offMusic.setScale(0.5)
        offMusic.setInteractive();
        offMusic.on('pointerdown', () => {
            this.adjustMusicVolume(offMusic); // Assuming 1 is full volume
        })

        this.toggleBar = new InteractiveBtn(this.scene, toggleBarSprite, () => {
            // this.toggleSound();
        }, 0, true).setPosition(0, -50);

        const exitButtonSprites = [
            this.scene.textures.get('exitButton'),
            this.scene.textures.get('exitButtonPressed')
        ];
        this.settingClose = new InteractiveBtn(this.scene, exitButtonSprites, () => {
            infopopupContainer.destroy();
            settingblurGraphic.destroy();
            this.buttonMusic("buttonpressed")
        }, 0, true);
        this.settingClose.setPosition(300, -300);

        popupBg.setOrigin(0.5);
        // popupBg.setScale(0.8);
        popupBg.setAlpha(1); // Set background transparency

        infopopupContainer.add([popupBg, this.settingClose, soundsImage, musicImage, this.toggleBar, onOff, toggleMusicBar, offMusic]);
    }
    adjustSoundVolume(onOff: any) {
        currentGameData.soundMode = !currentGameData.soundMode
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled) {
            this.buttonMusic("buttonpressed");
            onOff.setTexture('onButton');
            onOff.setPosition(30, -50); // Move position for 'On' state
           
        } else {
            onOff.setTexture('offButton');
            onOff.setPosition(-35, -50); // Move position for 'Off' state
        }
        this.SoundManager.setSoundEnabled(this.soundEnabled)
    }

    // Function to adjust music volume
    adjustMusicVolume(offMusic: any) {
        currentGameData.musicMode = !currentGameData.musicMode
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.buttonMusic("buttonpressed");
            offMusic.setTexture('onButton');
            offMusic.setPosition(30, 140); // Move position for 'On' state
        } else {
            offMusic.setTexture('offButton');
            offMusic.setPosition(-35, 140); // Move position for 'Off' state;
        }
        this.SoundManager.setMusicEnabled(this.musicEnabled)
    }
    buttonMusic(key: string){
        this.SoundManager.playSound(key)
    }
}

class InteractiveBtn extends Phaser.GameObjects.Sprite {
    moveToPosition: number = -1;
    defaultTexture!: Phaser.Textures.Texture;
    hoverTexture!: Phaser.Textures.Texture

    constructor(scene: Phaser.Scene, textures: Phaser.Textures.Texture[], callback: () => void, endPos: number, visible: boolean) {
        super(scene, 0, 0, textures[0].key); // Use texture key
        this.defaultTexture = textures[0];
        this.hoverTexture = textures[1];        
        this.setOrigin(0.5);
        this.setInteractive();
        this.setVisible(visible);
        this.moveToPosition = endPos;
        this.on('pointerdown', () => {
            this.setTexture(this.hoverTexture.key)
            // this.setFrame(1);
            callback();
        });
        this.on('pointerup', () => {
            this.setTexture(this.defaultTexture.key)
            // this.setFrame(0);
        });
        this.on('pointerout', () => {
            this.setTexture(this.defaultTexture.key)
            // this.setFrame(0);
        });
        // Set up animations if necessary
        this.anims.create({
            key: 'hover',
            frames: this.anims.generateFrameNumbers(textures[1].key),
            frameRate: 10,
            repeat: -1
        });
    }
}

