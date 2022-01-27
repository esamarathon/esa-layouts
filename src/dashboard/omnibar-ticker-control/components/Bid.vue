<template>
  <v-card class="pa-2 mt-2">
    <div>
      <span class="font-weight-bold">Type:</span>
      Bid
    </div>
    <div>
      <span class="font-weight-bold">Length (min):</span>
      {{ seconds }} seconds
    </div>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'Bid',
})
export default class extends Vue {
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
}
</script>
