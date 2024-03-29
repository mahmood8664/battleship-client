import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";
import {YesNoDialog} from "../../dialog/YesNoDialog";
import {GameService} from "../../api/service/GameService";
import {Game, GameStatus} from "../../model/Game";
import {Util} from "../../util/Util";
import Sprite = Phaser.GameObjects.Sprite;
import Image = Phaser.GameObjects.Image;

export class InitState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.INIT_ARRANGE

        super.disableGameButtonsInteractive(scene);
        super.enableOwnFieldInteractive(scene);
        super.disableEnemyFieldInteractive(scene);
        if (!scene.timer.active) {
            scene.textBox.text = "Put your ships on red squares"
            scene.timer.startTimer(60, () => {
                let randomShipIndexed: number[] = [];
                scene.ships.forEach(img => img.destroy());
                scene.ships.clear();
                while (randomShipIndexed.length != 10) {
                    let random = Math.floor(Math.random() * 100);
                    if (!scene.ships.get(random)) {
                        randomShipIndexed.push(random);
                        let square = scene.ownField.getChildren()[random] as Image;
                        scene.ships.set(random, scene.add.image(square.x, square.y, "ship").setScale(0.5));
                    }
                }
                this.showLoading(scene);
                this.submitShipLocations(randomShipIndexed, scene, true);
            });
        }
    }

    ownFieldPointerHover(scene: MainScene, target: Sprite, targetIndexOf: number) {
        if (scene.desktop && scene.ships.size < scene.numberOfShips && scene.ships.get(targetIndexOf) === undefined) {
            target.setTintFill(0x570d0d);
        }
    }

    ownFieldPointerOut(scene: MainScene, target: Sprite, targetIndexOf: number) {
        target.clearTint();
    }

    ownFieldPointerUp(scene: MainScene, target: Sprite, targetIndexOf: number) {
        if (scene.ships.get(targetIndexOf) == undefined && scene.ships.size < scene.numberOfShips) {
            scene.ships.set(targetIndexOf, scene.add.image(target.x, target.y, "ship").setScale(0.5));
        } else {
            scene.ships.get(targetIndexOf)?.destroy();
            scene.ships.delete(targetIndexOf);
        }
        if (scene.ships.size == scene.numberOfShips) {
            new YesNoDialog(scene, "", "Are you sure?                  ", () => {
                let shipIndexes: number[] = []
                for (let key of scene.ships.keys()) {
                    shipIndexes.push(key)
                }
                scene.stateManger.changeState(GameState.WAITING_NO_TIMEOUT);
                this.submitShipLocations(shipIndexes, scene, false);
            }, () => {
            });
        }
    }

    private submitShipLocations(shipIndexes: number[], scene: MainScene, autoSelect: boolean) {
        GameService.submitShipsLocations({
            game_id: localStorage.getItem("game_id")!,
            user_id: localStorage.getItem("user_id")!,
            ships_indexes: shipIndexes
        }).then(response => {
            if (response.ok) {
                switch (response.game_status) {
                    case GameStatus.Joined:
                        scene.textBox.text = "Waiting for other side to select ships locations...";
                        scene.timer.startTimer(30, () => {
                            GameService.getGame().then(getGameResponse => {
                                if (getGameResponse.ok) {
                                    if (getGameResponse.game?.status == GameStatus.Start) {
                                        if (getGameResponse.game.your_turn) {
                                            scene.stateManger.changeState(GameState.PLAY);
                                        } else {
                                            scene.stateManger.changeState(GameState.WAITING);
                                        }
                                    } else {
                                        scene.textBox.text = "No action from the other side, restarting game...";
                                        Util.finishAfter(4000);
                                    }
                                } else {
                                    scene.textBox.text = "No action from the other side, restarting game...";
                                    Util.finishAfter(4000);
                                }
                            });
                        });
                        break;
                    case GameStatus.Init:
                        scene.textBox.text = "Error, game state is not valid"
                        scene.stateManger.changeState(GameState.FINISHED);
                        Util.finishAfter(4000);
                        break;
                    case GameStatus.Start:
                        let game: Game = JSON.parse(localStorage.getItem("game")!);
                        if (game.your_turn) {
                            scene.stateManger.changeState(GameState.PLAY);
                        } else {
                            scene.stateManger.changeState(GameState.WAITING);
                        }
                        break;
                    case GameStatus.Finished:
                        scene.toast.show("Game is already finished");
                        scene.stateManger.changeState(GameState.FINISHED);
                        Util.finishAfter(4000);
                        break;
                }
            } else {
                this.handleServerError(scene, response);
                scene.stateManger.changeState(GameState.INIT_ARRANGE);
                if (autoSelect) {
                    scene.textBox.text = "Unknown error, try again...";
                    scene.toast.show("Unknown error, try again...");
                }
            }
        })
    }
}
