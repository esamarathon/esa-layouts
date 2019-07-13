<template>
  <div
    id="Ticker"
  >
    <transition
      name="fade"
      mode="out-in"
    >
      <component
        :is="currentComponent.name"
        :key="timestamp"
        :data="currentComponent.data"
        @end="showNextMsg"
      ></component>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue';
import SpeedcontrolUtil from 'speedcontrol-util';

import GenericMessage from './Ticker/GenericMessage.vue';
import UpcomingRun from './Ticker/UpcomingRun.vue';
import OtherStreamInfo from './Ticker/OtherStreamInfo.vue';

const evtShort = nodecg.Replicant('evtShort');
const otherStreamInfo = nodecg.Replicant('otherStreamInfo');
Vue.prototype.$sc = new SpeedcontrolUtil(nodecg);

export default {
  name: 'Ticker',
  data() {
    return {
      currentComponent: {
        name: '',
        data: {},
      },
      timestamp: Date.now(),
      otherChannel: nodecg.bundleConfig.tracker.streamEvent > 1 ? 'esa' : 'esamarathon2',
      messageTypes: [],
    };
  },
  mounted() {
    NodeCG.waitForReplicants(
      evtShort,
      otherStreamInfo,
      Vue.prototype.$sc.runDataActiveRun,
      Vue.prototype.$sc.runDataArray,
    ).then(() => {
      // Puts copies of the objects the functions return
      // into an array for easy random-ness access.
      this.messageTypes = [
        this.esaPromo(),
        this.charityPromo(),
        this.otherStreamPromo(),
        this.otherStreamInfo(),
        this.upcomingRun(),
        this.teamPromo(),
        this.donationURL(),
        this.shirts(),
      ];

      this.showNextMsg();
    });
  },
  methods: {
    showNextMsg() {
      const rand = this.messageTypes[Math.floor(Math.random() * this.messageTypes.length)];
      this.currentComponent = rand;
      this.timestamp = Date.now();
    },
    esaPromo() {
      return this.genericMsg('This is European Speedrunner Assembly Summer 2019');
    },
    charityPromo() {
      return this.genericMsg('#ESASummer19 benefits the Swedish Alzheimer\'s Foundation');
    },
    otherStreamPromo() {
      return this.genericMsg(`Watch more great runs over @ twitch.tv/${this.otherChannel}`);
    },
    otherStreamInfo() {
      return {
        name: OtherStreamInfo,
        data: {
          otherChannel: this.otherChannel,
        },
      };
    },
    upcomingRun() {
      return { name: UpcomingRun };
    },
    teamPromo() {
      return this.genericMsg('Check out our Twitch team @ twitch.tv/team/esa!');
    },
    donationURL() {
      return this.genericMsg(`Donate @ donations.esamarathon.com/donate/${evtShort.value}`);
    },
    shirts() {
      return this.genericMsg('Message about shirts TBD');
    },
    genericMsg(string) {
      return {
        name: GenericMessage,
        data: {
          msg: string,
        },
      };
    },
  },
};
</script>

<style scoped>
  @import url('../../_misc/components/FlexContainer.css');

  #Ticker {
    height: 100%;
    flex: 1;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
