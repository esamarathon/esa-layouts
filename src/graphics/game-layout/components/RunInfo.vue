<template>
  <div
    v-show="runData"
    ref="RunInfo"
    class="FlexColumn"
    :style="{
      'font-size': '40px',
      width: '100%',
      'text-align': 'center',
      padding: '0 20px',
      'box-sizing': 'border-box',
      'min-height': 0,
      'line-height': lineHeight || 'unset',
    }"
  >
    <div
      class="Flex"
      :style="{ width: '100%' }"
    >
      <div
        v-show="runData && runData.game"
        class="RunGame"
        :style="{
          'font-size': '1em',
          'font-weight': 500,
        }"
      >
        <template v-if="runData && runData.game">
          {{ runData.game }}
        </template>
      </div>
    </div>
    <div
      class="Flex"
      :style="{ width: '100%' }"
    >
      <div
        v-show="runData && (runData.category || runData.system || runData.estimate)"
        class="RunInfoExtra"
        :style="{
          'font-size': '0.8em', // Also gets set in the script, here as backup.
        }"
      >
        <template v-if="runData">
          <span v-if="hek">Hekathon Takeover</span>
          <span v-if="runData.category">{{ runData.category }}</span>
          <span v-if="runData.system">{{ runData.system }}</span>
          <span v-if="runData.estimate">{{ runData.estimate }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { RunDataActiveRun } from 'speedcontrol-util/types';
import fitty, { FittyInstance } from 'fitty';

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @Prop(Boolean) readonly noWrap!: boolean;
  lineHeight: string | null = null;
  fittyGame: FittyInstance | undefined;
  fittyInfoExtra: FittyInstance | undefined;

  get hek(): boolean {
    return this.runData?.customData.info === 'HEK';
  }

  fit(): void {
    const elem = this.$refs.RunInfo as HTMLElement;
    if (elem) {
      if (!this.noWrap) {
        [this.fittyGame] = fitty('.RunGame', {
          minSize: 1,
          maxSize: parseInt(elem.style.fontSize, 10),
          multiLine: false,
        });
        [this.fittyInfoExtra] = fitty('.RunInfoExtra', {
          minSize: 1,
          maxSize: parseInt(elem.style.fontSize, 10) * 0.8,
          multiLine: false,
        });
      } else {
        // If there is no horizontal fitting, will crudely attempt to
        // reduce line height if needed, just in case.
        const scale = elem.clientHeight / elem.scrollHeight;
        if (scale < 1) {
          this.lineHeight = `${(scale - 0.1) * 100}%`;
        } else {
          this.lineHeight = null;
        }
      }
    }
  }

  mounted(): void {
    this.fit();
  }

  destroyed(): void {
    if (this.fittyGame) {
      this.fittyGame.unsubscribe();
    }
    if (this.fittyInfoExtra) {
      this.fittyInfoExtra.unsubscribe();
    }
  }

  @Watch('runData')
  async onRunDataChange(newVal: RunDataActiveRun, oldVal?: RunDataActiveRun): Promise<void> {
    // Re-fit the elements if run data becomes definded (as elements do no exist before this).
    if ((newVal && !oldVal) || this.noWrap) {
      this.lineHeight = null;
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
