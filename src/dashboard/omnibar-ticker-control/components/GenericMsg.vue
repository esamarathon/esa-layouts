<template>
  <v-card class="pa-2">
    <speed-dial :id="id" />
    <div>
      <span class="font-weight-bold">Type:</span>
      Generic Message
    </div>
    <div class="d-flex">
      <div class="font-weight-bold mr-1">Message:</div>
      <div :style="{ 'white-space': 'pre-wrap' }">{{ msg }}</div>
    </div>
    <div>
      <span class="font-weight-bold">Length:</span>
      {{ seconds }} seconds
    </div>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import SpeedDial from './SpeedDial.vue';

@Component({
  name: 'GenericMsg',
  components: {
    SpeedDial,
  },
})
export default class extends Vue {
  @Prop({ type: String, required: true }) readonly id!: string;
  @Prop({ type: String, default: 'Message?' }) readonly msg!: string;
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
  fab = false;
}
</script>
