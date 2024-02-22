<template>
  <layout-base
    :camera-height="thisEvent === 2 ? `550px` : undefined"
    :participants-zoom="0.85"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LayoutBase from './esaw24-base.vue';

@Component({
  components: {
    LayoutBase,
  },
})
export default class extends Vue {
  thisEvent = nodecg.bundleConfig.event.thisEvent;
}
</script>
