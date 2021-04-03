<template>
  <div>
    <v-toolbar-title>
      Playlist
    </v-toolbar-title>
    <v-alert
      v-show="localEdits"
      type="warning"
      dense
      :style="{ 'margin-top': '5px' }"
    >
      Local changes have been made.
    </v-alert>
    <media-card
      v-if="!newPlaylist.length"
      :style="{ 'font-style': 'italic' }"
    >
      Add videos using the list above.
    </media-card>
    <draggable v-model="newPlaylist">
      <media-card
        v-for="(sum, i) in newPlaylist"
        :key="`${sum}_${i}`"
        class="d-flex"
      >
        <div
          class="d-flex justify-center flex-grow-1"
          :style="{
            'overflow': 'hidden',
            'font-style': !getName(sum) ? 'italic' : undefined,
          }"
        >
          {{ getName(sum) || 'Could not find video name.' }}
        </div>
        <v-icon @click="playlistRemove(i)">
          mdi-delete
        </v-icon>
      </media-card>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { State2Way } from 'vuex-class-state2way';
import Draggable from 'vuedraggable';
import { VideoPlayer } from '@esa-layouts/types/schemas';
import { Asset } from '@esamarathon/esa-layouts-shared/types';
import { PlaylistRefresh, PlaylistRemove } from '../store';
import MediaCard from '../../_misc/components/MediaCard.vue';

@Component({
  components: {
    Draggable,
    MediaCard,
  },
})
export default class extends Vue {
  @State videos!: Asset[];
  @State videoPlayer!: VideoPlayer;
  @State2Way('updateNewPlaylist', 'newPlaylist') newPlaylist!: VideoPlayer['playlist'];
  @State localEdits!: boolean;
  @Mutation playlistRemove!: PlaylistRemove;
  @Mutation playlistRefresh!: PlaylistRefresh;

  getName(sum: string): string | undefined {
    return this.videos.find((a) => a.sum === sum)?.name;
  }

  @Watch('videoPlayer', { immediate: true })
  onVideoPlayerChange(): void {
    if (!this.localEdits) {
      this.playlistRefresh();
    }
  }
}
</script>
