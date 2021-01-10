import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";
import {YesNoDialog} from "../../dialog/YesNoDialog";
import {GameService} from "../../api/service/GameService";
import {Game, GameStatus} from "../../model/Game";
import Sprite = Phaser.GameObjects.Sprite;
import Image = Phaser.GameObjects.Image;

export class InitState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.INIT_ARRANGE

        super.disableGameButtonsInteractive(scene);
        super.enableOwnFieldInteractive(scene);
        super.disableEnemyFieldInteractive(scene);
        scene.textBox.text = "Put your ships on red squares"

        scene.timer.startTimer(30, () => {
            let randomShipIndexed: number[] = [];
            while (randomShipIndexed.length != 10) {
                let random = Math.floor(Math.random() * Math.floor(100));
                if (!scene.ships.get(random)) {
                    randomShipIndexed.push(random);
                    let square = scene.ownField.getChildren()[random] as Image;
                    scene.ships.set(random, scene.add.image(square.x, square.y, "ship").setScale(0.5));
                }
            }
            this.showLoading(scene);
            this.submitShipLocations(randomShipIndexed, scene);
        });
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
                scene.stateManger.changeState(GameState.WAITING);
                this.submitShipLocations(shipIndexes, scene);

            }, () => {

            })
        }
    }

    private submitShipLocations(shipIndexes: number[], scene: MainScene) {
        GameService.submitShipsLocations({
            game_id: localStorage.getItem("game_id")!,
            user_id: localStorage.getItem("user_id")!,
            ships_indexes: shipIndexes
        }).then(response => {
            if (response.ok) {
                switch (response.game_status) {
                    case GameStatus.Joined:
                        scene.textBox.text = "Waiting for other side to select ships locations..."
                        break;
                    case GameStatus.Init:
                        scene.textBox.text = "Error, please contact support"
                        scene.stateManger.changeState(GameState.FINISHED);
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
                        break;
                }
            } else {
                this.handleServerError(scene, response);
            }
        })
    }
}
