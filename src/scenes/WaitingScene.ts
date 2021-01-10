import "../../assets/loading.png"
import "../../assets/bus.png"
import {Scene} from "phaser";
import {Socket} from "../api/socket";
import {EventType} from "../model/SocketEvent";
import {MainScene} from "./MainScene";
import {Util} from "../util/Util";
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
    private toast: any;
    private button: any;

    constructor() {
        super(sceneConfig);
    }

    public preload() {
        this.load.image('loading', './assets/loading.png');
        this.load.image('bus', './assets/bus.png');
    }

    create() {
        this.loadingImage = this.add.image(140, 693, "loading").setScale(0.4);
        this.loadingImage2 = this.add.image(580, 693, "loading").setScale(0.4);
        this.bus = this.add.image(360, 500, "bus").setScale(0.9);
        this.toast = this.createToast();
        let firefox: boolean = this.sys.game.device.browser.firefox;

        let label = document.createElement("label");
        label.textContent = "Waiting other side to join..."
        label.style.color = "#74ee7b";
        label.style.fontSize = firefox ? "30px" : "35px"
        let domElementWaiting = this.add.dom(350, 300, label).setVisible(true);

        let labelDesc = document.createElement("label");
        labelDesc.innerText = "Share this link with your friend to join this game"
        labelDesc.style.color = "#7497ee";
        labelDesc.style.maxWidth = "400px";
        labelDesc.style.textAlign = "center";
        labelDesc.style.fontSize = firefox ? "25px" : "30px";
        let domElementDesc = this.add.dom(360, 390, labelDesc).setVisible(true);

        let link = document.createElement("label");
        link.innerText = window.location.href;
        link.style.color = "#fdf30a";
        link.style.textAlign = "center";
        link.style.maxWidth = "400px";
        link.style.fontSize = firefox ? "25px" : "30px";
        let domElementLink = this.add.dom(350, 480, link).setVisible(true);


        this.createButton();


        Socket.connect(localStorage.getItem("game_id")!, localStorage.getItem("user_id")!);
        Socket.subscribe(EventType.OTHER_SIDE_CONNECT, event => {
            domElementLink.visible = false;
            domElementWaiting.visible = false;
            domElementDesc.visible = false;
            this.bus.visible = false;
            this.loadingImage2.visible = false;
            this.loadingImage.visible = false;
            this.button.visible = false;
            this.scene.add(Math.random().toString(), new MainScene(), true);
        });
    }


    update() {
        if (this.loadingImage.visible && this.loadingImage2.visible) {
            this.loadingImage.angle += 2;
            this.loadingImage2.angle += 2;
        }
    }

    private createButton() {
        // @ts-ignore
        let createButton = function (scene, text) {
            return scene.rexUI.add.label({
                width: 40,
                height: 50,
                background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x7b5eAA),
                text: scene.add.text(0, 0, text, {
                    fontSize: 18
                }),
                space: {
                    left: 10,
                    right: 10,
                },
                align: 'center'
            });
        }
        /////

        // @ts-ignore
        this.button = this.rexUI.add.buttons({
            x: 360, y: 550,
            width: 300,
            orientation: 'x',
            click: {
                mode: 'pointerup',
                clickInterval: 100
            },
            buttons: [
                createButton(this, 'COPY'),
            ],
            expand: true
        }).layout()

        // @ts-ignore
        this.button.on('button.click', () => {
            Util.copyToClipboard(window.location.href);
            this.toast.show("Link copied");
        });

    }

    private createToast(): any {
        // @ts-ignore
        return this.rexUI.add.toast({
            x: 350,
            y: 1200,
            // @ts-ignore
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x4e342e),
            text: this.add.text(0, 0, '', {
                fontSize: '24px'
            }),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },
            duration: {
                in: 200,
                hold: 1500,
                out: 200,
            },
        })
    }
}