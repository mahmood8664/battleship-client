import {MainScene} from "../MainScene";
import {BaseState} from "./BaseState";
import {GameState} from "./StateManger";


export class PlayState extends BaseState {
    changeState(scene: MainScene): void {
        super.changeState(scene);
        scene.gameState = GameState.PLAY;

        this.enableGameButtons(scene);
        this.disableOwnField(scene);
        this.disableEnemyField(scene);
    }
}

