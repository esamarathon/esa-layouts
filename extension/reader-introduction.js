"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const promises_1 = require("fs/promises");
const lodash_1 = require("lodash");
const needle_1 = __importDefault(require("needle"));
const path_1 = require("path");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const offsite_1 = __importDefault(require("./util/offsite"));
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const streamdeck_1 = __importDefault(require("./util/streamdeck"));
const config = (0, nodecg_1.get)().bundleConfig;
let assetsTemp = [];
const sdButtonUUIDMap = {
    advanceSlide: 'com.esamarathon.streamdeck.readerintroduction-advanceslide',
    resetSlides: 'com.esamarathon.streamdeck.readerintroduction-resetslides',
};
/**
 * Returns images sorted by name ascending.
 * Name should start with a number to get these in the correct order!
 */
function assetsSorted() {
    return (0, lodash_1.orderBy)((0, clone_1.default)(replicants_1.assetsReaderIntroductionImages.value), 'name', 'asc');
}
/**
 * Actually does the Twitch API query for finding boxart URLs.
 * @param endpoint Endpoint for Twitch API.
 * @returns Game/category object.
 */
// TODO: Needs some error logging?
async function boxartRequest(endpoint) {
    try {
        const resp = await speedcontrol_1.sc.sendMessage('twitchAPIRequest', {
            method: 'get',
            endpoint,
            newAPI: true,
        });
        if (resp.body.data[0])
            return resp.body.data[0];
    }
    catch (err) {
        (0, nodecg_1.get)().log.debug('[Reader Introduction] Error requested boxart from Twitch API:', err);
    }
    return undefined;
}
/**
 * Looks up and saves the boxart based on a run ID.
 * @param id ID of the run in the "runDataArray".
 */
// TODO: Sometimes the first result of `/search/categories` is bad.
async function downloadBoxart(id) {
    try {
        const run = speedcontrol_1.sc.getRunDataArray().find((r) => r.id === id);
        if (run) {
            // First, check the exact Twitch game if we have it on file.
            let resp = run.gameTwitch
                ? await boxartRequest(`/games?name=${encodeURIComponent(run.gameTwitch)}`)
                : undefined;
            // If the above fails, do a general search for the normal name.
            if (!resp) {
                resp = run.game
                    ? await boxartRequest(`/search/categories?query=${encodeURIComponent(run.game)}`)
                    : undefined;
            }
            if (resp) {
                // Replace the template resolution with our own. Sometimes the "template" is actually 52x72.
                const url = resp.box_art_url
                    .replace('{width}x{height}', '1080x1440').replace('52x72', '1080x1440');
                // Download and save the actual file.
                const data = await (0, needle_1.default)('get', url);
                await (0, promises_1.writeFile)((0, path_1.join)(__dirname, `../boxart/${id}.jpg`), data.body, 'binary');
            }
            else if (!resp) {
                (0, nodecg_1.get)().log.debug('[Reader Introduction] Could not find this game on the Twitch API');
            }
        }
    }
    catch (err) {
        // Could not fully get boxart for some reason.
        (0, nodecg_1.get)().log.debug('[Reader Introduction] Could not fully download boxart:', err);
    }
}
/**
 * Generate the text needed to be displayed on the "Advance Slide" button.
 * @param linebreaks If you wish to include linebreaks in the text for Stream Deck purposes.
 * @param i The index you wish to force this to display, 0-based.
 * @returns String with title to use.
 */
function generateAdvanceSlideTitle(linebreaks, i) {
    let index = typeof i === 'number'
        ? i
        : assetsTemp.findIndex((a) => a.sum === replicants_1.readerIntroduction.value.current);
    if (replicants_1.readerIntroduction.value.current === 'RunInfo') {
        index = assetsTemp.length;
    }
    const prependText = (() => {
        if (!obs_1.default.isCurrentScene(config.obs.names.scenes.readerIntroduction)) {
            return '⚠\nCannot\nAdvance\nSlide';
        }
        if (index < assetsTemp.length)
            return 'Advance\nSlide';
        return 'Slides\nComplete!';
    })();
    let text = `${prependText}\n(${index >= 0 ? (index + 1) : '?'}/${assetsTemp.length + 1})`;
    if (!linebreaks)
        text = text.replace(/\n/g, ' ');
    return text;
}
/**
 * Correctly changes the title text on the Stream Deck "Advance Slide" buttons.
 * @param i The index you wish to force this to display, 0-based.
 */
function changeAdvanceSlideSDTitle(i) {
    const text = generateAdvanceSlideTitle(true, i);
    streamdeck_1.default.setTextOnAllButtonsWithAction(sdButtonUUIDMap.advanceSlide, text);
}
/**
 * Correctly changes the title text on the offsite "Advance Slide" buttons.
 * @param i The index you wish to force this to display, 0-based.
 */
function changeAdvanceSlideOffsiteTitle(i) {
    const title = generateAdvanceSlideTitle(false, i);
    offsite_1.default.emit('title', { name: 'slidesAdvance', title });
}
/**
 * Resets the temporarily stored assets ands the current slide value.
 */
function reset() {
    var _a;
    assetsTemp = assetsSorted();
    replicants_1.readerIntroduction.value.current = ((_a = assetsTemp[0]) === null || _a === void 0 ? void 0 : _a.sum) || 'RunInfo';
    changeAdvanceSlideSDTitle();
    changeAdvanceSlideOffsiteTitle();
}
/**
 * Shows the next slide, either one of the images or if all done, the run information.
 */
function showNext() {
    if (!obs_1.default.isCurrentScene(config.obs.names.scenes.readerIntroduction)) {
        return false;
    }
    if (replicants_1.readerIntroduction.value.current !== 'RunInfo') {
        const index = assetsTemp.findIndex((a) => a.sum === replicants_1.readerIntroduction.value.current);
        if (index >= 0 && assetsTemp.length > (index + 1)) {
            replicants_1.readerIntroduction.value.current = assetsTemp[index + 1].sum;
        }
        else {
            replicants_1.readerIntroduction.value.current = 'RunInfo';
        }
        changeAdvanceSlideSDTitle(index + 1);
        changeAdvanceSlideOffsiteTitle();
        return true;
    }
    return false;
}
// Listens for current/next run ID changes and executes a boxart lookup/download.
// Also resets the temporary assets array and current ID that should be shown on the graphic.
// TODO: Should also do this if the game name in the run data is changed?
//       Also maybe one day integrate the download into nodecg-speedcontrol?
let init = false;
speedcontrol_1.sc.runDataActiveRunSurrounding.on('change', async (newVal, oldVal) => {
    if (!init && newVal.current)
        await downloadBoxart(newVal.current);
    if (init) {
        if (newVal.current !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.current))
            reset();
        if (newVal.next && newVal.next !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.next))
            await downloadBoxart(newVal.next);
    }
    init = true;
});
replicants_1.assetsReaderIntroductionImages.on('change', (newVal) => {
    if (!assetsTemp.length && newVal.length > 0)
        reset();
});
// Triggers a Stream Deck title text update when scene changes.
replicants_1.obsData.on('change', (newVal, oldVal) => {
    if (newVal.scene !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.scene)) {
        changeAdvanceSlideSDTitle();
        changeAdvanceSlideOffsiteTitle();
    }
});
// What to do once Stream Deck connection is initialised.
streamdeck_1.default.on('init', () => {
    changeAdvanceSlideSDTitle();
});
// What to do when a button "appears" in the Stream Deck software,
// usually after dragging on a new instance.
streamdeck_1.default.on('willAppear', (data) => {
    if (data.action === sdButtonUUIDMap.advanceSlide) {
        changeAdvanceSlideSDTitle();
    }
});
// What to do when any key is lifted on a connected Stream Deck.
streamdeck_1.default.on('keyUp', (data) => {
    if (data.action === sdButtonUUIDMap.advanceSlide) {
        const success = showNext();
        if (success)
            streamdeck_1.default.send({ event: 'showOk', context: data.context });
    }
    else if (data.action === sdButtonUUIDMap.resetSlides) {
        reset();
        streamdeck_1.default.send({ event: 'showOk', context: data.context });
    }
});
offsite_1.default.on('authenticated', () => {
    changeAdvanceSlideOffsiteTitle();
});
// Offsite reader controls.
offsite_1.default.on('slidesAdvance', () => {
    const success = showNext();
    offsite_1.default.emit('ack', {
        name: 'slidesAdvance',
        success,
        title: generateAdvanceSlideTitle(false),
    });
});
offsite_1.default.on('slidesReset', () => {
    reset();
    offsite_1.default.emit('ack', { name: 'slidesReset', success: true });
});
