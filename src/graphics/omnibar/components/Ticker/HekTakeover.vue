<template>
  <div
    id="GenericMessage"
    class="Flex"
    :style="cssProps"
  >
    You are currently watching the Hekathon takeover block
  </div>
</template>

<script>
const runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');

export default {
  name: 'GenericMessage',
  props: {
    data: {
      type: Object,
      default() {
        return {
          msg: '',
          size: 33,
          time: 25,
        };
      },
    },
  },
  computed: {
    cssProps() {
      return {
        '--font-size': `${this.normalisedData.size}px`,
      };
    },
    normalisedData() {
      return { size: 33,
        time: 25,
        ...this.data };
    },
  },
  mounted() {
    if (!runDataActiveRun.value || runDataActiveRun.value.customData.info !== 'HEK') {
      this.$emit('end');
    } else {
      setTimeout(() => this.$emit('end'), this.normalisedData.time * 1000);
    }
  },
};
</script>

<style scoped>
  #GenericMessage {
    height: 100%;
    font-weight: 500;
    font-size: var(--font-size);
    text-align: center;
  }
</style>
