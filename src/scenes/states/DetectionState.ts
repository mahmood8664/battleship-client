import {MainScene} from "../MainScene";
import {YesNoDialog} from "../../dialog/YesNoDialog";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";
import Sprite = Phaser.GameObjects.Sprite;

export class DetectionState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.DETECTION;

        this.enableEnemyField(scene);
        this.enableGameButtons(scene);
        this.disableOwnField(scene);
        scene.fourSquareBtn.setTintFill(0xFFFFFF);
    }

    enemyFieldPointerHover(scene: MainScene, target: Sprite, targetNeighbors: Sprite[]): void {
        if (scene.desktop) {
            targetNeighbors.forEach(sprite => {
                sprite.setTintFill(0x0e4293)
            });
        }
    }

    enemyFieldPointerOut(scene: MainScene, target: Sprite, targetNeighbors: Sprite[]): void {
        if (scene.desktop) {
            targetNeighbors.forEach(sprite => {
                if (sprite) {
                    sprite.clearTint();
                }
            });
        }
    }

    enemyFieldPointerUp(scene: MainScene, target: Sprite, targetNeighbors: Sprite[]): void {

        let oneOf4IsActive = false;
        targetNeighbors.forEach(value => {
            if (value.active) {
                oneOf4IsActive = true;
                return;
            }
        });

        if (oneOf4IsActive) {
            if (scene.desktop) {
                //todo: do action here
                targetNeighbors.forEach(sprite => {
                    sprite.setAlpha(0.01);
                    sprite.active = false;
                });
                scene.stateManger.changeState(GameState.PLAY);

            } else {
                //Mobile
                targetNeighbors.forEach(sprite => {
                    sprite.setTintFill(0x121212);
                });

                new YesNoDialog(scene, "", "Are you sure?                  ", () => {
                    targetNeighbors.forEach(sprite => {
                        sprite.setAlpha(0.01);
                        sprite.active = false;

                        //todo: do your action here
                    });
                    scene.stateManger.changeState(GameState.PLAY);
                }, () => {
                    targetNeighbors.forEach(sprite => {
                        sprite.clearTint();
                    });

                });
            }
        }
    }
}


