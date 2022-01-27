<template>
  <v-card class="pa-2 mt-2">
    <div>
      <span class="font-weight-bold">Type:</span>
      Upcoming Run
    </div>
    <div>
      <span class="font-weight-bold">Length:</span>
      {{ seconds }} seconds
    </div>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'UpcomingRun',
})
export default class extends Vue {
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
}
</script>
