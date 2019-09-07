<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="show"
    id="TimerBox"
    class="RunInfoBox FlexContainer"
    :style="textColor"
    v-html="time"
  />
  <!-- eslint-enable -->
</template>

<script>
export default {
  name: 'Timer',
  data() {
    return {
      show: false,
      time: '',
      timer: nodecg.Replicant('timer', 'nodecg-speedcontrol'),
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
      this.time = this.splitStringToSpans(timer.time);

      switch (timer.state) {
      default:
      case 'running':
        this.textColor.color = getComputedStyle(document.documentElement).getPropertyValue('--timer-colour');
        break;
      case 'paused':
      case 'stopped':
        this.textColor.color = getComputedStyle(document.documentElement).getPropertyValue('--timer-paused-colour');
        break;
      case 'finished':
        this.textColor.color = getComputedStyle(document.documentElement).getPropertyValue('--timer-finish-colour');
      }

      // Backup timer (see below).
      clearTimeout(this.backupTimerTO);
      this.backupTimerTO = setTimeout(this.backupTimer, 1000);
    },
    splitStringToSpans(string) {
      return string.replace(/\S/g, '<span>$&</span>');
    },
    // Backup timer that takes over if the connection to the server is lost.
    // Based on the last timestamp that was received.
    // When the connection is restored, the server timer will recover and take over again.
    backupTimer() {
      this.backupTimerTO = setTimeout(this.backupTimer, 200);
      if (this.timer.value.state === 'running') {
        const missedTime = Date.now() - this.timer.value.timestamp;
        const timeOffset = this.timer.value.milliseconds + missedTime;
        this.time = this.splitStringToSpans(this.msToDuration(timeOffset));
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

<style scoped>
  @import url('./RunInfoBox.css');
  @import url('../../_misc/components/FlexContainer.css');

  #TimerBox {
    font-weight: 500;
    font-size: 100px;
    transition: 1s;
  }

  /* Each character in the timer is in a span; setting width so the numbers appear monospaced. */
  #TimerBox >>> span {
    display: inline-block;
    width: 0.45em;
    text-align: center;
  }
  #TimerBox >>> span:nth-of-type(3), #TimerBox >>> span:nth-of-type(6) {
    width: 0.22em;
    margin-top: -0.15em; /* Make the colon appear more towards the centre. */
  }
</style>
