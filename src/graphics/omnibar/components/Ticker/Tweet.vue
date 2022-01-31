<template>
  <div
    ref="Tweet"
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
      ref="Msg"
      :style="{
        position: 'relative',
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
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import gsap from 'gsap';

@Component({
  name: 'CrowdControl',
})
export default class extends Vue {
  @Prop({ type: String, default: 'User?' }) readonly user!: string;
  @Prop({ type: String, default: 'Message?' }) readonly msg!: string;
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
  @Ref('Tweet') elem!: HTMLDivElement;
  @Ref('Msg') msgElem!: HTMLDivElement;

  async mounted(): Promise<void> {
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
