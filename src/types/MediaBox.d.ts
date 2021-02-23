export namespace MediaBox {
  type Types = 'image' | 'prize' | 'prize_generic' | 'donation' | 'subscription' | 'cheer';

  type ActiveElem = {
    type: Types;
    id: string;
    mediaUUID: string;
    index: number;
    timestamp: number;
    timeElapsed: number;
  } | null;

  interface RotationElem {
    type: 'image' | 'prize' | 'prize_generic';
    id: string;
    mediaUUID: string;
    seconds: number;
  }

  interface AlertElem {
    type: 'donation' | 'subscription' | 'cheer';
    id: string;
    data:
      | {
          name: string;
          amount: number;
          comment?: string;
        }
      | {
          systemMsg: string;
          message?: string;
        }
      | {
          name: string;
          amount: number;
          message: string;
        };
  }
}
