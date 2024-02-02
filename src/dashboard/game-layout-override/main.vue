<template>
  <v-app>
    <div
      v-if="!gameLayouts.available.length"
      :style="{ 'font-style': 'italic' }"
    >
      "Game Layout" graphic must be open.
    </div>
    <template v-else>
      <!--<v-switch
        v-if="!online"
        v-model="crowdCamera"
        class="mx-3 mt-1 mb-2 pa-0"
        inset
        hide-details
        label="Crowd Camera"
      />-->
      <div
        id="LayoutList"
        :style="{
          'max-height': '250px',
          'overflow-y': 'auto',
        }"
      >
        <v-radio-group
          v-model="selected"
          hide-details
          :style="{
            margin: '0px',
            padding: '10px',
          }"
        >
          <v-radio
            v-for="layout in gameLayouts.available"
            :id="`layout-${layout.code}`"
            :key="layout.code"
            :value="layout.code"
            :label="layout.name"
          />
        </v-radio-group>
      </div>
    </template>
  </v-app>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { GameLayouts } from '@esa-layouts/types/schemas';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { storeModule } from './store';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.gameLayouts) readonly gameLayouts!: GameLayouts;
  online = nodecg.bundleConfig.event.online;

  get selected(): GameLayouts['selected'] {
    return this.gameLayouts.selected;
  }
  set selected(val: string | undefined) {
    storeModule.updateSelected(val);
  }

  get crowdCamera(): GameLayouts['crowdCamera'] {
    return this.gameLayouts.crowdCamera;
  }
  set crowdCamera(val: GameLayouts['crowdCamera']) {
    storeModule.toggleCrowdCamera(val);
  }

  @Watch('selected')
  async scrollToSelectedLayout(): Promise<void> {
    try {
      await Vue.nextTick();
      if (this.selected) {
        this.$vuetify.goTo(`#layout-${this.selected}`, { container: '#LayoutList', offset: 25 });
      } else {
        this.$vuetify.goTo(0, { container: '#LayoutList' });
      }
    } catch (err) {
      // Not sure if this can error, but better be safe
    }
  }

  @Watch('gameLayouts')
  onGameLayoutsChange(): void {
    if (this.gameLayouts.available.length) {
      this.scrollToSelectedLayout();
    }
  }

  mounted(): void {
    this.scrollToSelectedLayout();
  }
}
</script>

<style>
  .v-input--hide-details > .v-input__control > .v-input__slot {
    margin-bottom: 2px !important;
  }
</style>
