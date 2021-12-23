<template>
  <div
    v-if="show"
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
    show() {
      return runDataActiveRun.value && runDataActiveRun.value.customData.info === 'HEK';
    },
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
    console.log('HekTakeover: mounted');
    if (!runDataActiveRun.value || runDataActiveRun.value.customData.info !== 'HEK') {
      console.log('HekTakeover: skipping');
      this.$emit('end');
    } else {
      setTimeout(() => {
        this.$emit('end'); console.log('HekTakeover: ended');
      }, this.normalisedData.time * 1000);
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
