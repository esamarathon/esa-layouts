<template>
  <div :style="{ 'text-align': 'center' }">
    <div :style="{ 'font-size': '70px' }">
      <span v-if="remaining > 0">
        Event Starts In
      </span>
      <span v-else>
        Event Starts Soon
      </span>
    </div>
    <div
      :style="{
        'font-size': '200px',
        'margin-top': '-0.2em',
        color: 'white',
        'font-weight': '600',
        opacity: remaining > 0 ? 1 : 0,
      }"
    >
      {{ currentCountdown }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import clone from 'clone';
import { msToTimeStr } from '../../browser_shared/helpers';
import { Countdown } from '../../types/schemas';

@Component
export default class extends Vue {
  countdown: Countdown | null = null;

  get remaining(): number {
    return this.countdown?.remaining ?? 0;
  }

  get currentCountdown(): string {
    const seconds = Math.round(this.remaining / 1000);
    if (seconds >= 60 * 60 * 10) {
      return msToTimeStr(seconds * 1000);
    }
    if (seconds >= (60 * 60)) {
      return msToTimeStr(seconds * 1000).slice(1);
    }
    return msToTimeStr(seconds * 1000).slice(3);
  }

  created(): void {
    // Simple replicant cloning to avoid having to use a whole Vuex store.
    nodecg.Replicant<Countdown>('countdown').on('change', (val) => {
      Vue.set(this, 'countdown', clone(val));
    });
  }
}
</script>
