<template>
  <div id="GameLayout">
    <div
      id="Background"
      :style="{ 'clip-path': clipPath }"
    />
    <router-view id="Layout" />
  </div>
</template>

<script lang="ts">
import { Route } from 'vue-router';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { GameLayouts } from '@esa-layouts/types/schemas';
import { generateClipPath } from '../_misc/cut-background';
import { ClearList, UpdateList, UpdateSelected } from './store';
import { defaultCode } from './list';
import { updateCapturePositionData } from '../_misc/update-capture-position-data';

@Component
export default class extends Vue {
  @State gameLayouts!: GameLayouts;
  @Mutation updateList!: UpdateList;
  @Mutation updateSelected!: UpdateSelected;
  @Mutation clearList!: ClearList;
  clipPath = 'unset';

  @Watch('gameLayouts', { immediate: true })
  async onGameLayoutsChange(newVal: GameLayouts, oldVal?: GameLayouts): Promise<void> {
    if (!oldVal || oldVal.selected !== newVal.selected) {
      const code = newVal.selected || defaultCode;
      try {
        await this.$router.push(`/${code}`);
      } catch (err) {
        // This can error if the route is already the correct one
      }
    }
  }

  layoutChanged(route: Route): void {
    // Is the last replace needed?
    const code = route.path.replace('/', '').replace('*', '');
    this.updateSelected(code || defaultCode);
    this.clipPath = generateClipPath();
    updateCapturePositionData(document.title);
  }

  mounted(): void {
    this.layoutChanged(this.$route);
    this.$router.afterEach(async (to) => {
      try {
        await Vue.nextTick();
        this.layoutChanged(to);
      } catch (err) {
        // Not sure if this will error but better be safe
      }
    });
  }
}
</script>
