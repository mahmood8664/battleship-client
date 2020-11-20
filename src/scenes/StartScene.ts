import "../../assets/loading.png"
import "../pages/create_game.html"
import {Scene} from "phaser";
import {UserService} from "../api/service/UserService";
import {GameService} from "../api/service/GameService";
import {WaitingScene} from "./WaitingScene";
import {Util} from "../util/Util";
import Rectangle = Phaser.GameObjects.Rectangle;
import Image = Phaser.GameObjects.Image;
import DOMElement = Phaser.GameObjects.DOMElement;
import {MainScene} from "./MainScene";
import {Socket} from "../api/socket";


export class StartScene extends Scene {

    private loadingImage!: Image;
    private loadingRectangle!: Rectangle;
    private toast: any;
    private createGameElement!: DOMElement;

    public preload() {
        this.load.html("create_game", "create_game.html")
        this.load.image('loading', './assets/loading.png');
    }

    public create() {

        this.toast = this.createToast();
        this.createGameElement = this.add.dom(500, 500).createFromCache("create_game");
        this.createGameElement.visible = false;
        this.loadingRectangle = this.add.rectangle(-100, -100, 2500, 2500, 0x000000, 0.5);
        this.loadingImage = this.add.image((this.game.canvas.width / 2), this.game.canvas.height / 2, "loading").setScale(0.3);
        this.hideLoading();

        ////////
        let joinGameId = Util.getQueryVariable("join");
        if (joinGameId) {
            //if has user go to game directly
            if (localStorage.getItem("user_id")) {
                this.joinGame(localStorage.getItem("user_id")!, joinGameId);
            } else {
                this.createGameElement.visible = true;
                let btn_create_game = document.getElementById("create_game");
                if (btn_create_game && btn_create_game instanceof HTMLInputElement) {
                    btn_create_game.disabled = true;
                }
            }
        } else {
            this.createGameElement.visible = true;
            if (!localStorage.getItem("game_id")) {
                let joinBtn = document.getElementById("join_game");
                if (joinBtn && joinBtn instanceof HTMLInputElement) {
                    joinBtn.disabled = true
                }
            }
        }

        let userAlreadyCreated = false;
        if (localStorage.getItem("user_name") != undefined && localStorage.getItem("user_id") != undefined) {
            (this.createGameElement.getChildByName("name") as HTMLInputElement).value = localStorage.getItem("user_name")!
            userAlreadyCreated = true;
        }

        this.createGameElement.addListener('click');
        this.createGameElement.on('click', (event: any) => {
            let inputName = this.createGameElement.getChildByName('name') as HTMLInputElement;
            if (event.target.name === "create_game") {
                // let inputCellphone = element.getChildByName('cellphone') as HTMLInputElement;
                if (inputName.value !== '') {
                    this.showLoading();
                    if (userAlreadyCreated) {
                        this.createGame(localStorage.getItem("user_id")!);
                    } else {
                        UserService.createUser({name: inputName.value}).then(response => {
                            if (response.ok) {
                                localStorage.setItem("user_name", inputName.value);
                                localStorage.setItem("user_id", response.id!);
                                this.createGame(response.id!);
                            } else {
                                this.toast.show("Error creating user: " + response.error?.error_code + " " + response.error?.error_message);
                                this.hideLoading();
                                this.flashElement(this.createGameElement);
                            }
                        });
                    }
                } else {
                    this.flashElement(this.createGameElement);
                }
            } else if (event.target.name === "join_game") {
                if (inputName.value !== '') {
                    this.showLoading();
                    if (userAlreadyCreated) {
                        this.joinGame(localStorage.getItem("user_id")!, joinGameId ? joinGameId : localStorage.getItem("game_id")!);
                    } else {
                        UserService.createUser({name: inputName.value}).then(response => {
                            if (response.ok) {
                                localStorage.setItem("user_name", inputName.value);
                                localStorage.setItem("user_id", response.id!);
                                this.joinGame(response.id!, joinGameId ? joinGameId : localStorage.getItem("game_id")!);
                            } else {
                                this.toast.show("Error creating user: " + response.error?.error_code + " " + response.error?.error_message);
                                this.hideLoading();
                                this.flashElement(this.createGameElement);
                            }
                        });
                    }
                } else {
                    this.flashElement(this.createGameElement);
                }
            }
        });

        this.tweens.add({
            targets: this.createGameElement,
            y: 300,
            duration: 1000,
            ease: 'Power1'
        });

    }

    public update() {
        if (this.loadingImage.visible) {
            this.loadingImage.angle += 2;
        }
    }

    private flashElement(element: Phaser.GameObjects.DOMElement) {
        //  Flash the prompt
        this.tweens.add({targets: element, alpha: 0.1, duration: 200, ease: 'Power1', yoyo: true});
    }

    private createGame(user_id: string) {
        GameService.createGame({user_id: user_id}).then(response => {
            if (response.ok) {
                localStorage.setItem("game_id", response.game_id!);
                this.hideLoading();
                this.scene.add("WaitingScene", new WaitingScene(), true)
                this.createGameElement.visible = false;
                window.history.pushState("join", "Join Game", "?join=" + response.game_id)
            } else {
                this.toast.show("Error creating game: " + response.error?.error_code);
                this.hideLoading();
                this.flashElement(this.createGameElement);
            }
            this.hideLoading();
        })
    }

    private joinGame(user_id: string, game_id: string) {
        GameService.joinGame({game_id: game_id, user_id: user_id}).then(response => {
            if (response.ok) {
                localStorage.setItem("game_id", response.game?.id!);
                this.scene.add("MainScene", new MainScene(), true);
                this.createGameElement.visible = false;
                //
                let socket: Socket = new Socket();
                socket.connect(localStorage.getItem("game_id")!, localStorage.getItem("user_id")!);
                //
            } else {
                this.toast.show("Error creating game: " + response.error?.error_code);
                this.flashElement(this.createGameElement);
            }
            this.hideLoading();
        })
    }

    private createToast(): any {
        // @ts-ignore
        return this.rexUI.add.toast({
            x: 500,
            y: 700,
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
                hold: 4200,
                out: 200,
            },
        })
    }

    showLoading() {
        this.createGameElement.visible = false;
        this.loadingRectangle.setInteractive();
        this.loadingRectangle.setVisible(true);
        this.loadingImage.setVisible(true);
    }

    hideLoading() {
        this.loadingRectangle.disableInteractive();
        this.loadingRectangle.setVisible(false);
        this.loadingImage.setVisible(false);
    }

}
