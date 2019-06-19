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
    const sizes = el.getBoundingClientRect();

    nodecg.sendMessage('captureChange', {
      cssID,
      cssClass,
      sizes,
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
