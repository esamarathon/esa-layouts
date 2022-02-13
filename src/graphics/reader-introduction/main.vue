<template>
  <div id="ReaderIntroduction" :style="{ zoom }">
    <div id="Background"/>
    <div
      id="Layout"
      class="Flex"
      :style="{
        height: '1000px',
        padding: '80px',
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
          v-for="asset in assetsTemp"
          v-show="readerIntro.current === asset.sum"
          :src="asset.url"
          :key="asset.sum"
          :style="{
            width: '100%',
            height: '100%',
            padding: '0 400px',
            'box-sizing': 'border-box',
            'object-fit': 'contain',
            overflow: 'hidden',
          }"
        >
        <!-- Run boxart and information. -->
        <div
          v-show="readerIntro.current === 'RunInfo'"
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
              v-show="boxartImgSuccess"
              class="BoxArt"
              :src="`/bundles/esa-layouts/boxart/${run.id}.jpg`"
              @load="boxartImgSuccess = true"
              @error="boxartImgSuccess = false"
            >
            <!-- Element to show if boxart fails to load. -->
            <div
              v-show="!boxartImgSuccess"
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
                'row-gap': '20px',
              }"
            >
              <container>
                <template v-slot:header>Game</template>
                <template v-slot:content>{{ run.game }}</template>
              </container>
              <div class="Flex" :style="{ width: '100%', 'column-gap': '20px' }">
                <container :style="{ 'flex-basis': 0, 'flex-grow': 1 }">
                  <template v-slot:header>Category</template>
                  <template v-slot:content>{{ run.category }}</template>
                </container>
                <container :style="{ 'flex-basis': 0, 'flex-grow': 1 }">
                  <template v-slot:header>Estimate</template>
                  <template v-slot:content>{{ run.estimate }}</template>
                </container>
                <container :style="{ 'flex-basis': 0, 'flex-grow': 1 }">
                  <template v-slot:header>System</template>
                  <template v-slot:content>{{ run.system }}</template>
                </container>
              </div>
              <container>
                <template v-slot:header>Runners</template>
                <template v-slot:content>{{ players }}</template>
              </container>
              <container v-show="comms">
                <template v-slot:header>Commentators</template>
                <template v-slot:content>{{ comms }}</template>
              </container>
              <container v-show="reader">
                <template v-slot:header>Donation Reader</template>
                <template v-slot:content>{{ reader }}</template>
              </container>
            </div>
          </template>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import MediaBox from '@shared/graphics/mediabox';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { Asset } from '@shared/types';
import { ReaderIntroduction } from '@esa-layouts/types/schemas';
import { RunData } from 'speedcontrol-util/types';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import clone from 'clone';
import Container from './components/Container.vue';
import { getZoomAmountCSS } from '../_misc/helpers';

@Component({
  components: {
    MediaBox,
    Container,
  },
})
export default class extends Vue {
  @replicantNS.State((s) => s.reps.readerIntroduction) readonly readerIntro!: ReaderIntroduction;
  @replicantNS.State((s) => s.reps.assetsReaderIntroductionImages) readonly assets!: Asset[];
  @replicantNS.State((s) => s.reps.runDataActiveRun) readonly activeRun!: RunData | undefined;
  @replicantNS.State((s) => s.reps.runDataArray) readonly runDataArray!: RunData[];
  @replicantNS.State((s) => s.reps.commentators) readonly commentators!: string[];
  @replicantNS.State((s) => s.reps.donationReader) readonly reader!: string | null;
  zoom = getZoomAmountCSS();
  boxartImgSuccess = false;

  // Keep a temporary copy of the image assets so things don't break when NodeCG restarts.
  assetsTemp: Asset[] = [];
  @Watch('assets', { immediate: true })
  onAssetsChanged(val: Asset[]): void {
    if (val.length && val.length !== this.assetsTemp.length) {
      this.assetsTemp = clone(val);
    }
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
