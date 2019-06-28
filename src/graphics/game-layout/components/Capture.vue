<template>
  <div
    v-capture-change
    class="Capture"
  />
</template>

<script>
import Vue from 'vue';

// Keeps track of when the captures change and sends it to the NodeCG server.
const captureChange = Vue.directive('captureChange', {
  inserted(el) {
    const cssID = el.id;
    const cssClass = el.classList[1]; // It *should* always be the second one.
    const sizes = el.getClientRects();

    // Get the widths of all the borders to figure out the position/size without them.
    const topBorder = getComputedStyle(el).getPropertyValue('border-top-width');
    const rightBorder = getComputedStyle(el).getPropertyValue('border-right-width');
    const bottomBorder = getComputedStyle(el).getPropertyValue('border-bottom-width');
    const leftBorder = getComputedStyle(el).getPropertyValue('border-left-width');

    nodecg.sendMessage('captureChange', {
      cssID,
      cssClass,
      sizes: {
        x: sizes[0].x + Number(leftBorder),
        y: sizes[0].y + Number(topBorder),
        width: sizes[0].width - Number(rightBorder) - Number(leftBorder),
        height: sizes[0].height - Number(bottomBorder) - Number(topBorder),
      },
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
    position: fixed;
    background-color: black;
  }
</style>
