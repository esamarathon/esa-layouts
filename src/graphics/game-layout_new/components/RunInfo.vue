<template>
  <div
    v-if="runData"
    ref="RunInfo"
    class="FlexColumn"
    :style="{
      'font-size': '40px',
      width: '100%',
      'text-align': 'center',
      padding: '0 20px',
      'box-sizing': 'border-box',
    }"
  >
    <div
      class="Flex"
      :style="{ width: '100%' }"
    >
      <div
        v-if="runData.game"
        class="RunGame"
        :style="{
          'font-size': '1em',
          'font-weight': '500',
        }"
      >
        {{ runData.game }}
      </div>
    </div>
    <div
      class="Flex"
      :style="{ width: '100%' }"
    >
      <div
        class="RunInfoExtra"
        :style="{
          'font-size': '0.75em', // Also gets set in the script, here as backup.
          color: 'var(--font-colour-secondary)', // should be changed
        }"
      >
        <span v-if="runData.category">{{ runData.category }}</span>
        <span v-if="runData.system">{{ runData.system }}</span>
        <span v-if="runData.estimate">{{ runData.estimate }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RunDataActiveRun } from 'speedcontrol-util/types';
import fitty from 'fitty';

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @Prop(Boolean) readonly noWrap!: boolean;
  elem!: HTMLElement;

  fit(): void {
    fitty('.RunGame', {
      minSize: 1,
      maxSize: parseInt(this.elem.style.fontSize, 0),
    });
    fitty('.RunInfoExtra', {
      minSize: 1,
      maxSize: parseInt(this.elem.style.fontSize, 0) * 0.75,
    });
  }

  mounted(): void {
    this.elem = this.$refs.RunInfo as HTMLElement;
    if (!this.noWrap) {
      this.fit();
    }
  }
}
</script>

<style scoped>
  .RunInfoExtra > span:not(:last-child)::after {
    content: ' /';
  }
</style>
