<template>
  <media-card
    class="d-flex align-center px-2"
    :style="{ 'text-align': 'unset' }"
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
            />
            <v-text-field
              v-if="additionToggleEdit"
              v-model="additionEdit"
              prepend-icon="mdi-cash-plus"
              autocomplete="off"
              :rules="[isRequired, isNumber, isBiggerThanZero]"
              filled
              dense
            />
            <v-text-field
              v-else
              v-model="amountEdit"
              prepend-icon="mdi-cash"
              autocomplete="off"
              :rules="[isRequired, isNumber, isBiggerThanZero]"
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
    <v-checkbox class="pa-0 ma-0" hide-details v-model="toggle" />
    <div class="flex-grow-1">{{ milestone.name }}</div>
    <div v-if="milestone.amount">
      <v-icon>mdi-cash</v-icon>
      ${{ milestone.amount }}
    </div>
    <div v-if="milestone.addition">
      <v-icon>mdi-cash-plus</v-icon>
      ${{ milestone.addition }}
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import MediaCard from '@esa-layouts/dashboard/_misc/components/MediaCard.vue';
import { DonationTotalMilestones } from '@esa-layouts/types/schemas';
import { storeModule } from '../store';

@Component({
  components: {
    MediaCard,
  },
})
export default class extends Vue {
  @Prop({ type: Object, required: true }) readonly milestone!: DonationTotalMilestones[0];
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

  get disableSave(): boolean {
    return !(this.nameEdit
    && ((this.additionToggleEdit && this.additionEdit)
    || (!this.additionToggleEdit && this.amountEdit)));
  }

  edit(): void {
    this.dialog = true;
    this.nameEdit = this.milestone.name;
    this.additionToggleEdit = !!this.milestone.addition;
    this.additionEdit = this.milestone.addition?.toString() ?? '0';
    this.amountEdit = this.milestone.amount?.toString() ?? '0';
  }

  save(): void {
    storeModule.editItem({
      id: this.milestone.id,
      name: this.nameEdit,
      enabled: this.milestone.enabled,
      addition: this.additionToggleEdit ? Number(this.additionEdit) : undefined,
      amount: !this.additionToggleEdit ? Number(this.amountEdit) : undefined,
    });
    this.dialog = false;
  }

  remove(): void {
    storeModule.removeItem(this.milestone.id);
  }
}
</script>
