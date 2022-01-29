<template>
  <media-card
    class="d-flex align-center px-2"
    :style="{ 'text-align': 'unset', height: '40px', 'margin-top': index > 0 ? '10px' : 0 }"
  >
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-text class="pa-4 pb-0">
          <v-form v-model="isFormValid">
            <v-text-field
              v-model="nameEdit"
              prepend-icon="mdi-application"
              autocomplete="off"
              :rules="[isRequired]"
              filled
              dense
            />
            <v-switch
              v-model="additionToggleEdit"
              class="pa-0 ma-0 pb-2 pl-10"
              label="Toggle &quot;Addition&quot; Mode"
              hide-details
              inset
              :disabled="milestone.enabled"
            />
            <v-text-field
              v-if="additionToggleEdit"
              v-model="additionEdit"
              prepend-icon="mdi-cash-plus"
              autocomplete="off"
              :rules="[isRequired, isNumber, isBiggerThanZero]"
              filled
              dense
              :disabled="milestone.enabled"
            />
            <v-text-field
              v-else
              v-model="amountEdit"
              prepend-icon="mdi-cash"
              autocomplete="off"
              :rules="[isRequired, isNumber, isBiggerThanZero]"
              filled
              dense
              :disabled="milestone.enabled"
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
    <v-checkbox
      class="pa-0 ma-0"
      hide-details
      v-model="toggle"
      :disabled="!milestone.amount && !milestone.addition"
    />
    <div class="flex-grow-1">{{ milestone.name }}</div>
    <div v-if="isMet" class="light-green--text accent-3 font-weight-bold pr-2">MET!</div>
    <div v-if="milestone.amount" class="d-flex pr-2">
      <v-icon class="pr-1">mdi-cash</v-icon>
      <div>${{ formatAmount(milestone.amount) }}</div>
    </div>
    <div v-if="milestone.addition" class="d-flex pr-2">
      <v-icon class="pr-1">mdi-cash-plus</v-icon>
      ${{ formatAmount(milestone.addition) }}
    </div>
    <v-icon
      @click="pin"
      :disabled="(!milestone.amount && !milestone.addition) || !milestone.enabled"
    >
      <template v-if="isPinned">mdi-pin-off</template>
      <template v-else>mdi-pin</template>
    </v-icon>
    <v-icon @click="edit">
      mdi-pencil
    </v-icon>
    <v-icon @click="remove" :disabled="milestone.enabled">
      mdi-delete
    </v-icon>
  </media-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import MediaCard from '@esa-layouts/dashboard/_misc/components/MediaCard.vue';
import { DonationTotal, DonationTotalMilestones, Omnibar } from '@esa-layouts/types/schemas';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { storeModule } from '../store';

@Component({
  components: {
    MediaCard,
  },
})
export default class extends Vue {
  @Prop({ type: Object, required: true }) readonly milestone!: DonationTotalMilestones[0];
  @Prop({ type: Number, required: true }) readonly index!: number;
  @replicantNS.State((s) => s.reps.donationTotal) readonly total!: DonationTotal;
  @replicantNS.State((s) => s.reps.omnibar.pin) readonly currentPin!: Omnibar['pin'];
  dialog = false;
  nameEdit = '';
  additionToggleEdit = false;
  additionEdit = '0';
  amountEdit = '0';
  isFormValid = false;

  get toggle(): boolean {
    return this.milestone.enabled;
  }
  set toggle(val: boolean) {
    storeModule.toggleItem({ id: this.milestone.id, enabled: val });
  }

  isRequired(val: string): boolean | string {
    return !!val || 'Required';
  }

  isNumber(val: string): boolean | string {
    return !Number.isNaN(Number(val)) || 'Must be a number';
  }

  isBiggerThanZero(val: string): boolean | string {
    const num = Number(val);
    return (!!num && num > 0) || 'Must be bigger than 0';
  }

  formatAmount(val: number): string {
    return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  get disableSave(): boolean {
    return !(this.nameEdit
    && ((this.additionToggleEdit && this.additionEdit)
    || (!this.additionToggleEdit && this.amountEdit)));
  }

  get isMet(): boolean {
    return !!(this.milestone.amount && this.total >= this.milestone.amount);
  }

  get isPinned(): boolean {
    return this.currentPin?.type === 'Milestone' && this.currentPin.id === this.milestone.id;
  }

  pin(): void {
    storeModule.pinItem({ id: this.milestone.id, pinned: !this.isPinned });
  }

  edit(): void {
    this.dialog = true;
    this.nameEdit = this.milestone.name;
    this.additionToggleEdit = !!this.milestone.addition;
    this.additionEdit = this.milestone.addition?.toString() ?? '0';
    this.amountEdit = this.milestone.amount?.toString() ?? '0';
  }

  save(): void {
    const item: DonationTotalMilestones[0] = {
      id: this.milestone.id,
      name: this.nameEdit,
      enabled: this.milestone.enabled,
    };
    if (this.milestone.enabled) {
      item.addition = this.milestone.addition;
      item.amount = this.milestone.amount;
    } else {
      item.addition = this.additionToggleEdit ? Number(this.additionEdit) : undefined;
      item.amount = !this.additionToggleEdit ? Number(this.amountEdit) : undefined;
    }
    storeModule.editItem(item);
    this.dialog = false;
  }

  remove(): void {
    storeModule.removeItem(this.milestone.id);
  }
}
</script>
