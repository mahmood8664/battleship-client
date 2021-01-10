import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";
import {Util} from "../../util/Util";


export class FinishState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.FINISHED;
        Util.CancelPromptRefreshBrowser();
        this.disableOwnFieldInteractive(scene);
        this.disableGameButtonsInteractive(scene);
        this.disableEnemyFieldInteractive(scene);
        scene.timer.finishTimer();
    }
}

