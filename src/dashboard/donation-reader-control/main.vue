<template>
  <v-app>
    <div class="d-flex">
      <v-text-field
        v-model="entry"
        label="Donation Reader"
        hide-details
        filled
        :spellcheck="false"
        :disabled="disable"
        @keyup.enter="modify(); $event.target.blur();"
      />
      <v-btn
        height="56px"
        :style="{ 'min-width': '0', 'margin-left': '5px' }"
        :disabled="disable"
        @click="modify()"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
    <v-btn
      :style="{ 'margin-top': '10px' }"
      :disabled="disable"
      @click="modify(true)"
    >
      Clear
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { DonationReader } from '@esa-layouts/types/schemas';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.donationReader) readonly donationReader!: DonationReader;
  entry = '';
  disable = false;

  @Watch('donationReader', { immediate: true })
  onDonationReaderChanged(val: DonationReader): void {
    this.entry = val || '';
  }

  async modify(clear = false): Promise<void> {
    this.disable = true;
    try {
      await nodecg.sendMessage('readerModify', clear ? null : this.entry);
    } catch (err) {
      // catch
    }
    this.entry = this.donationReader || '';
    this.disable = false;
  }
}
</script>
