<template>
  <div
    v-if="commentators.length"
    ref="Commentator"
    class="Flex"
    :style="{
      'background-color': 'var(--commentators-bg-colour)',
      width: '100%',
      height: '40px', // May need moving out/be a prop
      'font-size': '25px',
      'font-weight': 400,
      color: 'var(--font-colour-inverted)',
      'box-sizing': 'border-box',
      padding: '0 20px',
    }"
  >
    <div
      class="Flex"
      :style="{ width: '100%' }"
    >
      <div class="Commentator">
        <span :style="{ 'font-weight': 500 }">
          <template v-if="commentators.length === 1">Commentator:</template>
          <template v-else>Commentators:</template>
        </span>
        {{ commentators.join(', ') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Commentators } from 'schemas';
import fitty from 'fitty';

@Component
export default class extends Vue {
  @State commentators!: Commentators;

  fit(): void {
    const elem = this.$refs.Commentator as HTMLElement;
    fitty('.Commentator', {
      minSize: 1,
      maxSize: parseInt(elem.style.fontSize, 0),
    });
  }

  mounted(): void {
    if (this.commentators && this.commentators.length) {
      this.fit();
    }
  }

  @Watch('commentators')
  async onCommentatorChange(newVal: Commentators, oldVal?: Commentators): Promise<void> {
    // Re-fit the elements if commentators becomes definded (as elements do no exist before this).
    if (newVal.length && (!oldVal || oldVal.length)) {
      await Vue.nextTick();
      this.fit();
    }
  }
}
</script>
