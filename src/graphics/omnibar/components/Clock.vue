<template>
  <div
    id="Clock"
    class="Flex"
  >
    {{ time }}
  </div>
</template>

<script>
export default {
  name: 'Clock',
  data() {
    return {
      time: '00:00',
    };
  },
  created() {
    this.setTime();
    setInterval(this.setTime, 1000);
  },
  methods: {
    setTime() {
      const today = new Date();
      this.time = `${this.pad(today.getHours())}:${this.pad(today.getMinutes())}`;
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
