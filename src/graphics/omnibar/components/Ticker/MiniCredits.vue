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
  timeline: gsap.core.Timeline | undefined;
  timeout = 0;

  async created(): Promise<void> {
    this.timeout = window.setTimeout(() => {
      const { paddingLeft, paddingRight } = getComputedStyle(this.elem);
      const maxWidth = this.elem.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
      const msgWidth = this.msgElem.clientWidth;
      const scrollAmount = msgWidth - maxWidth;
      if (scrollAmount > 0) {
        this.timeline = gsap.timeline({
          onComplete: () => {
            window.setTimeout(() => {
              this.$emit('end');
            }, 2000);
          },
        });
        this.timeline.to(this.msgElem, {
          x: `-${scrollAmount}px`,
          duration: this.seconds - 4,
          ease: 'none',
        });
      } else {
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => {
          this.$emit('end');
        }, 4000); // Wait the specified length.
      }
    }, 4000); // Wait the specified length.
  }

  beforeDestroy(): void {
    this.timeline?.kill();
    delete this.timeline;
    window.clearTimeout(this.timeout);
  }
}
</script>
