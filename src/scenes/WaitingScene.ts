import {Scene} from "phaser";
import {Socket} from "../api/socket";
import {EventType} from "../model/Event";
import {MainScene} from "./MainScene";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;

const sceneConfig: SettingsConfig = {
    active: false,
    visible: false,
    key: 'WaitingScene',
};

export class WaitingScene extends Scene {

    constructor() {
        super(sceneConfig);
    }

    create() {
        let s = "?join=" + localStorage.getItem("game_id");

        let label = document.createElement("label");
        let link = document.createElement("a");
        link.href = s;
        link.text = "Join Game"
        label.textContent = "منتظر پیوستن حریف به بازی"
        let domElement = this.add.dom(400, 150, link).setVisible(true);
        let domElement2 = this.add.dom(400, 100, label).setVisible(true);

        let socket: Socket = new Socket();
        socket.connect(localStorage.getItem("game_id")!, localStorage.getItem("user_id")!);
        Socket.subscribe(EventType.OTHER_SIDE_CONNECT, event => {
            domElement.visible = false;
            domElement2.visible = false;
            this.scene.add(Math.random().toString(), new MainScene(), true);
        });
    }


}