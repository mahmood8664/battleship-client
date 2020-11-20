import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";
import {YesNoDialog} from "../../dialog/YesNoDialog";
import Sprite = Phaser.GameObjects.Sprite;

export class InitState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.INIT_ARRANGE

        super.disableGameButtons(scene);
        super.enableOwnField(scene);
        super.disableEnemyField(scene);
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
        if (scene.ships.size >= scene.numberOfShips) {
            new YesNoDialog(scene, "", "                  مطمئنی؟", () => {
                //todo: call server
                scene.stateManger.changeState(GameState.PLAY);
            }, () => {

            })
        }
    }
}
