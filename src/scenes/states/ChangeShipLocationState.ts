import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";
import {GameService} from "../../api/service/GameService";
import Sprite = Phaser.GameObjects.Sprite;

export class ChangeShipLocationState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.CHANGE_SHIP_LOCATION

        this.disableEnemyFieldInteractive(scene);
        this.enableGameButtonsInteractive(scene);
        this.enableOwnFieldInteractive(scene);
        scene.directionBtn.setTintFill(0xFFFFFF);
    }

    ownFieldPointerHover(scene: MainScene, target: Sprite, targetIndexOf: number) {
        if (scene.desktop) {
            scene.ships.get(targetIndexOf)?.setScale(0.55);
        }
    }

    ownFieldPointerOut(scene: MainScene, target: Sprite, targetIndexOf: number) {
        scene.ships.get(targetIndexOf)?.setScale(0.5);
    }

    lastIndex = -1
    lastNeighbors: number[] = [];

    ownFieldPointerUp(scene: MainScene, target: Sprite, targetIndexOf: number): void {
        if (scene.ships.get(targetIndexOf) !== undefined && scene.ships.get(targetIndexOf)?.active) {
            //set tint slots around ship
            //*************
            //clear tint of previous ship and neighbors
            if (this.lastIndex !== targetIndexOf) {
                scene.ships.get(this.lastIndex)?.clearTint();
                this.lastIndex = targetIndexOf;
                this.lastNeighbors.forEach(v => {
                    (scene.ownField.getChildren()[v] as Sprite).clearTint();
                });
            }
            //set tint of new ship and it's neighbors
            scene.ships.get(targetIndexOf)?.setTintFill(0xffffff);
            let neighbors = this.neighbors(targetIndexOf, scene);
            neighbors.forEach(v => {
                if ((scene.ownField.getChildren()[v] as Sprite).active) {
                    (scene.ownField.getChildren()[v] as Sprite).setTintFill(0x570d0d);
                }
            })
            this.lastNeighbors = neighbors;
        } else if (this.lastNeighbors.indexOf(targetIndexOf) >= 0 && target.active) {
            //move ship to new location
            scene.stateManger.changeState(GameState.WAITING);
            GameService.moveShip({
                game_id: localStorage.getItem("game_id")!,
                user_id: localStorage.getItem("user_id")!,
                old_ship_index: this.lastIndex,
                new_ship_index: targetIndexOf,
            }).then(response => {
                if (!response.ok) {
                    this.handleServerError(scene, response);
                } else {
                    //click to move ship
                    scene.ships.get(this.lastIndex)?.clearTint();
                    scene.ships.get(this.lastIndex)?.setX((scene.ownField.getChildren()[targetIndexOf] as Sprite).x);
                    scene.ships.get(this.lastIndex)?.setY((scene.ownField.getChildren()[targetIndexOf] as Sprite).y);
                    let ship = scene.ships.get(this.lastIndex);
                    if (ship) {
                        scene.ships.set(targetIndexOf, ship);
                        scene.ships.delete(this.lastIndex);
                    }
                    this.lastNeighbors.forEach(v => {
                        (scene.ownField.getChildren()[v] as Sprite).clearTint();
                    });
                }
            });

        }
    }

    public neighbors(indexOf: number, scene: MainScene) {
        let neighbors: number[] = [];
        if (indexOf - 11 >= 0 && indexOf % 10 != 0 && scene.ships.get(indexOf - 11) === undefined) {
            neighbors.push(indexOf - 11);
        }
        if (indexOf - 10 >= 0 && scene.ships.get(indexOf - 10) === undefined) {
            neighbors.push(indexOf - 10);
        }
        if (indexOf - 9 >= 0 && (indexOf + 1) % 10 != 0 && scene.ships.get(indexOf - 9) === undefined) {
            neighbors.push(indexOf - 9);
        }
        if (indexOf - 1 >= 0 && indexOf % 10 != 0 && scene.ships.get(indexOf - 1) === undefined) {
            neighbors.push(indexOf - 1);
        }
        if (indexOf + 1 >= 0 && indexOf + 1 < 100 && (indexOf + 1) % 10 != 0 && scene.ships.get(indexOf + 1) === undefined) {
            neighbors.push(indexOf + 1);
        }
        if (indexOf + 9 >= 0 && indexOf + 9 < 100 && indexOf % 10 != 0 && indexOf % 10 != 0 && scene.ships.get(indexOf + 9) === undefined) {
            neighbors.push(indexOf + 9);
        }
        if (indexOf + 10 >= 0 && indexOf + 10 < 100 && scene.ships.get(indexOf + 10) === undefined) {
            neighbors.push(indexOf + 10);
        }
        if (indexOf + 11 >= 0 && indexOf + 11 < 100 && (indexOf + 1) % 10 != 0 && scene.ships.get(indexOf + 11) === undefined) {
            neighbors.push(indexOf + 11);
        }
        return neighbors;
    }
}
