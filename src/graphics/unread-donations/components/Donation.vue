<template>
  <div :style="{ padding: '20px 0', 'border-top': '3px solid white' }">
    <div :style="{ 'font-size': '35px' }">
      #{{ index + 1 }}: {{ data.name }} donated ${{ data.amount.toFixed(2) }}
    </div>
    <div
      v-if="data.comment"
      :style="{ 'font-size': '25px' }"
    >
      {{ data.comment }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Tracker } from '@shared/types';

@Component
export default class extends Vue {
  @Prop(Object) readonly data!: Tracker.FormattedDonation;
  @Prop({ default: 0 }) readonly index!: number;
}
</script>
