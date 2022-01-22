<template>
  <div
    id="Omnibar"
    class="Flex"
    :style="{
      color: 'white', // TODO: Move to theme?
      width: '1920px',
      height: '80px',
      position: 'fixed',
      zoom,
    }"
  >
    <img id="Logo"><!-- Logo -->
    <divider />
    <total /><!-- Donation Total -->
    <divider />
    <ticker /><!-- Ticker -->
    <divider />
    <clock /><!-- Clock -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Divider from './components/Divider.vue';
import Total from './components/Total.vue';
import Ticker from './components/Ticker.vue';
import Clock from './components/Clock.vue';
import { getZoomAmountCSS } from '../_misc/helpers';

@Component({
  components: {
    Divider,
    Total,
    Ticker,
    Clock,
  },
})
export default class extends Vue {
  zoom = getZoomAmountCSS();
}
</script>
