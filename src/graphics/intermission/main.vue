<template>
  <div id="Intermission" :style="{ zoom }">
    <div
      id="Background"
      :style="{ 'clip-path': clipPath }"
    />
    <div id="Layout">
    <!-- Logo -->
      <img
        v-if="theme === 'swcf'"
        class="Fixed"
        :style="{
          left: '481px',
          top: '37px',
          width: '1064px',
          height: '414px',
        }"
        src="../_misc/themes/swcf/CountdownLogo.png"
      >
      <div
        v-else
        class="Logo Fixed"
        :style="{
          left: '53px',
          top: '43px',
          width: '609px',
          height: '276px',
        }"
      >
        <img
          :style="{
            width: '100%',
            height: '100%',
            'object-fit': 'contain',
          }"
        >
      </div>

      <!-- Commercial Timer -->
      <commercial-timer
        v-if="theme !== 'swcf'"
        :style="{
          left: '30px',
          top: '370px',
          width: '655px',
          height: '35px',
        }"
      />

      <!-- Media Box -->
      <media-box
        v-if="theme !== 'swcf'"
        vertical
        :font-size="50"
        :style="{
          left: '26px',
          top: '450px',
          width: '662px',
          height: '520px',
        }"
      />

      <!-- Upcoming Run -->
      <upcoming-run
        class="Fixed"
        :run-data="nextRuns[0]"
        :style="{
          left: theme === 'swcf' ? '200px' : '718px',
          top: theme === 'swcf' ? '492px': '31px',
          width: theme === 'swcf' ? '1520px' : '1172px',
          height: '199px',
        }"
      />

      <!-- Rotation -->
      <rotation
        :style="{
          left: theme === 'swcf' ? '200px' : '718px',
          top: theme === 'swcf' ? '701px' : '240px',
          width: theme === 'swcf' ? '1520px' : '1172px',
          height: theme === 'swcf' ? '199px' : '660px',
        }"
      />

      <!-- Donation Reader and Music Track -->
      <div
        class="BottomBox Fixed Flex"
        :style="{
          left: theme === 'swcf' ? '200px' : '718px',
          top: '910px',
          width: theme === 'swcf' ? '1520px' : '1172px',
          height: '60px',
          'justify-content': 'flex-start',
          'font-size': '30px',
        }"
      >
        <donation-reader />
        <music-track v-if="theme !== 'swcf'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RunData } from 'speedcontrol-util/types';
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
// import { generateClipPath } from '../_misc/cut-background';
import MediaBox from '@shared/graphics/mediabox';
import { getZoomAmountCSS } from '../_misc/helpers';
import CommercialTimer from './components/CommercialTimer.vue';
import DonationReader from './components/DonationReader.vue';
import MusicTrack from './components/MusicTrack.vue';
import Rotation from './components/Rotation.vue';
import UpcomingRun from './components/UpcomingRun.vue';

@Component({
  components: {
    MediaBox,
    CommercialTimer,
    UpcomingRun,
    Rotation,
    DonationReader,
    MusicTrack,
  },
})
export default class extends Vue {
  @State nextRuns!: RunData[];
  clipPath = 'unset';
  zoom = getZoomAmountCSS();
  theme = nodecg.bundleConfig.event.theme;

  mounted(): void {
    // Bring this back if we actually gain some cameras on this layout.
    // this.clipPath = generateClipPath();
  }
}
</script>
