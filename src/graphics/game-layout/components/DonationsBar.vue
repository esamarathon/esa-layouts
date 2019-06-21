<template>
  <div
    id="DonationsBar"
    class="FlexContainer"
  >
    <div class="Header FlexContainer">
      Latest<br>Donations
    </div>
    <div
      id="DonationsContainer"
      ref="DonationsContainer"
      class="FlexContainer"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import DonationBox from './DonationBox.vue';

const DonationBoxClass = Vue.extend(DonationBox);

export default {
  name: 'DonationsBar',
  mounted() {
    // fake donations coming in for testing
    // setInterval(() => { this.addDonation('zoton2', 5); }, 2000);
  },
  methods: {
    addDonation(name, amount) {
      const instance = new DonationBoxClass({
        propsData: {
          name,
          amount,
        },
      }).$mount();
      this.$refs.DonationsContainer.prepend(instance.$el);
    },
  },
};
</script>

<style scoped>
  @import url('./FlexContainer.css');

  #DonationsBar {
    position: fixed;
    justify-content: flex-start;
  }

  #DonationsBar > .Header {
    font-size: 24px;
    background-color: indigo;
    height: 100%;
    text-align: center;
    line-height: 100%;
    padding: 0 15px;
    border-left: 3px solid white;
  }

  #DonationsBar > #DonationsContainer {
    height: 100%;
    white-space: nowrap;
    overflow: hidden;
    justify-content: flex-start;
  }
</style>
