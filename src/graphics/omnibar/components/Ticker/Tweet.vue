<template>
  <div
    class="Flex"
    :style="{
      padding: '0 17px',
      height: '100%',
      'font-weight': 500,
      'flex-direction': 'column',
      'align-items': 'flex-start',
      'background-color': '#ffffff38', // TODO: Merge into theme or improve!
    }"
  >
    <div :style="{ 'font-size': '25px' }">
      <img
        src="../img/Twitter.png"
        :style="{
          height: '1.2em',
          margin: '0 .05em 0 .1em',
          'vertical-align': '-0.25em',
        }"
      >
      {{ user }}
    </div>
    <div
      :style="{
        'font-size': '23px',
        'white-space': 'nowrap',
        'overflow': 'hidden',
      }"
    >
      {{ msg }}
    </div>
  </div>
</template>

<script lang="ts">
import { wait } from '@esa-layouts/graphics/_misc/helpers';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'CrowdControl',
})
export default class extends Vue {
  @Prop({ type: String, default: 'User?' }) readonly user!: string;
  @Prop({ type: String, default: 'Message?' }) readonly msg!: string;
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;

  async created(): Promise<void> {
    await wait(this.seconds * 1000); // Wait the specified length.
    // TODO: Scroll if needed!
    this.$emit('end');
  }
}
</script>
