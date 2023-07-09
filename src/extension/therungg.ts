import { Therungg } from '@esa-layouts/types';
import { WebSocket } from 'ws';
import { get as nodecg } from './util/nodecg';

// const chan = 'zoton2';
const chan = 'joeys64';
const url = `wss://fh76djw1t9.execute-api.eu-west-1.amazonaws.com/prod?username=marathon-${chan}`;
let ws: WebSocket;

export function padTimeNumber(num: number): string {
  return num.toString().padStart(2, '0');
}

export function msToTimeStr(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return `${padTimeNumber(hours)
  }:${padTimeNumber(minutes)
  }:${padTimeNumber(seconds)}`;
}

function connect(): void {
  ws = new WebSocket(url);
  nodecg().log.info('[Therun.gg] Connecting');
  nodecg().log.debug(`[Therun.gg] Using server ${url}`);

  ws.once('open', () => {
    nodecg().log.info('[Therun.gg] Connection successful');
  });

  // Catching any errors with the connection.
  // The "close" event is also fired if it's a disconnect.
  ws.on('error', (err) => {
    nodecg().log.warn('[Therun.gg] Connection error occured');
    nodecg().log.debug('[Therun.gg] Connection error occured:', err);
  });

  ws.once('close', () => {
    nodecg().log.warn('[Therun.gg] Connection closed, will reconnect in 10 seconds');
    setTimeout(connect, 10 * 1000);
  });

  ws.on('message', (data) => {
    let obj = JSON.parse(data.toString()).event as Therungg.MarathonEvent;
    let str = '';

    if (obj.type === 'general_data_event') {
      obj = obj as Therungg.GeneralDataEvent;
      // NO NEED TO IMPLEMENT YET!
    } else if (obj.type === 'live_data_event') {
      obj = obj as Therungg.LiveRunEvent;
      // NO NEED TO IMPLEMENT YET!
    } else if (obj.type === 'run_started_event') {
      obj = obj as Therungg.RunStartedEvent;
      // NO NEED TO IMPLEMENT YET!
    } else if (obj.type === 'gold_split_event') {
      obj = obj as Therungg.GoldEvent;
      // Gold Split
      str = `Runner got a Gold Split! ${msToTimeStr(obj.data.newGold)}`;
    } else if (obj.type === 'best_run_ever_event') {
      obj = obj as Therungg.TopXSplitEvent;
      // NO NEED TO IMPLEMENT YET!
    } else if (obj.type === 'top_10_single_segment_event') {
      obj = obj as Therungg.TopXSplitEvent;
      // Top 10% Single Segment Event
      // obj.description is what we should show
      // str = obj.description; // TODO: Verify this is what we should show.
    } else if (obj.type === 'top_10_total_segment_event') {
      obj = obj as Therungg.TopXSplitEvent;
      // Top 10% Total Segment Event
      // obj.description is what we should show
      // NO NEED TO IMPLEMENT YET!
    } else if (obj.type === 'worst_10_single_segment_event') {
      obj = obj as Therungg.TopXSplitEvent;
      // str = obj.description; // TODO: Verify this is what we should show.
    } else if (obj.type === 'final_split_event') {
      obj = obj as Therungg.FinalSplitEvent;
      // NO NEED TO IMPLEMENT YET!
    } else if (obj.type === 'run_ended_event') {
      obj = obj as Therungg.RunEndedEvent;
      // When a run ends.
      // NO NEED TO IMPLEMENT YET!
    } else if (obj.type === 'free_input_event') {
      // Free Input Event
      // obj.data.input will give you the free text string
      str = obj.data.input;
    } else if (obj.type === 'current_pb_event') {
      // Current PB Event
      // obj.data.personalBest will give you their PB in milliseconds
      str = `Runner's Current Personal Best: ${msToTimeStr(obj.data.personalBest)}`;
    } else if (obj.type === 'current_prediction_event') {
      // Current Prediction
      // obj.data.currentPredictedTime will give you it in milliseconds(?)
      // obj.data.deltaCurrentToInitialPredictedTime will give you it in milliseconds(?)
      str = `Runner's Current Predicted Time: ${msToTimeStr(obj.data.currentPredictedTime)}`;
    } else if (obj.type === 'current_best_possible_event') {
      // Current Best Possible Time
      // obj.data.currentBestPossibleTime will give you it in milliseconds
      str = `Runner's Current Best Possible Time: ${msToTimeStr(obj.data.currentBestPossibleTime)}`;
    } else if (obj.type === 'current_sob_event') {
      // Current SOB
      // obj.data.sumOfBests will give you it in milliseconds
      str = `Runner's Sum of Best: ${msToTimeStr(obj.data.sumOfBests)}`;
    } else if (obj.type === 'current_split_event') {
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
    } else {
      // Unknown Message Type
    }

    nodecg().sendMessage('therunggMessage', str);
  });
}

if (nodecg().bundleConfig.event.thisEvent === 1) {
  connect();
}
