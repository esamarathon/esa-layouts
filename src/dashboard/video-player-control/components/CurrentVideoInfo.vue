<template>
  <div
    v-show="name"
    :style="{ 'text-align': 'center' }"
  >
    <span class="font-weight-bold">Currently Playing:</span>
    <br>{{ name }}
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Asset } from '@esamarathon/esa-layouts-shared/types';
import { VideoPlayer } from '@esa-layouts/types/schemas';

@Component
export default class extends Vue {
  @State videos!: Asset[];
  @State videoPlayer!: VideoPlayer;

  get name(): string | undefined {
    return this.videos.find((a) => a.sum === this.videoPlayer.current)?.name;
  }
}
</script>
