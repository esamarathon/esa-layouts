<template>
  <v-app>
    <div>
      Current Countdown: {{ currentCountdown }}
    </div>
    <v-time-picker
      v-model="entry"
      format="24hr"
      full-width
    />
    <v-btn @click="change()">
      Apply
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import clone from 'clone';
import { msToTimeStr } from '../../browser_shared/helpers';
import { Countdown } from '../../types/schemas';

@Component
export default class extends Vue {
  countdown: Countdown | null = null;
  entry = '';

  get currentCountdown(): string {
    const seconds = Math.round((this.countdown?.remaining ?? 0) / 1000);
    return msToTimeStr(seconds * 1000);
  }

  change(): void {
    nodecg.sendMessage('startCountdown', this.entry);
    this.entry = '';
  }

  created(): void {
    // Simple replicant cloning to avoid having to use a whole Vuex store.
    nodecg.Replicant<Countdown>('countdown').on('change', (val) => {
      Vue.set(this, 'countdown', clone(val));
    });
  }
}
</script>
