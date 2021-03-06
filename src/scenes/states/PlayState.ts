import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";


export class PlayState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.PLAY;

        this.enableGameButtonsInteractive(scene);
        this.disableOwnFieldInteractive(scene);
        this.disableEnemyFieldInteractive(scene);

        scene.timer.startTimerAndChangeTurn(Number(localStorage.getItem("timeout")!));
        scene.textBox.text = "Let's play..."
    }
}

