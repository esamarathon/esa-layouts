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
        v-for="({ sum, commercial }, i) in newPlaylist"
        :key="`${sum}_${i}`"
        class="d-flex align-center"
      >
        <v-text-field
          :value="commercial"
          type="number"
          hide-details
          outlined
          dense
          spellcheck="false"
          autocomplete="off"
          :style="{ 'max-width': '75px' }"
          step="30"
          min="0"
          @input="playlistUpdateCommercial({ i, length: $event })"
        />
        <div
          class="d-flex justify-center flex-grow-1"
          :style="{
            'overflow': 'hidden',
            'font-style': !getName(sum) ? 'italic' : undefined,
          }"
        >
          <template v-if="sum">
            {{ getName(sum) || 'Could not find video name.' }}
          </template>
          <template v-else>
            Commercial w/o Video
          </template>
        </div>
        <v-icon @click="playlistRemove(i)" class="mr-1">
          mdi-delete
        </v-icon>
      </media-card>
    </draggable>
    <v-btn block class="mt-3" @click="playlistAdd()">Add Commercial w/o Video to Playlist</v-btn>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { State2Way } from 'vuex-class-state2way';
import Draggable from 'vuedraggable';
import { VideoPlayer } from '@esa-layouts/types/schemas';
import { Asset } from '@shared/types';
import { PlaylistAdd, PlaylistRefresh, PlaylistRemove, PlaylistUpdateCommercial } from '../store';
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
  @Mutation playlistAdd!: PlaylistAdd;
  @Mutation playlistUpdateCommercial!: PlaylistUpdateCommercial;
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
