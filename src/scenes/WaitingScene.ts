import "../../assets/loading.png"
import "../../assets/bus.png"
import {Scene} from "phaser";
import {Socket} from "../api/socket";
import {EventType} from "../model/Event";
import {MainScene} from "./MainScene";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Image = Phaser.GameObjects.Image;

const sceneConfig: SettingsConfig = {
    active: false,
    visible: false,
    key: 'WaitingScene',
};

export class WaitingScene extends Scene {

    private loadingImage!: Image;
    private loadingImage2!: Image;
    private bus!: Image;

    constructor() {
        super(sceneConfig);
    }

    public preload() {
        this.load.image('loading', './assets/loading.png');
        this.load.image('bus', './assets/bus.png');
    }

    create() {
        this.loadingImage = this.add.image(355, 552, "loading").setScale(0.3);
        this.loadingImage2 = this.add.image(745, 552, "loading").setScale(0.3);
        this.bus = this.add.image(550, 380, "bus").setScale(0.8);

        let label = document.createElement("label");
        label.textContent = "منتظر پیوستن حریف به بازی"
        label.style.color = "#74ee7b";
        label.style.fontSize = "30px"
        let domElementWaiting = this.add.dom(540, 200, label).setVisible(true);

        let labelDesc = document.createElement("label");
        labelDesc.textContent = "برای پیوستن حریف به بازی، لینک زیر را به اشتراک بگذارید"
        labelDesc.style.color = "#74ee7b";
        labelDesc.style.fontSize = " 15px"
        let domElementDesc = this.add.dom(540, 240, labelDesc).setVisible(true);

        let link = document.createElement("label");
        // link.href = s;
        // link.text = s;
        link.textContent = window.location.href;
        link.style.color = "#74ee7b"
        link.style.fontSize = "15px";
        link.style.fontSize = "15px";
        let domElementLink = this.add.dom(540, 280, link).setVisible(true);


        Socket.connect(localStorage.getItem("game_id")!, localStorage.getItem("user_id")!);
        Socket.subscribe(EventType.OTHER_SIDE_CONNECT, event => {
            domElementLink.visible = false;
            domElementWaiting.visible = false;
            domElementDesc.visible = false;
            this.bus.visible = false;
            this.loadingImage2.visible = false;
            this.loadingImage.visible = false;
            this.scene.add(Math.random().toString(), new MainScene(), true);
        });
    }


    update() {
        if (this.loadingImage.visible && this.loadingImage2.visible) {
            this.loadingImage.angle += 2;
            this.loadingImage2.angle += 2;
        }
    }
}