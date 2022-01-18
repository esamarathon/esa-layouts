<template>
  <v-app>
    <div v-if="!obsConfig.enabled" :style="{ 'font-style': 'italic' }">
      This feature is not enabled.
    </div>
    <div v-else-if="!obsData.connected" :style="{ 'font-style': 'italic' }">
      OBS connection currently disconnected.
    </div>
    <template v-else>
      <div class="mb-1">
        <span
          v-if="obsData.transitionTimestamp > serverTimestamp"
          class="red--text font-weight-bold"
        >
          <v-icon color="red">mdi-alert</v-icon>
          Transitioning in {{
            ((obsData.transitionTimestamp - serverTimestamp) / 1000).toFixed(1) }}s
        </span>
        <span v-else-if="obsData.transitioning" class="red--text font-weight-bold">
          <v-icon color="red">mdi-alert</v-icon>
          Transitioning
        </span>
        <span
          v-else-if="videoPlayer.estimatedFinishTimestamp > serverTimestamp"
          class="red--text font-weight-bold"
        >
          <v-icon color="red">mdi-alert</v-icon>
          Playlist will finish in ~{{
            ((videoPlayer.estimatedFinishTimestamp - serverTimestamp) / 1000).toFixed(1) }}s
        </span>
        <span v-else-if="obsData.disableTransitioning" class="red--text font-weight-bold">
          <v-icon color="red">mdi-alert</v-icon>
          Transitioning Disabled
        </span>
        <span v-else class="font-italic">
          Not Currently Transitioning
        </span>
      </div>
      <div class="mb-1">
        Streaming Status:
        <span v-if="obsData.streaming" :style="{ 'font-weight': 'bold', color: '#58CF00' }">
          Connected
        </span>
        <span v-else :style="{ 'font-weight': 'bold', color: '#FF5F5C' }">
          Disconnected
        </span>
      </div>
      <v-btn
        @click="startIntermission"
        :disabled="disableIntermission"
      >
        Start Intermission
        <template v-if="currentRunDelay.audio">
          ({{ (currentRunDelay.audio / 1000).toFixed(1) }}s delay)
        </template>
      </v-btn>
      <v-btn
        class="mt-1"
        @click="changeScene(obsConfig.names.scenes.gameLayout)"
        :disabled="disableButton(obsConfig.names.scenes.gameLayout)"
      >
        Start Run
        <template v-if="currentRunDelay.audio">
          ({{ (currentRunDelay.audio / 1000).toFixed(1) }}s delay)
        </template>
      </v-btn>
      <div class="d-flex mt-3 mb-1">
        Change to Specific Scene:
      </div>
      <v-btn
        v-for="(scene, i) in obsData.sceneList"
        :key="i"
        :class="{ 'mt-1': i !== 0 }"
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
      <template v-if="evtConfig.online && obsData.gameLayoutScreenshot && gameLayoutPreviewToggle">
        <div class="mt-3 mb-1">
          "Game Layout" Preview (refreshes every second):
        </div>
        <img :src="obsData.gameLayoutScreenshot" :style="{ width: '100%' }">
      </template>
      <v-switch
        v-if="evtConfig.online"
        v-model="gameLayoutPreviewToggle"
        class="ma-2 mb-0"
        hide-details
        label="Toggle &quot;Game Layout&quot; Preview"
        inset
      />
    </template>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { CurrentRunDelay, ObsData, ServerTimestamp, VideoPlayer } from '@esa-layouts/types/schemas';
import { Configschema } from '@esa-layouts/types/schemas/configschema';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.obsData) readonly obsData!: ObsData;
  @replicantNS.State((s) => s.reps.currentRunDelay) readonly currentRunDelay!: CurrentRunDelay;
  @replicantNS.State((s) => s.reps.serverTimestamp) readonly serverTimestamp!: ServerTimestamp;
  @replicantNS.State((s) => s.reps.videoPlayer) readonly videoPlayer!: VideoPlayer;
  evtConfig = (nodecg.bundleConfig as Configschema).event;
  obsConfig = (nodecg.bundleConfig as Configschema).obs;
  gameLayoutPreviewToggle = true;

  disableButton(scene: string): boolean {
    return this.obsData.transitioning
    || scene === this.obsData.scene
    || this.obsData.disableTransitioning;
  }

  get disableIntermission(): boolean {
    const intermissionScenes = [
      this.obsConfig.names.scenes.commercials,
      this.obsConfig.names.scenes.intermission,
      this.obsConfig.names.scenes.intermissionPlayer,
      this.obsConfig.names.scenes.countdown,
    ];
    return this.obsData.transitioning
    || this.obsData.disableTransitioning
    || !!intermissionScenes.find((s) => this.obsData.scene?.startsWith(s));
  }

  startIntermission(): void {
    nodecg.sendMessage('startIntermission');
  }

  changeScene(scene: string): void {
    nodecg.sendMessage('obsChangeScene', { scene });
  }
}
</script>
