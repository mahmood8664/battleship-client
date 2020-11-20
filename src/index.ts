import {MainScene} from "./scenes/MainScene";
import {StartScene} from "./scenes/StartScene";
// @ts-ignore
import GesturesPlugin from "phaser3-rex-plugins/plugins/gestures-plugin.js";
// @ts-ignore
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";


export let config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    // width: window.innerWidth,
    // height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
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

