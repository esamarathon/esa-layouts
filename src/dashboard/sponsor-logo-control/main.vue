<template>
  <div v-if="show">
    <logo-dropdown
      @add-logo="addLogo"
    ></logo-dropdown>
    <br>
    <transition-group name="logo-list">
      <logo-settings
        v-for="(logo, index) in rotation"
        :key="`${logo.id}`"
        :info="logo"
        :index="index"
        @update-seconds="updateSeconds"
        @change-logo="changeLogo"
      ></logo-settings>
    </transition-group>
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
import uuid from 'uuid/v4';
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
      this.rotation.forEach((item) => {
        if (!item.id) {
          item.id = uuid(); // eslint-disable-line no-param-reassign
        }
      });
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
      const cloned = clone(data);
      cloned.id = uuid();
      this.rotation.push(cloned);
    },
    updateSeconds(index, seconds) {
      this.rotation[index].seconds = seconds;
    },
    changeLogo(item, action) {
      const index = this.rotation.indexOf(item);
      if (index < 0) return;
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

  .logo-list-move {
    transition: transform 0.2s;
  }

  .logo-list-enter, .logo-list-leave-to
  /* .logo-list-complete-leave-active below version 2.1.8 */ {
    opacity: 0;
    transition: transform 0.2s;
    transition: opacity 0.2s;
  }
  .logo-list-leave-active {
    position: absolute;
  }
</style>
