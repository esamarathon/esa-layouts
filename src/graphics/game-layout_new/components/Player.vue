<template>
  <div
    ref="Player"
    class="Flex"
    :style="{
      'background-color': 'var(--border-colour)',
      color: 'var(--font-colour-inverted)',
      'font-weight': '500',
      'font-size': '25px',
      width: '100%',
      height: '50px',
      padding: '7px',
      'box-sizing': 'border-box',
    }"
  >
    <img
      ref="PlayerIcon"
      src="../../_misc/PlayerIconSolo.png"
      :style="{
        filter: 'var(--icon-colour-inversion)',
        height: '100%',
      }"
    >
    <div
      ref="PlayerName"
      :style="{
        flex: '1',
        overflow: 'hidden',
        padding: '0 10px',
        'box-sizing': 'border-box',
      }"
    >
      <div
        class="Flex"
        :style="{
          width: '100%',
          'justify-content': 'flex-start',
        }"
      >
        <div class="PlayerName">
          zoton2
        </div>
      </div>
    </div>
    <img
      ref="Flag"
      :src="`/bundles/esa-layouts/static/flags/gb/eng.png`"
      :style="{
        height: 'calc(100% - 4px)',
        border: '2px solid var(--font-colour-inverted)',
      }"
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import fitty from 'fitty';
import { waitForImages } from '../../_misc/helpers';

@Component
export default class extends Vue {
  async mounted(): Promise<void> {
    const elem = this.$refs.Player as HTMLElement;
    const nameElem = this.$refs.PlayerName as HTMLElement;
    await waitForImages(this.$refs.PlayerIcon, this.$refs.Flag);
    nameElem.style.width = `${nameElem.clientWidth}px`;
    fitty('.PlayerName', { minSize: 1, maxSize: parseInt(elem.style.fontSize, 0) });
  }
}
</script>
