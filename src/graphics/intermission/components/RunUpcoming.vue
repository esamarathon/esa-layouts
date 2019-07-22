<template>
  <div
    v-if="data"
    class="RunUpcoming"
  >
    <div class="Header">
      Coming Up
      <span v-if="!when">
        Next
      </span>
      <span v-else>
        Later
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
        <span v-if="sc.checkForTotalPlayers(data) > 0">
          {{ sc.formPlayerNamesString(data) }}
        </span>
        <span v-if="data.estimate">
          EST: {{ data.estimate }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import SpeedcontrolUtil from 'speedcontrol-util';

const sc = new SpeedcontrolUtil(nodecg);

export default {
  name: 'RunUpcoming',
  props: {
    data: {
      type: Object,
      default() {
        return undefined;
      },
    },
    when: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sc,
    };
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
