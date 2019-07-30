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
      {{ info.name }}
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
    info: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      seconds: this.info.seconds,
    };
  },
  watch: {
    seconds(val) {
      this.$emit('update-seconds', this.index, val);
    },
  },
  methods: {
    del() {
      this.$emit('change-logo', this.info, 'del');
    },
    up() {
      this.$emit('change-logo', this.info, 'up');
    },
    down() {
      this.$emit('change-logo', this.info, 'down');
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
    width: 50px;
    float: right;
  }
</style>
