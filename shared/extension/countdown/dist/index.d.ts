import type { NodeCG, Replicant } from 'nodecg/types/server';
import type { Countdown } from '../../../types/schemas';
declare class MediaBox {
    private countdownTimeout;
    countdown: Replicant<Countdown>;
    constructor(nodecg: NodeCG);
    updateCountdownTimer(): void;
}
export = MediaBox;
//# sourceMappingURL=index.d.ts.map