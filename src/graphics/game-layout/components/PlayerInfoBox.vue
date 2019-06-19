<template>
  <div
    v-if="show"
    id="PlayerInfoBox"
    class="GameInfoBox FlexContainer"
  >
    {{ name }}
    <img
      v-if="showFlag"
      class="flag"
      :src="`/bundles/esa-layouts/static/flags/${country}.png`"
    >
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
      showFlag: true,
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
        const { country } = runData.teams[0].players[0];
        if (country) {
          this.country = country;
          this.showFlag = true;
        } else {
          this.showFlag = false;
        }
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

  #PlayerInfoBox > .flag {
    padding-left: 10px;
    height: 100%; /* Same height as box depending on font size. */
  }
</style>
