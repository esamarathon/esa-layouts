<template>
  <div
    v-if="show"
  >
    Current Video:
    <br>
    <select v-model="selected">
      <option
        v-for="(option, name) in options"
        :key="name"
        :value="name"
      >
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
const videos = nodecg.Replicant('assets:videos');
const current = nodecg.Replicant('currentVideoSum');

export default {
  name: 'VideoPlayerControl',
  data() {
    return {
      show: false,
      selected: '',
      options: {},
    };
  },
  watch: {
    selected(val) {
      current.value = val;
    },
  },
  mounted() {
    videos.on('change', (newVal) => {
      this.options = {};
      if (newVal && newVal.length) {
        this.show = true;
        newVal.forEach((video) => {
          this.options[video.sum] = video.name;
        });
      } else {
        this.show = false;
      }
    });

    current.on('change', (newVal) => {
      this.selected = newVal;
    });
  },
};
</script>

<style>
  select {
    width: 100%;
  }
</style>
