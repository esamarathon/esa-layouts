<template>
  <!-- todo: locally store class CSS properties for safety -->
  <div
    v-show="cheer"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '0.75em',
      'text-align': 'center',
      padding: '25px',
      'box-sizing': 'border-box',
    }"
  >
    <img
      src="./esaWow.png"
      :style="{ 'margin-bottom': vertical ? '10px' : 0 }"
    >
    <div
      class="FlexColumn"
      :style="{ 'margin-left': vertical ? 0 : '20px' }"
    >
      <div
        :style="{
          'font-size': '1em',
          color: 'white', // move to theme!
        }"
      >
        {{ cheer.name }}
      </div>
      <div
        :style="{
          'font-size': '0.85em',
          // color: '#ffc90e', // BTRL thing, move to theme!
        }"
      >
        cheered {{ cheer.amount }} bits!
      </div>
      <div
        v-if="cheer.message"
        :style="{
          'font-size': '0.6em',
          color: 'lightgrey', // move to theme!
        }"
      >
        {{ cheer.message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { MediaBox as MediaBoxRep } from '../../../types/schemas';
import { MediaBox } from '../../../types';
import { replicantNS } from '../../../browser_shared/replicant_store';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.mediaBox) readonly mediaBox!: MediaBoxRep;
  @Prop(Boolean) vertical!: boolean;

  get cheer(): MediaBox.AlertElem['data'] | undefined {
    return this.mediaBox.alertQueue.find((a) => a.id === this.mediaBox.current?.mediaUUID)?.data;
  }
}
</script>
