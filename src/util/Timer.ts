import {Scene} from "phaser";
import Rectangle = Phaser.GameObjects.Rectangle;

export class Timer {
    private readonly _scene: Scene;
    private _timer!: number;
    private _progressBar: Rectangle;

    constructor(scene: Phaser.Scene) {
        this._scene = scene;
        this._progressBar = this.scene.add.rectangle(35, 20, 0, 0, 0x00FFFF).setOrigin(0, 0);
    }

    get scene(): Phaser.Scene {
        return this._scene;
    }

    get timer(): number {
        return this._timer;
    }

    public startVisualTimer(value: number, callback: Function, param: any) {
        this._timer = value;
        let passed = 1;
        this._progressBar.setSize(695, 10);
        let interval = setInterval(() => {
            console.log(passed);
            this._progressBar.setSize(this._progressBar.width - 695 / value, 10);
            if (passed == value) {
                callback(param);
                this._progressBar.setSize(0, 0);
                clearInterval(interval);
            }
            passed++;
        }, 1000);

    }


}