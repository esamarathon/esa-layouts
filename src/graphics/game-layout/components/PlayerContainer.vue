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
    teamID: {
      type: Number,
      default: 0,
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
      const { players } = data.teams[this.teamID];
      if (players) {
        players.forEach((player) => {
          this.addPlayer(player.name, player.social.twitch, player.country);
        });
      }
    },
    addPlayer(name, twitch, country) {
      const instance = new PlayerInfoClass({
        propsData: {
          name,
          twitch,
          country,
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
