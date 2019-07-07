<template>
  <div class="LogoSettings">
    <span>
      {{ data.name }}
    </span>
    <input
      v-model="seconds"
      class="Seconds"
      type="number"
    >
  </div>
</template>

<script>
export default {
  name: 'LogoDropdown',
  props: {
    index: {
      type: Number,
      default: 0,
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      seconds: this.data.seconds,
    };
  },
  watch: {
    seconds(val) {
      // seconds updated
    },
  },
};
</script>

<style scoped>
  .LogoSettings {
    border-top: solid 1px grey;
    padding: 5px;
  }

  .Seconds {
    width: 30px;
    float: right;
  }
</style>
