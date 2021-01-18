import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";
import {GameService} from "../../api/service/GameService";

export class WaitingState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.WAITING;

        this.disableGameButtonsInteractive(scene);
        this.disableEnemyFieldInteractive(scene);
        this.disableOwnFieldInteractive(scene);

        this.showLoading(scene);
        scene.textBox.text = "Wait for other side move...";
        scene.timer.stopTimer();
        scene.timer.startTimer(Number(+localStorage.getItem("timeout")! + 5), () => {
            GameService.changeTurn({
                user_id: localStorage.getItem("user_id")!,
                game_id: localStorage.getItem("game_id")!,
            }).then(response => {
                if (response.ok) {
                    scene.stateManger.changeState(GameState.PLAY);
                } else {
                    scene.toast.show("Error: " + response.error?.error_message);
                    this.changeState(scene);
                }
            });
        });
    }
}

