export namespace Restream {
  interface ConfigItem {
    address: string;
    key: string;
  }
  interface Config {
    enable: boolean;
    instances: ConfigItem | ConfigItem[];
  }

  interface UpdateMsg {
    type: 'Update',
    channel?: string;
    uuid: string;
  }
  interface ResponseMsg {
    type: 'Response',
    // err?: string; // Should only appear on ResponseErr!
    msgID: string;
    channel?: string;
    uuid: string;
  }
  interface ResponseErr extends ResponseMsg {
    err: string;
  }
  type IncomingMsg = UpdateMsg | ResponseMsg | ResponseErr;

  interface Start {
    type: 'Start';
    channel?: string;
  }
  interface Stop {
    type: 'Stop';
  }
  interface Restart {
    type: 'Restart';
  }
  type AllSentMsg = Start | Stop | Restart;
}
