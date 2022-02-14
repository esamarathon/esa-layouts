<template>
  <div
    ref="MiniCredits"
    class="Flex Alert MiniCredits"
    :style="{
      padding: '0 17px',
      height: '100%',
      'flex-direction': 'column',
      'align-items': 'flex-start',
      'overflow': 'hidden',
    }"
  >
    <div :style="{ 'font-size': '21px' }">
      {{ config.omnibar.miniCredits.header }}
    </div>
    <div
      class="Msg"
      ref="Msg"
      :style="{
        position: 'relative',
        'font-size': '29px',
        'white-space': 'nowrap',
        'overflow': 'hidden',
      }"
    >
      <span v-if="players && players.length">
        <span class="Title">
          <template v-if="players.length >= 2">Runners:</template>
          <template v-else>Runner:</template>
        </span> {{ players.join(', ')}}
      </span>
      <span v-if="comms && comms.length">
        <span class="Title">
          <template v-if="comms.length >= 2">Commentators:</template>
          <template v-else>Commentator:</template>
        </span> {{ comms.join(', ')}}
      </span>
      <span v-if="reader">
        <span class="Title">Donation Reader:</span> {{ reader }}
      </span>
      <span v-if="screeners">
        <span class="Title">Donation Screeners:</span> {{ screeners }}
      </span>
      <span v-if="tech">
        <span class="Title">Tech Crew:</span> {{ tech }}
      </span>
      <span v-if="donatorsFormatted.length">
        <span class="Title">
          <template v-if="donatorsFormatted.length >= 2">Donators:</template>
          <template v-else>Donator:</template>
        </span> {{ donatorsFormatted.join(', ') }}
      </span>
      <span v-if="subsFormatted.length">
        <span class="Title">
          <template v-if="subsFormatted.length >= 2">Subscribers:</template>
          <template v-else>Subscriber:</template>
        </span> {{ subsFormatted.join(', ')}}
      </span>
      <span v-if="cheersFormatted.length">
        <span class="Title">
          <template v-if="cheersFormatted.length >= 2">Cheers:</template>
          <template v-else>Cheer:</template>
        </span> {{ cheersFormatted.join(', ')}}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import gsap from 'gsap';
import { Configschema } from '@esa-layouts/types/schemas';
import { formatUSD } from '@esa-layouts/graphics/_misc/helpers';

@Component({
  name: 'MiniCredits',
})
export default class extends Vue {
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
  @Prop(Array) readonly players!: string[] | undefined;
  @Prop(Array) readonly comms!: string[] | undefined;
  @Prop(String) readonly reader!: string | undefined;
  @Prop(String) readonly screeners!: string | undefined;
  @Prop(String) readonly tech!: string | undefined;
  @Prop(Array) readonly donators!: [string, number][] | undefined;
  @Prop(Array) readonly subscribers!: [string, number][] | undefined;
  @Prop(Array) readonly cheers!: [string, number][] | undefined;
  @Ref('MiniCredits') elem!: HTMLDivElement;
  @Ref('Msg') msgElem!: HTMLDivElement;
  config = nodecg.bundleConfig as Configschema;
  timeline: gsap.core.Timeline | undefined;
  timeout = 0;

  get donatorsFormatted(): string[] {
    return this.donators?.map(([k, v]) => `${k} (${formatUSD(v)})`) || [];
  }

  get cheersFormatted(): string[] {
    return this.cheers?.map(([k, v]) => `${k} (${v} bits)`) || [];
  }

  get subsFormatted(): string[] {
    return this.subscribers?.map(([k, v]) => {
      if (v > 1) return `${k} (x${v})`;
      return k;
    }) || [];
  }

  async created(): Promise<void> {
    this.timeout = window.setTimeout(() => {
      const { paddingLeft, paddingRight } = getComputedStyle(this.elem);
      const maxWidth = this.elem.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
      const msgWidth = this.msgElem.clientWidth;
      const scrollAmount = msgWidth - maxWidth;
      if (scrollAmount > 0) {
        const pps = 110; // Pixels Per Second
        // const minLength = this.seconds - 4;
        // const length = Math.max(Math.round(scrollAmount / pps), minLength);
        const length = Math.round(scrollAmount / pps);
        this.timeline = gsap.timeline({
          onComplete: () => {
            window.setTimeout(() => {
              this.$emit('end');
            }, 2000);
          },
        });
        this.timeline.to(this.msgElem, {
          x: `-${scrollAmount}px`,
          duration: length,
          ease: 'none',
        });
      } else {
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => {
          this.$emit('end');
        }, (this.seconds - 4) * 1000); // Wait the specified length.
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

<style scoped>
  .Msg > span + span::before {
    content: '';
    margin: 0 10px 0 7px;
  }

  .Title {
    font-weight: 600;
  }
</style>
