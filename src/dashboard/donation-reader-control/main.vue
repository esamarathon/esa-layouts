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
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { DonationReaderNew } from '@esa-layouts/types/schemas';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.donationReaderNew) readonly donationReader!: DonationReaderNew;
  entry = '';
  disable = false;

  @Watch('donationReader', { immediate: true })
  onDonationReaderChanged(val: DonationReaderNew): void {
    this.entry = val?.pronouns ? `${val.name} (${val.pronouns})` : (val?.name || '');
    this.entry = val?.country
      ? `${this.entry} (${val.country})`
      : this.entry;
  }

  async modify(clear = false): Promise<void> {
    this.disable = true;
    try {
      await nodecg.sendMessage('readerModify', clear ? null : this.entry);
    } catch (err) {
      // catch
    }
    this.entry = this.donationReader?.pronouns
      ? `${this.donationReader.name} (${this.donationReader.pronouns})`
      : (this.donationReader?.name || '');
    this.entry = this.donationReader?.country
      ? `${this.entry} (${this.donationReader.country})`
      : this.entry;
    this.disable = false;
  }
}
</script>
