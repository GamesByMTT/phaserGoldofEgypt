import Phaser from "phaser";
import { Scene } from "phaser";

export default class Background extends Scene{
 constructor(config: Phaser.Types.Scenes.SettingsConfig){
    super(config)
 }
 preload(){
    this.load.image("Background", "src/sprites/Background.jpg");
 }
 create(){
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, 'Background').setOrigin(0.5).setDisplaySize(width, height);
 }
}