<template>
  <div
    v-if="show"
    id="PlayerInfoBox"
    class="GameInfoBox FlexContainer"
  >
    {{ name }} <img :src="`/bundles/esa-layouts/static/flags/${country}.png`">
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'PlayerInfoBox',
  data() {
    return {
      name: '',
      country: 'gb',
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
        this.name = runData.teams[0].players[0].name;
        this.country = runData.teams[0].players[0].country;
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

  #PlayerInfoBox {
    font-weight: 500;
    margin-top: 5px;
    font-size: 40px;
  }
</style>
