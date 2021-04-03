<template>
  <v-app>
    <div
      v-if="!obsConfig.enable"
      :style="{ 'font-style': 'italic' }"
    >
      This feature is not enabled.
    </div>
    <div
      v-else-if="!obsData.connected"
      :style="{ 'font-style': 'italic' }"
    >
      OBS connection currently disconnected.
    </div>
    <template v-else>
      <div :style="{ 'margin-bottom': '5px' }">
        Streaming Status:
        <span
          v-if="obsData.streaming"
          :style="{ 'font-weight': 'bold', color: '#58CF00' }"
        >
          Connected
        </span>
        <span
          v-else
          :style="{ 'font-weight': 'bold', color: '#FF5F5C' }"
        >
          Disconnected
        </span>
      </div>
      <div class="d-flex">
        <div
          :style="{
            'font-style': 'italic',
            'margin-bottom': '5px',
          }"
        >
          Change Scene:
        </div>
        <v-spacer />
        <div
          v-if="obsData.transitionTimestamp > currentTime"
          class="red--text font-weight-bold"
        >
          Transitioning in {{ ((obsData.transitionTimestamp - currentTime) / 1000).toFixed(1) }}s
          <v-icon color="red">
            mdi-alert
          </v-icon>
        </div>
      </div>
      <v-btn
        v-for="(scene, i) in obsData.sceneList"
        :key="i"
        :style="{ 'margin-top': i !== 0 ? '10px' : '0' }"
        :disabled="disableButton(scene)"
        @click="changeScene(scene)"
      >
        {{ scene }}
        <template
          v-if="scene !== obsData.scene && (currentRunDelay.audio
            && (scene === obsConfig.names.scenes.gameLayout
              || (scene !== obsConfig.names.scenes.gameLayout
                && obsData.scene === obsConfig.names.scenes.gameLayout)))"
        >
          ({{ (currentRunDelay.audio / 1000).toFixed(1) }}s delay)
        </template>
      </v-btn>
      <template v-if="obsData.gameLayoutScreenshot && gameLayoutPreviewToggle">
        <div
          :style="{
            'font-style': 'italic',
            'margin': '15px 0 5px 0',
          }"
        >
          "Game Layout" Preview (refreshes every second):
        </div>
        <img
          :src="obsData.gameLayoutScreenshot"
          :style="{ width: '100%' }"
        >
      </template>
      <v-switch
        v-model="gameLayoutPreviewToggle"
        :style="{ 'margin-top': '10px' }"
        hide-details
        label="Toggle &quot;Game Layout&quot; Preview"
      />
    </template>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { CurrentRunDelay, ObsData } from '@esa-layouts/types/schemas';
import { Configschema } from '@esa-layouts/types/schemas/configschema';

@Component
export default class extends Vue {
  @State obsData!: ObsData;
  @State currentRunDelay!: CurrentRunDelay;
  obsConfig = (nodecg.bundleConfig as Configschema).obs;
  gameLayoutPreviewToggle = true;
  currentTime = Date.now();

  created(): void {
    window.setInterval(() => { this.currentTime = Date.now(); }, 100);
  }

  disableButton(scene: string): boolean {
    return this.obsData.transitioning
    || scene === this.obsData.scene
    || this.obsData.disableTransitioning;
  }

  changeScene(scene: string): void {
    nodecg.sendMessage('obsChangeScene', scene);
  }
}
</script>
