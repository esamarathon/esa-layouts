<template>
  <div
    v-show="(comms && comms.length) || reader"
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
      v-show="comms && comms.length"
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
            <template v-if="comms.length === 1">Commentator:</template>
            <template v-else>Commentators:</template>
          </span>
          <template v-for="({ name, pronouns }, i) in comms">
            {{ name }}<span
              v-if="pronouns"
              :key="name"
              class="Pronouns"
              :style="{
                padding: '1px 3px',
                'margin-left': '4px',
              }"
            >{{ pronouns }}</span><span
              v-if="i < comms.length - 1"
              :key="name"
            >, </span>
          </template>
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
      v-show="reader"
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
          <template v-if="reader">
            {{ reader.name }}
          </template>
          <span
            v-if="reader && reader.pronouns"
            class="Pronouns"
            :style="{
              padding: '1px 3px',
              'margin-left': '2px',
            }"
          >
            {{ reader.pronouns }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Commentators, DonationReader } from '@esa-layouts/types/schemas';
import fitty, { FittyInstance } from 'fitty';

@Component
export default class extends Vue {
  @State commentators!: Commentators;
  @State donationReader!: DonationReader;
  fittyCommentator!: FittyInstance;
  fittyReader!: FittyInstance;

  get showBoth(): boolean {
    return !!(this.comms && this.comms.length && this.reader);
  }

  get reader(): { name: string, pronouns?: string } | undefined {
    if (!this.donationReader) {
      return undefined;
    }
    return {
      name: this.donationReader.replace(/\((.*?)\)/g, '').trim(),
      pronouns: (this.donationReader.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, ''),
    };
  }

  get comms(): { name: string, pronouns?: string }[] {
    return this.commentators.map((c) => ({
      name: c.replace(/\((.*?)\)/g, '').trim(),
      pronouns: (c.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, ''),
    }));
  }

  mounted(): void {
    const elem = this.$refs.CommAndReader as HTMLElement;
    [this.fittyCommentator] = fitty('.CommentatorText', {
      minSize: 1,
      maxSize: parseInt(elem.style.fontSize, 10),
    });
    [this.fittyReader] = fitty('.ReaderText', {
      minSize: 1,
      maxSize: parseInt(elem.style.fontSize, 10),
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
