import {MainScene} from "../MainScene";
import Sprite = Phaser.GameObjects.Sprite;

export abstract class BaseState {
    changeState(scene: MainScene): void {
        if (scene.pinchOrDrag) {
            return;
        }
        this.clearEnemyField(scene);
        this.clearOwnField(scene);
        this.clearShips(scene);
        this.clearButtons(scene);
        this.clearLoading(scene);
    }

    enemyFieldPointerHover(scene: MainScene, target: Sprite, targetNeighbors: Sprite[]): void {
    }

    enemyFieldPointerOut(scene: MainScene, target: Sprite, targetNeighbors: Sprite[]): void {
    }

    enemyFieldPointerUp(scene: MainScene, target: Sprite, targetNeighbors: Sprite[]): void {
    }

    ownFieldPointerHover(scene: MainScene, target: Sprite, targetIndexOf: number): void {
    }

    ownFieldPointerOut(scene: MainScene, target: Sprite, targetIndexOf: number): void {
    }

    ownFieldPointerUp(scene: MainScene, target: Sprite, targetIndexOf: number): void {
    }

    protected disableGameButtons(scene: MainScene) {
        scene.fourSquareBtn.removeInteractive();
        scene.cannonBtn.removeInteractive();
        scene.directionBtn.removeInteractive();
    }

    protected enableGameButtons(scene: MainScene) {
        scene.fourSquareBtn.setInteractive();
        scene.cannonBtn.setInteractive();
        scene.directionBtn.setInteractive();
    }

    protected disableEnemyField(scene: MainScene) {
        scene.enemyField.getChildren().forEach(value => {
            value.disableInteractive();
        });
    }

    protected enableEnemyField(scene: MainScene) {
        scene.enemyField.getChildren().forEach(value => {
            value.setInteractive();
        });
    }


    protected disableOwnField(scene: MainScene) {
        scene.ownField.getChildren().forEach(value => {
            value.disableInteractive();
        });
    }

    protected enableOwnField(scene: MainScene) {
        scene.ownField.getChildren().forEach(value => {
            value.setInteractive();
        });
    }

    protected clearOwnField(scene: MainScene) {
        scene.ownField.getChildren().forEach(value => {
            (value as Sprite).clearTint();
        })
    }

    protected clearEnemyField(scene: MainScene) {
        scene.enemyField.getChildren().forEach(value => {
            (value as Sprite).clearTint();
        })
    }

    protected clearButtons(scene: MainScene) {
        scene.cannonBtn.clearTint();
        scene.directionBtn.clearTint();
        scene.fourSquareBtn.clearTint();
    }

    protected clearShips(scene: MainScene) {
        scene.ships.forEach(value => value.clearTint());
    }

    protected clearLoading(scene: MainScene) {
        scene.loadingRectangle.visible = false
        scene.loadingImage.visible = false
    }

}