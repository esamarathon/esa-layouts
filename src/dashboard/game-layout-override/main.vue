<template>
  <div
    v-if="show"
    id="App"
  >
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
const currentLayout = nodecg.Replicant('currentLayout', { persistent: false });
const layouts = nodecg.Replicant('layouts', { persistent: false });

export default {
  name: 'App',
  data() {
    return {
      show: false,
      selected: '',
      options: {},
    };
  },
  watch: {
    selected(val) {
      currentLayout.value = val;
    },
  },
  mounted() {
    // Populates the dropdown when the layout list changes.
    layouts.on('change', (newVal) => {
      this.options = {};
      if (newVal && newVal.length) {
        this.show = true;
        newVal.forEach((layout) => {
          if (layout.name) {
            this.options[layout.path] = layout.name;
          }
        });
      } else {
        this.show = false;
      }
    });

    // Changes the selected option if the layout has been changed.
    currentLayout.on('change', (newVal) => {
      this.selected = newVal;
    });
  },
};
</script>
