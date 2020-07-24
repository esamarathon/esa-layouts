<template>
  <v-app>
    <div>
      Current Countdown: {{ currentCountdown }}
    </div>
    <div class="d-flex">
      <v-text-field
        v-model="entry"
        label="Start Time (MM:SS)"
        hide-details
        filled
        :spellcheck="false"
        @keyup.enter="change(); $event.target.blur();"
      />
      <v-btn
        height="56px"
        :style="{ 'min-width': '0', 'margin-left': '5px' }"
        @click="change"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Countdown } from 'schemas';
import { timeStrToMS, msToTimeStr } from '../_misc/helpers';

@Component
export default class extends Vue {
  @State countdown!: Countdown;
  entry = '';

  get currentCountdown(): string {
    const seconds = Math.round(this.countdown.remaining / 1000);
    return msToTimeStr(seconds * 1000);
  }

  change(): void {
    if (this.entry.match(/^(\d+:)?(?:\d{1}|\d{2}):\d{2}$/)) {
      const ms = timeStrToMS(this.entry);
      nodecg.sendMessage('startCountdown', ms);
      this.entry = '';
    }
  }
}
</script>
