import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";
import {GameService} from "../../api/service/GameService";
import {Game} from "../../model/Game";

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

    private CheckGameState(scene: MainScene) {
        let interval = setInterval(() => {
            if (scene.gameState == GameState.WAITING) {
                GameService.getGame().then(response => {
                    if (response.ok) {
                        localStorage.setItem("game", JSON.stringify(response.game));
                        this.updateGame(response.game!);
                    }


                })
            } else {
                clearInterval(interval);
            }
        }, 5000);
    }

    private updateGame(game: Game) {

    }

}

