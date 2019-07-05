<!-- This component handles each team's player information. -->
<!-- It listens to the data from nodecg-speedcontrol and creates PlayerInfo component instances. -->

<template>
  <div class="PlayerContainer" />
</template>

<script>
import Vue from 'vue';
import PlayerInfo from './PlayerInfo.vue';

const PlayerInfoClass = Vue.extend(PlayerInfo);

export default {
  name: 'PlayerContainer',
  props: {
    teamId: {
      type: Number,
      default: -1,
    },
    single: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    Vue.prototype.$sc.runDataActiveRun.on('change', this.updateData);
  },
  destroyed() {
    Vue.prototype.$sc.runDataActiveRun.removeListener('change', this.updateData);
  },
  methods: {
    updateData(data) {
      while (this.$el.firstChild && this.$el.removeChild(this.$el.firstChild));
      const id = (this.teamId >= 0) ? this.teamId : 0;
      if (data.teams[id]) {
        const { players } = data.teams[id];
        if (this.single) {
          this.addPlayer(players);
        } else {
          players.forEach((player) => {
            this.addPlayer(player);
          });
        }
      }
    },
    addPlayer(players) {
      const instance = new PlayerInfoClass({
        propsData: {
          players: (Array.isArray(players)) ? players.slice(0) : [players],
          playerSlot: (this.teamId >= 0) ? this.teamId : -1,
          teamId: this.teamId,
        },
      }).$mount();
      this.$el.appendChild(instance.$el);
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
