<template>
  <div class="LogoSettings">
    <button @click="del">
      ☓
    </button>
    <button @click="up">
      ▲
    </button>
    <button @click="down">
      ▼
    </button>
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
  name: 'LogoSettings',
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
      this.$emit('update-seconds', this.index, val);
    },
  },
  methods: {
    del() {
      this.$emit('change-logo', this.index, 'del');
    },
    up() {
      this.$emit('change-logo', this.index, 'up');
    },
    down() {
      this.$emit('change-logo', this.index, 'down');
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
