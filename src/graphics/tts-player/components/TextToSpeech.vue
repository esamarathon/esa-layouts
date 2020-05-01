<template>
  <div :style="{ display: 'none' }" />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class extends Vue {
  audio = new Audio();

  mounted(): void {
    nodecg.listenFor('ttsToRead', (url) => {
      this.audio.src = url;
      this.audio.play();
    });
  }
}
</script>
