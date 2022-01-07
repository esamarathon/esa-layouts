<template>
  <v-app>
    <div
      v-if="!gameLayouts.available.length"
      :style="{ 'font-style': 'italic' }"
    >
      "Game Layout" graphic must be open.
    </div>
    <div
      v-else
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
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { GameLayouts } from '@esa-layouts/types/schemas';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { storeModule } from './store';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.gameLayouts) readonly gameLayouts!: GameLayouts;

  get selected(): GameLayouts['selected'] {
    return this.gameLayouts.selected;
  }
  set selected(val: string | undefined) {
    storeModule.updateSelected(val);
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
