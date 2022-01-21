<template>
  <div id="Countdown" :style="{ zoom }">
    <div id="Background" />
    <div
      id="Layout"
      class="Flex"
      :style="{
        'flex-direction': 'column',
        height: '1000px',
      }"
    >
      <img class="Logo">
      <countdown :style="{ 'margin-top': '50px' }" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Countdown from '@shared/graphics/countdown';
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
