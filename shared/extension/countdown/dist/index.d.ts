import type NodeCGTypes from '@nodecg/types';
import type { Countdown } from '../../../types/schemas';
declare class CountdownClass {
    private countdownTimeout;
    countdown: NodeCGTypes.ServerReplicantWithSchemaDefault<Countdown>;
    constructor(nodecg: NodeCGTypes.ServerAPI);
    updateCountdownTimer(): void;
}
export = CountdownClass;
//# sourceMappingURL=index.d.ts.map