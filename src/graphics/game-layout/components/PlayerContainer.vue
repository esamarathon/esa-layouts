<!-- This component handles each team's player information. -->
<!-- It listens to the data from nodecg-speedcontrol and creates PlayerInfo component instances. -->

<template>
  <div class="PlayerContainer">
    <player-info
      v-for="(player, index) in players"
      :key="`${index}${Date.now()}`"
      :players="player"
      :player-slot="(teamId >= 0 && coop < 0) ? teamId : -1"
      :team-id="teamId"
    ></player-info>
  </div>
</template>

<script>
import clone from 'clone';
import Vue from 'vue';
import PlayerInfo from './PlayerInfo.vue';

export default {
  name: 'PlayerContainer',
  components: {
    PlayerInfo,
  },
  props: {
    teamId: {
      type: Number,
      default: -1,
    },
    single: {
      type: Boolean,
      default: false,
    },
    coop: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      players: [],
    };
  },
  mounted() {
    Vue.prototype.$sc.runDataActiveRun.on('change', this.updateData);
  },
  destroyed() {
    Vue.prototype.$sc.runDataActiveRun.removeListener('change', this.updateData);
  },
  methods: {
    updateData(data) {
      this.players.length = 0;
      const id = (this.teamId >= 0) ? this.teamId : 0;
      if (data.teams[id]) {
        const players = clone(data.teams[id].players);
        if (this.single) {
          this.players.push(players);
        } else if (this.coop >= 0) {
          this.players.push([players[this.coop]]);
        } else {
          players.forEach(player => this.players.push([player]));
        }
      }
    },
  },
};
</script>

<style scoped>
  .PlayerContainer {
    width: 100%;
  }

  .PlayerContainer >>> .PlayerInfoBox:nth-of-type(n+2) {
    margin-top: 3px;
  }
</style>
