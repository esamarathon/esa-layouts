<template>
  <div v-if="show">
    <logo-dropdown
      @add-logo="addLogo"
    ></logo-dropdown>
    <br>
    <logo-settings
      v-for="(logo, index) in rotation"
      :key="`${index}${logo.seconds}${logo.sum}`"
      :data="logo"
      :index="index"
      @update-seconds="updateSeconds"
      @change-logo="changeLogo"
    ></logo-settings>
    <br>
    <button @click="clear">
      Clear
    </button>
    <button
      :disabled="disableSave"
      @click="save"
    >
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
      disableSave: false,
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
      this.disableSave = true;
      setTimeout(() => { this.disableSave = false; }, 2000);
    },
    addLogo(data) {
      this.rotation.push(data);
    },
    updateSeconds(index, seconds) {
      this.rotation[index].seconds = seconds;
    },
    changeLogo(index, action) {
      switch (action) {
      case 'del':
        this.rotation.splice(index, 1);
        break;
      case 'up':
        if (index <= 0) {
          break;
        } else {
          this.rotation.splice(index - 1, 0, this.rotation.splice(index, 1)[0]);
        }
        break;
      case 'down':
        if (index >= this.rotation.length - 1) {
          break;
        } else {
          this.rotation.splice(index + 1, 0, this.rotation.splice(index, 1)[0]);
        }
        break;
      default:
        break;
      }
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
