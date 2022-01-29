<template>
  <v-dialog class="Dialog" v-model="dialog" persistent>
    <v-card>
      <v-card-text v-if="item" class="pa-4 pb-0"><!-- TODO: move v-if? -->
        <v-form v-model="isFormValid">
          <!-- Length (seconds) -->
          <v-text-field
            :value="item.props.seconds"
            @change="secondsChanged"
            :label="secondsStr"
            prepend-icon="mdi-timer"
            autocomplete="off"
            :rules="[isRequired, isNumber, isBiggerThan]"
            filled
            dense
            type="number"
            :min="5"
          />
          <!-- Additional Fields -->
          <v-text-field
            v-for="{ name, key, icon } in additionalFields"
            v-model="item.props[key]"
            :key="key"
            :label="name"
            :prepend-icon="icon"
            autocomplete="off"
            :rules="[isRequired]"
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
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Omnibar } from '@esa-layouts/types/schemas';
import clone from 'clone';
import { storeModule } from '../store';

@Component
export default class extends Vue {
  item: Omnibar['rotation'][0] | null = null;
  isFormValid = false;

  get dialog(): boolean { return storeModule.editDialog; }
  set dialog(val: boolean) { storeModule.toggleEditDialog(val); }

  get secondsStr(): string {
    if (this.item?.type === 'Bid') return 'Minimum Length (seconds)';
    return 'Length (seconds)';
  }

  get additionalFields(): { name: string, key: string, icon: string }[] {
    switch (this.item?.type) {
      case 'GenericMsg':
        return [
          {
            name: 'Message',
            key: 'msg',
            icon: 'mdi-android-messages',
          },
        ];
      default:
        return [];
    }
  }

  @Watch('dialog')
  onDialogChanged(val: boolean): void {
    if (val) { // Open
      this.item = clone(storeModule.localRotation
        .find((r) => r.id === storeModule.editItemId)) || null;
    } else { // Close
      this.item = null;
    }
  }

  // Validation functions.
  isRequired(val: string): boolean | string {
    return !!val || 'Required';
  }
  isNumber(val: string): boolean | string {
    return !Number.isNaN(Number(val)) || 'Must be a number';
  }
  isBiggerThan(val: string): boolean | string {
    const num = Number(val);
    return (!!num && num >= 5) || 'Must be 5 or higher';
  }

  secondsChanged(val: string): void {
    if (this.item?.props?.seconds && !Number.isNaN(Number(val))) {
      this.item.props.seconds = Number(val);
    }
  }

  save(): void {
    if (this.item) {
      storeModule.updateLocalItem(this.item);
      this.dialog = false;
    }
  }
}
</script>
