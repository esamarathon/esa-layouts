<template>
  <div
    v-if="otherStreamInfo"
    id="OtherStreamInfo"
    class="FlexContainer"
  >
    <div class="Line1">
      Currently on @ twitch.tv/{{ data.otherChannel }}: {{ otherStreamInfo.game }}
    </div>
    <div class="Line2">
      <span v-if="otherStreamInfo.category">
        {{ otherStreamInfo.category }}
      </span>
      <span v-if="otherStreamInfo.system">
        ran on {{ otherStreamInfo.system }}
      </span>
      <span v-if="checkForTotalPlayers(otherStreamInfo) > 0">
        with {{ formPlayerNamesString(otherStreamInfo) }}
      </span>
    </div>
  </div>
</template>

<script>
import clone from 'clone';

const otherStreamInfoRep = nodecg.Replicant('otherStreamInfo');
const otherStreamInfoShowRep = nodecg.Replicant('otherStreamInfoShow');

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
      otherStreamInfo: null,
    };
  },
  created() {
    const fallback = setTimeout(() => this.$emit('end'), 5000);
    NodeCG.waitForReplicants(otherStreamInfoRep, otherStreamInfoShowRep).then(() => {
      // Skip if nothing to show.
      if (!otherStreamInfoRep.value || !otherStreamInfoShowRep.value) {
        this.$emit('end');
      } else {
        this.otherStreamInfo = clone(otherStreamInfoRep.value);
        clearTimeout(fallback);
        setTimeout(() => this.$emit('end'), 25 * 1000);
      }
    });
  },
  methods: {
    formPlayerNamesString(run) {
      const namesArray = [];
      let namesList = 'No Player(s)';
      run.teams.forEach((team) => {
        const teamPlayerArray = [];
        team.players.forEach(player => teamPlayerArray.push(player.name));
        namesArray.push(teamPlayerArray.join(', '));
      });
      if (namesList.length) {
        namesList = namesArray.join(' vs. ');
      }
      return namesList;
    },
    checkForTotalPlayers(run) {
      let amount = 0;
      run.teams.forEach(team => team.players.forEach(() => {
        amount += 1;
      }));
      return amount;
    },
  },
};
</script>

<style scoped>
  @import url('../../../_misc/components/FlexContainer.css');

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
