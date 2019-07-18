<template>
  <div
    id="Alerts"
    class="FlexContainer"
  >
    Soom™
  </div>
</template>

<script>
export default {
  name: 'Alerts',
  props: {
    data: {
      type: Object,
      default() {
        return {
          time: 25,
        };
      },
    },
  },
  computed: {
    normalisedData() {
      return Object.assign({
        time: 25,
      }, this.data);
    },
  },
  mounted() {
    setTimeout(() => this.$emit('end'), this.normalisedData.time * 1000);
  },
};
</script>

<style scoped>
  @import url('../../../_misc/components/FlexContainer.css');

  #Alerts {
    height: 100%;
    font-weight: 500;
    font-size: 30px;
    text-align: center;
    background-color: #ffffff38;
  }
</style>
