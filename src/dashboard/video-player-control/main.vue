<template>
  <v-app>
    <div
      v-if="!sortedVideos.length"
      :style="{
        'font-style': 'italic',
        'margin-bottom': '10px',
      }"
    >
      Add videos in the "Assets" tab.
    </div>
    <div
      v-else
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
          v-for="video in sortedVideos"
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
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
// @ts-ignore: goTo isn't typed
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
    if (this.sortedVideos.length) {
      this.scrollToSelectedVideo();
    }
  }

  get selected(): VideoPlayer['selected'] {
    return this.videoPlayer.selected;
  }
  set selected(val) {
    this.updateSelectedVideo(val);
  }

  get sortedVideos(): Asset[] {
    return this.videos.map((video) => [this.playCount(video.sum), video])
      .sort().map((video) => video[1] as Asset);
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
