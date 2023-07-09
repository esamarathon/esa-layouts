import type NodeCGTypes from '@alvancamp/test-nodecg-types';
import NodeCG from '@alvancamp/test-nodecg-types';
declare class AudioNormaliser {
    nodecg: NodeCGTypes.ServerAPI;
    assets: NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCG.AssetFile[]>;
    assetsNormalised: NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCG.AssetFile[]>;
    constructor(nodecg: NodeCGTypes.ServerAPI, assetName?: string);
    private setup;
    private getAssetDir;
    private getAssetLocation;
}
export = AudioNormaliser;
//# sourceMappingURL=index.d.ts.map