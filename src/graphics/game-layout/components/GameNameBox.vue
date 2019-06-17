<template>
  <div
    v-if="show"
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
      show: false,
    };
  },
  mounted() {
    Vue.prototype.$sc.runDataActiveRun.on('change', (runData) => {
      if (runData) {
        this.show = true;
        this.name = runData.game;
      } else {
        this.show = false;
      }
    });
  },
};
</script>

<style>
  @import url('./GameInfoBox.css');
  @import url('./FlexContainer.css');

  #GameNameBox {
    font-weight: 500;
    margin-top: 5px;
    font-size: 40px;
  }
</style>
