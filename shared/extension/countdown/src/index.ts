import type { NodeCG, Replicant } from 'nodecg/types/server';
import path from 'path';
import type { Countdown } from '../../../types/schemas';

/**
 * Calculates the absolute file path to one of our local replicant schemas.
 * @param schemaName the replicant/schema filename.
 */
function buildSchemaPath(schemaName: string) {
  return path.resolve(__dirname, '../../../schemas', `${encodeURIComponent(schemaName)}.json`);
}

class MediaBox {
  // private nodecg: NodeCG;
  private countdownTimeout: NodeJS.Timeout | undefined;
  countdown: Replicant<Countdown>;

  constructor(nodecg: NodeCG) {
    // this.nodecg = nodecg;
    this.countdown = nodecg.Replicant('countdown', { schemaPath: buildSchemaPath('countdown') });

    nodecg.listenFor('startCountdown', (time: string) => {
      if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
        return;
      }
      const now = new Date();
      const then = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        Number(time.split(':')[0]),
        Number(time.split(':')[1]),
      );
      if (this.countdownTimeout) {
        clearTimeout(this.countdownTimeout);
      }
      const diff = then.getTime() - now.getTime();
      if (diff <= 0) {
        return;
      }
      this.countdown.value = {
        originalDuration: diff,
        remaining: diff,
        timestamp: Date.now(),
      };
      this.updateCountdownTimer();
    });
    this.updateCountdownTimer();
  }

  updateCountdownTimer(): void {
    const cdTimer = this.countdown.value;
    const remaining = cdTimer.originalDuration - (Date.now() - cdTimer.timestamp);
    if (remaining > 0) {
      this.countdown.value.remaining = remaining;
      this.countdownTimeout = setTimeout(() => this.updateCountdownTimer(), 1000);
    } else {
      this.countdown.value.remaining = 0;
    }
  }
}

export = MediaBox;
