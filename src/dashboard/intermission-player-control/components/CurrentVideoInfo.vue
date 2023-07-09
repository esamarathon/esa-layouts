<template>
  <div
    v-show="videoPlayer.playing"
    :style="{ 'text-align': 'center' }"
  >
    <span class="font-weight-bold">Currently Playing:</span>
    <br><span v-if="name">{{ name }}</span>
    <span v-else>Unknown (Usually Commercial w/o Video)</span>
    <v-btn color="red" class="mt-2" @click="emergencyStop" block>Emergency Stop</v-btn>
  </div>
</template>

<script lang="ts">
import type NodeCGTypes from '@nodecg/types';
import { VideoPlayer } from '@esa-layouts/types/schemas';
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class extends Vue {
  @State videos!: NodeCGTypes.AssetFile[];
  @State videoPlayer!: VideoPlayer;
  cfg = nodecg.bundleConfig;

  get name(): string | undefined {
    return this.videos.find((a) => a.sum === this.videoPlayer.current)?.name;
  }

  emergencyStop(): void {
    nodecg.sendMessage('stopIntermissionPlayerEarly');
  }
}
</script>
