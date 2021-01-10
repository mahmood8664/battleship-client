import {StartScene} from "./scenes/StartScene";
// @ts-ignore
import GesturesPlugin from "phaser3-rex-plugins/plugins/gestures-plugin.js";
// @ts-ignore
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import Center = Phaser.Scale.Center;


export let config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        parent: 'phaser-example',
        width: 720,
        height: 1280,
        autoCenter: Center.CENTER_BOTH,
        autoRound: true,
    },
    backgroundColor: '#395d7b',
    scene: StartScene,
    dom: {
        createContainer: true
    },
    parent: "parent",
    plugins: {
        scene: [{
            key: 'rexGestures',
            plugin: GesturesPlugin,
            sceneKey: 'rexGestures',
            mapping: 'rexGestures'
        }, {
            key: 'rexUI',
            plugin: UIPlugin,
            sceneKey: 'rexUI',
            mapping: 'rexUI'
        },
        ]
    }
}

new Phaser.Game(config);

