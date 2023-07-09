import type NodeCGTypes from '@nodecg/types';
import { Music as MusicTypes } from '../../../types';
import { MusicData } from '../../../types/schemas';
import OBS from '../../obs';
declare class Music {
    private nodecg;
    private config;
    private obs;
    private auth;
    private headers;
    private positionTimestamp;
    private positionInitial;
    private positionInterval;
    musicData: NodeCGTypes.ServerReplicantWithSchemaDefault<MusicData>;
    constructor(nodecg: NodeCGTypes.ServerAPI, config: MusicTypes.Config, obs: OBS);
    /**
     * Make a request to the Beefweb foobar2000 plugin.
     * @param method Required HTTP method.
     * @param endpoint The endpoint to request.
     */
    private request;
    /**
     * Updates the stored position of the current track every second.
     */
    private updatePosition;
    /**
     * Sends a "play" command to foobar2000.
     */
    play(): Promise<void>;
    /**
     * Sends a "pause" command to foobar2000.
     */
    pause(): Promise<void>;
    /**
     * Sets up the constant connection to foobar2000.
     */
    private setup;
}
export = Music;
//# sourceMappingURL=index.d.ts.map