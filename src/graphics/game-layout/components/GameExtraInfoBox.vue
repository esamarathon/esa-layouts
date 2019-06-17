<template>
  <div
    v-if="show"
    id="GameExtraInfoBox"
    ref="name"
    class="GameInfoBox FlexContainer"
  >
    {{ name }}
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'GameExtraInfoBox',
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
        this.name = `${runData.category} / ${runData.system} / ${runData.estimate}`;
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

  #GameExtraInfoBox {
    font-size: 35px;
    background-color: cadetblue;
  }
</style>
