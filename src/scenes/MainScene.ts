import "../../assets/blue-square.png"
import "../../assets/red-square.png"
import "../../assets/four-square.png"
import "../../assets/cannon.png"
import "../../assets/explosion.png"
import "../../assets/rounded-square.png"
import "../../assets/ship.png"
import "../../assets/direction.png"
import "../../assets/loading.png"
import "../../assets/connect.png"
import "../../assets/disconnect.png"
import "../../assets/exploded.png"
import "../../assets/explosion.mp3"
import {Scene} from "phaser";
import {GameState, StateManger} from "./states/StateManger";
import {Socket} from "../api/socket";
import {Timer} from "../util/Timer";
import Sprite = Phaser.GameObjects.Sprite;
import Group = Phaser.GameObjects.Group;
import Image = Phaser.GameObjects.Image;
import Rectangle = Phaser.GameObjects.Rectangle;
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Text = Phaser.GameObjects.Text;
import BaseSound = Phaser.Sound.BaseSound;
import {Util} from "../util/Util";

const sceneConfig: SettingsConfig = {
    active: false,
    visible: false,
    key: 'MainScene',
};

export class MainScene extends Scene {
    private _numberOfShips = 10;
    private _enemyField!: Group;
    private _ownField!: Group;
    private _fourSquareBtn!: Image;
    private _cannonBtn!: Image;
    private _directionBtn!: Image;
    private _gameState = GameState.INIT_ARRANGE;
    private _pinchOrDrag = false;
    private _desktop = false;
    private _explosionSprite!: Sprite;
    private _explosionEmptySprite!: Sprite;
    private _loadingImage!: Image;
    private _loadingRectangle!: Rectangle;
    private _ships: Map<number, Image> = new Map<number, Image>();
    private _revealed_ships: Map<number, Image> = new Map<number, Image>();
    private readonly _stateManger: StateManger;
    private _textBox!: Text;
    private _connect!: Image;
    private _disconnect!: Image;
    private _timer!: Timer;
    private _toast!: any;
    private _explosionSound!: BaseSound;

    constructor() {
        super(sceneConfig);
        this._stateManger = new StateManger(this);
    }

    //region Getters Setters
    get enemyField(): Phaser.GameObjects.Group {
        return this._enemyField;
    }

    get numberOfShips(): number {
        return this._numberOfShips;
    }

    get ownField(): Phaser.GameObjects.Group {
        return this._ownField;
    }

    get fourSquareBtn(): Phaser.GameObjects.Image {
        return this._fourSquareBtn;
    }

    get cannonBtn(): Phaser.GameObjects.Image {
        return this._cannonBtn;
    }

    get directionBtn(): Phaser.GameObjects.Image {
        return this._directionBtn;
    }

    get gameState(): GameState {
        return this._gameState;
    }

    set gameState(value: GameState) {
        this._gameState = value;
    }

    get pinchOrDrag(): boolean {
        return this._pinchOrDrag;
    }

    get desktop(): boolean {
        return this._desktop;
    }

    get explosionSprite(): Phaser.GameObjects.Sprite {
        return this._explosionSprite;
    }

    get explosionEmptySprite(): Phaser.GameObjects.Sprite {
        return this._explosionEmptySprite;
    }

    get ships(): Map<number, Phaser.GameObjects.Image> {
        return this._ships;
    }

    get loadingImage(): Phaser.GameObjects.Image {
        return this._loadingImage;
    }

    set loadingImage(value: Phaser.GameObjects.Image) {
        this._loadingImage = value;
    }

    get loadingRectangle(): Phaser.GameObjects.Rectangle {
        return this._loadingRectangle;
    }

    set loadingRectangle(value: Phaser.GameObjects.Rectangle) {
        this._loadingRectangle = value;
    }


    get textBox(): Phaser.GameObjects.Text {
        return this._textBox;
    }

    set textBox(value: Phaser.GameObjects.Text) {
        this._textBox = value;
    }

    get connect(): Phaser.GameObjects.Image {
        return this._connect;
    }

    set connect(value: Phaser.GameObjects.Image) {
        this._connect = value;
    }

    get disconnect(): Phaser.GameObjects.Image {
        return this._disconnect;
    }

    set disconnect(value: Phaser.GameObjects.Image) {
        this._disconnect = value;
    }

    get timer(): Timer {
        return this._timer;
    }

    set timer(value: Timer) {
        this._timer = value;
    }

    get toast(): any {
        return this._toast;
    }

    get stateManger(): StateManger {
        return this._stateManger;
    }

    get revealed_ships(): Map<number, Phaser.GameObjects.Image> {
        return this._revealed_ships;
    }

    set revealed_ships(value: Map<number, Phaser.GameObjects.Image>) {
        this._revealed_ships = value;
    }

//endregion

    public preload() {
        this.load.image('blue-square', './assets/blue-square.png');
        this.load.image('red-square', './assets/red-square.png');
        this.load.image('four-square', './assets/four-square.png');
        this.load.image('rounded-square', './assets/rounded-square.png');
        this.load.image('cannon', './assets/cannon.png');
        this.load.image('direction', './assets/direction.png');
        this.load.image('ship', './assets/ship.png');
        this.load.image('loading', './assets/loading.png');
        this.load.image('connect', './assets/connect.png');
        this.load.image('disconnect', './assets/disconnect.png');
        this.load.image('exploded', './assets/exploded.png');
        this.load.audio("explosion", "./assets/explosion.mp3")
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 130, frameHeight: 130});
        this._toast = this.createToast();
    }

    public create() {
        this._desktop = this.sys.game.device.os.desktop;
        this.pinch();
        this.createEnemyField();
        this.createOwnField();
        this.createFourSquareBtn()
        this.createCannonBtn();
        this.createDirectionBtn();
        this.createExplosionAnimation();
        this.createTextBox();
        this.createConnectionStatus();
        this.createLoading();
        //
        Util.PromptRefreshBrowser();
        //
        Socket.connect(localStorage.getItem("game_id")!, localStorage.getItem("user_id")!);
        this._stateManger.SocketEventSubscribe();
        this._timer = new Timer(this);
        this._explosionSound = this.sound.add("explosion");
        this._stateManger.changeState(GameState.INIT_ARRANGE);
    }

    public update() {
        if (this.loadingImage.visible && this.loadingRectangle.visible) {
            this._loadingImage.angle += 2;
        }
    }

    private createEnemyField() {
        this._enemyField = this.add.group(undefined, {
            key: "blue-square",
            repeat: 99,
            "setScale.x": 0.25,
            "setScale.y": 0.25,
        }).setOrigin(0, 0)

        Phaser.Actions.GridAlign(this._enemyField.getChildren(), {
            x: 160,
            y: 170,
            height: 20,
            width: 10,
            cellWidth: 55,
            cellHeight: 55,
            position: Phaser.Display.Align.CENTER
        });
        this.enemyFieldMouseEventHandler();
    }

    private enemyFieldMouseEventHandler() {
        this._enemyField.getChildren().forEach(value => {
            let indexOf = this._enemyField.getChildren().indexOf(value) ?? -1;
            let neighbors = this.findNeighbors(indexOf);
            value.on('pointerover', () => this._stateManger.enemyFieldPointerHover(value as Sprite, neighbors));
            value.on("pointerout", () => this._stateManger.enemyFieldPointerOut(value as Sprite, neighbors));
            value.on("pointerup", () => this._stateManger.enemyFieldPointerUp(value as Sprite, neighbors, indexOf));
        });

    }

    private findNeighbors(indexOf: number): Sprite[] {
        let neighbors: Sprite[] = [];
        let indexes = MainScene.findNeighborIndexes(indexOf);
        indexes.forEach(i => {
            neighbors.push(this._enemyField?.getChildren()[i] as Sprite);
        });
        return neighbors;
    }

    private static findNeighborIndexes(indexOf: number): number[] {
        let index1 = indexOf + 1;
        let index2 = indexOf + 10;
        let index3 = indexOf + 11;
        if (indexOf > 0 && (indexOf + 1) % 10 == 0) {
            index1 = indexOf - 1;
            index2 = indexOf + 9;
            index3 = indexOf + 10;
        }
        if (indexOf + 1 > 9 * 10) {
            index1 = indexOf + 1;
            index2 = indexOf - 9;
            index3 = indexOf - 10;
        }
        if (indexOf == 99) {
            index1 = 98;
            index2 = 99 - 10;
            index3 = 99 - 11;
        }
        return [indexOf, index1, index2, index3];
    }

    private createOwnField() {
        this._ownField = this.add.group(undefined, {
            key: "red-square",
            repeat: 99,
            "setScale.x": 0.25,
            "setScale.y": 0.25,
        }).setOrigin(0, 0)

        Phaser.Actions.GridAlign(this._ownField.getChildren(), {
            x: 160,
            y: 720,
            height: 20,
            width: 10,
            cellWidth: 55,
            cellHeight: 55,
            position: Phaser.Display.Align.CENTER
        });
        this.ownFieldMouseHandler()
    }

    private ownFieldMouseHandler() {
        this._ownField?.getChildren().forEach(value => {
            let child = value as Sprite;
            let indexOf = this._ownField?.getChildren().indexOf(value) ?? -1;
            child.setInteractive();
            child.on("pointerover", () => this._stateManger.ownFieldPointerHover(child, indexOf))
                .on("pointerout", () => this._stateManger.ownFieldPointerOut(child, indexOf))
                .on("pointerup", () => this._stateManger.ownFieldPointerUp(child, indexOf));
        })
    }

    private createFourSquareBtn() {
        this.add.image(650, 110, "rounded-square").setScale(0.13);
        this._fourSquareBtn = this.add.image(650, 110, "four-square").setScale(0.4);
        this._fourSquareBtn.on("pointerover", () => {
            this._fourSquareBtn?.setScale(0.45);
        }).on("pointerout", () => {
            this._fourSquareBtn?.setScale(0.4);
        }).on("pointerup", () => {
            this._stateManger.changeState(GameState.DETECTION);
        })

    }

    private createCannonBtn() {
        this.add.image(650, 230, "rounded-square").setScale(0.13);
        this._cannonBtn = this.add.image(650, 230, "cannon").setScale(0.30).setTintFill(0x000000);
        this._cannonBtn.on("pointerover", () => {
            this._cannonBtn?.setScale(0.35);
        }, this).on("pointerout", () => {
            this._cannonBtn?.setScale(0.30);
        }, this).on("pointerup", () => {
            if (!this._pinchOrDrag) {
                this._stateManger.changeState(GameState.EXPLOSION);
            }
        }, this);
    }

    private createDirectionBtn() {
        this.add.image(650, 350, "rounded-square").setScale(0.13);
        this._directionBtn = this.add.image(650, 350, "direction").setScale(0.17).setTintFill(0x000000);
        this._directionBtn.on("pointerover", () => {
            this._directionBtn?.setScale(0.20);
        }, this).on("pointerout", () => {
            this._directionBtn?.setScale(0.17);
        }, this).on("pointerup", () => {
            if (!this._pinchOrDrag) {
                this._stateManger.changeState(GameState.CHANGE_SHIP_LOCATION);
            }
        }, this);
    }

    private pinch() {
        if (!this.desktop) {
            // @ts-ignore
            let pinch = this.rexGestures.add.pinch();
            let camera = this.cameras.main;
            camera.setBounds(0, 0, 720, 1280)
            pinch.on('drag1', (pinch: any) => {
                this._pinchOrDrag = true;
                let drag1Vector = pinch.drag1Vector;
                camera.scrollX -= drag1Vector.x / camera.zoom;
                camera.scrollY -= drag1Vector.y / camera.zoom;
            }).on('pinch', (pinch: any) => {
                this._pinchOrDrag = true;
                let scaleFactor = pinch.scaleFactor;
                if (camera.zoom * scaleFactor > 1 && camera.zoom * scaleFactor < 2.4) {
                    camera.zoom *= scaleFactor;
                }
            }, this).on('pinchend', () => {
                window.setTimeout(() => {
                    this._pinchOrDrag = false;
                }, 300);
            }, this).on('drag1end', () => {
                window.setTimeout(() => {
                    this._pinchOrDrag = false;
                }, 300);
            }, this);
        }
    }

    //#######explosion###########

    private createExplosionAnimation() {
        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion', {first: 0, end: 25, start: 0}),
            frameRate: 20,
            yoyo: false,
            repeat: 0,
            hideOnComplete: true
        });
        this._explosionSprite = this.add.sprite(500, 300, 'explosion').setVisible(false);

        this.anims.create({
            key: 'explosionEmpty',
            frames: this.anims.generateFrameNumbers('explosion', {first: 20, end: 25, start: 20}),
            frameRate: 10,
            yoyo: false,
            repeat: 0,
            hideOnComplete: true
        });
        this._explosionEmptySprite = this.add.sprite(600, 300, 'explosionEmpty').setVisible(false);
    }

    playExplosion(x: number, y: number) {
        if (this._explosionSprite) {
            this._explosionSprite.setVisible(true);
            this._explosionSprite.x = x;
            this._explosionSprite.y = y;
            this._explosionSprite.anims.play("explosion");
            this._explosionSound.play();
        }
    }

    playExplosionEmpty(x: number, y: number) {
        if (this._explosionEmptySprite) {
            this._explosionEmptySprite.setVisible(true);
            this._explosionEmptySprite.x = x;
            this._explosionEmptySprite.y = y;
            this._explosionEmptySprite.anims.play("explosionEmpty");
        }
    }

    createLoading() {
        this._loadingRectangle = this.add.rectangle(-100, -100, 2000, 4000, 0x000000, 0.5);
        this._loadingImage = this.add.image((this.game.canvas.width / 2), this.game.canvas.height / 2, "loading").setScale(0.3);
        this._loadingRectangle.setInteractive();
        this._loadingRectangle.setVisible(false);
        this._loadingImage.setVisible(false);
        this._loadingImage.depth = 1001;
        this._loadingRectangle.depth = 1000;
    }

    private createTextBox() {
        this.add.rectangle(360, 1230, 720, 150, 0x000000);
        this._textBox = this.add.text(50, 1190, "", {
            color: '#FFFFFF',
            direction: 'rtl',
            wordWrap: {
                width: 700
            },
            maxLines: 2,
            alignment: 'right',
            fontSize: 25,
        }).setOrigin(0);
        this._textBox.initRTL();
    }

    private createConnectionStatus() {
        this._connect = this.add.image(700, 20, "connect").setScale(0.3);
        this._disconnect = this.add.image(700, 20, "disconnect").setScale(0.3).setVisible(false);
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
