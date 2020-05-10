<template>
  <transition-group
    tag="div"
    name="donations"
    class="Fixed Flex"
    :style="{
      'background-color': 'rgba(0, 0, 0, 0.15)',
      'justify-content': 'flex-start',
      'font-size': '30px',
    }"
  >
    <div
      v-for="donation in donations"
      :key="donation._id"
      class="Flex"
      :style="{
        height: '100%',
        padding: '0 15px',
        'margin-right': '3px',
        'background-color': 'var(--border-colour)',
      }"
    >
      ${{ Number.isInteger(donation.amount)
        ? donation.amount : donation.amount.toFixed(2)
      }} [{{ donation.donor_visiblename }}]
    </div>
  </transition-group>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { NotableDonations } from 'schemas';

@Component
export default class extends Vue {
  @State('notableDonations') donations!: NotableDonations;
</script>

<style scoped>
  /* Copied from old code, needs checking! */
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
