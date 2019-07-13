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
      <span v-if="sc.checkForTotalPlayers(otherStreamInfo) > 0">
        with {{ sc.formPlayerNamesString(otherStreamInfo) }}
      </span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

const otherStreamInfo = nodecg.Replicant('otherStreamInfo');

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
      sc: Vue.prototype.$sc,
    };
  },
  created() {
    NodeCG.waitForReplicants(otherStreamInfo).then(() => {
      // Skip if nothing to show.
      if (!otherStreamInfo.value) {
        this.$emit('end');
      } else {
        this.otherStreamInfo = otherStreamInfo.value;
        setTimeout(() => this.$emit('end'), 25 * 1000);
      }
    });
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
