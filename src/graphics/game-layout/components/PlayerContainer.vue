<!-- This component handles each team's player information. -->
<!-- It listens to the data from nodecg-speedcontrol and creates PlayerInfo component instances. -->

<template>
  <div class="PlayerContainer">
    <player-info
      v-for="(player, index) in players"
      :key="`${index}${Date.now()}`"
      :players="player"
      :player-slot="(teamIndex >= 0 && coop < 0) ? teamIndex : -1"
      :team-index="teamIndex"
    ></player-info>
  </div>
</template>

<script>
import clone from 'clone';
import PlayerInfo from './PlayerInfo.vue';

export default {
  name: 'PlayerContainer',
  components: {
    PlayerInfo,
  },
  props: {
    teamIndex: {
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
      relay: false,
    };
  },
  mounted() {
    nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol')
      .on('change', this.updateData);
    nodecg.Replicant('smbRelay')
      .on('change', this.updateRelayPlayer);
  },
  destroyed() {
    nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol')
      .removeListener('change', this.updateData);
    nodecg.Replicant('smbRelay')
      .removeListener('change', this.updateRelayPlayer);
  },
  methods: {
    updateRelayPlayer(data) {
      if (this.relay) {
        this.players = [[{ name: data.players[data.current], social: {} }]];
      }
    },
    updateData(data) {
      if (data && data.customData.id !== '260e49dc5db49745a4640d81') {
        this.relay = false;
        this.players.splice(0, this.players.length);
        const id = (this.teamIndex >= 0) ? this.teamIndex : 0;
        if (data && data.teams[id]) {
          const players = clone(data.teams[id].players);
          if (this.single) {
            this.players.push(players);
          } else if (this.coop >= 0) {
            this.players.push([players[this.coop]]);
          } else {
            players.forEach(player => this.players.push([player]));
          }
        }
      } else {
        this.relay = true;
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
