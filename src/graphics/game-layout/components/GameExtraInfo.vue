<template>
  <div
    v-if="show"
    id="GameExtraInfoBox"
    class="RunInfoBox Flex"
  >
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'GameExtraInfo',
  data() {
    return {
      text: '',
      show: false,
    };
  },
  mounted() {
    nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol')
      .on('change', this.updateData);
  },
  destroyed() {
    nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol')
      .removeListener('change', this.updateData);
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

  #GameExtraInfoBox {
    font-size: 35px;
    color: var(--font-colour-secondary);
  }
</style>
