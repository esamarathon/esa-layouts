<template>
  <div
    v-if="show"
    id="OffscreenBox"
    class="RunInfoBox FlexContainer"
  >
    <span class="Header">
      Offscreen:
    </span>
    &nbsp;{{ text }}
  </div>
</template>

<script>
import SpeedcontrolUtil from 'speedcontrol-util';

const sc = new SpeedcontrolUtil(nodecg);

export default {
  name: 'Offscreen',
  data() {
    return {
      text: '',
      show: false,
      players: [],
    };
  },
  watch: {
    players(val) {
      this.show = val.length > 0;
      this.text = val.join(', ');
    },
  },
  created() {
    sc.runDataActiveRun.on('change', (newVal) => {
      const players = newVal.teams[0].players.slice(4);
      players.forEach((player) => {
        this.players.push(player.name);
      });
    });
  },
};
</script>

<style scoped>
  @import url('./RunInfoBox.css');
  @import url('../../_misc/components/FlexContainer.css');

  #OffscreenBox {
    font-size: 25px;
    font-weight: 400;
    color: var(--font-colour-inverted);
    background-color: var(--commentators-bg-colour);
    padding: 5px;
  }

  .Header {
    font-weight: 500;
  }
</style>
