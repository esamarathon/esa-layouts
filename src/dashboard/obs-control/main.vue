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
      <div
        :style="{
          'font-style': 'italic',
          'margin-bottom': '5px',
        }"
      >
        Change Scene:
      </div>
      <v-btn
        v-for="(scene, i) in obsData.sceneList"
        :key="i"
        :style="{ 'margin-top': i !== 0 ? '10px' : '0' }"
        :disabled="disableButton(scene)"
        @click="changeScene(scene)"
      >
        {{ scene }}
      </v-btn>
      <template v-if="obsData.gameLayoutScreenshot">
        <div
          :style="{
            'font-style': 'italic',
            'margin': '15px 0 5px 0',
          }"
        >
          Game Layout preview (refreshes every second):
        </div>
        <img
          :src="obsData.gameLayoutScreenshot"
          :style="{ width: '100%' }"
        >
      </template>
    </template>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { ObsData } from 'schemas';
import { Configschema } from 'configschema';

@Component
export default class extends Vue {
  @State obsData!: ObsData;
  obsConfig = (nodecg.bundleConfig as Configschema).obs;

  disableButton(scene: string): boolean {
    return this.obsData.transitioning || scene === this.obsData.scene;
  }

  // eslint-disable-next-line class-methods-use-this
  changeScene(scene: string): void {
    nodecg.sendMessage('obsChangeScene', scene);
  }
}
</script>
