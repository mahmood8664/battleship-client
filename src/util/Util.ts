import {Scene} from "phaser";

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



    private static listener = function (e:BeforeUnloadEvent) {
        // Cancel the event
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = "ok";
        delete e['returnValue'];
        return "ok";
    };

    public static PromptRefreshBrowser() {
        window.addEventListener('beforeunload', this.listener);
    }

    public static CancelPromptRefreshBrowser() {
        window.removeEventListener('beforeunload', this.listener);
    }

}
