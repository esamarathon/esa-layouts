<template>
  <div
    v-if="show"
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
const currentLayout = nodecg.Replicant('currentLayout');
const layouts = nodecg.Replicant('layouts');
const overridden = nodecg.Replicant('currentLayoutOverridden');

export default {
  name: 'GameLayoutOverride',
  data() {
    return {
      show: false,
      selected: '',
      options: {},
    };
  },
  watch: {
    selected(newVal, oldVal) {
      // Only set if value is actually different than what we have.
      if (newVal !== currentLayout.value && oldVal && newVal !== oldVal) {
        overridden.value = true;
        currentLayout.value = newVal;
      }
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
