import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";
import {YesNoDialog} from "../../dialog/YesNoDialog";
import {GameService} from "../../api/service/GameService";
import {SubmitShipsLocationsRequest} from "../../model/SubmitShipsLocaitons";
import {Game, GameStatus} from "../../model/Game";
import Sprite = Phaser.GameObjects.Sprite;

export class InitState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.INIT_ARRANGE

        super.disableGameButtons(scene);
        super.enableOwnField(scene);
        super.disableEnemyField(scene);
        scene.textBox.text="Put your ships on red squares"
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
            scene.ships.set(targetIndexOf, scene.add.image(target.x, target.y, "ship").setScale(0.3));
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
                scene.stateManger.changeState(GameState.WAITING);
                GameService.submitShipsLocations(new SubmitShipsLocationsRequest(
                    localStorage.getItem("game_id")!,
                    localStorage.getItem("user_id")!,
                    shipIndexes
                )).then(response => {
                    if (response.ok) {
                        scene.textBox.text = "ha ha"

                        switch (response.game_status) {
                            case GameStatus.Init:
                                scene.textBox.text = "Waiting for other side to select ships locations..."
                                break;
                            case GameStatus.Start:
                                let game: Game = JSON.parse(localStorage.getItem("game")!);
                                if (localStorage.getItem("user_id") == game.side_1_user) {
                                    if (game.turn == 1) {
                                        scene.stateManger.changeState(GameState.PLAY);
                                        scene.textBox.text = "It's your turn";
                                    } else {
                                        scene.textBox.text = "Waiting for other side move";
                                    }
                                } else if (localStorage.getItem("user_id") == game.side_2_user) {
                                    if (game.turn == 2) {
                                        scene.stateManger.changeState(GameState.PLAY);
                                        scene.textBox.text = "It's your turn";
                                    } else {
                                        scene.textBox.text = "Waiting for other side move";
                                    }
                                } else {
                                    alert("user does not belong to this game!!!")
                                }
                                break;
                            case GameStatus.Finished:
                                break;
                        }
                    } else {
                        alert("error code:" + response.error?.error_code + " , error message: " + response.error?.error_message)
                    }

                })

            }, () => {

            })
        }
    }
}
