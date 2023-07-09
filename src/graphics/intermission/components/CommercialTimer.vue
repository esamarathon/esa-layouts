<template>
  <div
    v-show="percentage > 0"
    class="CommercialTimer Fixed Flex"
    :style="{
      'font-size': '20px',
      background:
        `linear-gradient(to right, rgba(0, 0, 0) ${percentage}%, rgba(0, 0, 0, 0.3) 0)`,
    }"
  >
    Twitch Commercials Running
  </div>
</template>

<script lang="ts">
import gsap from 'gsap';
import { TwitchCommercialTimer } from 'speedcontrol-util/types/schemas';
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';

// Makes sure the tween doesn't break when not visible.
// Not the best option for this, but fine for now.
gsap.ticker.lagSmoothing(0);

@Component
export default class extends Vue {
  @State twitchCommercialTimer!: TwitchCommercialTimer;
  // tweened = { progress: 0 };
  // anim: gsap.core.Tween | null = null;

  get percentage(): number {
    return Math.min((this.twitchCommercialTimer.secondsRemaining
      / this.twitchCommercialTimer.originalDuration) * 100, 100);
  }

  /* startAnimation(val?: number): void {
    this.anim?.kill();
    this.tweened.progress = val
      ? 100
      : Math.min((this.twitchCommercialTimer.secondsRemaining
        / this.twitchCommercialTimer.originalDuration) * 100, 100);
    this.anim = gsap.to(this.tweened, {
      progress: 0,
      duration: val ?? this.twitchCommercialTimer.secondsRemaining,
      ease: 'none',
    });
  } */

  /* mounted(): void {
    if (this.twitchCommercialTimer.secondsRemaining > 0) {
      this.startAnimation();
    }
    nodecg.listenFor('twitchCommercialStarted', 'nodecg-speedcontrol', ({ duration }) => {
      this.startAnimation(duration);
    });
  } */
}
</script>
