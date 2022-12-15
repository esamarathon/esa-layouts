<template>
  <div id="Intermission" :style="{ zoom }">
    <div
      id="Background"
      :style="{ 'clip-path': clipPath }"
    />
    <div id="Layout">
      <!-- Logo -->
      <div
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
        :style="{
          left: '30px',
          top: '370px',
          width: '655px',
          height: '35px',
        }"
      />

      <!-- Media Box -->
      <media-box
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
          top: '31px',
          width: theme === 'swcf' ? '1520px' : '1172px',
          height: '199px',
        }"
      />

      <!-- Rotation -->
      <rotation
        :style="{
          left: theme === 'swcf' ? '200px' : '718px',
          top: '240px',
          width: theme === 'swcf' ? '1520px' : '1172px',
          height: '660px',
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
import { Configschema } from '@esa-layouts/types/schemas';
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
  theme = (nodecg.bundleConfig as Configschema).event.theme;

  mounted(): void {
    // Bring this back if we actually gain some cameras on this layout.
    // this.clipPath = generateClipPath();
  }
}
</script>
