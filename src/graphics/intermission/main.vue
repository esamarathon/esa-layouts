<template>
  <div id="Intermission">
    <div
      id="Background"
      :style="{ 'clip-path': clipPath }"
    />
    <div id="Layout">
      <!-- Logo -->
      <div
        v-if="!isHek"
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
      <div
        v-else
        class="Fixed"
        :style="{
          left: '53px',
          top: '43px',
          width: '609px',
          height: '276px',
        }"
      >
        <img
          src="./hek.png"
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
          left: '718px',
          top: '31px',
          width: '1172px',
          height: '199px',
        }"
      />

      <!-- Rotation -->
      <rotation
        :style="{
          left: '718px',
          top: '240px',
          width: '1172px',
          height: '660px',
        }"
      />

      <!-- Donation Reader and Music Track -->
      <div
        class="BottomBox Fixed Flex"
        :style="{
          left: '718px',
          top: '910px',
          width: '1172px',
          height: '60px',
          'justify-content': 'flex-start',
          'font-size': '30px',
        }"
      >
        <donation-reader />
        <music-track />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RunData } from 'speedcontrol-util/types';
// import { generateClipPath } from '../_misc/cut-background';
import MediaBox from '@shared/graphics/mediabox';
import CommercialTimer from './components/CommercialTimer.vue';
import UpcomingRun from './components/UpcomingRun.vue';
import Rotation from './components/Rotation.vue';
import DonationReader from './components/DonationReader.vue';
import MusicTrack from './components/MusicTrack.vue';

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

  get isHek(): boolean {
    return this.nextRuns[0]?.customData.info === 'HEK';
  }

  mounted(): void {
    // Bring this back if we actually gain some cameras on this layout.
    // this.clipPath = generateClipPath();
  }
}
</script>
