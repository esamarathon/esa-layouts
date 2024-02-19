<template>
  <layout-base
    game-left="750px"
    game-width="1170px"
    camera-width="750px"
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
  // code
}
</script>
