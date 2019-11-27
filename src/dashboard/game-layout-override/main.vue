<template>
  <v-app>
    <div
      v-if="!options.length"
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
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
          :label="opt.text"
        ></v-radio>
      </v-radio-group>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { Layouts, CurrentLayout } from 'schemas';
import { UpdateCurrentLayout } from './store';

@Component
export default class extends Vue {
  @State layouts!: Layouts;
  @State currentLayout!: CurrentLayout;
  @Mutation updateCurrentLayout!: UpdateCurrentLayout;

  get selected(): CurrentLayout {
    return this.currentLayout;
  }
  set selected(val) {
    this.updateCurrentLayout(val);
  }

  get options(): { value?: string; text: string }[] {
    const opts: { value?: string; text: string }[] = [];
    if (this.layouts && this.layouts.length) {
      this.layouts.forEach((layout) => {
        if (layout.name) {
          opts.push({
            value: layout.path,
            text: layout.name,
          });
        }
      });
    }
    return opts;
  }
}
</script>
