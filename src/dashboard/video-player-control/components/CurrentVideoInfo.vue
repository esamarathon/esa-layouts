<template>
  <div
    v-show="videoPlayer.playing"
    :style="{ 'text-align': 'center' }"
  >
    <span class="font-weight-bold">Currently Playing:</span>
    <br><span v-if="name">{{ name }}</span>
    <span v-else>Unknown (Probably Commercial w/o Video)</span>
    <v-btn color="red" class="mt-2" @click="emergencyStop" block>Emergency Stop</v-btn>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Asset } from '@shared/types';
import { Configschema, VideoPlayer } from '@esa-layouts/types/schemas';

@Component
export default class extends Vue {
  @State videos!: Asset[];
  @State videoPlayer!: VideoPlayer;
  cfg = nodecg.bundleConfig as Configschema;

  get name(): string | undefined {
    return this.videos.find((a) => a.sum === this.videoPlayer.current)?.name;
  }

  emergencyStop(): void {
    nodecg.sendMessage('stopVideoPlayerEarly');
  }
}
</script>
