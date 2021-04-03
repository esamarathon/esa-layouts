<template>
  <div
    v-if="donationReader"
    class="Flex DonationReader"
    :style="{ height: '100%' }"
  >
    <div
      class="Flex Mic"
      :style="{
        'box-sizing': 'border-box',
        height: '100%',
        padding: '5px'
      }"
    >
      <img
        src="./Mic.png"
        :style="{ height: '100%' }"
      >
    </div>
    <div
      :style="{
        display: 'flex',
        padding: '0 15px',
      }"
    >
      {{ name }}
      <div
        v-if="pronouns"
        class="Pronouns"
        :style="{
          padding: '3px 5px',
          'margin-left': '10px',
        }"
      >
        {{ pronouns }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { DonationReader } from '@esa-layouts/types/schemas';

@Component
export default class extends Vue {
  @State donationReader!: DonationReader;

  get name(): string | undefined {
    if (!this.donationReader) {
      return undefined;
    }
    return this.donationReader.replace(/\((.*?)\)/g, '').trim();
  }

  get pronouns(): string | undefined {
    if (!this.donationReader) {
      return undefined;
    }
    return (this.donationReader.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, '');
  }
}
</script>
