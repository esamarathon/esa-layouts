<template>
  <div
    v-if="show"
    id="GameNameBox"
    class="RunInfoBox FlexContainer"
  >
    {{ text }}
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'GameName',
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
        this.text = runData.game;
      } else {
        this.show = false;
      }
    },
  },
};
</script>

<style scoped>
  @import url('./RunInfoBox.css');
  @import url('./FlexContainer.css');

  #GameNameBox {
    font-weight: 500;
    margin-top: 5px;
    font-size: 40px;
    height: 80px;
  }
</style>
