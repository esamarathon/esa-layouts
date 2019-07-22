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
import SpeedcontrolUtil from 'speedcontrol-util';

const sc = new SpeedcontrolUtil(nodecg);

export default {
  name: 'GameExtraInfo',
  data() {
    return {
      text: '',
      show: false,
    };
  },
  mounted() {
    sc.runDataActiveRun.on('change', this.updateData);
  },
  destroyed() {
    sc.runDataActiveRun.removeListener('change', this.updateData);
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
