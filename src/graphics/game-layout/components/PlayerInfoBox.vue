<template>
  <div
    v-if="show"
    id="PlayerInfoBox"
    class="GameInfoBox FlexContainer"
  >
    {{ name }} <img :src="flag">
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'PlayerInfoBox',
  data() {
    return {
      name: '',
      flag: '/static/flags/gb.png',
      show: false,
    };
  },
  mounted() {
    Vue.prototype.$sc.runDataActiveRun.on('change', (runData) => {
      if (runData) {
        this.show = true;
        this.name = runData.teams[0].players[0].name;
        const { country } = runData.teams[0].players[0];
        this.flag = `/bundles/esa-layouts/static/flags/${country}.png`;
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

  #PlayerInfoBox {
    font-weight: 500;
    margin-top: 5px;
    font-size: 40px;
  }
</style>
