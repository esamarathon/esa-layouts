<template>
  <div>
    <div class="Status">
      <span
        v-if="!settings.current"
        :style="{ 'font-style': 'italic' }"
      >
        No media currently displaying.
      </span>
      <template v-else-if="settings.current">
        <span class="font-weight-bold">Current:</span>
        <template v-if="isAlertType(settings.current.type)">
          <span :style="{ 'text-transform': 'capitalize' }">
            {{ settings.current.type }}
          </span> Alert
        </template>
        <template v-else>
          {{ getMediaDetails(settings.current).name }}
        </template>
        <br>
        <template v-if="!isAlertType(settings.current.type)">
          (position {{ position(settings.current) }}/{{ settings.rotationApplicable.length }},
        </template>
        <span v-else>(</span>{{
          timeRemaining(settings.current) }}/{{ mediaLength(settings.current) }}s left)
      </template>
    </div>
    <div
      v-if="settings.paused"
      class="Status"
    >
      <span class="font-weight-bold">Paused:</span> {{ getMediaDetails(settings.paused).name }}
      <br>(position {{ position(settings.paused) }}/{{ settings.rotationApplicable.length }},
      {{ timeRemaining(settings.paused) }}/{{ mediaLength(settings.paused) }}s left)
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { MediaBox } from '../../../types';
import { MediaBox as MediaBoxRep } from '../../../types/schemas';
import { getMediaDetails, isAlertType } from './shared';

@Component
export default class extends Vue {
  @State settings!: MediaBoxRep;
  getMediaDetails = getMediaDetails;
  isAlertType = isAlertType;

  mediaLength(media: MediaBox.ActiveElem): number {
    if (media && isAlertType(media.type)) {
      return 15; // Alerts have a hardcoded 15 second length for now.
    }
    return this.settings.rotationApplicable
      .find((i) => i.id === media?.id)?.seconds || 0;
  }

  timeRemaining(media: MediaBox.ActiveElem): number {
    return Math.round(this.mediaLength(media) - ((media?.timeElapsed || 0) / 1000));
  }

  position(media: MediaBox.ActiveElem): number {
    const index = media?.index;
    return typeof index === 'number' ? index + 1 : -1;
  }
}
</script>

<style scoped>
  .Status {
    text-align: center;
    padding: 5px;
  }
</style>
