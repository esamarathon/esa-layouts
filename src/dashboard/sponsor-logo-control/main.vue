<template>
  <div>
    <logo-dropdown></logo-dropdown>
    <br>
    <logo-settings
      v-for="(logo, index) in rotation"
      :key="logo.sum"
      :data="logo"
      :index="index"
    ></logo-settings>
    <br>
    <button @click="debugClear">
      DEBUG CLEAR
    </button>
  </div>
</template>

<script>
import LogoDropdown from './components/LogoDropdown.vue';
import LogoSettings from './components/LogoSettings.vue';

const rotationRep = nodecg.Replicant('sponsorLogoRotation');

export default {
  name: 'SponsorLogoControl',
  components: {
    LogoDropdown,
    LogoSettings,
  },
  data() {
    return {
      rotation: [],
    };
  },
  mounted() {
    rotationRep.on('change', (newVal) => {
      this.rotation = newVal.slice(0);
    });
  },
  methods: {
    debugClear() {
      nodecg.sendMessage('clearSponsorLogoRotation');
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
