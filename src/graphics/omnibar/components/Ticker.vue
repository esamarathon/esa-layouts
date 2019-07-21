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
import Prize from './Ticker/Prize.vue';
import Bid from './Ticker/Bid.vue';
import Alert from './Ticker/Alert.vue';

const evtShort = nodecg.Replicant('evtShort');
const otherStreamInfo = nodecg.Replicant('otherStreamInfo');
Vue.prototype.$sc = new SpeedcontrolUtil(nodecg);

const newDonations = [];
const newSubs = [];
const newTweets = [];
const newCheers = [];
const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

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
      nodecg.listenFor('newSub', data => newSubs.push(data));
      nodecg.listenFor('newTweet', data => newTweets.push(data));
      nodecg.listenFor('newDonation', data => newDonations.push(data));
      nodecg.listenFor('newCheer', data => newCheers.push(data));

      // Puts copies of the objects the functions return
      // into an array for easy random-ness access.
      this.messageTypes = [
        this.esaPromo(),
        this.charityPromo(),
        this.otherStreamPromo(),
        this.otherStreamInfo(),
        this.upcomingRun(),
        this.prize(),
        this.bid(),
        this.teamPromo(),
        this.donationURL(),
        this.shirts(),
        this.twitchCharity(),
      ];

      this.showNextMsg();
    });
  },
  methods: {
    showNextMsg() {
      let currentComponent;
      if (newDonations.length) {
        currentComponent = this.donation(newDonations[0]);
        newDonations.shift();
      } else if (newSubs.length) {
        currentComponent = this.sub(newSubs[0]);
        newSubs.shift();
      } else if (newCheers.length) {
        currentComponent = this.cheer(newCheers[0]);
        newCheers.shift();
      } else if (newTweets.length) {
        currentComponent = this.tweet(newTweets[0]);
        newTweets.shift();
      } else {
        currentComponent = this.messageTypes[Math.floor(Math.random() * this.messageTypes.length)];
      }
      this.currentComponent = currentComponent;
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
    prize() {
      return { name: Prize };
    },
    bid() {
      return { name: Bid };
    },
    teamPromo() {
      return this.genericMsg('Check out our Twitch team @ twitch.tv/team/esa!');
    },
    donationURL() {
      return this.genericMsg(`Donate @ donations.esamarathon.com/donate/${evtShort.value}`);
    },
    shirts() {
      return this.genericMsg('Check out our Yetee shirts @ theyetee.com/esa!');
    },
    twitchCharity() {
      return this.genericMsg('Subscribe or cheer to support the charity.');
    },
    donation(donation) {
      const line1 = `New Donation: ${donation.donor_visiblename} (${this.formatUSD(parseFloat(donation.amount))})`;
      const line2 = donation.comment;
      return this.alert(line1, line2);
    },
    sub(subData) {
      const systemMsg = subData.message.tags['system-msg'].replace(/\\s/g, ' ');
      const line1 = this.escapeHtml(systemMsg);
      const line2 = subData.message.trailing;
      return this.alert(line1, line2);
    },
    cheer(cheerData) {
      const line1 = `${cheerData.message.tags['display-name']} just cheered ${cheerData.message.tags.bits} bits!`;
      const line2 = cheerData.message.trailing;
      return this.alert(line1, line2);
    },
    tweet(tweetData) {
      // Regex removes multiple spaces/newlines from tweets.
      let message = tweetData.message.full_text;
      message = (message && message !== '') ? message.replace(/\s\s+|\n/g, ' ') : undefined;

      // Regex removes Twitter URL shortener links.
      message = message.replace(/https:\/\/t\.co\/\w+/g, (match) => {
        if (tweetData.message.entities && tweetData.message.entities.urls && tweetData.message.entities.urls.length > 0) {
          const replacementUrl = tweetData.message.entities.urls.find(urlInfo => urlInfo.url === match);
          if (replacementUrl) return replacementUrl.display_url;
        }
        return '';
      });

      const line1 = this.escapeHtml(tweetData.user.name);
      const line2 = message;
      return this.alert(line1, line2);
    },
    alert(line1Text, line2Text) {
      // const line2Checked = (line2Text) ? this.escapeHtml(line2Text.replace(/\s\s+|\n/g, ' ')) : undefined;

      return {
        name: Alert,
        data: {
          line1Text,
          line2Text,
        },
      };
    },
    genericMsg(string) {
      return {
        name: GenericMessage,
        data: {
          msg: string,
        },
      };
    },
    formatUSD(amount) {
      return `$${amount.toFixed(2)}`;
    },
    escapeHtml(string) {
      return String(string).replace(/[&<>"'`=/]/g, s => entityMap[s]);
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
