<template>
  <div
    id="DonationsBar"
    class="FlexContainer"
  >
    <!--<div class="Header FlexContainer">
      Donations
    </div>-->
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
    const names = ['zoton2', 'Edenal', 'Ladaur', 'AuraBorea', 'Maral', 'trollbear', 'Planks', 'English_Ben', 'RebelDragon95', 'KrazyRasmus'];
    // setInterval(() => { this.addDonation('zoton2', 5); }, 2000);
    for (let i = 0; i < 20; i += 1) {
      const name = names[Math.floor(Math.random() * names.length)];
      const amount = 20 + Math.floor(Math.random() * 80) + 10;
      this.addDonation(name, amount);
    }
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
  @import url('../../_misc/components/FlexContainer.css');

  #DonationsBar {
    box-sizing: border-box;
    position: fixed;
    justify-content: flex-start;
  }

  #DonationsBar > .Header {
    font-size: 28px;
    background-color: var(--border-colour);
    color: var(--font-colour-inverted);
    height: 100%;
    text-align: center;
    line-height: 100%;
    padding: 0 15px;
    margin-right: 3px;
  }

  #DonationsBar > #DonationsContainer {
    height: 100%;
    white-space: nowrap;
    overflow: hidden;
    justify-content: flex-start;
  }

  #DonationsBar >>> .DonationBox:nth-of-type(n+2) {
    margin-left: 3px;
  }
</style>
