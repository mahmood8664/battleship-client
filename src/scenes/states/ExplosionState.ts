import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";
import {GameService} from "../../api/service/GameService";
import Sprite = Phaser.GameObjects.Sprite;


export class ExplosionState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.EXPLOSION;

        this.enableEnemyFieldInteractive(scene);
        this.enableGameButtonsInteractive(scene);
        this.disableOwnFieldInteractive(scene);
        scene.cannonBtn.setTintFill(0xffffff);
    }

    enemyFieldPointerHover(scene: MainScene, target: Sprite, squares: Sprite[]) {
        if (scene.desktop && target.active) {
            target.setTintFill(0x0e4293);
        }
    }

    enemyFieldPointerOut(scene: MainScene, target: Sprite, squares: Sprite[]): void {
        if (scene.desktop) {
            target.clearTint();
        }
    }

    enemyFieldPointerUp(scene: MainScene, target: Sprite, targetNeighbors: Sprite[], indexOf: number): void {
        if (target.active || scene.revealed_ships.get(indexOf) != undefined) {
            GameService.explode({
                game_id: localStorage.getItem("game_id")!,
                user_id: localStorage.getItem(("user_id"))!,
                index: indexOf,
            }).then(response => {
                if (response.ok) {
                    target.setAlpha(0.001);
                    target.setActive(false);

                    if (response.has_ship) {
                        scene.playExplosion(target.x, target.y);
                        scene.revealed_ships.get(indexOf)?.destroy();
                        scene.revealed_ships.delete(indexOf);
                        //after play animation
                        window.setTimeout(() => {
                            scene.add.image(target.x, target.y, "exploded").setScale(0.2);
                        }, 1500);

                    } else {
                        scene.playExplosionEmpty(target.x, target.y);
                    }
                    scene.stateManger.changeState(GameState.WAITING);
                } else {
                    scene.stateManger.changeState(GameState.PLAY);
                    this.handleServerError(scene, response);
                }
            });
        }
    }

}

