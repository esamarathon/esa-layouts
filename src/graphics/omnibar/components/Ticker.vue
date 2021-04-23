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
      />
    </transition>
  </div>
</template>

<script>
import GenericMessage from './Ticker/GenericMessage.vue';
import UpcomingRun from './Ticker/UpcomingRun.vue';
import OtherStreamInfo from './Ticker/OtherStreamInfo.vue';
import Prize from './Ticker/Prize.vue';
import Bid from './Ticker/Bid.vue';
import Alert from './Ticker/Alert.vue';

const otherStreamData = nodecg.Replicant('otherStreamData');
const runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
const runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
const bids = nodecg.Replicant('bids');
const prizes = nodecg.Replicant('prizes');

const newDonations = [];
const newSubs = [];
const newTweets = [];
const newCheers = [];
const newCrowdControlExchanges = [];

export default {
  name: 'Ticker',
  data() {
    return {
      currentComponent: {
        name: '',
        data: {},
      },
      timestamp: Date.now(),
      otherChannel: nodecg.bundleConfig.event.thisEvent > 1 ? 'esa' : 'esamarathon2',
      messageTypes: [],
    };
  },
  mounted() {
    NodeCG.waitForReplicants(
      otherStreamData,
      runDataActiveRun,
      runDataArray,
      bids,
      prizes,
    ).then(() => {
      // nodecg.listenFor('newSub', data => newSubs.push(data));
      nodecg.listenFor('newTweet', (data) => newTweets.push(data));
      // nodecg.listenFor('newDonation', data => newDonations.push(data));
      // nodecg.listenFor('newCheer', data => newCheers.push(data));
      nodecg.listenFor('newCrowdControl', (data) => newCrowdControlExchanges.push(data));

      // Puts copies of the objects the functions return
      // into an array for easy random-ness access.
      this.messageTypes = [
        this.esaPromo(),
        this.charityPromo(),
        // this.otherStreamPromo(),
        // this.otherStreamInfo(),
        this.upcomingRun(),
        this.prize(),
        this.bid(),
        this.teamPromo(),
        this.donationURL(),
        // this.esaUpcomingEvt(),
        this.esaBtRL(),
        // this.merch(),
        // this.ticket(),
        // this.twitchCharity(),
      ];

      this.showNextMsg();
    });
  },
  methods: {
    showNextMsg() {
      let currentComponent;
      if (newCrowdControlExchanges.length) {
        currentComponent = this.crowdControl(newCrowdControlExchanges[0]);
        newCrowdControlExchanges.shift();
      } else if (newDonations.length) {
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
      return this.genericMsg('This is United Kingdom Speedrunner Gathering Spring 2021');
    },
    charityPromo() {
      return this.genericMsg('#UKSGSpring2021 benefits Crisis');
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
      return this.genericMsg('Check out our Twitch team @ twitch.tv/team/esa');
    },
    donationURL() {
      return this.genericMsg(`Donate @ ${nodecg.bundleConfig.tracker.address}`);
    },
    merch() {
      return this.genericMsg('Check out our merch @ esamarathon.com/esa-store');
    },
    ticket() {
      return this.genericMsg('Buy your supporter ticket @ esamarathon.com');
    },
    twitchCharity() {
      return this.genericMsg('Subscribe or cheer to support the charity');
    },
    esaUpcomingEvt() {
      return this.genericMsg('Can\'t get enough of speedrunning? Then look forward to ESA Winter 2021: 13th - 21st February');
    },
    esaBtRL() {
      return this.genericMsg('ESA Break the Record: LIVE - Minecraft, 30th April - 2nd May! - breaktherecordlive.com');
    },
    crowdControl(exchange) {
      const line1 = 'Crowd Control';
      const line2 = exchange.message.trailing;
      return this.alert(line1, line2, false, true);
    },
    donation(donation) {
      const line1 = `New Donation: ${donation.donor_visiblename} (${this.formatUSD(parseFloat(donation.amount))})`;
      const line2 = donation.comment;
      return this.alert(line1, line2);
    },
    sub(subData) {
      const systemMsg = subData.message.tags['system-msg'].replace(/\\s/g, ' ');
      const line1 = systemMsg;
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
      message = (message) ? message.replace(/\s\s+|\n/g, ' ') : undefined;

      // Regex removes Twitter URL shortener links.
      message = message.replace(/https:\/\/t\.co\/\w+/g, (match) => {
        if (tweetData.message.entities && tweetData.message.entities.urls && tweetData.message.entities.urls.length > 0) {
          const replacementUrl = tweetData.message.entities.urls.find((urlInfo) => urlInfo.url === match);
          if (replacementUrl) return replacementUrl.display_url;
        }
        return '';
      });

      const line1 = tweetData.user.name;
      const line2 = message;
      return this.alert(line1, line2, true);
    },
    alert(line1Text, line2Text, isTweet, isCrowdControl) {
      return {
        name: Alert,
        data: {
          line1Text,
          line2Text,
          isTweet,
          isCrowdControl,
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
  },
};
</script>

<style scoped>
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
