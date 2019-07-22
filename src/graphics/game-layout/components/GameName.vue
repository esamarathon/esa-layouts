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
import SpeedcontrolUtil from 'speedcontrol-util';

const sc = new SpeedcontrolUtil(nodecg);

export default {
  name: 'GameName',
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
  @import url('../../_misc/components/FlexContainer.css');

  #GameNameBox {
    font-weight: 500;
    font-size: 40px;
  }
</style>
