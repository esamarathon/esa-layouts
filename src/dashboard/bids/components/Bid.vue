<template>
  <media-card
    class="d-flex align-center px-2"
    :style="{ 'text-align': 'unset', height: '40px', 'margin-top': index > 0 ? '10px' : 0 }"
  >
    <div class="flex-grow-1">{{ bid.game }} - {{ bid.name }}</div>
    <v-icon @click="pin">
      <template v-if="isPinned">mdi-pin-off</template>
      <template v-else>mdi-pin</template>
    </v-icon>
  </media-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import MediaCard from '@esa-layouts/dashboard/_misc/components/MediaCard.vue';
import { Bids, OmnibarPin } from '@esa-layouts/types/schemas';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { storeModule } from '../store';

@Component({
  components: {
    MediaCard,
  },
})
export default class extends Vue {
  @Prop({ type: Object, required: true }) readonly bid!: Bids[0];
  @Prop({ type: Number, required: true }) readonly index!: number;
  @replicantNS.State((s) => s.reps.omnibarPin) readonly currentPin!: OmnibarPin;

  get isPinned(): boolean {
    return this.currentPin?.type === 'bid' && this.currentPin.id === this.bid.id;
  }

  pin(): void {
    storeModule.pinItem({ id: this.bid.id, pinned: !this.isPinned });
  }
}
</script>
