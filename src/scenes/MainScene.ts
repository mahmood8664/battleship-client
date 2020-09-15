import "../../assets/blue-square.png"
import "../../assets/red-square.png"
import "../../assets/four-square.png"
import "../../assets/cannon.png"
import "../../assets/explosion.png"
import "../../assets/rounded-square.png"
import "../../assets/ship.png"
import "../../assets/direction.png"
import {BlendModes, Scene} from "phaser";
import {YesNoDialog} from "./YesNoDialog";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import Group = Phaser.GameObjects.Group;
import Image = Phaser.GameObjects.Image;
import {OKDialog} from "./OKDialog";


const sceneConfig: SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

enum GameMode {
    ARRANGE,
    DETECTION,
    EXPLODE,
    DIRECTION,
    NONE
}

export class MainScene extends Scene {


    private enemyField?: Group;
    private ownField?: Group;
    private fourSquare?: Image;
    private cannon?: Image;
    private direction?: Image;
    private gameMode = GameMode.ARRANGE;
    private pinchOrDrag = false;
    private desktop = false;
    private explosionSprite?: Sprite;
    private explosionEmptySprite?: Sprite;
    private ships: Map<number, Image> = new Map<number, Image>();

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
        this.drawFourSquareBtn()
        this.createCannon();
        this.createDirection();
        this.createExplosionAnimation();
        this.selectCannonPositions();
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

            let indexOf = this.enemyField?.getChildren().indexOf(value);
            if (indexOf != undefined || indexOf != null) {
                let neighbors = this.findNeighbors(indexOf, value);

                value.setInteractive();
                value.on('pointerover', () => {
                        if (this.gameMode === GameMode.DETECTION && !this.pinchOrDrag && this.game.device.os.desktop) {
                            neighbors.forEach(sprite => {
                                if (sprite) {
                                    sprite.setTintFill(0x0e4293)
                                }
                            });
                        } else if (this.gameMode === GameMode.EXPLODE && !this.pinchOrDrag && this.game.device.os.desktop) {
                            (value as Sprite).setTintFill(0x0e4293);
                        }
                    }
                );

                value.on("pointerout", () => {
                    if (this.gameMode === GameMode.DETECTION && !this.pinchOrDrag && this.desktop) {
                        neighbors.forEach(sprite => {
                            if (sprite) {
                                sprite.clearTint();
                            }
                        });
                    } else if (this.gameMode === GameMode.EXPLODE && !this.pinchOrDrag && this.desktop) {
                        neighbors.forEach(sprite => {
                            if (sprite) {
                                sprite.clearTint();
                            }
                        });
                    }
                });

                value.on("pointerup", () => {

                    if (this.gameMode === GameMode.DETECTION && !this.pinchOrDrag) {
                        if (this.desktop) {
                            neighbors.forEach(sprite => {
                                if (sprite) {
                                    sprite.setVisible(false);
                                    //todo: do your action here
                                }
                            });
                            this.disableDetectionMode();
                        } else {
                            //for mobile get confirmation of user
                            neighbors.forEach(sprite => {
                                if (sprite) {
                                    sprite.setTintFill(0x121212);
                                }
                            });

                            new YesNoDialog(this, "", "                مطمئنی؟", () => {
                                neighbors.forEach(sprite => {
                                    if (sprite) {
                                        sprite.setVisible(false);
                                        //todo: do your action here
                                    }
                                });
                                this.disableDetectionMode();
                            }, () => {
                                neighbors.forEach(sprite => {
                                    if (sprite) {
                                        sprite.clearTint();
                                    }
                                });

                            });

                        }
                    } else if (this.gameMode === GameMode.EXPLODE && !this.pinchOrDrag) {
                        if (this.desktop) {
                            (value as Sprite).setVisible(false);
                            //todo: do your action here

                            this.playExplosionEmpty((value as Sprite).x, (value as Sprite).y);

                            this.disableExplodeMode();
                        } else {
                            (value as Sprite).setTintFill(0x121212);
                            new YesNoDialog(this, "", "                مطمئنی؟", () => {
                                (value as Sprite).setVisible(false);
                                //todo: do your action here

                                this.playExplosionEmpty((value as Sprite).x, (value as Sprite).y);

                                this.disableExplodeMode();
                            }, () => {
                                (value as Sprite).clearTint();
                            });
                        }
                    }
                });
            }
        });

    }

    private findNeighbors(indexOf: number, value: Phaser.GameObjects.GameObject): Sprite[] {
        let neighbors: Sprite[] = [];

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

        neighbors.push(value as Sprite);
        neighbors.push(this.enemyField?.getChildren()[index1] as Sprite);
        neighbors.push(this.enemyField?.getChildren()[index2] as Sprite);
        neighbors.push(this.enemyField?.getChildren()[index3] as Sprite);
        return neighbors;
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
        this.ownField?.getChildren().forEach(value => {
            let child = value as Sprite;
            child.setInteractive();
            child.on("pointerover", () => {
                let indexOf = this.ownField?.getChildren().indexOf(value) ?? -1;
                if (this.gameMode === GameMode.ARRANGE && !this.pinchOrDrag && this.ships.size < 10 && this.ships.get(indexOf) === undefined) {
                    child.setTintFill(0x570d0d);
                }
                if (this.gameMode === GameMode.DIRECTION && !this.pinchOrDrag) {

                    if (this.ships.get(indexOf) !== undefined) {
                        this.ships.get(indexOf)?.setScale(0.4);
                    }
                }
            }).on("pointerout", () => {
                let indexOf = this.ownField?.getChildren().indexOf(value) ?? -1;
                if (this.gameMode === GameMode.ARRANGE) {
                    child.clearTint();
                }
                if (this.gameMode === GameMode.DIRECTION) {
                    if (indexOf && this.ships.get(indexOf) !== undefined) {
                        this.ships.get(indexOf)?.setScale(0.3);
                    }
                }
            }).on("pointerup", () => {
                let indexOf = this.ownField?.getChildren().indexOf(value) ?? -1;
                if (this.gameMode === GameMode.ARRANGE && !this.pinchOrDrag) {
                    if (this.ships.get(indexOf) == undefined && this.ships.size < 10) {
                        this.ships.set(indexOf, this.add.image(child.x, child.y, "ship").setScale(0.3));
                    } else {
                        this.ships.get(indexOf)?.destroy();
                        this.ships.delete(indexOf);
                    }
                    if (this.ships.size >= 10) {
                        new YesNoDialog(this, "", "                مطمئنی؟", () => {
                            //todo: call server
                            this.gameMode = GameMode.NONE;
                        }, () => {
                            //continue
                        });
                    }
                }

                if (this.gameMode === GameMode.DIRECTION) {
                    if (this.ships.get(indexOf) !== undefined) {
                        if (this.lastIndex !== indexOf) {
                            this.ships.get(this.lastIndex)?.clearTint();
                            this.lastIndex = indexOf;
                            this.lastNeighbors.forEach(v => {
                                (this.ownField?.getChildren()[v] as Sprite).clearTint();
                            });
                        }
                        this.ships.get(indexOf)?.setTintFill(0xffffff);
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
                        neighbors.forEach(v => {
                            (this.ownField?.getChildren()[v] as Sprite).setTintFill(0x570d0d);
                        })
                        this.lastNeighbors = neighbors;
                    }


                }
            });
        })
    }

    private lastIndex = -1;
    private lastNeighbors: number[] = [];

    private pinch() {
        // @ts-ignore
        let pinch = this.rexGestures.add.pinch();
        let camera = this.cameras.main;
        pinch.on('drag1', (pinch: any) => {
            this.pinchOrDrag = true;
            let drag1Vector = pinch.drag1Vector;
            if (Math.abs(camera.scrollX - (drag1Vector.x / camera.zoom)) < (700 / camera.zoom))
                camera.scrollX -= drag1Vector.x / camera.zoom;
            if (Math.abs(camera.scrollY - (drag1Vector.y / camera.zoom)) < (500 / camera.zoom))
                camera.scrollY -= drag1Vector.y / camera.zoom;
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

    private drawFourSquareBtn() {
        this.add.image(800, 100, "rounded-square").setScale(0.12);
        this.fourSquare = this.add.image(800, 100, "four-square");
        this.fourSquare.setInteractive()
        this.fourSquare.setScale(0.35)
        this.fourSquare.on("pointerover", () => {
            this.fourSquare?.setScale(0.40);
        }).on("pointerout", () => {
            this.fourSquare?.setScale(0.35);
        }).on("pointerup", () => {
            if (!this.pinchOrDrag) {
                if (this.gameMode === GameMode.DETECTION) {
                    this.disableDetectionMode();
                } else {
                    this.enableDetectionMode();
                }
                this.disableExplodeMode();
                this.disableDirectionMode();
            }
        })

    }

    private createCannon() {
        this.add.image(800, 210, "rounded-square").setScale(0.12);
        this.cannon = this.add.image(800, 210, "cannon");
        this.cannon.setInteractive();
        this.cannon.setScale(0.45);
        this.cannon.setTintFill(0x000000)

        this.cannon.on("pointerover", () => {
            this.cannon?.setScale(0.55);
        }, this).on("pointerout", () => {
            this.cannon?.setScale(0.45);
        }, this).on("pointerup", () => {
            if (!this.pinchOrDrag) {
                if (this.gameMode === GameMode.EXPLODE) {
                    this.disableExplodeMode()
                } else {
                    this.enableExplodeMode();
                }
                this.disableDetectionMode();
                this.disableDirectionMode();
            }
        }, this);
    }

    private createDirection() {
        this.add.image(800, 320, "rounded-square").setScale(0.12);
        this.direction = this.add.image(800, 320, "direction").setScale(0.17);
        this.direction.setInteractive();
        this.direction.setTintFill(0x000000)

        this.direction.on("pointerover", () => {
            this.direction?.setScale(0.20);
        }, this).on("pointerout", () => {
            this.direction?.setScale(0.17);
        }, this).on("pointerup", () => {
            if (!this.pinchOrDrag) {
                if (this.gameMode === GameMode.DIRECTION) {
                    this.disableDirectionMode()
                } else {
                    this.enableDirectionMode();
                }
                this.disableDetectionMode();
                this.disableExplodeMode();
            }
        }, this);
    }

    private enableExplodeMode() {
        if (MainScene.isBattleStarted(this.gameMode)) {
            this.gameMode = GameMode.EXPLODE;
            this.cannon?.setTintFill(0xffffff);
        }
    }

    private disableExplodeMode() {
        if (this.gameMode === GameMode.EXPLODE) {
            this.gameMode = GameMode.NONE;
        }
        this.cannon?.setTintFill(0x000000);
    }

    private enableDetectionMode() {
        if (MainScene.isBattleStarted(this.gameMode)) {
            this.gameMode = GameMode.DETECTION;
            this.fourSquare?.setTintFill(0xffffff);
        }
    }

    private disableDetectionMode() {
        if (this.gameMode === GameMode.DETECTION) {
            this.gameMode = GameMode.NONE;
        }
        this.fourSquare?.clearTint();
    }

    private enableDirectionMode() {
        if (MainScene.isBattleStarted(this.gameMode)) {
            this.gameMode = GameMode.DIRECTION;
            this.direction?.setTintFill(0xffffff);
        }
    }

    private disableDirectionMode() {
        if (this.gameMode === GameMode.DIRECTION) {
            this.gameMode = GameMode.NONE;
        }
        this.direction?.clearTint();
    }

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

    private selectCannonPositions() {
        new OKDialog(this, "", "کشتی های خودتو تو خونه ی قرمز بذار", () => {
            this.gameMode = GameMode.ARRANGE;
        });
    }

    private static isBattleStarted(gameMode: GameMode): boolean {
        switch (gameMode) {
            case GameMode.ARRANGE:
                return false;
            case GameMode.DETECTION:
            case GameMode.EXPLODE:
            case GameMode.NONE:
            case GameMode.DIRECTION:
                return true;
        }
    }
}
