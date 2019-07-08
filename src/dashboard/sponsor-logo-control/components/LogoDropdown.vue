<template>
  <div v-if="show">
    <select v-model="selected">
      <option
        :value="null"
        disabled
      >
        Select an image file and click "Add"...
      </option>
      <option
        v-for="(option, name) in options"
        :key="name"
        :value="name"
      >
        {{ option }}
      </option>
    </select>
    <button @click="add">
      Add
    </button>
  </div>
</template>

<script>
import clone from 'clone';

const logos = nodecg.Replicant('assets:sponsor-logos');

export default {
  name: 'LogoDropdown',
  data() {
    return {
      show: false,
      options: {},
      selected: null,
    };
  },
  mounted() {
    // Populates the dropdown when the layout list changes.
    logos.on('change', (newVal) => {
      this.options = {};
      if (newVal && newVal.length) {
        newVal.forEach((logo) => {
          this.options[logo.sum] = logo.name;
        });
      }
    });

    this.show = true;
  },
  methods: {
    add() {
      if (this.selected) {
        const logoData = this.getDataBySum(this.selected);
        logoData.seconds = 60;
        this.$emit('add-logo', logoData);
      }
    },
    getDataBySum(sum) {
      let data;
      logos.value.forEach((logo) => {
        if (logo.sum === sum) {
          data = logo;
        }
      });
      if (data) {
        data = clone(data);
      }
      return data;
    },
  },
};
</script>
