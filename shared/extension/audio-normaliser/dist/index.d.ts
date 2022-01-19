import type { NodeCG, Replicant } from 'nodecg/types/server';
import { Asset } from 'types';
declare class AudioNormaliser {
    nodecg: NodeCG;
    assets: Replicant<Asset[]>;
    assetsNormalised: Replicant<Asset[]>;
    constructor(nodecg: NodeCG, assetName?: string);
    private setup;
    private getAssetDir;
    private getAssetLocation;
}
export = AudioNormaliser;
//# sourceMappingURL=index.d.ts.map