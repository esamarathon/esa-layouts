<template>
  <layout-base
    game-left="796px"
    game-width="1124px"
    game-height="843px"
    camera-width="796px"
    camera-height="798px"
    participants-height="798px"
    :participants-border-bottom="false"
    game-info-media-box-top="843px"
    game-info-media-box-height="157px"
    donation-bar-top="798px"
    donation-bar-width="796px"
    donation-bar-height="45px"
    :donation-bar-box-padding="7"
    donation-bar-box-font-size="25px"
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
