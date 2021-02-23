<template>
  <div id="Countdown">
    <div id="Background" />
    <div
      id="Layout"
      class="Flex"
      :style="{
        'flex-direction': 'column',
        height: '1000px',
      }"
    >
      <img class="Logo">
      <div
        :style="{
          'font-size': '70px',
          'margin-top': '50px',
        }"
      >
        <span v-if="countdown.remaining > 0">
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
          opacity: countdown.remaining > 0 ? 1 : 0,
        }"
      >
        {{ currentCountdown }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Countdown } from '@/types/schemas';
import { msToTimeStr } from '../_misc/helpers';

@Component
export default class extends Vue {
  @State countdown!: Countdown;

  get currentCountdown(): string {
    const seconds = Math.round(this.countdown.remaining / 1000);
    if (seconds >= 60 * 60 * 10) {
      return msToTimeStr(seconds * 1000);
    }
    if (seconds >= (60 * 60)) {
      return msToTimeStr(seconds * 1000).slice(1);
    }
    return msToTimeStr(seconds * 1000).slice(3);
  }
}
</script>
