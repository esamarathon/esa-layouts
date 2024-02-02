<template>
  <media-card
    class="d-flex align-center px-2"
    :style="{ 'text-align': 'unset', height: '40px', 'margin-top': index > 0 ? '10px' : 0  }"
  >
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-text class="pa-4 pb-0">
          <v-form v-model="isFormValid">
            <v-text-field
              v-model="thresholdEdit"
              label="Amount Threshold in Dollars"
              prepend-icon="mdi-cash"
              autocomplete="off"
              :rules="[isRequired, isNumber, isZeroOrBigger]"
              filled
              dense
            />
            <v-text-field
              v-model="soundEdit"
              label="Sound Asset Name"
              prepend-icon="mdi-music-box"
              autocomplete="off"
              :rules="[isRequired, isValidAsset]"
              filled
              dense
            />
            <v-text-field
              v-model="volumeEdit"
              label="Volume in dB"
              prepend-icon="mdi-volume-high"
              autocomplete="off"
              :rules="[isRequired, isNumber, isZeroOrSmaller]"
              filled
              dense
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="save" :disabled="!isFormValid">Save</v-btn>
          <v-btn @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-icon class="mr-2" @click="test">
      mdi-play
    </v-icon>
    <div class="flex-grow-1">
      ${{ alert.threshold }} - {{ alert.sound || 'N/A' }} ({{ alert.volume }} dB)
      <!-- {{ alert.graphic || 'N/A' }} ({{ alert.graphicDisplayTime }}s) -->
    </div>
    <v-icon @click="edit">
      mdi-pencil
    </v-icon>
    <v-icon @click="remove">
      mdi-delete
    </v-icon>
  </media-card>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import MediaCard from '@esa-layouts/dashboard/_misc/components/MediaCard.vue';
import { DonationAlerts } from '@esa-layouts/types/schemas';
import type NodeCGTypes from '@nodecg/types';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { storeModule } from '../store';

@Component({
  components: {
    MediaCard,
  },
})
export default class extends Vue {
  @Prop({ type: Object, required: true }) readonly alert!: DonationAlerts[0];
  @Prop({ type: Number, required: true }) readonly index!: number;
  @replicantNS.State(
    (s) => s.reps.assetsDonationAlertAssets,
  ) readonly assets!: NodeCGTypes.AssetFile[];
  dialog = false;
  thresholdEdit = '0';
  soundEdit = '';
  volumeEdit = '0';
  isFormValid = false;

  isRequired(val: string): boolean | string {
    return !!val || 'Required';
  }

  isNumber(val: string): boolean | string {
    return !Number.isNaN(Number(val)) || 'Must be a number';
  }

  isZeroOrBigger(val: string): boolean | string {
    const num = Number(val);
    return (num >= 0) || 'Must be equal to or bigger than 0';
  }

  isZeroOrSmaller(val: string): boolean | string {
    const num = Number(val);
    return (num <= 0) || 'Must be equal to or smaller than 0';
  }

  isValidAsset(val: string): boolean | string {
    const soundAsset = this.assets.find((v) => v.name === val);
    return !!soundAsset || 'Asset name must match a file uploaded';
  }

  test(): void {
    nodecg.sendMessage('omnibarPlaySound', { amount: this.alert.threshold });
  }

  edit(): void {
    this.dialog = true;
    this.thresholdEdit = this.alert.threshold.toString() ?? '0';
    this.soundEdit = this.alert.sound ?? '';
    this.volumeEdit = this.alert.volume.toString() ?? '0';
  }

  save(): void {
    const item: DonationAlerts[0] = {
      id: this.alert.id,
      threshold: Number(this.thresholdEdit),
      sound: this.soundEdit,
      volume: Number(this.volumeEdit),
      graphic: this.alert.graphic, // TODO
      graphicDisplayTime: this.alert.graphicDisplayTime, // TODO
    };
    storeModule.editItem(item);
    this.dialog = false;
  }

  remove(): void {
    storeModule.removeItem(this.alert.id);
  }
}
</script>
