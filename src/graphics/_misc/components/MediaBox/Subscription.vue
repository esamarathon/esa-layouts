<template>
  <div
    v-show="subscription"
    class="Flex"
    :style="{
      'font-size': '33px',
      'text-align': 'center',
      padding: '10px',
      'box-sizing': 'border-box',
    }"
  >
    <img
      v-show="!vertical"
      src="./esaHype.png"
    >
    <div
      class="FlexColumn"
      :style="{ 'margin-left': '20px' }"
    >
      <div
        :style="{
          'font-size': '1em',
          color: 'white', // move to theme!
        }"
      >
        {{ subscription.systemMsg }}
      </div>
      <div
        v-if="subscription.message"
        :style="{
          'font-size': '0.9em',
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
import { MediaBox as MediaBoxRep } from 'schemas';
import { MediaBox } from 'types';

@Component
export default class extends Vue {
  @State mediaBox!: MediaBoxRep;
  @Prop(Boolean) vertical!: boolean;

  get subscription(): MediaBox.AlertElem['data'] | undefined {
    return this.mediaBox.alertQueue.find((a) => a.id === this.mediaBox.current?.mediaUUID)?.data;
  }
}
</script>
