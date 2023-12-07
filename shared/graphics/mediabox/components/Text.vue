<template>
  <div
    class="CustomText FlexColumn"
    v-html="text"
    ref="Fit"
    :style="{
      'text-align': 'center',
      'font-size': `${fontSize}px`,
      color: 'white',
    }"
  />
</template>

<script lang="ts">
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { Component, Ref, Vue, Watch } from 'vue-property-decorator';
import { replicantNS } from '../../../browser_shared/replicant_store';
import { MediaBox as MediaBoxRep } from '../../../types/schemas';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.mediaBox) readonly mediaBox!: MediaBoxRep;
  @Ref('Fit') toFit!: HTMLElement;
  defaultFontSize = 40;
  fontSize = this.defaultFontSize;
  oldLineCount = -1;

  get text(): string {
    const str = this.mediaBox.rotation.find((a) => a.id === this.mediaBox.current?.id)?.text ?? '';
    const md = marked.parse(str) as string;
    return DOMPurify.sanitize(md);
  }

  async fitText() {
    await Vue.nextTick(); // Wait for the renderer to actually change the text.
    this.fontSize = this.defaultFontSize; // Reset to default.
    let tooBig = this.toFit.scrollHeight > this.toFit.clientHeight;
    let wasTooBig = false;
    while (tooBig) {
      wasTooBig = true;
      this.fontSize -= 1;
      await Vue.nextTick(); // eslint-disable-line no-await-in-loop
      tooBig = this.toFit.scrollHeight > this.toFit.clientHeight;
    }
    // Make a few points smaller for good measure.
    if (wasTooBig) {
      this.fontSize -= 5;
    } else {
      this.fontSize -= 3;
    }
    this.oldLineCount = this.text.split('\n').length;
  }

  @Watch('text')
  async onTextChange(): Promise<void> {
    // Only recalcuate if the line count has changed.
    // Workaround because I had issues with scrollHeight not being correct on change.
    // This can probably break in some instances, like on word wrapping.
    if (this.text.split('\n').length !== this.oldLineCount) {
      this.fitText();
    }
  }

  async mounted(): Promise<void> {
    this.fitText();
  }
}
</script>

<style scoped>

  .CustomText >>> * {
    margin: 0;
  }
</style>
