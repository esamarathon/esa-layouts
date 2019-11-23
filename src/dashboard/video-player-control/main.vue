<template>
  <v-app>
    <v-radio-group
      v-model="selected"
      hide-details
      class="pa-0 ma-0"
    >
      <v-radio
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        :label="opt.text"
      ></v-radio>
    </v-radio-group>
  </v-app>
</template>

<script>
export default {
  name: 'VideoPlayerControl',
  computed: {
    selected: {
      get() {
        return this.$store.state.currentVideoSum;
      },
      set(val) {
        this.$store.commit('updateCurrentVideoSum', val);
      },
    },
    videos() {
      return this.$store.state['assets:videos'];
    },
    options() {
      const opts = [];
      if (this.videos && this.videos.length) {
        this.videos.forEach((video) => {
          opts.push({
            value: video.sum,
            text: video.name,
          });
        });
      }
      return opts;
    },
  },
};
</script>
