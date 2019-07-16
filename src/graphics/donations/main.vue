<template>
  <div>
    <h1>Unread Donations</h1>
    <div
      id="None"
      v-if="!donations.length"
    >
      None right now!
    </div>
    <donation
      v-for="(donation, index) in donations"
      :key="donation.id"
      :data="donation"
      :index="index"
    ></donation>
  </div>
</template>

<script>
import Donation from './components/Donation.vue';

const donationsToRead = nodecg.Replicant('donationsToRead');

export default {
  name: 'Donations',
  components: {
    Donation,
  },
  data() {
    return {
      donations: [],
    };
  },
  mounted() {
    donationsToRead.on('change', (newVal) => {
      this.donations = newVal.slice(0, 3);
    });
  },
};
</script>


<style>
  @import url('https://fonts.googleapis.com/css?family=Montserrat:600&subset=cyrillic,cyrillic-ext,latin-ext,vietnamese');

  body {
    font-family: 'Montserrat', sans-serif;
    background-color: #212121;
    color: white;
    overflow: hidden;
    text-align: center;
  }

  #None {
    font-size: 30px;
    font-style: italic;
  }
</style>
