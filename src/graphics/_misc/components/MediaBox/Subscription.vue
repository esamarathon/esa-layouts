<template>
  <div
    v-show="subscription"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '0.75em',
      'text-align': 'center',
      padding: '25px',
      'box-sizing': 'border-box',
    }"
  >
    <img
      src="./esaHype.png"
      :style="{ 'margin-bottom': vertical ? '10px' : 0 }"
    >
    <div
      class="FlexColumn"
      :style="{ 'margin-left': vertical ? 0 : '10px' }"
    >
      <div
        :style="{
          'font-size': '0.8em',
          color: 'white', // move to theme!
        }"
      >
        {{ subscription.systemMsg }}
      </div>
      <div
        v-if="subscription.message"
        :style="{
          'font-size': '0.7em',
          color: 'lightgrey', // move to theme!
        }"
      >
        {{ subscription.message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { MediaBox as MediaBoxRep } from '@/types/schemas';
import { MediaBox } from '@/types';

@Component
export default class extends Vue {
  @State mediaBox!: MediaBoxRep;
  @Prop(Boolean) vertical!: boolean;

  get subscription(): MediaBox.AlertElem['data'] | undefined {
    return this.mediaBox.alertQueue.find((a) => a.id === this.mediaBox.current?.mediaUUID)?.data;
  }
}
</script>
