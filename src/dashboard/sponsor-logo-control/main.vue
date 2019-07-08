<template>
  <div v-if="show">
    <logo-dropdown
      @add-logo="addLogo"
    ></logo-dropdown>
    <br>
    <logo-settings
      v-for="(logo, index) in rotation"
      :key="index"
      :data="logo"
      :index="index"
      @update-seconds="updateSeconds"
    ></logo-settings>
    <br>
    <button @click="clear">
      Clear
    </button>
    <button @click="save">
      Save
    </button>
  </div>
</template>

<script>
import clone from 'clone';
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
      show: false,
      rotation: [],
    };
  },
  mounted() {
    NodeCG.waitForReplicants(rotationRep).then(() => {
      this.rotation = clone(rotationRep.value);
      this.show = true;
    });
  },
  methods: {
    clear() {
      this.rotation = [];
    },
    save() {
      rotationRep.value = clone(this.rotation);
    },
    addLogo(data) {
      this.rotation.push(data);
    },
    updateSeconds(index, seconds) {
      this.rotation[index].seconds = seconds;
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
