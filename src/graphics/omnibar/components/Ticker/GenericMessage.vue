<template>
  <div
    id="GenericMessage"
    class="Flex"
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
      return { size: 33,
        time: 25,
        ...this.data };
    },
  },
  mounted() {
    console.log('GenericMessage: mounted');
    setTimeout(() => {
      this.$emit('end'); console.log('GenericMessage: ended');
    }, this.normalisedData.time * 1000);
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
