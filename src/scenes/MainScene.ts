import "../../assets/blue-square.png"
import "../../assets/red-square.png"
import "../../assets/four-square.png"
import "../../assets/cannon.png"
import "../../assets/explosion.png"
import "../../assets/rounded-square.png"
import "../../assets/ship.png"
import "../../assets/direction.png"
import "../../assets/loading.png"
import "../../assets/message.png"
import {Scene} from "phaser";
import {GameState, StateManger} from "./states/StateManger";
import Sprite = Phaser.GameObjects.Sprite;
import Group = Phaser.GameObjects.Group;
import Image = Phaser.GameObjects.Image;
import Rectangle = Phaser.GameObjects.Rectangle;
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Text = Phaser.GameObjects.Text;

const sceneConfig: SettingsConfig = {
    active: false,
    visible: false,
    key: 'MainScene',
};

export class MainScene extends Scene {
    get stateManger(): StateManger {
        return this._stateManger;
    }

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
    private readonly _stateManger: StateManger;
    private text!: Text;

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
        this.load.image('message', './assets/message.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 130, frameHeight: 130});
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
        this.createLoading();
        this.createTextBox();
        this._stateManger.changeState(GameState.INIT_ARRANGE);
    }

    public update() {


        if (this._gameState === GameState.WAITING) {
            this._loadingImage.angle += 2;
        }

    }

    private createEnemyField() {
        this._enemyField = this.add.group(undefined, {
            key: "blue-square",
            repeat: 199,
            "setScale.x": 0.15,
            "setScale.y": 0.15,
        }).setOrigin(0, 0)

        Phaser.Actions.GridAlign(this._enemyField.getChildren(), {
            x: 150,
            y: 150,
            height: 10,
            width: 20,
            cellWidth: 35,
            cellHeight: 35,
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
            value.on("pointerup", () => this._stateManger.enemyFieldPointerUp(value as Sprite, neighbors));
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
        let index2 = indexOf + 20;
        let index3 = indexOf + 21;
        if (indexOf > 0 && (indexOf + 1) % 20 == 0) {
            index1 = indexOf - 1;
            index2 = indexOf + 19;
            index3 = indexOf + 20;
        }
        if (indexOf + 1 > 9 * 20) {
            index1 = indexOf + 1;
            index2 = indexOf - 19;
            index3 = indexOf - 20;
        }
        if (indexOf == 199) {
            index1 = 198;
            index2 = 199 - 20;
            index3 = 199 - 21;
        }
        return [indexOf, index1, index2, index3];
    }

    private createOwnField() {
        this._ownField = this.add.group(undefined, {
            key: "red-square",
            repeat: 199,
            "setScale.x": 0.15,
            "setScale.y": 0.15,
        }).setOrigin(0, 0)

        Phaser.Actions.GridAlign(this._ownField.getChildren(), {
            x: 150,
            y: 500,
            height: 10,
            width: 20,
            cellWidth: 35,
            cellHeight: 35,
            position: Phaser.Display.Align.CENTER
        });
        this.ownFieldMouseHandler()
    }

    private ownFieldMouseHandler() {
        this._ownField?.getChildren().forEach(value => {
            let child = value as Sprite;
            let indexOf = this._ownField?.getChildren().indexOf(value) ?? -1;
            child.setInteractive();
            child.on("pointerover", () => this.stateManger.ownFieldPointerHover(child, indexOf))
                .on("pointerout", () => this.stateManger.ownFieldPointerOut(child, indexOf))
                .on("pointerup", () => this.stateManger.ownFieldPointerUp(child, indexOf));
        })
    }

    private createFourSquareBtn() {
        this.add.image(800, 100, "rounded-square").setScale(0.12);
        this._fourSquareBtn = this.add.image(800, 100, "four-square").setScale(0.35);
        this._fourSquareBtn.on("pointerover", () => {
            this._fourSquareBtn?.setScale(0.40);
        }).on("pointerout", () => {
            this._fourSquareBtn?.setScale(0.35);
        }).on("pointerup", () => {
            this._stateManger.changeState(GameState.DETECTION);
        })

    }

    private createCannonBtn() {
        this.add.image(800, 210, "rounded-square").setScale(0.12);
        this._cannonBtn = this.add.image(800, 210, "cannon").setScale(0.30).setTintFill(0x000000);
        this._cannonBtn.on("pointerover", () => {
            this._cannonBtn?.setScale(0.32);
        }, this).on("pointerout", () => {
            this._cannonBtn?.setScale(0.30);
        }, this).on("pointerup", () => {
            if (!this._pinchOrDrag) {
                this._stateManger.changeState(GameState.EXPLOSION);
            }
        }, this);
    }

    private createDirectionBtn() {
        this.add.image(800, 320, "rounded-square").setScale(0.12);
        this._directionBtn = this.add.image(800, 320, "direction").setScale(0.17).setTintFill(0x000000);
        this._directionBtn.on("pointerover", () => {
            this._directionBtn?.setScale(0.19);
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
            camera.setBounds(0, 0, 1000, 750)
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
                setTimeout(() => {
                    this._pinchOrDrag = false;
                }, 300)
            }, this).on('drag1end', () => {
                setTimeout(() => {
                    this._pinchOrDrag = false;
                }, 300)
            }, this)
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
        this._explosionSprite = this.add.sprite(500, 300, 'explosion').setScale(0.5).setVisible(false);

        this.anims.create({
            key: 'explosionEmpty',
            frames: this.anims.generateFrameNumbers('explosion', {first: 20, end: 25, start: 20}),
            frameRate: 10,
            yoyo: false,
            repeat: 0,
            hideOnComplete: true
        });
        this._explosionEmptySprite = this.add.sprite(600, 300, 'explosionEmpty').setScale(0.5).setVisible(false);
    }

    playExplosion(x: number, y: number) {
        if (this._explosionSprite) {
            this._explosionSprite.setVisible(true);
            this._explosionSprite.x = x;
            this._explosionSprite.y = y;
            this._explosionSprite.anims.play("explosion");
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
        this._loadingRectangle = this.add.rectangle(-100, -100, 2500, 2500, 0x000000, 0.5);
        this._loadingImage = this.add.image((this.game.canvas.width / 2) - 124, this.game.canvas.height / 2, "loading").setScale(0.3);
        this._loadingRectangle.setInteractive();
        this._loadingRectangle.setVisible(false);
        this._loadingImage.setVisible(false);
    }

    private createTextBox() {
        this.add.image(870, 560, "message").setScale(0.8);
        this.text = this.add.text(780, 420, "", {
            color: '#1f3b1f',
            direction: 'rtl',
            wordWrap: {
                width: 200
            },
            maxLines: 15,
            alignment: 'right',
            fontSize: 16,
        }).setOrigin(0);
        this.text.initRTL();
    }


}
