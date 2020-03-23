import { EventEmitter } from 'events';

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

// All typings below are automatically generated from the mq-events, to be improved.

interface DonationTotalUpdated {
  /**
   * Shorthand event string this total is for.
   */
  event: string;
  /**
   * The new overall donation total. Currency isn't specified but is (currently) USD.
   */
  new_total: number;
}

interface DonationFullyProcessed {
  /**
   * Shorthand event string this donation is for.
   */
  event: string;
  /**
   * Unique donation ID from the database.
   */
  _id: number;
  /**
   * The name of the donor that they would like to appear as publicly (can be "(Anonymous)").
   */
  donor_visiblename: string;
  /**
   * The amount this donation is for. Currency isn't specified but is (currently) USD.
   */
  amount: number;
  /**
   * If the donation comment was accepted/rejected. Should be APPROVED or DENIED, rarely could be something else if something server side messes up; treat anything that isn't APPROVED as if it was DENIED.
   */
  comment_state: "ABSENT" | "PENDING" | "DENIED" | "APPROVED" | "FLAGGED";
  /**
   * Donator's comment. Can be blank; is made blank if their comment was rejected.
   */
  comment: string;
  /**
   * Timestamp of when the donation was received.
   */
  time_received: string;
}

interface BigButtonPressed {
  /**
   * ID of the button
   */
  button_id: number;
  /**
   * Used to troubleshoot message delivery issues
   */
  button_message_count?: number;
  /**
   * Object containing timestamps of when the button was pressed
   */
  time: {
    /**
     * Time the button was pressed in seconds since Unix epoch
     */
    unix: number;
    /**
     * Time the button was pressed in the ISO 8601 format
     */
    iso: string;
  };
}

interface NewScreenedTweet {
  message: {
    /**
     * Contents of the tweet.
     */
    full_text: string;
  };
  user: {
    /**
     * Twitter handle of the user who sent the tweet.
     */
    name: string;
  };
}

interface NewScreenedCheer {
  message: {
    /**
     * The message text.
     */
    trailing: string;
    /**
     * This object represents a deserialized Twitch IRC message. Only properties that we use are listed here.
     */
    tags: {
      /**
       * The display name of the user who cheered.
       */
      "display-name": string;
      /**
       * The amount of bits cheered by the user.
       */
      bits: string;
      [k: string]: any;
    };
  };
}

interface NewScreenedCrowdControl {
  message: {
    /**
     * The message that WarpWorldBot originally posted in Twitch chat.
     */
    trailing: string;
    /**
     * This object represents a deserialized Twitch IRC message. Only properties that we use are listed here.
     */
    tags?: {
      [k: string]: any;
    };
    [k: string]: any;
  };
  [k: string]: any;
}

interface NewScreenedSub {
  message: {
    /**
     * The message following the system message.
     */
    trailing?: string;
    /**
     * This object represents a deserialized Twitch IRC message. Only properties that we use are listed here.
     */
    tags: {
      /**
       * The system message supplied by Twitch. Spaces are escaped as `\s`.
       */
      "system-msg": string;
      [k: string]: any;
    };
  };
}

interface RunChanged {
  /**
   * Short name for the physical event this message was for, usually the same as the donation tracker.
   */
  event: string;
  /**
   * Object of the run data from nodecg-speedcontrol. If this is not supplied, no run is set. See https://github.com/speedcontrol/nodecg-speedcontrol/blob/dev/types/RunData.d.ts
   */
  run?: {
    [k: string]: any;
  };
  /**
   * Time the active run was changed.
   */
  time: {
    /**
     * Timestamp representation in the ISO 8601 format
     */
    iso: string;
    /**
     * Timestamp representation in seconds since the Unix epoch, including a fractional millisecond part
     */
    unix: number;
  };
}

interface SceneChanged {
  /**
   * Short name for the physical event this message was for, usually the same as the donation tracker.
   */
  event: string;
  /**
   * Type of change for the scene, currently either 'start' or 'end'.
   */
  action: "start" | "end";
  /**
   * Scene name from OBS.
   */
  scene: string;
  /**
   * Specifies if the scene is a game scene
   */
  gameScene: boolean;
  /**
   * Time the scene was changed.
   */
  time: {
    /**
     * Timestamp representation in the ISO 8601 format
     */
    iso: string;
    /**
     * Timestamp representation in seconds since the Unix epoch, including a fractional millisecond part
     */
    unix: number;
  };
}

interface TagScanned {
  flagcarrier: {
    /**
     * ID of the terminal that scanned the tag (BRB1, ...)
     */
    id: string;
    /**
     * Group of the terminal that scanned the tag
     */
    group: string;
    /**
     * Timestamp of when the tag was scanned
     */
    time: {
      /**
       * Timestamp representation in the ISO 8601 format
       */
      iso: string;
      /**
       * Timestamp representation in seconds since the Unix epoch, including a fractional millisecond part
       */
      unix: number;
    };
    /**
     * NFC tag UID as hex string
     */
    uid: string;
    /**
     * Indicates if tag had a valid signature
     */
    validSignature?: boolean;
    /**
     * Base64 encoded ed25519 public key used to verify the tag
     */
    pubKey?: string;
  };
  user: {
    /**
     * UserTool ID of the user who scanned the tag (if known)
     */
    id?: string;
    /**
     * UserTool display name of the user who scanned the tag
     */
    displayName: string;
  };
  /**
   * Raw dump of scanned tags Key->Value data
   */
  raw: {
    [k: string]: string;
  };
}

export interface MQEvents extends EventEmitter {
  on(event: 'donationTotalUpdated', listener: (data: DonationTotalUpdated) => void): this;
  on(event: 'donationFullyProcessed', listener: (data: DonationFullyProcessed) => void): this;
  on(event: 'newScreenedTweet', listener: (data: NewScreenedTweet) => void): this;
  on(event: 'newScreenedSub', listener: (data: NewScreenedSub) => void): this;
  on(event: 'newScreenedCheer', listener: (data: NewScreenedCheer) => void): this;
  on(event: 'newScreenedCrowdControl', listener: (data: NewScreenedCrowdControl) => void): this;
  on(event: 'bigbuttonTagScanned', listener: (data: TagScanned) => void): this;
  on(event: 'bigbuttonPressed', listener: (data: BigButtonPressed) => void): this;
  on(event: 'runChanged', listener: (data: RunChanged) => void): this;
  on(event: 'gameSceneChanged', listener: (data: SceneChanged) => void): this;
}
