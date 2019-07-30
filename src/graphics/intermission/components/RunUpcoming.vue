<template>
  <div
    v-if="data"
    class="RunUpcoming"
  >
    <div class="Header">
      Coming Up
      <span v-if="!data.when">
        Next
      </span>
      <span v-else>
        {{ formETAUntilRun() }}
      </span>
    </div>
    <div class="Body">
      <div>
        {{ data.game }}
      </div>
      <div class="AdditionalDetails">
        <span v-if="data.category">
          {{ data.category }}
        </span>
        <span v-if="data.system">
          {{ data.system }}
        </span>
        <span v-if="checkForTotalPlayers(data) > 0">
          {{ formPlayerNamesString(data) }}
        </span>
        <span v-if="data.estimate">
          EST: {{ data.estimate }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'RunUpcoming',
  props: {
    data: {
      type: Object,
      default() {
        return undefined;
      },
    },
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
    formETAUntilRun() {
      const eta = moment.utc().second(0).to(moment.utc().second(this.data.when), true);
      return `In about ${eta}`;
    },
  },
};
</script>

<style>
  .RunUpcoming {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 199px;
    text-align: center;
  }

  .RunUpcoming > .Header {
    font-weight: 500;
    height: 60px;
    line-height: 60px;
    background-color: var(--border-colour);
    color: white;
    font-size: 41px;
    text-transform: uppercase;
  }

  .RunUpcoming > .Body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    font-size: 41px;
    background-color: rgba(0,0,0,0.3);
  }

  .AdditionalDetails {
    font-size: 30px;
  }

  .AdditionalDetails > span:not(:last-of-type)::after {
    content: '/';
  }
</style>
