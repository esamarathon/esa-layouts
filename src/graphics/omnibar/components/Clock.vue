<template>
  <div
    id="Clock"
    class="Flex"
  >
    {{ time }}
  </div>
</template>

<script>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default {
  name: 'Clock',
  data() {
    return {
      time: '00:00',
    };
  },
  created() {
    this.setTime();
    setInterval(() => { this.setTime(); }, 1000);
  },
  methods: {
    setTime() {
      const zone = nodecg.bundleConfig.event.theme?.startsWith('uksg')
        ? 'Europe/London'
        : 'Europe/Stockholm';
      this.time = dayjs().tz(zone).format('HH:mm');
    },
    pad(num) {
      return num.toString().padStart(2, '0');
    },
  },
};
</script>

<style scoped>
  #Clock {
    font-size: 35px;
    width: 90px;
  }
</style>
