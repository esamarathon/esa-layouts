<template>
  <div
      v-show="show"
	  id="Countdown"
	 >
	<div
		id="CountdownHeader"
	>
		Marathon starts in...
	</div>
    <div
      id="CountdownText"
    >
      <span v-if="hours">{{ pad(hours) }}:</span><span v-if="minutes">{{ pad(minutes) }}</span><span v-else>00</span>:<span v-if="seconds">{{ pad(seconds) }}</span><span v-else>00</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Countdown',
  data() {
    return {
      endTime: 1563626700,
      show: true,
      hours: '',
      minutes: '',
      seconds: '',
    };
  },
  created() {
    this.setTime();
    setInterval(this.setTime, 1000);
  },
  methods: {
    setTime() {
      const currentTime = Math.floor(Date.now() / 1000);
      const diff = this.endTime - currentTime;
      if (diff <= 0) {
        this.show = false;
        return;
      }
      const today = new Date(diff * 1000);
      this.hours = (today.getHours() - 1 > 0) ? today.getHours() - 1 : '';
      this.minutes = (today.getMinutes() > 0) ? today.getMinutes() : '';
      this.seconds = (today.getSeconds() > 0) ? today.getSeconds() : '';
    },
    pad(num) {
      return num.toString().padStart(2, '0');
    },
  },
};
</script>

<style>
  body {
    width: 100%;
    height: 100vh;
  }
  
  #Countdown {
    display: flex;
	flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  
   #CountdownHeader {
	font-size: 12vw;
  }
  
  #CountdownText {
	font-size: 30vw;
  }
</style>
