<template>
  <div>
    <div id="Background" />
    <div
      id="Layout"
      class="Flex"
      :style="{
        'flex-direction': 'column',
      }"
    >
      <!-- Media Box -->
      <media-box
        :font-size="130"
        :style="{
          left: '0px',
          top: '0px',
          width: '100vw',
          height: '100vh',
          padding: '0 200px',
          'box-sizing': 'border-box',
        }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import MediaBox from '@shared/graphics/mediabox';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    MediaBox,
  },
})
export default class extends Vue {}
</script>
