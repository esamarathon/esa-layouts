<template>
  <div
    v-if="show"
    id="GameExtraInfoBox"
    class="RunInfoBox FlexContainer"
  >
    {{ text }}
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'GameExtraInfo',
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

<style scoped>
  @import url('./RunInfoBox.css');
  @import url('../../_misc/components/FlexContainer.css');

  #GameExtraInfoBox {
    font-size: 35px;
    color: var(--font-colour-secondary);
  }
</style>
