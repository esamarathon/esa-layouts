<template>
  <div class="Donation">
    <div class="NameTotal">
      #{{ index + 1 }}: {{ data.name }} donated ${{ data.amount.toFixed(2) }}
    </div>
    <div
      v-if="data.comment"
      class="Comment"
    >
      {{ data.comment }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormattedDonation } from 'types';

@Component
export default class extends Vue {
  @Prop(Object) readonly data!: FormattedDonation;
  @Prop({ default: 0 }) readonly index!: number;
}
</script>

<style scoped>
  .Donation {
    padding: 20px 0;
    border-top: 3px solid white;
  }

  .NameTotal {
    font-size: 35px;
  }

  .Comment {
    font-size: 25px;
  }
</style>
