<template>
  <div
    v-if="show"
    id="TimerBox"
    class="GameInfoBox FlexContainer"
    :style="textColor"
  >
    {{ time }}
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'TimerBox',
  data() {
    return {
      show: false,
      time: '',
      timer: Vue.prototype.$sc.timer,
      backupTimerTO: setTimeout(0),
      textColor: {
        color: 'white',
      },
    };
  },
  mounted() {
    this.timer.on('change', this.updateData);
  },
  destroyed() {
    this.timer.removeListener('change', this.updateData);
  },
  methods: {
    updateData(timer) {
      this.show = true;
      this.time = timer.time;

      // These colours need changing!
      switch (timer.state) {
      default:
      case 'running':
        this.textColor.color = 'white';
        break;
      case 'paused':
      case 'stopped':
        this.textColor.color = 'yellow';
        break;
      case 'finished':
        this.textColor.color = 'orange';
      }

      // Backup timer (see below).
      clearTimeout(this.backupTimerTO);
      this.backupTimerTO = setTimeout(this.backupTimer, 1000);
    },
    // Backup timer that takes over if the connection to the server is lost.
    // Based on the last timestamp that was received.
    // When the connection is restored, the server timer will recover and take over again.
    backupTimer() {
      this.backupTimerTO = setTimeout(this.backupTimer, 200);
      if (this.timer.value.state === 'running') {
        const missedTime = Date.now() - this.timer.value.timestamp;
        const timeOffset = this.timer.value.milliseconds + missedTime;
        this.time = this.msToDuration(timeOffset);
      }
    },
    msToDuration(ms) {
      const seconds = Math.floor((ms / 1000) % 60);
      const minutes = Math.floor((ms / (1000 * 60)) % 60);
      const hours = Math.floor(ms / (1000 * 60 * 60));

      const hoursStr = (hours < 10) ? `0${hours}` : `${hours}`;
      const minutesStr = (minutes < 10) ? `0${minutes}` : `${minutes}`;
      const secondsStr = (seconds < 10) ? `0${seconds}` : `${seconds}`;

      return `${hoursStr}:${minutesStr}:${secondsStr}`;
    },
  },
};
</script>

<style>
  @import url('./GameInfoBox.css');
  @import url('./FlexContainer.css');

  #TimerBox {
    font-weight: 500;
    margin-top: 5px;
    font-size: 100px;
    line-height: 90%;
    padding: 15px;
    padding-top: 8px; /* Numbers are strange and this makes it look better. */
    transition: 1s;
  }
</style>
