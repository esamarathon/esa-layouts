<template>
  <div
    class="Flex"
    :style="{
      'font-size': '33px',
      'white-space': 'nowrap',
      'font-weight': 500,
    }"
  >
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { wait } from '@esa-layouts/graphics/_misc/helpers';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'GenericMsg',
})
export default class extends Vue {
  @Prop({ type: String, default: 'Message?' }) readonly msg!: string;
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;

  async created(): Promise<void> {
    await wait(this.seconds * 1000); // Wait the specified length.
    this.$emit('end');
  }
}
</script>
