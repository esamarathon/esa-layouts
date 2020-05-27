<template>
  <div>
    <v-toolbar-title>
      Playlist
    </v-toolbar-title>
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
        <v-icon @click="remove(i)">
          mdi-delete
        </v-icon>
      </media-card>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import clone from 'clone';
import Draggable from 'vuedraggable';
import { VideoPlayer } from 'schemas';
import { Asset } from 'types';
import { UpdateNewPlaylist } from '../store';
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
  @State('newPlaylist') newPlaylistState!: VideoPlayer['playlist'];
  @Mutation updateNewPlaylist!: UpdateNewPlaylist;

  get newPlaylist(): VideoPlayer['playlist'] {
    return this.newPlaylistState;
  }
  set newPlaylist(val) {
    this.updateNewPlaylist(val);
  }

  getName(sum: string): string | undefined {
    return this.videos.find((a) => a.sum === sum)?.name;
  }

  remove(i: number): void {
    this.newPlaylist.splice(i, 1);
  }

  created(): void {
    this.newPlaylist = clone(this.videoPlayer.playlist);
  }
}
</script>
