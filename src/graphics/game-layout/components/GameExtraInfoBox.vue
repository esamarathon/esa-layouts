<template>
  <div
    v-if="show"
    id="GameExtraInfoBox"
    class="GameInfoBox FlexContainer"
  >
    {{ text }}
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'GameExtraInfoBox',
  data() {
    return {
      text: '',
      show: false,
    };
  },
  mounted() {
    Vue.prototype.$sc.runDataActiveRun.on('change', this.updateData);
  },
  destroyed() {
    Vue.prototype.$sc.runDataActiveRun.removeListener('change', this.updateData);
  },
  methods: {
    updateData(runData) {
      if (runData) {
        this.show = true;
        this.text = `${runData.category} / ${runData.system} / ${runData.estimate}`;
      } else {
        this.show = false;
      }
    },
  },
};
</script>

<style>
  @import url('./GameInfoBox.css');
  @import url('./FlexContainer.css');

  #GameExtraInfoBox {
    font-size: 35px;
    background-color: cadetblue;
  }
</style>
