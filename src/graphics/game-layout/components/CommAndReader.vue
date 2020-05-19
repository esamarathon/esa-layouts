<template>
  <div
    v-show="(commentators && commentators.length) || donationReader"
    ref="CommAndReader"
    class="Flex CommAndReader"
    :style="{
      width: '100%',
      height: '40px',
      'font-size': '25px',
      'font-weight': 400,
      'justify-content': showBoth ? 'space-between' : undefined,
      'white-space': 'nowrap',
    }"
  >
    <div
      v-show="commentators && commentators.length"
      :style="{
        width: showBoth ? 'calc(65% - 1px)' : '100%',
        overflow: 'hidden',
        padding: '0 10px',
        'box-sizing': 'border-box',
      }"
    >
      <div
        class="Flex"
        :style="{ width: '100%' }"
      >
        <div class="CommentatorText">
          <span :style="{ 'font-weight': 500 }">
            <template v-if="commentators.length === 1">Commentator:</template>
            <template v-else>Commentators:</template>
          </span>
          {{ commentators.join(', ') }}
        </div>
      </div>
    </div>
    <div
      v-show="showBoth"
      :style="{
        'background-color': 'white',
        width: '2px',
        height: '100%',
      }"
    />
    <div
      v-show="donationReader"
      :style="{
        width: showBoth ? 'calc(35% - 1px)' : '100%',
        overflow: 'hidden',
        padding: '0 10px',
        'box-sizing': 'border-box',
      }"
    >
      <div
        class="Flex"
        :style="{ width: '100%' }"
      >
        <div class="ReaderText">
          <span :style="{ 'font-weight': 500 }">
            Reader:
          </span>
          {{ donationReader }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Commentators, DonationReader } from 'schemas';
import fitty, { FittyInstance } from 'fitty';

@Component
export default class extends Vue {
  @State commentators!: Commentators;
  @State donationReader!: DonationReader;
  fittyCommentator!: FittyInstance;
  fittyReader!: FittyInstance;

  get showBoth(): boolean {
    return !!(this.commentators && this.commentators.length && this.donationReader);
  }

  mounted(): void {
    const elem = this.$refs.CommAndReader as HTMLElement;
    [this.fittyCommentator] = fitty('.CommentatorText', {
      minSize: 1,
      maxSize: parseInt(elem.style.fontSize, 0),
    });
    [this.fittyReader] = fitty('.ReaderText', {
      minSize: 1,
      maxSize: parseInt(elem.style.fontSize, 0),
    });
  }

  destroyed(): void {
    this.fittyCommentator.unsubscribe();
    this.fittyReader.unsubscribe();
  }

  @Watch('showBoth')
  onShowBothChange(): void {
    this.fittyCommentator.fit();
    this.fittyReader.fit();
  }
}
</script>
