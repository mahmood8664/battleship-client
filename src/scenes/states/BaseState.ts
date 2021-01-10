import {MainScene} from "../MainScene";
import {BaseResponse} from "../../model/BaseResponse";
import {GameService, ServerErrorCodes} from "../../api/service/GameService";
import {GameState} from "./StateManger";
import Sprite = Phaser.GameObjects.Sprite;

export abstract class BaseState {
    changeState(scene: MainScene): void {
        if (scene.pinchOrDrag) {
            return;
        }
        this.clearEnemyFieldTint(scene);
        this.clearOwnFieldTint(scene);
        this.clearShipsTint(scene);
        this.clearButtonsTint(scene);
        this.clearLoading(scene);
    }

    enemyFieldPointerHover(scene: MainScene, target: Sprite, targetNeighbors: Sprite[]): void {
    }

    enemyFieldPointerOut(scene: MainScene, target: Sprite, targetNeighbors: Sprite[]): void {
    }

    enemyFieldPointerUp(scene: MainScene, target: Sprite, targetNeighbors: Sprite[], indexOf: number): void {
    }

    ownFieldPointerHover(scene: MainScene, target: Sprite, targetIndexOf: number): void {
    }

    ownFieldPointerOut(scene: MainScene, target: Sprite, targetIndexOf: number): void {
    }

    ownFieldPointerUp(scene: MainScene, target: Sprite, targetIndexOf: number): void {
    }

    handleServerError(scene: MainScene, response: BaseResponse) {
        if (!response.error) {
            return
        }
        scene.toast.show("Error: " + response.error?.error_message);
        switch (response.error.error_code) {
            case ServerErrorCodes.GAME_IS_FINISHED.valueOf():
                scene.stateManger.changeState(GameState.FINISHED);
                scene.textBox.text = "Game is finished";
                break;
            case ServerErrorCodes.INVALID_GAME_STATUS.valueOf():
                scene.stateManger.changeState(GameState.FINISHED);
                scene.textBox.text = "something is wrong, please play again";
                break;
            case ServerErrorCodes.INVALID_SHIP_INDEX_VALUE.valueOf():
                scene.stateManger.changeState(GameState.WAITING);
                scene.textBox.text = "invalid ship move";
                GameService.changeTurn({
                    game_id: localStorage.getItem("game_id")!,
                    user_id: localStorage.getItem("user_id")!,
                }).then(response => {
                    if (!response.ok) {
                        scene.toast.show("Error: " + response.error?.error_message);
                        scene.stateManger.changeState(GameState.FINISHED);
                        scene.textBox.text = "something is wrong, please play again";
                    }
                });
                break;
            case ServerErrorCodes.SHIP_INVALID_MOVE.valueOf():
                scene.stateManger.changeState(GameState.WAITING);
                scene.textBox.text = "invalid move";
                GameService.changeTurn({
                    game_id: localStorage.getItem("game_id")!,
                    user_id: localStorage.getItem("user_id")!,
                }).then(response => {
                    if (!response.ok) {
                        scene.toast.show("Error: " + response.error?.error_message);
                        scene.stateManger.changeState(GameState.FINISHED);
                        scene.textBox.text = "something is wrong, please play again";
                    }
                });
                break;
            default:
                break;
        }

    }

    protected disableGameButtonsInteractive(scene: MainScene) {
        scene.fourSquareBtn.disableInteractive();
        scene.cannonBtn.disableInteractive();
        scene.directionBtn.disableInteractive();
    }

    protected enableGameButtonsInteractive(scene: MainScene) {
        scene.fourSquareBtn.setInteractive();
        scene.cannonBtn.setInteractive();
        scene.directionBtn.setInteractive();
    }

    protected disableEnemyFieldInteractive(scene: MainScene) {
        scene.enemyField.getChildren().forEach(value => {
            value.disableInteractive();
        });
    }

    protected enableEnemyFieldInteractive(scene: MainScene) {
        scene.enemyField.getChildren().forEach(value => {
            value.setInteractive();
        });
    }


    protected disableOwnFieldInteractive(scene: MainScene) {
        scene.ownField.getChildren().forEach(value => {
            value.disableInteractive();
        });
    }

    protected enableOwnFieldInteractive(scene: MainScene) {
        scene.ownField.getChildren().forEach(value => {
            value.setInteractive();
        });
    }

    protected clearOwnFieldTint(scene: MainScene) {
        scene.ownField.getChildren().forEach(value => {
            (value as Sprite).clearTint();
        })
    }

    protected clearEnemyFieldTint(scene: MainScene) {
        scene.enemyField.getChildren().forEach(value => {
            (value as Sprite).clearTint();
        })
    }

    protected clearButtonsTint(scene: MainScene) {
        scene.cannonBtn.clearTint();
        scene.directionBtn.clearTint();
        scene.fourSquareBtn.clearTint();
    }

    protected clearShipsTint(scene: MainScene) {
        scene.ships.forEach(value => value.clearTint());
    }

    protected clearLoading(scene: MainScene) {
        scene.loadingRectangle.visible = false
        scene.loadingImage.visible = false
    }

    protected showLoading(scene: MainScene) {
        scene.loadingRectangle.visible = true
        scene.loadingImage.visible = true
    }

}