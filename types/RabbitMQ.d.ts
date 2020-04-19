import { EventEmitter } from 'events';
import * as types from 'mq-events/types';

export interface MQOpts {
  connectionOptions: {
    credentials: {
      mechanism: string;
      response(): Buffer;
      username: string;
      password: string;
    };
  };
}

export interface MQEvents extends EventEmitter {
  on(event: 'donationTotalUpdated', listener: (data: types.Tracker.EventDonationTotalUpdated) => void): this;
  on(event: 'donationFullyProcessed', listener: (data: types.Tracker.DonationFullyProcessed) => void): this;
  on(event: 'newScreenedTweet', listener: (data: types.OmnibarModeration.NewScreenedTweet) => void): this;
  on(event: 'newScreenedSub', listener: (data: types.OmnibarModeration.NewScreenedSub) => void): this;
  on(event: 'newScreenedCheer', listener: (data: types.OmnibarModeration.NewScreenedCheer) => void): this;
  on(event: 'newScreenedCrowdControl', listener: (data: types.OmnibarModeration.NewScreenedCrowdControl) => void): this;
  on(event: 'bigbuttonTagScanned', listener: (data: types.FlagCarrier.TagScanned) => void): this;
  on(event: 'bigbuttonPressed', listener: (data: types.BigButton.ButtonPress) => void): this;
  on(event: 'runChanged', listener: (data: types.NodeCG.SCActiveRunChanged) => void): this;
  on(event: 'gameSceneChanged', listener: (data: types.NodeCG.OBSSceneChanged) => void): this;
  on(event: 'rvtServerStarted', listener: (data: types.RestreamViewerTool.ServerStarted) => void): this;
}
