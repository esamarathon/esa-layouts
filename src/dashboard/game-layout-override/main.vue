<template>
  <v-app>
    <div
      v-if="!gameLayouts.available.length"
    >
      <em>"Game Layout" graphic must be open.</em>
    </div>
    <div v-else>
      <v-radio-group
        v-model="selected"
        hide-details
        class="pa-0 ma-0"
      >
        <v-radio
          v-for="layout in gameLayouts.available"
          :key="layout.code"
          :value="layout.code"
          :label="layout.name"
        />
      </v-radio-group>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { GameLayouts } from 'schemas';
import { UpdateSelected } from './store';

@Component
export default class extends Vue {
  @State gameLayouts!: GameLayouts;
  @Mutation updateSelected!: UpdateSelected;

  get selected(): GameLayouts['selected'] | undefined {
    return this.gameLayouts.selected;
  }
  set selected(val) {
    this.updateSelected(val);
  }
}
</script>
