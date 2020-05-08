<template>
  <div
    ref="PlayerName"
    class="Flex"
    :style="{
      position: 'absolute',
      height: '100%',
      width: '100%',
    }"
  >
    <img
      v-if="type === 'name'"
      ref="PlayerIcon"
      src="../../_misc/PlayerIconSolo.png"
      :style="{
        filter: 'var(--icon-colour-inversion)',
        height: '100%',
      }"
    >
    <img
      v-else-if="type === 'twitch'"
      ref="PlayerIcon"
      src="../../_misc/TwitchIcon.png"
      :style="{
        filter: 'var(--icon-colour-inversion)',
        height: '100%',
      }"
    >
    <div
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
          'justify-content': 'flex-start',
        }"
      >
        <div class="PlayerName">
          {{ type === 'twitch' ? '/' : '' }}{{ text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import fitty from 'fitty';
import { waitForImages } from '../../_misc/helpers';

@Component
export default class extends Vue {
  @Prop({ default: '' }) text!: string;
  @Prop({ default: 'name' }) type!: string;

  async mounted(): Promise<void> {
    const elem = this.$refs.PlayerName as HTMLElement;
    await waitForImages(this.$refs.PlayerIcon);
    fitty('.PlayerName', {
      minSize: 1,
      maxSize: parseInt(window.getComputedStyle(elem).fontSize, 0),
    });
  }
}
</script>
