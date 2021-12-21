<template>
  <div class="Fixed"> <!-- todo: locally store class CSS properties for safety -->
    <div
      ref="MediaBox"
      :style="{
        position: 'relative',
        width: '100%',
        height: '100%',
        'font-size': `${fontSize}px`,
      }"
    >
      <transition name="fade">
        <image-comp
          v-if="type === 0"
          :key="mediaBox.current.id"
          class="Slide"
        />
        <prize
          v-else-if="type === 1"
          :key="mediaBox.current.id"
          class="Slide"
          :vertical="vertical"
        />
        <prize-generic
          v-else-if="type === 2"
          :key="mediaBox.current.id"
          class="Slide"
          :vertical="vertical"
        />
        <donation
          v-else-if="type === 3"
          :key="mediaBox.current.id"
          class="Slide"
          :vertical="vertical"
        />
        <subscription
          v-else-if="type === 4"
          :key="mediaBox.current.id"
          class="Slide"
          :vertical="vertical"
        />
        <cheer
          v-else-if="type === 5"
          :key="mediaBox.current.id"
          class="Slide"
          :vertical="vertical"
        />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { MediaBox, Prizes } from '../../types/schemas';
import { Asset } from '../../types';
import ImageComp from './components/Image.vue';
import Prize from './components/Prize.vue';
import PrizeGeneric from './components/PrizeGeneric.vue';
import Donation from './components/Donation.vue';
import Subscription from './components/Subscription.vue';
import Cheer from './components/Cheer.vue';
import store from './store';
import { replicantNS } from '../../browser_shared/replicant_store';

@Component({
  store,
  components: {
    ImageComp,
    Prize,
    PrizeGeneric,
    Donation,
    Subscription,
    Cheer,
  },
})
export default class extends Vue {
  @replicantNS.State((s) => s.reps.assetsMediaBoxImages) readonly mediaBoxImages!: Asset[];
  @replicantNS.State((s) => s.reps.mediaBox) readonly mediaBox!: MediaBox;
  @replicantNS.State((s) => s.reps.prizes) readonly prizes!: Prizes;
  @Prop({ type: Number, default: 50 }) fontSize!: number;
  @Prop(Boolean) vertical!: boolean;

  get type(): number {
    switch (this.mediaBox.current?.type) {
      case 'image':
        return 0;
      case 'prize':
        return 1;
      case 'prize_generic':
        return 2;
      case 'donation':
        return 3;
      case 'subscription':
        return 4;
      case 'cheer':
        return 5;
      default:
        return -1;
    }
  }
}
</script>

<style scoped>
  .Slide {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
