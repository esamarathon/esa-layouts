"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msToTimeStr = exports.padTimeNumber = void 0;
const ws_1 = require("ws");
const nodecg_1 = require("./util/nodecg");
// const chan = 'zoton2';
const chan = 'joeys64';
const url = `wss://fh76djw1t9.execute-api.eu-west-1.amazonaws.com/prod?username=marathon-${chan}`;
let ws;
function padTimeNumber(num) {
    return num.toString().padStart(2, '0');
}
exports.padTimeNumber = padTimeNumber;
function msToTimeStr(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${padTimeNumber(hours)}:${padTimeNumber(minutes)}:${padTimeNumber(seconds)}`;
}
exports.msToTimeStr = msToTimeStr;
function connect() {
    ws = new ws_1.WebSocket(url);
    (0, nodecg_1.get)().log.info('[Therun.gg] Connecting');
    (0, nodecg_1.get)().log.debug(`[Therun.gg] Using server ${url}`);
    ws.once('open', () => {
        (0, nodecg_1.get)().log.info('[Therun.gg] Connection successful');
    });
    // Catching any errors with the connection.
    // The "close" event is also fired if it's a disconnect.
    ws.on('error', (err) => {
        (0, nodecg_1.get)().log.warn('[Therun.gg] Connection error occured');
        (0, nodecg_1.get)().log.debug('[Therun.gg] Connection error occured:', err);
    });
    ws.once('close', () => {
        (0, nodecg_1.get)().log.warn('[Therun.gg] Connection closed, will reconnect in 10 seconds');
        setTimeout(connect, 10 * 1000);
    });
    ws.on('message', (data) => {
        let obj = JSON.parse(data.toString()).event;
        let str = '';
        if (obj.type === 'general_data_event') {
            obj = obj;
            // NO NEED TO IMPLEMENT YET!
        }
        else if (obj.type === 'live_data_event') {
            obj = obj;
            // NO NEED TO IMPLEMENT YET!
        }
        else if (obj.type === 'run_started_event') {
            obj = obj;
            // NO NEED TO IMPLEMENT YET!
        }
        else if (obj.type === 'gold_split_event') {
            obj = obj;
            // Gold Split
            str = `Runner got a Gold Split! ${msToTimeStr(obj.data.newGold)}`;
        }
        else if (obj.type === 'best_run_ever_event') {
            obj = obj;
            // NO NEED TO IMPLEMENT YET!
        }
        else if (obj.type === 'top_10_single_segment_event') {
            obj = obj;
            // Top 10% Single Segment Event
            // obj.description is what we should show
            // str = obj.description; // TODO: Verify this is what we should show.
        }
        else if (obj.type === 'top_10_total_segment_event') {
            obj = obj;
            // Top 10% Total Segment Event
            // obj.description is what we should show
            // NO NEED TO IMPLEMENT YET!
        }
        else if (obj.type === 'worst_10_single_segment_event') {
            obj = obj;
            // str = obj.description; // TODO: Verify this is what we should show.
        }
        else if (obj.type === 'final_split_event') {
            obj = obj;
            // NO NEED TO IMPLEMENT YET!
        }
        else if (obj.type === 'run_ended_event') {
            obj = obj;
            // When a run ends.
            // NO NEED TO IMPLEMENT YET!
        }
        else if (obj.type === 'free_input_event') {
            // Free Input Event
            // obj.data.input will give you the free text string
            str = obj.data.input;
        }
        else if (obj.type === 'current_pb_event') {
            // Current PB Event
            // obj.data.personalBest will give you their PB in milliseconds
            str = `Runner's Current Personal Best: ${msToTimeStr(obj.data.personalBest)}`;
        }
        else if (obj.type === 'current_prediction_event') {
            // Current Prediction
            // obj.data.currentPredictedTime will give you it in milliseconds(?)
            // obj.data.deltaCurrentToInitialPredictedTime will give you it in milliseconds(?)
            str = `Runner's Current Predicted Time: ${msToTimeStr(obj.data.currentPredictedTime)}`;
        }
        else if (obj.type === 'current_best_possible_event') {
            // Current Best Possible Time
            // obj.data.currentBestPossibleTime will give you it in milliseconds
            str = `Runner's Current Best Possible Time: ${msToTimeStr(obj.data.currentBestPossibleTime)}`;
        }
        else if (obj.type === 'current_sob_event') {
            // Current SOB
            // obj.data.sumOfBests will give you it in milliseconds
            str = `Runner's Sum of Best: ${msToTimeStr(obj.data.sumOfBests)}`;
        }
        else if (obj.type === 'current_split_event') {
            // Current Split
            /*
              data: {
                currentSplitName: '',
                currentSplitIndex: -1,
                totalSplitCount: 10,
                nextSplitIndex: 0,
                nextSplitName: '-Satelliitin Sabotaasi'
              }
            */
            // NO NEED TO IMPLEMENT YET!
        }
        else {
            // Unknown Message Type
        }
        (0, nodecg_1.get)().sendMessage('therunggMessage', str);
    });
}
if ((0, nodecg_1.get)().bundleConfig.event.thisEvent === 1 && (0, nodecg_1.get)().bundleConfig.therungg.enabled) {
    connect();
}
