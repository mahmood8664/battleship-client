import {MainScene} from "../MainScene";
import {BaseResponse} from "../../model/BaseResponse";
import {GameService, ServerErrorCodes} from "../../api/service/GameService";
import {GameState} from "./StateManger";
import {GameStatus} from "../../model/Game";
import {Util} from "../../util/Util";
import Sprite = Phaser.GameObjects.Sprite;

export abstract class BaseState {
    changeState(scene: MainScene): void {
        if (scene.pinchOrDrag) {
            return;
        }
        this.clearEnemyFieldTint(scene);
        this.clearOwnFieldTint(scene);
        this.clearShipsTint(scene);
        this.clearButtonsTint(scene);
        this.clearLoading(scene);
    }

    enemyFieldPointerHover(scene: MainScene, target: Sprite, targetNeighbors: Sprite[]): void {
    }

    enemyFieldPointerOut(scene: MainScene, target: Sprite, targetNeighbors: Sprite[]): void {
    }

    enemyFieldPointerUp(scene: MainScene, target: Sprite, targetNeighbors: Sprite[], indexOf: number): void {
    }

    ownFieldPointerHover(scene: MainScene, target: Sprite, targetIndexOf: number): void {
    }

    ownFieldPointerOut(scene: MainScene, target: Sprite, targetIndexOf: number): void {
    }

    ownFieldPointerUp(scene: MainScene, target: Sprite, targetIndexOf: number): void {
    }

    handleServerError(scene: MainScene, response: BaseResponse) {
        if (!response.error) {
            return
        }
        switch (response.error.error_code) {
            case ServerErrorCodes.GAME_IS_FINISHED.valueOf():
                scene.stateManger.changeState(GameState.FINISHED);
                scene.textBox.text = "Game is finished, restarting game...";
                Util.finishAfter(4000);
                break;
            case ServerErrorCodes.INVALID_GAME_STATUS.valueOf():
                scene.stateManger.changeState(GameState.FINISHED);
                scene.textBox.text = "Invalid game status, restarting game...";
                Util.finishAfter(4000);
                break;
            case ServerErrorCodes.INVALID_SHIP_INDEX_VALUE.valueOf():
                scene.stateManger.changeState(GameState.WAITING);
                scene.textBox.text = "invalid ship move, restarting game...";
                Util.finishAfter(4000);
                break;
            case ServerErrorCodes.SHIP_INVALID_MOVE.valueOf():
                scene.stateManger.changeState(GameState.WAITING);
                scene.textBox.text = "invalid move, restarting game...";
                Util.finishAfter(4000);
                break;
            default:
                scene.textBox.text = "Error: " + response.error.error_message;
                break;
        }

    }

    protected disableGameButtonsInteractive(scene: MainScene) {
        scene.fourSquareBtn.disableInteractive();
        scene.cannonBtn.disableInteractive();
        scene.directionBtn.disableInteractive();
    }

    protected enableGameButtonsInteractive(scene: MainScene) {
        scene.fourSquareBtn.setInteractive();
        scene.cannonBtn.setInteractive();
        scene.directionBtn.setInteractive();
    }

    protected disableEnemyFieldInteractive(scene: MainScene) {
        scene.enemyField.getChildren().forEach(value => {
            value.disableInteractive();
        });
    }

    protected enableEnemyFieldInteractive(scene: MainScene) {
        scene.enemyField.getChildren().forEach(value => {
            value.setInteractive();
        });
    }


    protected disableOwnFieldInteractive(scene: MainScene) {
        scene.ownField.getChildren().forEach(value => {
            value.disableInteractive();
        });
    }

    protected enableOwnFieldInteractive(scene: MainScene) {
        scene.ownField.getChildren().forEach(value => {
            value.setInteractive();
        });
    }

    protected clearOwnFieldTint(scene: MainScene) {
        scene.ownField.getChildren().forEach(value => {
            (value as Sprite).clearTint();
        })
    }

    protected clearEnemyFieldTint(scene: MainScene) {
        scene.enemyField.getChildren().forEach(value => {
            (value as Sprite).clearTint();
        })
    }

    protected clearButtonsTint(scene: MainScene) {
        scene.cannonBtn.clearTint();
        scene.directionBtn.clearTint();
        scene.fourSquareBtn.clearTint();
    }

    protected clearShipsTint(scene: MainScene) {
        scene.ships.forEach(value => value.clearTint());
    }

    protected clearLoading(scene: MainScene) {
        scene.loadingRectangle.visible = false
        scene.loadingImage.visible = false
    }

    protected showLoading(scene: MainScene) {
        scene.loadingRectangle.visible = true
        scene.loadingImage.visible = true
    }

    public hideShip(scene: MainScene, index: number) {
        scene.revealed_ships.get(index)?.destroy();
        scene.revealed_ships.delete(index);
    }

    public socketConnectIcon(scene: MainScene, connect: boolean) {
        scene.connect.visible = connect;
        scene.disconnect.visible = !connect;
    }

    public reveal(scene: MainScene, slots: number[]) {
        slots.forEach(value => {
            (scene.ownField.getChildren()[value] as Sprite).setAlpha(0.001);
            (scene.ownField.getChildren()[value] as Sprite).setActive(false);
        });
    }

    public explosion(scene: MainScene, index: number): boolean {
        (scene.ownField.getChildren()[index] as Sprite)?.setAlpha(0.001);
        (scene.ownField.getChildren()[index] as Sprite)?.setActive(false);
        if (scene.ships.get(index) !== undefined) {
            scene.ships.get(index)?.setVisible(false);
            scene.ships.get(index)?.destroy();
            scene.ships.delete(index);
            scene.playExplosion((scene.ownField.getChildren()[index] as Sprite)?.x,
                (scene.ownField.getChildren()[index] as Sprite)?.y);
            //after play animation
            window.setTimeout(() => {
                scene.own_exploded.set(index, scene.add.image((scene.ownField.getChildren()[index] as Sprite)?.x,
                    (scene.ownField.getChildren()[index] as Sprite)?.y, "exploded").setScale(0.2));
            }, 1500);
            return true;
        } else {
            scene.playExplosionEmpty((scene.ownField.getChildren()[index] as Sprite)?.x,
                (scene.ownField.getChildren()[index] as Sprite)?.y);
            return false;
        }
    }

    public finish(scene: MainScene, winnerUserId: string) {
        if (winnerUserId === localStorage.getItem("user_id")) {
            scene.textBox.text = "You Win!";
        } else {
            scene.textBox.text = "You lose!";
        }
    }

    public reconnect(scene: MainScene) {
        GameService.getGame().then(response => {
            if (response.ok) {
                if (response.game?.status == GameStatus.Start) {
                    if (!response.game.your_turn && !(scene.gameState == GameState.WAITING || scene.gameState == GameState.WAITING_NO_TIMEOUT)) {
                        scene.stateManger.changeState(GameState.WAITING);
                    } else if (response.game.your_turn) {
                        scene.stateManger.changeState(GameState.PLAY);
                    }

                    response.game.state.own_ground.forEach((value, key) => {
                        if (value) {
                            (scene.ownField.getChildren()[key] as Sprite).setAlpha(1);
                            (scene.ownField.getChildren()[key] as Sprite).setActive(true);
                        } else {
                            (scene.ownField.getChildren()[key] as Sprite).setAlpha(0.001);
                            (scene.ownField.getChildren()[key] as Sprite).setActive(false);
                        }
                    });

                    response.game.state.enemy_ground.forEach((value, key) => {
                        if (value) {
                            (scene.enemyField.getChildren()[key] as Sprite).setAlpha(1);
                            (scene.enemyField.getChildren()[key] as Sprite).setActive(true);
                        } else {
                            (scene.enemyField.getChildren()[key] as Sprite).setAlpha(0.001);
                            (scene.enemyField.getChildren()[key] as Sprite).setActive(false);
                        }
                    });

                    response.game.state.own_ships.forEach((value, key) => {
                        if (value) {
                            if (!scene.ships.get(key)) {
                                scene.ships.set(key, scene.add.image((scene.ownField.getChildren()[key] as Sprite).x,
                                    (scene.ownField.getChildren()[key] as Sprite).y, "ship").setScale(0.5));
                            }
                        } else {
                            if (scene.ships.get(key)) {
                                scene.ships.get(key)?.destroy();
                                scene.ships.delete(key);
                            }
                            if (!scene.own_exploded.get(key)) {
                                scene.own_exploded.set(key, scene.add.image((scene.ownField.getChildren()[key] as Sprite).x,
                                    (scene.ownField.getChildren()[key] as Sprite).y, "exploded").setScale(0.2))
                            }
                        }
                    });

                    response.game.state.enemy_revealed_ships?.forEach((value, key) => {
                        if (value) {
                            if (!scene.revealed_ships.get(key)) {
                                scene.revealed_ships.set(key, scene.add.image((scene.enemyField.getChildren()[key] as Sprite).x,
                                    (scene.enemyField.getChildren()[key] as Sprite).y, "ship").setScale(0.5));
                            }
                        } else {
                            if (!scene.enemy_exploded.get(key)) {
                                scene.enemy_exploded.set(key, scene.add.image((scene.enemyField.getChildren()[key] as Sprite).x,
                                    (scene.enemyField.getChildren()[key] as Sprite).y, "exploded").setScale(0.2));
                            }
                        }
                    });
                }
            }
        });
    }
}