import "../../assets/loading.png"
import "../pages/create_game.html"
import {Scene} from "phaser";
import {UserService} from "../api/service/UserService";
import {GameService} from "../api/service/GameService";
import {WaitingScene} from "./WaitingScene";
import {Util} from "../util/Util";
import {MainScene} from "./MainScene";
import {Socket} from "../api/socket";
import {GameStatus} from "../model/Game";
import Rectangle = Phaser.GameObjects.Rectangle;
import Image = Phaser.GameObjects.Image;
import DOMElement = Phaser.GameObjects.DOMElement;


export class StartScene extends Scene {

    private loadingImage!: Image;
    private loadingRectangle!: Rectangle;
    private toast: any;
    private loginHtmlElement!: DOMElement;

    public preload() {
        this.load.html("create_game", "create_game.html")
        this.load.image('loading', './assets/loading.png');
    }

    public create() {
        this.toast = this.createToast();
        this.createLoginHtmlElement();
        /////////
        this.createLoadingImages();
        this.hideLoading();
        ////////
        let joinGameId = Util.getQueryVariable("join");
        if (joinGameId) {
            this.joinGameDirectly(joinGameId);
        } else {
            StartScene.disableJoinButton();
        }

        let userAlreadyCreated = false;
        if (localStorage.getItem("user_name") != undefined && localStorage.getItem("user_id") != undefined) {
            (this.loginHtmlElement.getChildByName("name") as HTMLInputElement).value = localStorage.getItem("user_name")!
            userAlreadyCreated = true;
        }

        this.loginHtmlElement.addListener('click');
        this.loginHtmlElement.on('click', (event: any) => {
            let inputName = this.loginHtmlElement.getChildByName('name') as HTMLInputElement;
            let timeoutElement = this.loginHtmlElement.getChildByName('timeout') as HTMLInputElement;

            let timeout: number = 15;
            if (timeoutElement.value && +timeoutElement.value >= 10 && +timeoutElement.value <= 30) {
                timeout = +timeoutElement.value;
            }

            if (event.target.name === "create_game") {
                this.handleCreateGameBtn(inputName, userAlreadyCreated, timeout);
            } else if (event.target.name === "join_game") {
                this.handleJoinGameBtn(inputName, userAlreadyCreated, joinGameId);
            }
        });

        this.tweens.add({
            targets: this.loginHtmlElement,
            y: 400,
            duration: 1000,
            ease: 'Power1'
        });

    }

    private createLoginHtmlElement() {
        this.loginHtmlElement = this.add.dom(350, 700).createFromCache("create_game");
        this.loginHtmlElement.visible = true;
    }

    public update() {
        if (this.loadingImage.visible) {
            this.loadingImage.angle += 2;
        }
    }

    private createLoadingImages() {
        this.loadingRectangle = this.add.rectangle(-100, -100, 2500, 2500, 0x000000, 0.5);
        this.loadingImage = this.add.image((this.game.canvas.width / 2), this.game.canvas.height / 2, "loading").setScale(0.3);
    }

    private handleCreateGameBtn(inputName: HTMLInputElement, userAlreadyCreated: boolean, timeout: number) {
        if (inputName.value === '') {
            this.toast.show("Enter your name");
            return;
        }
        this.showLoading();
        if (userAlreadyCreated) {
            this.createGame(localStorage.getItem("user_id")!, timeout);
        } else {
            UserService.createUser({name: inputName.value}).then(response => {
                if (response.ok) {
                    localStorage.setItem("user_name", inputName.value);
                    localStorage.setItem("user_id", response.id!);
                    this.createGame(response.id!, timeout);
                } else {
                    this.toast.show("Error creating user: " + response.error?.error_code + " " + response.error?.error_message);
                    this.hideLoading();
                }
            });
        }
    }

    private handleJoinGameBtn(inputName: HTMLInputElement, userAlreadyCreated: boolean, joinGameId: string | undefined) {
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
                        this.flashElement(this.loginHtmlElement);
                    }
                });
            }
        } else {
            this.flashElement(this.loginHtmlElement);
        }
    }

    private joinGameDirectly(joinGameId: string) {
        if (localStorage.getItem("user_id")) {
            this.showLoading();
            this.joinGame(localStorage.getItem("user_id")!, joinGameId);
        } else {
            StartScene.disableCreateBtn();
        }
    }

    private static disableJoinButton() {
        let joinBtn = document.getElementById("join_game");
        if (joinBtn && joinBtn instanceof HTMLInputElement) {
            joinBtn.disabled = true
        }
    }

    private static disableCreateBtn() {
        let btn_create_game = document.getElementById("create_game");
        if (btn_create_game && btn_create_game instanceof HTMLInputElement) {
            btn_create_game.disabled = true;
        }
    }

    private flashElement(element: Phaser.GameObjects.DOMElement) {
        //  Flash the prompt
        this.tweens.add({targets: element, alpha: 0.1, duration: 200, ease: 'Power1', yoyo: true});
    }

    private createGame(user_id: string, move_timeout: number) {
        GameService.createGame({user_id: user_id, move_timeout: move_timeout}).then(response => {
            if (response.ok) {
                localStorage.setItem("game_id", response.game!.id);
                localStorage.setItem("game", JSON.stringify(response.game!));
                localStorage.setItem("timeout", String(move_timeout));
                this.hideLoading();
                this.goToWaitingScene();
            } else {
                this.toast.show("Error: " + response.error?.error_message);
                this.hideLoading();
                this.loginHtmlElement.visible = true;
            }
            this.hideLoading();
        })
    }

    private joinGame(user_id: string, game_id: string) {
        GameService.joinGame({game_id: game_id, user_id: user_id}).then(response => {
            if (response.ok) {
                localStorage.setItem("game_id", response.game?.id!);
                localStorage.setItem("game", JSON.stringify(response.game));
                localStorage.setItem("timeout", String(response.game?.move_timeout_sec));

                if (response.game?.status == GameStatus.Init && !response.game?.other_side_joined) {
                    this.goToWaitingScene();
                } else if (response.game?.status == GameStatus.Joined && response.game?.other_side_joined) {
                    this.goToMainScene();
                } else {
                    this.toast.show("You cannot play this game!");
                    window.location.href = window.location.origin;
                }
                //
                Socket.connect(localStorage.getItem("game_id")!, localStorage.getItem("user_id")!);
                //
            } else {
                this.toast.show("Error: " + response.error?.error_message);
                window.location.href = window.location.origin;
            }
            this.hideLoading();
        })
    }

    private goToWaitingScene() {
        this.scene.add("WaitingScene", new WaitingScene(), true);
        window.history.pushState("join", "Join Game", "?join=" + localStorage.getItem("game_id"))
        this.loginHtmlElement.visible = false;
    }

    private goToMainScene() {
        this.scene.add("MainScene", new MainScene(), true);
        window.history.pushState("join", "Join Game", "?join=" + localStorage.getItem("game_id"))
        this.loginHtmlElement.visible = false;
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

    private showLoading() {
        this.loginHtmlElement.visible = false;
        this.loadingRectangle.setInteractive();
        this.loadingRectangle.setVisible(true);
        this.loadingImage.setVisible(true);
    }

    private hideLoading() {
        this.loadingRectangle.disableInteractive();
        this.loadingRectangle.setVisible(false);
        this.loadingImage.setVisible(false);
    }

}
