<template>
  <div
    class="Flex"
    :style="{
      'font-size': lines < 2 ? '33px' : '29px',
      'white-space': 'nowrap',
      'font-weight': 500,
      'text-align': 'center',
      'line-height': '100%',
    }"
  >
    <span :style="{ 'white-space': 'pre' }">{{ msg }}</span>
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

  get lines(): number {
    return this.msg.split('\n').length;
  }

  async created(): Promise<void> {
    await wait(this.seconds * 1000); // Wait the specified length.
    this.$emit('end');
  }
}
</script>
