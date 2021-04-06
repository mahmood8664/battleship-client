import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";

export class WaitingNoTimeoutState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.WAITING_NO_TIMEOUT;
        this.disableGameButtonsInteractive(scene);
        this.disableEnemyFieldInteractive(scene);
        this.disableOwnFieldInteractive(scene);
        this.showLoading(scene);
    }
}

