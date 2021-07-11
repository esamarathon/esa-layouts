<template>
  <div :style="{ width: '1920px', height: '1080px', position: 'fixed' }">
    <video-elem
      class="Fixed"
      :style="{
        left: '209px',
        top: '25px',
        width: '1503px',
        height: '845px',
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
          color: 'white', // HARDCODED, BAD!
          height: '100%',
          'font-size': '40px',
          'justify-content': 'space-between',
          padding: '0 27px',
        }"
      >
        <template v-if="nextRuns[0]">
          {{ nextRuns[0].game }}
          <span
            class="RunInfoExtra"
            :style="{
              'font-size': '33px',
              color: '#b7b7b7', // HARDCODED, BAD!
            }"
          >
            <span v-if="nextRuns[0].category">
              {{ nextRuns[0].category }}
            </span>
            <span v-if="nextRuns[0].system">
              {{ nextRuns[0].system }}
            </span>
            <span v-if="getRunTotalPlayers(nextRuns[0]) > 0">
              {{ formPlayerNamesStr(nextRuns[0]) }}
            </span>
            <span v-if="nextRuns[0].estimate">
              {{ nextRuns[0].estimate }}
            </span>
          </span>
        </template>
        <template v-else>
          No More Runs
          <img
            src="./esaOhNo.png"
            :style="{ height: '1.4em', 'margin-left': '10px' }"
          >
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
import VideoElem from './components/VideoElem.vue';

@Component({
  components: {
    VideoElem,
  },
})
export default class extends Vue {
  @State nextRuns!: RunData[];
  getRunTotalPlayers = SpeedcontrolUtilBrowser.getRunTotalPlayers;
  formPlayerNamesStr = SpeedcontrolUtilBrowser.formPlayerNamesStr;
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
