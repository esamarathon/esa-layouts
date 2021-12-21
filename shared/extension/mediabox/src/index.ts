import clone from 'clone';
import { EventEmitter } from 'events';
import type { NodeCG, Replicant } from 'nodecg/types/server';
import path from 'path';
import { v4 as uuid } from 'uuid';
import type { Asset, MediaBox as MediaBoxType, Tracker } from '../../../types';
import type { MediaBox as MediaBoxRep, Prizes } from '../../../types/schemas';

/**
 * Calculates the absolute file path to one of our local replicant schemas.
 * @param schemaName the replicant/schema filename.
 */
function buildSchemaPath(schemaName: string) {
  return path.resolve(__dirname, '../../../schemas', `${encodeURIComponent(schemaName)}.json`);
}

class MediaBox {
  private nodecg: NodeCG;
  mediaBox: Replicant<MediaBoxRep>;
  prizes: Replicant<Prizes>;
  assetsMediaBoxImages: Replicant<Asset[]>;

  constructor(nodecg: NodeCG, evt: EventEmitter) {
    this.nodecg = nodecg;
    this.mediaBox = nodecg.Replicant('mediaBox', { schemaPath: buildSchemaPath('mediaBox') });
    this.prizes = nodecg.Replicant('prizes', {
      schemaPath: buildSchemaPath('prizes'),
      persistent: false,
    });
    this.assetsMediaBoxImages = nodecg.Replicant('assets:media-box-images');

    // Manages received donations/subscriptions/cheers.
    evt.on('donationFullyProcessed', (data) => {
      if (data.comment_state === 'APPROVED') {
        // eslint-disable-next-line no-underscore-dangle
        this.nodecg.log.debug('[Media Box] Received new donation with ID %s', data._id);
        this.mediaBox.value.alertQueue.push({
          type: 'donation',
          id: uuid(),
          data: {
            name: data.donor_visiblename.replace('(Anonymous)', 'Anonymous'),
            amount: data.amount,
            comment: data.comment || undefined,
          },
        });
      }
    });
    evt.on('newScreenedSub', (data) => {
      this.nodecg.log.debug('[Media Box] Received new subscription');
      this.mediaBox.value.alertQueue.push({
        type: 'subscription',
        id: uuid(),
        data: {
          systemMsg: data.message.tags['system-msg'].replace(/\\s/g, ' '),
          message: data.message.trailing,
        },
      });
    });
    evt.on('newScreenedCheer', (data) => {
      this.nodecg.log.debug('[Media Box] Received new cheer');
      this.mediaBox.value.alertQueue.push({
        type: 'cheer',
        id: uuid(),
        data: {
          name: data.message.tags['display-name'],
          amount: Number(data.message.tags.bits),
          message: data.message.trailing,
        },
      });
    });

    this.update();
    setInterval(() => this.update(), 1000);
  }

  /**
   * Checks if the supplied type is that of an alert.
   * @param type Type of alert
   */
  private isAlertType(type: MediaBoxType.Types): boolean {
    return ['donation', 'subscription', 'cheer'].includes(type);
  }

  /**
   * Get the length in milliseconds a piece of media should remain,
   * -1 if we cannot find any relevant length.
   * @param media media box object, usually from "current" property.
   */
  private getLength(media: MediaBoxType.ActiveElem): number {
    if (media && this.isAlertType(media.type)) {
      return 15 * 1000; // Alerts have a hardcoded 15 second length for now.
    }
    const length = this.mediaBox.value.rotationApplicable.find((i) => i.id === media?.id)?.seconds;
    return length ? length * 1000 : -1;
  }

  /**
   * Get the index of the next piece of media in the rotation,
   * 0 if for some reason nothing can be located correctly.
   */
  private getNextIndex(): number {
    const indexID = this.mediaBox.value.rotationApplicable
      .findIndex((i) => i.id === this.mediaBox.value.current?.id);
    if (indexID >= 0) {
      return indexID + 1;
    }
    return typeof this.mediaBox.value.lastIndex === 'number'
      ? this.mediaBox.value.lastIndex + 1 : 0;
  }

  /**
   * Returns if a prize should be shown or not.
   * @param prize Formatted prize object from the tracker.
   */
  private isPrizeApplicable(prize?: Tracker.FormattedPrize): boolean {
    return !!(prize && prize.startTime && prize.endTime
      && Date.now() > prize.startTime && Date.now() < prize.endTime);
  }

  /**
   * Returns a random applicable prize if one is available.
   */
  private getRandomPrize(): Tracker.FormattedPrize | undefined {
    const applicablePrizes = this.prizes.value.filter((p) => this.isPrizeApplicable(p));
    return applicablePrizes[Math.floor(Math.random() * applicablePrizes.length)];
  }

  /**
   * Handles the cycling of of the current media.
   * @param pause If we should be attempted to "pause" the current media for an alert.
   */
  private cycle(pause = false): void {
    // If the alert queue has anything in it, we need to handle those first.
    if (this.mediaBox.value.alertQueue.length) {
      if (pause) { // Pause current media element.
        this.mediaBox.value.paused = clone(this.mediaBox.value.current);
      }
      this.mediaBox.value.current = {
        type: this.mediaBox.value.alertQueue[0].type,
        id: uuid(),
        mediaUUID: this.mediaBox.value.alertQueue[0].id,
        index: -1,
        timestamp: Date.now(),
        timeElapsed: 0,
      };
    } else if (this.mediaBox.value.rotationApplicable.length) {
      // Resume paused media element if applicable.
      if (this.mediaBox.value.paused) {
        const toResume = clone(this.mediaBox.value.paused);
        toResume.timestamp = Date.now();
        this.mediaBox.value.current = toResume;
        this.mediaBox.value.paused = null;
      } else { // Find next media element from rotation to use.
        const index = this.getNextIndex() < this.mediaBox.value.rotationApplicable.length
          ? this.getNextIndex() : 0;
        const media = this.mediaBox.value.rotationApplicable[index];
        const mUUID = media.type === 'prize_generic'
          ? (this.getRandomPrize()?.id.toString() || '-1') : media.mediaUUID;
        this.mediaBox.value.current = {
          type: media.type,
          id: media.id,
          mediaUUID: mUUID,
          index,
          timestamp: Date.now(),
          timeElapsed: 0,
        };
      }
    } else {
      this.nodecg.log.debug('[Media Box] No media in rotation to cycle to, will wait');
      this.mediaBox.value.current = null;
      this.mediaBox.value.paused = null;
    }
  }

  /**
   * This runs every second, all of the time.
   */
  private update(): void {
    // Filters rotation for items only applicable/available at this moment.
    const rotationApplicableLengthOld = this.mediaBox.value.rotationApplicable.length;
    this.mediaBox.value.rotationApplicable = this.mediaBox.value.rotation.filter((m) => {
      // Only rotate to image if the asset actually exists.
      if (m.type === 'image') {
        return !!this.assetsMediaBoxImages.value.find((i) => i.sum === m.mediaUUID);
      }
      // Only show the generic prize element if there are applicable prizes to fill it with.
      if (m.type === 'prize_generic') {
        return !!this.prizes.value.filter((p) => this.isPrizeApplicable(p)).length;
      }
      // Only show prize if applicable right now.
      if (m.type === 'prize') {
        return this.isPrizeApplicable(this.prizes.value
          .find((p) => p.id.toString() === m.mediaUUID));
      }
      return false;
    });
    if (this.mediaBox.value.rotationApplicable.length !== rotationApplicableLengthOld) {
      this.nodecg.log.debug('[Media Box] Applicable rotation length changed');
    }

    // If we have no piece of media, check if there is anything to show.
    if (!this.mediaBox.value.current) {
      if (this.mediaBox.value.rotationApplicable.length || this.mediaBox.value.alertQueue.length) {
        this.nodecg.log.debug('[Media Box] '
        + `${this.mediaBox.value.alertQueue.length ? 'Alert' : 'Media'} available, will cycle`);
        this.cycle();
      }
    } else { // If we have a current piece of media, need to check if it still should be shown.
      const addedTime = Date.now() - this.mediaBox.value.current.timestamp;
      const timeElapsed = this.mediaBox.value.current.timeElapsed + addedTime;
      const index = this.mediaBox.value.rotationApplicable
        .findIndex((i) => i.id === this.mediaBox.value.current?.id);

      // Cycle if it is time to remove the current media.
      if ((index < 0 && !this.isAlertType(this.mediaBox.value.current.type))
        || this.getLength(this.mediaBox.value.current) <= timeElapsed) {
        // If this is an alert, we also need to remove that one from the queue.
        if (this.isAlertType(this.mediaBox.value.current.type)) {
          const alertIndex = this.mediaBox.value.alertQueue
            .findIndex((a) => a.id === this.mediaBox.value.current?.mediaUUID);
          if (alertIndex >= 0) {
            this.mediaBox.value.alertQueue.splice(alertIndex, 1);
          }
        } else {
          this.mediaBox.value.lastIndex = this.mediaBox.value.current.index;
        }
        this.nodecg.log.debug('[Media Box] Current media time finished, will cycle');
        this.cycle();
      } else {
        if (!this.isAlertType(this.mediaBox.value.current.type)) {
          this.mediaBox.value.current.index = index;
        }
        this.mediaBox.value.current.timestamp = Date.now();
        this.mediaBox.value.current.timeElapsed = timeElapsed;

        // If there are any alerts to show, we should do that now.
        if (!this.isAlertType(this.mediaBox.value.current.type)
          && this.mediaBox.value.alertQueue.length) {
          this.nodecg.log.debug('[Media Box] Alert available, will cycle');
          this.cycle(true);
        }
      }
    }
  }
}

export = MediaBox;
