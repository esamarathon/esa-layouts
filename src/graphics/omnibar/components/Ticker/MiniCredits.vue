<template>
  <div
    ref="MiniCredits"
    class="Flex Alert"
    :style="{
      padding: '0 17px',
      height: '100%',
      'font-weight': 500,
      'flex-direction': 'column',
      'align-items': 'flex-start',
      'overflow': 'hidden',
    }"
  >
    <div :style="{ 'font-size': '21px' }">
      {{ config.omnibar.miniCredits.header }}
    </div>
    <div
      ref="Msg"
      :style="{
        position: 'relative',
        'font-size': '29px',
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
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import gsap from 'gsap';
import { Configschema } from '@esa-layouts/types/schemas';

@Component({
  name: 'MiniCredits',
})
export default class extends Vue {
  @Prop({ type: String, default: 'Message?' }) readonly msg!: string;
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
  @Ref('MiniCredits') elem!: HTMLDivElement;
  @Ref('Msg') msgElem!: HTMLDivElement;
  config = nodecg.bundleConfig as Configschema;

  async created(): Promise<void> {
    // TODO: Allow the animation to be cancelled (not sure if needed but good practice to).
    await wait(4000);
    const { paddingLeft, paddingRight } = getComputedStyle(this.elem);
    const maxWidth = this.elem.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
    const msgWidth = this.msgElem.clientWidth;
    const scrollAmount = msgWidth - maxWidth;
    if (scrollAmount > 0) {
      gsap.to(this.msgElem, {
        x: `-${scrollAmount}px`,
        duration: this.seconds - 4,
        ease: 'none',
        onComplete: () => {
          window.setTimeout(() => {
            this.$emit('end');
          }, 2000);
        },
      });
    } else {
      await wait((this.seconds - 4) * 1000); // Wait the specified length.
      this.$emit('end');
    }
  }
}
</script>
