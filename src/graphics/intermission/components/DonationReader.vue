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
      :style="{ padding: '0 15px' }"
    >
      {{ donationReader }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { DonationReader } from 'schemas';

@Component
export default class extends Vue {
  @State donationReader!: DonationReader;
}
</script>
