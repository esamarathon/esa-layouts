<template>
  <div id="Countdown">
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

@Component({
  components: {
    Countdown,
  },
})
export default class extends Vue {}
</script>
