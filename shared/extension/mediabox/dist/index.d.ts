import type { NodeCG, Replicant } from 'nodecg/types/server';
import type { Asset, RabbitMQ } from '../../../types';
import type { MediaBox as MediaBoxRep, Prizes } from '../../../types/schemas';
declare class MediaBox {
    private nodecg;
    mediaBox: Replicant<MediaBoxRep>;
    prizes: Replicant<Prizes>;
    assetsMediaBoxImages: Replicant<Asset[]>;
    constructor(nodecg: NodeCG, evt: RabbitMQ.Events);
    pushMerchPurchase({ user, productName, imgURL }: {
        user: string;
        productName: string;
        imgURL: string;
    }): void;
    /**
     * Checks if the supplied type is that of an alert.
     * @param type Type of alert
     */
    private isAlertType;
    /**
     * Get the length in milliseconds a piece of media should remain,
     * -1 if we cannot find any relevant length.
     * @param media media box object, usually from "current" property.
     */
    private getLength;
    /**
     * Get the index of the next piece of media in the rotation,
     * 0 if for some reason nothing can be located correctly.
     */
    private getNextIndex;
    /**
     * Returns if a prize should be shown or not.
     * @param prize Formatted prize object from the tracker.
     */
    private isPrizeApplicable;
    /**
     * Returns a random applicable prize if one is available.
     */
    private getRandomPrize;
    /**
     * Handles the cycling of of the current media.
     * @param pause If we should be attempted to "pause" the current media for an alert.
     */
    private cycle;
    /**
     * This runs every second, all of the time.
     */
    private update;
}
export = MediaBox;
//# sourceMappingURL=index.d.ts.map