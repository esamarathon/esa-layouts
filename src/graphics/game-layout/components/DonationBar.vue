<template>
  <transition-group
    tag="div"
    name="donations"
    class="Fixed Flex DonationBar"
    :style="{
      'justify-content': 'flex-start',
      'font-size': '30px',
    }"
  >
    <donation-box
      v-for="donation in donations"
      :key="donation._id"
      :donation="donation"
      :padding="padding"
    />
  </transition-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { NotableDonations } from '@esa-layouts/types/schemas';
import DonationBox from './DonationBar/DonationBox.vue';

@Component({
  components: {
    DonationBox,
  },
})
export default class extends Vue {
  @State('notableDonations') donations!: NotableDonations;
  @Prop(Number) padding!: number;
}
</script>

<style scoped>
  .donations-enter-active {
    transition: all 1s;
  }
  .donations-enter, .donations-leave-to {
    opacity: 0;
    transform: translateY(100%);
  }
  .donations-move {
    transition: transform 1s;
  }
</style>
