<template>
  <v-app>
    <div
      v-if="!videos.length"
      :style="{
        'font-style': 'italic',
      }"
    >
      Add videos in the "Assets" tab.
    </div>
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
        id="VideoList"
        :style="{
          'max-height': '250px',
          'overflow-y': 'auto',
          'overflow-x': 'hidden',
        }"
      >
        <v-radio-group
          v-model="selected"
          hide-details
          :style="{
            margin: '0px',
            padding: '10px',
          }"
        >
          <v-radio
            v-for="video in filteredVideos"
            :id="`video-${video.sum}`"
            :key="video.sum"
            :value="video.sum"
          >
            <template slot="label">
              <div class="d-flex align-center">
                <div
                  class="d-flex align-center"
                  :style="{ 'margin-right': '10px' }"
                >
                  <v-icon>
                    mdi-play
                  </v-icon>
                  <div :style="{ width: '25px', 'text-align': 'center' }">
                    {{ playCount(video.sum) }}
                  </div>
                </div>
                <div>
                  {{ video.name }}
                </div>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </div>
      <v-btn @click="unselectVideo">
        Unselect Video
      </v-btn>
    </template>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import goTo from 'vuetify/es5/services/goto';
import { VideoPlayer } from 'schemas';
import { Asset } from 'types';
import { UpdateSelectedVideo, UnselectVideo } from './store';

@Component
export default class extends Vue {
  @State videos!: Asset[];
  @State videoPlayer!: VideoPlayer;
  @Mutation updateSelectedVideo!: UpdateSelectedVideo;
  @Mutation unselectVideo!: UnselectVideo;
  searchTerm: string | null = null;

  @Watch('selected')
  async scrollToSelectedVideo(): Promise<void> {
    try {
      await Vue.nextTick();
      if (this.videoPlayer.selected) {
        goTo(`#video-${this.videoPlayer.selected}`, { container: '#VideoList', offset: 25 });
      } else {
        goTo(0, { container: '#VideoList' });
      }
    } catch (err) {
      // Not sure if this can error, but better be safe
    }
  }

  @Watch('videoPlayer')
  onVideoPlayerChange(): void {
    if (this.filteredVideos.length) {
      this.scrollToSelectedVideo();
    }
  }

  get selected(): VideoPlayer['selected'] {
    return this.videoPlayer.selected;
  }
  set selected(val) {
    this.updateSelectedVideo(val);
  }

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

  mounted(): void {
    this.scrollToSelectedVideo();
  }
}
</script>

<style>
  .v-input--hide-details > .v-input__control > .v-input__slot {
    margin-bottom: 2px !important;
  }
</style>
