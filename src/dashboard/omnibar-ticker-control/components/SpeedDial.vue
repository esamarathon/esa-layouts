<template>
  <v-speed-dial v-model="fab" top right direction="left" absolute>
    <template v-slot:activator>
      <v-btn v-model="fab" color="blue darken-2" fab x-small>
        <v-icon v-if="fab">mdi-close</v-icon>
        <v-icon v-else>mdi-cog</v-icon>
      </v-btn>
    </template>
    <v-btn fab x-small color="green" @click="edit">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn fab x-small color="red" @click="del">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { storeModule } from '../store';

@Component
export default class extends Vue {
  @Prop({ type: String, required: true }) readonly id!: string;
  fab = false;

  edit(): void {
    storeModule.changeEditItemId(this.id);
    storeModule.toggleEditDialog(true);
  }

  del(): void {
    storeModule.deleteItem(this.id);
  }
}
</script>
