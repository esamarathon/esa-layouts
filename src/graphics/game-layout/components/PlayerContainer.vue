<template>
  <div class="PlayerContainer">
    <player-info></player-info>
  </div>
</template>

<script>
import PlayerInfo from './PlayerInfo.vue';

export default {
  name: 'PlayerContainer',
  components: {
    PlayerInfo,
  },
};
</script>

<style scoped>
  .PlayerContainer {
    width: 100%;
  }

  .PlayerInfoBox:nth-of-type(n+2) {
    margin-top: 3px;
  }
</style>
