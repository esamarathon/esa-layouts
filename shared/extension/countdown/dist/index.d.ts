import type { NodeCG, Replicant } from 'nodecg/types/server';
import type { Countdown } from '../../../types/schemas';
declare class CountdownClass {
    private countdownTimeout;
    countdown: Replicant<Countdown>;
    constructor(nodecg: NodeCG);
    updateCountdownTimer(): void;
}
export = CountdownClass;
//# sourceMappingURL=index.d.ts.map