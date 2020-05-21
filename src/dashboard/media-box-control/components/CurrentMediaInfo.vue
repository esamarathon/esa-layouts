<template>
  <div
    v-if="!settings.current"
    :style="{
      'text-align': 'center',
      padding: '5px',
      'margin-top': '10px',
      'font-style': 'italic',
    }"
  >
    No media currently in rotation.
  </div>
  <div
    v-else
    :style="{
      'text-align': 'center',
      padding: '5px',
      'margin-top': '10px',
    }"
  >
    <span class="font-weight-bold">Current:</span> {{ getMediaDetails(settings.current).name }}
    <br>(position {{ position }}/{{ settings.rotationApplicable.length }},
    {{ timeRemaining }}/{{ mediaLength }}s left)
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { MediaBox } from 'schemas';
import { getMediaDetails } from './shared';

@Component
export default class extends Vue {
  @State settings!: MediaBox;
  getMediaDetails = getMediaDetails;

  get mediaLength(): number {
    return this.settings.rotationApplicable
      .find((i) => i.id === this.settings.current?.id)?.seconds || 0;
  }

  get timeRemaining(): number {
    return Math.round(this.mediaLength - ((this.settings.current?.timeElapsed || 0) / 1000));
  }

  get position(): number {
    const indexID = this.settings.rotationApplicable
      .findIndex((i) => i.id === this.settings.current?.id);
    return indexID >= 0 ? indexID + 1 : ((this.settings.current?.index || -1) + 1);
  }
}
</script>
