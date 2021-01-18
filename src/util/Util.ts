import {Scene} from "phaser";
import {GameState} from "../model/Game";

export class Util {

    public static getQueryVariable(variable: string): string | undefined {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return undefined;
    }

    public static pinch(scene: Scene) {
        if (!scene.sys.game.device.os.desktop) {
            // @ts-ignore
            let pinch = scene.rexGestures.add.pinch();
            let camera = scene.cameras.main;
            camera.setBounds(0, 0, 720, 1280)
            pinch.on('drag1', (pinch: any) => {
                let drag1Vector = pinch.drag1Vector;
                camera.scrollX -= drag1Vector.x / camera.zoom;
                camera.scrollY -= drag1Vector.y / camera.zoom;
            }).on('pinch', (pinch: any) => {
                let scaleFactor = pinch.scaleFactor;
                if (camera.zoom * scaleFactor > 1 && camera.zoom * scaleFactor < 2.4) {
                    camera.zoom *= scaleFactor;
                }
            }, this);
        }
    }

    public static copyToClipboard(text: string) {
        let input = document.body.appendChild(document.createElement("input"));
        input.value = text;
        input.focus();
        input.select();
        document.execCommand('copy');
        input.parentNode?.removeChild(input);
    }


    private static listener = function (e: BeforeUnloadEvent) {
        // Cancel the event
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = "ok";
        delete e['returnValue'];
        return "ok";
    };

    public static promptRefreshBrowser() {
        window.addEventListener('beforeunload', this.listener);
    }

    public static cancelPromptRefreshBrowser() {
        window.removeEventListener('beforeunload', this.listener);
    }

    public static finishAfter(millis: number) {
        this.cancelPromptRefreshBrowser();
        window.setTimeout(() => {
            window.location.href = window.location.origin;
        }, millis);
    }


    public static fillMaps(gameState: GameState): GameState {
        try {
            let enemy = new Map<number, boolean>();
            for (let value in gameState.enemy_ground as Object) {
                // @ts-ignore
                enemy.set(Number(value), (gameState.enemy_ground as Object) [value])
            }

            let enemyShip = new Map<number, boolean>();
            for (let value in gameState.enemy_revealed_ships as Object) {
                // @ts-ignore
                enemyShip.set(Number(value), (gameState.enemy_revealed_ships as Object) [value])
            }

            let own = new Map<number, boolean>();
            for (let value in gameState.own_ground as Object) {
                // @ts-ignore
                own.set(Number(value), (gameState.own_ground as Object) [value])
            }

            let ownShip = new Map<number, boolean>();
            for (let value in gameState.own_ships as Object) {
                // @ts-ignore
                ownShip.set(Number(value), (gameState.own_ships as Object) [value])
            }

            gameState.enemy_ground = enemy;
            gameState.enemy_revealed_ships = enemyShip;
            gameState.own_ground = own;
            gameState.own_ships = ownShip;
        } catch (e) {
            console.log(e);
        }
        return gameState;
    }

}
