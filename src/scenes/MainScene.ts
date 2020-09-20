import "../../assets/blue-square.png"
import "../../assets/red-square.png"
import "../../assets/four-square.png"
import "../../assets/cannon.png"
import "../../assets/explosion.png"
import "../../assets/rounded-square.png"
import "../../assets/ship.png"
import "../../assets/direction.png"
import {Scene} from "phaser";
import {YesNoDialog} from "../dialog/YesNoDialog";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import Group = Phaser.GameObjects.Group;
import Image = Phaser.GameObjects.Image;
import {OKDialog} from "../dialog/OKDialog";


const sceneConfig: SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

enum GameMode {
    INIT_ARRANGE,
    DETECTION,
    EXPLODE,
    CHANGE_SHIP_LOCATION,
    WAITING,
    PLAY
}

const NUMBER_OF_SHIP = 10;

export class MainScene extends Scene {

    private enemyField?: Group;
    private ownField?: Group;
    private fourSquareBtn?: Image;
    private cannonBtn?: Image;
    private directionBtn?: Image;
    private gameMode = GameMode.INIT_ARRANGE;
    private pinchOrDrag = false;
    private desktop = false;
    private explosionSprite?: Sprite;
    private explosionEmptySprite?: Sprite;
    //
    private ships: Map<number, Image> = new Map<number, Image>();
    private fourSquareToEmpty: Map<number, Image> = new Map<number, Image>();
    private squareToExplode: Map<number, Image> = new Map<number, Image>();
    private shipToMove: Map<number, Image> = new Map<number, Image>();

    constructor() {
        super(sceneConfig);
    }

    public preload() {

        this.load.image('blue-square', './assets/blue-square.png');
        this.load.image('red-square', './assets/red-square.png');
        this.load.image('four-square', './assets/four-square.png');
        this.load.image('rounded-square', './assets/rounded-square.png');
        this.load.image('cannon', './assets/cannon.png');
        this.load.image('direction', './assets/direction.png');
        this.load.image('ship', './assets/ship.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 130, frameHeight: 130});

    }

    public create() {

        this.desktop = this.sys.game.device.os.desktop;
        this.pinch();
        this.createEnemyField();
        this.createOwnField();
        this.createFourSquareBtn()
        this.createCannonBtn();
        this.createDirectionBtn();
        this.createExplosionAnimation();
        this.changeGameMode(GameMode.INIT_ARRANGE);
        /*
                // @ts-ignore
                var textArea = this.rexUI.add.textArea({
                    x: 400,
                    y: 300,
                    width: 220,
                    height: 220,

                    // @ts-ignore
                    background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 0, 0x4e342e),

                    // text: this.add.text(),
                    // @ts-ignore
                    text: this.rexUI.add.BBCodeText(),

                    // textMask: false,

                    // slider: {
                    //     @ts-ignore
                    // track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x260e04),
                    // @ts-ignore
                    // thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x7b5e57),
                    // },
                    // scroller: true,
                })
                    .layout()
                // .drawBounds(this.add.graphics(), 0xff0000);

                textArea.setText("sdfsdafsdaf sfsda asdf s" +
                    "dsfsadfsdf" +
                    "asdfsad asdfaf asdfdssad sdfdsa dfsad sadf" +
                    "dsfsadf asdf sdf dasfd safdsf asdfdsa fsa" +
                    " sdfdsa dsafdas fdsaf sadfsda fdaerewr bwerwer ew" +
                    "rewrewr qer" +
                    " wqer weqrewrwerewrwerwerf erwer ewr wqe" +
                    "dfsd asdfsdaf sadf asdfsda sfadsdaf safsdaf sadfsadf sadfsadfsd");*/

    }

    public update() {

    }

    private createEnemyField() {
        this.enemyField = this.add.group(undefined, {
            key: "blue-square",
            repeat: 199,
            "setScale.x": 0.15,
            "setScale.y": 0.15,
        }).setOrigin(0, 0)

        Phaser.Actions.GridAlign(this.enemyField.getChildren(), {
            x: 150,
            y: 150,
            height: 10,
            width: 20,
            cellWidth: 35,
            cellHeight: 35,
            position: Phaser.Display.Align.CENTER
        });
        this.mainFieldMouseEventHandler();
    }

    private mainFieldMouseEventHandler() {
        this.enemyField?.getChildren().forEach(value => {

            let indexOf = this.enemyField?.getChildren().indexOf(value) ?? -1;
            let neighbors = this.findNeighbors(indexOf);

            value.on('pointerover', () => {
                    if (this.isMode(GameMode.DETECTION) && this.game.device.os.desktop) {
                        neighbors.forEach(sprite => {
                            sprite?.setTintFill(0x0e4293)
                        });
                    } else if (this.isMode(GameMode.EXPLODE) && this.game.device.os.desktop) {
                        (value as Sprite).setTintFill(0x0e4293);
                    }
                }
            );

            value.on("pointerout", () => {
                if (this.isMode(GameMode.DETECTION) && this.desktop) {
                    neighbors.forEach(sprite => {
                        if (sprite) {
                            sprite.clearTint();
                        }
                    });
                } else if (this.isMode(GameMode.EXPLODE) && this.desktop) {
                    (value as Sprite).clearTint();
                }
            });

            value.on("pointerup", () => {

                if (this.isMode(GameMode.DETECTION)) {
                    if (this.desktop) {

                        //todo: do action here
                        setTimeout(() => {
                            neighbors.forEach(sprite => {
                                if (sprite) {
                                    sprite.setVisible(false);
                                }
                            });
                            this.changeGameMode(GameMode.PLAY);
                        }, 2000)


                    } else {
                        //Mobile
                        neighbors.forEach(sprite => {
                            if (sprite) {
                                sprite.setTintFill(0x121212);
                            }
                        });

                        new YesNoDialog(this, "", "                مطمئنی؟", () => {

                            setTimeout(() => {
                                neighbors.forEach(sprite => {
                                    if (sprite) {
                                        sprite.setVisible(false);
                                        //todo: do your action here
                                    }
                                });
                                this.changeGameMode(GameMode.PLAY);
                            }, 2000)

                        }, () => {
                            neighbors.forEach(sprite => {
                                if (sprite) {
                                    sprite.clearTint();
                                }
                            });

                        });

                    }
                } else if (this.isMode(GameMode.EXPLODE)) {
                    if (this.desktop) {
                        setTimeout(() => {
                            (value as Sprite).setVisible(false);
                            //todo: do your action here
                            this.playExplosionEmpty((value as Sprite).x, (value as Sprite).y);
                            this.changeGameMode(GameMode.PLAY);
                        }, 2000);
                    } else {
                        (value as Sprite).setTintFill(0x121212);
                        new YesNoDialog(this, "", "                مطمئنی؟", () => {
                            setTimeout(() => {
                                (value as Sprite).setVisible(false);
                                //todo: do your action here
                                this.playExplosionEmpty((value as Sprite).x, (value as Sprite).y);
                                this.changeGameMode(GameMode.PLAY);
                            }, 2000);
                        }, () => {
                            (value as Sprite).clearTint();
                        });
                    }
                }
            });
        });

    }

    private findNeighbors(indexOf: number): Sprite[] {
        let neighbors: Sprite[] = [];
        let indexes = MainScene.findNeighborIndexes(indexOf);
        indexes.forEach(i => {
            neighbors.push(this.enemyField?.getChildren()[i] as Sprite);
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
        this.ownField = this.add.group(undefined, {
            key: "red-square",
            repeat: 199,
            "setScale.x": 0.15,
            "setScale.y": 0.15,
        }).setOrigin(0, 0)

        Phaser.Actions.GridAlign(this.ownField.getChildren(), {
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

        let lastIndex = -1;
        let lastNeighbors: number[] = [];

        this.ownField?.getChildren().forEach(value => {
            let child = value as Sprite;
            let indexOf = this.ownField?.getChildren().indexOf(value) ?? -1;
            child.setInteractive();
            child.on("pointerover", () => {

                if (this.desktop && this.isMode(GameMode.INIT_ARRANGE) && this.ships.size < NUMBER_OF_SHIP && this.ships.get(indexOf) === undefined) {
                    child.setTintFill(0x570d0d);
                } else if (this.desktop && this.isMode(GameMode.CHANGE_SHIP_LOCATION)) {
                    this.ships.get(indexOf)?.setScale(0.4);
                }

            }).on("pointerout", () => {
                if (this.isMode(GameMode.INIT_ARRANGE)) {
                    child.clearTint();
                } else if (this.isMode(GameMode.CHANGE_SHIP_LOCATION)) {
                    this.ships.get(indexOf)?.setScale(0.3);
                }
            }).on("pointerup", () => {
                if (this.isMode(GameMode.INIT_ARRANGE)) {
                    if (this.ships.get(indexOf) == undefined && this.ships.size < NUMBER_OF_SHIP) {
                        this.ships.set(indexOf, this.add.image(child.x, child.y, "ship").setScale(0.3));
                    } else {
                        this.ships.get(indexOf)?.destroy();
                        this.ships.delete(indexOf);
                    }
                    if (this.ships.size >= NUMBER_OF_SHIP) {
                        new YesNoDialog(this, "", "                  مطمئنی؟", () => {
                            //todo: call server
                            this.changeGameMode(GameMode.PLAY);
                        }, () => {

                        })
                    }
                } else if (this.isMode(GameMode.CHANGE_SHIP_LOCATION)) {
                    if (this.ships.get(indexOf) !== undefined) {
                        if (lastIndex !== indexOf) {
                            this.ships.get(lastIndex)?.clearTint();
                            lastIndex = indexOf;
                            lastNeighbors.forEach(v => {
                                (this.ownField?.getChildren()[v] as Sprite).clearTint();
                            });
                        }
                        this.ships.get(indexOf)?.setTintFill(0xffffff);
                        let neighbors = this.neighbors(indexOf);
                        neighbors.forEach(v => {
                            (this.ownField?.getChildren()[v] as Sprite).setTintFill(0x570d0d);
                        })
                        lastNeighbors = neighbors;
                    } else if (lastNeighbors.indexOf(indexOf) >= 0) {
                        //click to move
                        this.ships.get(lastIndex)?.clearTint();
                        this.ships.get(lastIndex)?.setX((this.ownField?.getChildren()[indexOf] as Sprite).x);
                        this.ships.get(lastIndex)?.setY((this.ownField?.getChildren()[indexOf] as Sprite).y);
                        let ship = this.ships.get(lastIndex);
                        if (ship) {
                            this.ships.set(indexOf, ship);
                            this.ships.delete(lastIndex);
                        }
                        lastNeighbors.forEach(v => {
                            (this.ownField?.getChildren()[v] as Sprite).clearTint();
                        });
                    }
                }
            });
        })
    }

    private neighbors(indexOf: number) {
        let neighbors: number[] = [];
        if (indexOf - 21 >= 0 && indexOf - 21 < 200 && indexOf % 20 != 0 && this.ships.get(indexOf - 21) === undefined) {
            neighbors.push(indexOf - 21);
        }
        if (indexOf - 20 >= 0 && indexOf - 20 < 200 && this.ships.get(indexOf - 20) === undefined) {
            neighbors.push(indexOf - 20);
        }
        if (indexOf - 19 >= 0 && indexOf - 19 < 200 && (indexOf + 1) % 20 != 0 && this.ships.get(indexOf - 19) === undefined) {
            neighbors.push(indexOf - 19);
        }
        if (indexOf - 1 >= 0 && indexOf - 1 < 200 && indexOf % 20 != 0 && this.ships.get(indexOf - 1) === undefined) {
            neighbors.push(indexOf - 1);
        }
        if (indexOf + 1 >= 0 && indexOf + 1 < 200 && (indexOf + 1) % 20 != 0 && this.ships.get(indexOf + 1) === undefined) {
            neighbors.push(indexOf + 1);
        }
        if (indexOf + 19 >= 0 && indexOf + 19 < 200 && indexOf % 20 != 0 && indexOf % 20 != 0 && this.ships.get(indexOf + 19) === undefined) {
            neighbors.push(indexOf + 19);
        }
        if (indexOf + 20 >= 0 && indexOf + 20 < 200 && this.ships.get(indexOf + 20) === undefined) {
            neighbors.push(indexOf + 20);
        }
        if (indexOf + 21 >= 0 && indexOf + 21 < 200 && (indexOf + 1) % 20 != 0 && this.ships.get(indexOf + 21) === undefined) {
            neighbors.push(indexOf + 21);
        }
        return neighbors;
    }

    private pinch() {
        // @ts-ignore
        let pinch = this.rexGestures.add.pinch();
        let camera = this.cameras.main;
        pinch.on('drag1', (pinch: any) => {
            if (camera.zoom > 1.1 || Math.abs(camera.scrollX) > 20 || Math.abs(camera.scrollY) > 20) {
                this.pinchOrDrag = true;
                let drag1Vector = pinch.drag1Vector;
                if (Math.abs(camera.scrollX - (drag1Vector.x / camera.zoom)) < (700 / camera.zoom)) {
                    camera.scrollX -= drag1Vector.x / camera.zoom;
                }
                if (Math.abs(camera.scrollY - (drag1Vector.y / camera.zoom)) < (500 / camera.zoom)) {
                    camera.scrollY -= drag1Vector.y / camera.zoom;
                }
            }
        }).on('pinch', (pinch: any) => {
            this.pinchOrDrag = true;
            let scaleFactor = pinch.scaleFactor;
            if (camera.zoom * scaleFactor > 1 && camera.zoom * scaleFactor < 2.4) {
                camera.zoom *= scaleFactor;
            }
        }, this).on('pinchend', () => {
            setTimeout(() => {
                this.pinchOrDrag = false;
            }, 300)
        }, this).on('drag1end', () => {
            this.pinchOrDrag = false;
        }, this)
    }

    private createFourSquareBtn() {
        this.add.image(800, 100, "rounded-square").setScale(0.12);
        this.fourSquareBtn = this.add.image(800, 100, "four-square").setScale(0.35);
        this.fourSquareBtn.on("pointerover", () => {
            this.fourSquareBtn?.setScale(0.40);
        }).on("pointerout", () => {
            this.fourSquareBtn?.setScale(0.35);
        }).on("pointerup", () => {
            this.changeGameMode(GameMode.DETECTION);
        })

    }

    private createCannonBtn() {
        this.add.image(800, 210, "rounded-square").setScale(0.12);
        this.cannonBtn = this.add.image(800, 210, "cannon").setScale(0.30).setTintFill(0x000000);
        this.cannonBtn.on("pointerover", () => {
            this.cannonBtn?.setScale(0.32);
        }, this).on("pointerout", () => {
            this.cannonBtn?.setScale(0.30);
        }, this).on("pointerup", () => {
            if (!this.pinchOrDrag) {
                this.changeGameMode(GameMode.EXPLODE);
            }
        }, this);
    }

    private createDirectionBtn() {
        this.add.image(800, 320, "rounded-square").setScale(0.12);
        this.directionBtn = this.add.image(800, 320, "direction").setScale(0.17).setTintFill(0x000000);
        this.directionBtn.on("pointerover", () => {
            this.directionBtn?.setScale(0.19);
        }, this).on("pointerout", () => {
            this.directionBtn?.setScale(0.17);
        }, this).on("pointerup", () => {
            if (!this.pinchOrDrag) {
                this.changeGameMode(GameMode.CHANGE_SHIP_LOCATION);
            }
        }, this);
    }


    private changeGameMode(mode: GameMode) {
        if (this.pinchOrDrag) {
            return;
        }
        this.gameMode = mode;
        this.clearEnemyField();
        this.clearOwnField();
        this.clearShips();
        this.clearButtons();
        switch (mode) {
            case GameMode.INIT_ARRANGE:
                this.disableGameButtons();
                this.enableOwnField();
                this.disableEnemyField();
                break;
            case GameMode.DETECTION:
                this.enableEnemyField();
                this.enableGameButtons();
                this.disableOwnField();
                this.fourSquareBtn?.setTintFill(0xFFFFFF);
                break;
            case GameMode.EXPLODE:
                this.enableEnemyField();
                this.enableGameButtons();
                this.disableOwnField();
                this.cannonBtn?.setTintFill(0xffffff);
                break;
            case GameMode.CHANGE_SHIP_LOCATION:
                this.disableEnemyField();
                this.enableGameButtons();
                this.enableOwnField();
                this.directionBtn?.setTintFill(0xFFFFFF);
                break;
            case GameMode.WAITING:
                this.disableGameButtons();
                this.disableEnemyField();
                this.disableOwnField();
                break;
            case GameMode.PLAY:
                this.enableGameButtons();
                this.disableOwnField();
                this.disableEnemyField();
                break;

        }
    }

    private isMode(mode: GameMode) {
        return mode === this.gameMode && !this.pinchOrDrag;
    }

    private disableGameButtons() {
        this.fourSquareBtn?.removeInteractive();
        this.cannonBtn?.removeInteractive();
        this.directionBtn?.removeInteractive();
    }

    private enableGameButtons() {
        this.fourSquareBtn?.setInteractive();
        this.cannonBtn?.setInteractive();
        this.directionBtn?.setInteractive();
    }

    private disableEnemyField() {
        this.enemyField?.getChildren().forEach(value => {
            value.disableInteractive();
        });
    }

    private enableEnemyField() {
        this.enemyField?.getChildren().forEach(value => {
            value.setInteractive();
        });
    }


    private disableOwnField() {
        this.ownField?.getChildren().forEach(value => {
            value.disableInteractive();
        });
    }

    private enableOwnField() {
        this.ownField?.getChildren().forEach(value => {
            value.setInteractive();
        });
    }

    private clearOwnField() {
        this.ownField?.getChildren().forEach(value => {
            (value as Sprite).clearTint();
        })
    }

    private clearEnemyField() {
        this.enemyField?.getChildren().forEach(value => {
            (value as Sprite).clearTint();
        })
    }

    private clearButtons() {
        this.cannonBtn?.clearTint();
        this.directionBtn?.clearTint();
        this.fourSquareBtn?.clearTint();
    }

    private clearShips() {
        this.ships.forEach(value => value.clearTint());
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
        this.explosionSprite = this.add.sprite(500, 300, 'explosion').setScale(0.5).setVisible(false);

        this.anims.create({
            key: 'explosionEmpty',
            frames: this.anims.generateFrameNumbers('explosion', {first: 20, end: 25, start: 20}),
            frameRate: 10,
            yoyo: false,
            repeat: 0,
            hideOnComplete: true
        });
        this.explosionEmptySprite = this.add.sprite(600, 300, 'explosionEmpty').setScale(0.5).setVisible(false);
    }

    private playExplosion(x: number, y: number) {
        if (this.explosionSprite) {
            this.explosionSprite.setVisible(true);
            this.explosionSprite.x = x;
            this.explosionSprite.y = y;
            this.explosionSprite.anims.play("explosion");
        }
    }

    private playExplosionEmpty(x: number, y: number) {
        if (this.explosionEmptySprite) {
            this.explosionEmptySprite.setVisible(true);
            this.explosionEmptySprite.x = x;
            this.explosionEmptySprite.y = y;
            this.explosionEmptySprite.anims.play("explosionEmpty");
        }
    }


}
