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
      'min-height': '0',
      transform: scale || 'unset',
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
          'font-size': '0.8em', // Also gets set in the script, here as backup.
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { RunDataActiveRun } from 'speedcontrol-util/types';
import fitty from 'fitty';

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @Prop(Boolean) readonly noWrap!: boolean;
  elem: HTMLElement | undefined;
  scale: string | null = null;

  fit(): void {
    this.elem = this.$refs.RunInfo as HTMLElement;
    if (this.elem) {
      if (!this.noWrap) {
        fitty('.RunGame', {
          minSize: 1,
          maxSize: parseInt(this.elem.style.fontSize, 0),
        });
        fitty('.RunInfoExtra', {
          minSize: 1,
          maxSize: parseInt(this.elem.style.fontSize, 0) * 0.8,
        });
      } else {
        // If there is no horizontal fitting, will crudely attempt to
        // squash vertically if needed, just in case.
        const scale = this.elem.clientHeight / this.elem.scrollHeight;
        if (scale < 1) {
          this.scale = `scale(1, ${scale - 0.15})`;
        } else {
          this.scale = null;
        }
      }
    }
  }

  async mounted(): Promise<void> {
    if (this.runData) {
      this.fit();
    }
  }

  @Watch('runData')
  async onRunDataChange(newVal: RunDataActiveRun, oldVal?: RunDataActiveRun): Promise<void> {
    // Re-fit the elements if run data becomes definded (as elements do no exist before this).
    if ((newVal && !oldVal) || this.noWrap) {
      await Vue.nextTick();
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
