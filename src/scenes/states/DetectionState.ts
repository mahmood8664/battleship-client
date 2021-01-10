import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";
import {GameService} from "../../api/service/GameService";
import Sprite = Phaser.GameObjects.Sprite;

export class DetectionState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.DETECTION;

        this.enableEnemyFieldInteractive(scene);
        this.enableGameButtonsInteractive(scene);
        this.disableOwnFieldInteractive(scene);
        scene.fourSquareBtn.setTintFill(0xFFFFFF);
    }

    enemyFieldPointerHover(scene: MainScene, target: Sprite, targetNeighbors: Sprite[]): void {
        if (scene.desktop) {
            targetNeighbors.forEach(sprite => {
                if (sprite.active) {
                    sprite.setTintFill(0x0e4293);
                }
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

    enemyFieldPointerUp(scene: MainScene, target: Sprite, targetNeighbors: Sprite[], indexOf: number): void {

        let oneOf4IsActive = false;
        targetNeighbors.forEach(value => {
            if (value.active) {
                oneOf4IsActive = true;
                return;
            }
        });

        if (oneOf4IsActive) {
            scene.stateManger.changeState(GameState.WAITING);
            GameService.reveal({
                game_id: localStorage.getItem("game_id")!,
                user_id: localStorage.getItem("user_id")!,
                index: indexOf,
            }).then(response => {
                if (response.ok) {
                    targetNeighbors.forEach(sprite => {
                        sprite.setAlpha(0.001);
                        sprite.active = false;
                    });
                    response.revealed_ship_indexes?.forEach(index => {
                        scene.revealed_ships.set(index, scene.add.image((scene.enemyField.getChildren()[index] as Sprite).x,
                            (scene.enemyField.getChildren()[index] as Sprite).y, "ship").setScale(0.5));
                    });
                    scene.stateManger.changeState(GameState.WAITING);
                } else {
                    this.handleServerError(scene, response);
                }
                scene.stateManger.changeState(GameState.WAITING);
            });
        }
    }

}


