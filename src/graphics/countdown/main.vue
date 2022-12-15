<template>
  <div id="Countdown" :style="{ zoom }">
    <div id="Background" />
    <div
      id="Layout"
      class="Flex"
      :style="{
        'flex-direction': 'column',
        height: '1080px',
      }"
    >
      <img class="Logo">
      <countdown :style="{ 'margin-top': '50px' }" />
    </div>
  </div>
</template>

<script lang="ts">
import Countdown from '@shared/graphics/countdown';
import { Component, Vue } from 'vue-property-decorator';
import { getZoomAmountCSS } from '../_misc/helpers';

@Component({
  components: {
    Countdown,
  },
})
export default class extends Vue {
  zoom = getZoomAmountCSS();
}
</script>
