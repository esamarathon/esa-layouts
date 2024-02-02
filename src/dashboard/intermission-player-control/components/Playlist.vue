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
        v-for="({ sum, length, commercial }, i) in newPlaylist"
        :key="`${sum}_${i}`"
        class="d-flex align-center"
      >
        <v-text-field
          :value="length"
          type="number"
          hide-details
          outlined
          dense
          spellcheck="false"
          autocomplete="off"
          :style="{ 'max-width': '75px' }"
          :step="`${commercial ? '30' : '1'}`"
          min="0"
          @input="playlistUpdateLength({ i, length: $event })"
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
          <template v-else-if="commercial">
            Commercial w/o Video
          </template>
          <template v-else>
            Wait Block
          </template>
        </div>
        <v-icon @click="playlistRemove(i)" class="mr-1">
          mdi-delete
        </v-icon>
      </media-card>
    </draggable>
    <v-btn block class="mt-3" @click="playlistAdd({ commercial: true })">
      Add Commercial w/o Video to Playlist
    </v-btn>
    <v-btn block class="mt-3" @click="playlistAdd({ commercial: false })">
      Add Wait Block to Playlist
    </v-btn>
  </div>
</template>

<script lang="ts">
import type NodeCGTypes from '@nodecg/types';
import { VideoPlayer } from '@esa-layouts/types/schemas';
import { Component, Vue, Watch } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import { Mutation, State } from 'vuex-class';
import { State2Way } from 'vuex-class-state2way';
import MediaCard from '../../_misc/components/MediaCard.vue';
import { PlaylistAdd, PlaylistRefresh, PlaylistRemove, PlaylistUpdateLength } from '../store';

@Component({
  components: {
    Draggable,
    MediaCard,
  },
})
export default class extends Vue {
  @State videos!: NodeCGTypes.AssetFile[];
  @State videoPlayer!: VideoPlayer;
  @State2Way('updateNewPlaylist', 'newPlaylist') newPlaylist!: VideoPlayer['playlist'];
  @State localEdits!: boolean;
  @Mutation playlistAdd!: PlaylistAdd;
  @Mutation playlistUpdateLength!: PlaylistUpdateLength;
  @Mutation playlistRemove!: PlaylistRemove;
  @Mutation playlistRefresh!: PlaylistRefresh;

  getName(sum?: string): string | undefined {
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
