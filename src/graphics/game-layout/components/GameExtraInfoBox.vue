<template>
  <transition
    name="fade"
    mode="out-in"
  >
    <div
      v-if="show"
      id="GameExtraInfoBox"
      ref="name"
      :key="keyValue"
      class="GameInfoBox FlexContainer"
    >
      {{ name }}
    </div>
  </transition>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'GameExtraInfoBox',
  data() {
    return {
      name: '',
      keyValue: false,
      show: false,
    };
  },
  mounted() {
    Vue.prototype.$sc.runDataActiveRun.on('change', (runData) => {
      if (runData) {
        this.show = true;
        this.keyValue = !this.keyValue; // Triggers the transition.
        this.name = runData.category;
      } else {
        this.show = false;
      }
    });
  },
};
</script>

<style>
  @import url('./GameInfoBox.css');
  @import url('./FlexContainer.css');

  #GameExtraInfoBox {
    font-size: 25px;
    background-color: cadetblue
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
