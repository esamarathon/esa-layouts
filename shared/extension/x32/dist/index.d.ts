import type NodeCGTypes from '@nodecg/types';
import osc, { OscMessage } from 'osc';
import { TypedEmitter } from 'tiny-typed-emitter';
import { X32 as X32Types } from '../../../types';
interface X32Events {
    error: (error: Error) => void;
    ready: () => void;
    /**
     * @param message OSC message received from the mixer
     */
    message: (message: OscMessage) => void;
}
declare class X32 extends TypedEmitter<X32Events> {
    private nodecg;
    private config;
    conn: osc.UDPPort | undefined;
    ready: boolean;
    faders: {
        [k: string]: number;
    };
    fadersExpected: {
        [k: string]: {
            value: number;
            increase: boolean;
            seenOnce: boolean;
        };
    };
    private fadersInterval;
    constructor(nodecg: NodeCGTypes.ServerAPI, config: X32Types.Config);
    /**
     * Just set a specific fader to the supplied value.
     * @param name Full name of fader (example: /dca/1/fader).
     * @param value Value to set (0.0 - 1.0).
     */
    setFader(name: string, value: number): void;
    /**
     * Fades up/down the supplied fader using the specified settings.
     * @param name Full name of fader (example: /dca/1/fader).
     * @param startValue Value to start at (0.0 - 1.0).
     * @param endValue Value to end at (0.0 - 1.0).
     * @param length Milliseconds to spend doing fade.
     */
    fade(name: string, startValue: number, endValue: number, length: number): void;
    private handleFaderEvent;
}
export = X32;
//# sourceMappingURL=index.d.ts.map