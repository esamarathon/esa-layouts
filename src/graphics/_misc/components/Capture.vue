<template>
  <div
    v-capture-change
    class="Capture"
  >
    <slot />
  </div>
</template>

<script>
import Vue from 'vue';

// Keeps track of when the captures change and sends it to the NodeCG server.
const captureChange = Vue.directive('captureChange', {
  inserted(el) {
    const cssID = el.id;
    const cssClass = el.classList[1]; // It *should* always be the second one.
    const sizes = el.getBoundingClientRect();

    // Get the widths of all the borders to figure out the position/size without them.
    const topBorder = getComputedStyle(el).getPropertyValue('border-top-width');
    const rightBorder = getComputedStyle(el).getPropertyValue('border-right-width');
    const bottomBorder = getComputedStyle(el).getPropertyValue('border-bottom-width');
    const leftBorder = getComputedStyle(el).getPropertyValue('border-left-width');

    const calcSizes = {
      x: sizes.x + parseInt(leftBorder, 0),
      y: sizes.y + parseInt(topBorder, 0),
      width: sizes.width - parseInt(rightBorder, 0) - parseInt(leftBorder, 0),
      height: sizes.height - parseInt(bottomBorder, 0) - parseInt(topBorder, 0),
    };

    nodecg.sendMessage('captureChange', {
      cssID,
      cssClass,
      sizes: calcSizes,
    });
  },
  unbind(el) {
    const cssID = el.id;
    const cssClass = el.classList[1]; // It *should* always be the second one.

    nodecg.sendMessage('captureChange', {
      cssID,
      cssClass,
      sizes: null,
    });
  },
});

export default {
  name: 'Capture',
  directives: {
    captureChange,
  },
};
</script>

<style scoped>
  .Capture {
    box-sizing: border-box;
    position: fixed;
  }
</style>
