<template>
  <div class="d-flex">
    {{ donation.description }} - ${{ donation.amount }}
    - <v-checkbox class="ma-0 pa-0 ml-1" v-model="toggle" />
  </div>
</template>

<script lang="ts">
import MediaCard from '@esa-layouts/dashboard/_misc/components/MediaCard.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { storeModule } from '../store';

@Component({
  components: {
    MediaCard,
  },
})
export default class extends Vue {
  @Prop({ type: Object, required: true }) readonly donation!: {
    key: string,
    description: string,
    amount: number,
    active: boolean,
  };

  get toggle(): boolean {
    return this.donation.active;
  }
  set toggle(val: boolean) {
    storeModule.toggleItem({ key: this.donation.key, active: val });
    nodecg.sendMessage('additionalDonationToggle', { key: this.donation.key, active: val });
  }
}
</script>
