<template>
  <div
    ref="TransitionBlock"
    :style="{
      position: 'fixed',
      display: 'flex',
      'justify-content': 'space-between',
      // left: '-5vw', // TESTING
      left: '100vw',
      width: '110vw',
      height: '100vh',
      'background-color': '#734e9e'
    }"
  >
    <div ref="LeftBox" :style="{ background: '#fdbb1c', width: `${150 * zoom}px` }" />
    <img src="./esa-big-logo-2-summer.svg" :style="{ width: '75vw' }">
    <div ref="RightBox" :style="{ background: '#fdbb1c', width: `${75 * zoom}px` }" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';
import gsap from 'gsap';
import { SlowMo } from 'gsap/EasePack';
import { getZoomAmount } from '../_misc/helpers';

gsap.registerPlugin(SlowMo);

@Component
export default class extends Vue {
  @Ref('TransitionBlock') transitionBlock!: HTMLElement;
  @Ref('LeftBox') leftBox!: HTMLElement;
  @Ref('RightBox') rightBox!: HTMLElement;
  timeline = gsap.timeline({ paused: true });
  zoom = getZoomAmount();

  mounted(): void {
    const slowdown = 1.2;
    this.timeline.to(this.transitionBlock, {
      x: '-210vw',
      duration: slowdown * 1,
      ease: 'slow(0.1, 0.8, false)',
    }, 0);
    this.timeline.to(this.leftBox, { width: `${75 * this.zoom}px`, duration: slowdown * 0.5 }, 0);
    this.timeline.to(this.rightBox, {
      width: `${150 * this.zoom}px`,
      duration: slowdown * 0.5,
    }, slowdown * 0.5);

    nodecg.listenFor('showTransition', () => {
      this.timeline.restart();
    });
  }
}
</script>
