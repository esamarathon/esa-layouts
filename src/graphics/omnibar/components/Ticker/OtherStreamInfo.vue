<template>
  <div
    v-if="otherStreamData && otherStreamData.runData"
    id="OtherStreamInfo"
    class="Flex"
  >
    <div class="Line1">
      Currently on @ twitch.tv/{{ data.otherChannel }}: {{ otherStreamData.runData.game }}
    </div>
    <div class="Line2">
      <span v-if="otherStreamData.runData.category">
        {{ otherStreamData.runData.category }}
      </span>
      <span v-if="otherStreamData.runData.system">
        ran on {{ otherStreamData.runData.system }}
      </span>
      <span v-if="checkForTotalPlayers(otherStreamData.runData) > 0">
        with {{ formPlayerNamesString(otherStreamData.runData) }}
      </span>
    </div>
  </div>
</template>

<script>
import clone from 'clone';

const otherStreamData = nodecg.Replicant('otherStreamData');

export default {
  name: 'OtherStreamInfo',
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      otherStreamData: null,
    };
  },
  created() {
    console.log('OtherStreamInfo: created');
    const fallback = setTimeout(() => {
      this.$emit('end'); console.log('OtherStreamInfo: fallback');
    }, 5000);
    NodeCG.waitForReplicants(otherStreamData).then(() => {
      // Skip if nothing to show.
      if (!otherStreamData.value || !otherStreamData.value.show) {
        clearTimeout(fallback);
        console.log('OtherStreamInfo: skipping');
        this.$emit('end');
      } else {
        console.log('OtherStreamInfo: showing info');
        this.otherStreamData = clone(otherStreamData.value);
        clearTimeout(fallback);
        setTimeout(() => { this.$emit('end'); console.log('OtherStreamInfo: end'); }, 25 * 1000);
      }
    });
  },
  methods: {
    formPlayerNamesString(run) {
      const namesArray = [];
      let namesList = 'No Player(s)';
      run.teams.forEach((team) => {
        const teamPlayerArray = [];
        team.players.forEach((player) => teamPlayerArray.push(player.name));
        namesArray.push(teamPlayerArray.join(', '));
      });
      if (namesList.length) {
        namesList = namesArray.join(' vs. ');
      }
      return namesList;
    },
    checkForTotalPlayers(run) {
      let amount = 0;
      run.teams.forEach((team) => team.players.forEach(() => {
        amount += 1;
      }));
      return amount;
    },
  },
};
</script>

<style scoped>
  #OtherStreamInfo {
    padding: 0 17px;
    height: 100%;
    font-weight: 500;
    flex-direction: column;
    align-items: flex-start;
  }

  .Line1 {
    font-size: 25px;
  }
  .Line2 {
    font-size: 22px;
  }
</style>
