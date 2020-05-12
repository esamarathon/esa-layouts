<template>
  <div id="Intermission">
    <div
      id="Background"
      :style="{ 'clip-path': clipPath }"
    />
    <div id="Layout">
      <!-- Logo -->
      <div
        class="Fixed"
        :style="{
          left: '53px',
          top: '43px',
          width: '609px',
          height: '276px',
        }"
      >
        <img
          src="./Logo.png"
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
        :style="{
          left: '26px',
          top: '450px',
          width: '662px',
          height: '520px',
        }"
      />

      <!-- Upcoming Run (todo) -->
      <div
        class="Fixed"
        :style="{
          left: '718px',
          top: '31px',
          width: '1172px',
          height: '199px',
        }"
      >
        Upcoming Run
      </div>

      <!-- Rotation (todo) -->
      <div
        class="Fixed"
        :style="{
          left: '718px',
          top: '240px',
          width: '1172px',
          height: '660px',
        }"
      >
        Rotation
      </div>

      <!-- Donation Reader and Music Track (todo) -->
      <div
        class="Fixed Flex"
        :style="{
          left: '718px',
          top: '910px',
          width: '1172px',
          height: '60px',
          'justify-content': 'flex-start',
          'background-color': 'rgba(0,0,0,0.3)',
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
import { TwitchCommercialTimer } from 'speedcontrol-util/types';
import { generateClipPath } from '../_misc/cut-background';
import MediaBox from '../_misc/components/MediaBox.vue';
import CommercialTimer from './components/CommercialTimer.vue';
import DonationReader from './components/DonationReader.vue';
import MusicTrack from './components/MusicTrack.vue';

@Component({
  components: {
    MediaBox,
    CommercialTimer,
    DonationReader,
    MusicTrack,
  },
})
export default class extends Vue {
  @State twitchCommercialTimer!: TwitchCommercialTimer;
  clipPath = 'unset';

  mounted(): void {
    this.clipPath = generateClipPath();
  }
}
</script>
