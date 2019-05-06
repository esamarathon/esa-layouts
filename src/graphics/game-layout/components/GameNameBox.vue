<template>
  <div
    id="GameNameBox"
    class="GameInfoBox FlexContainer"
  >
    {{ name }}
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'GameNameBox',
  data() {
    return {
      name: '',
    };
  },
  mounted() {
    Vue.prototype.$sc.runDataActiveRun.on('change', (runData) => {
      if (runData) {
        this.name = runData.game;
      }
    });
  },
};
</script>

<style>
  @import url('./GameInfoBox.css');
  @import url('./FlexContainer.css');

  #GameNameBox {
    min-height: 100px;
    font-size: 35px;
  }
</style>
