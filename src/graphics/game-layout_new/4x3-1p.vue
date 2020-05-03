<template>
  <div>
    <!-- Game Captures -->
    <div
      id="GameCapture1"
      class="Capture BorderLeft TestArea"
      :style="{
        left: '668px',
        top: '0px',
        width: '1252px',
        height: '940px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture TestArea"
      :style="{
        left: '0px',
        top: '0px',
        width: '668px',
        height: '380px',
      }"
    />

    <!-- Information Storage -->
    <div
      class="Fixed TestArea"
      :style="{
        left: '0px',
        top: '380px',
        width: '668px',
        height: '620px',
      }"
    >
      <!-- Game Info, to be properly added -->
      <div
        class="BorderBottom"
        :style="{ /* needs checking! */
          width: '100%',
          'padding-top': '10px',
          'padding-bottom': '10px',
        }"
      >
        Game Info Here :)

        <!-- player -->
        <!-- commentators -->
        <!-- game name -->
        <!-- game extra info -->

        <!-- style tag settings need checking! -->
        <timer :style="{ 'margin-top': '-0.07em' }" />

        <!-- media box -->
      </div>
    </div>

    <!-- Donations Bar -->
    <div
      class="Fixed BorderLeft TestArea"
      :style="{
        left: '668px',
        top: '940px',
        width: '1252px',
        height: '60px',
      }"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Timer from './components/Timer.vue';

@Component({
  components: {
    Timer,
  },
})
export default class extends Vue {}
</script>

<style scoped>
  .TestArea {
    /* background-color: rgba(255, 192, 203, 0.5); */
  }
</style>
