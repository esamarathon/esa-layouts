<template>
  <div>
    <v-toolbar-title>
      Available Videos
    </v-toolbar-title>
    <div :style="{ 'margin-top': '10px' }">
      <span
        v-if="!videos.length"
        :style="{ 'font-style': 'italic' }"
      >
        Add videos under "Assets" > "esa-layouts" > "Videos".
      </span>
      <template v-else>
        <v-text-field
          v-model="searchTerm"
          filled
          clearable
          label="Search..."
          append-icon="mdi-magnify"
          :messages="`
            ${filteredVideos.length} video${filteredVideos.length === 1 ? '' : 's'} found.
          `"
        />
        <div
          :style="{
            height: '250px',
            'overflow-y': 'scroll',
            'overflow-x': 'hidden',
            margin: 0,
            padding: '10px',
          }"
        >
          <div
            v-for="video in filteredVideos"
            :key="video.sum"
            class="d-flex align-center"
            :value="video.sum"
            :style="{
              margin: '5px',
              'margin-left': 0,
            }"
          >
            <div
              class="d-flex align-center"
              :style="{ 'margin-right': '10px' }"
            >
              <v-btn
                icon
                outlined
                small
                :style="{ 'margin-right': '10px' }"
                @click="playlistAdd(video.sum)"
              >
                <v-icon small>
                  mdi-playlist-plus
                </v-icon>
              </v-btn>
              <v-icon>
                mdi-play
              </v-icon>
              <div :style="{ width: '25px', 'text-align': 'center' }">
                {{ playCount(video.sum) }}
              </div>
            </div>
            <div :title="video.name">
              {{ video.name }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { VideoPlayer } from '@esa-layouts/types/schemas';
import { Asset } from '@esamarathon/esa-layouts-shared/types';
import { PlaylistAdd } from '../store';

@Component
export default class extends Vue {
  @State videos!: Asset[];
  @State videoPlayer!: VideoPlayer;
  @Mutation playlistAdd!: PlaylistAdd;
  searchTerm: string | null = null;

  get filteredVideos(): Asset[] {
    return this.videos
      .filter((v) => {
        const str = (this.searchTerm) ? this.searchTerm.toLowerCase() : '';
        return !str || (str && v.name.toLowerCase().includes(str));
      })
      .map((video) => [this.playCount(video.sum), video])
      .sort()
      .map((video) => video[1] as Asset);
  }

  playCount(sum: string): number {
    return this.videoPlayer.plays[sum] || 0;
  }
}
</script>
