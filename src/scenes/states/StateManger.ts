import {MainScene} from "../MainScene";
import {DetectionState} from "./DetectionState";
import {ExplosionState} from "./ExplosionState";
import {ChangeShipLocationState} from "./ChangeShipLocationState";
import {BaseState} from "./BaseState";
import {InitState} from "./InitState";
import {WaitingState} from "./WaitingState";
import {PlayState} from "./PlayState";
import {Socket} from "../../api/socket";
import {
    EndGameEvent,
    EventType,
    ExplosionEvent,
    GameStartEvent,
    RevealEvent,
    ShipMovedEvent
} from "../../model/SocketEvent";
import {FinishState} from "./FinishState";
import {WaitingNoTimeoutState} from "./WaitingNoTimeoutState";
import Sprite = Phaser.GameObjects.Sprite;


export enum GameState {
    INIT_ARRANGE,
    DETECTION,
    EXPLOSION,
    CHANGE_SHIP_LOCATION,
    WAITING,
    PLAY,
    FINISHED,
    WAITING_NO_TIMEOUT,
}


export class StateManger {
    private readonly scene: MainScene;
    private _initStateHandler = new InitState();
    private _detectionStateHandler = new DetectionState();
    private _explosionStateHandler = new ExplosionState();
    private _changeShipLocationStateHandler = new ChangeShipLocationState();
    private _waitingStateHandler = new WaitingState();
    private _playStateHandler = new PlayState();
    private _finishStateHandler = new FinishState();
    private _waitingNoTimeoutStateHandler = new WaitingNoTimeoutState();
    private _currentStateHandler: BaseState;
    private _state: GameState = GameState.INIT_ARRANGE;

    public constructor(scene: MainScene) {
        this.scene = scene;
        this._currentStateHandler = this._initStateHandler;
    }

    get state(): GameState {
        return this._state;
    }

    public changeState(newState: GameState): void {
        if (!this.scene.pinchOrDrag && this._currentStateHandler !== this._finishStateHandler) {
            this._state = newState;
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
                case GameState.FINISHED:
                    this._finishStateHandler.changeState(this.scene);
                    this._currentStateHandler = this._finishStateHandler;
                    break;
                case GameState.WAITING_NO_TIMEOUT:
                    this._waitingNoTimeoutStateHandler.changeState(this.scene);
                    this._currentStateHandler = this._waitingNoTimeoutStateHandler;
                    break;
            }
        }
    }

    public enemyFieldPointerHover(target: Sprite, targetNeighbors: Sprite[]): void {
        if (!this.scene.pinchOrDrag) {
            this._currentStateHandler.enemyFieldPointerHover(this.scene, target, targetNeighbors);
        }
    }

    public enemyFieldPointerOut(target: Sprite, targetNeighbors: Sprite[]): void {
        if (!this.scene.pinchOrDrag) {
            this._currentStateHandler.enemyFieldPointerOut(this.scene, target, targetNeighbors);
        }
    }

    public enemyFieldPointerUp(target: Sprite, targetNeighbors: Sprite[], indexOf: number): void {
        if (!this.scene.pinchOrDrag) {
            this._currentStateHandler.enemyFieldPointerUp(this.scene, target, targetNeighbors, indexOf);
        }
    }

    public ownFieldPointerHover(target: Sprite, targetIndexOf: number): void {
        if (!this.scene.pinchOrDrag) {
            this._currentStateHandler.ownFieldPointerHover(this.scene, target, targetIndexOf);
        }
    }

    public ownFieldPointerOut(target: Sprite, targetIndexOf: number): void {
        if (!this.scene.pinchOrDrag) {
            this._currentStateHandler.ownFieldPointerOut(this.scene, target, targetIndexOf);
        }
    }

    public ownFieldPointerUp(target: Sprite, targetIndexOf: number): void {
        if (!this.scene.pinchOrDrag) {
            this._currentStateHandler.ownFieldPointerUp(this.scene, target, targetIndexOf);
        }
    }

    public SocketEventSubscribe() {
        Socket.subscribe(null, event => {
            switch (event.eventType) {
                case EventType.CHANGE_TURN:
                    this.changeState(GameState.PLAY);
                    break;
                case EventType.SHIP_MOVED:
                    let shipMovedEvent = event.object as ShipMovedEvent;
                    this._currentStateHandler.hideShip(this.scene, shipMovedEvent.old_ship_index);
                    this.changeState(GameState.PLAY);
                    break;
                case EventType.OTHER_SIDE_CONNECT:
                    break;
                case EventType.INTERNAL_SOCKET_CONNECT:
                    this._currentStateHandler.socketConnectIcon(this.scene, true);
                    break;
                case EventType.INTERNAL_SOCKET_DISCONNECT:
                    this._currentStateHandler.socketConnectIcon(this.scene, false);
                    break;
                case EventType.INTERNAL_SOCKET_RECONNECT:
                    this._currentStateHandler.reconnect(this.scene);
                    break;
                case EventType.GAME_START:
                    let gameStartEvent = event.object as GameStartEvent;
                    if (gameStartEvent.game.your_turn) {
                        this.changeState(GameState.PLAY);
                    } else {
                        this.changeState(GameState.WAITING);
                    }
                    break;
                case EventType.REVEAL:
                    let revealEvent = event.object as RevealEvent;
                    this._currentStateHandler.reveal(this.scene, revealEvent.slots);
                    this.changeState(GameState.PLAY);
                    break;
                case EventType.EXPLOSION:
                    let explosionEvent = event.object as ExplosionEvent;
                    let explosion = this._currentStateHandler.explosion(this.scene, explosionEvent.index);
                    if (explosion) {
                        this.changeState(GameState.WAITING);
                    } else {
                        this.changeState(GameState.PLAY);
                    }
                    break;
                case EventType.END_GAME:
                    let endGameEvent = event.object as EndGameEvent;
                    this.changeState(GameState.FINISHED);
                    this._currentStateHandler.finish(this.scene, endGameEvent.winner_user_id);
                    break;
            }
        });
    }

}

