import GameConfig = Phaser.Types.Core.GameConfig;
import {MainScene} from "./scenes/MainScene";
// @ts-ignore
import GesturesPlugin from "phaser3-rex-plugins/plugins/gestures-plugin.js";
// @ts-ignore
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import ScaleModes = Phaser.Scale.ScaleModes;


let config: GameConfig = {
    type: Phaser.AUTO,
    // width: window.innerWidth,
    // height: window.innerHeight,
    scale: {
        mode: ScaleModes.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    // physics: {
    //     default: 'arcade',
    //     arcade: {
    //         gravity: {y: 500},
    //         debug: false
    //     }
    // },
    backgroundColor: '#395d7b',
    scene: MainScene,
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

