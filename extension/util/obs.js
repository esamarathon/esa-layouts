"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const obs_websocket_js_1 = __importDefault(require("obs-websocket-js"));
const nodecgApiContext = __importStar(require("./nodecg-api-context"));
// Extending the OBS library with some of our own functions.
class OBSUtility extends obs_websocket_js_1.default {
    constructor() {
        super();
    }
    /**
     * Change to this OBS scene.
     * @param name Name of the scene.
     */
    changeScene(name) {
        return new Promise((resolve, reject) => {
            this.send('SetCurrentScene', { 'scene-name': name }).then(resolve).catch((err) => {
                nodecg.log.warn(`Cannot change OBS scene [${name}]: ${err.error}`);
                reject();
            });
        });
    }
    /**
     * Hide this item in the specified OBS scene.
     * @param item Name of the item.
     * @param scene Name of the scene.
     */
    hideItemInScene(item, scene) {
        return new Promise((resolve, reject) => {
            // @ts-ignore: Typings say we need to specify *everything* when we really don't.
            this.send('SetSceneItemProperties', {
                item,
                visible: false,
                'scene-name': scene,
            }).then(resolve).catch((err) => {
                nodecg.log.warn(`Cannot hide OBS item [${scene}: ${item}]: ${err.error}`);
                reject();
            });
        });
    }
    /**
     * Set up game/camera capture in specified OBS scene; turns on, repositions and resizes.
     * @param item Name of the item.
     * @param scene Name of the scene.
     * @param position Position details (x/y/width/height/cropping).
     */
    setUpCaptureInScene(item, scene, position) {
        return new Promise((resolve, reject) => {
            this.send('SetSceneItemProperties', {
                item,
                visible: true,
                'scene-name': scene,
                position: {
                    x: position.x,
                    y: position.y,
                },
                bounds: {
                    x: position.width,
                    y: position.height,
                },
                crop: {
                    top: position.croptop,
                    right: position.cropright,
                    bottom: position.cropbottom,
                    left: position.cropleft,
                },
                scale: {},
            }).then(resolve).catch((err) => {
                nodecg.log.warn(`Cannot setup OBS item [${scene}: ${item}]: ${err.error}`);
                reject();
            });
        });
    }
}
const nodecg = nodecgApiContext.get();
const obs = new OBSUtility();
const settings = {
    address: nodecg.bundleConfig.obs.address,
    password: nodecg.bundleConfig.obs.password,
};
if (nodecg.bundleConfig.obs.enable) {
    nodecg.log.info('Setting up OBS connection.');
    connect();
    obs.on('ConnectionClosed', () => {
        nodecg.log.warn('OBS connection lost, retrying in 5 seconds.');
        setTimeout(connect, 5000);
    });
    // @ts-ignore: Pretty sure this emits an error.
    obs.on('error', (err) => {
        nodecg.log.warn('OBS connection error.');
        nodecg.log.debug('OBS connection error:', err);
    });
}
function connect() {
    obs.connect(settings).then(() => {
        nodecg.log.info('OBS connection successful.');
    }).catch((err) => {
        nodecg.log.warn('OBS connection error.');
        nodecg.log.debug('OBS connection error:', err);
    });
}
exports.default = obs;
//# sourceMappingURL=obs.js.map