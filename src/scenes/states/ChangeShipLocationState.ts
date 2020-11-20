import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";
import Sprite = Phaser.GameObjects.Sprite;

export class ChangeShipLocationState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.CHANGE_SHIP_LOCATION

        this.disableEnemyField(scene);
        this.enableGameButtons(scene);
        this.enableOwnField(scene);
        scene.directionBtn.setTintFill(0xFFFFFF);
    }

    ownFieldPointerHover(scene: MainScene, target: Sprite, targetIndexOf: number) {
        if (scene.desktop) {
            scene.ships.get(targetIndexOf)?.setScale(0.4);
        }
    }

    ownFieldPointerOut(scene: MainScene, target: Sprite, targetIndexOf: number) {
        scene.ships.get(targetIndexOf)?.setScale(0.3);
    }

    lastIndex = -1
    lastNeighbors: number[] = [];

    ownFieldPointerUp(scene: MainScene, target: Sprite, targetIndexOf: number): void {
        if (scene.ships.get(targetIndexOf) !== undefined) {
            if (this.lastIndex !== targetIndexOf) {
                scene.ships.get(this.lastIndex)?.clearTint();
                this.lastIndex = targetIndexOf;
                this.lastNeighbors.forEach(v => {
                    (scene.ownField.getChildren()[v] as Sprite).clearTint();
                });
            }
            scene.ships.get(targetIndexOf)?.setTintFill(0xffffff);
            let neighbors = this.neighbors(targetIndexOf, scene);
            neighbors.forEach(v => {
                (scene.ownField.getChildren()[v] as Sprite).setTintFill(0x570d0d);
            })
            this.lastNeighbors = neighbors;
        } else if (this.lastNeighbors.indexOf(targetIndexOf) >= 0) {
            //click to move
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
    }

    public neighbors(indexOf: number, scene: MainScene) {
        let neighbors: number[] = [];
        if (indexOf - 21 >= 0 && indexOf - 21 < 200 && indexOf % 20 != 0 && scene.ships.get(indexOf - 21) === undefined) {
            neighbors.push(indexOf - 21);
        }
        if (indexOf - 20 >= 0 && indexOf - 20 < 200 && scene.ships.get(indexOf - 20) === undefined) {
            neighbors.push(indexOf - 20);
        }
        if (indexOf - 19 >= 0 && indexOf - 19 < 200 && (indexOf + 1) % 20 != 0 && scene.ships.get(indexOf - 19) === undefined) {
            neighbors.push(indexOf - 19);
        }
        if (indexOf - 1 >= 0 && indexOf - 1 < 200 && indexOf % 20 != 0 && scene.ships.get(indexOf - 1) === undefined) {
            neighbors.push(indexOf - 1);
        }
        if (indexOf + 1 >= 0 && indexOf + 1 < 200 && (indexOf + 1) % 20 != 0 && scene.ships.get(indexOf + 1) === undefined) {
            neighbors.push(indexOf + 1);
        }
        if (indexOf + 19 >= 0 && indexOf + 19 < 200 && indexOf % 20 != 0 && indexOf % 20 != 0 && scene.ships.get(indexOf + 19) === undefined) {
            neighbors.push(indexOf + 19);
        }
        if (indexOf + 20 >= 0 && indexOf + 20 < 200 && scene.ships.get(indexOf + 20) === undefined) {
            neighbors.push(indexOf + 20);
        }
        if (indexOf + 21 >= 0 && indexOf + 21 < 200 && (indexOf + 1) % 20 != 0 && scene.ships.get(indexOf + 21) === undefined) {
            neighbors.push(indexOf + 21);
        }
        return neighbors;
    }
}
