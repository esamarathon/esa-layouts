import type * as types from '@esamarathon/mq-events/types';
import { EventEmitter } from 'events';

export namespace RabbitMQ {
  type ListenTopics = {
    name: string;
    exchange: string;
    key: string;
  }[];

  interface Config {
    enable: boolean;
    protocol: string;
    hostname: string;
    username: string;
    password: string;
    vhost: string;
  }

  interface Options {
    connectionOptions: {
      credentials: {
        mechanism: string;
        response(): Buffer;
        username: string;
        password: string;
      };
    };
  }

  interface Events extends EventEmitter {
    on(event: 'donationTotalUpdated', listener: (data: types.Tracker.EventDonationTotalUpdated) => void): this;
    on(event: 'donationFullyProcessed', listener: (data: types.Tracker.DonationFullyProcessed) => void): this;
    on(event: 'newScreenedTweet', listener: (data: types.OmnibarModeration.NewScreenedTweet) => void): this;
    on(event: 'newScreenedSub', listener: (data: types.OmnibarModeration.NewScreenedSub) => void): this;
    on(event: 'newScreenedCheer', listener: (data: types.OmnibarModeration.NewScreenedCheer) => void): this;
    on(event: 'newScreenedCrowdControl', listener: (data: types.OmnibarModeration.NewScreenedCrowdControl) => void): this;
    on(event: 'bigbuttonTagScanned', listener: (data: types.FlagCarrier.TagScanned) => void): this;
    on(event: 'bigbuttonPressed', listener: (data: types.BigButton.ButtonPress) => void): this;
    on(event: 'runChanged', listener: (data: types.NodeCG.SCActiveRunChanged) => void): this;
    on(event: 'streamingStatusChanged', listener: (data: types.NodeCG.OBSStreamingStatusChanged) => void): this;
    on(event: 'gameSceneChanged', listener: (data: types.NodeCG.OBSSceneChanged) => void): this;
    on(event: 'rvtServerStarted', listener: (data: types.RestreamViewerTool.ServerStarted) => void): this;
  }
}
