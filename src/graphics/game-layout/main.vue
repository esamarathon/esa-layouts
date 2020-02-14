<template>
  <div>
    <div
      id="Background"
      :style="{ 'clip-path': clipPath }"
    />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Route } from 'vue-router';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { GameLayouts } from 'schemas';
import { generateClipPath } from '../_misc/cut-background';
import { ClearList, UpdateList, UpdateSelected } from './store';
import { defaultCode } from './list';

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

  layoutChange(route: Route): void {
    // Is the last replace needed?
    const code = route.path.replace('/', '').replace('*', '');
    this.updateSelected(code || defaultCode);
    this.clipPath = generateClipPath();
  }

  mounted(): void {
    this.layoutChange(this.$route);
    this.$router.afterEach(async (to) => {
      try {
        await Vue.nextTick();
        this.layoutChange(to);
      } catch (err) {
        // Not sure if this would error but better be safe
      }
    });
  }
}
</script>
