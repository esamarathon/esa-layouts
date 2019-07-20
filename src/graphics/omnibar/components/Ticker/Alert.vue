<template>
  <div
    id="Alert"
    class="FlexContainer"
  >
    <div class="Line1">
      {{ line1 }}
    </div>
    <div
      v-if="line2"
      ref="Line2"
      class="Line2"
      :style="{
        width: (width > 0) ? `${width}px` : 'inherit'
      }"
    >
      {{ line2 }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { TweenLite, Linear } from 'gsap';
// eslint-disable-next-line no-unused-vars
import ScrollToPlugin from 'gsap/umd/ScrollToPlugin';

export default {
  name: 'Alert',
  props: {
    data: {
      type: Object,
      default() {
        return {
          line1Text: '',
          line2Text: '',
        };
      },
    },
  },
  data() {
    return {
      width: 0,
      line1: '',
      line2: '',
    };
  },
  mounted() {
    const fallback = setTimeout(() => this.$emit('end'), 5000);
    const originalWidth = this.$parent.$el.clientWidth - 34;
    this.line1 = this.data.line1Text;
    this.line2 = this.data.line2Text;
    if (!this.line2) {
      setTimeout(() => this.$emit('end'), 10 * 1000);
    } else {
      Vue.nextTick().then(() => {
        this.width = originalWidth;
        setTimeout(() => {
          clearTimeout(fallback);
          const amountToScroll = this.$refs.Line2.scrollWidth - originalWidth;
          const timeToScroll = (amountToScroll * 13) / 1000;
          const timeToShow = (timeToScroll > 10) ? timeToScroll : 6;
          TweenLite.to(this.$refs.Line2, timeToShow, {
            scrollTo: { x: 'max' },
            ease: Linear.easeNone,
            onComplete: () => {
              setTimeout(() => this.$emit('end'), 2 * 1000);
            },
          });
        }, 2 * 1000);
      });
    }
  },
};
</script>

<style scoped>
  @import url('../../../_misc/components/FlexContainer.css');

  #Alert {
    padding: 0 17px;
    height: 100%;
    font-weight: 500;
    flex-direction: column;
    align-items: flex-start;
    background-color: #ffffff38;
  }

  .Line1 {
    font-size: 25px;
  }
  .Line2 {
    font-size: 23px;
    white-space: nowrap;
    overflow: hidden;
  }

</style>
