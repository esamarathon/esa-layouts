<template>
  <v-app>
    <div
      v-if="!options.length"
    >
      <em>"Game Layout" graphic must be open.</em>
    </div>
    <div v-else>
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
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'GameLayoutOverride',
  computed: {
    selected: {
      get() {
        return this.$store.state.currentLayout;
      },
      set(val) {
        this.$store.commit('updateCurrentLayout', val);
      },
    },
    layouts() {
      return this.$store.state.layouts;
    },
    options() {
      const opts = [];
      if (this.layouts && this.layouts.length) {
        this.layouts.forEach((layout) => {
          if (layout.name) {
            opts.push({
              value: layout.path,
              text: layout.name,
            });
          }
        });
      }
      return opts;
    },
  },
};
</script>
