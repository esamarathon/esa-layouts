<template>
  <div
    class="Flex"
    :style="{
      width: '90px',
      'font-size': '35px',
    }"
  >
    {{ time }}
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

@Component
export default class extends Vue {
  time = '00:00';

  setTime(): void {
    const zone = nodecg.bundleConfig.event.theme?.startsWith('uksg')
      ? 'Europe/London'
      : 'Europe/Stockholm';
    this.time = dayjs().tz(zone).format('HH:mm');
  }

  created(): void {
    this.setTime();
    setInterval(() => { this.setTime(); }, 1000);
  }
}
</script>
