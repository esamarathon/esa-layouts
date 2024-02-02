<template>
  <div class="text-center">
    <template v-if="current">
      <span class="font-weight-bold">Current:</span>
      {{ name }}
      <br><span class="font-weight-bold">Position:</span>
      {{ currentPosition + 1 || '?' }}/{{ rotationLength }}
    </template>
    <template v-else>
      No slide current displaying.
    </template>
  </div>
</template>

<script lang="ts">
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import { Component, Vue } from 'vue-property-decorator';
import { storeModule } from '../store';

@Component
export default class extends Vue {
  get current(): IntermissionSlides['current'] {
    return storeModule.reps.intermissionSlides.current;
  }

  get rotationLength(): number {
    return storeModule.reps.intermissionSlides.rotation.length;
  }

  get currentPosition(): number {
    return storeModule.reps.intermissionSlides.rotation.findIndex((r) => r.id === this.current?.id);
  }

  get name(): string {
    let str = '';
    if (this.current?.type === 'Media') {
      str = storeModule.reps.assetsIntermissionSlides
        .find((a) => a.sum === this.current?.mediaUUID)?.name || '';
    } else if (this.current?.type === 'UpcomingRuns') {
      str = 'Upcoming Runs';
    } else if (this.current?.type === 'RandomBid') {
      str = 'Random Bid';
    } else if (this.current?.type === 'RandomPrize') {
      str = 'Random Prize';
    }
    return str || '?';
  }
}
</script>
