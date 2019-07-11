<template>
  <div
    id="GenericMessage"
    :style="cssProps"
  >
    {{ data.msg }}
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
        '--font-size': `${this.data.size}px`,
      };
    },
  },
  mounted() {
    // Removing 1 second so if time is divisble by 5, we don't need to wait ages for the next tick.
    setTimeout(() => this.$emit('end'), (this.data.time - 1) * 1000);
  },
};
</script>

<style scoped>
  @import url('../../../_misc/components/FlexContainer.css');

  #GenericMessage {
    font-size: var(--font-size);
    text-align: center;
  }
</style>
