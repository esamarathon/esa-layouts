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
import { State } from 'vuex-class';
import { Countdown } from '@/types/schemas';
import { msToTimeStr } from '../_misc/helpers';

@Component
export default class extends Vue {
  @State countdown!: Countdown;
  entry = '';

  get currentCountdown(): string {
    const seconds = Math.round(this.countdown.remaining / 1000);
    return msToTimeStr(seconds * 1000);
  }

  change(): void {
    nodecg.sendMessage('startCountdown', this.entry);
    this.entry = '';
  }
}
</script>
