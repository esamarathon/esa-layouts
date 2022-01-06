<template>
  <div :style="{ width: '1920px', height: '1080px', position: 'fixed' }">
    <!--<video-elem
      class="Fixed"
      :style="{
        left: '209px',
        top: '25px',
        width: '1503px',
        height: '845px',
      }"
    />-->
    <div
      class="Fixed"
      :style="{
        left: '209px',
        top: '25px',
        width: '1503px',
        height: '845px',
        'background-color': 'black',
      }"
    />
    <div
      class="Fixed Flex"
      :style="{
        left: '25px',
        top: '895px',
        width: '1870px',
        height: '80px',
      }"
    >
      <div
        class="Flex"
        :style="{
          'background-color': '#41245b', // HARDCODED, BAD!
          color: 'white', // HARDCODED, BAD!
          'text-transform': 'uppercase',
          height: '100%',
          padding: '0 25px',
          'font-size': '45px',
          'font-weight': 500,
        }"
      >
        Setting Up For
      </div>
      <div
        class="Flex"
        :style="{
          flex: 1,
          'background-color': 'rgba(0, 0, 0, 0.3)', // HARDCODED, BAD!
          height: '100%',
          'font-size': '40px',
          'justify-content': 'space-between',
          padding: '0 27px',
        }"
      >
        <template v-if="nextRun">
          {{ nextRun.game }}
          <span
            class="RunInfoExtra"
            :style="{
              'font-size': '33px',
            }"
          >
            <span v-if="nextRun.category">
              {{ nextRun.category }}
            </span>
            <span v-if="nextRun.system">
              {{ nextRun.system }}
            </span>
            <span v-if="getRunTotalPlayers(nextRun) > 0">
              {{ formPlayerNamesStr(nextRun) }}
            </span>
            <span v-if="nextRun.estimate">
              {{ nextRun.estimate }}
            </span>
          </span>
        </template>
        <template v-else>
          <div class="Flex">
            No More Runs
            <img
              src="./esaOhNo.png"
              :style="{ height: '1.4em', 'margin-left': '10px' }"
            >
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RunData } from 'speedcontrol-util/types';
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import { VideoPlayer } from '@esa-layouts/types/schemas';
import VideoElem from './components/VideoElem.vue';

@Component({
  components: {
    VideoElem,
  },
})
export default class extends Vue {
  @State nextRun!: RunData | null;
  @State videoPlayer!: VideoPlayer;
  getRunTotalPlayers = SpeedcontrolUtilBrowser.getRunTotalPlayers;

  formPlayerNamesStr(runData: RunData): string {
    return runData.teams.map((team) => (
      team.name || team.players.map((player) => player.name).join(', ')
    )).join(' vs. ') || 'N/A';
  }

  mounted(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obs = (window as any).obsstudio;
    if (obs) {
      obs.onActiveChange = (active: boolean): void => {
        if (active && !this.videoPlayer.playing) {
          // If we change to this scene manually, start playing videos.
          nodecg.sendMessage('startVideoPlayer');
        }
      };
    }
  }
}
</script>

<style>
  body {
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
</style>

<style scoped>
  .RunInfoExtra > span:not(:last-child)::after {
    content: ' /';
  }
</style>
