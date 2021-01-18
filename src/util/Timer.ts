import {GameService} from "../api/service/GameService";
import {MainScene} from "../scenes/MainScene";
import {GameState} from "../scenes/states/StateManger";
import Rectangle = Phaser.GameObjects.Rectangle;

export class Timer {
    private readonly _scene: MainScene;
    private _timer!: number;
    private _progressBar: Rectangle;
    private _interval!: number;
    private _active: boolean = false;

    constructor(scene: MainScene) {
        this._scene = scene;
        this._progressBar = this.scene.add.rectangle(35, 20, 0, 0, 0x00FFFF).setOrigin(0, 0);
    }

    get scene(): Phaser.Scene {
        return this._scene;
    }

    get timer(): number {
        return this._timer;
    }

    get active(): boolean {
        return this._active;
    }

    public startTimer(value: number, callback: Function, param?: any) {
        this.stopTimer();
        this._active = true;
        this._timer = value;
        let passed = 1;
        this._progressBar.setSize(545, 10);
        this._interval = window.setInterval(() => {
            this._progressBar.setSize(this._progressBar.width - 545 / value, 10);
            if (passed == value) {
                clearInterval(this._interval);
                this._progressBar.setSize(0, 0);
                callback(param);
            }
            passed++;
        }, 1000);
    }

    public stopTimer() {
        if (this._interval) {
            clearInterval(this._interval);
        }
        this._active = false;
        this._progressBar.setSize(0, 0);
    }

    public startTimerAndChangeTurn(value: number) {
        this.startTimer(value, () => {
            GameService.changeTurn({
                user_id: localStorage.getItem("user_id")!,
                game_id: localStorage.getItem("game_id")!
            }).then(response => {
                if (response.ok) {
                    this._scene.stateManger.changeState(GameState.WAITING);
                } else {
                    this._scene.toast.show("Error: " + response.error?.error_message);
                }
            });
        });
    }

}