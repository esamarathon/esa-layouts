<template>
  <div id="ReaderIntroduction" :style="{ zoom }">
    <div id="Background" />
    <div
      id="Layout"
      class="Flex"
      :style="{
        padding: '120px',
        'box-sizing': 'border-box',
      }"
    >
      <transition-group
        tag="div"
        name="fade"
        class="Grid"
        :style="{
          width: '100%',
          height: '100%',
          'background-color': 'rgba(0, 0, 0, 0.3)',
        }"
      >
        <!-- Image Slideshow -->
        <img
          v-for="(image, i) in images"
          v-show="i === cycle"
          :src="image.url"
          :key="image.url"
          :style="{
            width: '100%',
            height: '100%',
            padding: '50px',
            'box-sizing': 'border-box',
            'object-fit': 'contain'
          }"
        >
        <!-- Run boxart and information. -->
        <div
          v-show="images.length === cycle"
          key="RunInfo"
          class="Flex"
          :style="{
            height: '100%',
            padding: '50px',
            'box-sizing': 'border-box',
            'text-align': 'center',
            'font-size': '35px',
            overflow: 'hidden',
          }"
        >
          <template v-if="run">
          <!-- Boxart image. -->
            <img
              v-show="imgSuccess"
              class="BoxArt"
              :src="`/bundles/esa-layouts/boxart/${run.id}.jpg`"
              @load="imgSuccess = true"
              @error="imgSuccess = false"
            >
            <!-- Element to show if boxart fails to load. -->
            <div
              v-show="!imgSuccess"
              class="BoxArt Flex"
              :style="{
                color: 'white',
                'font-size': '300px',
                'background-color': 'purple',
                width: '555px',
              }"
            >
              ?
            </div>
            <!-- Run Information -->
            <div
              class="Flex"
              :style="{
                'box-sizing': 'border-box',
                padding: '30px 0',
                height: '100%',
                'flex-grow': 1,
                'flex-direction': 'column',
                'justify-content': 'space-between',
              }"
            >
              <div>
                Game:
                <br>{{ run.game }}
                <br>{{ run.category }}
              </div>
              <div>
                Runners:
                <br>{{ players }}
              </div>
              <div>
                Estimate:
                <br>{{ run.estimate }}
              </div>
              <div>
                System:
                <br>{{ run.system }}
              </div>
              <div>
                Commentators:
                <br>{{ comms }}
              </div>
              <div>
                Donation Reader:
                <br>{{ reader }}
              </div>
            </div>
          </template>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MediaBox from '@shared/graphics/mediabox';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { Asset } from '@shared/types';
import { RunData } from 'speedcontrol-util/types';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import { getZoomAmountCSS } from '../_misc/helpers';

@Component({
  components: {
    MediaBox,
  },
})
export default class extends Vue {
  @replicantNS.State((s) => s.reps.assetsReaderIntroductionImages) readonly images!: Asset[];
  @replicantNS.State((s) => s.reps.runDataActiveRun) readonly activeRun!: RunData | undefined;
  @replicantNS.State((s) => s.reps.runDataArray) readonly runDataArray!: RunData[];
  @replicantNS.State((s) => s.reps.commentators) readonly commentators!: string[];
  @replicantNS.State((s) => s.reps.donationReader) readonly reader!: string | null;
  zoom = getZoomAmountCSS();
  imgSuccess = false;
  cycle = 0;

  created(): void {
    window.setInterval(() => {
      if (this.cycle >= this.images.length) {
        this.cycle = 0;
      } else {
        this.cycle += 1;
      }
    }, 5000);
  }

  get run(): RunData | undefined {
    return this.runDataArray.find((r) => r.id === this.activeRun?.id);
  }

  get players(): string | undefined {
    if (!this.run) return undefined;
    return SpeedcontrolUtilBrowser.formPlayerNamesStr(this.run);
  }

  get comms(): string {
    return this.commentators.join(', ');
  }

  get image(): Asset | undefined {
    if (this.cycle < 0 || this.cycle > (this.images.length - 1)) return undefined;
    return this.images[this.cycle];
  }
}
</script>

<style scoped>
  .BoxArt {
    height: 100%;
    margin-right: 50px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
