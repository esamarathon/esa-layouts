<template>
  <div>
    <logo-dropdown></logo-dropdown>
    <br>
    <!-- eslint-disable -->
    <div ref="logoSettingsList"></div>
    <!-- eslint-enable -->
    <br>
    <button @click="debugClear">
      DEBUG CLEAR
    </button>
  </div>
</template>

<script>
import Vue from 'vue';
import LogoDropdown from './components/LogoDropdown.vue';
import LogoSettings from './components/LogoSettings.vue';

const rotation = nodecg.Replicant('sponsorLogoRotation');
const LogoSettingsClass = Vue.extend(LogoSettings);

export default {
  name: 'SponsorLogoControl',
  components: {
    LogoDropdown,
  },
  mounted() {
    rotation.on('change', (newVal) => {
      while (
        this.$refs.logoSettingsList.firstChild
        && this.$refs.logoSettingsList.removeChild(this.$refs.logoSettingsList.firstChild)
      );
      newVal.forEach((logo, index) => {
        this.addLogoSettings(logo, index);
      });
    });
  },
  methods: {
    debugClear() {
      rotation.value = [];
    },
    addLogoSettings(data, index) {
      const instance = new LogoSettingsClass({
        propsData: {
          index,
          data,
        },
      }).$mount();
      this.$refs.logoSettingsList.appendChild(instance.$el);
    },
  },
};
</script>

<style>
  .LogoSettings:nth-last-of-type(1) {
    border-bottom: solid 1px grey;
    padding: 5px;
  }
</style>
