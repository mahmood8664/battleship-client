import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";
import {YesNoDialog} from "../../dialog/YesNoDialog";
import Sprite = Phaser.GameObjects.Sprite;


export class ExplosionState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.EXPLOSION;

        this.enableEnemyField(scene);
        this.enableGameButtons(scene);
        this.disableOwnField(scene);
        scene.cannonBtn.setTintFill(0xffffff);
    }

    enemyFieldPointerHover(scene: MainScene, target: Sprite, squares: Sprite[]) {
        if (scene.desktop) {
            target.setTintFill(0x0e4293);
        }
    }

    enemyFieldPointerOut(scene: MainScene, target: Sprite, squares: Sprite[]): void {
        if (scene.desktop) {
            target.clearTint();
        }
    }

    enemyFieldPointerUp(scene: MainScene, target: Sprite, targetNeighbors: Sprite[]): void {
        if (target.active) {
            if (scene.desktop) {
                target.setAlpha(0.01);
                target.setActive(false);

                //todo: do your action here
                scene.playExplosionEmpty(target.x, target.y);
                scene.stateManger.changeState(GameState.PLAY);
            } else {
                target.setTintFill(0x121212);
                new YesNoDialog(scene, "", "                مطمئنی؟", () => {
                    target.setAlpha(0.01);
                    target.setActive(false);

                    //todo: do your action here
                    scene.playExplosionEmpty(target.x, target.y);
                    scene.stateManger.changeState(GameState.PLAY);
                }, () => {
                    target.clearTint();
                });
            }
        }
    }
}

