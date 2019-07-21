<template>
  <div
    v-if="run"
    id="UpcomingRun"
    class="FlexContainer"
  >
    <div class="Line1">
      Coming up {{ when }}: {{ run.game }}
    </div>
    <div class="Line2">
      <span v-if="run.category">
        {{ run.category }}
      </span>
      <span v-if="run.system">
        ran on {{ run.system }}
      </span>
      <span v-if="sc.checkForTotalPlayers(run) > 0">
        with {{ sc.formPlayerNamesString(run) }}
      </span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';
import clone from 'clone';

// Stored outside of the export so it persists.
let nextRunsCache = [];

export default {
  name: 'UpcomingRun',
  props: {
    data: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      run: null,
      sc: Vue.prototype.$sc,
      when: '',
    };
  },
  created() {
    const fallback = setTimeout(() => this.$emit('end'), 5000);
    if (!nextRunsCache.length) {
      const nextRuns = this.sc.getNextRuns();

      // Skip if nothing to show.
      if (!nextRuns.length) {
        this.$emit('end');
        return;
      }

      nextRunsCache = nextRuns;
    }

    const randNum = Math.floor(Math.random() * nextRunsCache.length);
    this.run = clone(nextRunsCache[randNum]);
    if (this.run.scheduledS < (Date.now() / 1000)) {
      nextRunsCache.splice(randNum, 1);
      clearTimeout(fallback);
      this.$emit('end');
      return;
    }
    this.when = moment.unix(this.run.scheduledS).fromNow();
    nextRunsCache.splice(randNum, 1);
    clearTimeout(fallback);
    setTimeout(() => this.$emit('end'), 25 * 1000);
  },
};
</script>

<style scoped>
  @import url('../../../_misc/components/FlexContainer.css');

  #UpcomingRun {
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
