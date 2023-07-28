<template>
  <div>
    <!-- Crowd Camera Capture -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: '0px',
        width: '1920px',
        height: '1080px',
      }"
    />

    <!-- Players -->
    <!--<div
      class="Fixed Flex"
      :style="{
        left: '0px',
        top: '850px',
        width: '1920px',
        height: '50px',
        padding: '0 100px',
        'box-sizing': 'border-box',
        'column-gap': '20px',
      }"
    >
      <player :slotNo="0" />
      <player :slotNo="1" />
      <player :slotNo="2" />
      <player :slotNo="3" />
    </div>-->
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
export default class extends Vue {}
</script>
