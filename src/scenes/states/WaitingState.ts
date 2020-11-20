import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";

export class WaitingState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.WAITING;

        this.disableGameButtons(scene);
        this.disableEnemyField(scene);
        this.disableOwnField(scene);

        scene.loadingImage.setVisible(true);
        scene.loadingRectangle.setVisible(true);

    }
}

