<template>
  <div
    id="GenericMessage"
    :style="cssProps"
  >
    {{ normalisedData.msg }}
  </div>
</template>

<script>
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
      return Object.assign({
        size: 33,
        time: 25,
      }, this.data);
    },
  },
  mounted() {
    // Removing 1 second so if time is divisble by 5, we don't need to wait ages for the next tick.
    setTimeout(() => this.$emit('end'), (this.normalisedData.time - 1) * 1000);
  },
};
</script>

<style scoped>
  @import url('../../../_misc/components/FlexContainer.css');

  #GenericMessage {
    font-weight: 500;
    font-size: var(--font-size);
    text-align: center;
  }
</style>
