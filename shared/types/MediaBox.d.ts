export namespace MediaBox {
  type Types = 'image' | 'prize' | 'prize_generic' | 'text' | 'donation' | 'subscription' | 'cheer' | 'merch' | 'therungg';

  type ActiveElem = {
    type: Types;
    id: string;
    mediaUUID: string;
    index: number;
    timestamp: number;
    timeElapsed: number;
  } | null;

  interface RotationElem {
    type: 'image' | 'prize' | 'prize_generic' | 'text';
    id: string;
    mediaUUID: string;
    text?: string;
    seconds: number;
    showOnIntermission: boolean;
  }

  interface AlertElem {
    type: 'donation' | 'subscription' | 'cheer' | 'merch';
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
    }
    | {
      user: string;
      productName: string;
      imgURL: string;
    }
    | {
      msg: string;
    };
  }
}
