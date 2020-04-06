<template>
  <v-app>
    <div class="d-flex">
      <v-text-field
        v-model="entry"
        label="Donation Reader"
        hide-details
        filled
        :spellcheck="false"
        @keyup.enter="change(); $event.target.blur();"
      />
      <v-btn
        height="56px"
        :style="{ 'min-width': '0', 'margin-left': '5px' }"
        @click="change"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
    <v-btn
      :style="{ 'margin-top': '10px' }"
      @click="clear"
    >
      Clear
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { DonationReader } from 'schemas';
import { Modify, Clear } from './store';

@Component
export default class extends Vue {
  @State donationReader!: DonationReader;
  @Mutation modify!: Modify;
  @Mutation clear!: Clear;
  entry = '';

  @Watch('donationReader', { immediate: true })
  onDonationReaderChanged(val: DonationReader): void {
    this.entry = val || '';
  }

  change(): void {
    this.modify(this.entry);
  }
}
</script>
