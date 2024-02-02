<template>
  <div>
    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BorderTop BorderBottom BorderLeft BorderRight"
      :style="{
        left: '119px',
        top: '105px',
        width: '831px',
        height: '720px',
        // background: 'black',
      }"
    />
    <div
      id="CameraCapture2"
      class="Capture BorderTop BorderBottom BorderLeft BorderRight"
      :style="{
        left: '970px',
        top: '105px',
        width: '831px',
        height: '720px',
        // background: 'black',
      }"
    />

    <!-- Player 1 -->
    <player
      :slot-no="0"
      class="Fixed"
      :style="{
        left: '119px',
        top: '845px',
        width: '831px',
      }"
    />

    <!-- Player 2 -->
    <player
      :slot-no="1"
      class="Fixed"
      :style="{
        left: '970px',
        top: '845px',
        width: '831px',
      }"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Player from './components/Player.vue';

@Component({
  components: {
    Player,
  },
})
export default class extends Vue {
  online = nodecg.bundleConfig.event.online;

  mounted(): void {
    const bg = document.getElementById('Background');
    if (bg) bg.style.background = 'unset';
  }

  destroyed(): void {
    const bg = document.getElementById('Background');
    if (bg) bg.style.background = '';
  }
}
</script>
