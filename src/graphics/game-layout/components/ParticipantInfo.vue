<template>
  <div
    class="Flex bg--darkpurple text--barlowc text--offwhite"
    :style="{
      'box-sizing': 'border-box',
      height: '50px',
      'font-size': '25px',
      padding: '4px',
    }"
  >
    <div
      class="Flex bg--halfgradient"
      :style="{
        'box-sizing': 'border-box',
        height: '100%',
        'padding-right': !pronouns ? '14px' : '8px',
        'padding-left': '6px',
        'border-radius': '4px 0 0 4px',
        'clip-path': `
          polygon(0% 0%, calc(100% - 6px) 0, 100% 50%,
          calc(100% - 6px) 100%, 0% 100%)
        `,
        overflow: 'hidden', // Needed to allow child name to not overflow.
      }"
    >
      <img
        v-if="type === 'player'"
        class="Icon"
        src="../../_misc/PlayerIconSolo.png"
        :style="{
          filter: 'invert(1) drop-shadow(2px 2px 2px black)',
        }"
      >
      <img
        v-else-if="type === 'commentator'"
        class="Icon"
        src="../../_misc/Mic.png"
      >
      <img v-else-if="type === 'reader'" class="Icon" src="../../_misc/ESALogo.png">

      <!-- Name -->
      <div
        class="text--shadow"
        :style="{
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'margin-top': '-0.12em',
        }"
      >
        {{ name }}
      </div>

      <!-- Pronouns -->
      <div
        v-if="pronouns"
        class="bg--darkgrey"
        :style="{
          'text-transform': 'lowercase',
          'border-radius': '6px 0 0 6px',
          padding: '4px 10px 4px 6px',
          'margin-left': '7px',
          'font-size': '0.7em',
          'clip-path': `
            polygon(0% 0%, calc(100% - 5px) 0, 100% 50%,
            calc(100% - 5px) 100%, 0% 100%)
          `,
        }"
      >
        <!-- Div wrapper for text to use a margin to move it up slightly. -->
        <div :style="{ 'margin-top': '-0.17em' }">
          {{ pronouns }}
        </div>
      </div>
    </div>

    <div
      v-show="country"
      class="Flex bg--darkgrey"
      :style="{
        height: '100%',
        'font-size': '0.9em',
        'margin-left': '2px',
        padding: '0 8px 0 12px',
        'border-radius': '0 4px 4px 0',
        'clip-path': 'polygon(100% 0, 100% 50%, 100% 100%, 0% 100%, 6px 50%, 0% 0%)',
      }"
    >
      <!-- Flag -->
      <img
        v-if="country"
        :src="`/bundles/esa-layouts/flags/${country}.png`"
        :style="{
          height: '1em',
          'border-radius': '4px',
          'margin-left': '2px',
          filter: `
            drop-shadow(0 -2px 0 white)
            drop-shadow(0 2px 0 white)
            drop-shadow(-2px 0 0 white)
            drop-shadow(2px 0 0 white)
          `,
        }"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop({ type: String, required: true }) type!: string;
  @Prop({ type: String, required: true }) name!: string;
  @Prop({ type: String, required: false }) pronouns!: string | undefined;
  @Prop({ type: String, required: false }) country!: string | undefined;
}
</script>

<style scoped>
  .Icon {
    height: 100%;
    padding: 4px 0;
    box-sizing: border-box;
    margin-right: 7px;
    filter: drop-shadow(2px 2px 2px black);
  }
</style>
