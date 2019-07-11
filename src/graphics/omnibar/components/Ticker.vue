<template>
  <div
    id="Ticker"
  >
    <transition
      name="fade"
      mode="out-in"
    >
      <component
        :is="currentComponent.name"
        :key="timestamp"
        :data="currentComponent.data"
        @end="changeMessage"
      ></component>
    </transition>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import { serverBus } from '../main.js';
import GenericMessage from './Ticker/GenericMessage.vue';

export default {
  name: 'Ticker',
  data() {
    return {
      currentComponent: {
        name: '',
        data: {},
      },
      timestamp: Date.now(),
      canChange: false,
    };
  },
  mounted() {
    serverBus.$on('tick', () => {
      if (this.canChange) {
        // TODO: more logic to change message

        // this needs to run whenever you want to transition
        // this.timestamp = Date.now();

        this.canChange = false;
      }
    });

    this.currentComponent = {
      name: GenericMessage,
      data: {
        msg: 'This is European Speedrunner Assembly Summer 2019',
      },
    };
  },
  methods: {
    changeMessage() {
      this.canChange = true;
    },
  },
};
</script>

<style scoped>
  @import url('../../_misc/components/FlexContainer.css');

  #Ticker {
    flex: 1;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
