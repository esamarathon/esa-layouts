<template>
  <div
    id="TimerBox"
    class="GameInfoBox FlexContainer"
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
      time: '',
    };
  },
  mounted() {
    Vue.prototype.$sc.timer.on('change', (timer) => {
      this.time = timer.time;
    });
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
  }
</style>
