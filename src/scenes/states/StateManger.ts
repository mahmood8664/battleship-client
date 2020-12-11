import {MainScene} from "../MainScene";
import {DetectionState} from "./DetectionState";
import {ExplosionState} from "./ExplosionState";
import {ChangeShipLocationState} from "./ChangeShipLocationState";
import {BaseState} from "./BaseState";
import {InitState} from "./InitState";
import {WaitingState} from "./WaitingState";
import {PlayState} from "./PlayState";
import {Socket} from "../../api/socket";
import {EventType} from "../../model/Event";
import Sprite = Phaser.GameObjects.Sprite;


export enum GameState {
    INIT_ARRANGE,
    DETECTION,
    EXPLOSION,
    CHANGE_SHIP_LOCATION,
    WAITING,
    PLAY
}


export class StateManger {
    private readonly scene: MainScene
    private _initStateHandler = new InitState()
    private _detectionStateHandler = new DetectionState()
    private _explosionStateHandler = new ExplosionState()
    private _changeShipLocationStateHandler = new ChangeShipLocationState()
    private _waitingStateHandler = new WaitingState()
    private _playStateHandler = new PlayState()
    private _currentStateHandler: BaseState;

    public constructor(scene: MainScene) {
        this.scene = scene;
        this._currentStateHandler = this._initStateHandler;
    }

    public changeState(newState: GameState): void {
        if (!this.scene.pinchOrDrag) {
            switch (newState) {
                case GameState.INIT_ARRANGE:
                    this._initStateHandler.changeState(this.scene);
                    this._currentStateHandler = this._initStateHandler;
                    break;
                case GameState.DETECTION:
                    this._detectionStateHandler.changeState(this.scene);
                    this._currentStateHandler = this._detectionStateHandler;
                    break;
                case GameState.EXPLOSION:
                    this._explosionStateHandler.changeState(this.scene);
                    this._currentStateHandler = this._explosionStateHandler;
                    break;
                case GameState.CHANGE_SHIP_LOCATION:
                    this._changeShipLocationStateHandler.changeState(this.scene);
                    this._currentStateHandler = this._changeShipLocationStateHandler;
                    break;
                case GameState.WAITING:
                    this._waitingStateHandler.changeState(this.scene);
                    this._currentStateHandler = this._waitingStateHandler;
                    break;
                case GameState.PLAY:
                    this._playStateHandler.changeState(this.scene);
                    this._currentStateHandler = this._playStateHandler;
                    break;
            }
        }
    }

    public enemyFieldPointerHover(target: Sprite, targetNeighbors: Sprite[]): void {
        if (!this.scene.pinchOrDrag) {
            this._currentStateHandler.enemyFieldPointerHover(this.scene, target, targetNeighbors)
        }
    }

    public enemyFieldPointerOut(target: Sprite, targetNeighbors: Sprite[]): void {
        if (!this.scene.pinchOrDrag) {
            this._currentStateHandler.enemyFieldPointerOut(this.scene, target, targetNeighbors)
        }
    }

    public enemyFieldPointerUp(target: Sprite, targetNeighbors: Sprite[]): void {
        if (!this.scene.pinchOrDrag) {
            this._currentStateHandler.enemyFieldPointerUp(this.scene, target, targetNeighbors)
        }
    }

    public ownFieldPointerHover(target: Sprite, targetIndexOf: number): void {
        if (!this.scene.pinchOrDrag) {
            this._currentStateHandler.ownFieldPointerHover(this.scene, target, targetIndexOf)
        }
    }

    public ownFieldPointerOut(target: Sprite, targetIndexOf: number): void {
        if (!this.scene.pinchOrDrag) {
            this._currentStateHandler.ownFieldPointerOut(this.scene, target, targetIndexOf)
        }
    }

    public ownFieldPointerUp(target: Sprite, targetIndexOf: number): void {
        if (!this.scene.pinchOrDrag) {
            this._currentStateHandler.ownFieldPointerUp(this.scene, target, targetIndexOf)
        }
    }

    public SocketEventSubscribe() {
        Socket.subscribe(null, event => {

            switch (event.eventType) {
                case EventType.OTHER_SIDE_CONNECT:
                    break;
                case EventType.SOCKET_CONNECT:
                    this.scene.connect.visible = true;
                    this.scene.disconnect.visible = false;
                    break;
                case EventType.SOCKET_DISCONNECT:
                    this.scene.connect.visible = false;
                    this.scene.disconnect.visible = true;
                    break;
                case EventType.GAME_START:
                    this.changeState(GameState.PLAY);

            }

        });
    }

}

