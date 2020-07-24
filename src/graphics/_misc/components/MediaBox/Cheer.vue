<template>
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
      <div :style="{ 'font-size': '0.85em' }">
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
import { State } from 'vuex-class';
import { MediaBox as MediaBoxRep } from 'schemas';
import { MediaBox } from 'types';

@Component
export default class extends Vue {
  @State mediaBox!: MediaBoxRep;
  @Prop(Boolean) vertical!: boolean;

  get cheer(): MediaBox.AlertElem['data'] | undefined {
    return this.mediaBox.alertQueue.find((a) => a.id === this.mediaBox.current?.mediaUUID)?.data;
  }
}
</script>
