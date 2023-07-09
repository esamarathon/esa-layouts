/// <reference types="node" />
import type NodeCGTypes from '@nodecg/types';
import { EventEmitter } from 'events';
import ObsWebsocketJs from 'obs-websocket-js';
import { OBS as OBSTypes } from '../../../types';
interface OBS {
    on(event: 'streamingStatusChanged', listener: (streaming: boolean, old?: boolean) => void): this;
    on(event: 'connectionStatusChanged', listener: (connected: boolean) => void): this;
    on(event: 'currentSceneChanged', listener: (current?: string, last?: string) => void): this;
    on(event: 'sceneListChanged', listener: (list: string[]) => void): this;
}
declare class OBS extends EventEmitter {
    private nodecg;
    private config;
    conn: ObsWebsocketJs;
    currentScene: string | undefined;
    sceneList: string[];
    connected: boolean;
    streaming: boolean | undefined;
    constructor(nodecg: NodeCGTypes.ServerAPI, config: OBSTypes.Config);
    connect(): Promise<void>;
    /**
     * Find scene based on string; at least the start of the name should be supplied.
     * @param name Name of scene, at least starting of name.
     */
    findScene(name: string): string | undefined;
    /**
     * Check if we are on a specified scene; at least the start of the name should be supplied.
     * @param name Name of scene to check we are on, at least starting of name.
     */
    isCurrentScene(name: string): boolean;
    /**
     * Change to the OBS scene with the closest matched name.
     * @param name Name of the scene.
     */
    changeScene(name: string): Promise<void>;
    /**
     * Get named source's current settings.
     * @param sourceName Name of the source.
     */
    getSourceSettings(sourceName: string): Promise<{
        messageId: string;
        status: 'ok';
        sourceName: string;
        sourceType: string;
        sourceSettings: Record<string, unknown>;
    }>;
    /**
     * Modify a sources settings.
     * @param sourceName Name of the source.
     * @param sourceType Source type (has the be the internal name, not the display name).
     * @param sourceSettings Settings you wish to pass to OBS to change.
     */
    setSourceSettings(sourceName: string, sourceType: string, sourceSettings: Record<string, unknown>): Promise<void>;
    /**
     * Resets the scene item, then sets some properties if possible.
     * @param scene Name of scene that item is in
     * @param item Name of item
     * @param area Area object (as used in capturePositions): x, y, width, height
     * @param crop Crop object: top, bottom, left, right
     * @param visible If the source should be visible or not
     */
    configureSceneItem(scene: string, item: string, area?: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    }, crop?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    }, visible?: boolean): Promise<void>;
}
export default OBS;
//# sourceMappingURL=index.d.ts.map