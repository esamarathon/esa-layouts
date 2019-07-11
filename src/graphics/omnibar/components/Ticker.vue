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
        @end="canChange = true"
      ></component>
    </transition>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import { serverBus } from '../main.js';
import GenericMessage from './Ticker/GenericMessage.vue';

const evtShort = nodecg.Replicant('evtShort');

export default {
  name: 'Ticker',
  data() {
    return {
      currentComponent: {
        name: '',
        data: {},
      },
      timestamp: Date.now(),
      canChange: false,
      messageTypes: [
        this.esaPromo(),
        this.charityPromo(),
        this.otherStreamPromo(),
        this.teamPromo(),
        this.donationURL(),
        this.shirts(),
      ],
    };
  },
  mounted() {
    serverBus.$on('tick', () => {
      if (this.canChange) {
        this.canChange = false;
        this.showNextMsg();
      }
    });

    this.showNextMsg();
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
      const channel = nodecg.bundleConfig.tracker.streamEvent > 1 ? 'esa' : 'esamarathon2';
      return this.genericMsg(`Watch more great runs over @ twitch.tv/${channel}`);
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
    flex: 1;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
