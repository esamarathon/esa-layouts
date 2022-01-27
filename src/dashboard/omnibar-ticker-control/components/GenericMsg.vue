<template>
  <v-card class="pa-2 mt-2">
    <div>
      <span class="font-weight-bold">Type:</span>
      Generic Message
    </div>
    <div>
      <span class="font-weight-bold">Message:</span>
      {{ msg }}
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
  name: 'GenericMsg',
})
export default class extends Vue {
  @Prop({ type: String, default: 'Message?' }) readonly msg!: string;
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
}
</script>
