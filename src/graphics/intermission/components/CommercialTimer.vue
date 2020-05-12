<template>
  <div
    v-if="twitchCommercialTimer.secondsRemaining > 0"
    class="Fixed Flex"
    :style="{
      'background-color': 'rgba(0,0,0,0.3)',
      'font-size': '20px',
    }"
  >
    Twitch Commercials Running: {{ commercialTimeRemaining }}
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { TwitchCommercialTimer } from 'speedcontrol-util/types';
import { padTimeNumber } from '../../_misc/helpers';

@Component
export default class extends Vue {
  @State twitchCommercialTimer!: TwitchCommercialTimer;

  formatSeconds(sec: number): string {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec - minutes * 60);
    return `${minutes}:${padTimeNumber(seconds)}`;
  }

  get commercialTimeRemaining(): string {
    return this.formatSeconds(this.twitchCommercialTimer.secondsRemaining);
  }
}
</script>
