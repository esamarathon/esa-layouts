<template>
  <transition-group
    id="DonationsBar"
    name="donations"
    tag="div"
    class="Flex"
  >
    <donation-box
      v-for="donation in donations"
      :key="donation._id"
      :name="donation.donor_visiblename"
      :amount="donation.amount"
    ></donation-box>
  </transition-group>
</template>

<script>
import DonationBox from './DonationBox.vue';

const recentDonations = nodecg.Replicant('recentDonations');

export default {
  name: 'DonationsBar',
  components: {
    DonationBox,
  },
  data() {
    return {
      donations: [],
    };
  },
  created() {
    recentDonations.on('change', (newVal) => {
      this.donations = newVal.slice(0);
    });
  },
};
</script>

<style scoped>
  #DonationsBar {
    background-color: rgba(0, 0, 0, 0.15);
    position: fixed;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    justify-content: flex-start;
  }

  #DonationsBar >>> .DonationBox:nth-of-type(n+2) {
    margin-left: 3px;
  }

  /* Put some fancy text behind donation bar. */
  #DonationsBar:after {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    content: "Donations";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    box-sizing: border-box;
    padding-right: 20px;
    font-size: 30px;
    color: grey;
  }

  .donations-enter-active {
    transition: all 1s;
  }
  .donations-enter, .donations-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  .donations-move {
    transition: transform 1s;
  }
</style>
