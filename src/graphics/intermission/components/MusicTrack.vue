<template>
  <div
    v-if="musicPlayer.playing && trackInformation"
    class="Flex MusicTrack"
    :style="{ height: '100%' }"
  >
    <div
      class="Flex MCat"
      :style="{
        'box-sizing': 'border-box',
        height: '100%',
        padding: '5px'
      }"
    >
      <img
        src="./MCat.png"
        :style="{ height: '100%' }"
      >
    </div>
    <div
      v-if="trackInformation"
      :style="{ padding: '0 15px' }"
    >
      {{ trackInformation }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { MusicPlayer } from 'schemas';

@Component
export default class extends Vue {
  @State musicPlayer!: MusicPlayer;

  get trackInformation(): string | undefined {
    const info = [
      this.musicPlayer.metadata.title,
      this.musicPlayer.metadata.artist,
    ].filter(Boolean);
    return info.length ? info.join(' - ') : undefined;
  }
}
</script>
